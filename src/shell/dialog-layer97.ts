type Listener = () => void;

let dialogLayer: HTMLElement | null = null;
const listeners = new Set<Listener>();

export const registerShellDialogLayer97 = (layer: HTMLElement | null) => {
  if (dialogLayer === layer) return;
  dialogLayer = layer;
  listeners.forEach(listener => listener());
};

export const getShellDialogLayer97 = () => dialogLayer;

export const subscribeShellDialogLayer97 = (listener: Listener) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};

export const getServerShellDialogLayer97 = () => null;
