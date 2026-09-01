---
name: short-form-video
description: Make, edit and judge short-form vertical video (Reels/TikTok/Shorts) from real footage, screen recordings and screenshots. Use this whenever the user wants a social video cut, edited, assembled or reviewed - a website showcase, a product walkthrough, a before/after, a scroll-through, turning screenshots into motion, "make this into a reel", "does this clip work", "what should I cut" - and ALSO whenever you are about to judge whether visual content is good enough to ship. Covers how to actually LOOK at video frames instead of inferring from metrics, the ffmpeg/PIL craft for smooth motion, and how to decide what to push versus scrap. Trigger it even when the user only supplies raw footage and a vague brief.
---

# Short-form video: see it, cut it, judge it

Three failures make bad short-form video, in descending order of cost:

1. **Judging content you never looked at.** By far the worst. Everything else follows from it.
2. **Editing a source that cannot produce the format.** No craft rescues a wrong source.
3. **Motion that steps instead of glides.** Usually one specific bug (see `references/editing.md`).

## 1. Look at it. Always. First.

You can see video. Extract frames and read them as an image. There is no situation where
you should describe, judge, or ship a visual result you have not viewed.

**Find the file.** User attachments land in `/root/.claude/uploads/<session-id>/`. Check
there before concluding anything is unreachable — it is one `ls` and it is frequently
where the file already is. A path the user typed from their own machine
(`/Users/...`, `C:\...`) is *not* accessible; say so plainly and ask them to attach it.

**Make a contact sheet and read it:**

    python scripts/contact_sheet.py input.mp4 sheet.png --frames 12 --width 150

Then use the Read tool on `sheet.png`.

Twelve frames at 150px wide tiles to roughly 600x800. That is enough to read every
headline and name every section of a 30-second video in a single Read. Verified, not
estimated. Use it as the default first move on any video.

- **Identify sections** → 12 frames @ 150px (one sheet, whole video)
- **Judge composition/legibility** → 4-6 frames @ 300px
- **Check fine detail** (type quality, artefacts, a specific moment) → 1 frame at native
  size, or a crop of one

For a still image, just Read it. Downscale a very tall screenshot first so it fits.

**If you genuinely cannot get the pixels** — the file sits behind a host you can't reach
and can't be moved — then say exactly that, and say which claims are therefore
unverified. Do not silently substitute measurements for looking. A number about a frame
is not a description of it.

## 2. Name every section before you judge anything

Look at the contact sheet and write down what each shot *is*: hero, before/after,
project gallery, process steps, contact form, footer. Ten seconds of work.

This is the difference between editing and pixel-pushing. If you cannot say what a shot
is, you cannot say whether it earns its place, and you will fall back on a proxy metric —
which is where the real damage happens.

**The proxy trap, concretely.** A tempting "is this frame empty?" metric is the fraction
of pixels differing from the background colour. On a dark site with white text it scores
a full, readable copy block as *empty*. Acting on that means speeding past good content
and calling it a fix. If you need a numeric screen at all, use **edge density**
(mean gradient magnitude) — text has edges, emptiness does not. But treat any metric as a
way to *find frames to look at*, never as the verdict.

Metrics that are genuinely useful, because they measure structure rather than quality:
duration, frame count, cut times (`select='gt(scene,0.3)'`), per-frame motion, whether
type falls inside the safe area. Use them to locate problems. Use your eyes to grade them.

## 3. Push or scrap

Judge each shot on content, at the size people will watch it:

- **One clear idea per shot.** Two competing focal points reads as noise at thumb size.
- **Legible at 1080x1920 on a phone.** Body copy under ~30px cap height is decoration,
  not information. Measure it if unsure — baseline spacing / 1.45.
- **Does it advance the story?** A shot that repeats what the previous one said is a cut,
  however pretty.
- **Does it end well?** The last second is the impression that persists. Never end on the
  emptiest frame; that is usually where a page's dead footer lands.

Scrap without sentiment: near-duplicate shots, anything mid-transition in the source,
dead footer space, and anything you had to argue yourself into keeping.

**Check the source ceiling before editing anything.** Some material simply cannot make the
format, and this is arithmetic you can do in a minute — before spending hours:

    desktop capture 3052px wide → 1080px frame  = 3.4x reduction
    body text 24px → 7px                        = unreadable
    full page 6632px → 2347px at 1080 wide      = 1.22 screens, no scroll to show

That source could be full-width *or* legible, never both. Cropping to fill the frame threw
away 70% of every layout; showing it whole made the type 6pt. The right move was to say so
and ask for a mobile-width recording — not to build three increasingly clever pipelines.
When the source can't make the format, say it in one message with the numbers, and name
what you'd need instead.

## 4. Flow versus rhythm

Cut count is a design decision and usually the single biggest factor in whether something
"flows".

A brief asking for smooth and seamless means **fewer cuts**. A brief asking for punchy and
attention-grabbing means more. Ask, or infer from their words, and commit.

A reference cut that read as flawlessly smooth had exactly **one** hard cut in 29 seconds:
the opener into the site, then 23 unbroken seconds of scrolling. A version of the same
material with four cuts every 4-5s read as choppy, and every cut then needed hiding work.
Intercutting is not automatically more dynamic; it is more seams.

## 5. Assembling

Full craft details and the specific traps are in `references/editing.md` — read it before
writing any ffmpeg or PIL that moves an image. The essentials:

- **Match framing across sources before you cut.** Screenshots and screen recordings of the
  same phone are the same viewport at different sample rates: crop each to the same site
  region so both land at 1080 wide at identical scale. Mismatched scale makes every cut
  announce itself, and no transition hides it.
- **Never use ffmpeg `zoompan` for camera moves.** It rounds the crop offset to whole
  pixels each frame, so a slow zoom steps rather than glides and reads as handheld shake.
  Render motion yourself with a float box (see the reference).
- **Beat grid:** choose a tempo where one bar is a whole number of frames (120 BPM = 2.0s =
  60 frames at 30fps). 124 BPM gives 58.06 frames per bar and drifts.
- **Verify before delivering:** cuts land where intended, no dead stretches, type inside
  the safe area, ends on content, file size sane. Then *look at the contact sheet again.*

## 6. Say what you actually know

Separate what you verified from what you inferred, and be specific about which is which.
"I checked the framing and the cut points; I have not watched it end to end" is useful.
"Verified" as a blanket claim over work you only measured is not — it converts your
uncertainty into the user's problem, and they find out by watching something broken.

If you are about to hand over visual work, the last action before you do should be looking
at it.
