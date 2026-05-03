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
      .filter(([key]) => !TRACKING_PARAMS.has(key.toLowerCase()))
      .sort(([left], [right]) => left.localeCompare(right));
    parsed.search = '';
    filtered.forEach(([key, paramValue]) => parsed.searchParams.append(key, paramValue));

    if (parsed.pathname.length > 1) {
      parsed.pathname = parsed.pathname.replace(/\/+$/u, '');
    }

    parsed.hostname = parsed.hostname.toLowerCase();
    return parsed.toString();
  } catch {
    return value
      .replace(/#.*$/u, '')
      .replace(/\/+$/u, '')
      .trim();
  }
}
