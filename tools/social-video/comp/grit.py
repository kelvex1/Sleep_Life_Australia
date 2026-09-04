import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
W,H=1080,1920
FD=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..","fonts")
BK=lambda s: ImageFont.truetype(f"{FD}/Archivo-Black.ttf",s)
RG=lambda s: ImageFont.truetype(f"{FD}/Archivo.ttf",s)
WHT=(238,233,226); RED=(232,51,28); DRED=(150,26,16)
R=np.random.RandomState(17)

# ---------- the speckle that makes type look printed, not rendered ----------
def _field(w,h,res,seed,lo=0.,hi=1.):
    a=np.random.RandomState(seed).rand(res,max(1,int(res*h/w))).astype(np.float32)
    im=Image.fromarray((a.T*255).astype(np.uint8)).resize((w,h),Image.BICUBIC)
    f=np.asarray(im).astype(np.float32)/255.
    return lo+(hi-lo)*f
SPK=None
def speckle(w,h):
    global SPK
    if SPK is None or SPK.shape[:2]!=(h,w):
        mottle=_field(w,h,26,3,0.72,1.0)*_field(w,h,70,4,0.80,1.0)
        d=np.random.RandomState(5).rand(h,w).astype(np.float32)
        dots=np.ones((h,w),np.float32)
        dots[d>0.9905]=0.10                      # hard black flecks
        dots[(d>0.977)&(d<=0.9905)]=0.42
        dots=np.asarray(Image.fromarray((dots*255).astype(np.uint8))
                        .filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32)/255.
        SPK=np.clip(mottle*dots,0,1)
    return SPK

_M=ImageDraw.Draw(Image.new("L",(8,8)))
def measure(ln,f,track=0.):
    w=_M.textlength(ln,font=f)
    return w+track*max(0,len(ln)-1)
MAXW=940
def fit(lines,hi,lo=38,track=0.,maxw=MAXW):
    """largest heavy size where every line clears the right margin"""
    for sz in range(hi,lo-1,-2):
        f=BK(sz)
        if all(measure(l,f,track)<=maxw for l in lines): return f
    return BK(lo)

def grit_text(lay,lines,font,col,x,y,lead=1.02,al=1.,track=0.):
    """heavy type, tight leading, printed texture inside the glyphs"""
    if al<=.004: return y
    tmp=Image.new("L",(W,H),0); d=ImageDraw.Draw(tmp)
    yy=y
    for ln in lines:
        if track:
            cx=x
            for ch in ln:
                d.text((cx,yy),ch,font=font,fill=255,anchor="la")
                cx+=d.textlength(ch,font=font)+track
        else:
            d.text((x,yy),ln,font=font,fill=255,anchor="la")
        yy+=int(font.size*lead)
    m=np.asarray(tmp).astype(np.float32)/255.
    s=speckle(W,H)
    rgb=np.zeros((H,W,3),np.float32)
    for i in range(3): rgb[:,:,i]=col[i]*(0.55+0.45*s)
    a=(m*al*255).astype(np.uint8)
    lay.alpha_composite(Image.merge("RGBA",(
        *[Image.fromarray(np.clip(rgb[:,:,i],0,255).astype(np.uint8)) for i in range(3)],
        Image.fromarray(a))))
    return yy

# ---------- the world behind it ----------
def warped_grid(t):
    im=Image.new("L",(W,H),0); d=ImageDraw.Draw(im)
    def wx(x,y):
        return x+58*np.sin((y/H)*3.1+t*0.16)+30*np.sin((x/W)*2.2-t*0.11)
    for gx in range(-200,W+400,96):
        pts=[(wx(gx+ (y/H)*150,y),y) for y in range(0,H+40,40)]
        d.line(pts,fill=74,width=2)
    for gy in range(-100,H+200,104):
        pts=[(x,gy+52*np.sin((x/W)*2.6+t*0.19)+26*np.sin((gy/H)*3.4-t*0.13)) for x in range(0,W+40,40)]
        d.line(pts,fill=64,width=2)
    return im.filter(ImageFilter.GaussianBlur(0.7))

SW,SH=270,480
def _oct(res,seed):
    a=np.random.RandomState(seed).rand(res,res).astype(np.float32)
    return np.asarray(Image.fromarray((a*255).astype(np.uint8))
                      .resize((SW*2,SH*2),Image.BICUBIC)).astype(np.float32)/255.
OCT=[(_oct(6,11),.52,(4.,2.)),(_oct(13,12),.28,(-7.,3.5)),(_oct(27,13),.20,(10.,-5.))]
yy_,xx_=np.mgrid[0:SH,0:SW].astype(np.float32)
u_,v_=xx_/SW,yy_/SH
RIGHT=np.clip((u_-0.42)/0.45,0,1)**1.3          # smoke hugs the right edge
def smoke(t):
    f=np.zeros((SH,SW),np.float32)
    for tex,amp,(vx,vy) in OCT:
        ox=int((t*vx)%SW); oy=int((t*vy)%SH)
        f+=amp*tex[oy:oy+SH,ox:ox+SW]
    f=(f-f.min())/(f.max()-f.min()+1e-6)
    f=np.clip((f-.46)*2.3,0,1)**1.1
    return f*RIGHT

DUST=[(R.uniform(0,W),R.uniform(0,H),R.uniform(.9,2.6),R.uniform(.10,.42),R.uniform(-7,7),R.uniform(-16,-3))
      for _ in range(620)]
VIG=None
def vignette():
    global VIG
    if VIG is None:
        y,x=np.mgrid[0:H,0:W].astype(np.float32)
        d=np.sqrt(((x/W)-.5)**2+(((y/H)-.46)*.84)**2)
        VIG=np.clip(1.-0.92*np.clip((d/0.74)**2.0,0,1),0,1)[:,:,None]
    return VIG

def plate(t):
    a=np.zeros((H,W,3),np.float32)+np.array([5.,4.,5.])
    g=np.asarray(warped_grid(t)).astype(np.float32)/255.
    a+=g[:,:,None]*np.array([175.,26.,16.])
    sm=Image.fromarray((np.clip(smoke(t),0,1)*255).astype(np.uint8)).resize((W,H),Image.BICUBIC)
    sm=np.asarray(sm.filter(ImageFilter.GaussianBlur(3.0))).astype(np.float32)/255.
    a+=sm[:,:,None]*np.array([104.,31.,20.])
    # warm streak from the upper right
    yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
    st=np.exp(-((xx*0.86+yy*0.52-1520)/210.)**2)*np.clip(1.-yy/H*1.25,0,1)
    a+=st[:,:,None]*np.array([150.,58.,30.])
    d=Image.new("L",(W,H),0); dd=ImageDraw.Draw(d)
    for x0,y0,r,br,vx,vy in DUST:
        x=(x0+vx*t)%W; y=(y0+vy*t)%H
        dd.ellipse([x-r,y-r,x+r,y+r],fill=int(255*br))
    a+=np.asarray(d).astype(np.float32)[:,:,None]/255.*np.array([170.,150.,140.])
    a*=vignette()
    return Image.fromarray(np.clip(a,0,255).astype(np.uint8)).convert("RGBA")
