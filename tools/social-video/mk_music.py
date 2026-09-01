"""124 BPM house bed for the Flow Scapes reel. 8 bars, drop on bar 3 (3.871s)."""
import numpy as np, wave
SR=44100; BPM=124.0
beat=60.0/BPM; bar=4*beat; BARS=8; DUR=BARS*bar
N=int(DUR*SR)+SR
music=np.zeros(N); fx=np.zeros(N)
R=np.random.RandomState(3)

def add(buf,sig,at):
    i=int(at*SR)
    if i>=len(buf): return
    e=min(len(buf),i+len(sig)); buf[i:e]+=sig[:e-i]

def kick(v=1.0):
    n=int(0.45*SR); k=np.arange(n)/SR
    f=45+110*np.exp(-k/0.030)
    ph=2*np.pi*np.cumsum(f)/SR
    body=np.sin(ph)*np.exp(-k/0.15)
    click=R.randn(n)*np.exp(-k/0.0015)*0.30
    return (body+click)*v

def hat(v=1.0,dec=0.030):
    n=int(0.12*SR); k=np.arange(n)/SR
    nz=R.randn(n); hp=np.diff(np.diff(nz,prepend=nz[0]),prepend=nz[0])
    return hp*np.exp(-k/dec)*0.085*v

def clap(v=1.0):
    n=int(0.40*SR); k=np.arange(n)/SR
    nz=R.randn(n); hp=np.diff(nz,prepend=nz[0])
    body=hp*np.exp(-k/0.11); out=np.zeros(n)
    for off,g in [(0,0.5),(0.009,0.8),(0.019,1.0),(0.030,0.65)]:
        i=int(off*SR); out[i:]+=body[:n-i]*g
    return out*0.13*v

def crash(v=1.0):
    n=int(2.2*SR); k=np.arange(n)/SR
    nz=R.randn(n); hp=np.diff(nz,prepend=nz[0])
    return hp*np.exp(-k/0.75)*0.075*v

def saw(f,n,det=0.0):
    k=np.arange(n)/SR; ph=2*np.pi*f*(1+det)*k
    out=np.zeros(n); h=1
    while f*h<11000 and h<=12:
        out+=np.sin(ph*h)/h; h+=1
    return out*(2/np.pi)

def chord(fr,dur,amp=1.0,att=0.005,rel=0.30):
    n=int(dur*SR); out=np.zeros(n)
    for f in fr:
        for d in (-0.005,0.0,0.005): out+=saw(f,n,d)
    out/=(len(fr)*3); k=np.arange(n)/SR
    return out*np.minimum(k/att,1.0)*np.exp(-k/rel)*amp

def sub(f,dur,amp=1.0):
    n=int(dur*SR); k=np.arange(n)/SR
    e=np.minimum(k/0.004,1.0)*np.exp(-k/(dur*0.55))
    return (np.sin(2*np.pi*f*k)+0.18*np.sin(4*np.pi*f*k))*e*amp

F=[349.23,440.00,523.25]; G=[392.00,493.88,587.33]; Am=[440.00,523.25,659.26]
PROG=[Am,F,F,G,Am,Am,F,G]
ROOT=[110.0,87.31,87.31,98.0,110.0,110.0,87.31,98.0]
DROP=2*bar

for b in range(BARS):
    t0=b*bar; ch=PROG[b]; rt=ROOT[b]
    add(music,chord(ch,bar*1.02,amp=0.30 if b<2 else 0.22,
                    att=0.35 if b<2 else 0.01,rel=1.2 if b<2 else 0.9),t0)
    if b>=1:
        for i in range(4): add(music,kick(0.85 if b==1 else 1.0),t0+i*beat)
    for i in range(4):
        add(music,hat(0.55 if b<2 else 1.0),t0+i*beat+beat/2)
        if b>=2: add(music,hat(0.35,dec=0.018),t0+i*beat+beat*0.25)
    if b>=2:
        add(music,clap(),t0+beat); add(music,clap(),t0+3*beat)
        for i in range(4):
            add(music,sub(rt,beat*0.46,0.55),t0+i*beat+beat/2)
            add(music,chord(ch,beat*0.42,amp=0.20,att=0.004,rel=0.10),t0+i*beat+beat/2)
    else:
        add(music,sub(rt,beat*1.6,0.30),t0)

# riser through bar 2, crash + sub impact on the drop
rn=int(bar*SR); k=np.arange(rn)/SR; ramp=(k/bar)**2.2
f0,f1=280.0,3200.0
ph=2*np.pi*f0*((f1/f0)**(k/bar)-1)*bar/np.log(f1/f0)
nz=R.randn(rn); hp=np.diff(nz,prepend=nz[0])
add(fx,(np.sin(ph)*0.16+hp*0.10)*ramp,bar)
add(fx,crash(),DROP)
n2=int(0.9*SR); k2=np.arange(n2)/SR
add(fx,np.sin(2*np.pi*np.cumsum(28+45*np.exp(-k2/0.08))/SR)*np.exp(-k2/0.22)*0.55,DROP)

# lowpass automation: closed through the intro, opens on the drop
cmds=[]
for i in range(60):
    tt=DROP*i/59.0
    fc=320.0 if tt<bar else 320.0*(9000.0/320.0)**(((tt-bar)/bar)**1.7)
    cmds.append("%.3f lowpass frequency %.0f"%(tt,fc))
cmds.append("%.3f lowpass frequency 20000"%DROP)
cmds.append("%.3f lowpass frequency 20000"%(DUR-bar*0.5))
cmds.append("%.3f lowpass frequency 6000"%DUR)
open("cmds.txt","w").write(";\n".join(cmds)+";\n")

def wr(path,x):
    x=np.clip(x,-1,1); d=(x*32767).astype("<i2")
    w=wave.open(path,"w"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(d.tobytes()); w.close()
wr("music.wav",music*0.55); wr("fx.wav",fx*0.8)
print("dur",DUR,"drop",DROP)
