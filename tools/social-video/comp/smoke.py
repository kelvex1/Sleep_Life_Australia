import numpy as np
from PIL import Image, ImageFilter
W,H=1080,1920
SW,SH=270,480
def _oct(res,seed):
    a=np.random.RandomState(seed).rand(res,res).astype(np.float32)
    return np.asarray(Image.fromarray((a*255).astype(np.uint8))
                      .resize((SW*2,SH*2),Image.BICUBIC)).astype(np.float32)/255.
# five octaves drifting at different speeds - that layering is what reads as volume
OCT=[(_oct(4,41),.46,(2.6,1.3)),(_oct(8,42),.26,(-4.4,2.1)),(_oct(16,43),.16,(6.5,-3.2)),
     (_oct(31,44),.08,(-9.,4.4)),(_oct(58,45),.04,(13.,-6.))]
yy,xx=np.mgrid[0:SH,0:SW].astype(np.float32)
u,v=xx/SW,yy/SH
def bed(cx,cy,r,sq=.70,p=1.7):
    d=np.sqrt((u-cx)**2+((v-cy)*sq)**2)
    return np.clip(1.-(d/r)**p,0,1)
# syvex: crimson right, deep oxblood left, one ember warm low - black everywhere else
BEDS=[((238,28,16), 1.06,.28,.74,2.0),
      ((172,18,11),  .92,.70,.58,1.8),
      ((116,11,9),  -.06,.42,.66,1.9),
      ((196,44,14),  .52,1.06,.46,1.7),
      (( 62, 7, 7),  .14,.82,.52,1.8),
      ((148,16,10), 1.02,-.10,.50,1.8)]
FIELDS=[(np.array(c,np.float32),bed(x,y,r,p=p)) for c,x,y,r,p in BEDS]
CORE=bed(.50,.46,.56,.80,1.9)
# smoke sits low and to the sides; the top of frame stays near-black
VERT=np.clip((v+.30)/1.10,0,1)**.60*.46+.54
def density(t):
    f=np.zeros((SH,SW),np.float32)
    for tex,amp,(vx,vy) in OCT:
        ox=int((t*vx)%SW); oy=int((t*vy)%SH)
        f+=amp*tex[oy:oy+SH,ox:ox+SW]
    f=(f-f.min())/(f.max()-f.min()+1e-6)
    return np.clip((f-.545)*2.55,0,1)**1.55
def smoke(t,bright=1.0):
    d=density(t)
    img=np.zeros((SH,SW,3),np.float32)
    for col,fl in FIELDS:
        img+=(col/255.)[None,None,:]*((d*.86+.14)*fl)[:,:,None]
    img*=(1.-CORE*0.72)[:,:,None]          # keep the centre black for the phone
    img*=VERT[:,:,None]
    img+=(CORE*d*0.16)[:,:,None]*np.array([.30,.05,.04],np.float32)
    img*=0.93*bright
    img=1.-np.exp(-img*1.28)                      # soft shoulder, saturates not clips
    # the hottest wisps drift toward warm ash instead of clipping to flat red
    L=img.max(axis=2)
    img=img+(L**3.2)[:,:,None]*np.array([.0,.115,.085],np.float32)
    big=Image.fromarray((np.clip(img,0,1)*255).astype(np.uint8)).resize((W,H),Image.BICUBIC)
    return np.asarray(big.filter(ImageFilter.GaussianBlur(2.6))).astype(np.float32)
if __name__=="__main__":
    for i,t in enumerate([0.,4.,8.]):
        Image.fromarray(np.clip(smoke(t),0,255).astype(np.uint8)).save(f"sm{i}.jpg",quality=93)
    print("ok")
