/* =========================================================================
   Scroll-driven dissection of a three-stage lifting column.

   Geometry is authored in millimetres and scaled to scene units at the end.
   Profile sizes (90x60 / 78x48 / 66x36, 3 mm wall) follow the catalogue's
   "Rectangular Lifting Column 3-Stage 60*90mm". Section lengths, stroke and
   overlap are REPRESENTATIVE and must be replaced with drawing values before
   this goes anywhere near a customer. See README.md.

   Scroll phases
     0.00-0.22  assembled, slow orbit
     0.22-0.46  explode
     0.46-0.58  hold exploded
     0.58-0.74  re-nest, camera dollies to the stage 1 / stage 2 junction
     0.74-1.00  spindle and nut withdraw laterally, tubes fade back
   ========================================================================= */

import * as THREE from '../../vendor/three.module.js';

const canvas  = document.getElementById('column-canvas');
const track   = document.querySelector('.dissect-track');
const steps   = Array.from(document.querySelectorAll('.dissect-steps .step'));
const progEl  = document.querySelector('.dissect-progress i');
const section = document.querySelector('.dissect');

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, powerPreference:'high-performance' });
} catch (err) {
  document.documentElement.classList.add('no-webgl');
  console.warn('[dissect] WebGL unavailable, falling back to still image', err);
}

if (renderer) init();

