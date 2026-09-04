#!/usr/bin/env python3
"""The full testimonial: Aaron carries the whole piece, the work runs under him.

His audio plays unbroken from the first frame to the last. Only the picture
cuts, and every cut lands in a pause he actually leaves - detected from the
waveform, not guessed - so the edit breathes where he breathes.

Everything is RGB end to end. Mixing cv2's BGR with comp's RGB is what put red
and blue the wrong way round in the first pass.

    python3 testimonial.py
"""
import os, sys, math, wave, subprocess as sp
import cv2, numpy as np
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
import comp
from comp import W,H,FPS,smoke

FACE=os.environ.get("SYVEX_FACE","/tmp/testi/fr")
VOICE=os.environ.get("SYVEX_VOICE","/tmp/testi/voice.wav")
FF="/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
NFACE=len([f for f in os.listdir(FACE) if f.endswith(".jpg")])
with wave.open(VOICE) as _w: VLEN=_w.getnframes()/float(_w.getframerate())
CARD=3.0
DISS=0.34

# Aaron owns ZeroGrime, so his own site leads. The list repeats so the carousel
# can keep cycling for as long as he is talking.
ORDER=[int(i) for i in os.environ.get("SYVEX_ORDER","5,0,1,2,3,4,6").split(",")]
_sites=[comp.SITES[i] for i in ORDER]
_pages=[comp.PAGES[i] for i in ORDER]
_card=comp.PAGES[-1]
REPS=4
comp.SITES=_sites*REPS
comp.PAGES=_pages*REPS+[_card]
comp.NB=len(comp.SITES)
# 4.6s is two whole loops of the baked 2.3s clips, so the animated heroes play
# through twice rather than being cut mid-loop
comp.BEAT=float(os.environ.get("SYVEX_TBEAT","4.6"))

def pauses(path, minlen=0.28):
    """where he actually stops - cut points come from the waveform"""
    with wave.open(path) as w:
        sr=w.getframerate(); ch=w.getnchannels()
        x=np.frombuffer(w.readframes(w.getnframes()),"<i2").astype(np.float32)/32768.
    if ch>1: x=x.reshape(-1,ch).mean(1)
    hop=int(sr*0.025); n=len(x)//hop
    rms=np.sqrt((x[:n*hop].reshape(n,hop)**2).mean(1)+1e-12)
    db=20*np.log10(rms+1e-9)
    sp_=db>(np.percentile(db,15)+9)
    runs=[]; i=0
    while i<n:
        if sp_[i]:
            j=i
            while j<n and (sp_[j] or (j+8<n and sp_[j:j+8].any())): j+=1
            runs.append((i*0.025,j*0.025)); i=j
        else: i+=1
    return [((a+b)/2., b-a) for (_,a),(b,_) in zip(runs[:-1],runs[1:]) if b-a>=minlen]

CUTS=[m for m,_ in pauses(VOICE)]

def build_shots():
    """alternate him and the work, snapping every cut to a pause"""
    shots=[]; t=0.0; kind="face"; first=True
    while t < VLEN-2.0:
        want = 7.0 if first else (5.6 if kind=="site" else 5.0)
        first=False
        target=t+want
        near=[c for c in CUTS if abs(c-target)<2.0 and c>t+2.6]
        cut=min(near,key=lambda c:abs(c-target)) if near else min(target,VLEN)
        cut=min(cut,VLEN)
        shots.append((kind,round(cut-t,3)))
        t=cut; kind = "site" if kind=="face" else "face"
    if VLEN-t>0.4: shots.append(("face",round(VLEN-t,3)))
    shots.append(("card",CARD))
    return shots
SHOTS=build_shots()
DUR=sum(d for _,d in SHOTS)

_vy,_vx=np.mgrid[0:H,0:W].astype(np.float32)
EDGE=np.clip((np.clip((np.abs(_vx-W/2)/(W*0.5)-0.70)/0.30,0,1)**1.5*0.95
      + np.clip((np.abs(_vy-H/2)/(H*0.5)-0.76)/0.24,0,1)**1.5*0.95),0,1)[:,:,None]

def shot_at(t):
    acc=0.0
    for kind,d in SHOTS:
        if t < acc+d: return kind, t-acc
        acc+=d
    return SHOTS[-1][0], t-(acc-SHOTS[-1][1])

def site_clock(t):
    acc=0.0; s=0.0
    for kind,d in SHOTS:
        if t<=acc: break
        span=min(d,t-acc)
        if kind=="site": s+=span
        acc+=d
    return s

_FC={}
def face_frame(t):
    k=min(NFACE-1,max(0,int(round(t*FPS))))
    if k not in _FC:
        im=cv2.imread(os.path.join(FACE,f"a{k+1:05d}.jpg"))
        if im is None: im=np.zeros((H,W,3),np.uint8)
        if im.shape[:2]!=(H,W): im=cv2.resize(im,(W,H),interpolation=cv2.INTER_LANCZOS4)
        _FC[k]=cv2.cvtColor(im,cv2.COLOR_BGR2RGB)          # into RGB immediately
        if len(_FC)>40: _FC.pop(next(iter(_FC)))
    a=_FC[k].astype(np.float32)*(1-EDGE*0.58)
    return np.clip(a+smoke(t*0.9)*comp.SMOKE_GAIN*EDGE*0.30,0,255)

def scene_frame(t):
    kind,local=shot_at(t)
    if kind=="face": return face_frame(t)
    if kind=="card": return np.asarray(comp.frame(comp.NB*comp.BEAT+local),dtype=np.float32)
    return np.asarray(comp.frame(site_clock(t)),dtype=np.float32)

BOUND=[]; _a=0.0
for _k,_d in SHOTS[:-1]:
    _a+=_d; BOUND.append(_a)

def frame(t):
    for b in BOUND:
        if abs(t-b)<DISS/2:
            u=(t-(b-DISS/2))/DISS
            k=math.sin(math.pi*u)**0.85
            out=scene_frame(t)*(1.-k*0.94)
            return np.clip(out+smoke(t*1.9+37.)*comp.FG_GAIN*k*1.9,0,255)
    return scene_frame(t)

if __name__=="__main__":
    print("shots:", " ".join(f"{k}{d:.1f}" for k,d in SHOTS))
    print(f"voice {VLEN:.2f}s  cut {DUR:.2f}s  carousel {site_clock(DUR):.1f}s"
          f" = {site_clock(DUR)/comp.BEAT:.1f} beats")
    n=int(DUR*FPS)
    p=sp.Popen([FF,"-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}",
        "-r",str(FPS),"-i","-","-an","-c:v","libx264","-preset","medium","-crf","19",
        "-pix_fmt","yuv420p","testimonial_mute.mp4"],stdin=sp.PIPE)
    for k in range(n):
        p.stdin.write(np.clip(frame(k/FPS),0,255).astype(np.uint8).tobytes())
    p.stdin.close(); p.wait()
    sp.run([FF,"-v","error","-y","-i","testimonial_mute.mp4","-i",VOICE,
            "-c:v","copy","-c:a","aac","-b:a","192k",
            "-af",f"afade=t=out:st={max(0.,VLEN-1.1):.2f}:d=1.0",
            "testimonial_v.mp4"],check=True)
    print("TESTI_DONE",n,"frames",round(DUR,2),"s")
