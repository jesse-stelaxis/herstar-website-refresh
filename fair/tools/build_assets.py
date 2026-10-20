#!/usr/bin/env python3
"""Build every image, logo and video the Canton Fair kiosk ships with.

Sources are the client's raw folder `canton fair/` and the approved
`HOSUN_spreads_v4.pdf`, both at the repository root and both untracked
(1.1 GB). Outputs land in `fair/assets/` and are committed, so the site
itself never needs this script — run it only when the source material changes.

    python3 -m venv .venv && .venv/bin/pip install Pillow pillow-heif
    .venv/bin/python fair/tools/build_assets.py            # skips the film if it exists
    .venv/bin/python fair/tools/build_assets.py --film     # re-encode the film too
    .venv/bin/python fair/tools/build_precache.py          # always run afterwards

Needs `ffmpeg`, `pdfimages` and `pdftocairo` (Homebrew: ffmpeg, poppler).
"""
import argparse
import re
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageOps
import pillow_heif

pillow_heif.register_heif_opener()  # two of the factory photos are HEIC files named .jpg
Image.MAX_IMAGE_PIXELS = None

REPO = Path(__file__).resolve().parents[2]
SRC = REPO / "canton fair"
SPREADS = REPO / "HOSUN_spreads_v4.pdf"
OUT = REPO / "fair" / "assets"
FILM = SRC / "恒而思达中文版2026.m4v"

# ---- photography: full-bleed slides, 1920 px on the long edge --------------
PHOTOS = {
    "factory/stamping-robot": "工厂展厅现场照片/冲压机器人.png",
    "factory/welding-robot": "工厂展厅现场照片/焊接机器人.jpg",
    "factory/welding": "工厂展厅现场照片/焊接.jpg",
    "factory/machining": "工厂展厅现场照片/机加工.jpg",
    "factory/robot-arm-1": "工厂展厅现场照片/机械臂1.jpg",
    "factory/robot-arm-2": "工厂展厅现场照片/机械臂2.jpg",
    "factory/painting-line": "工厂展厅现场照片/喷涂线.JPG",
    "factory/painting": "工厂展厅现场照片/喷涂1.jpg",
    "factory/assembly-1": "工厂展厅现场照片/组装1.png",
    "factory/assembly-2": "工厂展厅现场照片/组转2.JPG",
    "factory/assembly-3": "工厂展厅现场照片/组装3.JPG",
    "factory/lifting-columns": "工厂展厅现场照片/立柱.jpg",
    "factory/c-arm-line": "工厂展厅现场照片/C-arm.JPG",
    "factory/imaging-system": "工厂展厅现场照片/影像设备.png",
    "factory/showroom-1": "工厂展厅现场照片/展厅1.JPG",
    "factory/showroom-2": "工厂展厅现场照片/展厅2.JPG",
    "factory/history-wall": "工厂展厅现场照片/发展历程.JPG",
    "factory/partner-wall": "工厂展厅现场照片/合作伙伴.JPG",
    "factory/team": "工厂展厅现场照片/门口合影.JPG",
    "factory/new-campus": "工厂展厅现场照片/新厂效果图.jpg",
    "factory/new-campus-2": "工厂展厅现场照片/新厂规划设计2.jpg",
    "factory/new-campus-3": "工厂展厅现场照片/新厂规划设计5.jpg",
}

# ---- stills from the 4K brand film -----------------------------------------
# (seconds, keep) — `keep` is the share of frame height kept from the top, so
# the burned-in bilingual subtitles (and the lower-left chapter labels) are cut.
FRAMES = {
    "film/sunrise": (4, 0.80),
    "film/home-care": (16, 0.82),
    "film/rnd": (48, 0.70),
    "film/precision": (52, 0.70),
    "film/robot": (56, 0.70),
    "film/assembly": (108, 0.82),
    "film/bed-studio-1": (120, 0.82),
    "film/bed-studio-2": (124, 0.82),
    "film/bed-studio-3": (128, 0.82),
    "film/c-arm": (136, 0.82),
    "film/xray-detector": (140, 0.82),
    "film/accessible-kitchen": (144, 0.82),
    "film/ankle-trainer": (148, 0.82),
}

