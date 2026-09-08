# The single-file preview

`rmae-concept.html` is the shareable preview of the demo, published as an
Artifact. It is the same site as `app/rockhampton`, rewritten without React so
it can live in one file with no build step and no network.

It is a separate implementation, not a build of the Next.js app. Keep that in
mind: a change to `app/rockhampton` does not reach the preview on its own.

    body.html            markup and copy
    app.js               behaviour: 3D viewer, form, dashboard, scroll work
    rmae-concept.html    the published file, with everything baked in

Everything the page needs is inlined as a data URI, because the artifact
sandbox blocks every external host: three.js and its loaders, the ute GLB, the
webfont subsets, and the five gallery photographs. That is why the published
file is 2.8MB while its sources are 73KB.

The baked file is committed rather than generated. It was assembled across a
session whose container is discarded, and a rebuild script that produced a
subtly different file would be worse than no rebuild script. To change the
preview, edit the baked file directly and republish it; `body.html` and
`app.js` are here so the markup and behaviour stay readable.

The images come from `public/rmae/shots/`. To swap one, base64 the new file
and replace the matching entry in the `SHOT_SRC` object near the top of the
inline script.
