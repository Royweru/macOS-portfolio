import { describe, expect, it, vi } from 'vitest';
import { applyCdAudioSettings97, createCdAudioEffectsGraph97, disconnectCdAudioEffects97 } from './audio-effects97';

function makeParam() {
  return { value: 0, setTargetAtTime(value: number) { this.value = value; } };
}

function makeNode() {
  return { connect: vi.fn(), disconnect: vi.fn() };
}

function makeContext() {
  const preamp = { ...makeNode(), gain: makeParam() };
  const bass = { ...makeNode(), type: 'lowpass', frequency: makeParam(), gain: makeParam() };
  const treble = { ...makeNode(), type: 'lowpass', frequency: makeParam(), gain: makeParam() };
  const panner = { ...makeNode(), pan: makeParam() };
  const context = {
    currentTime: 2,
    destination: makeNode(),
    createGain: vi.fn(() => preamp),
    createBiquadFilter: vi.fn().mockReturnValueOnce(bass).mockReturnValueOnce(treble),
    createStereoPanner: vi.fn(() => panner),
  };
  const input = makeNode();
  return { context, input, preamp, bass, treble, panner };
}

describe('CD Player audio effects', () => {
  it('connects the preamp, bass/treble shelves, and stereo balance in order', () => {
    const { context, input, preamp, bass, treble, panner } = makeContext();
    createCdAudioEffectsGraph97(context as unknown as AudioContext, input as unknown as MediaElementAudioSourceNode);

    expect(input.connect).toHaveBeenCalledWith(preamp);
    expect(preamp.connect).toHaveBeenCalledWith(bass);
    expect(bass).toMatchObject({ type: 'lowshelf', frequency: { value: 180 } });
    expect(bass.connect).toHaveBeenCalledWith(treble);
    expect(treble).toMatchObject({ type: 'highshelf', frequency: { value: 3500 } });
    expect(treble.connect).toHaveBeenCalledWith(panner);
    expect(panner.connect).toHaveBeenCalledWith(context.destination);
  });

  it('smoothly applies volume-independent pan and EQ settings and bypasses EQ when disabled', () => {
    const { context, input, preamp, bass, treble, panner } = makeContext();
    const graph = createCdAudioEffectsGraph97(context as unknown as AudioContext, input as unknown as MediaElementAudioSourceNode);
    applyCdAudioSettings97(graph, { balance: -0.5, preampDb: 6, bassDb: 3, trebleDb: -2, enabled: true });

    expect(panner.pan.value).toBe(-0.5);
    expect(preamp.gain.value).toBeCloseTo(10 ** (6 / 20));
    expect(bass.gain.value).toBe(3);
    expect(treble.gain.value).toBe(-2);

    applyCdAudioSettings97(graph, { balance: 1, preampDb: 6, bassDb: 3, trebleDb: -2, enabled: false });
    expect(panner.pan.value).toBe(1);
    expect(preamp.gain.value).toBe(1);
    expect(bass.gain.value).toBe(0);
    expect(treble.gain.value).toBe(0);
  });

  it('disconnects every node when ejecting a processed track', () => {
    const { context, input, preamp, bass, treble, panner } = makeContext();
    const graph = createCdAudioEffectsGraph97(context as unknown as AudioContext, input as unknown as MediaElementAudioSourceNode);
    disconnectCdAudioEffects97(graph);

    expect(input.disconnect).toHaveBeenCalledOnce();
    expect(preamp.disconnect).toHaveBeenCalledOnce();
    expect(bass.disconnect).toHaveBeenCalledOnce();
    expect(treble.disconnect).toHaveBeenCalledOnce();
    expect(panner.disconnect).toHaveBeenCalledOnce();
  });
});
