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