function init(){
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace   = THREE.SRGBColorSpace;
  renderer.toneMapping        = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure= 1.18;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 200);
  scene.environment = buildEnvironment(renderer);

  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(6, 9, 8);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbfd4ea, 1.15);
  rim.position.set(-7, 3, -6);
  scene.add(rim);
  const edge = new THREE.DirectionalLight(0xffe2bd, 0.55);   // warm kicker along the silhouette
  edge.position.set(-4, -6, 7);
  scene.add(edge);
  scene.add(new THREE.AmbientLight(0xffffff, 0.22));

  /* ---------- materials ---------- */
  const M = {
    alu:    mat(0xB9C0BE, 0.95, 0.26),   // clear-anodised aluminium extrusion
    aluMid: mat(0xA7AFAD, 0.95, 0.30),
    black:  mat(0x41474A, 0.86, 0.40),   // black-anodised inner stage, lifted to read on the near-black ground
    steel:  mat(0xCBD0D1, 1.00, 0.16),   // ground spindle
    cast:   mat(0x53595B, 0.80, 0.52),   // gearbox housing
    pom:    mat(0xD9D3C4, 0.05, 0.68),   // POM glide pads
  };
  function mat(color, metalness, roughness){
    return new THREE.MeshStandardMaterial({ color, metalness, roughness, envMapIntensity:1.45, transparent:true, opacity:1 });
  }

  /* ---------- the column ---------- */
  const column = new THREE.Group();
  const parts  = [];

  function addPart(name, geo, material, restY, explode, group){
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(0, restY, 0);
    const p = { mesh, rest:new THREE.Vector3(0, restY, 0), explode, group, material };
    parts.push(p);
    column.add(mesh);
    return p;
  }

  // foot plate + drive
  addPart('foot',    plate(210, 150, 14, 7, 26), M.cast,  0,   v(0,-118,0), 'drive');
  addPart('gearbox', box(130, 58, 62),           M.cast,  14,  v(0, -58,0), 'drive');
  addPart('motor',   tubeRound(27, 96),          M.black, 26,  v(-138,-74,0),'drive');

  // three nested stages
  addPart('stage1', profile(90, 60, 3, 250), M.alu,    76,  v(0,   0,0), 'tube');
  addPart('stage2', profile(78, 48, 3, 250), M.aluMid, 236, v(0,  96,0), 'tube');
  addPart('stage3', profile(66, 36, 3, 250), M.black,  396, v(0, 192,0), 'tube');
  addPart('top',    plate(190, 130, 14, 7, 24), M.alu,  646, v(0, 288,0), 'tube');

  // drive train inside
  addPart('spindle', tubeRound(7, 508),   M.steel, 96,  v(158,  36,0), 'spindle');
  addPart('thread',  helix(10.5, 508, 34),M.steel, 96,  v(158,  36,0), 'spindle');
  addPart('nut',     box(36, 36, 24),     M.cast,  424, v(158, 126,0), 'spindle');

  // glide pads at each telescopic interface — the parts that set the wobble
  padRing( 84, 54, 300, v(-146,  44, 0));
  padRing( 72, 42, 460, v(-146, 134, 0));
  function padRing(w, d, y, explode){
    const g = box(12, 10, 26);
    [[ w/2,0],[-w/2,0],[0, d/2],[0,-d/2]].forEach(([x,z],i)=>{
      const m = new THREE.Mesh(g, M.pom);
      m.position.set(x, y, z);
      parts.push({ mesh:m, rest:new THREE.Vector3(x,y,z),
                   explode:v(explode.x + (x?Math.sign(x)*30:0), explode.y, explode.z + (z?Math.sign(z)*30:0)),
                   group:'pad', material:M.pom });
      column.add(m);
    });
  }

  // overlap bracket, shown while the camera is at the junction
  const bracketMat = new THREE.LineBasicMaterial({ color:0xD08A3C, transparent:true, opacity:0 });
  const bx = 62, y0 = 236, y1 = 326;   // stage 2 foot to stage 1 head = the overlap
  const bracket = new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(bx, y0, 0), new THREE.Vector3(bx, y1, 0),
      new THREE.Vector3(bx-13, y0, 0), new THREE.Vector3(bx+13, y0, 0),
      new THREE.Vector3(bx-13, y1, 0), new THREE.Vector3(bx+13, y1, 0),
    ]), bracketMat);
  column.add(bracket);

  column.scale.setScalar(0.01);
  column.position.y = -3.3;          // 660 mm tall, centred on the origin
  scene.add(column);

  /* ---------- scroll ---------- */
  let target = 0, current = 0, running = false, activeStep = -1;

  function readScroll(){
    const rect  = track.getBoundingClientRect();
    const span  = track.offsetHeight - window.innerHeight;
    target = span > 0 ? clamp(-rect.top / span, 0, 1) : 0;
  }

  function resize(){
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function frame(){
    if (!running) return;
    current = reduced ? target : current + (target - current) * 0.10;
    apply(current);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  function apply(p){
    // Each step owns a clear span: explode fully collapses again *before* the camera
    // dollies in for the overlap, and the camera pulls back *before* the spindle leaves.
    const explodeT = kf(p, [[0,0],[0.20,0],[0.42,1],[0.50,1],[0.60,0],[1,0]]);
    const zoomT    = kf(p, [[0,0],[0.58,0],[0.70,1],[0.76,1],[0.84,0],[1,0]]);
    const spindleT = kf(p, [[0,0],[0.80,0],[0.94,1],[1,1]]);
    const azimuth  = kf(p, [[0,-0.44],[0.5,0.16],[1,0.62]]);

    for (const part of parts){
      const t = part.group === 'spindle' ? Math.max(explodeT, spindleT) : explodeT;
      part.mesh.position.set(
        part.rest.x + part.explode.x * t,
        part.rest.y + part.explode.y * t,
        part.rest.z + part.explode.z * t
      );
    }

    // during the drive-train phase the tubes step back so the spindle reads through them.
    // depthWrite has to go with the opacity or the faded tubes still occlude the spindle.
    const ghosting = spindleT > 0.02;
    M.alu.opacity = M.aluMid.opacity = 1 - 0.82 * spindleT;
    M.black.opacity = 1 - 0.74 * spindleT;
    M.pom.opacity   = 1 - 0.88 * spindleT;
    M.alu.depthWrite = M.aluMid.depthWrite = M.black.depthWrite = M.pom.depthWrite = !ghosting;
    bracketMat.opacity = zoomT;

    // the exploded model is far taller than the assembled one, so pull back with it
    const framed = lerp(12.6, 22.2, explodeT);
    const radius = lerp(framed, 8.6, zoomT);
    const height = lerp(1.8, -0.2, zoomT);
    camera.position.set(Math.sin(azimuth) * radius, height, Math.cos(azimuth) * radius);
    camera.lookAt(0, lerp(0, -0.5, zoomT), 0);

    const idx = p < 0.20 ? 0 : p < 0.50 ? 1 : p < 0.74 ? 2 : 3;
    if (idx !== activeStep){
      steps.forEach((s, i) => s.classList.toggle('on', i === idx));
      activeStep = idx;
    }
    if (progEl) progEl.style.width = (p * 100).toFixed(2) + '%';
  }

  window.addEventListener('scroll', readScroll, { passive:true });
  window.addEventListener('resize', () => { resize(); readScroll(); });

  new IntersectionObserver((entries) => {
    for (const e of entries){
      if (e.isIntersecting && !running){ running = true; resize(); readScroll(); current = target; frame(); }
      else if (!e.isIntersecting){ running = false; }
    }
  }, { rootMargin:'120px' }).observe(section);

  resize(); readScroll(); current = target; apply(current); renderer.render(scene, camera);
}

/* ---------- geometry helpers (millimetres, extruded along +Y) ---------- */

function roundedRect(w, h, r){
  const x = -w/2, y = -h/2, s = new THREE.Shape();
  r = Math.min(r, w/2, h/2);
  s.moveTo(x+r, y);
  s.lineTo(x+w-r, y); s.quadraticCurveTo(x+w, y, x+w, y+r);
  s.lineTo(x+w, y+h-r); s.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  s.lineTo(x+r, y+h); s.quadraticCurveTo(x, y+h, x, y+h-r);
  s.lineTo(x, y+r); s.quadraticCurveTo(x, y, x+r, y);
  return s;
}

/** Hollow rounded-rectangular extrusion — one telescopic stage. */
function profile(w, d, wall, len){
  const shape = roundedRect(w, d, 8);
  shape.holes.push(roundedRect(w - wall*2, d - wall*2, 6));
  return extrudeY(shape, len);
}

/** Solid plate with four bolt holes. */
function plate(w, d, h, holeR, inset){
  const shape = roundedRect(w, d, 6);
  [[1,1],[1,-1],[-1,1],[-1,-1]].forEach(([sx,sz]) => {
    const path = new THREE.Path();
    path.absarc(sx*(w/2-inset), sz*(d/2-inset), holeR, 0, Math.PI*2, true);
    shape.holes.push(path);
  });
  return extrudeY(shape, h);
}

function box(w, d, h){ return extrudeY(roundedRect(w, d, 4), h); }

function extrudeY(shape, depth){
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled:false, curveSegments:10 });
  g.rotateX(-Math.PI/2);   // +Z extrusion becomes +Y
  g.computeVertexNormals();
  return g;
}

