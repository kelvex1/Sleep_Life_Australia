#!/usr/bin/env bash
# Renders music.mp3 from the stems produced by mk_music.py
set -e
python3 mk_music.py
ffmpeg -v error -y -i music.wav -i fx.wav -filter_complex \
"[0:a]asendcmd=f=cmds.txt,lowpass=f=320:width_type=q:width=0.7[m];\
[m][1:a]amix=inputs=2:normalize=0[mx];\
[mx]alimiter=level_in=1:level_out=0.95:limit=0.95,\
loudnorm=I=-11:TP=-1.0:LRA=9,afade=t=out:st=15.0:d=0.484[o]" \
-map "[o]" -t 15.484 -c:a libmp3lame -b:a 256k music.mp3
echo "music.mp3 written"
