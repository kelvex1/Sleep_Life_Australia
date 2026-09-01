"""Builds the 16.0s vertical reel (1080x1920).

Inputs: src.mp4 (site screen-recording), phone.mp4 (handheld opener), music.mp3

120 BPM => a bar is exactly 60 frames at 30fps, so every cut is frame-accurate
and never drifts against the music.

No zoompan anywhere. Every shot is locked off; the only movement in the cut is
the site's own scroll and the dolly-in already present in the phone footage.
(v1 put a slow zoompan on each segment - ffmpeg rounds its crop offset to whole
pixels per frame, so it stepped rather than glided and read as handheld shake.)
"""
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W,H=1080,1920
ACC=(178,255,51)     # neon lime, sampled from the live site
BG=(3,5,5)           # the site's own background, so bands read as continuous
MB="/usr/share/fonts/truetype/higgsfield/Montserrat-ExtraBold.ttf"
SITE="src.mp4"; PHONE="phone.mp4"

def run(c):
    r=subprocess.run(c,shell=True,capture_output=True,text=True)
    if r.returncode!=0:
        print("FAIL:",c[:200]); print(r.stderr[-1500:]); raise SystemExit(1)

def ls(dr,cx,y,txt,font,fill,sp=6,left=None):
    """Letterspaced text; returns total width."""
    ws=[dr.textlength(ch,font=font) for ch in txt]
    tot=sum(ws)+sp*(len(txt)-1)
    x=(cx-tot/2) if left is None else left
    for ch,w in zip(txt,ws):
        dr.text((x,y),ch,font=font,fill=fill,anchor="lm"); x+=w+sp
    return tot

# ---- hook, lower third over the phone shot (fades out before the cut) ----
im=Image.new("RGBA",(W,H),(0,0,0,0))
fk=ImageFont.truetype(MB,38); fh=ImageFont.truetype(MB,84)
sh=Image.new("RGBA",(W,H),(0,0,0,0)); sd=ImageDraw.Draw(sh)
sd.rectangle([0,1180,W,H],fill=(0,0,0,120))
im=Image.alpha_composite(im,sh.filter(ImageFilter.GaussianBlur(60)))
dr=ImageDraw.Draw(im)
ls(dr,W/2,1330,"POV",fk,ACC+(255,),sp=14)
for i,(t,col) in enumerate([("you finally got a website",(255,255,255,255)),
                            ("that converts",ACC+(255,))]):
    y=1440+i*104
    dr.text((W/2+2,y+3),t,font=fh,fill=(0,0,0,170),anchor="mm")
    dr.text((W/2,y),t,font=fh,fill=col,anchor="mm")
im.save("t_hook.png")

# ---- caption over the before/after ----
im=Image.new("RGBA",(W,H),(0,0,0,0)); dr=ImageDraw.Draw(im)
fc=ImageFont.truetype(MB,46)
for i,(t,col) in enumerate([("NOT JUST PRETTY.",(255,255,255,255)),
                            ("BUILT TO SELL.",ACC+(255,))]):
    y=1630+i*66
    dr.text((72+2,y+3),t,font=fc,fill=(0,0,0,190),anchor="lm")
    dr.text((72,y),t,font=fc,fill=col,anchor="lm")
im.save("t_cap.png")

# ---- end card ----
im=Image.new("RGB",(W,H),BG)
g=Image.new("RGB",(W,H),BG); gd=ImageDraw.Draw(g)
gd.ellipse([W/2-560,1250,W/2+560,2150],fill=(38,64,14))   # echoes the site's CTA glow
im=Image.blend(im,g.filter(ImageFilter.GaussianBlur(200)),0.9)
dr=ImageDraw.Draw(im)
f1=ImageFont.truetype(MB,86); f2=ImageFont.truetype(MB,56); f3=ImageFont.truetype(MB,46)
dr.text((W/2,700),"your competitors",font=f1,fill=(255,255,255),anchor="mm")
dr.text((W/2,806),"don't have this.",font=f1,fill=ACC,anchor="mm")
dr.rounded_rectangle([W/2-90,946,W/2+90,952],radius=3,fill=ACC)
dr.text((W/2,1064),"DM 'WEBSITE'",font=f2,fill=(255,255,255),anchor="mm")
ls(dr,W/2,1158,"syvex.xyz",f3,ACC,sp=5)
im.save("endcard.png")