function tubeRound(r, len){
  const g = new THREE.CylinderGeometry(r, r, len, 28, 1, false);
  g.translate(0, len/2, 0);
  return g;
}

function helix(r, len, turns){
  class H extends THREE.Curve {
    getPoint(t, o = new THREE.Vector3()){
      const a = Math.PI * 2 * turns * t;
      return o.set(Math.cos(a)*r, t*len, Math.sin(a)*r);
    }
  }
  return new THREE.TubeGeometry(new H(), Math.round(turns*14), 2.1, 6, false);
}

/* ---------- maths ---------- */
function v(x, y, z){ return new THREE.Vector3(x, y, z); }
function clamp(n, a, b){ return Math.min(b, Math.max(a, n)); }
function lerp(a, b, t){ return a + (b - a) * t; }
function ease(t){ return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; }

/** Piecewise keyframe track with cubic easing between stops. */
function kf(p, stops){
  if (p <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++){
    const [p1, v1] = stops[i], [p0, v0] = stops[i-1];
    if (p <= p1){
      const t = p1 === p0 ? 0 : (p - p0) / (p1 - p0);
      return lerp(v0, v1, ease(t));
    }
  }
  return stops[stops.length-1][1];
}

/**
 * A small emissive "studio" built as geometry and pre-filtered into an IBL probe.
 * A gradient gives fully-metallic surfaces almost nothing to reflect, so they render
 * black; a room with distinct bright panels gives them edges, falloff and a key.
 */
function buildEnvironment(renderer){
  const room = new THREE.Scene();
  const panel = (w, h, d, x, y, z, color) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial({ color }));
    m.position.set(x, y, z);
    room.add(m);
  };

  const shell = new THREE.Mesh(
    new THREE.BoxGeometry(40, 40, 40),
    new THREE.MeshBasicMaterial({ color: 0x8b9593, side: THREE.BackSide })
  );
  room.add(shell);

  panel(26, 0.4, 26,   0,  15,   0, 0xffffff);  // overhead softbox
  panel( 0.4, 15, 13,  15,   4,   3, 0xf4f7f6); // key, camera right
  panel( 0.4, 13, 11, -15,   3,  -4, 0xb9c3c1); // fill, camera left
  panel(20,  9,  0.4,   0,   3, -16, 0x6f7a78); // back wall
  panel(26, 0.4, 26,   0, -15,   0, 0x212927);  // floor

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(room, 0.03).texture;
  pmrem.dispose();
  return env;
}
