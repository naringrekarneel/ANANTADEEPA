/**
 * ANANTADEEPA: Procedural Particle Engine & GLSL Shaders
 * Constant 25,000 particles across 7 sacred Diwali acts.
 * Single draw-call THREE.BufferGeometry + THREE.Points.
 */

const PARTICLE_COUNT = 180000;

// Standard Gaussian random generator (Box-Muller)
function randomGaussian(mean = 0, stdev = 1) {
  let u = 1 - Math.random();
  let v = Math.random();
  let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * stdev;
}

// Hex color to RGB float [0.0 - 1.0]
function hexToRgb(hex) {
  const c = new THREE.Color(hex);
  return [c.r, c.g, c.b];
}

/**
 * -------------------------------------------------------------
 * PROCEDURAL 3D FORMATION GENERATORS (25,000 points each)
 * -------------------------------------------------------------
 */

// ACT 0 · The Primordial Darkness & Dawn of Light (People Celebrating Diwali in Ayodhya)
function generateAct0() {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const col = new Float32Array(PARTICLE_COUNT * 3);
  const size = new Float32Array(PARTICLE_COUNT);

  let pIdx = 0;

  function addP(x, y, z, r, g, b, sz) {
    if (pIdx >= PARTICLE_COUNT) return;
    const i = pIdx * 3;
    pos[i] = x; pos[i + 1] = y; pos[i + 2] = z;
    col[i] = r; col[i + 1] = g; col[i + 2] = b;
    size[pIdx] = sz;
    pIdx++;
  }

  // 1. Ayodhya Torana Gateway (Temple Archway Architecture - 6,500 particles)
  for (let i = 0; i < 6500; i++) {
    const p = Math.random();
    if (p < 0.35) {
      // Left Pillar (x = -4) & Right Pillar (x = +4)
      const isR = Math.random() > 0.5;
      const bx = isR ? 4.0 : -4.0;
      const y = -4.5 + Math.random() * 6.5;
      const isCap = y > 1.6 || y < -3.8;
      const rad = (isCap ? 0.6 : 0.35) + (Math.random() - 0.5) * 0.08;
      const ang = Math.random() * Math.PI * 2;
      addP(bx + Math.cos(ang) * rad, y, Math.sin(ang) * rad, 0.95, 0.75, 0.25, 1.1);
    } else if (p < 0.72) {
      // Grand Inverted Parabolic Torana Arch: y = 2 + 3 * (1 - (x/4)^2)
      const x = (Math.random() * 2 - 1) * 4.0;
      const ay = 2.0 + 3.0 * (1.0 - Math.pow(x / 4.0, 2)) + (Math.random() - 0.5) * 0.35;
      const az = (Math.random() - 0.5) * 0.35;
      addP(x, ay, az, 1.0, 0.85, 0.3, 1.3);
    } else if (p < 0.88) {
      // Festive Hanging Marigold Garland Swag
      const x = (Math.random() * 2 - 1) * 3.8;
      const sy = 1.4 - 0.8 * Math.cos((Math.PI * x) / 4.0) + (Math.random() - 0.5) * 0.18;
      addP(x, sy, (Math.random() - 0.5) * 0.3, 1.0, 0.55, 0.05, 1.2);
    } else {
      // Suspended Akash Kandil Lanterns & Shikhara Kalash
      if (Math.random() > 0.35) {
        const ky = 5.0 + Math.random() * 1.5;
        const kr = (1.5 - (ky - 5.0)) * 0.4;
        const ka = Math.random() * Math.PI * 2;
        addP(Math.cos(ka) * kr, ky, Math.sin(ka) * kr, 1.0, 0.95, 0.6, 1.6);
      } else {
        const lx = (Math.random() - 0.5) * 7.0;
        const ly = -0.5 - Math.random() * 2.5;
        addP(lx, ly, (Math.random() - 0.5) * 2.0, 1.0, 0.9, 0.4, 1.6);
      }
    }
  }

  // 2. Divine Return — Shri Rama & Mata Sita under the Ayodhya Gateway (3,500 particles)
  // Bhagwan Shri Rama (1,900 particles)
  for (let i = 0; i < 1900; i++) {
    const p = Math.random();
    const cx = -0.55, cy = -3.8, cz = 0.0, scale = 1.35;
    if (p < 0.18) {
      // Crown (Mukut) & Noble Head
      const hr = Math.cbrt(Math.random()) * 0.18 * scale;
      const ha = Math.random() * Math.PI * 2;
      const hphi = Math.acos(2 * Math.random() - 1);
      const hy = cy + 1.95 * scale + (p < 0.08 ? 0.35 * scale : 0);
      addP(cx + hr * Math.sin(hphi) * Math.cos(ha), hy + hr * Math.cos(hphi), cz + hr * Math.sin(hphi) * Math.sin(ha), 1.0, 0.92, 0.5, 1.2);
    } else if (p < 0.55) {
      // Royal Warrior Physique & Pitambara Dhoti
      const t = Math.random();
      const y = cy + t * 1.75 * scale;
      const rad = (t < 0.5 ? 0.22 + (0.5 - t) * 0.3 : 0.22 + (t - 0.5) * 0.22) * scale;
      const a = Math.random() * Math.PI * 2;
      addP(cx + Math.cos(a) * rad, y, cz + Math.sin(a) * rad * 0.7, 1.0, 0.78, 0.15, 1.0);
    } else if (p < 0.78) {
      // Legendary Kodanda Divine Bow resting on left shoulder
      const bt = Math.random();
      const bowY = cy + (0.6 + bt * 2.1) * scale;
      const bowArc = Math.sin(bt * Math.PI) * 0.35 * scale;
      addP(cx - 0.45 * scale - bowArc, bowY, cz + 0.1 * scale + (Math.random() - 0.5) * 0.06, 1.0, 0.88, 0.35, 1.4);
    } else {
      // Incandescent Solar Halo of Homecoming
      const r = (0.28 + Math.random() * 0.45) * scale;
      const a = Math.random() * Math.PI * 2;
      addP(cx + Math.cos(a) * r, cy + 2.0 * scale + Math.sin(a) * r, cz - 0.05, 1.0, 0.95, 0.8, 1.5);
    }
  }

  // Mata Sita (1,600 particles)
  for (let i = 0; i < 1600; i++) {
    const p = Math.random();
    const cx = 0.55, cy = -3.8, cz = 0.0, scale = 1.22;
    if (p < 0.18) {
      // Delicate Crown & Veiled Head
      const hr = Math.cbrt(Math.random()) * 0.17 * scale;
      const ha = Math.random() * Math.PI * 2;
      const hphi = Math.acos(2 * Math.random() - 1);
      addP(cx + hr * Math.sin(hphi) * Math.cos(ha), cy + 1.9 * scale + hr * Math.cos(hphi), cz + hr * Math.sin(hphi) * Math.sin(ha), 1.0, 0.92, 0.65, 1.1);
    } else if (p < 0.60) {
      // Auspicious Vermilion/Gold Saree with pleats
      const t = Math.random();
      const y = cy + t * 1.7 * scale;
      const rad = (t < 0.5 ? 0.2 + (0.5 - t) * 0.35 : 0.2 + (t - 0.5) * 0.18) * scale;
      const a = Math.random() * Math.PI * 2;
      addP(cx + Math.cos(a) * rad, y, cz + Math.sin(a) * rad * 0.7, 0.95, 0.25, 0.3, 1.0);
    } else if (p < 0.80) {
      // Flowing Pallu Veil & Abhaya Blessing Hand
      const pt = Math.random();
      const py = cy + (1.9 - pt * 1.5) * scale;
      const px = cx + (0.25 + pt * 0.3) * scale;
      const pz = cz - (0.1 + pt * 0.35) * scale;
      addP(px, py, pz, 1.0, 0.85, 0.4, 1.1);
    } else {
      // Auspicious Golden Lotus & Diya in hand
      const lr = Math.random() * 0.15 * scale;
      const la = Math.random() * Math.PI * 2;
      addP(cx - 0.25 * scale + Math.cos(la) * lr, cy + 1.35 * scale, cz + 0.3 * scale + Math.sin(la) * lr, 1.0, 0.95, 0.8, 1.6);
    }
  }

  // 3. Citizens of Ayodhya Celebrating Diwali (8,500 particles)
  // 8 distinct human silhouettes welcoming the Divine Return with lamps, sparklers & devotion
  const citizens = [
    { cx: -1.7, cy: -4.1, cz: 0.9, scale: 1.15, type: 'diya_aloft', col: [1.0, 0.55, 0.15] },
    { cx: 1.7, cy: -4.1, cz: 0.9, scale: 1.15, type: 'diya_aloft', col: [1.0, 0.65, 0.2] },
    { cx: -2.7, cy: -4.1, cz: 0.4, scale: 1.20, type: 'sparkler_high', col: [0.95, 0.2, 0.35] },
    { cx: 2.7, cy: -4.1, cz: 0.4, scale: 1.20, type: 'dancing_joy', col: [0.2, 0.75, 0.85] },
    { cx: -1.1, cy: -4.1, cz: 1.7, scale: 0.98, type: 'kneeling_diya', col: [1.0, 0.85, 0.25] },
    { cx: 1.1, cy: -4.1, cz: 1.7, scale: 0.98, type: 'kneeling_diya', col: [0.95, 0.5, 0.15] },
    { cx: -3.4, cy: -4.1, cz: -0.4, scale: 1.10, type: 'pranam', col: [0.95, 0.9, 0.8] },
    { cx: 3.4, cy: -4.1, cz: -0.4, scale: 1.10, type: 'pranam', col: [1.0, 0.7, 0.2] }
  ];

  const perCitizen = 800; // 8 * 800 = 6,400 particles
  citizens.forEach(c => {
    for (let i = 0; i < perCitizen; i++) {
      const p = Math.random();
      if (c.type === 'kneeling_diya') {
        // Kneeling citizen arranging earthen diyas on the road
        if (p < 0.2) {
          const hr = Math.cbrt(Math.random()) * 0.16 * c.scale;
          const ha = Math.random() * Math.PI * 2;
          addP(c.cx + 0.2 * c.scale + Math.cos(ha) * hr, c.cy + 1.0 * c.scale + (Math.random() - 0.5) * 0.15, c.cz + 0.25 * c.scale + Math.sin(ha) * hr, 1.0, 0.88, 0.7, 0.9);
        } else if (p < 0.6) {
          const t = Math.random();
          const y = c.cy + t * 0.9 * c.scale;
          const rad = (0.25 + (1.0 - t) * 0.25) * c.scale;
          const a = Math.random() * Math.PI * 2;
          addP(c.cx + Math.cos(a) * rad, y, c.cz + Math.sin(a) * rad * 0.8, c.col[0], c.col[1], c.col[2], 0.9);
        } else if (p < 0.8) {
          const at = Math.random();
          addP(c.cx + (0.15 + at * 0.25) * c.scale, c.cy + (0.7 - at * 0.55) * c.scale, c.cz + (0.2 + at * 0.3) * c.scale, 1.0, 0.85, 0.65, 0.85);
        } else {
          // Lit Diya being placed on the pathway
          const dr = Math.random() * 0.15 * c.scale;
          const da = Math.random() * Math.PI * 2;
          addP(c.cx + 0.45 * c.scale + Math.cos(da) * dr, c.cy + 0.15 * c.scale + Math.random() * 0.15, c.cz + 0.5 * c.scale + Math.sin(da) * dr, 1.0, 0.98, 0.85, 1.8);
        }
      } else if (c.type === 'sparkler_high' || c.type === 'dancing_joy') {
        // Joyous celebrant dancing with arms raised holding Diwali sparkler (Phuljhadi)
        if (p < 0.18) {
          const hr = Math.cbrt(Math.random()) * 0.17 * c.scale;
          const ha = Math.random() * Math.PI * 2;
          addP(c.cx + Math.cos(ha) * hr, c.cy + 1.95 * c.scale + (Math.random() - 0.5) * 0.15, c.cz + Math.sin(ha) * hr, 1.0, 0.88, 0.7, 0.95);
        } else if (p < 0.55) {
          const t = Math.random();
          const y = c.cy + t * 1.7 * c.scale;
          const rad = (t < 0.5 ? 0.2 + (0.5 - t) * 0.28 : 0.2 + (t - 0.5) * 0.2) * c.scale;
          const a = Math.random() * Math.PI * 2;
          addP(c.cx + Math.cos(a) * rad, y, c.cz + Math.sin(a) * rad * 0.7, c.col[0], c.col[1], c.col[2], 0.95);
        } else if (p < 0.75) {
          const at = Math.random();
          addP(c.cx + (0.2 + at * 0.25) * c.scale, c.cy + (1.6 + at * 0.85) * c.scale, c.cz + at * 0.15 * c.scale, 1.0, 0.85, 0.65, 0.9);
        } else {
          // Cascading golden festive sparkler shower
          const st = Math.random();
          const sTheta = Math.random() * Math.PI * 2;
          const sDist = st * 0.85 * c.scale;
          const sY = c.cy + (2.5 - Math.pow(st, 1.8) * 0.9) * c.scale;
          addP(c.cx + 0.45 * c.scale + Math.cos(sTheta) * sDist, sY, c.cz + 0.15 * c.scale + Math.sin(sTheta) * sDist, 1.0, 0.92, 0.4, 1.5);
        }
      } else {
        // Devotee holding glowing Diya aloft or in Anjali Pranam
        if (p < 0.18) {
          const hr = Math.cbrt(Math.random()) * 0.17 * c.scale;
          const ha = Math.random() * Math.PI * 2;
          addP(c.cx + Math.cos(ha) * hr, c.cy + 1.95 * c.scale + (Math.random() - 0.5) * 0.15, c.cz + Math.sin(ha) * hr, 1.0, 0.88, 0.7, 0.95);
        } else if (p < 0.55) {
          const t = Math.random();
          const y = c.cy + t * 1.7 * c.scale;
          const rad = (t < 0.5 ? 0.2 + (0.5 - t) * 0.28 : 0.2 + (t - 0.5) * 0.2) * c.scale;
          const a = Math.random() * Math.PI * 2;
          addP(c.cx + Math.cos(a) * rad, y, c.cz + Math.sin(a) * rad * 0.7, c.col[0], c.col[1], c.col[2], 0.95);
        } else if (p < 0.75) {
          const at = Math.random();
          const side = Math.random() > 0.5 ? 1 : -1;
          addP(c.cx + side * (0.2 - at * 0.1) * c.scale, c.cy + (1.6 - at * 0.15) * c.scale, c.cz + at * 0.38 * c.scale, 1.0, 0.85, 0.65, 0.9);
        } else {
          // Luminous golden Diya held in hands
          const dr = Math.random() * 0.14 * c.scale;
          const da = Math.random() * Math.PI * 2;
          addP(c.cx + Math.cos(da) * dr, c.cy + 1.5 * c.scale + Math.random() * 0.18, c.cz + 0.4 * c.scale + Math.sin(da) * dr, 1.0, 0.98, 0.85, 1.7);
        }
      }
    }
  });

  // Cheering Citizens Crowd in Midground under the archway (2,100 particles)
  for (let i = 0; i < 2100; i++) {
    const cx = (Math.random() * 2 - 1) * 3.6;
    const cz = -0.6 - Math.random() * 1.4;
    const cy = -4.1;
    const p = Math.random();
    if (p < 0.2) {
      addP(cx, cy + 2.0 + Math.random() * 0.3, cz, 1.0, 0.85, 0.65, 0.9);
    } else if (p < 0.6) {
      addP(cx + (Math.random() - 0.5) * 0.4, cy + Math.random() * 1.8, cz, 0.9, 0.55, 0.2, 0.8);
    } else {
      addP(cx + (Math.random() - 0.5) * 0.5, cy + 1.8 + Math.random() * 0.7, cz + 0.2, 1.0, 0.95, 0.5, 1.4);
    }
  }

  // 4. Radiant Deepotsav Pathway — Thousands of Lit Earthen Lamps across Ayodhya (4,500 particles)
  for (let i = 0; i < 4500; i++) {
    const dx = (Math.random() * 2 - 1) * 4.2;
    const dz = -1.2 + Math.random() * 4.6;
    const dy = -4.15 + (Math.random() - 0.5) * 0.08;
    const isFlame = Math.random() > 0.4;
    if (isFlame) {
      // Golden Diya Flame Core
      addP(dx, dy + Math.random() * 0.25, dz, 1.0, 0.92, 0.5, 1.6);
    } else {
      // Terracotta Lamp Dish
      addP(dx + (Math.random() - 0.5) * 0.15, dy, dz + (Math.random() - 0.5) * 0.15, 0.85, 0.4, 0.15, 1.0);
    }
  }

  // 5. Floating Akash Deepa Lanterns & Celebratory Starlight in Night Sky
  while (pIdx < PARTICLE_COUNT) {
    const lx = (Math.random() * 2 - 1) * 6.5;
    const ly = -2.0 + Math.random() * 8.5;
    const lz = (Math.random() * 2 - 1) * 4.0;
    addP(lx, ly, lz, 1.0, 0.9, 0.45, 1.2 + Math.random() * 0.8);
  }

  return { pos, col, size };
}

