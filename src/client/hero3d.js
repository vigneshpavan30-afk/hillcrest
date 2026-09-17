// Real-time 3D hero: the practice's tooth mark, extruded into a pearl-glass sculpture.
// Loaded on demand by main.js only when the device can handle it.

import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, ExtrudeGeometry, MeshPhysicalMaterial, Color,
  PMREMGenerator, AmbientLight, DirectionalLight, PointLight, BufferGeometry, Float32BufferAttribute, Points,
  PointsMaterial, NormalBlending, CanvasTexture, SRGBColorSpace, ACESFilmicToneMapping, Box3, Vector3, MathUtils,
} from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import logoSvg from '../assets/logo-mark.svg';

function buildSculpture() {
  const data = new SVGLoader().parse(logoSvg);
  const shapes = data.paths.flatMap((p) => p.toShapes(true));
  const geometry = new ExtrudeGeometry(shapes, {
    depth: 70, bevelEnabled: true, bevelThickness: 26, bevelSize: 14, bevelSegments: 10, curveSegments: 28,
  });
  geometry.center();
  geometry.computeVertexNormals();
  const size = new Box3().setFromBufferAttribute(geometry.attributes.position).getSize(new Vector3());

  const scale = 3.2 / Math.max(size.x, size.y);

  const material = new MeshPhysicalMaterial({
    // Deep navy pearl: reads clearly on the light page, with teal sheen and a glossy clearcoat.
    color: new Color('#0B4C6E'),
    metalness: 0.25,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    iridescence: 0.45,
    iridescenceIOR: 1.4,
    iridescenceThicknessRange: [220, 600],
    sheen: 0.8,
    sheenColor: new Color('#6FD3CF'),
    sheenRoughness: 0.35,
    envMapIntensity: 1.5,
  });
  const mesh = new Mesh(geometry, material);
  mesh.scale.set(scale, -scale, scale); // SVG y axis points down
  return { mesh, geometry, material };
}

function buildDust(count) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 2.4 + Math.random() * 2.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.8;
    positions[i * 3 + 2] = r * Math.cos(phi) * 0.6 - 0.6;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(176,138,74,1)');
  grad.addColorStop(0.35, 'rgba(176,138,74,.55)');
  grad.addColorStop(1, 'rgba(176,138,74,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const texture = new CanvasTexture(c);
  texture.colorSpace = SRGBColorSpace;

  const material = new PointsMaterial({ size: 0.06, map: texture, transparent: true, depthWrite: false, blending: NormalBlending, opacity: 0.7 });
  return { points: new Points(geometry, material), geometry, material, texture };
}

/**
 * Mounts the sculpture into `canvas`. Resolves after the first frame renders.
 * Returns a cleanup function.
 */
export async function mountHero(container, canvas) {
  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;

  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 8.6);

  scene.add(new AmbientLight('#DDEFF5', 0.6));
  const key = new DirectionalLight('#FFFFFF', 2.6);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rimTeal = new PointLight('#6FD3CF', 55, 20);
  rimTeal.position.set(-4, 1.5, -1.5);
  scene.add(rimTeal);
  const rimGold = new PointLight('#E8C98C', 45, 20);
  rimGold.position.set(4, -2.5, 1);
  scene.add(rimGold);

  const rig = new Group();
  const sculpture = buildSculpture();
  rig.add(sculpture.mesh);
  scene.add(rig);
  const dust = buildDust(isMobile ? 120 : 260);
  scene.add(dust.points);

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

  // Pointer / gyro tilt targets.
  const target = { x: 0, y: 0 };
  const onPointer = (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  const onTilt = (e) => {
    if (e.gamma == null) return;
    target.x = MathUtils.clamp(e.gamma / 30, -1, 1);
    target.y = MathUtils.clamp((e.beta - 45) / 30, -1, 1);
  };
  window.addEventListener('pointermove', onPointer, { passive: true });
  window.addEventListener('deviceorientation', onTilt, { passive: true });

  // Scroll progress through the hero (0 at top, 1 when scrolled past).
  const scrollProgress = () => {
    const r = container.closest('[data-hero]')?.getBoundingClientRect() ?? container.getBoundingClientRect();
    return MathUtils.clamp(-r.top / Math.max(r.height, 1), 0, 1);
  };

  let visible = true;
  let running = false;
  let raf = 0;
  let last = performance.now();
  let elapsed = 0;
  const current = { x: 0, y: 0 };

  const frame = (now) => {
    raf = 0;
    // rAF timestamps can precede performance.now() taken just before scheduling; never step backwards.
    const dt = MathUtils.clamp((now - last) / 1000, 0, 0.05);
    last = now;
    elapsed += dt;
    const p = scrollProgress();

    current.x += (target.x - current.x) * Math.min(dt * 3, 1);
    current.y += (target.y - current.y) * Math.min(dt * 3, 1);

    // Intro: grow in during the first 1.6s.
    const intro = 1 - Math.pow(1 - Math.min(elapsed / 1.6, 1), 4);

    rig.rotation.y = Math.sin(elapsed * 0.35) * 0.45 + current.x * 0.45 + p * Math.PI * 1.2;
    rig.rotation.x = current.y * 0.25 + Math.sin(elapsed * 0.5) * 0.06 - p * 0.35;
    rig.rotation.z = Math.sin(elapsed * 0.25) * 0.05;
    rig.position.y = Math.sin(elapsed * 0.9) * 0.08 + p * 0.6;
    rig.position.z = -p * 2.2;
    const s = (0.7 + intro * 0.3) * (1 - p * 0.15);
    rig.scale.setScalar(s);

    dust.points.rotation.y = elapsed * 0.04 + current.x * 0.1;
    dust.points.rotation.x = current.y * 0.05;
    rimTeal.position.x = -4 + Math.sin(elapsed * 0.6) * 1.2;
    rimGold.position.y = -2.5 + Math.cos(elapsed * 0.5) * 1.2;

    renderer.render(scene, camera);
    if (running) raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visible ? start() : stop();
  }, { rootMargin: '100px' });
  io.observe(container);
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    stop();
    container.classList.remove('is-3d');
  });

  // First frame, then reveal.
  frame(performance.now());
  start();
  container.classList.add('is-3d');

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    window.removeEventListener('pointermove', onPointer);
    window.removeEventListener('deviceorientation', onTilt);
    document.removeEventListener('visibilitychange', onVisibility);
    sculpture.geometry.dispose();
    sculpture.material.dispose();
    dust.geometry.dispose();
    dust.material.dispose();
    dust.texture.dispose();
    envTarget.dispose();
    pmrem.dispose();
    renderer.dispose();
  };
}
