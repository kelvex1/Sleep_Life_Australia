#!/usr/bin/env python3
"""Bake a screen recording into a loopable run of screen-sized frames.

Some client sites play video in the hero. A stitched still page freezes that,
and a frozen hero is the difference between a screen that is alive and one that
is a photograph. This bakes the recording to the phone screen's own aspect,
crops the iOS chrome away, and writes one JPEG per output frame.

    python3 prep_video.py <recording.mp4> <key> [--frames 75] [--start 30]
"""
import argparse, os, cv2

SRCW, SRCH = 1200, 2512
ASP = SRCH / float(SRCW)
TOPBAR, BOTBAR = 170, 30          # iOS status bar and home indicator
HERE = os.path.dirname(os.path.abspath(__file__))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("key")
    ap.add_argument("--frames", type=int, default=75)
    ap.add_argument("--start", type=int, default=30)
    ap.add_argument("--out", default=os.path.join(HERE, "..", "pages"))
    a = ap.parse_args()

    cap = cv2.VideoCapture(a.src)
    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    step = max(1, int(round(fps / 30.0)))      # play at natural speed at 30fps
    dst = os.path.join(a.out, a.key + "_v")
    os.makedirs(dst, exist_ok=True)

    frames, i, kept = [], 0, 0
    while kept < a.frames:
        ok, f = cap.read()
        if not ok: break
        if i >= a.start and (i - a.start) % step == 0:
            h, w = f.shape[:2]
            f = f[TOPBAR:h - BOTBAR]           # drop the recording chrome
            hh = f.shape[0]
            ww = min(w, int(round(hh / ASP)))  # crop to the screen's aspect
            x0 = (w - ww) // 2
            f = cv2.resize(f[:, x0:x0 + ww], (SRCW, SRCH), interpolation=cv2.INTER_AREA)
            cv2.imwrite(os.path.join(dst, f"f{kept:04d}.jpg"), f,
                        [cv2.IMWRITE_JPEG_QUALITY, 94])
            kept += 1
        i += 1
    cap.release()
    print(f"{a.key}: {kept} frames -> {dst}")

if __name__ == "__main__":
    main()
