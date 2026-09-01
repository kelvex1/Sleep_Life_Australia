# Flow Scapes / Syvex social reel

Reproducible build for the 16.0s vertical (1080x1920) reel.

## Inputs
- `phone.mp4` — handheld shot of the laptop showing the site, with a dolly-in
- `src.mp4` — the website screen-recording (3052x1648)
- `music.mp3` — from `mix_music.sh`

## Structure
120 BPM. A bar is exactly 60 frames at 30fps, so every cut is frame-accurate
against the music — 480 frames, 16.000s, no drift.

| Out time | Bar | Segment | Framing |
|---|---|---|---|
| 0.0 – 4.0 | 1-2 | Phone opener, hook text (fades by 3.5) | full frame |
| **4.0** | **3** | **DROP** — white flash, match cut on the peak of the zoom | |
| 4.0 – 6.0 | 3 | Hero reveal — whole site at once | band |
| 6.0 – 8.0 | 4 | Services | full bleed |
| 8.0 – 10.0 | 5 | Before/after turf slider + caption | full bleed |
| 10.0 – 12.0 | 6 | Project gallery | full bleed |
| 12.0 – 14.0 | 7 | Contact / footer CTA | band |
| 14.0 – 16.0 | 8 | End card — DM 'WEBSITE' / syvex.xyz | static |

## Framing rules
The site content spans x=160..3017 of a 3052px-wide frame, so a full-bleed 9:16
crop (927px) loses about a third of every layout. Two treatments:

- **band** — whole site at full width (1080x618), padded to 1080x1920 with the
  site's own background `#030505`, so the padding reads as the page continuing
  rather than as a letterbox. Used where the layout is wide.
- **full bleed** — 927px 9:16 slice scaled up. Only on photo-led sections
  (before/after, gallery) where cropping costs nothing.

## Motion
Every shot is locked off. The only movement is the site's own scroll and the
dolly-in already in the phone footage.

Do not reintroduce `zoompan` for camera moves — it rounds its crop offset to
whole pixels each frame, so a slow zoom steps instead of glides and reads as
handheld shake. If a push is ever wanted, oversample and use a `crop` with a
time-varying offset, or bake it in-camera.

## Usage
    ./mix_music.sh      # -> music.mp3
    python3 build.py    # -> final.mp4

Needs ffmpeg, numpy, Pillow and Montserrat ExtraBold.

## Tweaks
- Hook copy / end card: top of `build.py`
- Cut timing: the `band()` / `fill()` call order (each is one bar)
- Source timestamps: the second arg of each `band()` / `fill()` call
- Tempo: `BPM` in `mk_music.py` — keep it a divisor of 3600 so bars stay
  whole frames at 30fps (120 works; 124 gives 58.06 frames/bar and drifts)

## Safe-area guard
`check()` fails the build if any glyph renders within 60px of a frame edge,
and `wrapfit()` derives the type size instead of assuming it.

This is not decoration. v2 hardcoded the hook's line breaks at 84pt, and
"you finally got a website" measures 1099px in a 1080px frame — it shipped
clipped at both edges, and no pixel-count or duration check caught it. The
build now prints the measured bounds of every text layer:

    HOOK size 80  lines ['you finally got a', 'website that converts']
    SAFE hook     x[  73..1005] y[1334..1589]
    SAFE caption  x[  75.. 521] y[1614..1713]
    SAFE endcard  x[ 144.. 933] y[ 661..1183]

Run against text-only layers, before scrims and glows are composited —
otherwise a full-width scrim makes every check pass trivially.

## v4 — mobile source

The desktop capture was abandoned. Measured, at 1080 wide:

| | desktop capture | iOS recording |
|---|---|---|
| Page height | 2,347px | 30,711px |
| Screens of scroll | 1.22 | 16.0 |
| Text cap height | ~17px (≈6pt on a phone) | ~46px |

A 3052px-wide layout squeezed into a 1080px frame is a 3.4x reduction — full
width means illegible, and legible means cropping a third of every layout off.
No framing choice escapes that. The mobile-width recording reflows the page and
removes the tradeoff.

Chrome is cropped by taking the longest *contiguous* run of changing rows
(rows 156–1280). Do not take the first changing row: the iOS clock ticks, so the
status bar reads as content and the Safari URL bar ends up stamped down the page.

Scroll pacing comes from `scroll_resample.py` — read the bug notes in it before
touching the offset search.

Structure is now: 4s phone opener (hook text, fades before the cut) → white
flash on the drop → 20s full-bleed scroll → ends on content. No captions, no CTA
card. 12 bars at 120 BPM = 24.000s.

## v5 — stills + real scroll

The live-scroll resample was abandoned: it made the site header flicker. Measured
on the source recordings, the header moves only 5% / 2% as much as the body — it
is stable. The flicker was the resampler jumping between non-adjacent frames and
catching the header mid hide/reveal. Played at natural speed the videos are fine.

Structure (24.000s, 12 bars at 120 BPM):

| Time | Source |
|---|---|
| 0–4s | handheld phone opener + hook, fades before the cut |
| **4s** | **drop — white flash** |
| 4–9s | Video 1, natural speed |
| 9–13s | strip A: 2 screenshots stacked, gliding scroll |
| 13–18s | Video 2, natural speed |
| 18–24s | strip B: 2 screenshots stacked, ends on the richest |

See `stills_to_motion.py` for why the stills read as motion.
