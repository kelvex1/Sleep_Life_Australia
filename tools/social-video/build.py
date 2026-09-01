"""Builds the 15.5s vertical reel. Needs src.mp4 (site screen-recording) + music.mp3."""
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter
SRC="src.mp4"; W,H=1080,1920; ACC=(178,255,51)   # accent sampled from the live site
MB="/usr/share/fonts/truetype/higgsfield/Montserrat-ExtraBold.ttf"

def run(c):
    r=subprocess.run(c,shell=True,capture_output=True,text=True)
    if r.returncode!=0:
        print("FAIL:",c[:180]); print(r.stderr[-1200:]); raise SystemExit(1)

beat=60.0/124.0; bar=4*beat
T=[0,2*bar,3*bar,4*bar,5*bar,6*bar,7*bar,8*bar]; D=0.20

def wrap(dr,txt,font,maxw):
    lines=[]; cur=""
    for w in txt.split():
        t=(cur+" "+w).strip()
        if dr.textlength(t,font=font)<=maxw: cur=t
        else:
            if cur: lines.append(cur)
            cur=w
    if cur: lines.append(cur)
    return lines

# ---- hook text ----
im=Image.new("RGBA",(W,H),(0,0,0,0)); dr=ImageDraw.Draw(im)
f=ImageFont.truetype(MB,92); fs=ImageFont.truetype(MB,44)
kw=dr.textlength("POV",font=fs)
dr.rounded_rectangle([W/2-kw/2-34,700,W/2+kw/2+34,778],radius=39,fill=ACC+(255,))
dr.text((W/2,739),"POV",font=fs,fill=(8,10,8,255),anchor="mm")
y=830
for ln in wrap(dr,"you finally got a website that converts",f,W-150):
    col=ACC+(255,) if "converts" in ln else (255,255,255,255)
    dr.text((W/2+3,y+59),ln,font=f,fill=(0,0,0,150),anchor="mm")
    dr.text((W/2,y+55),ln,font=f,fill=col,anchor="mm"); y+=110
im.save("t_hook.png")

# ---- mid caption ----
im=Image.new("RGBA",(W,H),(0,0,0,0)); dr=ImageDraw.Draw(im)
f2=ImageFont.truetype(MB,52); t="THIS IS WHAT CONVERTS"
tw=dr.textlength(t,font=f2)
dr.rounded_rectangle([W/2-tw/2-40,1540,W/2+tw/2+40,1646],radius=18,fill=(8,10,8,205))
dr.text((W/2,1593),t,font=f2,fill=ACC+(255,),anchor="mm"); im.save("t_mid.png")

# ---- end card ----
im=Image.new("RGB",(W,H),(8,10,8)); g=Image.new("RGB",(W,H),(8,10,8)); gd=ImageDraw.Draw(g)
gd.ellipse([W/2-620,H/2-520,W/2+620,H/2+520],fill=(30,52,12))
g=g.filter(ImageFilter.GaussianBlur(180)); im=Image.blend(im,g,0.85); dr=ImageDraw.Draw(im)
f1=ImageFont.truetype(MB,60); fb=ImageFont.truetype(MB,104); f3=ImageFont.truetype(MB,54)
dr.text((W/2,760),"WANT ONE LIKE THIS?",font=f1,fill=(255,255,255),anchor="mm")
dr.text((W/2,900),"DM US",font=fb,fill=(255,255,255),anchor="mm")
t="'WEBSITE'"; dr.text((W/2,1020),t,font=fb,fill=ACC,anchor="mm")
tw=dr.textlength(t,font=fb)
dr.rounded_rectangle([W/2-tw/2,1088,W/2+tw/2,1098],radius=5,fill=ACC)
dr.text((W/2,1240),"@syvex",font=f3,fill=(235,235,235),anchor="mm"); im.save("endcard.png")

GR="eq=contrast=1.06:saturation=1.12:brightness=0.01,vignette=PI/5"

