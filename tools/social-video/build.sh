#!/bin/bash
# Render the rig and composite the reel, end to end.
set -e
cd "$(dirname "$0")"
echo "== rig"
(cd rig  && python3 render.py --out frames --w 540 --h 960)
echo "== composite"
(cd comp && python3 comp.py full)
echo "== done -> comp/final_v.mp4"
