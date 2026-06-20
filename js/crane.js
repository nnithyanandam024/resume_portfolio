/* ============================================================
   MANEKI-NEKO (LUCKY CAT) - Three.js Scene
   Procedurally built low-poly Japanese beckoning cat.
   Hovering over the figure speeds up the waving animation.
   ============================================================ */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const container = document.getElementById('craneCanvas');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (container) {
  // ---- Design Tokens ----
  const SUMI = 0x15151A;
  const WASHI = 0xF2EDE4;
  const SHU = 0xC1432D;
  const KIN = 0xC9A66B;
  const edgeColor = KIN;

  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0.4, 6.5);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Set lower default opacity on the canvas (e.g. 0.55 opacity)
  renderer.domElement.style.opacity = '0.55';
  renderer.domElement.style.transition = 'opacity 250ms ease';

  // ---- Lighting ----
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.9);
  keyLight.position.set(3, 4, 5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(KIN, 0.6);
  rimLight.position.set(-4, -2, -3);
  scene.add(rimLight);

  // ---- Geometry Helpers ----
  function addCreaseEdges(mesh) {
    const edges = new THREE.EdgesGeometry(mesh.geometry, 18);
    const line = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity: 0.45 })
    );
    mesh.add(line);
  }

  // ---- Model Builder: Waving Maneki-Neko ----
  function createManekiNeko() {
    const group = new THREE.Group();

    const catMaterial = new THREE.MeshStandardMaterial({
      color: WASHI,
      flatShading: true,
      roughness: 0.7,
    });
    const redMaterial = new THREE.MeshStandardMaterial({
      color: SHU,
      flatShading: true,
      roughness: 0.8,
    });
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: KIN,
      flatShading: true,
      metalness: 0.8,
      roughness: 0.2,
    });
    const blackMaterial = new THREE.MeshStandardMaterial({
      color: SUMI,
      flatShading: true,
      roughness: 0.9,
    });

    // Cushion
    const cushionGeo = new THREE.CylinderGeometry(0.9, 1.0, 0.25, 6);
    const cushion = new THREE.Mesh(cushionGeo, redMaterial);
    cushion.position.y = -1.2;
    addCreaseEdges(cushion);
    group.add(cushion);

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.6, 0.75, 1.1, 8);
    const body = new THREE.Mesh(bodyGeo, catMaterial);
    body.position.y = -0.6;
    addCreaseEdges(body);
    group.add(body);

    // Head
    const headGeo = new THREE.IcosahedronGeometry(0.55, 1);
    const head = new THREE.Mesh(headGeo, catMaterial);
    head.position.y = 0.2;
    addCreaseEdges(head);
    group.add(head);

    // Ears
    const earLGeo = new THREE.ConeGeometry(0.18, 0.35, 4);
    const earL = new THREE.Mesh(earLGeo, redMaterial);
    earL.position.set(-0.35, 0.65, 0);
    earL.rotation.z = 0.45;
    earL.rotation.x = 0.15;
    addCreaseEdges(earL);
    group.add(earL);

    const earR = new THREE.Mesh(earLGeo, redMaterial);
    earR.position.set(0.35, 0.65, 0);
    earR.rotation.z = -0.45;
    earR.rotation.x = 0.15;
    addCreaseEdges(earR);
    group.add(earR);

    // Eyes
    const eyeGeo = new THREE.BoxGeometry(0.1, 0.04, 0.04);
    const eyeL = new THREE.Mesh(eyeGeo, blackMaterial);
    eyeL.position.set(-0.2, 0.22, 0.48);
    eyeL.rotation.z = 0.1;
    group.add(eyeL);

    const eyeR = new THREE.Mesh(eyeGeo, blackMaterial);
    eyeR.position.set(0.2, 0.22, 0.48);
    eyeR.rotation.z = -0.1;
    group.add(eyeR);

    // Whiskers
    const whiskerGeo = new THREE.BoxGeometry(0.2, 0.02, 0.02);
    const w1 = new THREE.Mesh(whiskerGeo, blackMaterial);
    w1.position.set(-0.4, 0.12, 0.45);
    w1.rotation.z = -0.15;
    group.add(w1);

    const w2 = new THREE.Mesh(whiskerGeo, blackMaterial);
    w2.position.set(0.4, 0.12, 0.45);
    w2.rotation.z = 0.15;
    group.add(w2);

    // Collar + Bell
    const collarGeo = new THREE.TorusGeometry(0.55, 0.06, 4, 8);
    const collar = new THREE.Mesh(collarGeo, redMaterial);
    collar.position.y = -0.15;
    collar.rotation.x = Math.PI / 2;
    group.add(collar);

    const bellGeo = new THREE.IcosahedronGeometry(0.1, 1);
    const bell = new THREE.Mesh(bellGeo, goldMaterial);
    bell.position.set(0, -0.22, 0.52);
    addCreaseEdges(bell);
    group.add(bell);

    // Left Paw with Gold Coin
    const coinGeo = new THREE.BoxGeometry(0.35, 0.55, 0.08);
    const coin = new THREE.Mesh(coinGeo, goldMaterial);
    coin.position.set(-0.42, -0.65, 0.45);
    coin.rotation.y = 0.2;
    coin.rotation.z = 0.15;
    addCreaseEdges(coin);
    group.add(coin);

    const pawLGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.5, 5);
    const pawL = new THREE.Mesh(pawLGeo, catMaterial);
    pawL.position.set(-0.4, -0.6, 0.3);
    pawL.rotation.x = 0.8;
    pawL.rotation.y = -0.3;
    addCreaseEdges(pawL);
    group.add(pawL);

    // Right Waving Arm Pivot Group (Joint at Shoulder)
    const armPivot = new THREE.Group();
    armPivot.position.set(0.45, -0.25, 0.1);

    const armGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.65, 5);
    const armMesh = new THREE.Mesh(armGeo, catMaterial);
    armMesh.position.y = 0.3;
    armMesh.rotation.z = -0.15;
    addCreaseEdges(armMesh);
    armPivot.add(armMesh);

    const pawRGeo = new THREE.IcosahedronGeometry(0.14, 1);
    const pawR = new THREE.Mesh(pawRGeo, redMaterial);
    pawR.position.set(0.02, 0.62, 0);
    addCreaseEdges(pawR);
    armPivot.add(pawR);

    group.add(armPivot);
    group.scale.setScalar(0.95);

    group.userData = {
      armPivot: armPivot,
      update: (t, isHovered) => {
        group.rotation.y = t * 0.15;
        group.position.y = Math.sin(t * 0.8) * 0.12;

        const waveSpeed = isHovered ? 13.0 : 2.5;
        const waveAmplitude = isHovered ? 0.38 : 0.08;
        const baseAngle = -0.15;

        armPivot.rotation.z = baseAngle + Math.sin(t * waveSpeed) * waveAmplitude;
        armPivot.rotation.x = Math.cos(t * waveSpeed * 0.8) * (waveAmplitude * 0.4);
      }
    };

    return group;
  }

  // ---- Initialize Neko ----
  const activeModel = createManekiNeko();
  scene.add(activeModel);

  // ---- Hover Detection ----
  let isHovered = false;
  let hoverTimeout = null;

  function onDocumentMouseMove(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      isHovered = true;
      clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        isHovered = false;
      }, 1500);
    } else {
      isHovered = false;
    }
  }
  window.addEventListener('pointermove', onDocumentMouseMove);

  // ---- Resize handling ----
  function handleResize() {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', handleResize);

  // ---- Render Loop ----
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();

    // Active model animations
    if (activeModel && activeModel.userData && activeModel.userData.update) {
      activeModel.userData.update(t, isHovered);
    }

    // Scroll Parallax and scroll opacity fade-out
    if (!prefersReducedMotion && activeModel) {
      const progress = window.__heroScrollProgress || 0;
      activeModel.position.x = progress * -1.2;
      
      // Starts at 0.55 opacity and fades to 0 as user scrolls
      renderer.domElement.style.opacity = String(Math.max(0.55 - progress * 1.4, 0));
    }

    renderer.render(scene, camera);
  }
  animate();
}
