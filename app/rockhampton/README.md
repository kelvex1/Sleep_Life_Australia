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

**On a phone:** the canvas takes `touch-action: pan-y`, so a vertical swipe still
scrolls the page and a horizontal one spins the rig; only a mouse pitches the camera.
A flick carries momentum before settling back into the idle turn. Pixel ratio is capped
lower and antialiasing is off on coarse pointers, the camera starts closer so the
vehicle is not a postage stamp on a 390px screen, hotspots get 44px touch targets, and
an IntersectionObserver stops rendering entirely once the section scrolls away.

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
environment, and the preview sandbox blocks external images anyway, so the gallery is
filled with renders of the supplied Hilux glTF made by `scripts/shoot-ute.mjs`: five
framings with their own lighting. They are honest stand-ins. The section copy calls
them visualisations and does not claim they are his van or his jobs.

Still wanted, and the `note` on each slot is the brief:

| Slot | What to shoot |
|---|---|
| `van` | The RMAE ute on a job, canopy open, work light on. Late afternoon. |
| `profile` | The van side-on with signage showing. |
| `front` | Hands on the tools. Crimper, loom, heat shrink, close in. |
| `tray` | A finished dual battery job. Labelled fuse block, tidy cabling. |
| `wheel` | The workshop, tidy. This is the one the reviews keep mentioning. |

Drop a real photograph at `public/rmae/shots/<id>.webp`, then update that slot's
`caption` and `note` in `_lib/media.ts` to match what it shows. His Facebook page and
Google listing already have usable shots of the van and workshop.

## Enquiry form

The site is a static export (`output: 'export'`), so there is no server to post to.
`_lib/store.ts` writes enquiries to `localStorage` and the dashboard reads them back,
which is what makes the live demo work. Wiring it to a real inbox is a one-file change:
replace `addEnquiry` with a POST to a form endpoint (Netlify Forms, a Supabase table,
or an email function) and keep the same shape.

## Notes

- Fonts (Anton, Space Grotesk, JetBrains Mono) are self-hosted in
  `public/rmae/fonts/`: latin subsets, ~66 KB total, SIL Open Font License. No
  third-party request on load.
- No Tailwind. This repo has no `tailwind.config.js` or `postcss.config.js`, so
  Tailwind classes elsewhere in the project are not compiled. Every style here is
  plain CSS in `rmae.css` / `admin/admin.css`, prefixed `rmae-` and `rmadm-`.
- `netlify.toml` gained two redirects so `/rockhampton` and `/rockhampton/admin`
  resolve past the SPA catch-all.
- Everything honours `prefers-reduced-motion`.
