/* ---------------------------------------------------------------
   Rockhampton Mobile Auto Electrics: concept preview
   Single-file port of the Next.js demo. Two views, hash-routed.
   --------------------------------------------------------------- */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STAR = '<svg viewBox="0 0 24 24" fill="currentColor" width="SZ" height="SZ" aria-hidden="true"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  function stars(size, n) { var o = ''; for (var i = 0; i < (n || 5); i++) o += STAR.replace(/SZ/g, size); return o; }
  $$('.rmae-stars[data-stars]').forEach(function (el) { el.innerHTML = stars(el.dataset.stars); });

  /* ---------- headline: per-character arc-in ---------- */
  (function () {
    var LINES = ['Mobile auto', 'electrics that', 'come to you'];
    var h = $('#headline'); if (!h) return;
    h.innerHTML = LINES.map(function (text, li) {
      var i = 0, base = 220 + li * 300;
      var chars = text.split('').map(function (ch) {
        if (ch === ' ') return ' ';
        var d = base + (i++) * 34;
        return '<span class="rmae-ch" style="--cd:' + d + 'ms">' + ch + '</span>';
      }).join('');
      return '<span class="rmae-line"><span' + (li === 2 ? ' class="rmae-volt"' : '') + '>' + chars + '</span></span>';
    }).join('');
  })();

  /* ---------- marquee ---------- */
  (function () {
    var items = ['Air conditioning', 'Scan tool diagnostics', 'Harness repair', 'Accessory installation',
      'Dual battery & solar charging', 'Alternators', 'Electric brake controls', 'Servicing & mechanical repairs'];
    var run = '<span>' + items.map(function (t) { return t + ' <i>◆</i> '; }).join('') + '</span>';
    var m = $('#marquee'); if (m) m.innerHTML = run + run;
  })();

  /* ---------- services ---------- */
  (function () {
    var ICON = {
      gauge: '<path d="M12 14l4-4"/><circle cx="12" cy="14" r="9"/><path d="M3.5 9.5h17"/>',
      snow: '<path d="M12 2v20M4.2 7l15.6 10M19.8 7L4.2 17"/><path d="M12 6l-2.2-2.2M12 6l2.2-2.2M12 18l-2.2 2.2M12 18l2.2 2.2"/>',
      batt: '<rect x="2" y="8" width="15" height="9" rx="2"/><path d="M20 11v3"/><path d="M9 10.5l-2 3h3l-2 3"/>',
      van: '<path d="M3 17V8h10l4 4h4v5"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
      chip: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3"/>',
      truck: '<path d="M2 16V6h11v10"/><path d="M13 9h4l4 4v3h-8"/><circle cx="6" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
      plug: '<path d="M9 2v6M15 2v6"/><path d="M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v5"/>',
      wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5l-9 9a2.8 2.8 0 0 1-4-4z"/>'
    };
    var S = [
      ['gauge', 'Scan tool diagnostics', 'Live data off the scan tool instead of guesswork, so the actual fault is found before anyone spends money on parts.', ['Intermittent no-starts', 'Warning lights and modules', 'Parasitic battery drain']],
      ['snow', 'Air conditioning', 'Blowing warm through a Rocky summer is not a small problem. Leak testing, re-gas, compressors and condensers, on site.', ['Licensed re-gas', 'Leak detection', 'Compressor and blower faults']],
      ['batt', 'Alternators', 'Alternators, starters, batteries and the earths everyone forgets. Tested under load so it does not come back next week.', ['Alternators and starters', 'Battery and charge testing', 'Cable and earth repairs']],
      ['van', 'Dual battery and solar', 'Dual battery and solar charging systems for canopies, campers and caravans, wired to do a full trip.', ['DC-DC and solar', 'Anderson plugs', 'Fridge, lights, inverter']],
      ['chip', 'Harness repair', 'Chafed looms, corroded connectors and previous repairs put right, then loomed and labelled so the next person can follow it.', ['Chafed and burnt looms', 'Connector and pin repairs', 'Rewiring and fault finding']],
      ['plug', 'Accessory installation', 'Driving lights, light bars, UHF, reverse cameras and trailer plugs, installed fused and tidy rather than tapped into the nearest wire.', ['Driving lights and light bars', 'UHF and reverse cameras', 'Trailer wiring']],
      ['truck', 'Electric brake controls', 'Electric brake controllers supplied, fitted and set up with the van or trailer on the back, then tested properly.', ['Controller supply and fit', 'Trailer plugs and lighting', 'Set up and tested loaded']],
      ['wrench', 'Servicing and mechanical', 'Not just the electrical side. Servicing and mechanical repairs for commercial and light vehicles across Central Queensland.', ['Logbook and general servicing', 'Mechanical repairs', 'Commercial and light vehicles']]
    ];
    var g = $('#services-grid'); if (!g) return;
    g.innerHTML = S.map(function (s, i) {
      return '<article class="rmae-svc rmae-reveal" style="--d:' + (i * 70) + 'ms">' +
        '<svg class="rmae-svc-circuit" viewBox="0 0 150 150" aria-hidden="true">' +
        '<path d="M10 40 H60 V10 M60 40 H100 V80 H140 M20 90 H70 V130 H130 M100 10 V50 H130"/>' +
        '<circle cx="60" cy="40" r="2.6" fill="#38E1FF" stroke="none"/><circle cx="100" cy="80" r="2.6" fill="#38E1FF" stroke="none"/>' +
        '<circle cx="70" cy="130" r="2.6" fill="#38E1FF" stroke="none"/></svg>' +
        '<span class="rmae-svc-ico"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICON[s[0]] + '</svg></span>' +
        '<h3>' + s[1] + '</h3><p>' + s[2] + '</p>' +
        '<ul>' + s[3].map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>' +
        '<span class="rmae-svc-num" aria-hidden="true">' + String(i + 1).padStart(2, '0') + '</span></article>';
    }).join('');

    $$('.rmae-svc', g).forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', (x * 100) + '%');
        el.style.setProperty('--my', (y * 100) + '%');
        if (!reduce) el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - y) * 5) + 'deg) rotateY(' + ((x - 0.5) * 6) + 'deg) translateY(-3px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  })();

  /* ---------- gauge cluster ---------- */
  var GAUGES = [
    ['Google rating', 4.9, 5, '4.9', 'out of 5'],
    ['Reviews', 39, 50, '39', 'and counting'],
    ['Jobs done on site', 92, 100, '92%', 'no tow needed'],
    ['Call-back time', 78, 100, '<1h', 'business hours']
  ];
  (function () {
    var R = 50, C = 2 * Math.PI * R, box = $('#cluster'); if (!box) return;
    box.innerHTML = GAUGES.map(function (g) {
      return '<div class="rmae-gauge"><div class="rmae-gauge-dial"><svg viewBox="0 0 118 118" width="118" height="118">' +
        '<circle class="rmae-gauge-track" cx="59" cy="59" r="' + R + '"/>' +
        '<circle class="rmae-gauge-arc" cx="59" cy="59" r="' + R + '" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/>' +
        '</svg><span class="rmae-gauge-val">' + g[3] + '</span></div><b>' + g[0] + '</b><span>' + g[4] + '</span></div>';
    }).join('');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$('.rmae-gauge-arc', box).forEach(function (arc, i) {
          arc.style.strokeDashoffset = C * (1 - Math.min(1, GAUGES[i][1] / GAUGES[i][2]) * 0.82);
        });
        io.disconnect();
      });
    }, { threshold: 0.35 });
    io.observe(box);
  })();

  /* ---------- the 3D rig ----------
     three.js, the glTF loader and the meshopt decoder are inlined above, and
     the Hilux is embedded as base64 further down, so nothing here reaches for
     a CDN that the preview sandbox would block. */
  /**
   * WebGL viewer for the supplied Toyota Hilux glTF.
   *
   * three.js and the loader are vendored into public/rmae/vendor rather than
   * pulled from a CDN: the artifact sandbox blocks third-party scripts, and
   * shipping them with the site means one code path that can actually be tested.
   * Everything is loaded on demand, so the 6MB of model and library only
   * downloads once the section scrolls into view.
   */
  /**
   * Anchors in the model's own space, after it is centred and scaled below.
   * Measured off a side-on render at 153px per metre: the nose sits at z=+2.7,
   * the tail at z=-2.7 and the roof at y=1.99. Each one is on the centreline so
   * it stays on the right panel from every angle as the model turns.
   */
  const HOTSPOTS = [
      { id: 'charging', title: 'Alternators and charging', pos: [0, 1.4, 1.95],
          text: 'Alternators, starters, batteries and the earths everyone forgets. Tested under load, not just eyeballed.' },
      { id: 'diagnostics', title: 'Scan tool diagnostics', pos: [0, 1.45, 1.2],
          text: 'Live data off the scan tool, modules, fuses, and harness repair for the wiring nobody wants to chase.' },
      { id: 'aircon', title: 'Air conditioning', pos: [0, 1.55, 0.3],
          text: 'Re-gas, leak testing, compressors and blower faults. Cold air before the next Rocky summer.' },
      { id: 'accessories', title: 'Accessory installation', pos: [0, 1.98, 0.05],
          text: 'Driving lights, light bars, UHF and reverse cameras. Fused and loomed, not tapped into the nearest wire.' },
      { id: 'dual', title: 'Dual battery and solar', pos: [0, 1.25, -1.65],
          text: 'Dual battery and solar charging systems, DC-DC, fridges and inverters. Labelled and tidy.' },
      { id: 'brakes', title: 'Electric brake controls', pos: [0, 0.78, -2.6],
          text: 'Electric brake controllers, trailer plugs and lighting, set up and tested with the van on the back.' },
  ];
  const loading = new Map();
  function script(src) {
      let p = loading.get(src);
      if (!p) {
          p = new Promise((resolve, reject) => {
              const el = document.createElement('script');
              el.src = src;
              el.async = true;
              el.onload = () => resolve();
              el.onerror = () => reject(new Error(`could not load ${src}`));
              document.head.appendChild(el);
          });
          loading.set(src, p);
      }
      return p;
  }
  const TARGET_LENGTH = 5.4;
  async function createUteScene(canvas, src, reduced = false) {
      // Empty sources mean the libraries are already inlined on the page.
      if (src.three)
          await script(src.three);
      if (src.loader)
          await script(src.loader);
      // The model ships meshopt-compressed: 5.4MB of geometry down to 1.3MB.
      if (src.decoder)
          await script(src.decoder);
      const THREE = window.THREE;
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      const renderer = new THREE.WebGLRenderer({
          canvas,
          // antialiasing is expensive fill on phones, and they have the DPR to spare
          antialias: !coarse,
          alpha: true,
          powerPreference: 'high-performance',
      });
      renderer.setClearColor(0x000000, 0);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.92;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);
      // Key, fill and rim, so a dark vehicle still reads against a dark card.
      scene.add(new THREE.HemisphereLight(0x8ec8f5, 0x070a0f, 0.55));
      const key = new THREE.DirectionalLight(0xfff1e0, 2.9);
      key.position.set(4, 7, 5);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x64b9ff, 1.0);
      fill.position.set(-6, 3, 2);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xff8a2b, 1.4);
      rim.position.set(-3, 2, -6);
      scene.add(rim);
      const grid = new THREE.GridHelper(16, 16, 0x3d5566, 0x1e2a33);
      grid.material.transparent = true;
      grid.material.opacity = 0.35;
      scene.add(grid);
      const pivot = new THREE.Group();
      scene.add(pivot);
      const loader = new THREE.GLTFLoader();
      const decoder = window.MeshoptDecoder;
      if (decoder)
          loader.setMeshoptDecoder(decoder);
      const gltf = await new Promise((resolve, reject) => {
          if (src.modelData)
              loader.parse(src.modelData, '', resolve, reject);
          else
              loader.load(src.model, resolve, undefined, reject);
      });
      const model = gltf.scene;
      // Centre on the ground and scale to a real 5.4m. Measured on the centred
      // model, the nose sits at +z and the tail at -z, which is what the hotspot
      // anchors above assume; the camera simply starts on the +z side.
      let boxfit = new THREE.Box3().setFromObject(model);
      const size = boxfit.getSize(new THREE.Vector3());
      const scale = TARGET_LENGTH / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      boxfit = new THREE.Box3().setFromObject(model);
      const centre = boxfit.getCenter(new THREE.Vector3());
      model.position.set(-centre.x, -boxfit.min.y, -centre.z);
      pivot.add(model);
      model.traverse((o) => {
          var _a, _b;
          if (!o.isMesh)
              return;
          o.castShadow = false;
          o.receiveShadow = false;
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          for (const m of mats) {
              if (!m)
                  continue;
              m.side = THREE.DoubleSide; // several panels are single sided
              if (m.metalness !== undefined)
                  m.metalness = Math.min(0.85, ((_a = m.metalness) !== null && _a !== void 0 ? _a : 0.4) + 0.25);
              if (m.roughness !== undefined)
                  m.roughness = Math.max(0.18, ((_b = m.roughness) !== null && _b !== void 0 ? _b : 0.6) - 0.12);
          }
      });
      let yaw = 0.72;
      let pitch = 0.3;
      let dist = 11;
      let dragging = false;
      /** 'spin' when the drag started on the vehicle, 'pan' when it started on the
          background. Decided once on pointerdown by a raycast, so a gesture never
          changes its mind halfway through. */
      let mode = 'spin';
      let lastX = 0;
      let lastY = 0;
      let spin = 0;
      let onScreen = true;
      let raf = 0;
      let recentring = false;
      let listener = null;
      let w = 1;
      let h = 1;
      function resize() {
          const r = canvas.getBoundingClientRect();
          w = Math.max(1, Math.round(r.width));
          h = Math.max(1, Math.round(r.height));
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2));
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          // Pull back on narrow cards so the whole vehicle stays in frame. Phones
          // start closer, otherwise a 5.4m ute on a 300px canvas is a postage stamp
          // and the hotspots land on top of each other.
          dist = (coarse ? 9.6 : 11) * Math.max(1, 1.55 / camera.aspect);
          camera.updateProjectionMatrix();
      }
      // The point the camera orbits. Panning slides it in the camera's own screen
      // plane, which is what makes the vehicle track the pointer one to one.
      const HOME = new THREE.Vector3(0, 0.95, 0);
      const target = HOME.clone();
      const PAN_LIMIT = 2.2;
      const raycaster = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      const right = new THREE.Vector3();
      const up = new THREE.Vector3();
      /** Did this pointer land on the vehicle, or on empty space behind it? */
      function hitsModel(e) {
          const r = canvas.getBoundingClientRect();
          ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
          raycaster.setFromCamera(ndc, camera);
          return raycaster.intersectObject(model, true).length > 0;
      }
      /** Metres of world movement per pixel of drag, at the target's depth. */
      function metresPerPixel() {
          return (2 * dist * Math.tan((camera.fov * Math.PI) / 360)) / Math.max(1, h);
      }
      const anchor = new THREE.Vector3();
      function frame() {
          raf = 0;
          if (!dragging) {
              // carry a flick, then settle back into the slow idle turn
              if (Math.abs(spin) > 0.00025) {
                  yaw += spin;
                  spin *= 0.94;
              }
              else if (!reduced) {
                  yaw += 0.0022;
              }
          }
          if (recentring) {
              target.lerp(HOME, 0.14);
              if (target.distanceTo(HOME) < 0.005) {
                  target.copy(HOME);
                  recentring = false;
              }
          }
          camera.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * dist, target.y + Math.sin(pitch) * dist + 0.7 - 0.95, target.z + Math.cos(yaw) * Math.cos(pitch) * dist);
          camera.lookAt(target);
          renderer.render(scene, camera);
          if (listener) {
              listener(HOTSPOTS.map((hs) => {
                  anchor.set(hs.pos[0], hs.pos[1], hs.pos[2]);
                  const d = anchor.distanceTo(camera.position);
                  anchor.project(camera);
                  return {
                      x: (anchor.x * 0.5 + 0.5) * w,
                      y: (-anchor.y * 0.5 + 0.5) * h,
                      depth: d,
                      front: d < dist,
                      visible: anchor.z < 1,
                  };
              }));
          }
          schedule();
      }
      function schedule() {
          if (!raf && onScreen)
              raf = requestAnimationFrame(frame);
      }
      // Stop rendering entirely when the section is scrolled away: on a phone this
      // is the difference between a warm battery and a flat one.
      const vis = new IntersectionObserver((entries) => {
          onScreen = entries.some((e) => e.isIntersecting);
          if (onScreen)
              schedule();
      }, { rootMargin: '120px' });
      vis.observe(canvas);
      function onDown(e) {
          dragging = true;
          spin = 0;
          recentring = false;
          mode = hitsModel(e) ? 'spin' : 'pan';
          canvas.style.cursor = mode === 'pan' ? 'move' : 'grabbing';
          lastX = e.clientX;
          lastY = e.clientY;
          canvas.setPointerCapture(e.pointerId);
          schedule();
      }
      function onMove(e) {
          if (!dragging)
              return;
          const dx = e.clientX - lastX;
          const dy = e.clientY - lastY;
          if (mode === 'pan') {
              const k = metresPerPixel();
              const m = camera.matrixWorld.elements;
              right.set(m[0], m[1], m[2]);
              up.set(m[4], m[5], m[6]);
              target.addScaledVector(right, -dx * k);
              // touch keeps the page scrollable, so a finger only pans sideways
              if (e.pointerType !== 'touch')
                  target.addScaledVector(up, dy * k);
              target.x = Math.max(HOME.x - PAN_LIMIT, Math.min(HOME.x + PAN_LIMIT, target.x));
              target.y = Math.max(HOME.y - 0.9, Math.min(HOME.y + 1.5, target.y));
              target.z = Math.max(HOME.z - PAN_LIMIT, Math.min(HOME.z + PAN_LIMIT, target.z));
          }
          else {
              yaw -= dx * 0.008;
              spin = -dx * 0.008;
              if (e.pointerType !== 'touch') {
                  pitch = Math.max(0.03, Math.min(0.72, pitch + dy * 0.004));
              }
          }
          lastX = e.clientX;
          lastY = e.clientY;
          schedule();
      }
      /** Double click or double tap puts it back where it started. */
      function onDouble() {
          recentring = true;
          schedule();
      }
      function onUp(e) {
          dragging = false;
          canvas.style.cursor = 'grab';
          try {
              canvas.releasePointerCapture(e.pointerId);
          }
          catch { /* pointer already gone */ }
      }
      canvas.style.cursor = 'grab';
      canvas.addEventListener('dblclick', onDouble);
      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerup', onUp);
      canvas.addEventListener('pointercancel', onUp);
      window.addEventListener('resize', resize);
      resize();
      schedule();
      return {
          destroy() {
              if (raf)
                  cancelAnimationFrame(raf);
              canvas.removeEventListener('dblclick', onDouble);
              canvas.removeEventListener('pointerdown', onDown);
              canvas.removeEventListener('pointermove', onMove);
              canvas.removeEventListener('pointerup', onUp);
              canvas.removeEventListener('pointercancel', onUp);
              window.removeEventListener('resize', resize);
              vis.disconnect();
              renderer.dispose();
          },
          onFrame(cb) { listener = cb; },
          isPanned: () => target.distanceTo(HOME) > 0.05,
          recentre: () => { recentring = true; schedule(); },
      };
  }

  (function () {
    var canvas = document.getElementById('ute-canvas');
    var host = document.getElementById('ute-pins');
    var out = $('#readout');
    var stage = document.querySelector('.rmae-stage');
    if (!canvas || !host || !out) return;

    var note = document.createElement('div');
    note.className = 'rmae-stage-loading';
    note.textContent = 'Loading model…';
    if (stage) stage.appendChild(note);

    function bytes(b64) {
      var bin = atob(b64);
      var a = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
      return a.buffer;
    }

    var active = 0;
    var pins = HOTSPOTS.map(function (h, i) {
      var b = document.createElement('button');
      b.className = 'rmae-pin3' + (i === 0 ? ' rmae-pin3-on' : '');
      b.setAttribute('aria-label', h.title);
      b.innerHTML = '<span aria-hidden="true"></span>';
      b.addEventListener('pointerenter', function () { show(i); });
      b.addEventListener('focus', function () { show(i); });
      b.addEventListener('click', function () { show(i); });
      host.appendChild(b);
      return b;
    });
    function show(i) {
      active = i;
      pins.forEach(function (p, j) { p.classList.toggle('rmae-pin3-on', i === j); });
      out.innerHTML = '<b>' + HOTSPOTS[i].title + ':</b> ' + HOTSPOTS[i].text;
    }
    show(0);

    var hint = stage && stage.querySelector('.rmae-stage-hint');
    var reset = document.createElement('button');
    reset.className = 'rmae-stage-reset';
    reset.hidden = true;
    reset.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg> Recentre';
    if (stage) stage.appendChild(reset);

    createUteScene(canvas, { three: '', loader: '', decoder: '', modelData: bytes(UTE_GLB) }, reduce)
      .then(function (scene) {
        note.remove();
        host.classList.add('rmae-pins-on');
        reset.addEventListener('click', function () { scene.recentre(); });
        var wasPanned = false;
        scene.onFrame(function (pts) {
          var now = scene.isPanned();
          if (now !== wasPanned) {
            wasPanned = now;
            reset.hidden = !now;
            if (hint) hint.hidden = now;
          }
          pts.forEach(function (p, i) {
            var pin = pins[i];
            var scale = Math.max(0.62, Math.min(1.1, 13 / p.depth));
            pin.style.transform = 'translate(' + p.x + 'px, ' + p.y + 'px) translate(-50%, -50%) scale(' + scale.toFixed(3) + ')';
            pin.style.opacity = p.visible ? (p.front ? '1' : '0.34') : '0';
            pin.style.pointerEvents = p.visible ? 'auto' : 'none';
            pin.style.zIndex = p.front ? '3' : '1';
          });
        });
      })
      .catch(function (err) {
        console.error('rig viewer failed to start', err);
        note.textContent = '3D model unavailable';
      });
  })();

  /* ---------- promises, steps, towns ---------- */
  (function () {
    var P = [
      ['We turn up when we say', 'You get a time window and a call when the van is on its way. No all-day waiting.'],
      ['A price before the spanners', 'Diagnosis first, then a number. You approve the work before anything gets touched.'],
      ['Fixed properly, once', 'Loomed, fused and labelled to a standard you would be happy to open up in five years.']
    ];
    var el = $('#promises');
    if (el) el.innerHTML = P.map(function (p, i) {
      return '<div class="rmae-check rmae-reveal" style="--d:' + (i * 90) + 'ms"><span class="rmae-check-ico">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>' +
        '</span><div><b>' + p[0] + '</b><p>' + p[1] + '</p></div></div>';
    }).join('');

    var S = [
      ['Step 01', 'You call or send the form', 'Thirty seconds. Vehicle, suburb, what it is doing. That is all we need to start.'],
      ['Step 02', 'We book a real time slot', 'A window that suits you: home, work or the yard. You get a heads-up call before we roll.'],
      ['Step 03', 'Diagnosis, then a price', 'We find the actual fault on site and quote it before we touch anything.'],
      ['Step 04', 'Fixed and tested there', 'Repaired, load-tested and tidied up. Invoice and warranty in your inbox before we leave.']
    ];
    var st = $('#steps');
    if (st) st.innerHTML = S.map(function (s, i) {
      return '<article class="rmae-step rmae-reveal" style="--d:' + (i * 110) + 'ms"><div class="rmae-step-n">' + s[0] + '</div><h3>' + s[1] + '</h3><p>' + s[2] + '</p></article>';
    }).join('');

    var T = ['Rockhampton City', 'North Rockhampton', 'Parkhurst', 'Norman Gardens', 'Frenchville', 'Berserker',
      'Wandal', 'Gracemere', 'Yeppoon', 'Emu Park', 'Mount Morgan', 'Bouldercombe', 'Marmor', 'Capricorn Coast'];
    var tw = $('#towns');
    if (tw) tw.innerHTML = T.map(function (t) { return '<li>' + t + '</li>'; }).join('');

    var PINS = [[50, 16, 'Yeppoon'], [79, 34, 'Emu Park'], [22, 40, 'Gracemere'], [72, 72, 'Bouldercombe'], [26, 76, 'Mount Morgan']];
    var rd = $('#radar');
    if (rd) rd.insertAdjacentHTML('beforeend', PINS.map(function (p) {
      return '<div class="rmae-pin" style="left:' + p[0] + '%;top:' + p[1] + '%"><i></i><span>' + p[2] + '</span></div>';
    }).join(''));
  })();

  /* ---------- reviews ---------- */
  (function () {
    var Q = [
      ['Workmanship, Service and Price were all outstanding.', 'A', '#F26F1F'],
      ['Spotless workshop - a sign of well organised and quality service.', 'D', '#3DDC97'],
      ['Answered all my questions and explained everything, all on a Saturday morning!', 'J', '#38E1FF']
    ];
    var wrap = $('#quotes'), dots = $('#review-dots'); if (!wrap) return;
    wrap.innerHTML = Q.map(function (q, i) {
      return '<figure class="rmae-quote' + (i === 0 ? ' rmae-on' : '') + '"><blockquote>&ldquo;' + q[0] + '&rdquo;</blockquote>' +
        '<footer><span class="rmae-avatar" style="background:' + q[2] + '" aria-hidden="true">' + q[1] + '</span>' +
        '<span class="rmae-stars">' + stars(12) + '</span> Verified Google review</footer></figure>';
    }).join('');
    dots.innerHTML = Q.map(function (q, i) {
      return '<button class="' + (i === 0 ? 'rmae-on' : '') + '" data-i="' + i + '" aria-label="Show review ' + (i + 1) + '"></button>';
    }).join('');
    var cur = 0, timer;
    function go(i) {
      cur = i;
      $$('.rmae-quote', wrap).forEach(function (n, j) { n.classList.toggle('rmae-on', i === j); });
      $$('button', dots).forEach(function (n, j) { n.classList.toggle('rmae-on', i === j); });
    }
    $$('button', dots).forEach(function (b) {
      b.addEventListener('click', function () { go(+b.dataset.i); clearInterval(timer); });
    });
    if (!reduce) timer = setInterval(function () { go((cur + 1) % Q.length); }, 5200);
  })();

  /* ---------- photo plates ----------
     Each slot is designed before it is filled: the plate underneath carries
     the brief for the shot, and the photograph fades in over it only once it
     has decoded. A blocked or missing file leaves a labelled card, never a
     broken box. The artifact sandbox blocks external images, so in this
     preview every plate shows its brief. */
  // Renders of the supplied Hilux glTF, embedded as data URIs: the preview
  // sandbox blocks every external image host, so the bytes ship with the page.
  var SHOTS = {
    van:     [SHOT_SRC.van,     'Dual-cab four wheel drive service ute with a bull bar and driving lights', 'The rig, ready to roll', 'The RMAE ute on a job, canopy open, work light on. Late afternoon.'],
    front:   [SHOT_SRC.front,   'Front of the service ute, bull bar and spotlights', 'Front bar and lights', 'Hands on the tools. Crimper, loom, heat shrink, close in.'],
    tray:    [SHOT_SRC.tray,    'Rear three quarter view of the service ute showing the open tray', 'Tray and canopy space', 'A finished dual battery job. Labelled fuse block, tidy cabling.'],
    profile: [SHOT_SRC.profile, 'Side profile of the service ute, showing the tray, snorkel and side steps', 'The workshop on the back', 'The van side-on with signage showing. Good for the top of the page.'],
    wheel:   [SHOT_SRC.wheel,   'Close view of the front wheel and guard of the service ute', 'Built for CQ tracks', 'The workshop, tidy. This is the one the reviews keep mentioning.']
  };
  var CAM = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>';

  function plate(key) {
    var sh = SHOTS[key];
    var fig = document.createElement('figure');
    fig.className = 'rmae-plate';
    fig.innerHTML = '<div class="rmae-plate-slot">' + CAM + '<b>Photo to come</b><span>' + sh[3] + '</span></div>' +
      '<img alt="' + sh[1] + '" loading="lazy" decoding="async" />' +
      '<figcaption hidden><i></i>' + sh[2] + '</figcaption>';
    var img = $('img', fig), cap = $('figcaption', fig);
    img.addEventListener('load', function () { img.classList.add('rmae-plate-on'); cap.hidden = false; });
    img.addEventListener('error', function () { img.style.display = 'none'; });
    img.src = sh[0];
    return fig;
  }

  (function () {
    var grid = $('#gallery-grid');
    if (grid) ['van', 'front', 'tray', 'profile', 'wheel'].forEach(function (k) { grid.appendChild(plate(k)); });

    var cta = $('#cta-photo');
    if (cta) {
      var img = document.createElement('img');
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('load', function () { img.classList.add('rmae-plate-on'); });
      img.addEventListener('error', function () { img.style.display = 'none'; });
      img.src = SHOTS.profile[0];
      cta.appendChild(img);
    }
  })();

  /* ---------- wiring loom, drawn by scroll ---------- */
  (function () {
    var LEFT = 'M 4 0 C 4 70, 1.5 100, 1.5 170 C 1.5 240, 8 260, 8 330 C 8 400, 2 420, 2 490 C 2 560, 7.5 580, 7.5 650 C 7.5 720, 2 740, 2 810 C 2 880, 5 910, 5 1000';
    var RIGHT = 'M 96 0 C 96 70, 98.5 100, 98.5 170 C 98.5 240, 92 260, 92 330 C 92 400, 98 420, 98 490 C 98 560, 92.5 580, 92.5 650 C 92.5 720, 98 740, 98 810 C 98 880, 95 910, 95 1000';
    var g = $('#loom-wires'); if (!g) return;
    g.innerHTML = [LEFT, RIGHT].map(function (d) {
      return '<g><path class="rmae-loom-base" d="' + d + '" vector-effect="non-scaling-stroke"/>' +
        '<path class="rmae-loom-live" d="' + d + '" vector-effect="non-scaling-stroke"/>' +
        '<path class="rmae-loom-pulse" d="' + d + '" vector-effect="non-scaling-stroke"/></g>';
    }).join('');
    var live = $$('.rmae-loom-live', g), frame = 0;
    function draw() {
      frame = 0;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      var eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      live.forEach(function (el) {
        var len = el.getTotalLength();
        el.style.strokeDasharray = len;
        el.style.strokeDashoffset = len * (1 - Math.min(1, eased * 1.08));
      });
    }
    draw();
    window.addEventListener('scroll', function () { if (!frame) frame = requestAnimationFrame(draw); }, { passive: true });
    window.addEventListener('resize', draw);
  })();

  /* ---------- reveal on scroll + sticky nav ---------- */
  (function () {
    var targets = $$('.rmae-reveal, .rmae-step');
    if (!('IntersectionObserver' in window) || reduce) {
      targets.forEach(function (t) { t.classList.add('rmae-in'); });
    } else {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('rmae-in'); io.unobserve(e.target); } });
      }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
      targets.forEach(function (t) { io.observe(t); });
      // safety net: nothing stays invisible if the observer never fires
      setTimeout(function () {
        targets.forEach(function (t) {
          var r = t.getBoundingClientRect();
          if (r.top < window.innerHeight) t.classList.add('rmae-in');
        });
      }, 1500);
    }
    var nav = $('#nav');
    var onScroll = function () { nav.classList.toggle('rmae-nav-stuck', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /* =============================================================
     Enquiries: the website form writes, the dashboard reads.
     ============================================================= */
  var KEY = 'rmae.enquiries.v1';
  var ORDER = ['new', 'quoted', 'booked', 'done'];
  var LABEL = { new: 'New', quoted: 'Quoted', booked: 'Booked', done: 'Complete' };
  var TAGCLS = { New: 'rmadm-t-new', Quoted: 'rmadm-t-quoted', Booked: 'rmadm-t-booked', Complete: 'rmadm-t-done' };

  function refOf(id) {
    var tail = id.replace(/[^a-z0-9]/gi, '').slice(-5).toUpperCase();
    return 'RMAE-' + tail.padStart(5, '0');
  }
  function hrs(h) { return new Date(Date.now() - h * 3600000).toISOString(); }
  function seed() {
    return [
      { id: 's-1001', name: 'Dave Kerrigan', phone: '0412 884 210', vehicle: '2019 Toyota Hilux SR5', service: 'Dual battery system', urgency: 'this-week', notes: 'Wants a DC-DC charger and Anderson plug for the camper.', createdAt: hrs(3), status: 'new', value: 1450, source: 'Website form' },
      { id: 's-1002', name: 'Megan Foulis', phone: '0433 190 776', vehicle: '2015 Mazda CX-5', service: 'Air conditioning re-gas', urgency: 'today', notes: 'Blowing warm. Parked at work in Kent St all day.', createdAt: hrs(6), status: 'quoted', value: 320, source: 'Google' },
      { id: 's-1003', name: 'Rocky Earthworks', phone: '0455 022 118', vehicle: 'Kenworth T659 (fleet x3)', service: 'Fleet electrical service', urgency: 'planning', notes: 'Quarterly check on three prime movers. On-site at Gracemere.', createdAt: hrs(26), status: 'booked', value: 2760, source: 'Referral' },
      { id: 's-1004', name: 'Sam Whitcombe', phone: '0407 613 402', vehicle: '2008 Nissan Patrol GU', service: 'Auto electrical diagnostics', urgency: 'today', notes: 'Intermittent no-start, suspect ignition switch or earth strap.', createdAt: hrs(31), status: 'booked', value: 480, source: 'Facebook' },
      { id: 's-1005', name: 'Priya Raman', phone: '0421 550 903', vehicle: '2021 Isuzu D-Max', service: '12V camper fitout', urgency: 'planning', notes: 'Full canopy fitout: fridge, lighting, inverter, solar.', createdAt: hrs(50), status: 'done', value: 3180, source: 'Website form' },
      { id: 's-1006', name: 'Trent Mabo', phone: '0438 771 245', vehicle: '2013 Ford Ranger PX', service: 'Trailer wiring & lights', urgency: 'this-week', notes: 'New 7-pin flat plug plus a reverse camera while it is in.', createdAt: hrs(72), status: 'done', value: 640, source: 'Phone' }
    ];
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) { var s = seed(); localStorage.setItem(KEY, JSON.stringify(s)); return s; }
      var p = JSON.parse(raw);
      return Array.isArray(p) ? p : seed();
    } catch (e) { return seed(); }
  }
  function save(rows) { try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch (e) {} }
  function timeAgo(iso) {
    var m = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
    if (m < 1) return 'just now';
    if (m < 60) return m + 'm ago';
    var h = Math.round(m / 60);
    return h < 24 ? h + 'h ago' : Math.round(h / 24) + 'd ago';
  }
  var rows = load();

  /* ---------- the hero enquiry form ---------- */
  var SERVICES = ['Air conditioning', 'Scan tool diagnostics', 'Harness repair', 'Accessory installation',
    'Dual battery & solar charging', 'Alternators, starting & charging', 'Electric brake controls',
    'Servicing & mechanical repairs', 'Something else'];

  function renderForm() {
    $('#form-slot').innerHTML =
      '<div class="rmae-card-head"><div><h3>Get a straight answer</h3>' +
      '<p>Tell us the vehicle and the fault. We’ll call you back with a price, not a runaround.</p></div>' +
      '<span class="rmae-chip"><i class="rmae-live-dot"></i>Open now</span></div>' +
      '<form class="rmae-form" id="enquiry" novalidate>' +
      '<div class="rmae-row">' +
      field('name', 'Your name', '<input id="f-name" placeholder="Dave" autocomplete="name" />') +
      field('phone', 'Mobile', '<input id="f-phone" placeholder="0412 345 678" inputmode="tel" autocomplete="tel" />') +
      '</div><div class="rmae-row">' +
      field('email', 'Email (optional)', '<input id="f-email" placeholder="you@example.com" inputmode="email" />') +
      field('vehicle', 'Vehicle', '<input id="f-vehicle" placeholder="2019 Hilux SR5" />') +
      '</div>' +
      field('service', 'What do you need?', '<select id="f-service"><option value="">Choose a job type…</option>' +
        SERVICES.map(function (s) { return '<option>' + s + '</option>'; }).join('') + '</select>') +
      field('urgency', 'How soon?', '<select id="f-urgency"><option value="today">Today, it’s off the road</option>' +
        '<option value="this-week" selected>This week</option><option value="planning">Just planning / after a price</option></select>') +
      field('notes', 'What’s it doing? (optional)', '<textarea id="f-notes" placeholder="Won’t crank in the mornings, clicks once then nothing…"></textarea>') +
      '<div class="rmae-form-foot"><small>No spam. Straight to the workshop.</small>' +
      '<button class="rmae-btn" type="submit">Send it through →</button></div></form>';

    $('#enquiry').addEventListener('submit', submit);
  }
  function field(k, label, control) {
    return '<div class="rmae-field" data-f="' + k + '"><label for="f-' + k + '">' + label + '</label>' + control +
      '<span class="rmae-err" hidden></span></div>';
  }
  function setErr(k, msg) {
    var f = $('.rmae-field[data-f="' + k + '"]'); if (!f) return;
    f.classList.toggle('rmae-bad', !!msg);
    var e = $('.rmae-err', f);
    e.textContent = msg || ''; e.hidden = !msg;
  }
  function submit(e) {
    e.preventDefault();
    var name = $('#f-name').value.trim(), phone = $('#f-phone').value.trim(), service = $('#f-service').value;
    var ok = true;
    setErr('name', name.length < 2 ? (ok = false, 'Tell us who to ask for.') : '');
    setErr('phone', phone.replace(/\D/g, '').length < 8 ? (ok = false, 'We need a number to call you back on.') : '');
    setErr('service', !service ? (ok = false, 'Pick the closest one. We will sort the detail on the phone.') : '');
    if (!ok) return;

    var btn = $('#enquiry button[type=submit]');
    btn.disabled = true; btn.textContent = 'Sending…';
    setTimeout(function () {
      var row = {
        id: 'w-' + Date.now().toString(36), name: name, phone: phone,
        email: $('#f-email').value.trim(), vehicle: $('#f-vehicle').value.trim() || 'Not supplied',
        service: service, urgency: $('#f-urgency').value, notes: $('#f-notes').value.trim(),
        createdAt: new Date().toISOString(), status: 'new', value: 0, source: 'Website form'
      };
      rows = [row].concat(rows); save(rows);
      $('#form-slot').innerHTML =
        '<div class="rmae-sent"><div class="rmae-sent-ring">' +
        '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></div>' +
        '<h4>Booked in the queue</h4>' +
        '<p>Thanks ' + name.split(' ')[0] + ', your job is sitting in the workshop dashboard now. Expect a call back on ' + phone + '.</p>' +
        '<code>' + refOf(row.id) + '</code>' +
        '<a class="rmae-btn rmae-btn-ghost" href="#" data-go-admin>See it land in the dashboard →</a>' +
        '<button style="font-size:.78rem;color:var(--text-3)" id="again">Send another</button></div>';
      $('#again').addEventListener('click', renderForm);
      bindNav();
    }, 850);
  }
  renderForm();

  /* =============================================================
     Dashboard
     ============================================================= */
  var JOBS = [
    ['07:45', 'Megan Foulis', 'Air con re-gas · Kent St (at her work)', 'Quoted'],
    ['09:30', 'Sam Whitcombe', 'GU Patrol · intermittent no-start · Frenchville', 'Booked'],
    ['11:15', 'Rocky Earthworks', 'Fleet check ×3 · Gracemere yard', 'Booked'],
    ['14:00', 'Dave Kerrigan', 'Dual battery + DC-DC quote · Parkhurst', 'New']
  ];
  var tab = 'dashboard', query = '', fresh = [];

  function counts() {
    var by = function (s) { return rows.filter(function (r) { return r.status === s; }).length; };
    return {
      new: by('new'), quoted: by('quoted'), booked: by('booked'), done: by('done'), total: rows.length,
      pipeline: rows.filter(function (r) { return r.status !== 'done'; }).reduce(function (a, r) { return a + r.value; }, 0)
    };
  }
  function spark(points, color) {
    var max = Math.max.apply(null, points.concat([1]));
    var d = points.map(function (p, i) { return (i / (points.length - 1)) * 96 + ',' + (46 - (p / max) * 38 - 4); }).join(' ');
    return '<svg class="rmadm-spark" viewBox="0 0 96 46" aria-hidden="true"><polyline points="' + d +
      '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function tag(label, extra) {
    return '<span class="rmadm-tag ' + (TAGCLS[label] || '') + (extra || '') + '"><i></i>' + label + '</span>';
  }
  /* Area chart, drawn to one scale: 0..max across seven weekdays. */
  function chart() {
    var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var base = [4, 6, 5, 8, 9, 3, 2], booked = [2, 4, 3, 5, 6, 2, 1];
    var todayIdx = (new Date().getDay() + 6) % 7;
    var fromSite = rows.filter(function (r) { return r.id.indexOf('w-') === 0; }).length;
    var enq = base.map(function (v, i) { return v + (i === todayIdx ? fromSite : 0); });
    var W = 520, H = 200, PL = 34, PB = 26, PT = 12;
    var max = Math.max.apply(null, enq.concat(booked)) + 2;
    var x = function (i) { return PL + (i / (days.length - 1)) * (W - PL - 10); };
    var y = function (v) { return PT + (1 - v / max) * (H - PT - PB); };
    function series(vals, stroke, fill) {
      var line = vals.map(function (v, i) { return (i ? 'L' : 'M') + x(i) + ' ' + y(v); }).join(' ');
      var area = line + ' L' + x(vals.length - 1) + ' ' + y(0) + ' L' + x(0) + ' ' + y(0) + ' Z';
      return '<path d="' + area + '" fill="' + fill + '"/><path d="' + line + '" fill="none" stroke="' + stroke + '" stroke-width="2" stroke-linejoin="round"/>';
    }
    var ticks = [0, Math.round(max / 2), max].map(function (v) {
      return '<line x1="' + PL + '" x2="' + (W - 10) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="rgba(255,255,255,.07)"/>' +
        '<text x="' + (PL - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end" fill="#67707F" font-size="10" font-family="JetBrains Mono, monospace">' + v + '</text>';
    }).join('');
    var labels = days.map(function (d, i) {
      return '<text x="' + x(i) + '" y="' + (H - 6) + '" text-anchor="middle" fill="#67707F" font-size="10">' + d + '</text>';
    }).join('');
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" class="rmadm-chart" role="img" aria-label="Enquiries and bookings over the last seven days">' +
      '<defs><linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F26F1F" stop-opacity=".5"/><stop offset="100%" stop-color="#F26F1F" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38E1FF" stop-opacity=".38"/><stop offset="100%" stop-color="#38E1FF" stop-opacity="0"/></linearGradient></defs>' +
      ticks + series(enq, '#F26F1F', 'url(#cg1)') + series(booked, '#38E1FF', 'url(#cg2)') + labels + '</svg>';
  }

  function renderAdmin() {
    var c = counts();
    $('#badge-new').textContent = c.new;
    $('#health-new').textContent = c.new;
    var titles = {
      dashboard: ['Today at a glance', 'Everything the website sent through, plus what is booked.'],
      enquiries: ['Enquiries', 'Use the button on a row to move it along the pipeline.'],
      jobs: ['Today’s run sheet', 'Ordered by start time. Tap a job to call the customer.']
    };
    $('#adm-title').textContent = titles[tab][0];
    $('#adm-sub').textContent = titles[tab][1];
    $$('#adm-nav button').forEach(function (b) { b.classList.toggle('rmadm-on', b.dataset.tab === tab); });

    var body = $('#adm-body'), html = '';
    if (tab === 'dashboard') {
      html += '<div class="rmadm-kpis">' +
        kpi('New enquiries', c.new, 'waiting on a call back', 'up', [2, 3, 2, 4, 5, 3, c.new || 1], '#38E1FF') +
        kpi('Booked this week', c.booked + c.done, '+18% on last week', 'up', [3, 4, 4, 6, 5, 7, 8], '#F26F1F') +
        kpi('Quoted &amp; open', '$' + c.pipeline.toLocaleString('en-AU'), (c.quoted + c.booked) + ' jobs live', 'up', [4, 5, 7, 6, 8, 9, 9], '#FFC24B') +
        kpi('Avg. call back', '41m', '12m faster than last month', 'down', [9, 8, 8, 6, 5, 5, 4], '#3DDC97') +
        '</div><div class="rmadm-cols"><section class="rmadm-panel">' +
        '<div class="rmadm-panel-head"><h3>Enquiries vs booked</h3><span class="rmadm-hint">last 7 days</span></div>' +
        '<div class="rmadm-panel-body">' + chart() +
        '<div class="rmadm-legend"><span><i style="background:#F26F1F"></i>Enquiries in</span><span><i style="background:#38E1FF"></i>Converted to a booking</span></div>' +
        '<div class="rmadm-note"><span><b>Try it:</b> send an enquiry from the website form and it appears in this dashboard straight away. No refresh, no spreadsheet.</span></div>' +
        '</div></section><div style="display:grid;gap:.85rem;align-content:start">' +
        '<section class="rmadm-panel"><div class="rmadm-panel-head"><h3>Pipeline</h3><span class="rmadm-hint">' + c.total + ' total</span></div>' +
        '<div class="rmadm-panel-body"><div class="rmadm-pipe">' +
        ORDER.map(function (s) {
          var n = rows.filter(function (r) { return r.status === s; }).length;
          var col = { new: '#38E1FF', quoted: '#FFC24B', booked: '#F26F1F', done: '#3DDC97' }[s];
          return '<div class="rmadm-pipe-row"><div class="rmadm-pipe-top"><span>' + LABEL[s] + '</span><b>' + n + '</b></div>' +
            '<div class="rmadm-pipe-bar"><div class="rmadm-pipe-fill" style="width:' + (c.total ? (n / c.total) * 100 : 0) + '%;background:' + col + '"></div></div></div>';
        }).join('') +
        '</div></div></section>' +
        '<section class="rmadm-panel"><div class="rmadm-panel-head"><h3>Next up</h3><span class="rmadm-hint">today</span></div>' +
        '<div class="rmadm-panel-body"><div class="rmadm-jobs">' +
        JOBS.slice(0, 3).map(function (j) {
          return '<div class="rmadm-job"><span class="rmadm-job-time">' + j[0] + '</span>' +
            '<span><b>' + j[1] + '</b><span>' + j[2] + '</span></span>' + tag(j[3]) + '</div>';
        }).join('') + '</div></div></section></div></div>';
    } else if (tab === 'enquiries') {
      var q = query.trim().toLowerCase();
      var list = !q ? rows : rows.filter(function (r) {
        return [r.name, r.phone, r.vehicle, r.service, r.notes, refOf(r.id)].join(' ').toLowerCase().indexOf(q) > -1;
      });
      html += '<section class="rmadm-panel"><div class="rmadm-panel-head"><h3>All enquiries</h3>' +
        '<span class="rmadm-hint">' + list.length + ' shown</span></div><div class="rmadm-panel-body rmadm-flush">';
      if (!list.length) {
        html += '<div class="rmadm-empty"><span>Nothing matches &ldquo;' + query + '&rdquo;.</span></div>';
      } else {
        html += '<div class="rmadm-tbl-wrap"><table class="rmadm-tbl"><thead><tr>' +
          '<th>Customer</th><th>Vehicle</th><th>Job</th><th>Source</th><th>Received</th><th>Status</th><th></th>' +
          '</tr></thead><tbody>' + list.map(function (r) {
            var next = ORDER[ORDER.indexOf(r.status) + 1];
            return '<tr' + (fresh.indexOf(r.id) > -1 ? ' class="rmadm-fresh"' : '') + '>' +
              '<td class="rmadm-who"><b>' + r.name + '</b><span>' + r.phone + ' · ' + refOf(r.id) + '</span></td>' +
              '<td>' + r.vehicle + '</td>' +
              '<td>' + r.service + (r.notes ? '<div style="color:var(--text-3);font-size:.78rem;margin-top:2px;max-width:260px">' + r.notes + '</div>' : '') + '</td>' +
              '<td class="rmadm-muted">' + r.source + '</td>' +
              '<td class="rmadm-muted">' + timeAgo(r.createdAt) + '</td>' +
              '<td>' + tag(LABEL[r.status]) +
              (r.urgency === 'today' && r.status !== 'done' ? ' <span class="rmadm-tag rmadm-t-urgent"><i></i>Today</span>' : '') + '</td>' +
              '<td>' + (next ? '<button class="rmadm-step-btn" data-advance="' + r.id + '">Move to ' + LABEL[next] + '</button>' : '') + '</td></tr>';
          }).join('') + '</tbody></table></div>';
      }
      html += '</div></section>';
    } else {
      html += '<section class="rmadm-panel"><div class="rmadm-panel-head"><h3>Run sheet</h3>' +
        '<span class="rmadm-hint">' + new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' }) + '</span></div>' +
        '<div class="rmadm-panel-body"><div class="rmadm-jobs">' + JOBS.map(function (j) {
          return '<div class="rmadm-job"><span class="rmadm-job-time">' + j[0] + '</span>' +
            '<span><b>' + j[1] + '</b><span>' + j[2] + '</span></span>' +
            '<span style="display:flex;gap:.5rem;align-items:center">' + tag(j[3]) +
            '<a class="rmadm-step-btn" href="tel:+61427667996">Call</a></span></div>';
        }).join('') + '</div>' +
        '<div class="rmadm-note"><span><b>Where this goes next:</b> the run sheet can pull straight from the calendar, text the customer an &ldquo;on my way&rdquo; message, and drop the invoice into Xero when the job is marked complete.</span></div>' +
        '</div></section>';
    }
    body.innerHTML = html;

    $$('[data-advance]', body).forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.advance;
        rows = rows.map(function (r) {
          if (r.id !== id) return r;
          return Object.assign({}, r, { status: ORDER[Math.min(ORDER.indexOf(r.status) + 1, ORDER.length - 1)] });
        });
        save(rows); renderAdmin();
      });
    });
  }
  function kpi(label, val, delta, dir, points, color) {
    return '<div class="rmadm-kpi"><h4>' + label + '</h4><div class="rmadm-kpi-val">' + val + '</div>' +
      '<div class="rmadm-kpi-delta rmadm-' + dir + '">' + (dir === 'up' ? '↗' : '↘') + ' ' + delta + '</div>' +
      spark(points, color) + '</div>';
  }
  $$('#adm-nav button').forEach(function (b) {
    b.addEventListener('click', function () { tab = b.dataset.tab; renderAdmin(); });
  });
  $('#adm-search').addEventListener('input', function (e) {
    query = e.target.value; if (tab !== 'enquiries') tab = 'enquiries'; renderAdmin();
  });
  setInterval(function () {
    $('#clock').textContent = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Australia/Brisbane' });
  }, 30000);
  $('#clock').textContent = new Date().toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Australia/Brisbane' });

  /* ---------- two views, one page ---------- */
  function show(view) {
    var admin = view === 'admin';
    $('#view-site').hidden = admin;
    $('#view-admin').hidden = !admin;
    if (admin) {
      rows = load();
      fresh = rows.filter(function (r) { return Date.now() - new Date(r.createdAt).getTime() < 120000; })
        .map(function (r) { return r.id; });
      tab = 'dashboard';
      renderAdmin();
    }
    window.scrollTo(0, 0);
  }
  function bindNav() {
    $$('[data-go-admin]').forEach(function (a) {
      a.onclick = function (e) { e.preventDefault(); location.hash = '#admin'; show('admin'); };
    });
    $$('[data-go-site]').forEach(function (a) {
      a.onclick = function (e) { e.preventDefault(); location.hash = ''; show('site'); };
    });
  }
  bindNav();
  window.addEventListener('hashchange', function () { show(location.hash === '#admin' ? 'admin' : 'site'); });
  if (location.hash === '#admin') show('admin'); else renderAdmin();
})();
