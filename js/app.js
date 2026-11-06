/**
 * ANANTADEEPA: The Journey of Light (अनंतदीपा)
 * Main Application Controller & Pure 3D WebGL Particle Engine
 * Architecture adapted directly from ORIGIN (origin-life.netlify.app)
 * Renders 30,000 living, glowing 3D particles sampled from the sacred master artworks.
 */

(function () {
  'use strict';

  // Application State
  const STATE = {
    currentAct: 0,
    isTransitioning: false,
    cardCollapsed: false,
    autoTour: false,
    autoTourTimer: null,
    autoTourDuration: 8500, // 8.5s per act in tour mode
    isDragging: false,
    prevMousePos: { x: 0, y: 0 },
    rotation: { x: 0.0, y: 0.0 },
    targetRotation: { x: 0.0, y: 0.0 },
    mouseScreen: new THREE.Vector2(999, 999),
    mouseWorld: new THREE.Vector3(999, 999, 999),
    wheelAccumulator: 0,
    wheelCooldown: false,
    touchStartX: 0,
    touchStartY: 0,
    uiHidden: false
  };

  // Three.js Core Objects
  let scene, camera, renderer;
  let particleMesh, particleMaterial, particleGeometry;
  let particleGroup;
  let formations = [];
  let raycaster, virtualPlane;

  // Dedicated Fireworks (Pataka / Skyburst) Particle System
  let fireworksMesh = null;
  let fireworksGeometry = null;
  let fireworksMaterial = null;
  const FIREWORKS_MAX = 5000;
  const fireworksPool = [];
  let fireworksPoolIdx = 0;
  const activeRockets = [];

  // DOM Elements Cache
  const DOM = {
    canvas: document.getElementById('webgl-canvas'),
    uiLayer: document.getElementById('ui-layer'),
    ambientGlow: document.getElementById('ambient-glow'),
    tithiBadge: document.getElementById('tithi-badge'),
    tithiLabel: document.getElementById('tithi-label'),
    btnAudio: document.getElementById('btn-audio'),
    audioBars: document.getElementById('audio-icon-bars'),
    audioText: document.getElementById('audio-btn-text'),
    btnTour: document.getElementById('btn-tour'),
    btnFireworks: document.getElementById('btn-fireworks'),
    btnInfo: document.getElementById('btn-info'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    infoModal: document.getElementById('info-modal'),
    storyContainer: document.getElementById('story-container'),
    storyCard: document.getElementById('story-card'),
    btnCollapse: document.getElementById('btn-collapse'),
    actBadge: document.getElementById('act-badge'),
    cardDevanagari: document.getElementById('card-devanagari'),
    cardTitle: document.getElementById('card-title'),
    cardSubtitle: document.getElementById('card-subtitle'),
    shlokaDevanagari: document.getElementById('shloka-devanagari'),
    shlokaTranslation: document.getElementById('shloka-translation'),
    narrativeBody: document.getElementById('narrative-body'),
    ritualTags: document.getElementById('ritual-tags'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    timelineTrack: document.getElementById('timeline-track'),
    trackLineFill: document.getElementById('track-line-fill'),
    milestoneNodes: document.querySelectorAll('.milestone-node')
  };

  /**
   * Calculate Camera Z distance dynamically based on screen aspect ratio
   * Ensures the widescreen master artworks (width 16 units) fit edge-to-edge
   * without being cropped on mobile portrait ratios.
   */
  function getResponsiveCameraZ(baseZ = 9.8) {
    const aspect = window.innerWidth / window.innerHeight;
    const baseAspect = 16.0 / 9.0;
    if (aspect >= baseAspect) {
      return baseZ;
    }
    const fov = (camera && camera.fov) ? camera.fov : 50;
    const halfFovRad = (fov * 0.5 * Math.PI) / 180.0;
    const targetWidth = aspect < 1.0 ? 17.2 : 16.6;
    const requiredZ = targetWidth / (2.0 * Math.tan(halfFovRad) * aspect);
    return Math.max(baseZ, requiredZ);
  }

  function getResponsiveCameraY(baseY = 0.0) {
    const aspect = window.innerWidth / window.innerHeight;
    if (aspect < 0.85) {
      return baseY + 0.65;
    }
    return baseY;
  }

  /**
   * Initialize Three.js Scene, Camera, Renderer & Particle Engine
   */
  async function init() {
    // 1. Scene & 3D Particle Group
    scene = new THREE.Scene();
    particleGroup = new THREE.Group();
    scene.add(particleGroup);

    // 2. Check URL parameter or hash for direct act navigation
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash.toLowerCase();
    let initialActIndex = 0;
    if (urlParams.has('act')) {
      initialActIndex = parseInt(urlParams.get('act'), 10) || 0;
    } else if (hash.includes('act')) {
      const match = hash.match(/\d+/);
      if (match) initialActIndex = parseInt(match[0], 10);
    }
    if (initialActIndex < 0 || initialActIndex > 6) initialActIndex = 0;
    STATE.currentAct = initialActIndex;

    // 3. Camera Setup for initial act (with responsive aspect ratio scaling)
    const initialCam = ACTS_DATA[initialActIndex].camera;
    camera = new THREE.PerspectiveCamera(
      initialCam.fov || 50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const initialZ = getResponsiveCameraZ(initialCam.position.z);
    const initialY = getResponsiveCameraY(initialCam.position.y);
    camera.position.set(initialCam.position.x, initialY, initialZ);
    camera.lookAt(initialCam.target.x, initialCam.target.y, initialCam.target.z);

    // 4. WebGL Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: DOM.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 5. Raycasting Plane for 3D Cursor Repulsion
    raycaster = new THREE.Raycaster();
    virtualPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    // 6. Initial Procedural Formations (fallback while binary data resolves)
    generateInitialFormations();

    // 7. Setup Living Particle Mesh & GLSL Shaders
    setupParticleEngine();

    // 8. Setup Dedicated Fireworks / Firecracker Particle System
    setupFireworksSystem();

    // 9. Load Exact Binary Particle Formations Sampled from the Master Artworks
    loadExactBinaryParticles();

    // 10. Update Initial UI Text & Ambient Atmosphere
    updateUIContent(initialActIndex, true);

    // 9. Bind All Interaction Events (Orbit, Scroll, Click, Touch, Keys)
    bindEvents();

    // On mobile screens, start with the card collapsed so the 3D particle art takes full center stage
    if (window.innerWidth <= 768 && urlParams.get('expand') !== '1') {
      STATE.cardCollapsed = true;
      if (DOM.storyContainer) {
        DOM.storyContainer.classList.add('collapsed');
      }
      if (DOM.btnCollapse) {
        DOM.btnCollapse.setAttribute('title', 'Expand Story Card (C)');
      }
    }

    // Tapping collapsed card on mobile expands it
    if (DOM.storyContainer) {
      DOM.storyContainer.addEventListener('click', (e) => {
        if (STATE.cardCollapsed && !e.target.closest('.nav-arrows')) {
          toggleCardCollapse();
        }
      });
    }

    // 10. Start 60-120 FPS Render Loop
    requestAnimationFrame(render);
  }

  /**
   * Initial Formations (procedural mathematical fallback)
   */
  function generateInitialFormations() {
    formations = [
      ParticleEngine.generateAct0(),
      ParticleEngine.generateAct1(),
      ParticleEngine.generateAct2(),
      ParticleEngine.generateAct3(),
      ParticleEngine.generateAct4(),
      ParticleEngine.generateAct5(),
      ParticleEngine.generateAct6()
    ];
  }

  /**
   * Configure Single THREE.BufferGeometry with 30,000 Points & GLSL Shaders
   */
  function setupParticleEngine() {
    const count = ParticleEngine.PARTICLE_COUNT;
    particleGeometry = new THREE.BufferGeometry();

    const initial = formations[STATE.currentAct] || formations[0];

    // Source Position Attribute (Float32BufferAttribute, 30,000 * 3)
    const posAttr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    if (initial && initial.pos) {
      posAttr.copyArray(initial.pos);
    }
    particleGeometry.setAttribute('position', posAttr);

    // Target Position Attribute (for morphing)
    const targetAttr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    if (initial && initial.pos) {
      targetAttr.copyArray(initial.pos);
    }
    particleGeometry.setAttribute('aTarget', targetAttr);

    // Source & Target Color Attributes (Float32BufferAttribute, 30,000 * 3)
    const colAttr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    if (initial && initial.col) {
      colAttr.copyArray(initial.col);
    }
    particleGeometry.setAttribute('aColor', colAttr);

    const targetColAttr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
    if (initial && initial.col) {
      targetColAttr.copyArray(initial.col);
    }
    particleGeometry.setAttribute('aTargetColor', targetColAttr);

    // Seed Attribute (for unique noise offsets, flickers & timing)
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      seeds[i] = Math.random();
    }
    particleGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    // Per-particle Size Scalar
    const sizeAttr = new THREE.BufferAttribute(new Float32Array(count), 1);
    if (initial && initial.size) {
      sizeAttr.copyArray(initial.size);
    } else {
      for (let i = 0; i < count; i++) sizeAttr.array[i] = 1.0;
    }
    particleGeometry.setAttribute('aSize', sizeAttr);

    // Custom Shader Material (Additive Blending, Depth Aware, ORIGIN Glow)
    particleMaterial = new THREE.ShaderMaterial({
      vertexShader: ParticleEngine.PARTICLE_VERTEX_SHADER,
      fragmentShader: ParticleEngine.PARTICLE_FRAGMENT_SHADER,
      uniforms: {
        uProgress: { value: 1.0 },
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector3(999, 999, 999) },
        uScatter: { value: 0.0 },
        uWave: { value: 0.0 },
        uActIndex: { value: 0.0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    particleMesh = new THREE.Points(particleGeometry, particleMaterial);
    particleGroup.add(particleMesh);
  }

  /**
   * Dedicated Fireworks (Diwali Skyburst Pataka) System
   * Separate particle system that never touches or scatters the sacred artwork
   */
  function setupFireworksSystem() {
    fireworksGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(FIREWORKS_MAX * 3);
    const colors = new Float32Array(FIREWORKS_MAX * 3);
    const sizes = new Float32Array(FIREWORKS_MAX);

    for (let i = 0; i < FIREWORKS_MAX; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = -9999; // start hidden off-screen
      positions[i * 3 + 2] = 0;
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.85;
      colors[i * 3 + 2] = 0.3;
      sizes[i] = 0;

      fireworksPool.push({
        x: 0, y: -9999, z: 0,
        vx: 0, vy: 0, vz: 0,
        r: 1, g: 0.85, b: 0.3,
        life: 0, decay: 0.8,
        baseSize: 3.5
      });
    }

    fireworksGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    fireworksGeometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    fireworksGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

    const fireworksVS = `
      attribute float aSize;
      attribute vec3 aColor;
      varying vec3 vColor;
      void main() {
        vColor = aColor;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        float distScale = clamp(9.8 / -mvPosition.z, 0.45, 1.35);
        gl_PointSize = clamp(aSize * (50.0 / 9.8) * distScale, 2.5, 24.0);
      }
    `;

    const fireworksFS = `
      varying vec3 vColor;
      void main() {
        float r = length(gl_PointCoord - vec2(0.5));
        if (r > 0.5) discard;
        float core = smoothstep(0.4, 0.02, r);
        float halo = pow(1.0 - r * 2.0, 2.0);
        vec3 finalCol = vColor + vec3(0.5) * core;
        gl_FragColor = vec4(finalCol * (core * 0.9 + halo * 0.6), 1.0);
      }
    `;

    fireworksMaterial = new THREE.ShaderMaterial({
      vertexShader: fireworksVS,
      fragmentShader: fireworksFS,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    fireworksMesh = new THREE.Points(fireworksGeometry, fireworksMaterial);
    fireworksMesh.renderOrder = 999;
    scene.add(fireworksMesh);
  }

  /**
   * Load Exact Binary Particles Precomputed from Reference Images
   */
  async function loadExactBinaryParticles() {
    try {
      const binaryFormations = await ParticleEngine.loadBinaryFormations();
      if (binaryFormations && binaryFormations.length === 7) {
        formations = binaryFormations;

        // Instantly update current act attributes with exact binary image coordinates
        const curForm = formations[STATE.currentAct];
        const posAttr = particleGeometry.attributes.position;
        const targetAttr = particleGeometry.attributes.aTarget;
        const colAttr = particleGeometry.attributes.aColor;
        const targetColAttr = particleGeometry.attributes.aTargetColor;
        const sizeAttr = particleGeometry.attributes.aSize;

        posAttr.array.set(curForm.pos);
        targetAttr.array.set(curForm.pos);
        colAttr.array.set(curForm.col);
        targetColAttr.array.set(curForm.col);
        sizeAttr.array.set(curForm.size);

        posAttr.needsUpdate = true;
        targetAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
        targetColAttr.needsUpdate = true;
        sizeAttr.needsUpdate = true;
      }
    } catch (e) {
      console.warn('Using procedural particle fallback:', e);
    }
  }

  /**
   * Morph to Target Act with Smooth GSAP Interpolations
   */
  function goToAct(targetIndex, direct = false) {
    if (targetIndex < 0 || targetIndex >= ACTS_DATA.length) return;
    if (targetIndex === STATE.currentAct && !direct) return;

    STATE.currentAct = targetIndex;
    STATE.isTransitioning = true;

    // Resonant Temple Bell Harmonics on act transition
    if (window.audioEngine) {
      window.audioEngine.resume();
      window.audioEngine.playTempleBell(0.85);
    }

    const nextFormation = formations[targetIndex];

    const posAttr = particleGeometry.attributes.position;
    const targetAttr = particleGeometry.attributes.aTarget;
    const colAttr = particleGeometry.attributes.aColor;
    const targetColAttr = particleGeometry.attributes.aTargetColor;
    const sizeAttr = particleGeometry.attributes.aSize;
    const count = ParticleEngine.PARTICLE_COUNT;

    // Smoothly bake in current position if mid-transition
    const curProgress = THREE.MathUtils.smoothstep(particleMaterial.uniforms.uProgress.value, 0, 1);
    const pArr = posAttr.array;
    const tArr = targetAttr.array;
    const cArr = colAttr.array;
    const tcArr = targetColAttr.array;

    for (let i = 0; i < count * 3; i++) {
      pArr[i] = pArr[i] + (tArr[i] - pArr[i]) * curProgress;
      cArr[i] = cArr[i] + (tcArr[i] - cArr[i]) * curProgress;
    }

    // Set new destination formation
    targetAttr.array.set(nextFormation.pos);
    targetColAttr.array.set(nextFormation.col);
    sizeAttr.array.set(nextFormation.size);

    posAttr.needsUpdate = true;
    targetAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    targetColAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;

    // Reset progress uniform
    particleMaterial.uniforms.uProgress.value = 0.0;

    const morphDuration = direct ? 0.8 : 2.0;

    // GSAP Morph Interpolation Tween
    gsap.to(particleMaterial.uniforms.uProgress, {
      value: 1.0,
      duration: morphDuration,
      ease: 'power2.inOut',
      onComplete: () => {
        STATE.isTransitioning = false;
      }
    });

    // Act index float interpolation
    gsap.to(particleMaterial.uniforms.uActIndex, {
      value: targetIndex,
      duration: morphDuration,
      ease: 'power2.inOut'
    });

    // Camera Tween to Majestic Chapter Viewpoint (with responsive aspect ratio scaling)
    const camPreset = ACTS_DATA[targetIndex].camera;
    const targetZ = getResponsiveCameraZ(camPreset.position.z);
    const targetY = getResponsiveCameraY(camPreset.position.y);
    gsap.to(camera.position, {
      x: camPreset.position.x,
      y: targetY,
      z: targetZ,
      duration: morphDuration + 0.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        camera.lookAt(camPreset.target.x, camPreset.target.y, camPreset.target.z);
      }
    });

    // Reset rotation smoothly
    gsap.to(STATE.targetRotation, {
      x: 0.0,
      y: 0.0,
      duration: 1.5,
      ease: 'power2.out'
    });

    // Trigger subtle wave ripple across particles
    particleMaterial.uniforms.uWave.value = 0.8;
    gsap.to(particleMaterial.uniforms.uWave, {
      value: 0.0,
      duration: morphDuration,
      ease: 'power2.out'
    });

    // Update UI Card & Timeline
    updateUIContent(targetIndex);

    // If Auto Tour is running, reset timer
    if (STATE.autoTour) {
      resetAutoTourTimer();
    }
  }

  /**
   * Toggle Story Card Collapse / Expand
   */
  function toggleCardCollapse() {
    STATE.cardCollapsed = !STATE.cardCollapsed;
    if (STATE.cardCollapsed) {
      DOM.storyContainer.classList.add('collapsed');
      if (DOM.btnCollapse) DOM.btnCollapse.setAttribute('title', 'Expand Story Card (C)');
    } else {
      DOM.storyContainer.classList.remove('collapsed');
      if (DOM.btnCollapse) DOM.btnCollapse.setAttribute('title', 'Minimize Story Card (C)');
    }
  }

  /**
   * Update DOM Text, Tithi Badge, Shlokas & Ambient Atmosphere
   */
  function updateUIContent(actIdx, immediate = false) {
    const act = ACTS_DATA[actIdx];

    // Update Tithi Indicator
    DOM.tithiLabel.textContent = `${act.tithi} · VIKRAM SAMVAT`;

    // Timeline Scrubber Updates
    DOM.milestoneNodes.forEach((node, idx) => {
      if (idx === actIdx) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    // Update Progress Fill Line
    const actRatio = actIdx / (ACTS_DATA.length - 1);
    DOM.trackLineFill.style.width = `calc((100% - 40px) * ${actRatio})`;

    // Update Background Ambient Atmosphere
    DOM.ambientGlow.style.background = `
      radial-gradient(circle at 50% 50%, ${act.colorTheme.halo}22 0%, transparent 70%),
      radial-gradient(circle at 50% 100%, ${act.colorTheme.accent}18 0%, transparent 60%)
    `;

    // DOM Story Card Transition
    if (immediate) {
      applyCardContent(act);
    } else {
      gsap.to(DOM.storyCard, {
        opacity: 0,
        y: 15,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          applyCardContent(act);
          gsap.to(DOM.storyCard, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
      });
    }
  }

  function applyCardContent(act) {
    DOM.actBadge.textContent = `${act.dayLabel}`;
    DOM.cardDevanagari.textContent = act.sanskritTitle || act.title;
    DOM.cardTitle.textContent = act.title;
    DOM.cardSubtitle.textContent = act.subtitle;
    DOM.shlokaDevanagari.textContent = act.shloka;
    DOM.shlokaTranslation.textContent = `"${act.translation}"`;
    DOM.narrativeBody.textContent = act.description;

    // Render Ritual Tags
    DOM.ritualTags.innerHTML = '';
    act.rituals.forEach(ritual => {
      const tag = document.createElement('span');
      tag.className = 'ritual-tag';
      tag.textContent = `#${ritual.replace(/\s+/g, '')}`;
      DOM.ritualTags.appendChild(tag);
    });
  }

  /**
   * Launch Celebratory Diwali Firecracker Rockets from bottom of the screen!
   * Rockets ascend with trails of golden fire, explode all over the sky,
   * and trigger the festive "Happy Diwali" greeting with fade in / out animation!
   */
  function launchFirecrackerBurst() {
    if (window.audioEngine) {
      window.audioEngine.resume();
      if (typeof window.audioEngine.playRocketLaunchSound === 'function') {
        window.audioEngine.playRocketLaunchSound();
      }
    }

    // Button visual feedback
    if (DOM.btnFireworks) {
      DOM.btnFireworks.classList.add('btn-bursting');
      setTimeout(() => DOM.btnFireworks.classList.remove('btn-bursting'), 600);
    }

    // Shell color palettes
    const shellPalettes = [
      // Golden Anar (Incandescent gold, warm saffron, white)
      [[1.0, 0.95, 0.45], [1.0, 0.70, 0.15], [1.0, 1.0, 0.95]],
      // Auspicious Vermilion & Marigold (Ruby, fiery orange, gold)
      [[1.0, 0.20, 0.22], [1.0, 0.60, 0.10], [1.0, 0.90, 0.35]],
      // Peacock Radiance (Cyan, emerald green, pearl white)
      [[0.15, 0.95, 0.90], [0.25, 0.95, 0.35], [0.95, 0.98, 1.0]],
      // Royal Deepavali (Celestial magenta, gold, violet)
      [[0.98, 0.22, 0.80], [1.0, 0.85, 0.25], [0.65, 0.35, 1.0]]
    ];

    // Launch 3 to 4 rockets starting from down below the screen
    const rocketCount = 3 + Math.floor(Math.random() * 2);
    const startY = -5.8;

    for (let r = 0; r < rocketCount; r++) {
      const fraction = (r + 0.5) / rocketCount;
      const startX = (fraction - 0.5) * 8.0 + (Math.random() - 0.5) * 1.5;
      const targetY = 1.0 + Math.random() * 2.4;
      const targetX = startX + (Math.random() - 0.5) * 2.5;
      const targetZ = (Math.random() - 0.5) * 2.0;

      const palette = shellPalettes[r % shellPalettes.length];

      activeRockets.push({
        x: startX,
        y: startY - (Math.random() * 0.8), // slight stagger in launch timing
        z: targetZ,
        targetX: targetX,
        targetY: targetY,
        speedY: 13.5 + Math.random() * 3.0,
        speedX: (targetX - startX) * 2.2,
        palette: palette,
        exploded: false
      });
    }
  }

  /**
   * Detonate Rocket in 360-degree Skyburst All Over the Screen
   */
  function detonateRocket(originX, originY, originZ, palette) {
    if (window.audioEngine) {
      if (typeof window.audioEngine.playFirecrackerExplosion === 'function') {
        window.audioEngine.playFirecrackerExplosion();
      } else {
        window.audioEngine.playSparklerCrackle(38);
      }
    }

    // Atmospheric ambient ripple on the scene
    if (particleMaterial) {
      particleMaterial.uniforms.uWave.value = 0.7;
      gsap.to(particleMaterial.uniforms.uWave, {
        value: 0.0,
        duration: 1.2,
        ease: 'power2.out'
      });
    }

    // Trigger the "Happy Diwali" celebration banner!
    triggerHappyDiwaliGreeting();

    // 420 multi-colored explosion sparks fanning out all over the screen
    const sparksCount = 420;
    for (let i = 0; i < sparksCount; i++) {
      const p = fireworksPool[fireworksPoolIdx];
      fireworksPoolIdx = (fireworksPoolIdx + 1) % FIREWORKS_MAX;

      p.x = originX;
      p.y = originY;
      p.z = originZ;

      // Spherical 3D explosion distribution covering wide radius
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 3.2 + Math.pow(Math.random(), 0.5) * 6.5;

      p.vx = speed * Math.sin(phi) * Math.cos(theta);
      p.vy = speed * Math.cos(phi) + 1.2;
      p.vz = speed * Math.sin(phi) * Math.sin(theta);

      const col = palette[Math.floor(Math.random() * palette.length)];
      p.r = col[0];
      p.g = col[1];
      p.b = col[2];

      p.life = 1.0;
      p.decay = 0.36 + Math.random() * 0.26;
      p.baseSize = 4.8 + Math.random() * 3.2;
    }
  }

  let greetingTimer = null;
  /**
   * Display "Happy Diwali" Festive Greeting with Fade In and Fade Out Animation
   */
  function triggerHappyDiwaliGreeting() {
    const el = document.getElementById('festive-greeting');
    if (!el) return;

    el.classList.add('visible');

    if (greetingTimer) {
      clearTimeout(greetingTimer);
    }

    // Hold for 3 seconds, then smoothly fade out
    greetingTimer = setTimeout(() => {
      el.classList.remove('visible');
      greetingTimer = null;
    }, 3200);
  }

  /**
   * Auto Tour Mode Controller
   */
  function toggleAutoTour() {
    STATE.autoTour = !STATE.autoTour;
    if (STATE.autoTour) {
      DOM.btnTour.classList.add('tour-active');
      DOM.btnTour.querySelector('span:first-of-type').textContent = 'Pause';
      if (window.audioEngine) {
        window.audioEngine.resume();
      }
      resetAutoTourTimer();
    } else {
      DOM.btnTour.classList.remove('tour-active');
      DOM.btnTour.querySelector('span:first-of-type').textContent = 'Tour';
      if (STATE.autoTourTimer) {
        clearTimeout(STATE.autoTourTimer);
        STATE.autoTourTimer = null;
      }
    }
  }

  function resetAutoTourTimer() {
    if (STATE.autoTourTimer) clearTimeout(STATE.autoTourTimer);
    STATE.autoTourTimer = setTimeout(() => {
      const nextAct = (STATE.currentAct + 1) % ACTS_DATA.length;
      goToAct(nextAct);
    }, STATE.autoTourDuration);
  }

  /**
   * Unproject 2D screen mouse to 3D world space
   */
  function updateMouse3D(event) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    STATE.mouseScreen.set(x, y);

    raycaster.setFromCamera(STATE.mouseScreen, camera);
    const intersect = new THREE.Vector3();
    raycaster.ray.intersectPlane(virtualPlane, intersect);

    if (intersect && particleMaterial) {
      STATE.mouseWorld.copy(intersect);
      particleMaterial.uniforms.uMouse.value.copy(intersect);
    }
  }

  /**
   * Event Listeners Binding
   */
  function bindEvents() {
    // Window Resize
    window.addEventListener('resize', onWindowResize, false);

    // Mouse Move & 3D Repulsion
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Drag Orbit Controls
    DOM.canvas.addEventListener('mousedown', onMouseDown, false);
    window.addEventListener('mouseup', onMouseUp, false);

    // Dedicated Firecracker Burst Button (Canvas click no longer scatters the artwork)
    if (DOM.btnFireworks) {
      DOM.btnFireworks.addEventListener('click', () => {
        launchFirecrackerBurst();
      });
    }

    // Touch Support for Mobile
    DOM.canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    DOM.canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    DOM.canvas.addEventListener('touchend', onTouchEnd, false);

    // Wheel Scrollytelling
    window.addEventListener('wheel', onWheel, { passive: false });

    // Keyboard Shortcuts
    window.addEventListener('keydown', onKeyDown, false);

    // Card Collapse / Expand
    if (DOM.btnCollapse) {
      DOM.btnCollapse.addEventListener('click', toggleCardCollapse);
    }

    // UI Buttons: Prev / Next
    DOM.btnPrev.addEventListener('click', () => {
      const target = (STATE.currentAct - 1 + ACTS_DATA.length) % ACTS_DATA.length;
      goToAct(target);
    });

    DOM.btnNext.addEventListener('click', () => {
      const target = (STATE.currentAct + 1) % ACTS_DATA.length;
      goToAct(target);
    });

    // Timeline Milestones
    DOM.milestoneNodes.forEach(node => {
      node.addEventListener('click', () => {
        const actIndex = parseInt(node.getAttribute('data-act'), 10);
        goToAct(actIndex);
      });
    });

    // Audio Toggle Button
    DOM.btnAudio.addEventListener('click', () => {
      if (window.audioEngine) {
        const isMuted = window.audioEngine.toggleMute();
        if (isMuted) {
          DOM.audioBars.classList.remove('playing');
          DOM.audioText.textContent = 'Muted';
        } else {
          DOM.audioBars.classList.add('playing');
          DOM.audioText.textContent = 'Audio';
        }
      }
    });

    // Auto Tour Button
    DOM.btnTour.addEventListener('click', toggleAutoTour);

    // Info Modal
    DOM.btnInfo.addEventListener('click', () => {
      DOM.infoModal.classList.add('active');
      DOM.infoModal.setAttribute('aria-hidden', 'false');
    });

    DOM.btnCloseModal.addEventListener('click', () => {
      DOM.infoModal.classList.remove('active');
      DOM.infoModal.setAttribute('aria-hidden', 'true');
    });

    DOM.infoModal.addEventListener('click', (e) => {
      if (e.target === DOM.infoModal) {
        DOM.infoModal.classList.remove('active');
        DOM.infoModal.setAttribute('aria-hidden', 'true');
      }
    });

    // Global First Interaction to start audio safely
    const startAudioOnce = () => {
      if (window.audioEngine) {
        window.audioEngine.resume();
      }
      window.removeEventListener('click', startAudioOnce);
      window.removeEventListener('keydown', startAudioOnce);
      window.removeEventListener('wheel', startAudioOnce);
    };
    window.addEventListener('click', startAudioOnce);
    window.addEventListener('keydown', startAudioOnce);
    window.addEventListener('wheel', startAudioOnce);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const curCam = ACTS_DATA[STATE.currentAct].camera;
    const targetZ = getResponsiveCameraZ(curCam.position.z);
    const targetY = getResponsiveCameraY(curCam.position.y);
    camera.position.z = targetZ;
    camera.position.y = targetY;
    camera.lookAt(curCam.target.x, curCam.target.y, curCam.target.z);

    if (particleMaterial) {
      particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    }
  }

  function onMouseMove(event) {
    updateMouse3D(event);

    if (STATE.isDragging) {
      const deltaX = event.clientX - STATE.prevMousePos.x;
      const deltaY = event.clientY - STATE.prevMousePos.y;

      STATE.targetRotation.y += deltaX * 0.0035;
      STATE.targetRotation.x += deltaY * 0.0035;

      // Clamp vertical and horizontal tilt
      STATE.targetRotation.x = Math.max(-0.45, Math.min(0.45, STATE.targetRotation.x));
      STATE.targetRotation.y = Math.max(-0.65, Math.min(0.65, STATE.targetRotation.y));

      STATE.prevMousePos = { x: event.clientX, y: event.clientY };
    }
  }

  function onMouseDown(event) {
    STATE.isDragging = true;
    STATE.prevMousePos = { x: event.clientX, y: event.clientY };
  }

  function onMouseUp() {
    STATE.isDragging = false;
  }

  function onTouchStart(event) {
    if (event.touches.length === 1) {
      STATE.touchStartX = event.touches[0].clientX;
      STATE.touchStartY = event.touches[0].clientY;
      STATE.prevMousePos = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      STATE.isDragging = true;
    }
  }

  function onTouchMove(event) {
    if (event.touches.length === 1 && STATE.isDragging) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - STATE.prevMousePos.x;
      const deltaY = touch.clientY - STATE.prevMousePos.y;

      STATE.targetRotation.y += deltaX * 0.0035;
      STATE.targetRotation.x += deltaY * 0.0035;
      STATE.targetRotation.x = Math.max(-0.45, Math.min(0.45, STATE.targetRotation.x));
      STATE.targetRotation.y = Math.max(-0.65, Math.min(0.65, STATE.targetRotation.y));

      STATE.prevMousePos = { x: touch.clientX, y: touch.clientY };

      updateMouse3D(touch);
    }
  }

  function onTouchEnd(event) {
    STATE.isDragging = false;
    if (event.changedTouches.length === 1) {
      const deltaX = event.changedTouches[0].clientX - STATE.touchStartX;
      const deltaY = event.changedTouches[0].clientY - STATE.touchStartY;

      // Horizontal swipe (left/right) or vertical swipe (up/down) to travel acts
      if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
        if (deltaX < 0) {
          const nextAct = (STATE.currentAct + 1) % ACTS_DATA.length;
          goToAct(nextAct);
        } else {
          const prevAct = (STATE.currentAct - 1 + ACTS_DATA.length) % ACTS_DATA.length;
          goToAct(prevAct);
        }
      } else if (Math.abs(deltaY) > 50 && Math.abs(deltaY) > Math.abs(deltaX) * 1.1) {
        if (deltaY < 0) {
          const nextAct = (STATE.currentAct + 1) % ACTS_DATA.length;
          goToAct(nextAct);
        } else {
          const prevAct = (STATE.currentAct - 1 + ACTS_DATA.length) % ACTS_DATA.length;
          goToAct(prevAct);
        }
      }
    }
  }

  function onWheel(event) {
    if (DOM.infoModal.classList.contains('active')) return;
    if (STATE.wheelCooldown) return;

    STATE.wheelAccumulator += event.deltaY;

    if (Math.abs(STATE.wheelAccumulator) > 40) {
      STATE.wheelCooldown = true;
      if (STATE.wheelAccumulator > 0) {
        const nextAct = (STATE.currentAct + 1) % ACTS_DATA.length;
        goToAct(nextAct);
      } else {
        const prevAct = (STATE.currentAct - 1 + ACTS_DATA.length) % ACTS_DATA.length;
        goToAct(prevAct);
      }
      STATE.wheelAccumulator = 0;
      setTimeout(() => {
        STATE.wheelCooldown = false;
      }, 700);
    }
  }

  function onKeyDown(event) {
    if (event.code === 'ArrowRight' || event.code === 'ArrowDown') {
      const nextAct = (STATE.currentAct + 1) % ACTS_DATA.length;
      goToAct(nextAct);
    } else if (event.code === 'ArrowLeft' || event.code === 'ArrowUp') {
      const prevAct = (STATE.currentAct - 1 + ACTS_DATA.length) % ACTS_DATA.length;
      goToAct(prevAct);
    } else if (event.code === 'Space') {
      event.preventDefault();
      toggleAutoTour();
    } else if (event.code === 'KeyC') {
      toggleCardCollapse();
    } else if (event.code === 'KeyM') {
      DOM.btnAudio.click();
    } else if (event.code === 'KeyF') {
      launchFirecrackerBurst();
    } else if (event.code === 'KeyH') {
      STATE.uiHidden = !STATE.uiHidden;
      if (STATE.uiHidden) {
        DOM.uiLayer.classList.add('ui-hidden');
      } else {
        DOM.uiLayer.classList.remove('ui-hidden');
      }
    } else if (event.code === 'Escape') {
      if (DOM.infoModal.classList.contains('active')) {
        DOM.infoModal.classList.remove('active');
        DOM.infoModal.setAttribute('aria-hidden', 'true');
      }
    } else if (event.key === '?' || event.code === 'Slash') {
      DOM.btnInfo.click();
    }
  }

  /**
   * Main 60-120 FPS Animation Loop
   */
  const clock = new THREE.Clock();

  function render() {
    requestAnimationFrame(render);

    const elapsed = clock.getElapsedTime();

    // 1. Update Shader Uniforms
    if (particleMaterial) {
      particleMaterial.uniforms.uTime.value = elapsed;
    }

    // 2. Smooth Orbit Rotation with Inertia
    STATE.rotation.x += (STATE.targetRotation.x - STATE.rotation.x) * 0.08;
    STATE.rotation.y += (STATE.targetRotation.y - STATE.rotation.y) * 0.08;

    // Gentle idle floating oscillation
    const idleY = Math.sin(elapsed * 0.35) * 0.025;
    const idleX = Math.cos(elapsed * 0.25) * 0.018;

    particleGroup.rotation.x = STATE.rotation.x + idleX;
    particleGroup.rotation.y = STATE.rotation.y + idleY;

    // 3. Update Independent Celebratory Diwali Fireworks Particles
    if (fireworksMesh && fireworksGeometry) {
      const posArr = fireworksGeometry.attributes.position.array;
      const colArr = fireworksGeometry.attributes.aColor.array;
      const sizeArr = fireworksGeometry.attributes.aSize.array;
      let hasActiveSparks = false;
      const dt = 0.016;

      // Update Active Rockets Ascending from Bottom of Screen
      for (let r = activeRockets.length - 1; r >= 0; r--) {
        const rocket = activeRockets[r];
        if (!rocket.exploded) {
          hasActiveSparks = true;
          rocket.y += rocket.speedY * dt;
          rocket.x += rocket.speedX * dt * 0.5;

          // Emit trailing incandescent embers behind climbing rocket
          for (let t = 0; t < 3; t++) {
            const p = fireworksPool[fireworksPoolIdx];
            fireworksPoolIdx = (fireworksPoolIdx + 1) % FIREWORKS_MAX;

            p.x = rocket.x + (Math.random() - 0.5) * 0.16;
            p.y = rocket.y - 0.2 - Math.random() * 0.35;
            p.z = rocket.z + (Math.random() - 0.5) * 0.16;

            p.vx = (Math.random() - 0.5) * 0.6;
            p.vy = -1.6 - Math.random() * 2.2;
            p.vz = (Math.random() - 0.5) * 0.6;

            p.r = 1.0;
            p.g = 0.70 + Math.random() * 0.30;
            p.b = 0.15;

            p.life = 0.38 + Math.random() * 0.2;
            p.decay = 1.6;
            p.baseSize = 4.2 + Math.random() * 2.0;
          }

          // Blazing rocket head spark leading the way up
          const pHead = fireworksPool[fireworksPoolIdx];
          fireworksPoolIdx = (fireworksPoolIdx + 1) % FIREWORKS_MAX;
          pHead.x = rocket.x;
          pHead.y = rocket.y;
          pHead.z = rocket.z;
          pHead.vx = 0;
          pHead.vy = 0;
          pHead.vz = 0;
          pHead.r = 1.0;
          pHead.g = 1.0;
          pHead.b = 0.95;
          pHead.life = 0.12;
          pHead.decay = 0.6;
          pHead.baseSize = 7.5;

          // Check if rocket reached its explosion altitude!
          if (rocket.y >= rocket.targetY) {
            rocket.exploded = true;
            detonateRocket(rocket.x, rocket.y, rocket.z, rocket.palette);
            activeRockets.splice(r, 1);
          }
        }
      }

      for (let i = 0; i < FIREWORKS_MAX; i++) {
        const p = fireworksPool[i];
        if (p.life > 0.0) {
          hasActiveSparks = true;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;

          // Gravity pulling embers down
          p.vy -= 4.2 * dt;

          // Aerodynamic drag
          p.vx *= 0.965;
          p.vy *= 0.965;
          p.vz *= 0.965;

          p.life -= p.decay * dt;

          posArr[i * 3] = p.x;
          posArr[i * 3 + 1] = p.y;
          posArr[i * 3 + 2] = p.z;

          colArr[i * 3] = p.r;
          colArr[i * 3 + 1] = p.g;
          colArr[i * 3 + 2] = p.b;

          sizeArr[i] = Math.max(0.0, p.baseSize * Math.pow(Math.max(0.0, p.life), 0.6));
        } else {
          posArr[i * 3 + 1] = -9999;
          sizeArr[i] = 0.0;
        }
      }

      if (hasActiveSparks) {
        fireworksGeometry.attributes.position.needsUpdate = true;
        fireworksGeometry.attributes.aColor.needsUpdate = true;
        fireworksGeometry.attributes.aSize.needsUpdate = true;
      }
    }

    // 4. Audio Activity Hook for UI Visualizer
    if (window.audioEngine && !window.audioEngine.isMuted) {
      const activity = window.audioEngine.getAudioActivity();
      const bars = DOM.audioBars.querySelectorAll('.audio-bar');
      if (bars.length >= 3) {
        bars[0].style.height = `${4 + activity * 12}px`;
        bars[1].style.height = `${4 + activity * 16}px`;
        bars[2].style.height = `${4 + activity * 10}px`;
      }
    }

    // 4. Render Scene
    renderer.render(scene, camera);
  }

  // Kickstart on DOM Content Loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
