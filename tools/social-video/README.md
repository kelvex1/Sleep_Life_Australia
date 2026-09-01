# Flow Scapes / Syvex social reel

Reproducible build for the 15.5s vertical (1080x1920) reel cut from the
Flow Scapes website screen-recording.

## Structure
124 BPM, 8 bars. Every cut lands on a bar line; the site reveal lands on the drop.

| Out time | Bar | Segment |
|---|---|---|
| 0.000 - 3.871 | 1-2 | Hook: blurred/darkened punch-in on hero + "POV..." text |
| 3.871 | 3 | **DROP** - white flash, full site reveal |
| 3.871 - 5.806 | 3 | Hero, framed card |
| 5.806 - 7.742 | 4 | Services scroll |
| 7.742 - 9.677 | 5 | Before/after turf slider + "THIS IS WHAT CONVERTS" |
| 9.677 - 11.613 | 6 | Project gallery |
| 11.613 - 13.548 | 7 | Contact / footer CTA |
| 13.548 - 15.484 | 8 | End card - DM 'WEBSITE' / @syvex |

Accent `#B2FF33` is sampled from the live site.

## Usage
    python3 mk_music.py          # -> music.mp3 (124 BPM house bed)
    python3 build.py             # needs src.mp4 + music.mp3 -> final.mp4

`src.mp4` is the website screen-recording. Both scripts run anywhere with
ffmpeg, numpy and Pillow (they were run in the Higgsfield sandbox).

## Tweaks
- Hook copy: `hook_png()` in build.py
- Cut timing: `T` list (bar multiples) in build.py
- Transitions: `TR` list in build.py
- Tempo / drop position: `BPM` in mk_music.py (drop = bar 3)
