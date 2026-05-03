const TRACKING_PARAMS = new Set([
  'fbclid',
  'gclid',
  'mc_cid',
  'mc_eid',
  'ref_src',
  'utm_campaign',
  'utm_content',
  'utm_id',
  'utm_medium',
  'utm_name',
  'utm_reader',
  'utm_referrer',
  'utm_source',
  'utm_swu',
  'utm_term',
]);

const HOST_ALIASES = new Map([
  ['m.facebook.com', 'facebook.com'],
  ['mobile.twitter.com', 'twitter.com'],
  ['www.twitter.com', 'twitter.com'],
  ['x.com', 'twitter.com'],
  ['www.x.com', 'twitter.com'],
  ['old.reddit.com', 'reddit.com'],
  ['www.reddit.com', 'reddit.com'],
]);

function normaliseHostname(hostname) {
  const lowered = hostname.toLowerCase();
  return HOST_ALIASES.get(lowered) || lowered;
}

function normalisePathname(pathname) {
  let nextPath = pathname;
  if (nextPath.length > 1) {
    nextPath = nextPath.replace(/\/amp$/u, '');
    nextPath = nextPath.replace(/\/+$/u, '');
  }
  return nextPath || '/';
}

export function normaliseUrlForDedupe(url) {
  if (typeof url !== 'string') return '';
  const value = url.trim();
  if (!value) return '';

  try {
    const parsed = new URL(value);
    parsed.hash = '';

    if (
      (parsed.protocol === 'https:' && parsed.port === '443')
      || (parsed.protocol === 'http:' && parsed.port === '80')
    ) {
      parsed.port = '';
    }

    const filtered = [...parsed.searchParams.entries()]
      .map(([key, value]) => ({ key, value, lowerKey: key.toLowerCase() }))
      .filter(({ lowerKey }) => !TRACKING_PARAMS.has(lowerKey))
      .sort((a, b) => a.key.localeCompare(b.key));
    parsed.search = '';
    filtered.forEach(({ key, value }) => parsed.searchParams.append(key, value));

    parsed.pathname = normalisePathname(parsed.pathname);
    parsed.hostname = normaliseHostname(parsed.hostname);
    return parsed.toString();
  } catch {
    return value
      .replace(/#.*$/u, '')
      .replace(/\/amp$/u, '')
      .replace(/\/+$/u, '')
      .trim();
  }
}