// ACT 1 · Vasu Baras / Govatsa Dwadashi (Calf Drinking Milk from Mother Cow / Kamadhenu)
function generateAct1() {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const col = new Float32Array(PARTICLE_COUNT * 3);
  const size = new Float32Array(PARTICLE_COUNT);

  let pIdx = 0;

  function addP(x, y, z, r, g, b, sz) {
    if (pIdx >= PARTICLE_COUNT) return;
    const i = pIdx * 3;
    pos[i] = x; pos[i + 1] = y; pos[i + 2] = z;
    col[i] = r; col[i + 1] = g; col[i + 2] = b;
    size[pIdx] = sz;
    pIdx++;
  }

  // 1. Mother Cow Torso (Gau Mata Body - 9,500 particles)
  for (let i = 0; i < 9500; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const rad = Math.cbrt(Math.random());

    const x = 0.2 + rad * 2.5 * Math.sin(phi) * Math.cos(theta);
    const y = -0.1 + rad * 1.4 * Math.sin(phi) * Math.sin(theta);
    const z = rad * 1.0 * Math.cos(phi);

    addP(x, y, z, 0.98, 0.96, 0.90, 0.95);
  }

  // 2. Sacred Hump, Affectionate Head & Horns (Mother Cow watching her calf - 4,500 particles)
  for (let i = 0; i < 4500; i++) {
    const p = Math.random();
    if (p < 0.28) {
      // Sacred Zebu Hump (Kakud)
      const rad = Math.cbrt(Math.random());
      const a = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      addP(-0.8 + rad * 0.7 * Math.sin(phi) * Math.cos(a), 1.35 + rad * 0.6 * Math.sin(phi) * Math.sin(a), rad * 0.5 * Math.cos(phi), 0.96, 0.90, 0.75, 1.0);
    } else if (p < 0.65) {
      // Neck and Head curved back affectionately looking down at the nursing calf
      const t = Math.random();
      const hy = 0.2 + t * 0.9;
      const hx = -1.5 + (1.0 - t) * 0.6;
      const hz = 0.2 + (1.0 - t) * 0.5;
      const rad = (0.28 + t * 0.15) * Math.random();
      const a = Math.random() * Math.PI * 2;
      addP(hx + Math.cos(a) * rad, hy, hz + Math.sin(a) * rad, 0.98, 0.95, 0.88, 1.0);
    } else {
      // Sacred Upward Curved Horns
      const hornTheta = Math.random() * (Math.PI * 0.6);
      const side = Math.random() > 0.5 ? 1 : -1;
      addP(-1.4 + Math.sin(hornTheta) * 0.35, 1.2 + (1.0 - Math.cos(hornTheta)) * 1.2, 0.3 + side * (0.35 + Math.sin(hornTheta) * 0.7), 1.0, 0.85, 0.4, 1.3);
    }
  }

  // 3. Mother Cow Sturdy Legs, Tail & Dewlap (3,000 particles)
  for (let i = 0; i < 3000; i++) {
    const p = Math.random();
    if (p < 0.75) {
      const leg = Math.floor(Math.random() * 4);
      let lx = -1.0, lz = 0.5;
      if (leg === 1) { lx = -1.0; lz = -0.5; }
      else if (leg === 2) { lx = 1.8; lz = 0.5; }
      else if (leg === 3) { lx = 1.8; lz = -0.5; }
      const ly = -0.8 - Math.random() * 2.4;
      const lr = (ly < -3.0 ? 0.25 : 0.18) + (Math.random() - 0.5) * 0.05;
      const la = Math.random() * Math.PI * 2;
      addP(lx + Math.cos(la) * lr, ly, lz + Math.sin(la) * lr, 0.95, 0.92, 0.85, 0.85);
    } else {
      const ty = -0.2 - Math.random() * 2.3;
      addP(2.5 + Math.sin(ty * 2.0) * 0.1, ty, (Math.random() - 0.5) * 0.15, 0.92, 0.88, 0.8, 0.85);
    }
  }

  // 4. Mother Cow Udder & Sacred Teats (1,200 particles)
  for (let i = 0; i < 1200; i++) {
    const p = Math.random();
    if (p < 0.6) {
      // Udder dome
      const ur = Math.cbrt(Math.random()) * 0.42;
      const ua = Math.random() * Math.PI * 2;
      const uphi = Math.acos(Math.random());
      addP(0.9 + ur * Math.sin(uphi) * Math.cos(ua), -1.1 - ur * Math.cos(uphi), 0.25 + ur * Math.sin(uphi) * Math.sin(ua), 1.0, 0.94, 0.88, 1.1);
    } else {
      // 4 teats with consecrated milk drops
      const teatIdx = Math.floor(Math.random() * 4);
      const tx = 0.75 + (teatIdx % 2) * 0.25;
      const tz = 0.15 + Math.floor(teatIdx / 2) * 0.22;
      const ty = -1.35 - Math.random() * 0.22;
      addP(tx, ty, tz, 1.0, 1.0, 0.95, 1.4);
    }
  }

  // 5. Calf Drinking Milk from Mother Cow (5,000 particles)
  for (let i = 0; i < 5000; i++) {
    const p = Math.random();
    if (p < 0.45) {
      // Calf Torso
      const rad = Math.cbrt(Math.random());
      const a = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      addP(1.8 + rad * 0.95 * Math.sin(phi) * Math.cos(a), -1.3 + rad * 0.65 * Math.sin(phi) * Math.sin(a), 0.6 + rad * 0.45 * Math.cos(phi), 0.98, 0.93, 0.82, 0.9);
    } else if (p < 0.75) {
      // Calf Neck & Head stretching to suckle at mother's udder
      const t = Math.random(); // 0 (body) to 1 (udder)
      const hx = 1.5 - t * 0.65;
      const hy = -1.2 + t * 0.15;
      const hz = 0.55 - t * 0.25;
      const hr = (0.28 - t * 0.12) * Math.random();
      const ha = Math.random() * Math.PI * 2;
      addP(hx + Math.cos(ha) * hr, hy, hz + Math.sin(ha) * hr, 0.98, 0.94, 0.85, 0.95);
    } else if (p < 0.9) {
      // Calf legs braced on ground in nursing stance
      const clx = 1.3 + Math.random() * 0.9;
      const cly = -1.6 - Math.random() * 1.6;
      const clz = 0.45 + (Math.random() - 0.5) * 0.35;
      addP(clx, cly, clz, 0.95, 0.90, 0.80, 0.85);
    } else {
      // Stream & Droplets of Pure Sacred Milk at the Calf's Muzzle
      const mx = 0.85 + (Math.random() - 0.5) * 0.15;
      const my = -1.3 + (Math.random() - 0.5) * 0.15;
      const mz = 0.32 + (Math.random() - 0.5) * 0.15;
      addP(mx, my, mz, 1.0, 1.0, 1.0, 1.7);
    }
  }

  // 6. Sacred Marigold Garland (Zendu Mala) & Kamadhenu Halo (fill to 25,000)
  while (pIdx < PARTICLE_COUNT) {
    if (Math.random() < 0.65) {
      // Marigold garland looping around mother cow's neck
      const t = Math.random();
      const a = (t - 0.5) * Math.PI * 1.3;
      addP(-1.3 + Math.cos(a) * 0.65, 0.4 - Math.sin(a) * 0.8, 0.15 + Math.sin(a) * 0.75, 1.0, Math.random() > 0.5 ? 0.75 : 0.45, 0.05, 1.3);
    } else {
      // Kamadhenu divine radiance
      const ar = 2.0 + Math.random() * 2.5;
      const at = Math.random() * Math.PI * 2;
      addP(-0.5 + Math.cos(at) * ar, 0.6 + Math.sin(at) * ar * 0.7, (Math.random() - 0.5) * 2.0, 1.0, 0.9, 0.4, 1.4);
    }
  }

  return { pos, col, size };
}

