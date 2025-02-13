---
title: Home
---

<!--
  The Docs you find here (/docs/*) are built and deployed via mkdocs. If you want to run a local version to verify your changes, it's as simple as::

  ```bash
  pip install -r docs/requirements-mkdocs.txt
  mkdocs serve
  ```
-->

<div align="center" markdown>


[![project logo](assets/invoke_ai_banner.png)](https://github.com/invoke-ai/InvokeAI)

[![discord badge]][discord link]

[![latest release badge]][latest release link]
[![github stars badge]][github stars link]
[![github forks badge]][github forks link]

[![CI checks on main badge]][ci checks on main link]
[![CI checks on dev badge]][ci checks on dev link]
<!-- [![latest commit to dev badge]][latest commit to dev link] -->

[![github open issues badge]][github open issues link]
[![github open prs badge]][github open prs link]

[ci checks on dev badge]:
  https://flat.badgen.net/github/checks/invoke-ai/InvokeAI/development?label=CI%20status%20on%20dev&cache=900&icon=github
[ci checks on dev link]:
  https://github.com/invoke-ai/InvokeAI/actions?query=branch%3Adevelopment
[ci checks on main badge]:
  https://flat.badgen.net/github/checks/invoke-ai/InvokeAI/main?label=CI%20status%20on%20main&cache=900&icon=github
[ci checks on main link]:
  https://github.com/invoke-ai/InvokeAI/actions/workflows/test-invoke-conda.yml
[discord badge]: https://flat.badgen.net/discord/members/ZmtBAhwWhy?icon=discord
[discord link]: https://discord.gg/ZmtBAhwWhy
[github forks badge]:
  https://flat.badgen.net/github/forks/invoke-ai/InvokeAI?icon=github
[github forks link]:
  https://useful-forks.github.io/?repo=lstein%2Fstable-diffusion
[github open issues badge]:
  https://flat.badgen.net/github/open-issues/invoke-ai/InvokeAI?icon=github
[github open issues link]:
  https://github.com/invoke-ai/InvokeAI/issues?q=is%3Aissue+is%3Aopen
[github open prs badge]:
  https://flat.badgen.net/github/open-prs/invoke-ai/InvokeAI?icon=github
[github open prs link]:
  https://github.com/invoke-ai/InvokeAI/pulls?q=is%3Apr+is%3Aopen
[github stars badge]:
  https://flat.badgen.net/github/stars/invoke-ai/InvokeAI?icon=github
[github stars link]: https://github.com/invoke-ai/InvokeAI/stargazers
<!-- [latest commit to dev badge]:
  https://flat.badgen.net/github/last-commit/invoke-ai/InvokeAI/development?icon=github&color=yellow&label=last%20dev%20commit&cache=900
[latest commit to dev link]:
  https://github.com/invoke-ai/InvokeAI/commits/main -->
[latest release badge]:
  https://flat.badgen.net/github/release/invoke-ai/InvokeAI/development?icon=github
[latest release link]: https://github.com/invoke-ai/InvokeAI/releases

</div>

<a href="https://github.com/invoke-ai/InvokeAI">InvokeAI</a> is an
implementation of Stable Diffusion, the open source text-to-image and
image-to-image generator. It provides a streamlined process with various new
features and options to aid the image generation process. It runs on Windows,
Mac and Linux machines, and runs on GPU cards with as little as 4 GB of RAM.

**Quick links**: [<a href="https://discord.gg/ZmtBAhwWhy">Discord Server</a>]
[<a href="https://github.com/invoke-ai/InvokeAI/">Code and Downloads</a>] [<a
href="https://github.com/invoke-ai/InvokeAI/issues">Bug Reports</a>] [<a
href="https://github.com/invoke-ai/InvokeAI/discussions">Discussion, Ideas &
Q&A</a>]

<div align="center"><img src="assets/invoke-web-server-1.png" width=640></div>

!!! note

    This fork is rapidly evolving. Please use the [Issues tab](https://github.com/invoke-ai/InvokeAI/issues) to report bugs and make feature requests. Be sure to use the provided templates. They will help aid diagnose issues faster.

## :octicons-package-dependencies-24: Installation

This fork is supported across Linux, Windows and Macintosh. Linux users can use
either an Nvidia-based card (with CUDA support) or an AMD card (using the ROCm
driver).

### [Installation Getting Started Guide](installation)
#### **[Automated Installer](installation/010_INSTALL_AUTOMATED.md)**
✅ This is the recommended installation method for first-time users. 
#### [Manual Installation](installation/020_INSTALL_MANUAL.md)
This method is recommended for experienced users and developers
#### [Docker Installation](installation/040_INSTALL_DOCKER.md)
This method is recommended for those familiar with running Docker containers
### Other Installation Guides
  - [PyPatchMatch](installation/060_INSTALL_PATCHMATCH.md)
  - [XFormers](installation/070_INSTALL_XFORMERS.md)
  - [CUDA and ROCm Drivers](installation/030_INSTALL_CUDA_AND_ROCM.md)
  - [Installing New Models](installation/050_INSTALLING_MODELS.md)

## :fontawesome-solid-computer: Hardware Requirements

### :octicons-cpu-24: System

You wil need one of the following:

- :simple-nvidia: An NVIDIA-based graphics card with 4 GB or more VRAM memory.
- :simple-amd: An AMD-based graphics card with 4 GB or more VRAM memory (Linux
  only)
- :fontawesome-brands-apple: An Apple computer with an M1 chip.

We do **not recommend** the following video cards due to issues with their
running in half-precision mode and having insufficient VRAM to render 512x512
images in full-precision mode:

- NVIDIA 10xx series cards such as the 1080ti
- GTX 1650 series cards
- GTX 1660 series cards

### :fontawesome-solid-memory: Memory and Disk

- At least 12 GB Main Memory RAM.
- At least 18 GB of free disk space for the machine learning model, Python, and
  all its dependencies.


## :octicons-gift-24: InvokeAI Features

### The InvokeAI Web Interface
- [WebUI overview](features/WEB.md)
- [WebUI hotkey reference guide](features/WEBUIHOTKEYS.md)
- [WebUI Unified Canvas for Img2Img, inpainting and outpainting](features/UNIFIED_CANVAS.md)

<!-- separator -->

### Image Management
- [Image2Image](features/IMG2IMG.md)
- [Adding custom styles and subjects](features/CONCEPTS.md)
- [Upscaling and Face Reconstruction](features/POSTPROCESS.md)
- [Other Features](features/OTHER.md)

<!-- separator -->
### Model Management
- [Installing](installation/050_INSTALLING_MODELS.md)
- [Model Merging](features/MODEL_MERGING.md)
- [ControlNet Models](features/CONTROLNET.md)
- [Style/Subject Concepts and Embeddings](features/CONCEPTS.md)
- [Watermarking and the Not Safe for Work (NSFW) Checker](features/WATERMARK+NSFW.md)
<!-- seperator -->
### Prompt Engineering
- [Prompt Syntax](features/PROMPTS.md)
- [Generating Variations](features/VARIATIONS.md)

### InvokeAI Configuration
- [Guide to InvokeAI Runtime Settings](features/CONFIGURATION.md)

## :octicons-log-16: Important Changes Since Version 2.3

### Nodes

Behind the scenes, InvokeAI has been completely rewritten to support
"nodes," small unitary operations that can be combined into graphs to
form arbitrary workflows. For example, there is a prompt node that
processes the prompt string and feeds it to a text2latent node that
generates a latent image. The latents are then fed to a latent2image
node that translates the latent image into a PNG.

The WebGUI has a node editor that allows you to graphically design and
execute custom node graphs. The ability to save and load graphs is
still a work in progress, but coming soon.

### Command-Line Interface Retired

The original "invokeai" command-line interface has been retired. The
`invokeai` command will now launch a new command-line client that can
be used by developers to create and test nodes. It is not intended to
be used for routine image generation or manipulation.

To launch the Web GUI from the command-line, use the command
`invokeai-web` rather than the traditional `invokeai --web`.

### ControlNet

This version of InvokeAI features ControlNet, a system that allows you
to achieve exact poses for human and animal figures by providing a
model to follow. Full details are found in [ControlNet](features/CONTROLNET.md)

### New Schedulers

The list of schedulers has been completely revamped and brought up to date:

| **Short Name** | **Scheduler**                   | **Notes**                   |
|----------------|---------------------------------|-----------------------------|
| **ddim**       | DDIMScheduler                   |                             |
| **ddpm**       | DDPMScheduler                   |                             |
| **deis**       | DEISMultistepScheduler          |                             |
| **lms**        | LMSDiscreteScheduler            |                             |
| **pndm**       | PNDMScheduler                   |                             |
| **heun**       | HeunDiscreteScheduler           | original noise schedule     |
| **heun_k**     | HeunDiscreteScheduler           | using karras noise schedule |
| **euler**      | EulerDiscreteScheduler          | original noise schedule     |
| **euler_k**    | EulerDiscreteScheduler          | using karras noise schedule |
| **kdpm_2**     | KDPM2DiscreteScheduler          |                             |
| **kdpm_2_a**   | KDPM2AncestralDiscreteScheduler |                             |
| **dpmpp_2s**   | DPMSolverSinglestepScheduler    |                             |
| **dpmpp_2m**   | DPMSolverMultistepScheduler     | original noise scnedule     |
| **dpmpp_2m_k** | DPMSolverMultistepScheduler     | using karras noise schedule |
| **unipc**      | UniPCMultistepScheduler         | CPU only                    |

Please see [3.0.0 Release Notes](https://github.com/invoke-ai/InvokeAI/releases/tag/v3.0.0) for further details.

## :material-target: Troubleshooting

Please check out our **[:material-frequently-asked-questions:
Troubleshooting
Guide](installation/010_INSTALL_AUTOMATED.md#troubleshooting)** to
get solutions for common installation problems and other issues.

## :octicons-repo-push-24: Contributing

Anyone who wishes to contribute to this project, whether documentation,
features, bug fixes, code cleanup, testing, or code reviews, is very much
encouraged to do so. 

[Please take a look at our Contribution documentation to learn more about contributing to InvokeAI. 
](contributing/CONTRIBUTING.md)

## :octicons-person-24: Contributors

This fork is a combined effort of various people from across the world.
[Check out the list of all these amazing people](other/CONTRIBUTORS.md). We
thank them for their time, hard work and effort.

## :octicons-question-24: Support

For support, please use this repository's GitHub Issues tracking service. Feel
free to send me an email if you use and like the script.

Original portions of the software are Copyright (c) 2022-23
by [The InvokeAI Team](https://github.com/invoke-ai).

