export type WeruSound = 'startup' | 'chord' | 'click' | 'ding' | 'pop' | 'crunch' | 'shutdown';

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  setEnabled(enabled: boolean) { this.enabled = enabled; }

  private getContext() {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  play(sound: WeruSound) {
    if (!this.enabled || typeof window === 'undefined') return;
    try {
      const context = this.getContext();
      const now = context.currentTime;
      const duration = sound === 'startup' ? 1.8 : sound === 'shutdown' ? 1.1 : sound === 'crunch' ? .35 : sound === 'click' ? .04 : sound === 'pop' ? .12 : .28;
      const gain = context.createGain();
      gain.gain.setValueAtTime(sound === 'click' ? .025 : .06, now);
      gain.gain.exponentialRampToValueAtTime(.0001, now + duration);
      gain.connect(context.destination);
      if (sound === 'crunch' || sound === 'click') {
        const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
        const source = context.createBufferSource(); source.buffer = buffer; source.connect(gain); source.start(now); source.stop(now + duration); return;
      }
      const frequencies = sound === 'startup' ? [261.63, 329.63, 392, 493.88] : sound === 'shutdown' ? [493.88, 392, 329.63, 261.63] : sound === 'ding' ? [880] : sound === 'pop' ? [800, 400] : [523.25, 659.25, 783.99];
      frequencies.forEach((frequency, index) => {
        const oscillator = context.createOscillator(); oscillator.type = 'square'; oscillator.frequency.value = frequency;
        oscillator.connect(gain); oscillator.start(now + index * (sound === 'startup' ? .12 : 0)); oscillator.stop(now + duration);
      });
    } catch { /* Browsers may block audio until a user gesture. */ }
  }
}

export const soundEngine = new SoundEngine();

