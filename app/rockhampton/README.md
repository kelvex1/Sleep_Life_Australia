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

`_lib/ute3d.ts` is a hand-built 3D model of a dual-cab 4x4, with no library and no
external asset. The geometry is defined in metres from real dimensions (5.33m long,
1.855m wide, 1.815m high, 3.085m wheelbase, 0.80m tyres), then lit, depth-sorted and
projected onto a 2D canvas by hand.

Three decisions worth knowing if you touch it:

- **An extruded side profile, not a stack of boxes.** The body comes from one closed
  2D profile swept across the width, so the silhouette carries the wheel arches, the
  raked windscreen and the bonnet line exactly as they appear on the real side view.
  The profile is traversed with the body on its left, so each wall's outward normal is
  its edge direction turned a quarter turn clockwise. Boxes are only used for the
  bolt-on parts: bull bar, light bar, mirrors, steps, snorkel, tow bar, tray rails.

- **Surfaces, not wireframe.** A wireframe of a solid object shows every hidden edge
  at once and reads as a pile of boxes. Faces are filled and drawn back to front
  (painter's algorithm) with a single key light, so the silhouette is readable and the
  panel lines glow over it.
- **No CDN.** Loading a model viewer and a GLB from a CDN would break in any sandbox
  that blocks third-party requests, and could not be tested here. Everything ships
  with the page, so the artifact preview and the deployed site render identically.

Hotspots are DOM buttons so they stay keyboard reachable; each frame the scene reports
where its anchor landed on screen and the button is moved to match, fading out when it
passes behind the vehicle.

## What is real and what is placeholder

Real, taken from the Google listing and Facebook page:

- 4.9 rating from 39 Google reviews, and the three review quotes
- Phone `0427 667 996`, email `admin@rmautoelec.com.au`
- Address Unit 2b/197 Kent St, Rockhampton City QLD 4700
- The "locally owned and operated… one stop shop" line from the Facebook bio

Placeholder, so confirm with him before this goes anywhere public:

- **Logo** (`public/rmae/logo.svg`) is a hand-built recreation of the RMAE badge.
  Facebook was unreachable from the build environment, so the real artwork could not
  be downloaded. Drop his PNG/SVG in and update the two `<img src>` references.
- **Trading hours.** Google only exposes "closes 5pm", and a review mentions a
  Saturday morning. The footer says "Mon to Fri until 5:00pm · Sat mornings by
  arrangement". Get the real hours.
- **Service area towns, response times and the "92% done on site" gauge** are
  plausible, not measured.
- Everything in the dashboard except a freshly submitted enquiry is seeded sample data.

## Hero video

Three cinematic takes were generated with Higgsfield (Seedance 2.5, 1080p, 8s,
silent). The build environment's egress policy blocks the Higgsfield CDN, so the MP4s
are not committed. `_lib/media.ts` lists all three URLs and the `<video>` element has
two sources:

1. `/rmae/hero.mp4`, local, wins if present
2. the CDN URL for the selected take, used while no local file exists

To pin the footage: download the take you want, save it as `public/rmae/hero.mp4`, and
it takes over with no code change. To preview a different take instead, change the
`HERO_REMOTE` export in `_lib/media.ts`.

## The map

The "Mobile most days" section carries his real Google Maps embed, with the workshop
address, hours and contact beside it. The frame sits over a styled panel: if the embed
cannot load, the panel shows the address and a link that opens the real map, so the
slot never reads as broken. The artifact preview always shows that panel, because its
sandbox blocks third-party frames.

## Photography

Every image slot is a designed plate before it is a photograph. `_components/Plate.tsx`
renders the brief for the shot, and the photo fades in over it only once it has
decoded, so a slow, blocked or missing file leaves a labelled shot card rather than a
broken box. `_lib/media.ts` holds the shot list: id, alt text, caption and the brief.

The five in the "On the job" gallery, plus one behind the closing call to action:

| Slot | What to shoot |
|---|---|
| `van` | The RMAE ute on a job, canopy open, work light on. Late afternoon. |
| `loom` | Hands on the tools. Crimper, loom, heat shrink, close in. |
| `battery` | A finished dual battery job. Labelled fuse block, tidy cabling. |
| `aircon` | Gauge set on the ports, bonnet up. Shoot on a bright day. |
| `bench` | The workshop, tidy. This is the one the reviews keep mentioning. |
| `scan` | Scan tool on the wheel, screen lit, plugged into the OBD port. |

The `src` values currently point at generated placeholders on the Higgsfield CDN,
which this environment could not download into the repo. They are stand-ins for
composition only and **must not be presented as his work**. Replace each with a real
photograph at `public/rmae/shots/<id>.jpg` and update `src` in `_lib/media.ts`. His
Facebook page and Google listing already have usable shots of the van and workshop.

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
