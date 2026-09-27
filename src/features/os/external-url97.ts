/** Only web links are allowed to leave the Weru 97 shell. */
export const isAllowedExternalUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
};
