export const IDENTITY_PATTERNS = [
  { re: /(?:twitter|x)\.com/i, category: 'social', username: /(?:twitter|x)\.com\/([A-Za-z0-9_]{1,40})\/?$/i },
  { re: /facebook\.com/i, category: 'social', username: /facebook\.com\/([A-Za-z0-9.]{1,80})\/?$/i },
  { re: /instagram\.com/i, category: 'social', username: /instagram\.com\/([A-Za-z0-9_.]{1,40})\/?$/i },
  { re: /linkedin\.com\/in\//i, category: 'social', username: /linkedin\.com\/in\/([A-Za-z0-9_-]{1,80})\/?$/i },
  { re: /reddit\.com\/user\//i, category: 'social', username: /reddit\.com\/user\/([A-Za-z0-9_-]{1,40})\/?$/i },
  { re: /mastodon\.|mstdn\./i, category: 'social' },
  { re: /tiktok\.com\/@/i, category: 'social', username: /tiktok\.com\/@([A-Za-z0-9_.]{1,40})/i },
  { re: /youtube\.com/i, category: 'social' },
  { re: /discord\.com|discord\.gg/i, category: 'social' },
  { re: /telegram\.org|t\.me\//i, category: 'social' },
  { re: /threads\.net/i, category: 'social' },
  { re: /pinterest\.com/i, category: 'social', username: /pinterest\.com\/([A-Za-z0-9_]{1,40})\/?$/i },
  { re: /tumblr\.com/i, category: 'social', username: /tumblr\.com\/([A-Za-z0-9_-]{1,40})\/?$/i },
  { re: /medium\.com\/@/i, category: 'social', username: /medium\.com\/@([A-Za-z0-9_-]{1,60})/i },

  { re: /github\.com/i, category: 'tech', username: /github\.com\/([A-Za-z0-9_-]{1,40})\/?$/i },
  { re: /gitlab\.com/i, category: 'tech', username: /gitlab\.com\/([A-Za-z0-9_.-]{1,40})\/?$/i },
  { re: /bitbucket\.org/i, category: 'tech', username: /bitbucket\.org\/([A-Za-z0-9_-]{1,40})\/?$/i },
  { re: /stackoverflow\.com\/users\//i, category: 'tech', username: /users\/\d+\/([A-Za-z0-9_-]+)/i },
  { re: /npmjs\.com/i, category: 'tech' },
  { re: /pypi\.org/i, category: 'tech' },
  { re: /hub\.docker\.com/i, category: 'tech' },
  { re: /codepen\.io/i, category: 'tech', username: /codepen\.io\/([A-Za-z0-9_-]{1,40})\/?$/i },
  { re: /dev\.to/i, category: 'tech', username: /dev\.to\/([A-Za-z0-9_-]{1,40})\/?$/i },
  { re: /keybase\.io/i, category: 'tech', username: /keybase\.io\/([A-Za-z0-9_]{1,40})\/?$/i },
  { re: /hackernews|news\.ycombinator/i, category: 'tech' },

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

  { re: /\.gov(\/|$|\.\w{2}$)/i, category: 'gov' },
  { re: /\.mil(\/|$)/i, category: 'gov' },

  { re: /bbc\.co\.uk|bbc\.com/i, category: 'news' },
  { re: /reuters\.com/i, category: 'news' },
  { re: /nytimes\.com/i, category: 'news' },
  { re: /theguardian\.com/i, category: 'news' },
  { re: /cnn\.com/i, category: 'news' },
  { re: /washingtonpost\.com/i, category: 'news' },
  { re: /aljazeera\.com/i, category: 'news' },

  { re: /archive\.org|web\.archive\.org/i, category: 'archive' },
];

export const USERNAME_PATTERNS = IDENTITY_PATTERNS
  .map((pattern) => pattern.username)
  .filter(Boolean);

export function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

export function classifyUrl(url) {
  if (!url) return { category: null, username: null };

  for (const pattern of IDENTITY_PATTERNS) {
    if (!pattern.re.test(url)) continue;

    const username = pattern.username
      ? url.match(pattern.username)?.[1] || null
      : null;

    return { category: pattern.category, username };
  }

  return { category: null, username: null };
}

export function extractUsernameFromUrl(url) {
  if (!url) return null;

  const domain = extractDomain(url);
  if (!domain) return null;

  const { username } = classifyUrl(url);
  if (!username) return null;

  return { username: username.toLowerCase(), domain };
}
