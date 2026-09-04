"""Resample a phone screen-recording of a website into a smooth, constant-velocity
scroll, dropping the dwells.

Why not just trim the recording: a hand-scrolled capture has wildly uneven
velocity (bursts up to ~190px/frame here) and spends ~half its frames stationary.
Playing it back gives lurching motion and dead air.

Why not stitch the page into one tall image and re-scroll that: tried it, and it
loses every scroll-triggered animation and lazy-loaded image, because the stitch
is static. Resampling keeps real frames, so the page stays alive.

Method
  1. Per-frame vertical offset by SAD over a band of the content window.
  2. Cumulative offset -> each source frame's absolute page position.
  3. Plan output positions Y(k): constant velocity, modulated by content density
     so sparse stretches move faster and dense ones slow down.
  4. For each Y(k) pick the source frame whose page position is within SLACK,
     preferring the LATEST such frame (most loaded / furthest through any
     entry animation), and crop it at the residual offset.

SLACK = frame height after upscale minus 1920. Whenever a frame covers the wanted
window, the output frame is a real crop of a real frame, not a blend. Aim for
"exact" near 1.000.

TWO BUGS THAT COST A REBUILD EACH - do not reintroduce:

  * Search the offset BOTH ways. `range(0, MAXD+1)` looks only for downward
    scroll; iOS momentum and rubber-band bounce produce upward frames, and
    forcing those to >= 0 makes the error accumulate. It reported a 16-screen
    page as 1.2 screens.

  * Do the shift search on the FULL-height analysis frame. If you crop to the
    content window first, `if s0 < 0: continue` silently rejects every shift
    larger than the top margin - here it capped the search at 4px and lost half
    the page (span 13,776 vs the true 28,020).

Sanity checks worth keeping: exact ~= 1.0, span in screens, max per-frame step,
and the fraction of output frames below half the median EDGE density. Use edge
density, not pixel-difference density - the latter scores white-on-dark text
sections as empty and will send you chasing content that is really there.
"""
