// Services scene: one 3D icon per service group, morphing as the matching card becomes active.
// Loaded on demand by main.js only on capable, wide screens with motion allowed.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Shape, Path, ExtrudeGeometry, TubeGeometry,
  CatmullRomCurve3, Vector3, MeshPhysicalMaterial, Color, PMREMGenerator, AmbientLight, DirectionalLight,
  PointLight, SRGBColorSpace, ACESFilmicToneMapping, Box3, MathUtils,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const BEVEL = { bevelEnabled: true, bevelSegments: 10, curveSegments: 36 };

// Scale a geometry so its largest dimension is `size`, centered on the origin.
function fit(geometry, size) {
  geometry.center();
  const box = new Box3().setFromBufferAttribute(geometry.attributes.position);
  const dims = box.getSize(new Vector3());
  const s = size / Math.max(dims.x, dims.y, dims.z);
  geometry.scale(s, s, s);
  geometry.computeVertexNormals();
  return geometry;
}

function shieldGeometry() {
  const s = new Shape();
  s.moveTo(0, 1.25);
  s.bezierCurveTo(0.45, 1.12, 0.8, 1.05, 1.02, 0.98);
  s.lineTo(1.02, 0.25);
  s.bezierCurveTo(0.98, -0.5, 0.5, -0.98, 0, -1.28);
  s.bezierCurveTo(-0.5, -0.98, -0.98, -0.5, -1.02, 0.25);
  s.lineTo(-1.02, 0.98);
  s.bezierCurveTo(-0.8, 1.05, -0.45, 1.12, 0, 1.25);
  // Medical cross cut through the shield.
  const w = 0.17, l = 0.52, cy = 0.05;
  const cross = new Path();
  cross.moveTo(-w, cy + l); cross.lineTo(w, cy + l); cross.lineTo(w, cy + w); cross.lineTo(l, cy + w);
  cross.lineTo(l, cy - w); cross.lineTo(w, cy - w); cross.lineTo(w, cy - l); cross.lineTo(-w, cy - l);
  cross.lineTo(-w, cy - w); cross.lineTo(-l, cy - w); cross.lineTo(-l, cy + w); cross.lineTo(-w, cy + w);
  cross.lineTo(-w, cy + l);
  s.holes.push(cross);
  return fit(new ExtrudeGeometry(s, { ...BEVEL, depth: 0.32, bevelThickness: 0.14, bevelSize: 0.08 }), 2.3);
}

function toothGeometry() {
  // Molar silhouette: three rounded cusps on top, two tapering roots below.
  const s = new Shape();
  s.moveTo(-1.0, 0.55);
  s.bezierCurveTo(-1.05, 1.15, -0.62, 1.3, -0.4, 1.05);
  s.bezierCurveTo(-0.22, 1.28, 0.22, 1.28, 0.4, 1.05);
  s.bezierCurveTo(0.62, 1.3, 1.05, 1.15, 1.0, 0.55);
  s.bezierCurveTo(0.98, 0.05, 0.86, -0.25, 0.74, -0.7);
  s.bezierCurveTo(0.64, -1.1, 0.52, -1.35, 0.36, -1.3);
  s.bezierCurveTo(0.22, -1.25, 0.2, -0.85, 0.12, -0.5);
  s.bezierCurveTo(0.06, -0.3, -0.06, -0.3, -0.12, -0.5);
  s.bezierCurveTo(-0.2, -0.85, -0.22, -1.25, -0.36, -1.3);
  s.bezierCurveTo(-0.52, -1.35, -0.64, -1.1, -0.74, -0.7);
  s.bezierCurveTo(-0.86, -0.25, -0.98, 0.05, -1.0, 0.55);
  return fit(new ExtrudeGeometry(s, { ...BEVEL, depth: 0.42, bevelThickness: 0.3, bevelSize: 0.2 }), 2.4);
}

function sparkleGeometry() {
  const star = (cx, cy, r, inner) => {
    const s = new Shape();
    s.moveTo(cx, cy + r);
    s.quadraticCurveTo(cx + inner, cy + inner, cx + r, cy);
    s.quadraticCurveTo(cx + inner, cy - inner, cx, cy - r);
    s.quadraticCurveTo(cx - inner, cy - inner, cx - r, cy);
    s.quadraticCurveTo(cx - inner, cy + inner, cx, cy + r);
    return s;
  };
  const shapes = [star(-0.15, -0.1, 1.15, 0.14), star(0.95, 0.9, 0.42, 0.06), star(0.85, -0.95, 0.28, 0.04)];
  return fit(new ExtrudeGeometry(shapes, { ...BEVEL, depth: 0.16, bevelThickness: 0.12, bevelSize: 0.06 }), 2.3);
}

