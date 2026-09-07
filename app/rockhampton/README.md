# Rockhampton Mobile Auto Electrics — concept site

A self-contained demo built to win the Wednesday sit-down. It lives entirely under
`app/rockhampton/` and `public/rmae/` and shares nothing with the Sleep Life Australia
pages — no shared components, no shared CSS, no changes to the existing routes.

| | |
|---|---|
| Website | `/rockhampton` |
| Owner dashboard | `/rockhampton/admin` |

## The demo to run in the meeting

1. Open `/rockhampton`. Let the hero video and the headline animate in.
2. Scroll slowly — the two wiring looms down the page margins are drawn by scroll
   position, with a current pulse chasing along them.
3. Tap the hotspots on the ute in "If it runs on volts, it's our problem".
4. Fill in the hero enquiry form with *his* name and number and hit send.
5. Click **See it land in the dashboard**. His enquiry is sitting at the top of the
   list, flashing orange, tagged NEW and TODAY.
6. Hit **Move to Quoted** on his row and show the pipeline bars update.

That last loop is the pitch: the website is not a brochure, it is the front door to a
job list.

## What is real and what is placeholder

Real, taken from the Google listing and Facebook page:

- 4.9 rating from 39 Google reviews, and the three review quotes
- Phone `0427 667 996`, email `admin@rmautoelec.com.au`
- Address Unit 2b/197 Kent St, Rockhampton City QLD 4700
- The "locally owned and operated… one stop shop" line from the Facebook bio

Placeholder — confirm with him before this goes anywhere public:

- **Logo** (`public/rmae/logo.svg`) is a hand-built recreation of the RMAE badge.
  Facebook was unreachable from the build environment, so the real artwork could not
  be downloaded. Drop his PNG/SVG in and update the two `<img src>` references.
- **Trading hours.** Google only exposes "closes 5pm", and a review mentions a
  Saturday morning. The footer says "Mon–Fri until 5:00pm · Sat mornings by
  arrangement". Get the real hours.
- **Service area towns, response times and the "92% done on site" gauge** are
  plausible, not measured.
- Everything in the dashboard except a freshly submitted enquiry is seeded sample data.

## Hero video

Three cinematic takes were generated with Higgsfield (Seedance 2.5, 1080p, 8s,
silent). The build environment's egress policy blocks the Higgsfield CDN, so the MP4s
are not committed. `_lib/media.ts` lists all three URLs and the `<video>` element has
two sources:

1. `/rmae/hero.mp4` — local, wins if present
2. the CDN URL for the selected take — used while no local file exists

To pin the footage: download the take you want, save it as `public/rmae/hero.mp4`, and
it takes over with no code change. To preview a different take instead, change the
`HERO_REMOTE` export in `_lib/media.ts`.

## Enquiry form

The site is a static export (`output: 'export'`), so there is no server to post to.
`_lib/store.ts` writes enquiries to `localStorage` and the dashboard reads them back —
which is what makes the live demo work. Wiring it to a real inbox is a one-file change:
replace `addEnquiry` with a POST to a form endpoint (Netlify Forms, a Supabase table,
or an email function) and keep the same shape.

## Notes

- Fonts (Anton, Space Grotesk, JetBrains Mono) are self-hosted in
  `public/rmae/fonts/` — latin subsets, ~66 KB total, SIL Open Font License. No
  third-party request on load.
- No Tailwind. This repo has no `tailwind.config.js` or `postcss.config.js`, so
  Tailwind classes elsewhere in the project are not compiled. Every style here is
  plain CSS in `rmae.css` / `admin/admin.css`, prefixed `rmae-` and `rmadm-`.
- `netlify.toml` gained two redirects so `/rockhampton` and `/rockhampton/admin`
  resolve past the SPA catch-all.
- Everything honours `prefers-reduced-motion`.
