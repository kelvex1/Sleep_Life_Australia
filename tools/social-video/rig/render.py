#!/usr/bin/env python3
"""Render the phone plate and its screen corners with headless WebGL.

Drop-in replacement for the Blender orbit: emits the same two artefacts the
compositor expects - RGBA frames with a transparent background, and a JSON map
of per-frame screen corners. About 200x faster than the Cycles path, which is
what makes it possible to try a camera move rather than commit to one.

    python3 render.py --out frames --w 540 --h 960
"""
import argparse, base64, functools, http.server, json, os, socketserver, threading, time
from playwright.sync_api import sync_playwright

CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
HERE = os.path.dirname(os.path.abspath(__file__))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="frames")
    ap.add_argument("--w", type=int, default=540)
    ap.add_argument("--h", type=int, default=960)
    ap.add_argument("--frames", type=int, default=0, help="0 = the rig's full loop")
    ap.add_argument("--corners", default="corners.json")
    ap.add_argument("--page", default="phone.html")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)

    # ES modules will not load over file:// - Chromium blocks them as cross-origin,
    # which surfaces only as a page that never becomes ready. Serve the rig instead.
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=HERE)
    handler.log_message = lambda *a, **k: None
    srv = socketserver.TCPServer(("127.0.0.1", 0), handler)
    port = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()

    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME, args=[
            "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
        pg = b.new_page(viewport={"width": a.w, "height": a.h})
        sep = "&" if "?" in a.page else "?"
        pg.goto(f"http://127.0.0.1:{port}/{a.page}{sep}w={a.w}&h={a.h}")
        errs = []
        pg.on("console", lambda m: errs.append(m.text) if m.type == "error" else None)
        pg.on("pageerror", lambda e: errs.append(str(e)))
        try:
            pg.wait_for_function("window.__ready === true", timeout=60000)
        except Exception:
            raise SystemExit("rig failed to start:\n  " + "\n  ".join(errs or ["(no console output)"]))

        n = a.frames or pg.evaluate("window.NF")
        cor, t0 = {}, time.time()
        for f in range(n):
            cor[str(f)] = pg.evaluate("f => window.getCorners(f)", f)
            png = pg.evaluate("() => window.grab()")
            with open(os.path.join(a.out, f"f{f:04d}.png"), "wb") as fh:
                fh.write(base64.b64decode(png.split(",", 1)[1]))
            if f % 25 == 0:
                print(f"  {f}/{n}", flush=True)
        dt = time.time() - t0
        json.dump(cor, open(a.corners, "w"))
        b.close()
    srv.shutdown()
    print(f"RIG_DONE {n} frames in {dt:.1f}s ({dt/n*1000:.0f} ms/frame) -> {a.out}/, {a.corners}")

if __name__ == "__main__":
    main()
