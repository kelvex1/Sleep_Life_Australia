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
