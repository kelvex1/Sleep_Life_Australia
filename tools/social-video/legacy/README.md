# Superseded

The flat-montage pipeline that preceded the orbiting-handset rig. Kept for
reference only - `scroll_resample.py` in particular is the approach that was
abandoned: resampling a screen recording onto a motion curve and cross-blending
between frames, which ghosts because it blends two frames of a *moving* page.
The current pipeline stitches the recording into one still page and generates
the motion instead. See ../README.md.