# ---- product shots: mostly on white, 1200 px --------------------------------
P = "产品/"
D = P + "电动升降桌/升降桌系列/"
PRODUCTS = {
    # nursing beds
    "product/em-2001-a": P + "床/EM-2001 (1).jpg",
    "product/em-2001-b": P + "床/EM-2001 (2).jpg",
    "product/em-2002-a": P + "床/EM-2002.jpg",
    "product/em-2002-b": P + "床/EM-2002 (2).jpg",
    "product/em-3001-a": P + "床/EM-3001 (1).jpg",
    "product/em-3001-b": P + "床/EM-3001 (2).jpg",
    "product/em-3002-a": P + "床/EM-3002 (1).jpg",
    "product/em-3002-b": P + "床/EM-3002 (2).jpg",
    "product/em-3003-a": P + "床/EM-3003.jpg",
    "product/em-3003-b": P + "床/EM-3003 (2).jpg",
    "product/em-5001-a": P + "床/EM-5001.jpg",
    "product/em-5001-b": P + "床/EM-5001(2).jpg",
    "product/em-5002-a": P + "床/EM-5002.jpg",
    "product/em-5002-b": P + "床/EM-5002(2）.jpg",
    # powered rollator RW-01 (the folder names are the client's; the bed-named file is the rollator)
    "product/rollator": P + "助行器/74898422ee450650e3534d1771d44ea3.jpg",
    "product/rollator-b": P + "助行器/1.28 康佳乐款电动护理床1535.jpg",
    "product/rollator-folded": P + "助行器/折叠.jpg",
    "product/rollator-dims": P + "助行器/2 (2).jpg",
    "product/rollator-seat": P + "助行器/2 (1).jpg",
    "product/rollator-stop": P + "助行器/1234 (1).jpg",
    "product/rollator-straight": P + "助行器/1234 (2).jpg",
    "product/rollator-downhill": P + "助行器/1234 (3).jpg",
    "product/rollator-uphill": P + "助行器/1234 (4).jpg",
    # transfer & lifting
    "product/transfer-device": P + "中车移位机器/121.jpg",
    "product/transfer-device-b": P + "中车移位机器/图片_副本.jpg",
    "product/transfer-device-views": P + "中车移位机器/康复助站设备三视图展示.png",
    "product/hoist": P + "升降式移位机/吊装移位机.jpg",
    "product/hoist-room": P + "升降式移位机/图片生成与修改 (1).png",
    "product/hoist-b": P + "升降式移位机/图片生成与修改.png",
    # bath & toilet
    "product/bath-lift-a": P + "升降洗澡椅/1 (2).jpg",
    "product/bath-lift-b": P + "升降洗澡椅/1 (1).jpg",
    "product/bath-lift-c": P + "升降洗澡椅/1 (3).jpg",
    "product/bath-lift-views": P + "升降洗澡椅/123.jpg",
    "product/toilet-lift": P + "升降马桶椅/Gemini_Generated_Image_tkc1ootkc1ootkc1.jpg",
    "product/toilet-lift-b": P + "升降马桶椅/Gemini_Generated_Image_uwzhrxuwzhrxuwzh.jpg",
    "product/shower-chair": P + "洗澡椅/洗澡1椅 - 副本_副本.png",
    "product/shower-chair-scene": P + "洗澡椅/1234.jpg",
    "product/shower-chair-dims": P + "洗澡椅/Gemini_Generated_Image_2wka212wka212wka_副本.jpg",
    "product/basin-scene": P + "电动升降洗手台盆/1 (1).jpg",
    "product/basin-views": P + "电动升降洗手台盆/1 (2).jpg",
    "product/basin-models": P + "电动升降洗手台盆/1 (3).jpg",
    # accessible kitchen & home
    "product/sink": P + "电动升降水槽/1.jpg",
    "product/sink-kitchen": P + "电动升降水槽/轮椅车轮清洗机RM2作业流程与效益对比.png",
    "product/hob": P + "电动升降灶具/升降灶具.jpg",
    "product/hob-b": P + "电动升降灶具/轮椅车轮清洗机RM2作业流程与效益对比 (1).png",
    "product/cabinet-lift": P + "升降橱柜/电动升降厨柜.jpg",
    "product/cabinet-lift-spices": P + "升降橱柜/5034e75eea2cd37ae0b0c10610235982.jpg",
    "product/cabinet-lift-glass": P + "升降橱柜/WPS图片.png",
    "product/cabinet-lift-photo": P + "升降橱柜/微信图片_20250606134738.jpg",
    "product/wardrobe-rail": P + "升降衣杆/sg-11134207-7rdws-md19pdd029u634_副本.jpg",
    "product/wardrobe-scene-1": P + "升降衣杆/WPS图片(1).png",
    "product/wardrobe-scene-2": P + "升降衣杆/WPS图片.png",
    # rehab & facility
    "product/ankle-a": P + "踝关节康复训练器/1 (1).jpg",
    "product/ankle-b": P + "踝关节康复训练器/1 (2).jpg",
    "product/ankle-c": P + "踝关节康复训练器/1 (3).jpg",
    "product/ankle-d": P + "踝关节康复训练器/1 (4).jpg",
    "product/ankle-scene": P + "踝关节康复训练器/ScreenShot_2026-10-16_162502_942.png",
    "product/wheel-washer": P + "轮椅清洗机/567.jpg",
    "product/wheel-washer-b": P + "轮椅清洗机/23.jpg",
    "product/wheel-washer-c": P + "轮椅清洗机/345.jpg",
    # desks & tables
    "product/desk-office-dual": D + "2..png",
    "product/desk-office-dual-b": D + "2-2.png",
    "product/desk-office-wood": D + "3.jpg",
    "product/desk-office-wood-views": D + "3-2.jpg",
    "product/desk-coffee": D + "1.jpg",
    "product/desk-coffee-views": D + "1-1.jpg",
    "product/desk-four-leg": D + "5.png",
    "product/desk-four-leg-views": D + "5.jpg",
    "product/desk-executive": D + "升降经理桌.png",
    "product/desk-gaming": D + "4 (1).jpg",
    "product/desk-gaming-views": D + "4 (2).jpg",
    "product/desk-student": D + "7 (2).png",
    "product/desk-student-views": D + "7 (1).png",
    "product/desk-health": D + "智能检测桌.png",
    "product/table-tilting": D + "6 (1).jpg",
    "product/table-tilting-views": D + "6 (2).jpg",
    "product/table-pneumatic": D + "气动1 (1).jpg",
    "product/table-angled": D + "气动1 (2).jpg",
    "product/table-side": D + "气动1 (3).jpg",
    "product/table-side-round": D + "气动1 (4).jpg",
    "product/table-overbed": D + "气动1 (5).jpg",
}

