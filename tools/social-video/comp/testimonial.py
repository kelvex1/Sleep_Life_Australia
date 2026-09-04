#!/usr/bin/env python3
"""Cut the testimonial reel: Aaron opens, then his voice carries across the work.

The through-line is his audio. It runs unbroken from the first frame to the
last, and only the picture cuts between him and the handset - which is what
makes an intercut feel like one piece rather than two videos stapled together.

Each cut lands inside a swell of the same haze that fills both shots, so the
change of subject happens behind smoke rather than on a hard frame boundary.

    python3 testimonial.py            # writes testimonial_v.mp4 (+ audio)
"""
import os, sys, math, subprocess as sp
import cv2, numpy as np
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
import comp
from comp import W,H,FPS,smoke

# Aaron is ZeroGrime's owner, so his own site leads the showcase - the viewer
# hears him say it and sees the thing he is talking about.
ORDER=[int(i) for i in os.environ.get("SYVEX_ORDER","5,0,1,2,3,4,6").split(",")]
comp.SITES=[comp.SITES[i] for i in ORDER]
comp.PAGES=[comp.PAGES[i] for i in ORDER]+[comp.PAGES[-1]]

FACE=os.environ.get("SYVEX_FACE","/tmp/testi/fr")
VOICE=os.environ.get("SYVEX_VOICE","/tmp/testi/voice.wav")
FF="/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
NFACE=len([f for f in os.listdir(FACE) if f.endswith(".jpg")])
DISS=0.34                      # transition length, seconds

# shot list: (kind, duration). "face" = Aaron, "site" = the handset carousel.
SHOTS=[("face",3.6),("site",4.8),("face",2.4),("site",5.4),
       ("face",2.2),("site",0.7),("card",2.9)]
DUR=sum(d for _,d in SHOTS)

_vy,_vx=np.mgrid[0:H,0:W].astype(np.float32)
# Aaron is phone footage upscaled 2.26x; a haze vignette on his edges shares the
# environment with the handset shots so the background never jumps.
EDGE=(np.clip((np.abs(_vx-W/2)/(W*0.5)-0.70)/0.30,0,1)**1.5*0.95
      + np.clip((np.abs(_vy-H/2)/(H*0.5)-0.76)/0.24,0,1)**1.5*0.95)[:,:,None]
EDGE=np.clip(EDGE,0,1)

def shot_at(t):
    """which shot, how far into it, and the local clock for that kind"""
    acc=0.0; site_t=0.0
    for kind,d in SHOTS:
        if t < acc+d or (kind,d)==SHOTS[-1]:
            return kind, t-acc, d, site_t
        if kind=="site": site_t+=d
        acc+=d
    return SHOTS[-1][0], t-acc, SHOTS[-1][1], site_t

def site_clock(t):
    """seconds of handset footage elapsed by time t - the carousel only advances
    while it is actually on screen, so no site is skipped behind Aaron"""
    acc=0.0; s=0.0
    for kind,d in SHOTS:
        if t <= acc: break
        span=min(d, t-acc)
        if kind=="site": s+=span
        acc+=d
    return s

def face_frame(t):
    k=min(NFACE-1,int(round(t*FPS)))
    im=cv2.imread(os.path.join(FACE,f"a{k+1:04d}.jpg"))
    if im is None: im=np.zeros((H,W,3),np.uint8)
    if im.shape[0]!=H or im.shape[1]!=W:
        im=cv2.resize(im,(W,H),interpolation=cv2.INTER_LANCZOS4)
    a=im.astype(np.float32)
    a=a*(1-EDGE*0.58)                      # sink his edges into the dark
    sm=smoke(t*0.9)*comp.SMOKE_GAIN
    a=np.clip(a+sm*EDGE*0.30,0,255)        # and let the same haze wrap them
    return a

def scene_frame(t):
    kind,local,dur,_=shot_at(t)
    if kind=="face": return face_frame(t)
    st=site_clock(t)
    if kind=="card": return np.asarray(comp.frame(comp.NB*comp.BEAT+local)).astype(np.float32)
    return np.asarray(comp.frame(st)).astype(np.float32)

def boundaries():
    b=[]; acc=0.0
    for kind,d in SHOTS[:-1]:
        acc+=d; b.append(acc)
    return b
BOUND=boundaries()

def frame(t):
    # dissolve across every shot change, inside a swell of the shared haze
    for b in BOUND:
        if abs(t-b) < DISS/2:
            u=(t-(b-DISS/2))/DISS
            # Dip through the haze rather than cross-fade. Blending two
            # different subjects is muddy at the midpoint however short it is;
            # dipping means they are never on screen together.
            k=math.sin(math.pi*u)**0.85
            out=scene_frame(t)*(1.-k*0.94)
            out=np.clip(out+smoke(t*1.9+37.)*comp.FG_GAIN*k*1.9,0,255)
            return out
    return scene_frame(t)

if __name__=="__main__":
    n=int(DUR*FPS)
    p=sp.Popen([FF,"-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}",
        "-r",str(FPS),"-i","-","-an","-c:v","libx264","-preset","medium","-crf","18",
        "-pix_fmt","yuv420p","testimonial_mute.mp4"],stdin=sp.PIPE)
    for k in range(n):
        f=np.clip(frame(k/FPS),0,255).astype(np.uint8)
        p.stdin.write(cv2.cvtColor(f,cv2.COLOR_BGR2RGB).tobytes())
    p.stdin.close(); p.wait()
    # the voice is shorter than the cut, so no -shortest: it would truncate the
    # video to the audio and drop the end card
    import wave
    with wave.open(VOICE) as w: vlen=w.getnframes()/float(w.getframerate())
    sp.run([FF,"-v","error","-y","-i","testimonial_mute.mp4","-i",VOICE,
            "-c:v","copy","-c:a","aac","-b:a","192k",
            "-af",f"afade=t=out:st={max(0.0,vlen-1.1):.2f}:d=1.0",
            "testimonial_v.mp4"],check=True)
    print("voice %.2fs over a %.2fs cut"%(vlen,DUR))
    print("TESTI_DONE",n,"frames",round(DUR,2),"s")