def card(i,ss,dur,z0,z1):
    """Whole site as a bordered card floating over a blurred copy of itself."""
    vf=("[0:v]fps=30,scale=-2:1920,crop=1080:1920,boxblur=28:2,"
        "eq=brightness=-0.16:saturation=0.7[bg];"
        "[0:v]fps=30,scale=1032:-2,"+GR+",pad=1040:ih+8:4:4:0x%02X%02X%02X[cd];"
        "[bg][cd]overlay=(W-w)/2:(H-h)/2[cm];"
        "[cm]zoompan=z='%.4f+(%.4f)*on/%d':d=1:x='iw/2-(iw/zoom/2)':"
        "y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30[v]")%(
        ACC[0],ACC[1],ACC[2],z0,z1-z0,max(1,int(dur*30)-1))
    run('ffmpeg -v error -y -ss %.3f -t %.3f -i %s -filter_complex "%s" '
        '-map "[v]" -an -r 30 -c:v libx264 -preset medium -crf 17 '
        '-pix_fmt yuv420p s%d.mp4'%(ss,dur,SRC,vf,i))

def fill(i,ss,dur,cw,cx,cy,z0,z1,blur=0,dark=0.0,ov=None):
    """Punch into a 9:16 slice so it fills the frame. cw <= 927 (source is 3052x1648)."""
    ch=int(cw*16/9)
    pre="[0:v]fps=30,crop=%d:%d:%d:%d,scale=1440:2560:flags=lanczos,%s"%(cw,ch,cx,cy,GR)
    if blur: pre+=",gblur=sigma=%d"%blur
    if dark: pre+=",eq=brightness=%.2f"%(-dark)
    vf=pre+(",zoompan=z='%.4f+(%.4f)*on/%d':d=1:x='iw/2-(iw/zoom/2)':"
            "y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30[v]")%(z0,z1-z0,max(1,int(dur*30)-1))
    ex=""
    if ov:
        vf=vf.replace("[v]","[vz]")+";[vz][1:v]overlay=0:0[v]"; ex=" -i "+ov
    run('ffmpeg -v error -y -ss %.3f -t %.3f -i %s%s -filter_complex "%s" '
        '-map "[v]" -an -r 30 -c:v libx264 -preset medium -crf 17 '
        '-pix_fmt yuv420p s%d.mp4'%(ss,dur,SRC,ex,vf,i))

L=[T[i+1]-T[i]+0.45 for i in range(7)]   # +0.45 headroom for the xfades
fill(0, 0.6,L[0],620,1500,300,1.30,1.06,blur=9,dark=0.20,ov="t_hook.png")  # hook
card(1, 0.6,L[1],1.10,1.00)                                               # reveal (drop)
card(2, 5.2,L[2],1.00,1.07)                                               # services
fill(3,12.0,L[3],927,1062,0,1.00,1.10,ov="t_mid.png")                     # before/after
card(4,19.2,L[4],1.07,1.00)                                               # gallery
card(5,38.3,L[5],1.00,1.08)                                               # contact/footer
run("ffmpeg -v error -y -loop 1 -t %.3f -i endcard.png -vf \"fps=30,"
    "zoompan=z='1.0+0.06*on/%d':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
    "s=1080x1920:fps=30\" -an -r 30 -c:v libx264 -preset medium -crf 17 "
    "-pix_fmt yuv420p s6.mp4"%(L[6],max(1,int(L[6]*30)-1)))

TR=["fadewhite","slideup","zoomin","slideup","slideup","fadeblack"]
ins="".join(" -i s%d.mp4"%i for i in range(7)); fc=""; cur="0:v"
for k in range(6):
    fc+="[%s][%d:v]xfade=transition=%s:duration=%.3f:offset=%.3f[x%d];"%(
        cur,k+1,TR[k],D,T[k+1]-D/2,k)
    cur="x%d"%k
fc+="[%s]trim=0:%.3f,setpts=PTS-STARTPTS,format=yuv420p[v]"%(cur,T[7])
run('ffmpeg -v error -y%s -i music.mp3 -filter_complex "%s" -map "[v]" -map 7:a '
    '-c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -profile:v high -level 4.1 '
    '-c:a aac -b:a 192k -ar 44100 -movflags +faststart -t %.3f final.mp4'%(ins,fc,T[7]))
print("BUILD_OK")
