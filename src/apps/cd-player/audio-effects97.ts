export interface CdAudioSettings97 {
  balance: number;
  preampDb: number;
  bassDb: number;
  trebleDb: number;
  enabled: boolean;
}

export interface CdAudioEffectsGraph97 {
  context: AudioContext;
  input: MediaElementAudioSourceNode;
  preamp: GainNode;
  bass: BiquadFilterNode;
  treble: BiquadFilterNode;
  panner: StereoPannerNode | null;
}

export function createCdAudioEffectsGraph97(
  context: AudioContext,
  input: MediaElementAudioSourceNode,
): CdAudioEffectsGraph97 {
  const preamp = context.createGain();
  const bass = context.createBiquadFilter();
  bass.type = 'lowshelf';
  bass.frequency.value = 180;
  const treble = context.createBiquadFilter();
  treble.type = 'highshelf';
  treble.frequency.value = 3500;
  const panner = typeof context.createStereoPanner === 'function' ? context.createStereoPanner() : null;

  input.connect(preamp);
  preamp.connect(bass);
  bass.connect(treble);
  if (panner) {
    treble.connect(panner);
    panner.connect(context.destination);
  } else {
    treble.connect(context.destination);
  }

  return { context, input, preamp, bass, treble, panner };
}

export function applyCdAudioSettings97(graph: CdAudioEffectsGraph97, settings: CdAudioSettings97): void {
  const now = graph.context.currentTime;
  const rampSeconds = 0.025;
  graph.panner?.pan.setTargetAtTime(settings.balance, now, rampSeconds);
  graph.preamp.gain.setTargetAtTime(settings.enabled ? 10 ** (settings.preampDb / 20) : 1, now, rampSeconds);
  graph.bass.gain.setTargetAtTime(settings.enabled ? settings.bassDb : 0, now, rampSeconds);
  graph.treble.gain.setTargetAtTime(settings.enabled ? settings.trebleDb : 0, now, rampSeconds);
}

export function disconnectCdAudioEffects97(graph: CdAudioEffectsGraph97): void {
  graph.input.disconnect();
  graph.preamp.disconnect();
  graph.bass.disconnect();
  graph.treble.disconnect();
  graph.panner?.disconnect();
}
