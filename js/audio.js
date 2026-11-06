/**
 * ANANTADEEPA: Procedural Web Audio API Engine
 * 100% synthesized: Meditative Tanpura Drone, Resonant Temple Bell, and Festive Sparkler Crackles.
 * Zero external audio files.
 */

class ProceduralAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isInitialized = false;
    this.masterGain = null;
    this.analyser = null;

    // Tanpura state
    this.tanpuraGain = null;
    this.tanpuraTimer = null;
    this.droneOscillators = [];
    this.currentString = 0;

    // Frequencies (D tuning - Sacred meditative key: D2 = 73.42Hz, A2 = 110Hz, D3 = 146.83Hz)
    this.tuning = {
      Pa: 110.00,   // A2 (Fifth)
      SaHigh: 146.83,// D3 (Tonic high)
      SaLow: 73.42   // D2 (Tonic low)
    };
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      // Analyser for UI visualizer
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Tanpura Sub-bus
      this.tanpuraGain = this.ctx.createGain();
      this.tanpuraGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
      this.tanpuraGain.connect(this.masterGain);

      this.startTanpuraDrone();
      this.startTanpuraPluckLoop();

      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio API could not initialize:", e);
    }
  }

  resume() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    if (!this.isInitialized) {
      this.init();
      return false; // unmuted
    }
    this.resume();
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(this.isMuted ? 0.0 : 0.7, now + 0.15);
    }
    return this.isMuted;
  }

  /**
   * Continuous background ambient drone simulating the acoustic hollow gourd of the Tanpura
   */
  startTanpuraDrone() {
    if (!this.ctx) return;

    // Sub-bass tonic drone
    const droneFreqs = [this.tuning.SaLow, this.tuning.Pa, this.tuning.SaHigh, this.tuning.SaLow * 0.5];

    droneFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.3, this.ctx.currentTime);

      // Warm low-pass filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3.5, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      // Slow resonant filter sweep
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.06 + idx * 0.02, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(freq * 0.8, this.ctx.currentTime);
      lfo.connect(filter.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.06 / (idx + 1), this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.tanpuraGain);

      osc.start();
      this.droneOscillators.push({ osc, gain, lfo });
    });
  }

  /**
   * Simulates the traditional 4-string Tanpura pluck pattern:
   * 1. Pa (Fifth - 1st string)
   * 2. Sa High (Tonic - 2nd string)
   * 3. Sa High (Tonic - 3rd string)
   * 4. Sa Low (Lower Tonic - 4th string)
   */
  startTanpuraPluckLoop() {
    if (!this.ctx) return;

    const pluckStrings = [
      this.tuning.Pa,
      this.tuning.SaHigh,
      this.tuning.SaHigh,
      this.tuning.SaLow
    ];

    const cycleTime = 1200; // 1.2s per pluck

    const playNextPluck = () => {
      if (this.ctx && !this.isMuted) {
        const freq = pluckStrings[this.currentString];
        this.triggerTanpuraString(freq, this.currentString === 3 ? 1.2 : 0.85);
        this.currentString = (this.currentString + 1) % pluckStrings.length;
      }
      this.tanpuraTimer = setTimeout(playNextPluck, cycleTime);
    };

    playNextPluck();
  }

  /**
   * Plucks a single tanpura string with authentic jawari (buzzing cotton thread harmonic)
   */
  triggerTanpuraString(freq, volume = 1.0) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Main string oscillator (sawtooth for rich harmonic spectrum)
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);

    // Subtle pitch drift on attack (string tension releasing)
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.08);

    // Jawari buzzing overtone oscillator
    const jawariOsc = this.ctx.createOscillator();
    jawariOsc.type = 'sine';
    jawariOsc.frequency.setValueAtTime(freq * 4.01, now);

    // Dynamic lowpass filter with envelope (bright attack, mellow decay)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 12, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 2.2, now + 2.8);
    filter.Q.setValueAtTime(3.5, now);

    // Pluck Gain Envelope
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(0.22 * volume, now + 0.015); // gentle transient attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.8); // long resonant ring

    // Jawari overtone gain
    const jawariGain = this.ctx.createGain();
    jawariGain.gain.setValueAtTime(0.06 * volume, now);
    jawariGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(filter);
    jawariOsc.connect(jawariGain);
    jawariGain.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.tanpuraGain);

    osc.start(now);
    jawariOsc.start(now);
    osc.stop(now + 4.0);
    jawariOsc.stop(now + 4.0);
  }

  /**
   * Procedural Temple Ghanta (Bell) with inharmonic physical partials
   * Triggered on chapter shifts and major events
   */
  playTempleBell(intensity = 1.0) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Authentic Indian temple bell modal ratios
    const baseFreq = 659.25; // E5 sacred bell tone
    const partials = [
      { ratio: 1.00, gain: 0.90, decay: 4.8 },
      { ratio: 2.01, gain: 0.55, decay: 3.5 },
      { ratio: 3.02, gain: 0.40, decay: 2.8 },
      { ratio: 4.24, gain: 0.28, decay: 2.0 },
      { ratio: 5.43, gain: 0.18, decay: 1.4 },
      { ratio: 6.89, gain: 0.10, decay: 0.9 }
    ];

    const bellMaster = this.ctx.createGain();
    bellMaster.gain.setValueAtTime(0.4 * intensity, now);
    bellMaster.connect(this.masterGain);

    partials.forEach(p => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Slight detune for natural beating
      const detune = (Math.random() - 0.5) * 1.5;
      osc.frequency.setValueAtTime(baseFreq * p.ratio + detune, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(p.gain, now + 0.003); // crisp metallic strike
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(bellMaster);

      osc.start(now);
      osc.stop(now + p.decay + 0.1);
    });
  }

  /**
   * Procedural Phuljhadi (Diwali Sparkler / Crackle) Synthesizer
   * Produces randomized sizzling micro-bursts of filtered white noise on clicks/bursts
   */
  playSparklerCrackle(burstCount = 18) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    for (let i = 0; i < burstCount; i++) {
      const delay = Math.pow(Math.random(), 1.5) * 0.45;
      const t = now + delay;

      // Create micro buffer of white noise
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.035); // 35ms burst
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        output[j] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // Bandpass filter to create sparkling hiss/crackle
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3500 + Math.random() * 5000, t);
      filter.Q.setValueAtTime(5.0 + Math.random() * 4.0, t);

      // Micro envelope
      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, t);
      gainNode.gain.linearRampToValueAtTime(0.12 + Math.random() * 0.15, t + 0.002);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.032);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.masterGain);

      whiteNoise.start(t);
      whiteNoise.stop(t + 0.035);
    }
  }

  /**
   * Procedural Diwali Rocket Launch Whistle & Rising Whoosh
   * Authentic acoustic rising whistle and ascending hiss
   */
  playRocketLaunchSound() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Rising whistle tone (260Hz -> 1200Hz)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.42);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.14, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.48);

    // Rising noise whoosh
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.42);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 0.42);
    filter.Q.setValueAtTime(3.5, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.08);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noise.start(now);
    noise.stop(now + 0.45);
  }

  /**
   * Procedural Diwali Firecracker (Pataka) Explosion & Sizzling Shower
   * Combines punchy low-frequency acoustic pop with 40+ micro-sparkler crackles
   */
  playFirecrackerExplosion() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // 1. Initial Low-Frequency Firecracker Pop
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.16);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.2);

    // 2. High sizzle / explosive sparkler crackle shower
    this.playSparklerCrackle(38);
  }

  /**
   * Subtle UI click / hover chime
   */
  playUiChime(pitch = 1.0) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(1320 * pitch, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  /**
   * Returns audio frequency energy level for visualizer HUD [0.0 - 1.0]
   */
  getAudioActivity() {
    if (!this.analyser || this.isMuted) return 0;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    return sum / (dataArray.length * 255);
  }
}

// Global instance
window.audioEngine = new ProceduralAudioEngine();
