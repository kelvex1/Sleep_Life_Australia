/**
 * Renders the gallery stills from the Hilux glTF.
 *
 *   cp scripts/ute-render-harness.html out/rmae/render.html
 *   npx serve out -l 4380
 *   SP=/tmp/shots node scripts/shoot-ute.mjs
 *
 * Then convert the PNGs to WebP into public/rmae/shots/. Five framings and
 * lighting setups, so the set reads as a gallery rather than one render five
 * times. Run in a browser with WebGL; software GL works, just slowly.
 */
const { chromium } = require('playwright');
const fs = require('fs');
// Five distinct framings and lighting setups, so the set reads as a gallery
// rather than the same render five times.
const SHOTS = [
  // The model's nose points -z, so front views put the camera on the -z side.
  { id:'van',     fov:32, cam:[6.4,3.0,-7.2], at:[0,1.05,0],   bg:0x0b0f14, sky:0x8ec8f5, ground:0x070a0f, hemi:0.5,
    keyCol:0xfff0dc, key:3.2, keyPos:[5,8,-6], rimCol:0xff8a2b, rim:2.4, rimPos:[-5,2.5,6], grid:0.30 },
  { id:'tray',    fov:34, cam:[-5.4,3.6,6.4], at:[0,1.1,0.6],  bg:0x0a0e13, sky:0x7fbde8, ground:0x06090d, hemi:0.45,
    keyCol:0xffe9cf, key:3.0, keyPos:[-4,7,5], rimCol:0x38e1ff, rim:2.0, rimPos:[6,2,-4],  grid:0.26 },
  { id:'front',   fov:28, cam:[2.6,1.25,-6.4],at:[0,1.0,-1.3], bg:0x090d12, sky:0x9ad2ff, ground:0x06090d, hemi:0.4,
    keyCol:0xfff2e2, key:3.6, keyPos:[3,5,-7], rimCol:0xff7a12, rim:2.8, rimPos:[-4,1.5,3],grid:0.18 },
  { id:'profile', fov:20, cam:[12.6,1.9,0.3], at:[0,1.0,0],    bg:0x080b10, sky:0x6fb4e2, ground:0x05080c, hemi:0.34,
    keyCol:0xffe6c8, key:2.6, keyPos:[7,6,-4], rimCol:0x38e1ff, rim:3.0, rimPos:[-5,2,5],  grid:0.22 },
  { id:'wheel',   fov:26, cam:[4.2,1.05,-3.0],at:[0.75,0.8,-1.5],bg:0x090c11,sky:0x8ec8f5,ground:0x06090d, hemi:0.42,
    keyCol:0xfff0dc, key:3.4, keyPos:[4,4,-5], rimCol:0xff8a2b, rim:2.6, rimPos:[-3,1.5,4],grid:0.14 },
];

(async () => {
  const dir = process.env.SP;
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox','--disable-dev-shm-usage','--use-gl=swiftshader','--enable-unsafe-swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 1300, height: 950 }, deviceScaleFactor: 1 })).newPage();
  p.on('pageerror', e => console.log('PAGEERR', e.message));
  await p.goto('http://localhost:4380/rmae/render.html', { waitUntil: 'load' });
  await p.waitForFunction(() => window.__ready === true, { timeout: 120000 });
  console.log('model ready');
  for (const s of SHOTS) {
    await p.evaluate((cfg) => window.__shoot(cfg), s);
    await p.waitForTimeout(1200);
    const el = await p.$('#c');
    await el.screenshot({ path: `${dir}/shots/${s.id}.png` });
    console.log('rendered', s.id);
  }
  await b.close();
})();
