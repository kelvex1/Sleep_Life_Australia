/**
 * Hero background footage.
 *
 * The clips were generated with Higgsfield (Seedance 2.5, 1080p, 8s, silent).
 * The chosen take (workshop) is self-hosted at public/rmae/hero.mp4: the CDN
 * original is HEVC at 18MB, so it was re-encoded to H.264 1080p at 2.2MB
 * (ffmpeg, libx264, crf 24, faststart), which also fixes playback in browsers
 * without HEVC support. The <video> lists the local path first and the CDN URL
 * second as a fallback only. To swap takes, re-encode the other clip the same
 * way and overwrite the local file.
 */
export const HERO_LOCAL = '/rmae/hero.mp4'

export const HERO_TAKES = {
  /** Slow dolly through a dark workshop, multimeter probes on a wiring loom. */
  workshop:
    'https://d8j0ntlcm91z4.cloudfront.net/user_3DxrXI9aTgEtNSyik8TwFI9uQcd/hf_20260907_021900_222ede81-7ab9-48e7-a60f-66aa2d4ca3a8.mp4',
  /** Service ute on a red-dirt CQ roadside at dusk, canopy open, work light on. */
  ute:
    'https://d8j0ntlcm91z4.cloudfront.net/user_3DxrXI9aTgEtNSyik8TwFI9uQcd/hf_20260907_021852_f7cf035c-cbf5-4f3e-ab92-888ebc7fd04a.mp4',
  /** Macro battery terminal, arcs crackling between contacts. */
  arc:
    'https://d8j0ntlcm91z4.cloudfront.net/user_3DxrXI9aTgEtNSyik8TwFI9uQcd/hf_20260907_021852_57d0c82c-f414-4626-bb41-6a743f5eff1a.mp4',
} as const

/** Swap this key to change the hero take. */
export const HERO_REMOTE = HERO_TAKES.workshop

/**
 * Photography slots.
 *
 * `note` is the brief: what to shoot to replace the placeholder. It is what
 * the plate displays until an image loads, so an empty slot reads as a shot
 * list rather than a broken image.
 *
 * The images currently in place are generated stand-ins, not photographs of
 * his van or his jobs. They show the right kind of rig and the right kind of
 * work so the layout can be judged, and the copy around them says as much.
 * Replace each with a real photograph at public/rmae/shots/<id>.webp and
 * rewrite the caption and note to match what it shows.
 */
export type Shot = {
  id: string
  src: string
  alt: string
  caption: string
  note: string
}

export const SHOTS: Record<string, Shot> = {
  van: {
    id: 'van',
    src: '/rmae/shots/van.webp',
    alt: 'Service ute parked on red dirt at sunset, canopy doors open on a lit, fitted-out interior',
    caption: 'The workshop turns up',
    note: 'The RMAE ute on a job, canopy open, work light on. Late afternoon.',
  },
  profile: {
    id: 'profile',
    src: '/rmae/shots/profile.webp',
    alt: 'Side view of a dual cab ute with a canopy on the tray, parked outside a shed',
    caption: 'Rockhampton and out',
    note: 'The van side-on with signage showing. Good for the top of the page.',
  },
  hands: {
    id: 'hands',
    src: '/rmae/shots/hands.webp',
    alt: 'Close view of hands crimping a terminal onto automotive cable in an engine bay',
    caption: 'Crimped, sealed, labelled',
    note: 'Hands on the tools. Crimper, loom, heat shrink, close in.',
  },
  install: {
    id: 'install',
    src: '/rmae/shots/install.webp',
    alt: 'Finished dual battery install in a ute canopy with a DC to DC charger and fuse block',
    caption: 'Dual battery, done properly',
    note: 'A finished dual battery job. Labelled fuse block, tidy cabling.',
  },
  bench: {
    id: 'bench',
    src: '/rmae/shots/bench.webp',
    alt: 'Auto electrical bench with cable reels, sorted terminals, crimpers and a scan tool',
    caption: 'The bench behind the job',
    note: 'The workshop, tidy. This is the one the reviews keep mentioning.',
  },
}

export const GALLERY: Shot[] = [SHOTS.van, SHOTS.hands, SHOTS.install, SHOTS.profile, SHOTS.bench]
