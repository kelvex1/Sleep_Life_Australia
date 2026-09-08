# Rockhampton Mobile Auto Electrics concept site

A self-contained demo built to win the Wednesday sit-down. It lives entirely under
`app/rockhampton/` and `public/rmae/` and shares nothing with the Sleep Life Australia
pages. No shared components, no shared CSS, no changes to the existing routes.

| | |
|---|---|
| Website | `/rockhampton` |
| Owner dashboard | `/rockhampton/admin` |

## The demo to run in the meeting

1. Open `/rockhampton`. Let the hero video and the headline animate in.
2. Scroll slowly. The two wiring looms down the page margins are drawn by scroll
   position, with a current pulse chasing along them.
3. Drag the ute in "If it runs on volts, it's our problem" to spin it, and tap the six
   hotspots. It is a real 3D model, not a video or a sprite sheet.
4. Fill in the hero enquiry form with *his* name and number and hit send.
5. Click **See it land in the dashboard**. His enquiry is sitting at the top of the
   list, flashing orange, tagged NEW and TODAY.
6. Hit **Move to Quoted** on his row and show the pipeline bars update.

That last loop is the pitch: the website is not a brochure, it is the front door to a
job list.

## The 3D rig

The section runs the supplied Toyota Hilux 4WD glTF in WebGL. `_lib/uteViewer.ts`
sets up the scene, lights and camera; `_components/Rig.tsx` mounts it and keeps the
hotspots in step.

Three things worth knowing if you touch it:

- **three.js is vendored, not loaded from a CDN.** `public/rmae/vendor/` holds
  `three.min.js`, `GLTFLoader.js` and `meshopt_decoder.js`. The preview sandbox blocks
  third-party scripts, and shipping them with the site means one code path that can
  actually be tested rather than two that cannot.
- **The model is meshopt-compressed.** The source is 10.5MB: 228k triangles across 48
  separate shells, plus a 120k-segment wireframe overlay carried as LINES primitives.
  Quadric simplification barely moves it, because the simplifier will not collapse
  across shell boundaries. Dropping the overlay and compressing takes it to 1.3MB with
  the detail intact. `scripts/slim-ute.mjs` is the pipeline.
- **Everything is lazy.** An IntersectionObserver holds off loading the library and the
  model until the section is within 300px of the viewport, so the landing page is not
  paying 2MB for something below the fold.

On the centred model the nose sits at z=+2.7 and the tail at z=-2.7, so no turnaround
is needed: the camera simply starts on the +z side. Hotspot anchors were measured off a
side-on render at 153px per metre and sit on the centreline, so each stays on its own
panel from every angle as the model turns. They are DOM buttons projected through the
camera each frame, so they stay keyboard reachable and fade out when they pass behind
the vehicle.

**Two gestures, decided on pointerdown.** A raycast on press asks whether the pointer
landed on the vehicle: if it did, the drag spins it; if it landed on empty space, the
drag slides the whole view in the camera's screen plane, so the ute tracks the pointer
one to one. The mode is fixed for the life of the gesture, so a drag never changes its
mind halfway. The hit test costs about 13ms and runs once per press, not per frame.
Panning is clamped so the vehicle cannot be dragged out of frame, and a Recentre control
appears once the view has moved (double click or double tap does the same).

**On a phone:** the canvas takes `touch-action: pan-y`, so a vertical swipe still
scrolls the page and a horizontal one spins or pans the rig; only a mouse pitches the
camera or pans vertically. That is a deliberate trade: taking the vertical axis would
mean hijacking page scroll on a section most people meet mid-scroll.
A flick carries momentum before settling back into the idle turn. Pixel ratio is capped
lower and antialiasing is off on coarse pointers, the camera starts closer so the
vehicle is not a postage stamp on a 390px screen, hotspots get 44px touch targets, and
an IntersectionObserver stops rendering entirely once the section scrolls away.

**The look (8 Sep pass).** The model is a SketchUp export: flat colours, no PBR
maps, and after meshopt its normals are quantised to 8 bits, which rendered as
speckle on every curved surface and made the wheels a grey mush. Three things fixed
it, all in `_lib/uteViewer.ts`: normals are rebuilt at load with a crease-aware
smoothing pass (a port of three's `toCreasedNormals`, since the vendored bundle is
core only); the scene gets a procedural studio environment through
`PMREMGenerator` so the paint has something to reflect; and materials are graded by
name (paint = the largest opaque surface, glass, chrome and rims, tyres forced dark,
the rims un-blended because they were exported transparent). The grid helper became a
radially fading grid texture with a contact-shadow blob, plus real cast shadows on
desktop only. Judge it on a real GPU: SwiftShader screenshots have no antialiasing.

