const SLUG = 'photo-metadata-queue';
const KEY = `sb_license:${SLUG}`;
const VERDICT = `${KEY}:verdict`;
export const checkoutUrl = `https://api.sociobot.in/api/v1/products/${SLUG}/checkout`;

export function captureLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(KEY, token);
  url.searchParams.delete('license');
  history.replaceState({}, '', url.pathname + url.search + url.hash);
}

export function saveLicense(token: string): void {
  localStorage.setItem(KEY, token.trim()); localStorage.removeItem(VERDICT);
}
export function removeLicense(): void { localStorage.removeItem(KEY); localStorage.removeItem(VERDICT); }
export function hasLicense(): boolean {
  const cached = localStorage.getItem(VERDICT);
  if (!localStorage.getItem(KEY)) return false;
  if (!cached) return true;
  try { return JSON.parse(cached).valid === true; } catch { return true; }
}

export async function verifyLicense(force = false): Promise<boolean> {
  const token = localStorage.getItem(KEY); if (!token) return false;
  const cached = localStorage.getItem(VERDICT);
  if (!force && cached) {
    try { const v = JSON.parse(cached); if (Date.now() - v.checkedAt < 86_400_000) return v.valid; } catch { /* retry */ }
  }
  const endpoint = `https://api.sociobot.in/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`;
  try {
    const response = await fetch(endpoint); if (!response.ok) throw new Error('verify failed');
    const result = await response.json() as { valid: boolean };
    localStorage.setItem(VERDICT, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
    return result.valid;
  } catch { return hasLicense(); }
}
