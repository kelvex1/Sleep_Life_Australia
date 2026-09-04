"""Turn iPhone screenshots into motion that doesn't read as stills.

The trick is not effects on each still - it is making the stills share a
continuous scroll with the real footage, at identical framing, so cuts between
video and stills are invisible.

1. MATCH THE FRAMING FIRST. Screenshots (1179 wide) and screen recordings
   (592 wide) are the same phone viewport at different sample rates, so both
   scale to 1080 and the site lands at identical apparent size. Crop the same
   chrome from each: 330px off the screenshot, 166px off the video (330/1.992).
   Get this wrong and every cut announces itself.

2. STACK, DON'T SLIDESHOW. Two screenshots stacked make one 4064px strip; a
   1920 window gliding down it reads as scrolling one page, not as two pictures.
   The seam between them passes as a section boundary - put a short vertical
   avgblur pulse on it and nobody sees the join.

3. RENDER IN FLOAT. Do the crop+scale per frame with PIL:
       strip.resize((1080,1920), BICUBIC, box=(x, y, x+w, y+h))
   with a float box. That is subpixel in one bicubic op. ffmpeg's zoompan
   rounds its crop offset to whole pixels every frame, which steps rather than
   glides and reads as handheld shake - it is what made v1 look broken.

4. MODULATE VELOCITY BY ROW DENSITY. Constant speed spends as long on a dark
   text block as on the hero image. Weight speed by per-row edge density
   (1/(0.35+1.6*Dn)), clamped to 0.45x..1.75x of mean so it never lurches.

5. GRADE DIM SECTIONS UP rather than racing past them. One screenshot came in
   at mean brightness 8.8 against 19.9 for its neighbours; gamma 0.62 x1.06
   brought it into line and cut the low-density frames from 1.23s to 0.77s.
   Velocity modulation alone could not fix it without breaking the motion.

6. GRAIN UNIFIES SOURCES. noise=alls=3:allf=p over the whole cut blends the
   soft 592-wide video with the crisp 1179-wide stills, and stops the stills
   reading as frozen. Use allf=p (spatial); allf=t is temporal and destroyed
   compression here - 124MB vs 13MB for the same 24s.
"""
