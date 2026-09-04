import os, sys, json, math, cv2, numpy as np
HERE=os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0,HERE)
from PIL import Image, ImageDraw, ImageFilter
from grit import W,H,BK,RG,WHT,RED,grit_text,fit
from smoke import smoke
FPS=30; BEAT=2.3; CARD=3.0   # seven sites plus the card, inside 20s
SWIPE=0.60                  # how long a flick between pages takes
GUT=20                      # gutter between pages, like a real carousel
# The rig - either the WebGL one (rig/render.py, seconds) or a Blender bake.
# Both emit the same two things: RGBA frames and per-frame screen corners.
RIG=os.environ.get("SYVEX_RIG", os.path.join(HERE,"..","rig"))
PAGEDIR=os.environ.get("SYVEX_PAGES", os.path.join(HERE,"..","pages"))
FRDIR=os.path.join(RIG,"frames")
COR=json.load(open(os.path.join(RIG,"corners.json")))
NORB=len(COR)
_p0=cv2.imread(os.path.join(FRDIR,"f0000.png"),cv2.IMREAD_UNCHANGED)
QSCALE=W/float(_p0.shape[1])          # plate is rendered small; corners scale with it
SITES=[("n1","ACE BALLERZ","WANNEROO · PERTH"),
       ("n2","ME-SOLAR","PORT STEPHENS · NSW"),
       ("n3","FLOW SCAPES","PERTH METRO"),
       ("n4","ELECTEQ","PERTH"),
       ("n5","ADELAIDE CHAUFFEUR","ADELAIDE · SA"),
       ("n6","ZEROGRIME SOLUTIONS","BUNBURY · WA"),
       ("n7","MOVING WITH MOJO'S","REMOVALISTS · PERTH")]
NB=len(SITES)
DUR=NB*BEAT+CARD; N=int(DUR*FPS)
# type always lands on clean black - a soft floor scrim, never a hard band
_gy=np.arange(H,dtype=np.float32)[:,None,None]
SCRIM=1.-np.clip((_gy-1370.)/530.,0,1)**1.35*0.86
_vy,_vx=np.mgrid[0:H,0:W].astype(np.float32)
_vr=np.sqrt(((_vx-W/2)/(W*.70))**2+((_vy-H*.46)/(H*.68))**2)
# Haze drifting in FRONT of the handset. Without a foreground layer the
# subject sits flatly on a backdrop; with one the frame has real depth.
# Weighted away from the screen so it never costs legibility.
FGW=(np.clip((_vy-H*0.40)/(H*0.62),0,1)**1.25*0.85
     + np.clip((np.abs(_vx-W/2)/(W*0.5)-0.44)/0.56,0,1)**1.3*0.5)[:,:,None]
FG_GAIN=float(os.environ.get("SYVEX_FG","0.55"))
VIG=(1.-np.clip((_vr-.50)/.92,0,1)**1.3*float(os.environ.get("SYVEX_VIG","0.62")))[:,:,None]
# The Blender plate carried an opaque floor that hid most of the smoke. The
# WebGL plate is the handset alone, so the smoke needs pulling back to match.
SMOKE_GAIN=float(os.environ.get("SYVEX_SMOKE","0.95"))

def io_(p): return 4*p*p*p if p<.5 else 1-((-2*p+2)**3)/2
def oc(p): return 1-(1-p)**3
def sg(t,a,b): return max(0.,min(1.,(t-a)/(b-a)))

SRCW,SRCH=1200,2512         # matches the phone screen's own aspect (2.0934).
                            # Sized to the stitched pages so the crop is 1:1,
                            # and ~1.9x the on-screen size so the warp
                            # downsamples rather than magnifies.
