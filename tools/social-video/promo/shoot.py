#!/usr/bin/env python3
"""Render an animated page frame by frame, deterministically.

Screen-recording a page inherits the recorder's dropped frames and timing
jitter. Driving window.setFrame(i) and capturing each one gives exact timing
and every frame at full resolution - which is the difference between motion
that glides and motion that stutters.

    python3 shoot.py --page promo/ad.html --out frames --w 1080 --h 1920
"""
import argparse, base64, functools, http.server, os, socketserver, threading, time
from playwright.sync_api import sync_playwright

CHROME="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--page",default="promo/ad.html")
    ap.add_argument("--out",default="frames")
    ap.add_argument("--w",type=int,default=1080); ap.add_argument("--h",type=int,default=1920)
    ap.add_argument("--frames",type=int,default=0)
    ap.add_argument("--only",default="")      # e.g. "0,120,300" for a quick look
    a=ap.parse_args()
    os.makedirs(a.out,exist_ok=True)

    h=functools.partial(http.server.SimpleHTTPRequestHandler,directory=ROOT)
    h.log_message=lambda *x,**k: None
    srv=socketserver.TCPServer(("127.0.0.1",0),h); port=srv.server_address[1]
    threading.Thread(target=srv.serve_forever,daemon=True).start()

    with sync_playwright() as p:
        b=p.chromium.launch(executable_path=CHROME,args=[
            "--use-gl=angle","--use-angle=swiftshader","--enable-unsafe-swiftshader"])
        pg=b.new_page(viewport={"width":a.w,"height":a.h},device_scale_factor=1)
        errs=[]
        pg.on("console",lambda m: errs.append(m.text) if m.type=="error" else None)
        pg.on("pageerror",lambda e: errs.append(str(e)))
        sep="&" if "?" in a.page else "?"
        pg.goto(f"http://127.0.0.1:{port}/{a.page}{sep}w={a.w}&h={a.h}")
        try:
            pg.wait_for_function("window.__ready===true",timeout=60000)
        except Exception:
            raise SystemExit("page never became ready:\n  "+"\n  ".join(errs or ["(no output)"]))
        n=a.frames or pg.evaluate("window.NFRAMES")
        idx=[int(x) for x in a.only.split(",")] if a.only else range(n)
        t0=time.time()
        for f in idx:
            pg.evaluate("f=>window.setFrame(f)",f)
            png=pg.evaluate("()=>window.grab()")
            open(os.path.join(a.out,f"f{f:05d}.png"),"wb").write(base64.b64decode(png.split(",",1)[1]))
        dt=time.time()-t0
        cnt=len(list(idx))
        b.close()
    srv.shutdown()
    if errs: print("console errors:", errs[:3])
    print(f"SHOOT_DONE {cnt} frames in {dt:.1f}s ({dt/max(1,cnt)*1000:.0f} ms/frame) -> {a.out}/")

if __name__=="__main__": main()
