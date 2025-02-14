# pyright:reportPrivateUsage=false

from pathlib import Path
from typing import Iterable

import pytest
from blake3 import blake3

from invokeai.backend.model_hash.model_hash import HASHING_ALGORITHMS, MODEL_FILE_EXTENSIONS, ModelHash

test_cases: list[tuple[HASHING_ALGORITHMS, str]] = [
    ("md5", "md5:a0cd925fc063f98dbf029eee315060c3"),
    ("sha1", "sha1:9e362940e5603fdc60566ea100a288ba2fe48b8c"),
    ("sha256", "sha256:6dbdb6a147ad4d808455652bf5a10120161678395f6bfbd21eb6fe4e731aceeb"),
    (
        "sha512",
        "sha512:c4a10476b21e00042f638ad5755c561d91f2bb599d3504d25409495e1c7eda94543332a1a90fbb4efdaf9ee462c33e0336b5eae4acfb1fa0b186af452dd67dc6",
    ),
    ("blake3_multi", "blake3:ce3f0c5f3c05d119f4a5dcaf209b50d3149046a0d3a9adee9fed4c83cad6b4d0"),
    ("blake3_single", "blake3:ce3f0c5f3c05d119f4a5dcaf209b50d3149046a0d3a9adee9fed4c83cad6b4d0"),
]


@pytest.mark.parametrize("algorithm,expected_hash", test_cases)
def test_model_hash_hashes_file(tmp_path: Path, algorithm: HASHING_ALGORITHMS, expected_hash: str):
    file = Path(tmp_path / "test")
    file.write_text("model data")
    hash_ = ModelHash(algorithm).hash(file)
    assert hash_ == expected_hash


@pytest.mark.parametrize("algorithm", ["md5", "sha1", "sha256", "sha512", "blake3_multi", "blake3_single"])
def test_model_hash_hashes_dir(tmp_path: Path, algorithm: HASHING_ALGORITHMS):
    model_hash = ModelHash(algorithm)
    files = [Path(tmp_path, f"{i}.bin") for i in range(5)]

    for f in files:
        f.write_text("data")

    hash_ = model_hash.hash(tmp_path)

    # Manual implementation of composite hash - always uses BLAKE3
    component_hashes: list[str] = []
    for f in sorted(ModelHash._get_file_paths(tmp_path, ModelHash._default_file_filter)):
        component_hashes.append(model_hash._hash_file(f))

    composite_hasher = blake3()
    for h in component_hashes:
        composite_hasher.update(h.encode("utf-8"))

    assert hash_ == ModelHash._get_prefix(algorithm) + composite_hasher.hexdigest()


@pytest.mark.parametrize(
    "algorithm,expected_prefix",
    [
        ("md5", "md5:"),
        ("sha1", "sha1:"),
        ("sha256", "sha256:"),
        ("sha512", "sha512:"),
        ("blake3_multi", "blake3:"),
        ("blake3_single", "blake3:"),
    ],
)
def test_model_hash_gets_prefix(algorithm: HASHING_ALGORITHMS, expected_prefix: str):
    assert ModelHash._get_prefix(algorithm) == expected_prefix


def test_model_hash_blake3_matches_blake3_single(tmp_path: Path):
    model_hash = ModelHash("blake3_multi")
    model_hash_simple = ModelHash("blake3_single")

    file = tmp_path / "test.bin"
    file.write_text("model data")

    assert model_hash.hash(file) == model_hash_simple.hash(file)


def test_model_hash_random_algorithm(tmp_path: Path):
    model_hash = ModelHash("random")
    file = tmp_path / "test.bin"
    file.write_text("model data")

    assert model_hash.hash(file) != model_hash.hash(file)


def test_model_hash_raises_error_on_invalid_algorithm():
    with pytest.raises(ValueError, match="Algorithm invalid_algorithm not available"):
        ModelHash("invalid_algorithm")  # pyright: ignore [reportArgumentType]


def paths_to_str_set(paths: Iterable[Path]) -> set[str]:
    return {str(p) for p in paths}


def test_model_hash_filters_out_non_model_files(tmp_path: Path):
    model_files = {Path(tmp_path, f"{i}{ext}") for i, ext in enumerate(MODEL_FILE_EXTENSIONS)}

    for i, f in enumerate(model_files):
        f.write_text(f"data{i}")

    assert paths_to_str_set(ModelHash._get_file_paths(tmp_path, ModelHash._default_file_filter)) == paths_to_str_set(
        model_files
    )

    # Add file that should be ignored - hash should not change
    file = tmp_path / "test.icecream"
    file.write_text("data")

    assert paths_to_str_set(ModelHash._get_file_paths(tmp_path, ModelHash._default_file_filter)) == paths_to_str_set(
        model_files
    )

    # Add file that should not be ignored - hash should change
    file = tmp_path / "test.bin"
    file.write_text("more data")
    model_files.add(file)

    assert paths_to_str_set(ModelHash._get_file_paths(tmp_path, ModelHash._default_file_filter)) == paths_to_str_set(
        model_files
    )


def test_model_hash_uses_custom_filter(tmp_path: Path):
    model_files = {Path(tmp_path, f"file{ext}") for ext in [".pickme", ".ignoreme"]}

    for i, f in enumerate(model_files):
        f.write_text(f"data{i}")

    def file_filter(file_path: str) -> bool:
        return file_path.endswith(".pickme")

    assert {p.name for p in ModelHash._get_file_paths(tmp_path, file_filter)} == {"file.pickme"}
