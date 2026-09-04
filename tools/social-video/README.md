# Syvex video toolkit

Everything needed to build the orbiting-handset website reels, so a new session
starts at "make the ad" instead of rebuilding the pipeline.

## What it does

A phone orbits on a dark reflective floor in red/black smoke. Client websites
sit on its screen and swipe between each other like a carousel. 1080x1920, the
length is whatever the beat grid adds up to.

The one idea worth keeping: **the screen is never rendered in 3D.** The rig
renders the handset with a near-black screen, so the plate carries only glass
reflections, and exports the screen's four corners for every frame. The website
is warped onto those corners afterwards at full resolution. That is why the type
stays sharp instead of turning to mush, and it is also why generative video
cannot do this job - diffusion models cannot hold text below about 40px.

## Layout

    rig/     phone.html   the handset + orbit, three.js, tunable from the URL
             render.py    headless-WebGL driver -> frames/ + corners.json
    comp/    comp.py      the compositor: smoke, plate, screen, type, grade
             smoke.py     procedural red/black fBm smoke
             page.py      stitches a screen recording into one tall page image
             grit.py      type with a printed speckle
    pages/   n1..n6.png   stitched client pages (see "Source material")
    fonts/   Archivo

## Build

    cd rig  && python3 render.py --out frames --w 540 --h 960   # ~3 s
    cd comp && python3 comp.py full                             # writes final_v.mp4

Preview a few moments without rendering the lot:

    python3 comp.py sample 1.2 7.6 16.4        # -> comp/sf/*.jpg

Override paths and the smoke level with `SYVEX_RIG`, `SYVEX_PAGES`, `SYVEX_SMOKE`.

## Tuning the look

Every material knob is a URL parameter, so a sweep is one render each and a
render is about three seconds. Judge them by rendering the full loop and looking
at four frames - a single frame will not tell you whether a highlight *moves*,
and movement is most of what makes it feel real.

    python3 render.py --page "phone.html?boxI=9&boxW=3.5&boxZ=30" --out /tmp/try

| knob | does |
|---|---|
| `railR` `railE` | rail roughness / environment intensity |
| `scrCR` `scrE` | screen clearcoat roughness / environment intensity |
| `boxI boxW boxH boxX boxY boxZ` | the strip light that puts the sheen on the glass |
| `expo` | tone-mapping exposure |
| `debug=env` `debug=chrome` | show the environment map, or a chrome probe in it |

Two things learned the hard way:

- **Place the strip light by the mirror geometry, not by eye.** For a flat screen
  the reflected direction from the centre is `reflect(P - C, n)`. Guessing put it
  on the wrong side of the scene for several rounds.
- **Closer and bigger is not brighter, it is flatter.** A large source subtends a
  wide angle and floods the glass to uniform grey. Small, far and bright gives a
  streak that moves as the camera orbits.

## Why WebGL and not Cycles

The rig started in Blender. Same scene, same camera path, measured on this
hardware (4 cores, no GPU):

| | 150 frames |
|---|---|
| Cycles CPU | 65 min |
| three.js / SwiftShader | 2.7 s |

Roughly 1,400x. The point is not the render time, it is that trying eight camera
moves becomes possible, and that is where quality actually comes from.

The trade is real: no path tracing, so no true global illumination or caustics.
An environment map stands in for bounced light. For a product on a plinth the gap
is small. Fall back to Blender for a hero shot where bounced light matters.

Blender notes for this environment: Cycles CPU only, EEVEE unavailable (no
libEGL), and this `bpy` wheel ships no OpenImageDenoise - the denoiser list is
empty, so low-sample renders cannot be cleaned up.

## Source material

`page.py` stitches a screen recording into one continuous page: it estimates the
scroll offset between frames and pastes only the newly revealed strip, so sticky
headers are not stamped repeatedly.

**Recordings are usually the bottleneck, not the renderer.** Every clip supplied
so far travelled under a third of one screen - measure before planning a scroll:

    python3 page.py        # prints page height in viewports per clip

Under about 1.4 viewports there is nothing to scroll and the swipe carousel is
the right format. For real scrolling, capture whole pages instead: iPhone Safari
screenshot -> **Full Page** -> Save PDF, or Chrome device mode -> `Cmd+Shift+P` ->
"Capture full size screenshot".

## Environment

- No GPU. Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`;
  pass `executable_path`, and launch with
  `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.
- ES modules will not load over `file://` - `render.py` serves the rig over
  loopback HTTP. Without that the page simply never becomes ready.
- `canvas.toDataURL` needs `preserveDrawingBuffer: true` or every frame is empty.
- Most of the internet is blocked by the egress policy, **but npm and PyPI are
  not** - that is how three.js gets here. Do not try to route around the block.