function alignerGeometry() {
  // Horseshoe-shaped dental arch.
  const pts = [];
  for (let i = 0; i <= 24; i++) {
    const t = (i / 24) * Math.PI;
    pts.push(new Vector3(Math.cos(t) * 1.1, 0, -Math.sin(t) * 1.25 + 0.35));
  }
  const curve = new CatmullRomCurve3(pts);
  return fit(new TubeGeometry(curve, 160, 0.2, 32, false), 2.5);
}

const MATERIALS = () => [
  new MeshPhysicalMaterial({ color: new Color('#0B4C6E'), metalness: 0.25, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05, iridescence: 0.4, sheen: 0.8, sheenColor: new Color('#6FD3CF'), envMapIntensity: 1.5 }),
  new MeshPhysicalMaterial({ color: new Color('#F6F2EA'), metalness: 0, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.04, sheen: 1, sheenColor: new Color('#BFEDEA'), envMapIntensity: 1.2 }),
  new MeshPhysicalMaterial({ color: new Color('#D2AE6A'), metalness: 1, roughness: 0.2, clearcoat: 0.6, envMapIntensity: 1.6 }),
  new MeshPhysicalMaterial({ color: new Color('#DFF6F4'), metalness: 0, roughness: 0.06, transmission: 0.92, thickness: 0.8, ior: 1.45, clearcoat: 1, envMapIntensity: 1.4, attenuationColor: new Color('#6FD3CF'), attenuationDistance: 2.5 }),
];

export function mountServices(container, canvas) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = env.texture;

  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.15, 7.2);

  scene.add(new AmbientLight('#E6F4F7', 0.6));
  const key = new DirectionalLight('#FFFFFF', 2.4);
  key.position.set(3, 5, 6);
  scene.add(key);
  const teal = new PointLight('#6FD3CF', 45, 20);
  teal.position.set(-4, 1, 2);
  scene.add(teal);
  const gold = new PointLight('#F0D39A', 35, 20);
  gold.position.set(4, -2, 2);
  scene.add(gold);

  const geometries = [shieldGeometry(), toothGeometry(), sparkleGeometry(), alignerGeometry()];
  const materials = MATERIALS();
  const rig = new Group();
  scene.add(rig);
  const items = geometries.map((g, i) => {
    const mesh = new Mesh(g, materials[i]);
    if (i === 3) mesh.rotation.x = 1.25; // show the arch mostly from above
    const holder = new Group();
    holder.add(mesh);
    holder.visible = i === 0;
    rig.add(holder);
    return { holder, presence: i === 0 ? 1 : 0 };
  });

  let active = 0;
  let progress = 0;
  const pointer = { x: 0, y: 0, cx: 0, cy: 0 };
  const onPointer = (e) => {
    const r = container.getBoundingClientRect();
    pointer.x = MathUtils.clamp(((e.clientX - r.left) / r.width - 0.5) * 2, -1.5, 1.5);
    pointer.y = MathUtils.clamp(((e.clientY - r.top) / r.height - 0.5) * 2, -1.5, 1.5);
  };
  window.addEventListener('pointermove', onPointer, { passive: true });

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  let running = false;
  let visible = true;
  let raf = 0;
  let last = performance.now();
  let t = 0;
  const easeOutBack = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };

  const frame = (now) => {
    raf = 0;
    const dt = MathUtils.clamp((now - last) / 1000, 0, 0.05);
    last = now;
    t += dt;
    pointer.cx += (pointer.x - pointer.cx) * Math.min(dt * 3, 1);
    pointer.cy += (pointer.y - pointer.cy) * Math.min(dt * 3, 1);

    items.forEach((item, i) => {
      const target = i === active ? 1 : 0;
      item.presence += (target - item.presence) * Math.min(dt * (target ? 3.2 : 7), 1);
      const p = item.presence;
      item.holder.visible = p > 0.04;
      if (!item.holder.visible) return;
      const grow = i === active ? easeOutBack(Math.min(p, 1)) : p;
      item.holder.scale.setScalar(Math.max(grow, 0.001));
      item.holder.rotation.y = (1 - p) * Math.PI * 1.5 * (i === active ? -1 : 1) + Math.sin(t * 0.5 + i) * 0.35;
      item.holder.position.y = (1 - p) * (i === active ? -0.8 : 0.8) + Math.sin(t * 1.1) * 0.06;
    });

    rig.rotation.y = pointer.cx * 0.35 + progress * Math.PI * 0.6;
    rig.rotation.x = pointer.cy * 0.2 + Math.sin(t * 0.4) * 0.05;
    teal.position.x = -4 + Math.sin(t * 0.7) * 1.5;
    gold.position.y = -2 + Math.cos(t * 0.6) * 1.5;

    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; };
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); }, { rootMargin: '150px' });
  io.observe(container);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); });

  frame(performance.now());
  start();

  return {
    setActive(i) { active = MathUtils.clamp(i, 0, items.length - 1); },
    setProgress(p) { progress = p; },
    destroy() {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
