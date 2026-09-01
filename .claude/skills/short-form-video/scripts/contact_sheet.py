#!/usr/bin/env python3
"""Extract frames from a video and tile them into one image you can Read.

This exists because the single most common failure when working with video is
judging it without looking at it. One command, one Read, and you can name every
section of a 30-second clip.

    python contact_sheet.py input.mp4 sheet.png                # 12 frames @150px
    python contact_sheet.py input.mp4 sheet.png -n 6 -w 300    # fewer, bigger
    python contact_sheet.py in.mp4 s.png --start 4 --end 9     # a single segment

Then: Read the output path.

Sizing guidance (tested, not guessed):
  12 frames @150px -> ~600x800. Headlines and layout readable; body copy marginal.
                      Use to identify every section of a video in one look.
   6 frames @300px -> ~900x1080. Body copy readable. Use to judge composition.
   1 frame native   -> use to inspect type quality or a specific artefact.
"""
import argparse, os, shutil, subprocess, sys, tempfile

def find_ffmpeg():
    for name in ("ffmpeg", "ffprobe"):
        pass
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:  # pip install imageio-ffmpeg gives a static build
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        sys.exit("no ffmpeg: pip install imageio-ffmpeg")

def duration(ffmpeg, path):
    out = subprocess.run([ffmpeg, "-i", path], capture_output=True, text=True).stderr
    for line in out.splitlines():
        if "Duration:" in line:
            hms = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = hms.split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    sys.exit("could not read duration - is this a video?")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("video"); p.add_argument("out")
    p.add_argument("-n", "--frames", type=int, default=12)
    p.add_argument("-w", "--width", type=int, default=150)
    p.add_argument("--start", type=float, default=None)
    p.add_argument("--end", type=float, default=None)
    p.add_argument("--cols", type=int, default=None)
    a = p.parse_args()
    from PIL import Image

    ff = find_ffmpeg()
    dur = duration(ff, a.video)
    t0 = a.start if a.start is not None else 0.0
    t1 = a.end if a.end is not None else dur
    t0, t1 = max(0.0, t0), min(dur, t1)
    span = max(t1 - t0, 0.001)
    # inset from the very edges: first/last frames are often black or mid-transition
    times = [t0 + span * (i + 0.5) / a.frames for i in range(a.frames)]

    tmp = tempfile.mkdtemp()
    tiles = []
    for i, t in enumerate(times):
        fp = os.path.join(tmp, "f%03d.png" % i)
        r = subprocess.run([ff, "-v", "error", "-ss", "%.3f" % t, "-i", a.video,
                            "-frames:v", "1", "-vf", "scale=%d:-2" % a.width, fp, "-y"],
                           capture_output=True, text=True)
        if os.path.exists(fp):
            tiles.append((t, Image.open(fp).convert("RGB")))
    if not tiles:
        sys.exit("extracted no frames")

    cols = a.cols or (4 if len(tiles) >= 9 else (3 if len(tiles) >= 5 else len(tiles)))
    rows = (len(tiles) + cols - 1) // cols
    tw, th = tiles[0][1].size
    sheet = Image.new("RGB", (cols * tw, rows * th), (18, 18, 18))
    for i, (t, im) in enumerate(tiles):
        if im.size != (tw, th):
            im = im.resize((tw, th), Image.LANCZOS)
        sheet.paste(im, ((i % cols) * tw, (i // cols) * th))
    sheet.save(a.out)
    print("%s  %dx%d  %d frames, %s"
          % (a.out, sheet.size[0], sheet.size[1], len(tiles),
             " ".join("%.1fs" % t for t, _ in tiles)))
    print("Now Read that file. Name what each shot is before judging any of it.")

if __name__ == "__main__":
    main()