// ACT 2 · Dhanteras / Dhantrayodashi (Sacred Golden Kalash & Amrit Urn)
function generateAct2() {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const col = new Float32Array(PARTICLE_COUNT * 3);
  const size = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const idx = i * 3;
    const r = Math.random();

    if (r < 0.52) {
      // Kalash Base & Revolved Spherical Belly:
      // y in [-3, 1], r(y) = 2.8 * sqrt(1 - (y+1)^2 / 4) + 0.3 * sin(y * 4.0)
      const y = -3.0 + Math.random() * 4.0;
      const term = Math.max(0.001, 1.0 - Math.pow((y + 1.0) / 2.0, 2));
      let potR = 2.8 * Math.sqrt(term) + 0.3 * Math.sin(y * 4.0);
      potR = Math.max(0.5, potR);

      // Volume or surface shell
      const shellThickness = Math.random() > 0.3 ? 0.95 + Math.random() * 0.1 : Math.random();
      const effR = potR * shellThickness;
      const theta = Math.random() * Math.PI * 2;

      pos[idx] = Math.cos(theta) * effR;
      pos[idx + 1] = y;
      pos[idx + 2] = Math.sin(theta) * effR;

      // Pure 24K radiant gold with warm bronze reflections
      col[idx] = 1.0;
      col[idx + 1] = 0.82 + Math.random() * 0.15;
      col[idx + 2] = 0.18 + Math.random() * 0.15;
      size[i] = 1.0 + Math.random() * 1.2;
    } else if (r < 0.68) {
      // Kalash Neck & Flared Rim:
      // y in [1.0, 1.6] (neck r=1.2) to [1.6, 2.0] (flared rim r=1.8)
      const y = 1.0 + Math.random() * 1.0;
      let neckR;
      if (y <= 1.6) {
        neckR = 1.2 + (Math.random() - 0.5) * 0.1;
      } else {
        const rimT = (y - 1.6) / 0.4;
        neckR = 1.2 + rimT * 0.6 + (Math.random() - 0.5) * 0.1;
      }
      const theta = Math.random() * Math.PI * 2;

      pos[idx] = Math.cos(theta) * neckR;
      pos[idx + 1] = y;
      pos[idx + 2] = Math.sin(theta) * neckR;

      col[idx] = 1.0;
      col[idx + 1] = 0.88;
      col[idx + 2] = 0.25;
      size[i] = 1.1 + Math.random() * 1.0;
    } else if (r < 0.82) {
      // Mango Leaves (Amra Pallava): 5 radiating parabolic blades extending outward
      const leafIndex = Math.floor(Math.random() * 5);
      const leafAngle = (leafIndex * (Math.PI * 2) / 5) + (Math.random() - 0.5) * 0.2;
      const leafT = Math.random(); // 0 to 1 along length

      // Parabolic blade profile
      const leafDist = 1.2 + leafT * 1.6;
      const leafY = 1.8 + Math.sin(leafT * Math.PI * 0.8) * 1.4;
      const leafWidth = Math.sin(leafT * Math.PI) * 0.45;
      const perpAngle = leafAngle + Math.PI * 0.5;
      const wOffset = (Math.random() - 0.5) * leafWidth;

      pos[idx] = Math.cos(leafAngle) * leafDist + Math.cos(perpAngle) * wOffset;
      pos[idx + 1] = leafY;
      pos[idx + 2] = Math.sin(leafAngle) * leafDist + Math.sin(perpAngle) * wOffset;

      // Sacred Emerald Mango Leaves with gold veins
      col[idx] = 0.15 + Math.random() * 0.25;
      col[idx + 1] = 0.85 + Math.random() * 0.15;
      col[idx + 2] = 0.35 + Math.random() * 0.2;
      size[i] = 1.1 + Math.random() * 1.1;
    } else if (r < 0.94) {
      // Sriphala (Sacred Coconut): Dome at y in [2.0, 4.2] with tapering radius r(y) = 1.5 * (1 - (y-2.0)/2.2)
      const y = 2.0 + Math.random() * 2.2;
      const domeR = 1.5 * (1.0 - (y - 2.0) / 2.2) * (0.8 + Math.random() * 0.2);
      const theta = Math.random() * Math.PI * 2;

      pos[idx] = Math.cos(theta) * domeR;
      pos[idx + 1] = y;
      pos[idx + 2] = Math.sin(theta) * domeR;

      // Rich fibrous coconut brown & gold
      col[idx] = 0.85 + Math.random() * 0.15;
      col[idx + 1] = 0.6 + Math.random() * 0.2;
      col[idx + 2] = 0.25;
      size[i] = 1.0 + Math.random() * 1.0;
    } else {
      // Effervescent Amrita Nectar Droplets rising toward the heavens
      const t = Math.random();
      const dropY = 2.2 + t * 4.5;
      const spiralR = 0.4 + t * 1.8;
      const spiralTheta = t * Math.PI * 6.0 + Math.random() * 0.5;

      pos[idx] = Math.cos(spiralTheta) * spiralR;
      pos[idx + 1] = dropY;
      pos[idx + 2] = Math.sin(spiralTheta) * spiralR;

      // Iridescent celestial nectar cyan-gold
      col[idx] = 0.9;
      col[idx + 1] = 0.95;
      col[idx + 2] = 0.7;
      size[i] = 1.5 + Math.random() * 1.5;
    }
  }

  return { pos, col, size };
}

