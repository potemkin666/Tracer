/**
 * Result enrichment — adds structured metadata to raw results:
 *   - Platform detection (social, academic, gov, tech, news)
 *   - Username extraction from well-known URL patterns
 *   - Domain classification
 *
 * Runs client-side (no network calls), applied between dedupe and scoring.
 */

// ── Platform definitions ─────────────────────────────────────────────────────
// Each entry: { domain regex, category, username-extracting regex (optional) }
const PLATFORMS = [
  // Social
  { re: /(?:twitter|x)\.com/i, category: 'social', user: /(?:twitter|x)\.com\/([A-Za-z0-9_]{1,40})\/?$/i },
  { re: /facebook\.com/i, category: 'social', user: /facebook\.com\/([A-Za-z0-9.]{1,80})\/?$/i },
  { re: /instagram\.com/i, category: 'social', user: /instagram\.com\/([A-Za-z0-9_.]{1,40})\/?$/i },
  { re: /linkedin\.com\/in\//i, category: 'social', user: /linkedin\.com\/in\/([A-Za-z0-9_-]{1,80})\/?$/i },
  { re: /reddit\.com\/user\//i, category: 'social', user: /reddit\.com\/user\/([A-Za-z0-9_-]{1,40})\/?$/i },
  { re: /mastodon\.|mstdn\./i, category: 'social' },
  { re: /tiktok\.com\/@/i, category: 'social', user: /tiktok\.com\/@([A-Za-z0-9_.]{1,40})/i },
  { re: /youtube\.com/i, category: 'social' },
  { re: /discord\.com|discord\.gg/i, category: 'social' },
  { re: /telegram\.org|t\.me\//i, category: 'social' },
  { re: /threads\.net/i, category: 'social' },
  { re: /pinterest\.com/i, category: 'social' },
  { re: /tumblr\.com/i, category: 'social' },
  { re: /medium\.com\/@/i, category: 'social', user: /medium\.com\/@([A-Za-z0-9_-]{1,60})/i },

  // Tech / developer
  { re: /github\.com/i, category: 'tech', user: /github\.com\/([A-Za-z0-9_-]{1,40})\/?$/i },
  { re: /gitlab\.com/i, category: 'tech', user: /gitlab\.com\/([A-Za-z0-9_.-]{1,40})\/?$/i },
  { re: /bitbucket\.org/i, category: 'tech', user: /bitbucket\.org\/([A-Za-z0-9_-]{1,40})\/?$/i },
  { re: /stackoverflow\.com\/users\//i, category: 'tech', user: /users\/\d+\/([A-Za-z0-9_-]+)/i },
  { re: /npmjs\.com/i, category: 'tech' },
  { re: /pypi\.org/i, category: 'tech' },
  { re: /hub\.docker\.com/i, category: 'tech' },
  { re: /codepen\.io/i, category: 'tech' },
  { re: /dev\.to/i, category: 'tech' },
  { re: /hackernews|news\.ycombinator/i, category: 'tech' },

  // Academic / research
  { re: /scholar\.google/i, category: 'academic' },
  { re: /researchgate\.net/i, category: 'academic' },
  { re: /orcid\.org/i, category: 'academic' },
  { re: /arxiv\.org/i, category: 'academic' },
  { re: /pubmed\.ncbi/i, category: 'academic' },
  { re: /semanticscholar\.org/i, category: 'academic' },
  { re: /\.edu(\/|$)/i, category: 'academic' },
  { re: /jstor\.org/i, category: 'academic' },
  { re: /openalex\.org/i, category: 'academic' },
  { re: /crossref\.org/i, category: 'academic' },

  // Government
  { re: /\.gov(\/|$|\.\w{2}$)/i, category: 'gov' },
  { re: /\.mil(\/|$)/i, category: 'gov' },

  // News / media
  { re: /bbc\.co\.uk|bbc\.com/i, category: 'news' },
  { re: /reuters\.com/i, category: 'news' },
  { re: /nytimes\.com/i, category: 'news' },
  { re: /theguardian\.com/i, category: 'news' },
  { re: /cnn\.com/i, category: 'news' },
  { re: /washingtonpost\.com/i, category: 'news' },
  { re: /aljazeera\.com/i, category: 'news' },

  // Archive
  { re: /archive\.org|web\.archive\.org/i, category: 'archive' },
];

/**
 * Classify a URL's platform and optionally extract a username.
 *
 * @param {string} url
 * @returns {{ category: string|null, username: string|null }}
 */
export function classifyUrl(url) {
  if (!url) return { category: null, username: null };
  for (const p of PLATFORMS) {
    if (p.re.test(url)) {
      let username = null;
      if (p.user) {
        const m = url.match(p.user);
        if (m) username = m[1];
      }
      return { category: p.category, username };
    }
  }
  return { category: null, username: null };
}

/**
 * Enrich an array of deduplicated results with platform metadata.
 *
 * Adds to each result's `meta`:
 *   - `domainCategory`: 'social' | 'tech' | 'academic' | 'gov' | 'news' | 'archive' | null
 *   - `username`: extracted username string or null
 *   - `tags`: appends 'social', 'profile', etc. when detected
 *
 * @param {object[]} results - deduplicated results
 * @param {string} input - original search term
 * @returns {object[]} results with enriched meta (mutated in place for speed)
 */
export function enrich(results, input) {
  const inputLower = (input || '').toLowerCase();
  const slug = inputLower.replace(/\s+/g, '');

  for (const r of results) {
    if (!r.meta || typeof r.meta !== 'object') r.meta = {};
    if (!Array.isArray(r.meta.tags)) r.meta.tags = [];

    const { category, username } = classifyUrl(r.url);

    if (category) {
      r.meta.domainCategory = category;

      if (category === 'social' && !r.meta.tags.includes('social')) {
        r.meta.tags.push('social');
      }
      if (category === 'academic' && !r.meta.tags.includes('academic')) {
        r.meta.tags.push('academic');
      }
      if (category === 'gov' && !r.meta.tags.includes('gov')) {
        r.meta.tags.push('gov');
      }
    }

    if (username) {
      r.meta.username = username;
      // If username matches the search term, this is likely a profile page
      if (
        username.toLowerCase() === slug ||
        username.toLowerCase() === inputLower
      ) {
        if (!r.meta.tags.includes('profile')) {
          r.meta.tags.push('profile');
        }
      }
    }
  }

  return results;
}
