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
 * the plate displays until a photograph loads, so an empty slot reads as a
 * shot list rather than a broken image.
 *
 * `src` currently points at generated placeholders on the Higgsfield CDN,
 * which could not be downloaded into the repo from this environment. Replace
 * each one with the real photograph at `public/rmae/shots/<id>.jpg`.
 */
export type Shot = {
  id: string
  src: string
  alt: string
  caption: string
  note: string
}

const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3DxrXI9aTgEtNSyik8TwFI9uQcd/'

export const SHOTS: Record<string, Shot> = {
  van: {
    id: 'van',
    src: CDN + 'hf_20260907_031205_cb4bdf51-46a2-4fe4-bcae-0b97b1c275bb.png',
    alt: 'Mobile auto electrical service ute parked on a worksite with the canopy open',
    caption: 'The van on site',
    note: 'The RMAE ute on a job, canopy open, work light on. Late afternoon.',
  },
  loom: {
    id: 'loom',
    src: CDN + 'hf_20260907_031205_a8afd499-aaa7-4923-b9ab-efa055515a65.png',
    alt: 'Close-up of an auto electrician crimping a terminal onto a vehicle wiring loom',
    caption: 'Crimping a loom',
    note: 'Hands on the tools. Crimper, loom, heat shrink, close in.',
  },
  battery: {
    id: 'battery',
    src: CDN + 'hf_20260907_031206_20539bc7-37f6-498a-bd16-956a717a0c40.png',
    alt: 'Completed dual battery and 12 volt installation inside a ute canopy',
    caption: 'Dual battery fitout',
    note: 'A finished dual battery job. Labelled fuse block, tidy cabling.',
  },
  aircon: {
    id: 'aircon',
    src: CDN + 'hf_20260907_031205_c09ae5e7-0e5a-422d-bd5a-869f1ede83b7.png',
    alt: 'Air conditioning manifold gauge set connected to a car engine bay',
    caption: 'Air con service',
    note: 'Gauge set on the ports, bonnet up. Shoot on a bright day.',
  },
  bench: {
    id: 'bench',
    src: CDN + 'hf_20260907_031205_d383f4e0-6b16-453f-97ba-cde64bb0032b.png',
    alt: 'Clean, organised auto electrical workshop bench with tools on a shadow board',
    caption: 'The Kent St workshop',
    note: 'The workshop, tidy. This is the one the reviews keep mentioning.',
  },
  scan: {
    id: 'scan',
    src: CDN + 'hf_20260907_031205_8162175b-402b-4612-887f-2ac14d355f9d.png',
    alt: 'Diagnostic scan tool showing live data, plugged into a vehicle',
    caption: 'Scan tool, live data',
    note: 'Scan tool on the wheel, screen lit, plugged into the OBD port.',
  },
}

export const GALLERY: Shot[] = [SHOTS.van, SHOTS.loom, SHOTS.battery, SHOTS.aircon, SHOTS.bench]
