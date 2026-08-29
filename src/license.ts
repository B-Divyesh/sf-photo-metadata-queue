const SLUG = 'photo-metadata-queue';
const KEY = `sb_license:${SLUG}`;
const VERDICT = `${KEY}:verdict`;
const RETRY_AT = `${KEY}:retry-at`;
const VERDICT_MAX_AGE = 86_400_000;

export const checkoutUrl = `https://api.sociobot.in/api/v1/products/${SLUG}/checkout`;

type CachedVerdict = { valid: boolean; checkedAt: number };
export type LicenseCheck =
  | { valid: true; status: 'verified' | 'cached' }
  | { valid: false; status: 'invalid' | 'network' | 'rate-limited'; retryAfterSeconds?: number };

function readVerdict(): CachedVerdict | null {
  const cached = localStorage.getItem(VERDICT);
  if (!cached) return null;
  try {
    const verdict = JSON.parse(cached) as CachedVerdict;
    return typeof verdict.valid === 'boolean' && Number.isFinite(verdict.checkedAt) ? verdict : null;
  } catch {
    return null;
  }
}

function hasFreshValidVerdict(): boolean {
  const verdict = readVerdict();
  return Boolean(localStorage.getItem(KEY) && verdict?.valid && Date.now() - verdict.checkedAt < VERDICT_MAX_AGE);
}

function retryAfterSeconds(header: string | null): number {
  if (!header) return 60;
  const numeric = Number(header);
  if (Number.isFinite(numeric) && numeric >= 0) return Math.max(1, Math.ceil(numeric));
  const retryAt = Date.parse(header);
  return Number.isNaN(retryAt) ? 60 : Math.max(1, Math.ceil((retryAt - Date.now()) / 1000));
}

function currentRetryAfter(): number | null {
  const retryAt = Number(localStorage.getItem(RETRY_AT));
  if (!Number.isFinite(retryAt) || retryAt <= Date.now()) {
    localStorage.removeItem(RETRY_AT);
    return null;
  }
  return Math.max(1, Math.ceil((retryAt - Date.now()) / 1000));
}

export function captureLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  saveLicense(token);
  url.searchParams.delete('license');
  history.replaceState({}, '', url.pathname + url.search + url.hash);
}

export function saveLicense(token: string): void {
  const value = token.trim();
  const previous = localStorage.getItem(KEY);
  if (value) localStorage.setItem(KEY, value);
  else localStorage.removeItem(KEY);
  if (value !== previous) {
    localStorage.removeItem(VERDICT);
    localStorage.removeItem(RETRY_AT);
  }
}

export function removeLicense(): void {
  localStorage.removeItem(KEY);
  localStorage.removeItem(VERDICT);
  localStorage.removeItem(RETRY_AT);
}

export function hasStoredLicense(): boolean { return Boolean(localStorage.getItem(KEY)); }

export function hasLicense(): boolean { return hasFreshValidVerdict(); }

export async function verifyLicense(force = false): Promise<LicenseCheck> {
  const token = localStorage.getItem(KEY);
  if (!token) return { valid: false, status: 'invalid' };

  const cached = readVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < VERDICT_MAX_AGE) {
    return cached.valid ? { valid: true, status: 'cached' } : { valid: false, status: 'invalid' };
  }

  const delayedBy = currentRetryAfter();
  if (delayedBy) {
    return hasFreshValidVerdict()
      ? { valid: true, status: 'cached' }
      : { valid: false, status: 'rate-limited', retryAfterSeconds: delayedBy };
  }

  const endpoint = `https://api.sociobot.in/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`;
  try {
    const response = await fetch(endpoint);
    if (response.status === 429) {
      const seconds = retryAfterSeconds(response.headers.get('Retry-After'));
      localStorage.setItem(RETRY_AT, String(Date.now() + seconds * 1000));
      return hasFreshValidVerdict()
        ? { valid: true, status: 'cached' }
        : { valid: false, status: 'rate-limited', retryAfterSeconds: seconds };
    }
    if (!response.ok) throw new Error(`License verification returned ${response.status}`);
    const result = await response.json() as { valid?: unknown };
    const valid = result.valid === true;
    localStorage.setItem(VERDICT, JSON.stringify({ valid, checkedAt: Date.now() }));
    localStorage.removeItem(RETRY_AT);
    return valid ? { valid: true, status: 'verified' } : { valid: false, status: 'invalid' };
  } catch {
    return hasFreshValidVerdict()
      ? { valid: true, status: 'cached' }
      : { valid: false, status: 'network' };
  }
}
