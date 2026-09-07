/**
 * Hero background footage.
 *
 * The clips were generated with Higgsfield (Seedance 2.5, 1080p, 8s, silent).
 * This container's egress policy blocks the Higgsfield CDN, so the files are
 * not committed. The <video> lists the local path first and the CDN URL
 * second: drop the chosen clip at public/rmae/hero.mp4 and it takes over with
 * no code change, otherwise the browser falls through to the remote copy.
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
 * The images currently in place are renders of the supplied Hilux glTF, made
 * with scripts/shoot-ute.mjs. They are stand-ins, and the copy around them
 * says so: they show the kind of vehicle, not his actual van or his actual
 * jobs. Replace each with a real photograph at public/rmae/shots/<id>.webp
 * and the caption and note with what it shows.
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
    alt: 'Dual-cab four wheel drive service ute with a bull bar and driving lights',
    caption: 'The rig, ready to roll',
    note: 'The RMAE ute on a job, canopy open, work light on. Late afternoon.',
  },
  profile: {
    id: 'profile',
    src: '/rmae/shots/profile.webp',
    alt: 'Side profile of the service ute, showing the tray, snorkel and side steps',
    caption: 'The workshop on the back',
    note: 'The van side-on with signage showing. Good for the top of the page.',
  },
  front: {
    id: 'front',
    src: '/rmae/shots/front.webp',
    alt: 'Front of the service ute, bull bar and spotlights',
    caption: 'Front bar and lights',
    note: 'Hands on the tools. Crimper, loom, heat shrink, close in.',
  },
  tray: {
    id: 'tray',
    src: '/rmae/shots/tray.webp',
    alt: 'Rear three quarter view of the service ute showing the open tray',
    caption: 'Tray and canopy space',
    note: 'A finished dual battery job. Labelled fuse block, tidy cabling.',
  },
  wheel: {
    id: 'wheel',
    src: '/rmae/shots/wheel.webp',
    alt: 'Close view of the front wheel and guard of the service ute',
    caption: 'Built for CQ tracks',
    note: 'The workshop, tidy. This is the one the reviews keep mentioning.',
  },
}

export const GALLERY: Shot[] = [SHOTS.van, SHOTS.front, SHOTS.tray, SHOTS.profile, SHOTS.wheel]
