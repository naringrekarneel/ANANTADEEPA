# 🪔 ANANTADEEPA: The Journey of Light (अनंतदीपा)
### A Pure 3D WebGL Particle Animation Odyssey Across the 7 Acts of Deepavali

[![WebGL 2.0](https://img.shields.io/badge/WebGL-2.0%20%2F%20GLSL-gold.svg)](https://threejs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r128-black.svg)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-green.svg)](https://greensock.com/gsap/)
[![Web Audio API](https://img.shields.io/badge/Web%20Audio-Procedural%20Synthesis-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Pure Particles](https://img.shields.io/badge/Visuals-180%2C000%20Pure%203D%20Particles%20(ORIGIN)-blueviolet.svg)](#)
[![Frame Rate](https://img.shields.io/badge/FPS-60--120%20Solid-blue.svg)](#)

> **"तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥"**  
> *"Lead us from darkness unto light, from ignorance unto truth."*

---

## 🌟 Overview

**ANANTADEEPA (अनंतदीपा)** is a production-ready, highly polished, single-page interactive 3D scrollytelling web application. Adapting the exact architecture, interaction model, and visual elegance of **ORIGIN** (*origin-life.netlify.app*), it renders the spiritual, philosophical, and cultural narrative of **Diwali (Deepavali)** across its complete 7-act chronological sequence in the Vikram Samvat calendar.

The entire visual experience is rendered as **pure 3D WebGL particle animation**:
- **Zero 2D flat image planes**: No flat backdrop textures or 2D planes.
- **65,000 Living Reactive Particles**: High-density stratified sampling with dedicated quotas for both outer frame borders (hanging garlands, side columns, trees, curtains) and inner structural contours (mandala rings, arches, kalash rims, lotus petals).
- **Real-Time Morphing**: Smooth continuous interpolation between acts using GSAP and custom GLSL vertex/fragment shaders.
- **Interactive Physics**: 3D pointer repulsion, thermal buoyancy, breathing flickers, and click/tap sparkler shockwaves with procedural audio crackles.

---

## 📜 The 7 Sacred Acts of Diwali

| Act | Tithi / Day | Sacred Title | 3D Particle Constellation (From Reference Artwork) | Spiritual Lore |
|:---:|:---|:---|:---|:---|
| **0** | *Prologue*<br>Kartika Krishna Paksha | **The Awakening of Light**<br>प्रकाशस्य उदयः | **Ayodhya Homecoming**<br>Torana gateway pillars, hanging marigold arches, Shri Rama, Sita, Lakshmana, cheering crowds, fireworks & floor diyas | The joyful homecoming of Shri Rama & Mata Sita; citizens celebrating with glowing diyas & sparklers. |
| **1** | *Day I*<br>Ashvin Dwadashi | **Vasu Baras**<br>गोधन पूजनम् | **Gau Mata & Nursing Calf**<br>Village hut outlines, banana trees, sacred cow with garland watching her nursing calf, and devout women with aarti thalis | Honoring Kamadhenu, unconditional maternal nurture, ecological reverence, and sacred cow worship. |
| **2** | *Day II*<br>Ashvin Trayodashi | **Dhanteras**<br>धनत्रयोदशी | **Three Golden Kalash & Amrit**<br>Intricate outer/inner circular mandala rings, three golden kalash pots overflowing with coins & pearls, and foreground burning diyas | Advent of Lord Dhanvantari with the vessel of Amrita (holistic health) and Goddess Lakshmi. |
| **3** | *Day III*<br>Ashvin Chaturdashi | **Naraka Chaturdashi**<br>नरक चतुर्दशी | **Krishna Defeating Narakasura**<br>Stone arena columns, upper balcony railings, cheering arena spectators, Krishna wielding Sudarshana Chakra, and fallen Narakasura | Victory of Shri Krishna over Narakasura; liberation of 16,000 souls; pre-dawn Abhyanga Snan to wash away inner ego. |
| **4** | *Day IV*<br>Kartika Amavasya | **Lakshmi Pujan**<br>लक्ष्मी पूजनम् | **Mahalakshmi on Pink Lotus**<br>Outer hanging flower curtains, suspended lanterns, urns, Goddess Mahalakshmi on Kamalasana, and foreground circular rangoli borders & diya | The darkest night illuminated by Goddess Lakshmi's radiance and the sacred earthen diya; invoking spiritual and material abundance. |
| **5** | *Day V*<br>Kartika Pratipada | **Diwali Padwa**<br>दीपावली पाडवा | **Lord Vamana & King Bali**<br>Cosmic planetary orbits, celestial constellations, Lord Vamana placing his foot on kneeling King Bali, and holy Kamandalu | Vikram Samvat New Year inception, King Bali's noble surrender, and celebration of marital fidelity and companionship. |
| **6** | *Day VI*<br>Kartika Dwitiya | **Bhau Beej**<br>यम द्वितीया / भाऊबीज | **Sister's Aarti Blessing**<br>Ceiling floral torana garland, room furniture outlines, devoted sister with Aarti Thali applying tilak to seated brother, and sweet plate | The sacred Aarti Ovalana ritual and eternal covenant of sibling love, protection, and gratitude. |

---

## 🛠️ Technology Architecture

### 1. Pure WebGL Particle Engine (Three.js + GLSL)
- **Constant 65,000 Particles**: Single `THREE.BufferGeometry` bound to a single `THREE.Points` mesh.
- **Stratified Border Architecture**:
  - `25,000` dedicated contour & inner border particles (mandala concentric rings, arch silhouettes, lotus petals, halo circles).
  - `15,000` dedicated outer frame margin particles (hanging toranas, side columns, trees, lanterns, carpets, floor diyas).
  - `25,000` luminous surface particles filling the central divine forms.
- **Attributes**:
  - `position`: Source coordinate vector (`Float32BufferAttribute`, 65,000 × 3).
  - `aTarget`: Destination coordinate vector for morphing (`Float32BufferAttribute`, 65,000 × 3).
  - `aColor` & `aTargetColor`: RGB color vectors allowing smooth multi-hued chromatic morphing.
  - `aSeed`: Per-particle random float for unique noise offsets, flickers, and timing.
  - `aSize`: Per-particle scalar scale variation with guaranteed minimum size on borders `[1.1, 2.4]`.
- **GLSL Shaders**:
  - **Vertex Shader**:
    - Morphing: `vec3 pos = mix(position, aTarget, smoothstep(0.0, 1.0, uProgress));`
    - Thermal buoyancy & heat shimmer: upward drift with 3D harmonic oscillations.
    - Interactive 3D pointer repulsion within radius 2.5 with elastic fluid return.
    - Click scatter shockwave with seed dispersion.
    - Perspective point sizing: `gl_PointSize = (aSize * 15.0 + 3.0) * (1.0 / -mvPosition.z) * (uPixelRatio * 0.75);`
  - **Fragment Shader**:
    - Point sprite radial discard: `length(gl_PointCoord - 0.5) > 0.5`.
    - Dual-zone luminous glow: inner incandescent core `smoothstep(0.42, 0.05, r)` + outer atmospheric halo `pow(1.0 - (r * 2.0), 2.2)`.
    - Diya breathing micro-flicker: `0.85 + 0.15 * sin(uTime * 6.5 + vSeed * 60.0)`.
    - Blending: `THREE.AdditiveBlending`, `depthWrite: false`, `transparent: true`.

### 2. Procedural Web Audio API Engine
**Zero external audio files are loaded.** All soundscapes are synthesized 100% procedurally in code:
- **Meditative Tanpura Drone**: Tuned to sacred D (`D2 = 73.42Hz`, `Pa/A2 = 110Hz`, `Sa/D3 = 146.83Hz`). Emulates acoustic gourd resonance using sawtooth oscillators, multi-pole lowpass filters with slow LFO sweeps, and cotton thread *Jawari* buzzing overtone modulation.
- **Temple Bell (Ghanta)**: Physical modal synthesis with non-harmonic partials (`1.0, 2.01, 3.02, 4.24, 5.43, 6.89`), sharp transient strike, and long exponential decays on every act transition.
- **Phuljhadi (Diwali Sparkler) Crackles**: Randomized clusters of filtered white noise bursts (3.5 kHz – 8 kHz) with micro-envelopes mimicking festive sparklers on clicks.

### 3. Glassmorphic UI & Design System
- **Typography**: Google Fonts preconnected:
  - Heading & Display: `'Cinzel'` (English) & `'Rozha One'` (Devanagari).
  - UI & Narrative: `'Plus Jakarta Sans'`.
  - Metrics & Dates: `'JetBrains Mono'`.
- **Collapsible Story Card**: Minimize/expand the story card to an unobtrusive pill with <kbd>C</kbd> or the card collapse arrow to view the 3D particle constellation completely unobstructed.
- **HUD Scrubber**: 7 milestone buttons, glowing animated progress line, and active golden bead.

---

## 🎮 Interaction Controls

| Action | Desktop Input | Mobile / Touch Gesture |
|:---|:---|:---|
| **Travel between Acts** | Scroll Wheel / <kbd>←</kbd> <kbd>→</kbd> / <kbd>↑</kbd> <kbd>↓</kbd> | Swipe Up / Swipe Down |
| **Orbit 3D Constellation** | Click & Drag Mouse | Drag Single Finger |
| **Disturb Particles (Repulsion)** | Move Mouse Pointer | Touch & Drag |
| **Burst Sparklers (Phuljhadi)** | Left Click Canvas | Tap Canvas |
| **Minimize / Expand Card** | <kbd>C</kbd> or Collapse arrow | Tap Collapse arrow |
| **Toggle Auto Tour** | <kbd>Space</kbd> or "Tour" button | Tap "Tour" button |
| **Toggle Soundscape** | <kbd>M</kbd> or "Audio" button | Tap "Audio" button |
| **Hide / Show HUD Interface** | <kbd>H</kbd> key | — |
| **Sacred Lore & Help** | <kbd>?</kbd> or <kbd>/</kbd> or "?" button | Tap "?" button |

---

## 🚀 Live Application

The local web server is running on port **8080**:  
👉 **`http://localhost:8080`**

---

## 🪔 Sacred Blessings

May the celestial radiance of **ANANTADEEPA** bring auspicious health, boundless prosperity, and eternal peace to you and your loved ones.  
**शुभ दीपावली · Happy Deepavali!**

---

## ⚖️ Copyright & Author

**Conceived, Designed & Created by @neel naringrekar**  
Copyright © 2026 @neel naringrekar. All rights reserved.

- 📸 **Instagram**: [@neels.edits](https://www.instagram.com/neels.edits/)
- 🐙 **GitHub**: [@naringrekarneel](https://github.com/naringrekarneel)
- 💼 **LinkedIn**: [neelnaringrekar](https://www.linkedin.com/in/neelnaringrekar/)
