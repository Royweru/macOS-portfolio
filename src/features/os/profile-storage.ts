export const PROFILE_STORAGE_KEY = 'weru-profile-id';

export const getBrowserProfileId = () => {
  if (typeof window === 'undefined') return 'server-profile';
  const existing = window.localStorage.getItem(PROFILE_STORAGE_KEY);
  if (existing) return existing;
  const profileId = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `profile-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, profileId);
  } catch {
    // A storage-blocked browser still receives a usable in-memory identity.
  }
  return profileId;
};
