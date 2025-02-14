import base64
import io
import os
import re
import unicodedata
from pathlib import Path

from PIL import Image


def slugify(value: str, allow_unicode: bool = False) -> str:
    """
    Convert to ASCII if 'allow_unicode' is False. Convert spaces or repeated
    dashes to single dashes. Remove characters that aren't alphanumerics,
    underscores, or hyphens. Replace slashes with underscores.
    Convert to lowercase. Also strip leading and
    trailing whitespace, dashes, and underscores.

    Adapted from Django: https://github.com/django/django/blob/main/django/utils/text.py
    """
    value = str(value)
    if allow_unicode:
        value = unicodedata.normalize("NFKC", value)
    else:
        value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    value = re.sub(r"[/]", "_", value.lower())
    value = re.sub(r"[^.\w\s-]", "", value.lower())
    return re.sub(r"[-\s]+", "-", value).strip("-_")


def safe_filename(directory: Path, value: str) -> str:
    """Make a string safe to use as a filename."""
    escaped_string = slugify(value)
    max_name_length = os.pathconf(directory, "PC_NAME_MAX") if hasattr(os, "pathconf") else 256
    return escaped_string[len(escaped_string) - max_name_length :]


def directory_size(directory: Path) -> int:
    """
    Return the aggregate size of all files in a directory (bytes).
    """
    sum = 0
    for root, dirs, files in os.walk(directory):
        for f in files:
            sum += Path(root, f).stat().st_size
        for d in dirs:
            sum += Path(root, d).stat().st_size
    return sum


def image_to_dataURL(image: Image.Image, image_format: str = "PNG") -> str:
    """
    Converts an image into a base64 image dataURL.
    """
    buffered = io.BytesIO()
    image.save(buffered, format=image_format)
    mime_type = Image.MIME.get(image_format.upper(), "image/" + image_format.lower())
    image_base64 = f"data:{mime_type};base64," + base64.b64encode(buffered.getvalue()).decode("UTF-8")
    return image_base64


class Chdir(object):
    """Context manager to chdir to desired directory and change back after context exits:
    Args:
        path (Path): The path to the cwd
    """

    def __init__(self, path: Path):
        self.path = path
        self.original = Path().absolute()

    def __enter__(self):
        os.chdir(self.path)

    def __exit__(self, *args):
        os.chdir(self.original)