# ---- certificate scans (first page only) -----------------------------------
CERTS = {
    "cert/iso-13485": "认证/ISO 13485_01.png",
    "cert/iso-9001": "认证/ISO 9001_01.png",
    "cert/iatf-16949": "认证/IATF 16949_01.png",
    "cert/iso-14001": "认证/ISO 14001_01.png",
    "cert/fcc-sdoc": "认证/FCC_01.png",
}

# ---- partner logos from the approved spread --------------------------------
# pdfimages index of (image, soft mask or None) on page 1 of HOSUN_spreads_v4.pdf
PARTNERS = {
    "daikin": (35, 36), "toyota": (43, 44), "viessmann": (37, 38), "bmw": (39, 40),
    "zf": (41, 42), "philips": (9, 10), "siemens": (11, 12), "maquet": (13, 14),
    "carestream": (15, 16), "arjo": (19, None), "paramount-bed": (20, 21),
    "barco": (17, 18), "vishee": (22, None), "kessebohmer": (23, 24),
    "dewertokin": (25, 26), "linak": (27, None), "suzhou-health": (28, 29),
    "genertec": (30, 31), "taikang": (32, None), "hubei-health": (33, 34),
}

# ---- brand marks, vector, from the two VI manuals --------------------------
# (pdf, page, viewBox in PDF points measured off a 72 dpi render)
BRAND = {
    "hosun": ("物料/恒升vi.pdf", 7, "455 301 390 180"),
    "hosun-mark": ("物料/恒升vi.pdf", 7, "455 301 160 180"),
    "herstar": ("物料/恒而思达vi20230424.pdf", 5, "1017 312 533 204"),
}