# The display has rounded corners. Clipping the site to a square rectangle is
# what makes it read as pasted on rather than sitting behind the glass.
SCR_R=int(SRCW*0.113)       # matches the rig's corner radius over the screen
def _round_mask():
    m=np.zeros((SRCH,SRCW),np.uint8)
    cv2.rectangle(m,(SCR_R,0),(SRCW-SCR_R,SRCH),255,-1)
    cv2.rectangle(m,(0,SCR_R),(SRCW,SRCH-SCR_R),255,-1)
    for cx,cy in ((SCR_R,SCR_R),(SRCW-SCR_R,SCR_R),
                  (SCR_R,SRCH-SCR_R),(SRCW-SCR_R,SRCH-SCR_R)):
        cv2.circle(m,(cx,cy),SCR_R,255,-1)
    return m
ROUND=_round_mask()

# A specular sweep travelling across the glass as the page flicks. It ties the
# transition to the object instead of just sliding pixels behind it.
_sx=np.linspace(0,1,SRCW,dtype=np.float32)[None,:]
_sy=np.linspace(0,1,SRCH,dtype=np.float32)[:,None]
def sweep(u):
    c=-0.35+1.7*u                       # travels in from off-screen and out
    d=(_sx*0.82+_sy*0.18)-c
    return np.exp(-(d/0.13)**2)*(ROUND.astype(np.float32)/255.)

def swipe_phase(t):
    """0..1 across a flick, or None while a page is held"""
    i=int(t/BEAT); local=t-i*BEAT; hold=BEAT-SWIPE
    if i>=NB or local<=hold: return None
    return (local-hold)/SWIPE
ASP=SRCH/float(SRCW)

def hero(key):
    """the site's top screenful, cropped to the phone screen with no distortion"""
    pg=cv2.imread(os.path.join(PAGEDIR,f"{key}.png")); PH,PW=pg.shape[:2]
    wh=min(PH,int(round(PW*ASP))); ww=int(round(wh/ASP))
    x0=(PW-ww)//2
    return cv2.resize(pg[0:wh, x0:x0+ww],(SRCW,SRCH),interpolation=cv2.INTER_AREA)

def load_page(key):
    """A site is either a stitched still or, where the hero plays video, a run
    of baked frames. A frozen hero is the difference between a screen that is
    alive and one that is a photograph."""
    vd=os.path.join(PAGEDIR,key+"_v")
    if not os.path.isdir(vd) and os.path.isfile(vd+".mp4"):
        # the repo carries a compact clip of exactly the frames used; the
        # loose frames are build output and are not committed
        os.makedirs(vd,exist_ok=True)
        cap=cv2.VideoCapture(vd+".mp4"); j=0
        while True:
            ok,fr=cap.read()
            if not ok: break
            cv2.imwrite(os.path.join(vd,f"f{j:04d}.jpg"),fr,[cv2.IMWRITE_JPEG_QUALITY,94]); j+=1
        cap.release()
        print(f"  unpacked {j} frames for {key}")
    if os.path.isdir(vd):
        n=len([f for f in os.listdir(vd) if f.endswith(".jpg")])
        if n: return ("vid",vd,n)
    return ("img",hero(key),1)

PAGES=[load_page(k) for k,_,_ in SITES]
PAGES.append(("img",cv2.cvtColor(np.asarray(Image.open(os.path.join(HERE,"endscreen.png"))
                                            .convert("RGB")),cv2.COLOR_RGB2BGR),1))
print("pages ready",len(PAGES),
      "(%d live)"%sum(1 for p in PAGES if p[0]=="vid"))
PITCH=SRCW+GUT
_VC={}
def page_img(i,k):
    kind,a,n=PAGES[i]
    if kind=="img": return a
    j=k%n; key=(i,j)
    if key not in _VC:
        _VC[key]=cv2.imread(os.path.join(a,f"f{j:04d}.jpg"))
        if len(_VC)>26: _VC.pop(next(iter(_VC)))
    return _VC[key]

def flick(u):
    """a swipe that eases off the finger and settles - symmetric, so peak speed
    stays low enough that a frame never jumps further than the eye can track"""
    return u*u*u*(u*(u*6-15)+10)

def page_pos(t):
    """continuous position along the carousel, in pages"""
    i=min(NB,int(t/BEAT)); local=t-i*BEAT
    if i>=NB: return float(NB)
    hold=BEAT-SWIPE
    if local<=hold: return float(i)
    return i+flick((local-hold)/SWIPE)