// ACT 3 · Naraka Chaturdashi (Shri Krishna Defeating Narakasura with Sudarshana Chakra)
function generateAct3() {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const col = new Float32Array(PARTICLE_COUNT * 3);
  const size = new Float32Array(PARTICLE_COUNT);

  let pIdx = 0;

  function addP(x, y, z, r, g, b, sz) {
    if (pIdx >= PARTICLE_COUNT) return;
    const i = pIdx * 3;
    pos[i] = x; pos[i + 1] = y; pos[i + 2] = z;
    col[i] = r; col[i + 1] = g; col[i + 2] = b;
    size[pIdx] = sz;
    pIdx++;
  }

  // 1. Bhagwan Shri Krishna (Warrior-Hero Stance - 8,000 particles)
  const kx = -1.8, ky = -3.8, kz = 0.2, kscale = 1.35;
  for (let i = 0; i < 8000; i++) {
    const p = Math.random();
    if (p < 0.30) {
      // Dynamic warrior stance legs (Pitambara yellow silk dhoti)
      const t = Math.random();
      const isFrontLeg = Math.random() > 0.4;
      let lx, ly, lz;
      if (isFrontLeg) {
        lx = kx + 0.2 + t * 0.7;
        ly = ky + (1.0 - t) * 1.0;
        lz = kz + 0.1 + t * 0.3;
      } else {
        lx = kx - 0.2 - t * 0.6;
        ly = ky + (1.0 - t) * 1.0;
        lz = kz - 0.2 - t * 0.2;
      }
      const rad = 0.22 * (0.8 + Math.random() * 0.2);
      const a = Math.random() * Math.PI * 2;
      addP(lx + Math.cos(a) * rad, ly, lz + Math.sin(a) * rad, 1.0, 0.82, 0.15, 1.0);
    } else if (p < 0.58) {
      // Divine Celestial Torso (Shyamal Blue & Golden Garlands)
      const t = Math.random();
      const y = ky + 1.0 + t * 1.0;
      const rad = (0.24 + (1.0 - t) * 0.15) * (0.85 + Math.random() * 0.15) * kscale;
      const a = Math.random() * Math.PI * 2;
      const isJewelry = Math.random() < 0.28;
      addP(kx + Math.cos(a) * rad, y, kz + Math.sin(a) * rad * 0.7, isJewelry ? 1.0 : 0.25, isJewelry ? 0.88 : 0.65, isJewelry ? 0.35 : 0.95, 1.05);
    } else if (p < 0.72) {
      // Divine Face & Mukut Crown with Mor Pankh (Peacock Feather)
      if (Math.random() < 0.45) {
        const hr = Math.cbrt(Math.random()) * 0.20 * kscale;
        const ha = Math.random() * Math.PI * 2;
        const hphi = Math.acos(2 * Math.random() - 1);
        addP(kx + hr * Math.sin(hphi) * Math.cos(ha), ky + 2.05 * kscale + hr * Math.cos(hphi), kz + hr * Math.sin(hphi) * Math.sin(ha), 0.35, 0.75, 1.0, 1.1);
      } else if (Math.random() < 0.75) {
        const ct = Math.random();
        const cy = ky + (2.15 + ct * 0.4) * kscale;
        const cr = 0.22 * (1.0 - ct * 0.5) * Math.random() * kscale;
        const ca = Math.random() * Math.PI * 2;
        addP(kx + Math.cos(ca) * cr, cy, kz + Math.sin(ca) * cr, 1.0, 0.88, 0.35, 1.3);
      } else {
        const pt = Math.random();
        const py = ky + (2.45 + pt * 0.55) * kscale;
        const px = kx - 0.05 + Math.sin(pt * Math.PI) * 0.25 * kscale;
        const isTurquoiseEye = pt > 0.6;
        addP(px, py, kz + 0.1, isTurquoiseEye ? 0.0 : 0.1, isTurquoiseEye ? 0.95 : 0.75, isTurquoiseEye ? 0.85 : 0.4, 1.5);
      }
    } else if (p < 0.88) {
      // Right Arm Extended Unleashing Sudarshana Chakra
      const at = Math.random();
      const ax = kx + 0.3 * kscale + at * 0.95 * kscale;
      const ay = ky + (1.7 + Math.sin(at * Math.PI * 0.5) * 0.55) * kscale;
      const az = kz + at * 0.35;
      addP(ax, ay, az, 0.3, 0.7, 1.0, 1.05);
    } else {
      // Blazing Divine Solar Halo (Prabhamandala)
      const ha = Math.random() * Math.PI * 2;
      const hr = (0.55 + Math.random() * 0.35) * kscale;
      addP(kx + Math.cos(ha) * hr, ky + 2.1 * kscale + Math.sin(ha) * hr, kz - 0.2, 1.0, 0.95, 0.7, 1.5);
    }
  }

  // 2. The Radiant Blazing Sudarshana Chakra (6,000 particles)
  const cx = 0.2, cy = -0.5, cz = 0.5;
  for (let i = 0; i < 6000; i++) {
    const p = Math.random();
    const theta = Math.random() * Math.PI * 2;
    if (p < 0.25) {
      const hr = Math.sqrt(Math.random()) * 0.55;
      addP(cx + Math.cos(theta) * hr, cy + Math.sin(theta) * hr * 0.85, cz + (Math.random() - 0.5) * 0.15, 1.0, 0.98, 0.92, 1.6);
    } else if (p < 0.60) {
      const rr = 0.6 + Math.random() * 0.6;
      addP(cx + Math.cos(theta) * rr, cy + Math.sin(theta) * rr * 0.85, cz + (Math.random() - 0.5) * 0.2, 1.0, 0.75 + Math.random() * 0.2, 0.1, 1.3);
    } else if (p < 0.85) {
      const toothIdx = Math.floor(Math.random() * 16);
      const baseTheta = (toothIdx * Math.PI * 2) / 16;
      const bt = Math.random();
      const toothAngle = baseTheta + bt * 0.3;
      const toothR = 1.2 + bt * 0.75;
      addP(cx + Math.cos(toothAngle) * toothR, cy + Math.sin(toothAngle) * toothR * 0.85, cz + (Math.random() - 0.5) * 0.25, 1.0, 0.3 + (1.0 - bt) * 0.6, 0.05, 1.4);
    } else {
      const trailT = Math.random();
      const tx = cx + (Math.random() - 0.5) * 1.8 + trailT * 0.8;
      const ty = cy + (Math.random() - 0.5) * 1.2;
      const tz = cz + (Math.random() - 0.5) * 0.4;
      addP(tx, ty, tz, 1.0, 0.6, 0.1, 1.4);
    }
  }

  // 3. Vanquished Demon King Narakasura (Reeling backward in defeat - 7,000 particles)
  const nx = 2.2, ny = -3.8, nz = 0.0, nscale = 1.55;
  for (let i = 0; i < 7000; i++) {
    const p = Math.random();
    if (p < 0.30) {
      const t = Math.random();
      const y = ny + t * 0.9 * nscale;
      const w = (0.7 - t * 0.3) * (Math.random() * 2 - 1);
      addP(nx + 0.3 + w, y, nz + (Math.random() - 0.5) * 0.6, 0.4, 0.05, 0.05, 0.95);
    } else if (p < 0.60) {
      const t = Math.random();
      const arch = Math.sin(t * Math.PI * 0.8) * 0.45;
      const y = ny + (0.9 + t * 1.1) * nscale;
      const rad = (0.35 + (1.0 - t) * 0.15) * nscale;
      const a = Math.random() * Math.PI * 2;
      addP(nx + arch + Math.cos(a) * rad, y, nz - arch * 0.5 + Math.sin(a) * rad * 0.8, 0.65, 0.1, 0.1, 1.05);
    } else if (p < 0.78) {
      if (Math.random() < 0.5) {
        const hr = Math.cbrt(Math.random()) * 0.25 * nscale;
        const ha = Math.random() * Math.PI * 2;
        const hphi = Math.acos(2 * Math.random() - 1);
        addP(nx + 0.4 + hr * Math.sin(hphi) * Math.cos(ha), ny + 2.05 * nscale + hr * Math.cos(hphi), nz - 0.2 + hr * Math.sin(hphi) * Math.sin(ha), 0.75, 0.15, 0.1, 1.1);
      } else {
        const ht = Math.random();
        const side = Math.random() > 0.5 ? 1 : -1;
        const hx = nx + 0.4 + ht * 0.5 * nscale;
        const hy = ny + (2.1 + ht * 0.65) * nscale;
        const hz = nz - 0.2 + side * (0.25 + ht * 0.45);
        addP(hx, hy, hz, 0.95, 0.2, 0.05, 1.3);
      }
    } else if (p < 0.90) {
      if (Math.random() < 0.5) {
        const at = Math.random();
        const side = Math.random() > 0.5 ? 1 : -1;
        addP(nx + 0.3 + at * 0.8 * nscale, ny + (1.6 + at * 0.5) * nscale, nz + side * 0.3, 0.5, 0.08, 0.08, 1.0);
      } else {
        const gt = Math.random();
        const gy = ny + (1.2 - gt * 1.5);
        const gx = nx - 0.4 - gt * 0.3;
        addP(gx, gy, nz + 0.4 + (Math.random() - 0.5) * 0.25, 0.85, 0.65, 0.25, 1.2);
      }
    } else {
      const sr = 1.0 + Math.random() * 1.8;
      const st = Math.random() * Math.PI * 2;
      addP(nx + Math.cos(st) * sr, ny + 1.2 + Math.sin(st) * sr, nz + (Math.random() - 0.5) * 1.5, 0.8, 0.1, 0.1, 1.3);
    }
  }

  // 4. Cosmic Clash Shockwave & Shattered Chains of Liberation (4,000 particles)
  while (pIdx < PARTICLE_COUNT) {
    const p = Math.random();
    if (p < 0.55) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const rad = Math.pow(Math.random(), 0.6) * 3.2;
      addP(cx + rad * Math.sin(phi) * Math.cos(theta), cy + rad * Math.cos(phi) * 0.8, cz + rad * Math.sin(phi) * Math.sin(theta), 1.0, 0.85, 0.3, 1.4);
    } else {
      const lx = (Math.random() * 2 - 1) * 5.5;
      const ly = -3.5 + Math.random() * 7.0;
      const lz = (Math.random() * 2 - 1) * 2.5;
      addP(lx, ly, lz, 1.0, 0.92, 0.5, 1.3);
    }
  }

  return { pos, col, size };
}

