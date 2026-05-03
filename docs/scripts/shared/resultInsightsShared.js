import { buildQueryPlan, generateScentVariants, uniqueCaseInsensitive } from './queryShared.js';

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
const ECHO_STOPWORDS = new Set([
  'a', 'an', 'and', 'article', 'claim', 'coverage', 'for', 'from', 'in', 'is', 'news', 'of', 'on',
  'report', 'reported', 'reporting', 'says', 'story', 'that', 'the', 'to', 'update', 'via', 'with',
]);
const RELIABLE_BUCKETS = new Set(['official', 'media']);
const LOW_QUALITY_BUCKETS = new Set(['forum', 'unknown']);
const MAX_ECHO_TOKENS = 8;
const MAX_TITLE_TOKENS = 7;
const MAX_SNIPPET_TOKENS = 5;
const ARTIFACT_MATCHERS = [
  { type: 'pdf', re: /\.pdf(?:$|[?#])/iu },
  { type: 'document', re: /\.(docx?|pptx?|xlsx?|txt)(?:$|[?#])/iu },
  { type: 'image', re: /\.(png|jpe?g|gif|webp|svg)(?:$|[?#])/iu },
  { type: 'rss', re: /\b(rss|atom|feed)\b|\/feed(?:$|[/?#])|\.xml(?:$|[?#])/iu },
  { type: 'robots', re: /\brobots\.txt\b/iu },
  { type: 'sitemap', re: /\bsitemap(?:[_-]index)?\.xml\b/iu },
  { type: 'redirect', re: /\bredirect\b|utm_|[?&](target|dest|url)=/iu },
  { type: 'favicon', re: /\bfavicon(?:\.ico)?\b/iu },
  { type: 'css', re: /\.css(?:$|[?#])|\bcss class\b/iu },
  { type: 'commit', re: /\bcommit\b|\b[a-f0-9]{7,40}\b/iu },
  { type: 'slug', re: /\bslug\b|\/[\w-]{6,}\/?$/iu },
  { type: 'metadata', re: /\b(metadata|byline|title tag|canonical)\b/iu },
  { type: 'exif', re: /\bexif\b/iu },
];

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function truncateLabel(value, max = 72) {
  const text = String(value || '').trim();
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max)}…`;
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

function normaliseFingerprintTokens(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/https?:\/\/\S+/gu, ' ')
    .replace(/[^a-z0-9]+/gu, ' ')
    .trim()
    .split(/\s+/u)
    .filter((token) => token && token.length > 2 && !ECHO_STOPWORDS.has(token));
}

function buildEchoFingerprint(result = {}) {
  const username = String(result.meta?.username || '').toLowerCase().trim();
  if (username) return `handle:${username}`;

  const hostname = safeHostname(result.url || '');
  const titleTokens = normaliseFingerprintTokens(result.title).slice(0, MAX_TITLE_TOKENS);
  const snippetTokens = normaliseFingerprintTokens(result.snippet).slice(0, MAX_SNIPPET_TOKENS);
  const mergedTokens = unique([...titleTokens, ...snippetTokens]).slice(0, MAX_ECHO_TOKENS);

  if (titleTokens.length >= 3) return `title:${titleTokens.join(' ')}`;
  if (mergedTokens.length >= 3) return `echo:${mergedTokens.join(' ')}`;
  if (titleTokens.length) return `title:${titleTokens.join(' ')}`;
  if (hostname) return `host:${hostname}`;
  return `source:${String(result.source || 'unknown').toLowerCase()}`;
}

function summariseTrace(result = {}) {
  const timeline = extractTimelinePoint(result);
  const hostname = safeHostname(result.url || '');
  const lane = classifyCommunityLane(result);
  return {
    title: result.title || result.url || 'Untitled result',
    url: result.url || '',
    source: result.source || '',
    hostname,
    reliability: result.meta?.reliability || 'unknown',
    sourceFamily: result.meta?.sourceFamily || hostname || result.source || 'unknown',
    dateLabel: timeline?.label || null,
    sortKey: timeline?.sortKey || null,
    lane,
  };
}

function compareEarliest(left = {}, right = {}) {
  if (left.sortKey && right.sortKey) return left.sortKey.localeCompare(right.sortKey);
  if (left.sortKey) return -1;
  if (right.sortKey) return 1;
  return (right.score || 0) - (left.score || 0);
}

function isReliableTrace(trace = {}) {
  return RELIABLE_BUCKETS.has(trace.reliability) || trace.sourceFamily === 'academic';
}

function isLowQualityTrace(trace = {}) {
  return LOW_QUALITY_BUCKETS.has(trace.reliability)
    || trace.sourceFamily === 'social'
    || trace.sourceFamily === 'broker-directory';
}

function classifyCommunityLane(result = {}) {
  const family = result.meta?.sourceFamily || '';
  const hostname = safeHostname(result.url || '');
  if (family === 'forum' || /forum|board|thread/u.test(hostname)) return 'forum';
  if (/t\.me$|telegram/u.test(hostname)) return 'telegram';
  if (/youtube\.com$|youtu\.be$/u.test(hostname)) return 'youtube';
  if (family === 'media' || /\.news$|blog/u.test(hostname)) return hostname.includes('blog') ? 'blog' : 'media';
  if (family === 'archive') return 'archive';
  if (family === 'academic' || family === 'official') return 'records';
  if (family === 'social') return 'social';
  if (family === 'code-hosting') return 'code';
  if (family === 'package-ecosystem') return 'package';
  return 'open-web';
}

function detectArtifactMatches(result = {}) {
  const haystack = `${result.title || ''} ${result.snippet || ''} ${result.url || ''}`;
  return unique(ARTIFACT_MATCHERS.filter(({ re }) => re.test(haystack)).map(({ type }) => type));
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

export function buildSourceFamilyTree(results = []) {
  const groups = new Map();

  results.forEach((result) => {
    const key = buildEchoFingerprint(result);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(result);
  });

  return [...groups.entries()]
    .map(([fingerprint, members], index) => {
      const traces = members.map(summariseTrace).sort(compareEarliest);
      const ancestor = traces[0];
      const hostnames = unique(traces.map((trace) => trace.hostname));
      const reliableCount = traces.filter(isReliableTrace).length;
      const lowQualityCount = traces.filter(isLowQualityTrace).length;

      return {
        id: `echo-family-${index + 1}`,
        fingerprint,
        label: truncateLabel(ancestor.title || ancestor.hostname || ancestor.source),
        ancestor,
        members: traces,
        size: traces.length,
        echoCount: Math.max(traces.length - 1, 0),
        hostnames,
        reliableCount,
        lowQualityCount,
      };
    })
    .sort((left, right) => (
      right.size - left.size
      || compareEarliest(left.ancestor, right.ancestor)
      || left.label.localeCompare(right.label)
    ));
}

export function findFirstBlood(results = []) {
  const familyTree = buildSourceFamilyTree(results);
  const datedAncestors = familyTree
    .map((family) => ({ ...family.ancestor, echoCount: family.echoCount, familySize: family.size }))
    .filter((trace) => trace.sortKey);

  if (datedAncestors.length) {
    return datedAncestors.sort(compareEarliest)[0];
  }

  const fallback = summariseTrace(results[0] || {});
  return fallback.url || fallback.title ? { ...fallback, familySize: 1, echoCount: 0 } : null;
}

export function buildConsensusFractureMap(results = []) {
  const familyTree = buildSourceFamilyTree(results);
  const agreement = familyTree
    .filter((family) => family.reliableCount > 0 && family.size > 1)
    .slice(0, 3);
  const dominantReliable = familyTree.find((family) => family.reliableCount > 0) || null;
  const divergence = familyTree
    .filter((family) => family.reliableCount > 0 && family.fingerprint !== dominantReliable?.fingerprint)
    .slice(0, 3);
  const amplification = familyTree
    .filter((family) => family.lowQualityCount >= 1 && family.size > family.reliableCount)
    .slice(0, 3);

  return {
    agreement,
    divergence,
    amplification,
    stats: {
      families: familyTree.length,
      reliableFamilies: familyTree.filter((family) => family.reliableCount > 0).length,
      lowQualityFamilies: familyTree.filter((family) => family.lowQualityCount > 0).length,
    },
  };
}

export function buildArtifactSearchProfile(input = '', results = []) {
  const plan = buildQueryPlan(input);
  const scentVariants = generateScentVariants(plan).slice(0, 8);
  const artifactHits = results
    .map((result) => ({
      title: result.title || result.url || 'Untitled result',
      url: result.url || '',
      source: result.source || '',
      types: detectArtifactMatches(result),
      archived: Boolean(result.meta?.tags?.includes('fossil') || result.meta?.pageStatus === 'archived' || result.meta?.sourceFamily === 'archive'),
      hidden: Boolean(result.meta?.tags?.includes('document') || result.meta?.tags?.includes('archive-lane') || result.meta?.whySurvived),
    }))
    .filter((result) => result.types.length || result.archived || result.hidden);

  const artifactCounts = new Map();
  artifactHits.forEach((result) => {
    result.types.forEach((type) => artifactCounts.set(type, (artifactCounts.get(type) || 0) + 1));
  });

  return {
    intent: plan.intent,
    scentVariants,
    artifactHits: artifactHits.slice(0, 6),
    dominantArtifacts: [...artifactCounts.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .slice(0, 5)
      .map(([type, count]) => ({ type, count })),
    fossilCount: artifactHits.filter((result) => result.archived).length,
    hiddenCount: artifactHits.filter((result) => result.hidden).length,
  };
}

export function buildContagionMap(results = []) {
  return buildSourceFamilyTree(results)
    .filter((family) => family.size > 1)
    .slice(0, 5)
    .map((family) => {
      const lanes = unique(family.members.map((member) => member.lane));
      return {
        label: family.label,
        route: lanes.join(' → '),
        familySize: family.size,
        echoCount: family.echoCount,
        lowQualityCount: family.lowQualityCount,
        reliableCount: family.reliableCount,
      };
    });
}

export function buildCloneSludgeReport(results = []) {
  const families = buildSourceFamilyTree(results);
  const clones = families.filter((family) => family.echoCount > 0);
  const repeatedResults = clones.reduce((total, family) => total + family.echoCount, 0);
  return {
    cloneFamilies: clones.length,
    repeatedResults,
    largestFamilies: clones.slice(0, 3).map((family) => ({
      label: family.label,
      echoCount: family.echoCount,
      size: family.size,
    })),
  };
}

export function buildRelatedQueries(input, results = [], limit = 8) {
  const plan = buildQueryPlan(input);
  const domains = unique(results.map((result) => safeHostname(result.url || '')).filter(Boolean)).slice(0, 2);
  const usernames = unique(results.map((result) => result.meta?.username).filter(Boolean)).slice(0, 2);
  const orgs = unique(results.flatMap((result) => result.meta?.entities?.orgs || [])).slice(0, 2);
  const regions = unique(results.map((result) => result.meta?.region).filter(Boolean)).slice(0, 1);
  const language = unique(results.map((result) => result.meta?.language).filter((code) => code && code !== 'unknown' && code !== 'en')).slice(0, 1);
  const scentVariants = generateScentVariants(plan).filter((value) => value && value !== plan.raw).slice(0, 2);

  return uniqueCaseInsensitive([
    plan.raw ? `intitle:"${plan.raw}"` : null,
    plan.raw ? `filetype:pdf "${plan.raw}"` : null,
    plan.intent === 'artifact' && plan.raw ? `"${plan.raw}" "favicon.ico"` : null,
    plan.intent === 'artifact' && plan.raw ? `"${plan.raw}" "robots.txt"` : null,
    plan.intent === 'artifact' && plan.raw ? `"${plan.raw}" rss` : null,
    ...domains.map((domain) => plan.raw ? `site:${domain} "${plan.raw}"` : null),
    ...usernames.map((username) => `"${username}" profile`),
    ...orgs.map((org) => plan.raw ? `"${org}" "${plan.raw}"` : `"${org}"`),
    ...usernames.map((username) => `site:github.com ${username}`),
    ...scentVariants.map((value) => plan.intent === 'artifact' ? `"${value}"` : `${value} profile`),
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
    artifactTypes: detectArtifactMatches(result),
    entities,
    language,
    languageLabel: normaliseLanguageLabel(language),
    translationUrl: buildTranslationUrl(result.url, language),
    reliability,
    region,
    timeline,
  };
}
