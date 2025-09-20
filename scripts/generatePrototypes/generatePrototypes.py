import argparse
import base64
import datetime as _dt
import os
import random
from pathlib import Path
from typing import Any, Optional

import requests

# OpenAI API key should be provided via environment variable OPENAI_API_KEY

# Hard-coded defaults
DEFAULT_PROMPT = (
    "未来感的桌面毫米波雷达罩设计渲染图。整体外形近似圆形、圆锥形或蛋型。材质为白色。整体造型带有指向性，给人高科技感、未来感。"
)
DEFAULT_PROMPTS = [
    DEFAULT_PROMPT,
    "Futuristic minimalist radar cover, resembling a medical-grade device. Smooth matte-white ceramic-like finish, rounded seamless geometry, egg-shaped with directional orientation, mounted on a slim tripod. Clean, pure, precise aesthetic with no visible screws or seams.",
    "Compact radar cover with Japanese minimalist home appliance style. White smooth body with subtle wood accents, softly conical or egg-shaped with directional orientation, placed on a small tripod stand. Designed to harmonize with modern home interiors, blending technology and lifestyle.",
    "Futuristic cyber-inspired radar cover, sleek glossy white finish with subtle dark translucent panel for directional focus. Geometric egg-cone hybrid shape, minimal seams, mounted on a futuristic tripod stand. High-tech aesthetic, emphasizing advanced sensing and cutting-edge design.",
    "Nordic minimalist radar cover, matte-white body with soft rounded geometry, egg-like form with directional orientation. Supported by a light wooden tripod, warm and elegant. Design merges Scandinavian furniture style with subtle futuristic technology."
]
DEFAULT_NUM_IMAGES = 10
DEFAULT_SIZE = "1024x1024"

def _slugify(text: str) -> str:
    keep = [c if c.isalnum() else "_" for c in text.strip()]
    slug = "".join(keep)
    while "__" in slug:
        slug = slug.replace("__", "_")
    return slug.strip("_")[:60] or "prompt"


# Randomization modifiers for diversity
RANDOM_STYLES = [
    "中国宋代审美风格", "赛博未来风格", "北欧家居风格", "医疗器械风格", "工业设计风格", "科幻概念风格","日系家电风格"
]
RANDOM_LIGHTING = [
    "柔和漫射光", "侧向光", "冷色调环境光", "暖色调夕阳光", "高对比工作室灯光", "HDR 渲染光效",
]
RANDOM_CAMERA = [
    "45 度俯视角", "正面视角", "微距特写", "等距视图", "三点透视", "产品级干净背景",
]
RANDOM_MATERIALS = [
    "磨砂陶瓷质感", "高光抛光表面", "细腻砂面", "哑光工程塑料", "类玻璃微透材质",
]
RANDOM_PALETTES = [
    "纯白与浅灰配色", "白色与银色配色", "白色与木质点缀", "白色与冷蓝细节", "白色与暖金细节",
]

# 支撑方式随机集（加入三脚架/可拆卸底座等）
RANDOM_SUPPORTS = [
    "三脚架支撑",
    "可拆卸底座",
    "磁吸可拆卸底座",
    "低矮圆盘底座",
    "可折叠三脚架",
]

# 场景随机集（工作、学习、静坐、瑜伽等）
RANDOM_SCENES = [
    "在办公桌上使用的场景",
    "在学习书桌旁的场景",
    "在客厅静坐冥想的场景",
    "在瑜伽垫上练习的场景",
    "在会议室桌面办公的场景",
    "在咖啡馆桌面使用的场景",
]

def _augment_prompt(base_prompt: str, rng: random.Random) -> tuple[str, str]:
    style = rng.choice(RANDOM_STYLES)
    lighting = rng.choice(RANDOM_LIGHTING)
    camera = rng.choice(RANDOM_CAMERA)
    material = rng.choice(RANDOM_MATERIALS)
    palette = rng.choice(RANDOM_PALETTES)
    support = rng.choice(RANDOM_SUPPORTS)
    scene = rng.choice(RANDOM_SCENES)
    extras = f"场景: {scene}；风格: {style}；灯光: {lighting}；相机: {camera}；材质: {material}；配色: {palette}；支撑: {support}."
    augmented = f"{base_prompt} {extras} 高质量产品渲染，8k，干净背景，真实比例。"
    short = _slugify(f"{style}_{scene}_{support}_{camera}_{palette}")
    return augmented, short

def _parse_size(size: str) -> tuple[int, int]:
    try:
        width_str, height_str = size.lower().split("x", 1)
        width = int(width_str)
        height = int(height_str)
        if width <= 0 or height <= 0:
            raise ValueError
        return width, height
    except Exception as exc:  # noqa: BLE001
        raise ValueError(
            f"Invalid size '{size}'. Expected format like '1024x1024'."
        ) from exc

