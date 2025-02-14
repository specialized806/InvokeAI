"""Adapted from https://github.com/huggingface/controlnet_aux (Apache-2.0 license)."""

import pathlib

import cv2
import huggingface_hub
import numpy as np
import torch
import torch.nn as nn
from einops import rearrange
from huggingface_hub import hf_hub_download
from PIL import Image

from invokeai.backend.image_util.util import (
    normalize_image_channel_count,
    np_to_pil,
    pil_to_np,
    resize_image_to_resolution,
)
from invokeai.backend.model_manager.load.model_cache.utils import get_effective_device


class ResidualBlock(nn.Module):
    def __init__(self, in_features):
        super(ResidualBlock, self).__init__()

        conv_block = [
            nn.ReflectionPad2d(1),
            nn.Conv2d(in_features, in_features, 3),
            nn.InstanceNorm2d(in_features),
            nn.ReLU(inplace=True),
            nn.ReflectionPad2d(1),
            nn.Conv2d(in_features, in_features, 3),
            nn.InstanceNorm2d(in_features),
        ]

        self.conv_block = nn.Sequential(*conv_block)

    def forward(self, x):
        return x + self.conv_block(x)


class Generator(nn.Module):
    def __init__(self, input_nc, output_nc, n_residual_blocks=9, sigmoid=True):
        super(Generator, self).__init__()

        # Initial convolution block
        model0 = [nn.ReflectionPad2d(3), nn.Conv2d(input_nc, 64, 7), nn.InstanceNorm2d(64), nn.ReLU(inplace=True)]
        self.model0 = nn.Sequential(*model0)

        # Downsampling
        model1 = []
        in_features = 64
        out_features = in_features * 2
        for _ in range(2):
            model1 += [
                nn.Conv2d(in_features, out_features, 3, stride=2, padding=1),
                nn.InstanceNorm2d(out_features),
                nn.ReLU(inplace=True),
            ]
            in_features = out_features
            out_features = in_features * 2
        self.model1 = nn.Sequential(*model1)

        model2 = []
        # Residual blocks
        for _ in range(n_residual_blocks):
            model2 += [ResidualBlock(in_features)]
        self.model2 = nn.Sequential(*model2)

        # Upsampling
        model3 = []
        out_features = in_features // 2
        for _ in range(2):
            model3 += [
                nn.ConvTranspose2d(in_features, out_features, 3, stride=2, padding=1, output_padding=1),
                nn.InstanceNorm2d(out_features),
                nn.ReLU(inplace=True),
            ]
            in_features = out_features
            out_features = in_features // 2
        self.model3 = nn.Sequential(*model3)

        # Output layer
        model4 = [nn.ReflectionPad2d(3), nn.Conv2d(64, output_nc, 7)]
        if sigmoid:
            model4 += [nn.Sigmoid()]

        self.model4 = nn.Sequential(*model4)

    def forward(self, x, cond=None):
        out = self.model0(x)
        out = self.model1(out)
        out = self.model2(out)
        out = self.model3(out)
        out = self.model4(out)

        return out


class LineartProcessor:
    """Processor for lineart detection."""

    def __init__(self):
        model_path = hf_hub_download("lllyasviel/Annotators", "sk_model.pth")
        self.model = Generator(3, 1, 3)
        self.model.load_state_dict(torch.load(model_path, map_location=torch.device("cpu")))
        self.model.eval()

        coarse_model_path = hf_hub_download("lllyasviel/Annotators", "sk_model2.pth")
        self.model_coarse = Generator(3, 1, 3)
        self.model_coarse.load_state_dict(torch.load(coarse_model_path, map_location=torch.device("cpu")))
        self.model_coarse.eval()

    def to(self, device: torch.device):
        self.model.to(device)
        self.model_coarse.to(device)
        return self

    def run(
        self, input_image: Image.Image, coarse: bool = False, detect_resolution: int = 512, image_resolution: int = 512
    ) -> Image.Image:
        """Processes an image to detect lineart.

        Args:
            input_image: The input image.
            coarse: Whether to use the coarse model.
            detect_resolution: The resolution to fit the image to before edge detection.
            image_resolution: The resolution of the output image.

        Returns:
            The detected lineart.
        """
        device = get_effective_device(self.model)

        np_image = pil_to_np(input_image)
        np_image = normalize_image_channel_count(np_image)
        np_image = resize_image_to_resolution(np_image, detect_resolution)

        model = self.model_coarse if coarse else self.model
        assert np_image.ndim == 3
        image = np_image
        with torch.no_grad():
            image = torch.from_numpy(image).float().to(device)
            image = image / 255.0
            image = rearrange(image, "h w c -> 1 c h w")
            line = model(image)[0][0]

            line = line.cpu().numpy()
            line = (line * 255.0).clip(0, 255).astype(np.uint8)

        detected_map = line

        detected_map = normalize_image_channel_count(detected_map)

        img = resize_image_to_resolution(np_image, image_resolution)
        H, W, C = img.shape

        detected_map = cv2.resize(detected_map, (W, H), interpolation=cv2.INTER_LINEAR)
        detected_map = 255 - detected_map

        return np_to_pil(detected_map)


class LineartEdgeDetector:
    """Simple wrapper around the fine and coarse lineart models for detecting edges in an image."""

    hf_repo_id = "lllyasviel/Annotators"
    hf_filename_fine = "sk_model.pth"
    hf_filename_coarse = "sk_model2.pth"

    @classmethod
    def get_model_url(cls, coarse: bool = False) -> str:
        """Get the URL to download the model from the Hugging Face Hub."""
        if coarse:
            return huggingface_hub.hf_hub_url(cls.hf_repo_id, cls.hf_filename_coarse)
        else:
            return huggingface_hub.hf_hub_url(cls.hf_repo_id, cls.hf_filename_fine)

    @classmethod
    def load_model(cls, model_path: pathlib.Path) -> Generator:
        """Load the model from a file."""
        model = Generator(3, 1, 3)
        model.load_state_dict(torch.load(model_path, map_location="cpu"))
        model.float().eval()
        return model

    def __init__(self, model: Generator) -> None:
        self.model = model

    def to(self, device: torch.device):
        self.model.to(device)
        return self

    def run(self, image: Image.Image) -> Image.Image:
        """Detects edges in the input image with the selected lineart model.

        Args:
            input: The input image.
            coarse: Whether to use the coarse model.

        Returns:
            The detected edges.
        """
        device = get_effective_device(self.model)

        np_image = pil_to_np(image)

        with torch.no_grad():
            np_image = torch.from_numpy(np_image).float().to(device)
            np_image = np_image / 255.0
            np_image = rearrange(np_image, "h w c -> 1 c h w")
            line = self.model(np_image)[0][0]

            line = line.cpu().numpy()
            line = (line * 255.0).clip(0, 255).astype(np.uint8)

        detected_map = 255 - line

        # The lineart model often outputs a lot of almost-black noise. SD1.5 ControlNets seem to be OK with this, but
        # SDXL ControlNets are not - they need a cleaner map. 12 was experimentally determined to be a good threshold,
        # eliminating all the noise while keeping the actual edges. Other approaches to thresholding may be better,
        # for example stretching the contrast or removing noise.
        detected_map[detected_map < 12] = 0

        output = np_to_pil(detected_map)

        return output