// ACT 4 · Lakshmi Pujan (Mata Mahalakshmi with Foreground Diya Overlay)
function generateAct4() {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const col = new Float32Array(PARTICLE_COUNT * 3);
  const size = new Float32Array(PARTICLE_COUNT);

  let pIdx = 0;

  function addP(x, y, z, r, g, b, sz) {
    if (pIdx >= PARTICLE_COUNT) return;
    const i = pIdx * 3;
    pos[i] = x; pos[i + 1] = y; pos[i + 2] = z;
    col[i] = r; col[i + 1] = g; col[i + 2] = b;
    size[pIdx] = sz;
    pIdx++;
  }

  // 1. Pink Lotus Throne (Padmasana Base for Mata Lakshmi - 4,000 particles)
  for (let i = 0; i < 4000; i++) {
    const theta = Math.random() * Math.PI * 2;
    const petalR = 1.2 + Math.abs(Math.sin(theta * 4.0)) * 1.5;
    const rad = Math.sqrt(Math.random()) * petalR;
    const ly = -2.2 + Math.pow(rad / 2.7, 1.5) * 0.9;
    addP(Math.cos(theta) * rad, ly, Math.sin(theta) * rad * 0.9 - 0.2, 1.0, 0.25 + Math.random() * 0.2, 0.55 + Math.random() * 0.3, 1.1);
  }

  // 2. Mata Mahalakshmi Form (Four Arms, Mukut, Saree & Golden Coins - 10,500 particles)
  for (let i = 0; i < 10500; i++) {
    const p = Math.random();
    if (p < 0.22) {
      // Seated Padmasana Lap & Crimson/Gold Saree
      const t = Math.random();
      const y = -1.4 + t * 0.9;
      const w = (1.5 - t * 0.6) * (Math.random() * 2 - 1);
      const z = (Math.random() - 0.5) * 0.7 - 0.1;
      addP(w, y, z, 0.95, 0.2 + Math.random() * 0.2, 0.18, 1.0);
    } else if (p < 0.45) {
      // Torso, Royal Zari Border & Golden Necklaces
      const t = Math.random();
      const y = -0.5 + t * 1.6;
      const rad = (0.2 + (1.0 - t) * 0.15) * (0.8 + Math.random() * 0.2);
      const a = Math.random() * Math.PI * 2;
      const isGoldJewelry = Math.random() > 0.4;
      addP(Math.cos(a) * rad, y, Math.sin(a) * rad * 0.6 - 0.1, isGoldJewelry ? 1.0 : 0.95, isGoldJewelry ? 0.85 : 0.25, isGoldJewelry ? 0.3 : 0.2, 1.0);
    } else if (p < 0.60) {
      // Divine Face & Soaring Golden Mukut (Crown)
      if (Math.random() < 0.4) {
        const hr = Math.cbrt(Math.random()) * 0.22;
        const ha = Math.random() * Math.PI * 2;
        const hphi = Math.acos(2 * Math.random() - 1);
        addP(hr * Math.sin(hphi) * Math.cos(ha), 1.4 + hr * Math.cos(hphi), hr * Math.sin(hphi) * Math.sin(ha) - 0.1, 1.0, 0.92, 0.75, 1.1);
      } else {
        const ct = Math.random();
        const cy = 1.6 + ct * 1.1;
        const cr = (0.28 * (1.0 - ct * 0.8)) * Math.random();
        const ca = Math.random() * Math.PI * 2;
        addP(Math.cos(ca) * cr, cy, Math.sin(ca) * cr - 0.1, 1.0, 0.88, 0.35, 1.4);
      }
    } else if (p < 0.85) {
      // Four Arms (Chaturbhuja): Two Lotuses, Abhaya & Varada with Golden Coins
      const armChoice = Math.floor(Math.random() * 4);
      if (armChoice === 0) {
        // Upper Right Arm & Blooming Lotus
        const at = Math.random();
        const ax = 0.3 + at * 1.0;
        const ay = 0.8 + Math.sin(at * Math.PI * 0.8) * 0.9;
        const isLotus = at > 0.75;
        addP(ax, ay, 0.15 + (Math.random() - 0.5) * 0.2, isLotus ? 1.0 : 1.0, isLotus ? 0.35 : 0.85, isLotus ? 0.65 : 0.55, isLotus ? 1.4 : 1.0);
      } else if (armChoice === 1) {
        // Upper Left Arm & Blooming Lotus
        const at = Math.random();
        const ax = -0.3 - at * 1.0;
        const ay = 0.8 + Math.sin(at * Math.PI * 0.8) * 0.9;
        const isLotus = at > 0.75;
        addP(ax, ay, 0.15 + (Math.random() - 0.5) * 0.2, isLotus ? 1.0 : 1.0, isLotus ? 0.35 : 0.85, isLotus ? 0.65 : 0.55, isLotus ? 1.4 : 1.0);
      } else if (armChoice === 2) {
        // Lower Right Hand (Abhaya Mudra Blessing)
        const ax = 0.45 + (Math.random() - 0.5) * 0.2;
        const ay = 0.3 + (Math.random() - 0.5) * 0.3;
        addP(ax, ay, 0.35, 1.0, 0.88, 0.6, 1.1);
      } else {
        // Lower Left Hand (Varada Mudra & Cascading Golden Coins)
        const ct = Math.random();
        const cx = -0.55 - ct * 0.25;
        const cy = 0.2 - ct * 1.5;
        const cz = 0.35 + (Math.random() - 0.5) * 0.2;
        addP(cx, cy, cz, 1.0, 0.88, 0.2, 1.5);
      }
    } else {
      // Golden Halo (Prabhamandala) behind head
      const ha = Math.random() * Math.PI * 2;
      const hr = 0.7 + Math.random() * 0.35;
      addP(Math.cos(ha) * hr, 1.45 + Math.sin(ha) * hr, -0.35, 1.0, 0.95, 0.7, 1.5);
    }
  }

  // 3. Foreground Overlay of Sacred Diya & Living Flame (8,500 particles)
  for (let i = 0; i < 8500; i++) {
    const p = Math.random();
    if (p < 0.40) {
      // Clay Diya Base in Foreground
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(v) * 0.5;
      const rad = Math.cbrt(0.85 + Math.random() * 0.15);

      let x = rad * 2.8 * Math.sin(phi) * Math.cos(theta);
      let z = rad * 2.5 * Math.sin(phi) * Math.sin(theta);
      let y = -1.2 - rad * 1.1 * Math.cos(phi);

      // Pinched spout forward
      if (z > 0.4 && Math.abs(x) < 1.4) {
        const pinch = z / 2.5;
        x *= (1.0 - pinch * 0.5);
        z += pinch * 0.6;
      }

      addP(x, y + 0.3, z + 1.6, 0.85 + Math.random() * 0.12, 0.4 + Math.random() * 0.15, 0.18, 1.0);
    } else if (p < 0.50) {
      // Ghee Pool inside Diya
      const poolR = Math.sqrt(Math.random()) * 2.0;
      const poolTheta = Math.random() * Math.PI * 2;
      addP(Math.cos(poolTheta) * poolR, -0.65, Math.sin(poolTheta) * poolR * 0.85 + 1.8, 1.0, 0.85, 0.2, 1.1);
    } else if (p < 0.88) {
      // Teardrop Flame (Lau) burning brightly in the foreground layer
      const fy = Math.random() * 3.8;
      const ny = fy / 3.8;
      const maxR = 1.1 * (1.0 - ny) * Math.sqrt(Math.max(0.001, ny));
      const fa = Math.random() * Math.PI * 2;
      const isWick = Math.random() < 0.25;
      const fr = isWick ? Math.random() * 0.12 : Math.sqrt(Math.random()) * maxR;

      const fx = Math.cos(fa) * fr;
      const fz = Math.sin(fa) * fr + 1.9;
      const fPosY = -0.5 + fy;

      if (isWick || (fr < 0.2 && fy < 2.0)) {
        addP(fx, fPosY, fz, 1.0, 1.0, 0.95, 1.7);
      } else if (fy < 2.4) {
        addP(fx, fPosY, fz, 1.0, 0.82, 0.15, 1.4);
      } else {
        addP(fx, fPosY, fz, 1.0, 0.45, 0.05, 1.1);
      }
    } else {
      // Ascending Sacred Embers & Light Sparkles
      const t = Math.random();
      addP((Math.random() - 0.5) * 1.5, 3.2 + t * 3.5, 1.9 + (Math.random() - 0.5) * 1.0, 1.0, 0.9, 0.45, 1.5);
    }
  }

  // 4. Floating Blessings & Radiant Warmth in Atmosphere (fill to 25,000)
  while (pIdx < PARTICLE_COUNT) {
    const theta = Math.random() * Math.PI * 2;
    const rad = 2.0 + Math.random() * 3.5;
    addP(Math.cos(theta) * rad, -1.0 + Math.random() * 4.5, (Math.random() - 0.5) * 2.5, 1.0, 0.92, 0.5, 1.3);
  }

  return { pos, col, size };
}