def save_webp(im, dest, quality):
    dest.parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "WEBP", quality=quality, method=6)
    return dest


def load(path, background=(255, 255, 255)):
    im = ImageOps.exif_transpose(Image.open(path))
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        flat = Image.new("RGB", im.size, background)
        flat.paste(im, mask=im.getchannel("A"))
        return flat
    return im.convert("RGB")


def fit(im, long_edge):
    im = im.copy()
    im.thumbnail((long_edge, long_edge), Image.LANCZOS)
    return im


def build_rasters():
    for name, rel in PHOTOS.items():
        save_webp(fit(load(SRC / rel), 1920), OUT / "img" / f"{name}.webp", 76)
    for name, rel in PRODUCTS.items():
        save_webp(fit(load(SRC / rel), 1200), OUT / "img" / f"{name}.webp", 80)
    for name, rel in CERTS.items():
        im = load(SRC / rel)
        im.thumbnail((1200, 1700), Image.LANCZOS)
        save_webp(im, OUT / "img" / f"{name}.webp", 74)
    print(f"rasters: {len(PHOTOS)} photos, {len(PRODUCTS)} products, {len(CERTS)} certificates")


def build_frames(tmp):
    for name, (t, keep) in FRAMES.items():
        raw = tmp / f"{name.replace('/', '-')}.png"
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", str(t), "-i", FILM,
                        "-frames:v", "1", raw], check=True)
        im = Image.open(raw).convert("RGB")
        im = im.crop((0, 0, im.width, round(im.height * keep)))
        save_webp(fit(im, 1920), OUT / "img" / f"{name}.webp", 78)
    print(f"film stills: {len(FRAMES)}")


def build_partners(tmp):
    """Each logo becomes a one-colour alpha mask, so CSS can tint it per skin."""
    subprocess.run(["pdfimages", "-f", "1", "-l", "1", "-png", SPREADS, tmp / "s"], check=True)
    dest_dir = OUT / "logos"
    dest_dir.mkdir(parents=True, exist_ok=True)
    for name, (img_i, mask_i) in PARTNERS.items():
        art = Image.open(tmp / f"s-{img_i:03d}.png").convert("RGB")
        alpha = Image.open(tmp / f"s-{mask_i:03d}.png").convert("L") if mask_i is not None else None
        # composite onto white exactly as the PDF renders it, then read ink as darkness
        white = Image.new("RGB", art.size, (255, 255, 255))
        shown = Image.composite(art, white, alpha) if alpha else art
        ink = ImageOps.invert(shown.convert("L"))
        top = max(ink.getextrema()[1], 1)  # grey logos stretch to full opacity
        ink = ink.point(lambda v, top=top: 0 if v < 18 else min(255, round(255 * (v / top) ** 0.7)))
        box = ink.getbbox()
        ink = ink.crop(box)
        ink.thumbnail((640, 180), Image.LANCZOS)
        mask = Image.new("LA", ink.size, 0)
        mask.putalpha(ink)
        mask.save(dest_dir / f"{name}.png", optimize=True)
    print(f"partner logos: {len(PARTNERS)}")


INK = re.compile(r'fill="rgb\((1[0-9]|2[0-9])\.\d+%, (\d|1\d|2\d)\.\d+%, (\d|1\d|2\d)\.\d+%\)"')