def screen(t):
    """the carousel at time t - two pages at most are ever visible"""
    x=page_pos(t); i=int(x); f=x-i
    k=int(round(t*FPS))
    buf=np.zeros((SRCH,SRCW,3),np.uint8)        # the gutter stays black
    off=int(round(f*PITCH))
    for pi,x0 in ((i,-off),(i+1,PITCH-off)):
        if pi>=len(PAGES): continue
        a=max(0,x0); b=min(SRCW,x0+SRCW)
        if b>a: buf[:,a:b]=page_img(pi,k)[:,a-x0:b-x0]
    return buf

PLATE={}
def plate(k):
    if k not in PLATE:
        im=Image.open(os.path.join(FRDIR,f"f{k:04d}.png")).convert("RGBA").resize((W,H),Image.LANCZOS)
        PLATE[k]=np.asarray(im).astype(np.float32)
        if len(PLATE)>40: PLATE.pop(next(iter(PLATE)))
    return PLATE[k]

def quad(k):
    c=COR[str(k)]
    return np.array([[p[0]*QSCALE,p[1]*QSCALE] for p in c],np.float32)

def orbit_index(t):
    return int((t*FPS)%NORB)

def frame(t):
    ok=orbit_index(t)
    P=plate(ok); A=P[:,:,3:4]/255.; rgb=P[:,:,:3].copy()
    q=quad(ok)

    # the site goes under the glass first, so the floor reflects it too
    src=np.array([[0,0],[SRCW,0],[SRCW,SRCH],[0,SRCH]],np.float32)
    Mx=cv2.getPerspectiveTransform(src,q)
    warp=cv2.warpPerspective(cv2.cvtColor(screen(t),cv2.COLOR_BGR2RGB),Mx,(W,H),
                             flags=cv2.INTER_LANCZOS4,borderMode=cv2.BORDER_CONSTANT)
    m=cv2.warpPerspective(ROUND,Mx,(W,H),flags=cv2.INTER_LINEAR,
                          borderMode=cv2.BORDER_CONSTANT)
    m=cv2.GaussianBlur(m,(0,0),0.7).astype(np.float32)[:,:,None]/255.
    rgb=rgb*(1-m)+np.clip(warp*0.97+rgb*0.45,0,255)*m   # keep the sheen, lose the wash
    ph=swipe_phase(t)
    if ph is not None:
        gl=cv2.warpPerspective(sweep(ph),Mx,(W,H),flags=cv2.INTER_LINEAR,
                               borderMode=cv2.BORDER_CONSTANT)[:,:,None]
        rgb=np.clip(rgb+gl*np.array([96.,92.,104.],np.float32)*
                    math.sin(math.pi*min(1.,ph*1.15)),0,255)
    A=np.maximum(A,m)

    sm=smoke(t*0.9)*SMOKE_GAIN
    base=sm.copy()

    # the floor is 2D: the handset mirrored, faded and softened. Doing it here
    # rather than in the rig means the falloff is a dial, not a re-render.
    rows=np.where(A[:,:,0].max(axis=1)>0.03)[0]
    fy=int(rows.max())+2 if len(rows) else H
    nh=min(H-fy, fy)
    if nh>4:
        ma=np.flipud(A[fy-nh:fy]); mr=np.flipud(rgb[fy-nh:fy])
        fade=(np.clip(1-np.arange(nh)/float(nh)*1.45,0,1)**1.6)[:,None,None]
        mr=cv2.GaussianBlur(mr,(0,0),2.2)
        k=ma*fade*0.34
        base[fy:fy+nh]=base[fy:fy+nh]*(1-k)+mr*k

    # the smoke reflects off the same floor
    mir=np.flipud(sm[:fy])[:H-fy]
    if mir.shape[0]>0:
        f2=np.clip(1-np.arange(mir.shape[0])/max(1,mir.shape[0])*1.15,0,1)[:,None,None]**1.3
        base[fy:fy+mir.shape[0]]+=mir*f2*0.34

    out=base*(1-A)+rgb*A

    fg=smoke(t*1.9+37.0)*FG_GAIN
    out=np.clip(out+fg*FGW*(1.-m*0.88),0,255)   # haze in front, clear of the screen
    out*=SCRIM*VIG
    img=Image.fromarray(np.clip(out,0,255).astype(np.uint8)).convert("RGBA")
    dr=ImageDraw.Draw(img,"RGBA")
    if t < NB*BEAT:
        i=min(NB-1,int(t/BEAT)); u=(t-i*BEAT)/BEAT
        a=min(oc(sg(u,0.06,0.24)),1.-sg(u,0.70,0.80))   # clear of the swipe
        if a>.01:
            nm,loc=SITES[i][1],SITES[i][2]
            dr.rectangle([80,1690,80+int(190*oc(sg(u,0.06,0.30))),1695],fill=RED+(int(240*a),))
            grit_text(img,[nm],fit([nm],56,track=2),WHT,80,1742,al=a,track=2)
            grit_text(img,[loc],fit([loc],26,track=4),RED,80,1812,al=a*.95,track=4)
    else:
        u=(t-NB*BEAT)/CARD
        av=oc(sg(u,0.10,0.40))
        dr.rectangle([80,1690,80+int(190*oc(sg(u,0.08,0.36))),1695],fill=RED+(int(240*av),))
        grit_text(img,["SEVEN REAL BUILDS"],fit(["SEVEN REAL BUILDS"],54,track=2),WHT,80,1742,
                  al=av,track=2)
        grit_text(img,["YOURS NEXT \u00b7 SYVEX.XYZ"],fit(["YOURS NEXT \u00b7 SYVEX.XYZ"],26,track=4),
                  RED,80,1812,al=oc(sg(u,0.26,0.58))*.95,track=4)
    a=np.asarray(img.convert("RGB")).astype(np.float32)
    bl=np.clip(a-214.,0,None)
    bi=Image.fromarray(np.clip(bl,0,255).astype(np.uint8)).resize((W//4,H//4),Image.BILINEAR)
    bi=bi.filter(ImageFilter.GaussianBlur(9)).resize((W,H),Image.BILINEAR)
    a+=np.asarray(bi).astype(np.float32)*0.26
    a+=(np.random.RandomState(int(t*61)%89).rand(H,W,1).astype(np.float32)-.5)*6.
    return Image.fromarray(np.clip(a,0,255).astype(np.uint8))

if __name__=="__main__":
    if sys.argv[1]=="sample":
        import os; os.makedirs("sf",exist_ok=True)
        for i,t in enumerate([float(x) for x in sys.argv[2:]]):
            frame(t).save(f"sf/f{i:02d}.jpg",quality=93)
        print("sample ok")
    elif sys.argv[1]=="seg":
        # a short slice, for judging motion without paying for the whole cut
        import subprocess as sp
        a,b,dst=float(sys.argv[2]),float(sys.argv[3]),sys.argv[4]
        FF="/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
        p=sp.Popen([FF,"-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}",
            "-r",str(FPS),"-i","-","-an","-c:v","libx264","-preset","fast","-crf","20",
            "-pix_fmt","yuv420p",dst],stdin=sp.PIPE)
        for k in range(int((b-a)*FPS)): p.stdin.write(frame(a+k/FPS).tobytes())
        p.stdin.close(); p.wait(); print("SEG_DONE",dst)
    else:
        import subprocess as sp
        FF="/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2"
        p=sp.Popen([FF,"-v","error","-y","-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}",
            "-r",str(FPS),"-i","-","-an","-c:v","libx264","-preset","medium","-crf","18",
            "-pix_fmt","yuv420p","final_v.mp4"],stdin=sp.PIPE)
        for k in range(N): p.stdin.write(frame(k/FPS).tobytes())
        p.stdin.close(); p.wait(); print("FINAL_DONE",N)
