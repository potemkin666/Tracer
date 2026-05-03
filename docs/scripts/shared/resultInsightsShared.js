import { buildQueryPlan, uniqueCaseInsensitive } from './queryShared.js';

const LANGUAGE_PATTERNS = [
  { code: 'es', re: /\b(el|la|los|las|de|del|para|con|sobre|perfil|cuenta)\b|[ñáéíóú]/iu },
  { code: 'fr', re: /\b(le|la|les|des|pour|avec|profil|compte|bonjour)\b|[àâçéèêëîïôûùüÿ]/iu },
  { code: 'de', re: /\b(der|die|das|und|mit|profil|konto|seite|über)\b|[äöüß]/iu },
  { code: 'pt', re: /\b(o|a|os|as|para|com|perfil|conta|sobre)\b|[ãõç]/iu },
];

const REGION_PATTERNS = [
  { code: 'uk', re: /\b(united kingdom|england|scotland|wales|britain|uk)\b/iu },
  { code: 'us', re: /\b(united states|usa|u\.s\.|america|california|new york|texas)\b/iu },
  { code: 'de', re: /\b(germany|deutschland|berlin|munich)\b/iu },
  { code: 'fr', re: /\b(france|paris|lyon|marseille)\b/iu },
  { code: 'es', re: /\b(spain|españa|madrid|barcelona)\b/iu },
  { code: 'ca', re: /\b(canada|toronto|vancouver|montreal)\b/iu },
  { code: 'au', re: /\b(australia|sydney|melbourne|brisbane)\b/iu },
];

const COUNTRY_TLDS = new Map([
  ['uk', 'uk'],
  ['de', 'de'],
  ['fr', 'fr'],
  ['es', 'es'],
  ['ca', 'ca'],
  ['au', 'au'],
  ['jp', 'jp'],
  ['it', 'it'],
  ['br', 'br'],
]);

const FORUM_HOSTS = [/reddit\.com/iu, /news\.ycombinator\.com/iu, /stack(over)?flow\.com/iu, /forum/iu, /community/iu];
const MEDIA_HOSTS = [/bbc\./iu, /reuters\.com/iu, /nytimes\.com/iu, /theguardian\.com/iu, /cnn\.com/iu, /washingtonpost\.com/iu, /aljazeera\.com/iu];
const OFFICIAL_HINTS = /\bofficial\b|\bverified\b|\bpress release\b|\bdepartment\b|\bministry\b/iu;
const NAME_PATTERN = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})\b/gu;
const ORG_PATTERN = /\b([A-Z][\w&.-]+(?:\s+[A-Z][\w&.-]+){0,3}\s(?:Inc|LLC|Ltd|Corp|Corporation|Company|University|College|Foundation|Agency|Department|Institute|Labs?|Studio|Group))\b/gu;
const DATE_PATTERNS = [
  /\b(20\d{2}-\d{2}-\d{2})\b/u,
  /\b(20\d{2}\/\d{2}\/\d{2})\b/u,
  /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},\s+\d{4})\b/iu,
  /\b(\d{4})\b/u,
];

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function safeHostname(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./u, '');
  } catch {
    return '';
  }
}

function safeDomainTail(hostname) {
  const parts = hostname.split('.').filter(Boolean);
  return parts.length ? parts[parts.length - 1] : '';
}

function isAsciiText(value) {
  return [...String(value || '')].every((char) => char === '\n'
    || char === '\r'
    || char === '\t'
    || (char >= ' ' && char <= '~'));
}

function normaliseLanguageLabel(code) {
  return { en: 'English', es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese' }[code] || 'Unknown';
}

export function detectLanguage(text) {
  const sample = String(text || '')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu, ' ')
    .replace(/https?:\/\/\S+/giu, ' ')
    .trim();
  if (!sample) return 'unknown';
  for (const { code, re } of LANGUAGE_PATTERNS) {
    if (re.test(sample)) return code;
  }
  if (isAsciiText(sample)) return 'en';
  return 'unknown';
}

export function buildTranslationUrl(url, language) {
  if (!url || !language || language === 'en' || language === 'unknown') return null;
  return `https://translate.google.com/translate?sl=auto&tl=en&u=${encodeURIComponent(url)}`;
}

export function extractEntities(text) {
  const value = String(text || '');
  const emails = unique((value.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu) || []).map((email) => email.toLowerCase()));
  const orgs = unique(Array.from(value.matchAll(ORG_PATTERN), (match) => match[1]));
  const names = unique(Array.from(value.matchAll(NAME_PATTERN), (match) => match[1])
    .filter((candidate) => !orgs.includes(candidate) && candidate.split(/\s+/u).length <= 3));
  return { names: names.slice(0, 5), emails: emails.slice(0, 5), orgs: orgs.slice(0, 5) };
}

