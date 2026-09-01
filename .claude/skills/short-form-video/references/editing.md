# Editing craft and specific traps

Read this before writing any code that moves an image. Each item below cost a rebuild.

## Contents
- [Smooth motion: never zoompan](#smooth-motion-never-zoompan)
- [Matching framing across sources](#matching-framing-across-sources)
- [Making stills read as motion](#making-stills-read-as-motion)
- [Beat grid and frame-exact timing](#beat-grid-and-frame-exact-timing)
- [Pacing by content density](#pacing-by-content-density)
- [Grain, size, and blending sources](#grain-size-and-blending-sources)
- [Cropping phone chrome](#cropping-phone-chrome)
- [Tracking scroll in a screen recording](#tracking-scroll-in-a-screen-recording)
- [Verification checklist](#verification-checklist)

## Smooth motion: never zoompan

`zoompan` rounds its crop offset to whole pixels every frame. A slow zoom therefore
*steps* rather than glides, and at 30fps that reads as handheld shake. It is the single
most common cause of "why does the camera wobble".

Render camera moves yourself with a float box. PIL does sub-pixel crop and scale in one
bicubic operation:

```python
# page/strip is a tall PIL image; y and z are floats
h = 1920.0 / z
w = 1080.0 / z
x = (1080.0 - w) / 2.0
frame = strip.resize((1080, 1920), Image.BICUBIC, box=(x, y, x + w, y + h))
```

Pipe frames to ffmpeg as rawvideo. Typical measured jerk (max second difference of
per-frame motion) lands around 5-6, versus visible stepping from zoompan.

If you must stay in ffmpeg, oversample heavily and use `crop` with a time-varying offset
so the rounding error is sub-pixel after downscale — but rendering in float is simpler
and exact.

## Matching framing across sources

Before cutting between a screen recording and a screenshot of the same site, make the
site land at identical apparent scale in both. They are usually the same viewport at
different sample rates:

```
screenshot 1179 wide, recording 592 wide  -> ratio 1.992
crop 330px of chrome off the screenshot   -> crop 330/1.992 = 166px off the video
both scale to 1080 wide -> identical apparent size
```

Get this wrong and every cut announces itself; no transition length hides a scale jump.

## Making stills read as motion

Do not animate each still separately — that reads as a slideshow however good the
transitions are. Instead **stack** consecutive stills into one tall strip and glide a
1920-tall window down it. Two 2032px stills make a 4064px strip with 2144px of travel;
the join passes as a section boundary. Put a short vertical blur pulse on the moment the
join crosses frame (`avgblur=sizeX=1:sizeY=22:enable='between(t,10.93,11.04)'`) and it
disappears.

A slight scale drift (1.000 -> 1.018 across the segment) adds life without reading as a
zoom. Keep it small; anything larger looks like a Ken Burns template.

## Beat grid and frame-exact timing

Pick a tempo whose bar is a whole number of frames, or cuts drift against the music:

```
120 BPM @30fps -> bar = 2.000s = 60 frames   exact
124 BPM @30fps -> bar = 1.935s = 58.06       drifts
```

Choose BPM so that `3600 / BPM` is an integer. Render segments with `-frames:v N`
rather than `-t`, so segment lengths are exact and concatenation cannot accumulate error.

## Pacing by content density

Constant velocity spends as long on empty space as on the hero image. Weight scroll speed
by per-row edge density and clamp it so it never lurches:

```python
speed = 1.0 / (0.35 + 1.6 * Dn)          # Dn = normalised density, 0..1
step  = np.clip(np.diff(Yp), mean*0.45, mean*1.75)
```

Two cautions. Use **edge density**, not pixel-difference-from-background — the latter
scores white-on-dark text as empty and will make you race past readable copy. And when a
section is merely dim rather than empty, grading its shadows up (gamma ~0.62) beats
speeding past it: on real material that cut low-density frames from 1.23s to 0.77s where
velocity modulation alone could not, without disturbing the motion.

## Grain, size, and blending sources

Light grain over the finished cut blends soft upscaled video against crisp stills and
stops stills reading as frozen. Use **spatial** grain:

```
noise=alls=3:allf=p     ->  13 MB for 24s
noise=alls=5:allf=t     -> 124 MB for the same 24s   (temporal grain kills compression)
```

Sanity-check output size. A 24s 1080x1920 clip should land in the 10-20 MB range; if it
is an order of magnitude larger, something in the filter chain is defeating the encoder.

## Cropping phone chrome

Screen recordings and screenshots carry an iOS status bar and browser UI that instantly
say "this is a screenshot". Find the boundary by difference, not by guessing:

- **Video:** take the longest *contiguous* run of rows that change over time. Do not take
  the first changing row — the clock ticks, so the status bar reads as content and you
  will keep the URL bar.
- **Stills:** diff two different screenshots of the same site. Identical rows are chrome.

Keeping the site's own nav is usually good — it reads as one continuous browsing session.
Keeping the browser's URL bar never is.

## Tracking scroll in a screen recording

To resample a hand-scrolled recording to constant velocity, estimate each frame's page
position by SAD over a band, accumulate, then pick for each output position the source
frame whose position is within the slack (frame height minus 1920), preferring the latest
such frame — it has had most time for lazy-loaded images and entry animations.

Two bugs to avoid, both of which silently halve or destroy the measured page:

- **Search both directions.** `range(0, MAXD+1)` finds only downward scroll; phone
  momentum and rubber-band bounce produce upward frames, and forcing those to >= 0 makes
  the error accumulate.
- **Search on the full-height frame.** If you crop to the content window first, a
  `if s0 < 0: continue` guard rejects every shift larger than the top margin.

Sanity checks: `exact` fraction near 1.0, span in screens, residual well below the
no-shift baseline, and near-monotonic accumulated position.

**Know when not to do this at all.** Resampling jumps between non-adjacent frames, which
catches any scroll-triggered UI (a header that hides and reveals) mid-animation and makes
it flicker. If the source has such an element, play the footage at natural speed instead.
Check first: compare frame-to-frame change in the header band against the body. If the
header moves only a few percent as much as the body, it is stable in the source and any
flicker you see is yours.

## Verification checklist

Run these, then look at the contact sheet again:

- duration and frame count exact
- cuts land where intended (`select='gt(scene,0.3)',showinfo`)
- no dead stretches — edge density, never pixel-difference density
- ends on content, not on a page's dead footer
- type inside the safe area (nothing within ~60px of any edge), checked on a text-only
  layer before scrims are composited
- motion smooth: no spikes in the second difference of per-frame motion
- file size sane
