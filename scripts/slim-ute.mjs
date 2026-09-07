/**
 * Prepares the supplied Toyota Hilux glTF for the web.
 *
 *   npm i @gltf-transform/cli meshoptimizer sharp
 *   node scripts/slim-ute.mjs source.glb public/rmae/ute.glb 0.25 0.01 0.002
 *   npx gltf-transform meshopt public/rmae/ute.glb public/rmae/ute.glb --level high
 *
 * The source is 10.5MB: 228k triangles across 48 shells plus a 120k-segment
 * wireframe overlay carried as LINES primitives. Dropping the overlay and
 * meshopt-compressing takes it to 1.3MB. Quadric simplification barely moves
 * this model, because the shells are separate and the simplifier will not
 * collapse across them, so compression rather than decimation does the work.
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, prune, dedup, join, flatten, textureCompress } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(process.argv[2]);
await MeshoptSimplifier.ready;

let dropped = 0;
for (const mesh of doc.getRoot().listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    if (prim.getMode() !== 4) { mesh.removePrimitive(prim); prim.dispose(); dropped++; }
  }
  if (mesh.listPrimitives().length === 0) mesh.dispose();
}

// join() merges compatible primitives first. Without it the simplifier is
// stuck optimising 47 small shells independently and barely reduces anything.
await doc.transform(
  dedup(), flatten(), join({ keepNamed: false }),
  weld({ tolerance: parseFloat(process.argv[6] || '0.002') }),
  simplify({ simplifier: MeshoptSimplifier, ratio: parseFloat(process.argv[4]), error: parseFloat(process.argv[5]), lockBorder: false }),
  prune(),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [256, 256] }),
);
let tris = 0;
for (const mesh of doc.getRoot().listMeshes())
  for (const prim of mesh.listPrimitives()) {
    const i = prim.getIndices();
    tris += (i ? i.getCount() : prim.getAttribute('POSITION').getCount()) / 3;
  }
console.log('dropped lines', dropped, '| triangles', Math.round(tris), '| prims', doc.getRoot().listMeshes().reduce((a,m)=>a+m.listPrimitives().length,0));
await io.write(process.argv[3], doc);