def generate_images_with_openai(
    prompt: str = DEFAULT_PROMPT,
    number_of_images: int = DEFAULT_NUM_IMAGES,
    size: str = DEFAULT_SIZE,
    openai_api_key: Optional[str] = None,
    output_dir: Optional[Path] = None,
    randomize: bool = True,
    seed: Optional[int] = None,
) -> list[Path]:
    if not openai_api_key:
        openai_api_key = os.getenv("OPENAI_API_KEY") or os.getenv("OPENAI_KEY")
    if not openai_api_key:
        raise RuntimeError("OpenAI API key not set. Provide --openai-key or set OPENAI_API_KEY/OPENAI_KEY.")

    width, height = _parse_size(size)
    size_str = f"{width}x{height}"

    # Lazy import of OpenAI SDK to avoid hard dependency during linting
    from openai import OpenAI  # type: ignore

    client = OpenAI(api_key=openai_api_key)

    rng = random.Random(seed)

    # Prepare output directory early so the saver closure can use it
    timestamp = _dt.datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = Path(output_dir or Path("outputs") / f"openai_{timestamp}")
    out_dir.mkdir(parents=True, exist_ok=True)

    saved_paths: list[Path] = []

    def _save_items(items: list[Any], prefix: str = "image") -> None:
        for idx, item in enumerate(items, start=1):
            out_path = out_dir / f"{prefix}_{idx:02d}.png"
            b64 = getattr(item, "b64_json", None) if hasattr(item, "b64_json") else None
            url = getattr(item, "url", None) if hasattr(item, "url") else None
            if isinstance(item, dict):
                b64 = b64 or item.get("b64_json")
                url = url or item.get("url")
            if b64:
                out_path.write_bytes(base64.b64decode(b64))
            elif url:
                resp2 = requests.get(url, timeout=120)
                resp2.raise_for_status()
                out_path.write_bytes(resp2.content)
            else:
                continue
            saved_paths.append(out_path)

    # When randomize is on, create one image per request with augmented prompts
    if randomize:
        style_choices = ["vivid", "natural"]
        for i in range(number_of_images):
            aug_prompt, short = _augment_prompt(prompt, rng)
            try:
                resp = client.images.generate(
                    model="gpt-image-1",
                    prompt=aug_prompt,
                    size=size_str,
                    style=rng.choice(style_choices),
                )
            except Exception:
                resp = client.images.generate(model="gpt-image-1", prompt=aug_prompt, size=size_str)
            data_items = list(getattr(resp, "data", []) or [])
            if not data_items:
                continue
            prefix = f"image_{i+1:02d}_{short}"
            _save_items(data_items, prefix=prefix)
    else:
        # Prefer batch generation with n; fall back to per-image calls if unsupported
        data_items = []
        try:
            resp = client.images.generate(
                model="gpt-image-1",
                prompt=prompt,
                size=size_str,
                n=number_of_images,
            )
            data_items = list(getattr(resp, "data", []) or [])
        except Exception:
            for _ in range(number_of_images):
                r = client.images.generate(model="gpt-image-1", prompt=prompt, size=size_str)
                data_items.extend(getattr(r, "data", []) or [])
        if not data_items:
            raise RuntimeError("No images returned by OpenAI.")
        _save_items(data_items)

    return saved_paths


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate images using OpenAI ChatGPT (gpt-image-1)")
    parser.add_argument("--num", "-n", type=int, default=DEFAULT_NUM_IMAGES, help="Number of images to generate")
    parser.add_argument("--size", type=str, default=DEFAULT_SIZE, help="Image size, e.g. 512x512, 768x768, 1024x1024")
    parser.add_argument("--out", type=Path, default=None, help="Output directory (will be created if missing)")
    parser.add_argument(
        "--prompt",
        type=str,
        default=DEFAULT_PROMPT,
        help="Prompt text (defaults to the hard-coded meditation prompt)",
    )
    parser.add_argument("--openai-key", dest="openai_key", type=str, default=None, help="OpenAI API key (or set OPENAI_API_KEY)")
    parser.add_argument("--no-random", dest="randomize", action="store_false", help="Disable random prompt augmentation for diversity")
    parser.add_argument("--seed", type=int, default=None, help="Optional RNG seed for reproducible randomness")
    parser.set_defaults(randomize=True)

    args = parser.parse_args()

    def _slugify(text: str) -> str:
        keep = [c if c.isalnum() else "_" for c in text.strip()]
        slug = "".join(keep)
        while "__" in slug:
            slug = slug.replace("__", "_")
        return slug.strip("_")[:60] or "prompt"

    # Compute a single base output directory timestamp once
    timestamp = _dt.datetime.now().strftime("%Y%m%d_%H%M%S")
    base_out = Path(args.out or Path("outputs") / f"openai_{timestamp}")
    base_out.mkdir(parents=True, exist_ok=True)

    prompts: list[str] = DEFAULT_PROMPTS if args.prompt == DEFAULT_PROMPT else [args.prompt]

    all_saved: list[Path] = []
    for idx, pr in enumerate(prompts, start=1):
        subdir = base_out / f"{idx:02d}_{_slugify(pr)}"
        subdir.mkdir(parents=True, exist_ok=True)
        saved = generate_images_with_openai(
            prompt=pr,
            number_of_images=args.num,
            size=args.size,
            openai_api_key=args.openai_key,
            output_dir=subdir,
            randomize=args.randomize,
            seed=args.seed,
        )
        for p in saved:
            all_saved.append(p)

    print("Saved:")
    for p in all_saved:
        print(f" - {p}")


if __name__ == "__main__":
    main()