**Licensing:** the Hilux model is a third-party asset you supplied. Confirm its licence
covers commercial use on a client site, and whether attribution is required, before this
goes live. A model of a trademarked vehicle can carry terms of its own.

## The map

The "Mobile most days" section carries his real Google Maps embed, with the workshop
address, hours and contact beside it. The frame sits over a styled panel: if the embed
cannot load, the panel shows the address and a link that opens the real map, so the
slot never reads as broken. The artifact preview always shows that panel, because its
sandbox blocks third-party frames.

## Photography

Every image slot is a designed plate before it is filled. `_components/Plate.tsx`
renders the brief for the shot, and the photo fades in over it only once it has
decoded, so a slow, blocked or missing file leaves a labelled shot card rather than a
broken box. `_lib/media.ts` holds the shot list: id, alt text, caption and brief.

**What is in the slots now.** No stock photography source is reachable from the build
environment. The gallery is filled with images generated through Higgsfield
(`nano_banana_pro`) and pulled back in through that service's own sandbox, because this
container's egress policy blocks its CDN directly. They are honest stand-ins: the right
kind of rig, the right kind of work, generic and unbranded. The section copy says so and
does not claim they are his van or his jobs.

Still wanted, and the `note` on each slot is the brief:

| Slot | What to shoot |
|---|---|
| `van` | The RMAE ute on a job, canopy open, work light on. Late afternoon. |
| `profile` | The van side-on with signage showing. |
| `hands` | Hands on the tools. Crimper, loom, heat shrink, close in. |
| `install` | A finished dual battery job. Labelled fuse block, tidy cabling. |
| `bench` | The workshop, tidy. This is the one the reviews keep mentioning. |

Drop a real photograph at `public/rmae/shots/<id>.webp`, then update that slot's
`caption` and `note` in `_lib/media.ts` to match what it shows. His Facebook page and
Google listing already have usable shots of the van and workshop.

## Enquiry form

The site is a static export (`output: 'export'`), so there is no server to post to.
`_lib/store.ts` writes enquiries to `localStorage` and the dashboard reads them back,
which is what makes the live demo work. Wiring it to a real inbox is a one-file change:
replace `addEnquiry` with a POST to a form endpoint (Netlify Forms, a Supabase table,
or an email function) and keep the same shape.

## Deploy

The demo is live at https://rockhampton-auto-electrics.netlify.app (Netlify project
`rockhampton-auto-electrics`, Syvex team, `/admin` for the dashboard). It is a
standalone site built from `dist-rmae/`, not the Sleep Life Australia deploy. To
push a new build:

    npm install && npx next build && bash scripts/build-demo-bundle.sh
    npx netlify-cli deploy --dir=dist-rmae --prod --no-build \
      --site 5235902a-7d6d-4563-87fd-4db6718fd903

## Notes

- The hero video is self-hosted at `public/rmae/hero.mp4` (H.264 1080p, 2.2 MB,
  re-encoded from the 18 MB HEVC Higgsfield original). See `_lib/media.ts`.

- Fonts (Anton, Space Grotesk, JetBrains Mono) are self-hosted in
  `public/rmae/fonts/`: latin subsets, ~66 KB total, SIL Open Font License. No
  third-party request on load.
- No Tailwind. This repo has no `tailwind.config.js` or `postcss.config.js`, so
  Tailwind classes elsewhere in the project are not compiled. Every style here is
  plain CSS in `rmae.css` / `admin/admin.css`, prefixed `rmae-` and `rmadm-`.
- `netlify.toml` gained two redirects so `/rockhampton` and `/rockhampton/admin`
  resolve past the SPA catch-all.
- Everything honours `prefers-reduced-motion`.
- **Phone pass (8 Sep 2026).** Both pages were checked at iPhone 13 size with
  Playwright, not just narrowed in a desktop browser. The mobile rules sit at the
  bottom of `rmae.css` and `admin/admin.css` under `MOBILE PASS` / `PHONE PASS`.
  Things that matter if you touch them: the sticky call bar is rendered by
  `_components/CallBar.tsx` as a direct child of the page (inside the z-indexed
  content wrapper the hero card painted over it); form fields are 16px on phones
  so iOS does not zoom on focus; the animated grain, the loom drop-shadows and the
  blur on reveals are switched off under 760px for frame rate; the card tilt in
  Services ignores touch pointers; the enquiries table in the admin turns into a
  card stack under 600px using the column order in the markup.