GRS="eq=contrast=1.04:saturation=1.10"

def band(i,ss):
    """Whole site across the full width, padded with the site's own bg colour.
    Used where the layout is wide and cropping would cut it."""
    vf=("[0:v]fps=30,crop=2880:1648:150:0,scale=1080:618:flags=lanczos,"+GRS+
        ",pad=1080:1920:0:651:0x%02X%02X%02X[v]")%BG
    run('ffmpeg -v error -y -ss %.3f -t 2.4 -i %s -filter_complex "%s" -map "[v]" -an '
        '-r 30 -frames:v 60 -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p '
        's%d.mp4'%(ss,SITE,vf,i))

def fill(i,ss,cx,ov=None):
    """Full-bleed 9:16 slice. Only used on photo-led sections where cropping is safe."""
    vf="[0:v]fps=30,crop=927:1648:%d:0,scale=1080:1920:flags=lanczos,%s[v]"%(cx,GRS)
    ex=""
    if ov:
        vf=vf.replace("[v]","[vv]")+";[vv][1:v]overlay=0:0[v]"; ex=" -loop 1 -t 2.4 -i "+ov
    run('ffmpeg -v error -y -ss %.3f -t 2.4 -i %s%s -filter_complex "%s" -map "[v]" -an '
        '-r 30 -frames:v 60 -c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p '
        's%d.mp4'%(ss,SITE,ex,vf,i))

# 0: phone opener. 4.95s of action (wide -> dolly-in -> screen fills frame)
# eased to exactly 4.00s so the peak of the zoom lands on the drop.
run('ffmpeg -v error -y -ss 0.60 -t 4.95 -i %s -loop 1 -t 4.2 -i t_hook.png -filter_complex '
    '"[0:v]fps=60,setpts=PTS/1.2375,fps=30,scale=1080:1920:flags=lanczos,unsharp=5:5:0.7,'
    'eq=contrast=1.08:saturation=1.06[p];'
    '[1:v]format=rgba,fade=t=in:st=0.20:d=0.35:alpha=1,fade=t=out:st=2.95:d=0.55:alpha=1[tx];'
    '[p][tx]overlay=0:0[v]" -map "[v]" -an -r 30 -frames:v 120 '
    '-c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p s0.mp4'%PHONE)
band(1, 0.8)                      # hero reveal - whole site at once
fill(2, 5.2, 1490)                # services
fill(3,12.2, 1062, ov="t_cap.png")# before/after turf slider
fill(4,19.2,  930)                # project gallery
band(5,38.3)                      # contact / footer CTA
run('ffmpeg -v error -y -loop 1 -t 2.4 -i endcard.png -vf fps=30 -an -r 30 -frames:v 60 '
    '-c:v libx264 -preset medium -crf 17 -pix_fmt yuv420p s6.mp4')

# Hard cuts throughout; the only effect is a 0.1s white flash on the drop.
ins="".join(" -i s%d.mp4"%i for i in range(7))
cc="".join("[%d:v]"%i for i in range(7))
fc=(cc+"concat=n=7:v=1:a=0[cat];[cat]eq=brightness='if(between(t,4.0,4.10),"
    "0.55*(1-(t-4.0)/0.10),0)':eval=frame,format=yuv420p[v]")
run('ffmpeg -v error -y%s -i music.mp3 -filter_complex "%s" -map "[v]" -map 7:a '
    '-c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high -level 4.1 '
    '-c:a aac -b:a 192k -ar 44100 -movflags +faststart -t 16.0 final.mp4'%(ins,fc))
print("BUILD_OK")
