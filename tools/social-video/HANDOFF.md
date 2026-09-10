# Handoff — Syvex social content

Written by the cloud Claude Code session for a local Claude Code session on Jake's Mac.
Read this before touching anything in `tools/social-video/`.

---

## 1. Who this is for

**Syvex** — Jake Ripley, Perth WA. Web design + Google Ads for local businesses,
mostly trades. `syvex.xyz`, jake@syvex.xyz. Justin is a colleague who reviews the work.

**Goal:** a continuous supply of Meta ads content. Vertical 1080×1920, hooks that stop
a scroll, smooth animation, high visual quality.

**Audience:** trade business owners who are *solution unaware*. They do not think they
have a marketing problem. They get up, go to the job, and take whatever the phone brings.
They have never considered that a pipeline of better-paying work is available to them.
Content has to **teach** before it can sell.

**The value proposition, in Jake's words:** more of the *right* work — the higher-margin
jobs — not just work to fill the days. The payoff he cares about is not leads: it is
knowing next month is covered, being able to say no, finishing early on a Friday, and
ads that stop being a cost.

---

## 2. Jake's standards — read this twice

He rejects generic work instantly and he is right to. Direct quotes from the session:

- *"that's shit that means literally nothing to anyone watching"*
- *"that's generic boring and visually boring, someone would just scroll past this"*
- *"an infograph isn't going to keep anyone's attention"*
- *"needs to be techy and sleek to capture audience attention"*
- *"Quality, smooth transitions, smooth animation. Just everything smooth. No shitty symbols."*

**The single most important pattern in this whole project:**

> Every time Jake supplied a concrete visual reference, the work improved sharply.
> Every time a direction was invented without one, he rejected it.

He uploaded one reference reel (a Google review card product film). Analysing it frame by
frame produced the biggest quality jump of the entire engagement — it revealed three things
the work was missing: complementary colour instead of a single hue, the subject lit *by*
the background rather than sitting in front of it, and foreground haze for depth.

**So: get the references first, analyse them properly, then build.** Do not invent a
direction and hope. There are six reference screen recordings waiting (see §6).

---

## 3. What exists

Branch `claude/flow-scapes-social-video-zraj2q`, directory `tools/social-video/`.
`build.sh` runs the whole pipeline end to end.

```
rig/     phone.html    three.js handset + orbit, every material tunable from the URL
         render.py     headless-WebGL driver -> RGBA frames + per-frame screen corners
comp/    comp.py       compositor: smoke, plate, screen replacement, swipe carousel, type
         smoke.py      procedural red/teal fBm haze
         testimonial.py the Aaron cut — his audio as spine, picture cuts on his pauses
         prep_video.py bakes a screen recording into live frames for a phone screen
         page.py       stitches a screen recording into one tall page image
         grit.py       type with a printed speckle
promo/   ad.html       the "Booked out. Still broke." 20s animated ad
         shoot.py      renders ANY html page frame-by-frame, deterministically
pages/   n1..n7.png    stitched client sites, + n1_v..n5_v.mp4 live hero clips
fonts/   Archivo
```

`shoot.py` is the most reusable piece: any future ad concept is just an HTML page, and it
renders at exact 1080×1920 with no dropped frames. **Never screen-record an animated page
you built — drive it frame by frame.**

---

## 4. Technical knowledge that will save you hours

**Screen replacement is the core trick.** Render the handset with a near-black screen so
the plate carries *only* glass reflections, export the screen's four corners per frame,
then warp the website onto those corners in 2D at full resolution. This is why type stays
sharp. It is also why generative video cannot do this job: diffusion models cannot hold
text below roughly 40px cap height — that is a property of the models, not a prompt
problem. Never let a generative model render a screen.

**Faults found the hard way, all fixed, all easy to reintroduce:**

- **Square display corners** made the site look pasted on rather than behind glass. The
  corner *coordinates* were exact; the *shape* was wrong. Clip the site to a rounded mask
  warped by the same perspective transform.
- **A box with softened edges is not a phone.** Rounded-box geometry caps its radius at
  half the thickness, so a 4mm handset physically cannot round properly. Use an extruded
  rounded rectangle with a bevel.
- **Rendering small and upscaling** was the main cause of "looks crap". Render native.
- **Motion blur on a swipe reads as ghosting.** Three samples look like three copies of
  the text. Phone displays are sample-and-hold — a crisp swipe is correct.
- **RGB vs BGR.** `comp.frame()` returns RGB, `cv2.imread()` returns BGR. Mixing them and
  converting once at the end swapped red and blue on every handset shot. Keep one colour
  order end to end.
- **Place a strip light by the mirror geometry, not by eye.** For a flat screen the
  reflected direction from its centre is `reflect(P - C, n)`. Guessing put it on the wrong
  side of the scene for three rounds.
- **Closer and bigger is flatter, not brighter.** A large source subtends a wide angle and
  floods the glass to uniform grey. Small, far and bright gives a streak that *moves*.