// ACT 5 · Bali Pratipada / Padwa (Sacred Geometric Mandala / Rangoli)
function generateAct5() {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const col = new Float32Array(PARTICLE_COUNT * 3);
  const size = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const idx = i * 3;
    const r = Math.random();

    if (r < 0.38) {
      // Polar Rose Curves on horizontal plane:
      // r(theta) = 3.5 * cos(8 * theta) + 1.5 * sin(16 * theta)
      const theta = Math.random() * Math.PI * 2;
      const roseR = Math.abs(3.5 * Math.cos(8.0 * theta) + 1.5 * Math.sin(16.0 * theta));
      const fillR = roseR * (0.85 + Math.random() * 0.15);

      pos[idx] = Math.cos(theta) * fillR;
      pos[idx + 1] = -1.0 + (Math.random() - 0.5) * 0.12;
      pos[idx + 2] = Math.sin(theta) * fillR;

      // Vivid festive gulal magenta / pink
      col[idx] = 1.0;
      col[idx + 1] = 0.15 + Math.random() * 0.25;
      col[idx + 2] = 0.55 + Math.random() * 0.35;
      size[i] = 1.1 + Math.random() * 1.1;
    } else if (r < 0.65) {
      // Concentric Petal Layers (3 staggered rings of 8, 16, 32 symmetrical nodes)
      const ringChoice = Math.random();
      let nodeCount = 8;
      let baseR = 1.6;
      if (ringChoice > 0.65) { nodeCount = 32; baseR = 4.2; }
      else if (ringChoice > 0.3) { nodeCount = 16; baseR = 2.8; }

      const petalIdx = Math.floor(Math.random() * nodeCount);
      const centerAngle = (petalIdx * Math.PI * 2) / nodeCount;
      const angleOffset = (Math.random() - 0.5) * ((Math.PI * 2) / nodeCount) * 0.85;
      const theta = centerAngle + angleOffset;
      const petalR = baseR + Math.cos(angleOffset * nodeCount * 0.5) * 0.6;

      pos[idx] = Math.cos(theta) * petalR;
      pos[idx + 1] = -1.0 + (Math.random() - 0.5) * 0.12;
      pos[idx + 2] = Math.sin(theta) * petalR;

      // Bright turmeric yellow & saffron
      col[idx] = 1.0;
      col[idx + 1] = 0.82 + Math.random() * 0.15;
      col[idx + 2] = 0.1;
      size[i] = 1.0 + Math.random() * 1.0;
    } else if (r < 0.85) {
      // Outer Protective Boundary Ring with 64 fine decorative border dots
      const theta = Math.random() * Math.PI * 2;
      const isInnerBorder = Math.random() > 0.5;
      const borderR = isInnerBorder ? 4.9 : 5.4;

      pos[idx] = Math.cos(theta) * (borderR + (Math.random() - 0.5) * 0.15);
      pos[idx + 1] = -1.0 + (Math.random() - 0.5) * 0.1;
      pos[idx + 2] = Math.sin(theta) * (borderR + (Math.random() - 0.5) * 0.15);

      // Peacock green / turquoise accents
      col[idx] = 0.1;
      col[idx + 1] = 0.85 + Math.random() * 0.15;
      col[idx + 2] = 0.75 + Math.random() * 0.2;
      size[i] = 1.1 + Math.random() * 1.2;
    } else {
      // Sacred Rice Flour White Center & Corner Auspicious Kalash Motifs
      const isCenter = Math.random() > 0.4;
      if (isCenter) {
        const cr = Math.sqrt(Math.random()) * 0.9;
        const ct = Math.random() * Math.PI * 2;
        pos[idx] = Math.cos(ct) * cr;
        pos[idx + 1] = -1.0 + (Math.random() - 0.5) * 0.08;
        pos[idx + 2] = Math.sin(ct) * cr;

        col[idx] = 0.98;
        col[idx + 1] = 0.98;
        col[idx + 2] = 1.0;
        size[i] = 1.4;
      } else {
        // Floating rangoli sparkles
        const sr = 1.0 + Math.random() * 4.5;
        const st = Math.random() * Math.PI * 2;
        pos[idx] = Math.cos(st) * sr;
        pos[idx + 1] = -0.7 + Math.random() * 1.2;
        pos[idx + 2] = Math.sin(st) * sr;

        col[idx] = 1.0;
        col[idx + 1] = 0.9;
        col[idx + 2] = 0.3;
        size[i] = 1.3;
      }
    }
  }

  return { pos, col, size };
}

