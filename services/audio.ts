
export type SoundEffect = 'click' | 'correct' | 'incorrect' | 'start' | 'end' | 'generate' | 'success' | 'powerchord';

export const playSynthSound = (type: SoundEffect) => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
  masterGain.gain.value = 0.15;

  const playTone = (freq: number, startTime: number, duration: number, wave: OscillatorType = 'sine', gainVal: number = 0.5) => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, startTime);
    osc.connect(g);
    g.connect(masterGain);
    
    g.gain.setValueAtTime(0, startTime);
    g.gain.linearRampToValueAtTime(gainVal, startTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  };

  const now = audioCtx.currentTime;

  switch (type) {
    case 'click':
      playTone(880, now, 0.1, 'square', 0.2);
      break;
    case 'generate':
      for (let i = 0; i < 8; i++) {
        const freq = 100 + (i * 150);
        playTone(freq, now + (i * 0.03), 0.8, 'sawtooth', 0.05);
      }
      break;
    case 'powerchord':
      // Ett klassiskt rock-ackord (E5)
      playTone(82.41, now, 1.5, 'sawtooth', 0.4); // E2
      playTone(123.47, now, 1.5, 'sawtooth', 0.4); // B2
      playTone(164.81, now, 1.5, 'sawtooth', 0.4); // E3
      break;
    case 'success':
      playTone(523.25, now, 0.6, 'sine', 0.3);
      playTone(659.25, now + 0.1, 0.6, 'sine', 0.3);
      playTone(783.99, now + 0.2, 0.6, 'sine', 0.3);
      break;
    case 'correct':
      playTone(523.25, now, 0.2);
      playTone(659.25, now + 0.1, 0.3);
      break;
    case 'incorrect':
      playTone(110, now, 0.5, 'sawtooth');
      break;
    case 'start':
      playTone(261.63, now, 0.1);
      playTone(392.00, now + 0.1, 0.3);
      break;
    case 'end':
      playTone(392.00, now, 0.2);
      playTone(523.25, now + 0.2, 0.2);
      playTone(659.25, now + 0.4, 0.6);
      break;
  }
};
