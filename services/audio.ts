
export type SoundEffect = 'click' | 'correct' | 'incorrect' | 'start' | 'end' | 'generate' | 'success';

export const playSynthSound = (type: SoundEffect) => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const masterGain = audioCtx.createGain();
  masterGain.connect(audioCtx.destination);
  masterGain.gain.value = 0.1;

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
      playTone(880, now, 0.1, 'square', 0.2); // High blip
      break;
    case 'generate':
      // Rising synth swell
      for (let i = 0; i < 5; i++) {
        const freq = 200 + (i * 100);
        playTone(freq, now + (i * 0.05), 0.5, 'sawtooth', 0.1);
      }
      break;
    case 'success':
      // Shimmering chord
      playTone(523.25, now, 0.6, 'sine', 0.3); // C5
      playTone(659.25, now + 0.1, 0.6, 'sine', 0.3); // E5
      playTone(783.99, now + 0.2, 0.6, 'sine', 0.3); // G5
      playTone(1046.50, now + 0.3, 0.8, 'sine', 0.2); // C6
      break;
    case 'correct':
      playTone(523.25, now, 0.2); // C5
      playTone(659.25, now + 0.1, 0.3); // E5
      break;
    case 'incorrect':
      playTone(220, now, 0.4, 'sawtooth'); // A3
      break;
    case 'start':
      playTone(261.63, now, 0.1); // C4
      playTone(329.63, now + 0.05, 0.1); // E4
      playTone(392.00, now + 0.1, 0.1); // G4
      playTone(523.25, now + 0.15, 0.3); // C5
      break;
    case 'end':
      playTone(392.00, now, 0.2); // G4
      playTone(523.25, now + 0.2, 0.2); // C5
      playTone(659.25, now + 0.4, 0.6); // E5
      break;
  }
};
