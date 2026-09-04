"""Stitch each screen recording into one tall page image.

The recordings scroll by hand: they stall, flick, and change speed, and any
resampling of them inherits that. Instead, estimate the vertical offset between
consecutive frames, paste only the newly revealed strip, and end up with a
single continuous page. The scroll is then something we drive ourselves at a
rate we choose, so it can be perfectly smooth.
"""
import cv2, numpy as np, os, sys, json

FOOT = 0.11        # skip floating bottom UI (chat bubbles, scroll hints)
MINA = 0.14        # never take a strip from above this fraction of the frame

def offsets(path):
    """per-frame vertical scroll in source pixels, by template match"""
    cap = cv2.VideoCapture(path); prev = None; out = []
    while True:
        ok, fr = cap.read()
        if not ok: break
        g = cv2.cvtColor(cv2.resize(fr, (0,0), fx=.5, fy=.5), cv2.COLOR_BGR2GRAY)
        if prev is None:
            out.append(0)
        else:
            h, w = g.shape
            y0, bh = int(h*.52), int(h*.16)
            band = prev[y0:y0+bh, int(w*.16):int(w*.84)]
            strip = g[:, int(w*.16):int(w*.84)]
            r = cv2.matchTemplate(strip, band, cv2.TM_CCOEFF_NORMED)
            by = int(np.argmax(r)); peak = float(r[by, 0])
            dy = y0 - by
            out.append(dy*2 if (peak > .55 and 0 <= dy <= h*.45) else 0)
        prev = g
    cap.release()
    return out

def stitch(path, dst):
    dy = offsets(path)
    cap = cv2.VideoCapture(path)
    ok, f0 = cap.read()
    H, W = f0.shape[:2]
    foot, mina = int(H*(1-FOOT)), int(H*MINA)
    total = int(sum(dy)) + H
    page = np.zeros((total, W, 3), np.uint8)
    page[:H] = f0
    off = 0; i = 1; last = f0
    while True:
        ok, fr = cap.read()
        if not ok: break
        last = fr
        d = dy[i] if i < len(dy) else 0
        if d > 0:
            off += d
            a = max(mina, foot - d)               # strip of freshly revealed page
            page[off+a:off+foot] = fr[a:foot]
        i += 1
    cap.release()
    page[off+foot:off+H] = last[foot:H]             # tail of the final frame
    page = page[:off+H]
    cv2.imwrite(dst, page, [cv2.IMWRITE_PNG_COMPRESSION, 6])
    return page.shape[0], H

if __name__ == "__main__":
    meta = {}
    for n in ["n1","n2","n3","n4","n5"]:
        ph, fh = stitch(f"../sites/{n}.mp4", f"pages/{n}.png")
        meta[n] = ph
        print(f"{n}: page {ph}px  ({ph/fh:.2f} viewports)")
    json.dump(meta, open("pages/meta.json","w"))