// ACT 6 · Bhau Beej / Yama Dwitiya (Sister Doing Aarti Thali Circle on Brother)
function generateAct6() {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const col = new Float32Array(PARTICLE_COUNT * 3);
  const size = new Float32Array(PARTICLE_COUNT);

  let pIdx = 0;

  function addP(x, y, z, r, g, b, sz) {
    if (pIdx >= PARTICLE_COUNT) return;
    const i = pIdx * 3;
    pos[i] = x; pos[i + 1] = y; pos[i + 2] = z;
    col[i] = r; col[i + 1] = g; col[i + 2] = b;
    size[pIdx] = sz;
    pIdx++;
  }

  // 1. Seated Brother (Bhai on Sacred Aasan - 6,500 particles)
  const bx = 1.3, by = -3.8, bz = 0.0;
  for (let i = 0; i < 6500; i++) {
    const p = Math.random();
    if (p < 0.35) {
      // Seated folded legs (Sukhasana) on aasan
      const t = Math.random();
      const y = by + t * 0.9;
      const w = (1.4 - t * 0.5) * (Math.random() * 2 - 1);
      const z = (Math.random() - 0.5) * 0.8;
      addP(bx + w, y, bz + z, 0.98, 0.92, 0.8, 1.0);
    } else if (p < 0.65) {
      // Torso in Kurta & festive angavastram shawl
      const t = Math.random();
      const y = by + 0.8 + t * 1.3;
      const rad = (0.22 + (1.0 - t) * 0.15) * (0.8 + Math.random() * 0.2);
      const a = Math.random() * Math.PI * 2;
      addP(bx + Math.cos(a) * rad, y, bz + Math.sin(a) * rad * 0.7, 0.95, 0.88, 0.75, 1.0);
    } else if (p < 0.85) {
      // Head & Face looking at sister
      const hr = Math.cbrt(Math.random()) * 0.22;
      const ha = Math.random() * Math.PI * 2;
      const hphi = Math.acos(2 * Math.random() - 1);
      addP(bx + hr * Math.sin(hphi) * Math.cos(ha), by + 2.3 + hr * Math.cos(hphi), bz + hr * Math.sin(hphi) * Math.sin(ha), 1.0, 0.88, 0.72, 1.1);
    } else {
      // Red Tilak with Akshata Rice on Forehead
      const tr = Math.random() * 0.08;
      const ta = Math.random() * Math.PI * 2;
      addP(bx - 0.15 + Math.cos(ta) * tr, by + 2.45 + (Math.random() - 0.5) * 0.08, bz + 0.18 + Math.sin(ta) * tr, 1.0, 0.1, 0.15, 1.6);
    }
  }

  // 2. Loving Sister (Bahan) Performing Aarti - (7,500 particles)
  const sx = -1.4, sy = -3.8, sz = 0.2;
  for (let i = 0; i < 7500; i++) {
    const p = Math.random();
    if (p < 0.45) {
      // Flowing Festive Saree / Chaniya Choli (Magenta / Rose & Gold)
      const t = Math.random();
      const y = sy + t * 1.8;
      const rad = (t < 0.5 ? 0.28 + (0.5 - t) * 0.4 : 0.28 + (t - 0.5) * 0.18) * (0.85 + Math.random() * 0.15);
      const a = Math.random() * Math.PI * 2;
      const isGoldBorder = Math.random() < 0.25 || y < sy + 0.3;
      addP(sx + Math.cos(a) * rad, y, sz + Math.sin(a) * rad * 0.7, isGoldBorder ? 1.0 : 1.0, isGoldBorder ? 0.85 : 0.18, isGoldBorder ? 0.25 : 0.45, 1.0);
    } else if (p < 0.65) {
      // Head, Hair Braid & Veil
      const hr = Math.cbrt(Math.random()) * 0.20;
      const ha = Math.random() * Math.PI * 2;
      const hphi = Math.acos(2 * Math.random() - 1);
      addP(sx + hr * Math.sin(hphi) * Math.cos(ha), sy + 2.05 + hr * Math.cos(hphi), sz + hr * Math.sin(hphi) * Math.sin(ha), 1.0, 0.88, 0.72, 1.05);
    } else {
      // Arms extended forward holding and moving the Aarti Thali
      const at = Math.random();
      const ax = sx + 0.25 + at * 0.95;
      const ay = sy + 1.7 - Math.sin(at * Math.PI * 0.5) * 0.3;
      const az = sz + at * 0.35;
      const side = Math.random() > 0.5 ? 1 : -1;
      addP(ax, ay, az + side * 0.12, 1.0, 0.85, 0.65, 0.95);
    }
  }

  // 3. The Circular Aarti Motion (Thali Circle / Ovalana) - (6,500 particles)
  // A radiant circular sweep in clockwise direction between sister and brother
  for (let i = 0; i < 6500; i++) {
    const p = Math.random();
    const theta = Math.random() * Math.PI * 2;
    const circleR = 1.0 + (Math.random() - 0.5) * 0.25;
    const cx = 0.0 + Math.cos(theta) * circleR;
    const cy = -2.1 + Math.sin(theta) * (circleR * 0.85);
    const cz = 0.45 + Math.sin(theta) * 0.25;

    if (p < 0.40) {
      // Luminous Circular Aarti Motion Trail (golden light stream)
      addP(cx, cy, cz, 1.0, 0.88 + Math.random() * 0.12, 0.25, 1.3);
    } else if (p < 0.65) {
      // Brass Aarti Thali plate (held at active position)
      const pr = Math.sqrt(Math.random()) * 0.55;
      const pa = Math.random() * Math.PI * 2;
      addP(-0.1 + Math.cos(pa) * pr, -1.9 + Math.sin(pa) * pr * 0.3, 0.55 + Math.sin(pa) * pr, 0.95, 0.82, 0.35, 1.1);
    } else if (p < 0.85) {
      // Lit Aarti Diya Flame moving in the circle
      const fa = Math.random() * Math.PI * 2;
      const fr = Math.random() * 0.15;
      addP(-0.1 + Math.cos(fa) * fr, -1.75 + Math.random() * 0.35, 0.55 + Math.sin(fa) * fr, 1.0, 0.98, 0.85, 1.8);
    } else {
      // Flower petals (rose red & marigold) and rice grains trailing the ovalana
      const isRose = Math.random() > 0.5;
      addP(cx + (Math.random() - 0.5) * 0.25, cy + (Math.random() - 0.5) * 0.25, cz + (Math.random() - 0.5) * 0.25, isRose ? 1.0 : 1.0, isRose ? 0.15 : 0.75, isRose ? 0.35 : 0.1, 1.2);
    }
  }

  // 4. Celebratory Skyburst Fireworks & Sibling Love Auroras (4,500 particles)
  for (let i = 0; i < 4500; i++) {
    const p = Math.random();
    if (p < 0.55) {
      // Golden Anar sparklers fountain erupting into night sky
      const t = Math.random();
      const height = t * 7.5;
      const spread = Math.pow(t, 0.7) * (1.2 + Math.random() * 2.8);
      const theta = Math.random() * Math.PI * 2;
      addP(Math.cos(theta) * spread, height - 0.5, Math.sin(theta) * spread, 1.0, 0.88, 0.3, 1.4);
    } else {
      // Multi-colored celebratory sparks (ruby rose, gold, cyan)
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const shellR = 2.0 + Math.pow(Math.random(), 0.5) * 4.5;
      const sp = Math.random();
      addP(shellR * Math.sin(phi) * Math.cos(theta), 2.5 + shellR * Math.cos(phi) * 0.9, shellR * Math.sin(phi) * Math.sin(theta), sp < 0.5 ? 1.0 : 1.0, sp < 0.5 ? 0.2 : 0.92, sp < 0.5 ? 0.6 : 0.35, 1.3);
    }
  }

  return { pos, col, size };
}