export function inferReliability(result = {}, input = '') {
  const text = `${result.title || ''} ${result.snippet || ''}`;
  const hostname = safeHostname(result.url || '');
  const category = result.meta?.domainCategory || null;
  const username = String(result.meta?.username || '').toLowerCase();
  const plan = buildQueryPlan(input);
  const slug = plan.localPart || plan.noSpaces;

  if (category === 'gov' || category === 'academic' || OFFICIAL_HINTS.test(text)) return 'official';
  if (username && slug && username === slug) return 'official';
  if (MEDIA_HOSTS.some((re) => re.test(hostname)) || category === 'news') return 'media';
  if (FORUM_HOSTS.some((re) => re.test(hostname)) || /\bforum\b|\bthread\b|\bcommunity\b/iu.test(text)) return 'forum';
  return 'unknown';
}

export function inferRegion(result = {}, input = '') {
  const combined = `${result.title || ''} ${result.snippet || ''} ${result.url || ''} ${input}`;
  const plan = buildQueryPlan(input);
  if (plan.operators.region) return plan.operators.region;

  for (const { code, re } of REGION_PATTERNS) {
    if (re.test(combined)) return code;
  }

  const hostname = safeHostname(result.url || '');
  const tail = safeDomainTail(hostname);
  return COUNTRY_TLDS.get(tail) || null;
}

export function extractTimelinePoint(result = {}) {
  if (result.meta?.timeline?.sortKey && result.meta?.timeline?.year) {
    return {
      label: result.meta.timeline.label || String(result.meta.timeline.year),
      year: result.meta.timeline.year,
      sortKey: result.meta.timeline.sortKey,
    };
  }
  const candidates = [
    result.meta?.publishedAt,
    result.meta?.updatedAt,
    result.meta?.year,
    result.snippet,
    result.title,
  ].filter(Boolean);

  for (const candidate of candidates) {
    const value = String(candidate);
    for (const pattern of DATE_PATTERNS) {
      const match = value.match(pattern);
      if (!match) continue;
      const raw = match[1];
      const parsed = Number.isFinite(Date.parse(raw)) ? new Date(raw) : null;
      const year = parsed && !Number.isNaN(parsed.valueOf()) ? parsed.getUTCFullYear() : Number(raw.match(/\d{4}/u)?.[0] || 0);
      if (!year) continue;
      return {
        label: raw,
        year,
        sortKey: parsed && !Number.isNaN(parsed.valueOf()) ? parsed.toISOString() : `${year}-01-01T00:00:00.000Z`,
      };
    }
  }

  return null;
}

export function buildTimeline(results = []) {
  return results
    .map((result) => {
      const point = extractTimelinePoint(result);
      if (!point) return null;
      return {
        label: point.label,
        year: point.year,
        sortKey: point.sortKey,
        title: result.title || result.url || 'Untitled result',
        url: result.url || '',
        source: result.source || '',
        reliability: result.meta?.reliability || 'unknown',
      };
    })
    .filter(Boolean)
    .sort((left, right) => right.sortKey.localeCompare(left.sortKey));
}

export function buildRelatedQueries(input, results = [], limit = 8) {
  const plan = buildQueryPlan(input);
  const domains = unique(results.map((result) => safeHostname(result.url || '')).filter(Boolean)).slice(0, 2);
  const usernames = unique(results.map((result) => result.meta?.username).filter(Boolean)).slice(0, 2);
  const orgs = unique(results.flatMap((result) => result.meta?.entities?.orgs || [])).slice(0, 2);
  const regions = unique(results.map((result) => result.meta?.region).filter(Boolean)).slice(0, 1);
  const language = unique(results.map((result) => result.meta?.language).filter((code) => code && code !== 'unknown' && code !== 'en')).slice(0, 1);

  return uniqueCaseInsensitive([
    plan.raw ? `intitle:"${plan.raw}"` : null,
    plan.raw ? `filetype:pdf "${plan.raw}"` : null,
    ...domains.map((domain) => plan.raw ? `site:${domain} "${plan.raw}"` : null),
    ...usernames.map((username) => `"${username}" profile`),
    ...usernames.map((username) => `site:github.com ${username}`),
    ...orgs.map((org) => plan.raw ? `"${org}" "${plan.raw}"` : `"${org}"`),
    ...regions.map((region) => plan.raw ? `${plan.raw} region:${region}` : `region:${region}`),
    ...language.map((code) => plan.raw ? `${plan.raw} lang:${code}` : `lang:${code}`),
  ]).slice(0, limit);
}

export function buildResultInsights(result = {}, input = '') {
  const text = `${result.title || ''} ${result.snippet || ''}`.trim();
  const plan = buildQueryPlan(input);
  const entities = extractEntities(text);
  const language = plan.operators.lang || detectLanguage(text);
  const reliability = inferReliability(result, input);
  const region = inferRegion(result, input);
  const timeline = extractTimelinePoint(result);

  return {
    entities,
    language,
    languageLabel: normaliseLanguageLabel(language),
    translationUrl: buildTranslationUrl(result.url, language),
    reliability,
    region,
    timeline,
  };
}