- **Complementary colour.** A single hue reads flat however saturated. Crimson right
  against teal-blue left, with the subject catching both.
- **Judge at 1:1.** Contact sheets at 200px hide square corners, soft edges and colour
  inversion. And measure frame-to-frame delta across the whole file to find near-static
  stretches — a 1.5s dead patch is invisible in a sheet and fatal in an ad.

**Performance:** the rig was originally Blender/Cycles at 26s per frame. Ported to three.js
in headless Chromium it is ~50ms per frame — 150 frames in about 8 seconds. On a Mac with
a real GPU it will be faster again. The trade is no path tracing; an environment map stands
in for bounced light.

---

## 5. The source-material problem

**Measured twice, independently, at full resolution: every client screen recording Jake has
supplied scrolls less than a third of one screen.** Two of them are byte-identical from
first frame to last. This is not a detection bug — it was cross-checked by direct
first-to-last template matching.

Consequences:
- There is no scroll to showcase. The reel uses a **swipe carousel** instead, which needs
  only one screenful per site. That was Jake's call and it was the right one.
- The recordings are still valuable because the **heroes animate** — Ace Ballerz has real
  video playing, Me-Solar an animated sun, Adelaide Chauffeur video behind its copy. Five
  of seven screens are live video rather than stills.

**If you want real scrolling**, capture full pages yourself — you can reach the sites, this
cloud session could not. Client URLs: `aceballerz.site`, `me-solar.com.au`,
`flowscapes-perth.netlify.app`, `electeq.net.au`, `adelaidechauffeurcompany.com`,
`zerogrime-solutions-rd01.bolt.host`, plus Moving with Mojo's (URL not yet supplied).

---

## 6. What you can do that the cloud session could not

The cloud container's egress policy blocked, all verified by test: Instagram, Canva,
Google Drive, HuggingFace, cdnjs, the Higgsfield CDN, and every one of Jake's client
websites. Only npm and PyPI were reachable. Almost every frustration in that session traces
back to this.

**On the Mac you can, and should:**

1. **Watch the six reference recordings.** They are in Google Drive under
   *"Social Media Links For AI"*, 92–190 MB each, and probably still in `~/Movies` or
   `~/Desktop`. The cloud session could see the metadata but not the bytes — base64 of a
   93 MB file is ~33M tokens.
   Contact-sheet each one and read it. Extract: cut count and shot durations, exactly what
   happens in the first second, palette sampled off real pixels, how the subject is lit
   relative to the background, type treatment (face, weight, entrance, dwell), camera moves,
   and texture (grain, bloom, halation, chromatic aberration). Then write down what they
   have in common and what the Syvex work is missing.
2. **Transcribe Aaron.** `whisper` or `faster-whisper` — the model host was blocked in the
   cloud, it will not be on the Mac. His testimonial is 80s at 478×850, ZeroGrime
   Solutions, Bunbury. Nobody has ever read what he actually says, so the cut points were
   chosen from waveform pauses alone. **Do not invent quotes for him** — his real words next
   to the argument are the strongest asset available.
3. **Drive Chrome.** Canva, Google Flow, Higgsfield, Instagram, the client sites.
4. **Full-page captures** of all seven client sites for genuine scroll footage.
5. **ffmpeg locally** on the 190 MB files with no transfer.

---

## 7. Delivered so far

- `SYVEX_Seven_Builds_v5.mp4` — 19.1s, seven sites on an orbiting handset, five with live
  hero video, swipe carousel, red/teal haze. Silent.
- `SYVEX_Aaron_Full_v2.mp4` — 83.3s, Aaron's full testimonial, his audio unbroken, picture
  cutting to the work on his pauses.
- `SYVEX_RightJobs.mp4` — 20s animated ad, "Booked out. Still broke." A week fills with
  24 small jobs, a scan clears them, six good ones land. **The figures are illustrative and
  invented** — do not present them as client results. Swap in real numbers if Jake supplies
  them.
- An animated web page, "The 5:32 Problem", teaching the solution-unaware argument.

---

## 8. Open items

- **Aaron's transcript** — blocks the strongest version of both the reel and the page.
- **The six reference recordings** — unanalysed. This is the highest-value first task.
- **Sound** — everything except Aaron's cut is silent. A score exists in
  `comp/legacy/mk_music.py` built for a 3.0s beat; the current cut runs 2.3s.
- **A hook** — the seven-builds reel opens straight onto a website with no scroll-stopper.
- **Moving with Mojo's URL** — not supplied.
- **Repo location** — this toolkit lives inside a *client's website repo*, which is wrong.
  Jake was going to create a separate `syvex-video-toolkit` repo; the cloud session's
  GitHub integration was not permitted to create one.

---

## 9. How to work with Jake

Show work early and often — he judges fast and accurately. Send frames or short clips
before committing to long renders. Verify before delivering: decode the file, check for
frozen stretches, look at crops at 1:1. Say plainly what you checked and what you did not.
When something is wrong, name it before he has to.

And when he gives you a reference — study it properly. That is the thing that works.