/**
 * -------------------------------------------------------------
 * GLSL SHADERS (Custom Vertex & Fragment Shaders)
 * -------------------------------------------------------------
 */

const PARTICLE_VERTEX_SHADER = /* glsl */`
  uniform float uProgress;
  uniform float uTime;
  uniform vec3 uMouse;
  uniform float uScatter;
  uniform float uWave;
  uniform float uActIndex;
  uniform float uPixelRatio;

  attribute vec3 aTarget;
  attribute vec3 aColor;
  attribute vec3 aTargetColor;
  attribute float aSeed;
  attribute float aSize;

  varying vec3 vColor;
  varying float vSeed;
  varying float vDistToCamera;

  void main() {
    vSeed = aSeed;

    // 1. Morph between source and target positions
    float progress = smoothstep(0.0, 1.0, uProgress);
    vec3 pos = mix(position, aTarget, progress);

    // 2. Micro-thermal shimmer (subtle organic breathing, does NOT smudge fine details)
    pos.y += sin(uTime * 1.5 + aSeed * 25.0) * 0.015;
    pos.x += cos(uTime * 1.2 + pos.y * 1.5 + aSeed * 20.0) * 0.012;
    pos.z += sin(uTime * 1.0 + pos.x * 1.5 + aSeed * 15.0) * 0.012;

    // 3. Dynamic Wave Ripple
    pos.y += sin(pos.x * 0.5 + pos.z * 0.5 + uTime * 2.0) * uWave * 0.2;

    // 4. Interactive 3D Pointer Repulsion
    float d = distance(pos, uMouse);
    if (d < 2.2) {
      float push = (1.0 - d / 2.2) * 1.5;
      pos += normalize(pos - uMouse + vec3(0.0001)) * push;
    }

    // 5. Click Scatter Shockwave disabled on image (independent fireworks system used instead)
    // Sacred image remains pristine and undisturbed

    // 6. True Per-Particle Color Morphing
    vColor = mix(aColor, aTargetColor, progress);

    // Transform to clip space
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vDistToCamera = -mvPosition.z;

    // 7. Perspective Point Sizing for Dense Pointillist Stardust (2.5px - 5.0px)
    gl_PointSize = (aSize * 18.0 + 6.0) * (1.0 / -mvPosition.z) * uPixelRatio;
  }
`;

const PARTICLE_FRAGMENT_SHADER = /* glsl */`
  uniform float uTime;
  varying vec3 vColor;
  varying float vSeed;
  varying float vDistToCamera;

  void main() {
    // 1. Crisp circular stardust point sprite
    float r = length(gl_PointCoord - vec2(0.5));
    if (r > 0.5) discard;

    // Anti-aliased outer edge (crisp 0.5 to 0.25 transition)
    float alpha = smoothstep(0.5, 0.25, r);

    // 2. Subtle jewel-like center glint (keeps 100% of the true color, adds sparkle)
    float centerGlint = smoothstep(0.25, 0.0, r);
    vec3 spark = vec3(0.18, 0.15, 0.10) * centerGlint;

    // 3. Organic Diya Micro-Flicker (subtle twinkle)
    float flicker = 0.92 + 0.08 * sin(uTime * 4.5 + vSeed * 62.83);

    // Retain pure, vibrant colors!
    vec3 finalColor = vColor + spark;

    gl_FragColor = vec4(finalColor, alpha * flicker);
  }
`;

// Asynchronously load exact binary particle positions, colors, and sizes sampled from reference images
async function loadBinaryFormations() {
  const formations = [];
  const fallbacks = [
    generateAct0,
    generateAct1,
    generateAct2,
    generateAct3,
    generateAct4,
    generateAct5,
    generateAct6
  ];

  let baseUrl = '';
  try {
    if (typeof window !== 'undefined' && window.location && window.location.href) {
      baseUrl = new URL('.', window.location.href).href;
    }
  } catch (e) {
    baseUrl = '';
  }

  for (let i = 0; i <= 6; i++) {
    try {
      const url = `${baseUrl}reference/act${i}.bin`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const buf = await res.arrayBuffer();
      const floats = new Float32Array(buf);
      if (floats.length !== 1260000) throw new Error(`Invalid float count: ${floats.length}`);
      formations.push({
        pos: floats.slice(0, 540000),
        col: floats.slice(540000, 1080000),
        size: floats.slice(1080000, 1260000)
      });
    } catch (err) {
      console.warn(`Falling back to procedural math for act ${i}:`, err);
      formations.push(fallbacks[i]());
    }
  }
  return formations;
}

// Export formations and shaders
window.ParticleEngine = {
  PARTICLE_COUNT,
  loadBinaryFormations,
  generateAct0,
  generateAct1,
  generateAct2,
  generateAct3,
  generateAct4,
  generateAct5,
  generateAct6,
  PARTICLE_VERTEX_SHADER,
  PARTICLE_FRAGMENT_SHADER
};
