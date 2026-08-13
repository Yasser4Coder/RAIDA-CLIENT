from PIL import Image
import numpy as np
from pathlib import Path

public = Path(r"c:\Users\ARES\Desktop\raida\client\public")
white_path = public / "RAIDA LOGO  FOR WHITE BGS.png"
dark_path = public / "RAIDA LOGO  FOR DARK BGS.png"


def remove_bg(im: Image.Image, mode: str = "white", thresh: int = 8) -> Image.Image:
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    if mode == "white":
        mask = (
            (rgb[:, :, 0] >= 255 - thresh)
            & (rgb[:, :, 1] >= 255 - thresh)
            & (rgb[:, :, 2] >= 255 - thresh)
        )
    else:
        mask = (rgb[:, :, 0] <= thresh) & (rgb[:, :, 1] <= thresh) & (rgb[:, :, 2] <= thresh)
    arr[:, :, 3] = np.where(mask, 0, 255)
    arr[:, :, :3] = np.where(mask[:, :, None], 0, arr[:, :, :3])
    return Image.fromarray(arr, "RGBA")


def content_bbox(im: Image.Image, pad: int = 8):
    arr = np.array(im)
    alpha = arr[:, :, 3]
    ys, xs = np.where(alpha > 10)
    if len(xs) == 0:
        return (0, 0, im.width, im.height)
    l, r = int(xs.min()), int(xs.max())
    t, b = int(ys.min()), int(ys.max())
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width - 1, r + pad)
    b = min(im.height - 1, b + pad)
    return (l, t, r + 1, b + 1)


def extract_silhouette_icon(im: Image.Image) -> Image.Image:
    arr = np.array(im)
    rgb = arr[:, :, :3].astype(np.int16)
    a = arr[:, :, 3]
    r, g, b = rgb[:, :, 0], rgb[:, :, 1], rgb[:, :, 2]
    pink = (a > 10) & (r > 180) & (g < 80) & (b > 80) & (r > g + 80)
    ys, xs = np.where(pink)
    if len(xs) == 0:
        raise SystemExit("no pink found")

    row_counts = pink.sum(axis=1)
    rows = np.where(row_counts > 20)[0]
    segments = []
    start = int(rows[0])
    prev = int(rows[0])
    for y in rows[1:]:
        y = int(y)
        if y > prev + 5:
            segments.append((start, prev))
            start = y
        prev = y
    segments.append((start, prev))
    print("pink segments (y):", segments)

    t, b = segments[0]
    band = pink[t : b + 1, :]
    _, xs2 = np.where(band)
    l = int(xs2.min())
    r = int(xs2.max())
    pad = 40
    l = max(0, l - pad)
    r = min(im.width - 1, r + pad)
    t = max(0, t - pad)
    b = min(im.height - 1, b + pad)

    cw = r - l + 1
    ch = b - t + 1
    side = max(cw, ch)
    cx = (l + r) // 2
    cy = (t + b) // 2
    l2 = max(0, cx - side // 2)
    t2 = max(0, cy - side // 2)
    r2 = min(im.width, l2 + side)
    b2 = min(im.height, t2 + side)
    if r2 - l2 < side:
        l2 = max(0, r2 - side)
    if b2 - t2 < side:
        t2 = max(0, b2 - side)

    crop = im.crop((l2, t2, r2, b2))
    ca = np.array(crop)
    cr, cg, cb, cal = ca[:, :, 0], ca[:, :, 1], ca[:, :, 2], ca[:, :, 3]
    is_dark = (cal > 10) & (cr < 80) & (cg < 80) & (cb < 80)
    keep = (cal > 10) & ~is_dark
    out = ca.copy()
    out[:, :, 3] = np.where(keep, 255, 0)
    out[:, :, :3] = np.where(keep[:, :, None], out[:, :, :3], 0)
    icon = Image.fromarray(out, "RGBA")
    bbox = content_bbox(icon, pad=20)
    icon = icon.crop(bbox)
    w, h = icon.size
    side = max(w, h)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(icon, ((side - w) // 2, (side - h) // 2), icon)
    return canvas


def save_resized(im: Image.Image, path: Path, max_side: int = 1200):
    w, h = im.size
    scale = min(1.0, max_side / max(w, h))
    if scale < 1:
        im = im.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    im.save(path, "PNG", optimize=True)
    print("saved", path.name, im.size)


def main():
    w_im = Image.open(white_path).convert("RGBA")
    d_im = Image.open(dark_path).convert("RGBA")

    w_t = remove_bg(w_im, "white", 8)
    d_t = remove_bg(d_im, "dark", 8)

    w_full = w_t.crop(content_bbox(w_t, 20))
    d_full = d_t.crop(content_bbox(d_t, 20))

    # Transparent full logos (clean filenames)
    save_resized(w_full, public / "raida-logo-light.png")
    save_resized(d_full, public / "raida-logo-dark.png")

    # Overwrite originals with transparent cropped versions too
    save_resized(w_full, white_path, max_side=2000)
    save_resized(d_full, dark_path, max_side=2000)

    icon = extract_silhouette_icon(w_t)
    print("icon raw", icon.size)

    for size, name in [(512, "raida-icon.png"), (180, "apple-touch-icon.png"), (64, "favicon.png")]:
        ico = icon.resize((size, size), Image.Resampling.LANCZOS)
        ico.save(public / name, "PNG", optimize=True)
        print("saved", name, size)

    icon.resize((1200, 1200), Image.Resampling.LANCZOS).save(public / "og-image.png", "PNG", optimize=True)
    print("done")


if __name__ == "__main__":
    main()
