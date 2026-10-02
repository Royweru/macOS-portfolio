import { openExternalUrlInNewTab } from '../features/os/open-target';

type ExternalLinkActivationEvent = {
  defaultPrevented: boolean;
  preventDefault: () => void;
};

export function handleExternalBrowserLinkClick97(
  event: ExternalLinkActivationEvent,
  href: string,
  onBlocked: () => void,
  open = openExternalUrlInNewTab,
) {
  if (event.defaultPrevented) return undefined;
  event.preventDefault();
  const opened = open(href);
  if (!opened) onBlocked();
  return opened;
}