def build_brand(tmp):
    dest_dir = OUT / "logos"
    for name, (rel, page, box) in BRAND.items():
        svg = tmp / f"{name}.svg"
        subprocess.run(["pdftocairo", "-svg", "-f", str(page), "-l", str(page), SRC / rel, svg],
                       check=True, stderr=subprocess.DEVNULL)
        text = svg.read_text()
        w, h = box.split()[2:]
        text = re.sub(r'<svg ([^>]*?)width="[^"]*" height="[^"]*" viewBox="[^"]*"',
                      lambda m: f'<svg {m.group(1)}width="{w}" height="{h}" viewBox="{box}"',
                      text, count=1)
        # the manual's page background is a white rectangle — drop it so the mark sits on any ground
        text = text.replace('fill="rgb(100%, 100%, 100%)"', 'fill="none"')
        (dest_dir / f"{name}.svg").write_text(text)
        # a bone-white variant for the night skin: only the near-black ink changes, the sun keeps its gradient
        (dest_dir / f"{name}-light.svg").write_text(re.sub(INK, 'fill="#f3ece2"', text))
    print(f"brand marks: {len(BRAND)} × dark + light")


def build_icons(tmp):
    """Home-screen icons: the H mark on the cover's peach, rendered from the VI manual."""
    rel, page, box = BRAND["hosun-mark"]
    x, y, w, h = (float(v) for v in box.split())
    raw = tmp / "mark"
    subprocess.run(["pdftocairo", "-png", "-singlefile", "-r", "400", "-f", str(page), "-l", str(page),
                    "-x", str(round(x * 400 / 72)), "-y", str(round(y * 400 / 72)),
                    "-W", str(round(w * 400 / 72)), "-H", str(round(h * 400 / 72)), SRC / rel, raw], check=True)
    mark = Image.open(f"{raw}.png").convert("RGB")
    dest_dir = OUT / "icons"
    dest_dir.mkdir(parents=True, exist_ok=True)
    for size in (512, 192, 180):
        ground = Image.new("RGB", (size, size), (247, 226, 193))
        m = mark.copy()
        m.thumbnail((round(size * 0.62), round(size * 0.62)), Image.LANCZOS)
        # the manual's page is white; key it out against the peach ground
        alpha = ImageOps.invert(m.convert("L")).point(lambda v: min(255, v * 3))
        ground.paste(m, ((size - m.width) // 2, (size - m.height) // 2), alpha)
        ground.save(dest_dir / f"icon-{size}.png", optimize=True)
    print("icons: 3")


def build_film():
    dest = OUT / "video" / "film-1080.mp4"
    dest.parent.mkdir(parents=True, exist_ok=True)
    # H.264 high profile, so every tablet browser plays it; capped so the whole
    # film stays near 60 MB inside the offline cache
    subprocess.run([
        "ffmpeg", "-loglevel", "error", "-y", "-i", FILM,
        "-vf", "scale=1920:-2:flags=lanczos", "-c:v", "libx264", "-preset", "slow",
        "-crf", "24", "-maxrate", "3000k", "-bufsize", "6000k", "-profile:v", "high",
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart", dest,
    ], check=True)
    print(f"film: {dest.stat().st_size / 1e6:.1f} MB")


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--film", action="store_true", help="re-encode the brand film")
    parser.add_argument("--logos-only", action="store_true", help="rebuild partner logos and brand marks only")
    args = parser.parse_args()
    missing = [p for p in (SRC, SPREADS, FILM) if not p.exists()]
    if missing:
        sys.exit(f"missing source material: {', '.join(map(str, missing))}")
    with tempfile.TemporaryDirectory() as tmp:
        tmp = Path(tmp)
        if args.logos_only:
            build_partners(tmp)
            build_brand(tmp)
            build_icons(tmp)
            return
        build_rasters()
        build_frames(tmp)
        build_partners(tmp)
        build_brand(tmp)
        build_icons(tmp)
    if args.film or not (OUT / "video" / "film-1080.mp4").exists():
        build_film()


if __name__ == "__main__":
    main()
