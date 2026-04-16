import axios from 'axios';
import crypto from 'crypto';

// Known avatar URL patterns detectable from a plain URL or snippet string.
const AVATAR_REGEXES = [
  /https?:\/\/avatars\.githubusercontent\.com\/[^\s"'<>]+/,
  /https?:\/\/pbs\.twimg\.com\/profile_images\/[^\s"'<>]+/,
  /https?:\/\/[^\s"'<>]+\/avatar\/[^\s"'<>]+\.(?:jpe?g|png|gif|webp)/i,
  /https?:\/\/[^\s"'<>]+\/profile[-_]?(?:image|photo|pic|img)[^\s"'<>]*\.(?:jpe?g|png|gif|webp)/i,
];

// Platforms where we can cheaply derive an avatar URL from a profile URL.
const PROFILE_TO_AVATAR = [
  {
    pattern: /^https?:\/\/github\.com\/([^/?#\s]+)\/?$/,
    avatarFn: (m) => `https://github.com/${m[1]}.png?size=200`,
  },
];

function extractAvatarUrl(result) {
  // 1. Result URL is itself an avatar
  for (const re of AVATAR_REGEXES) {
    if (re.test(result.url || '')) return result.url;
  }
  // 2. Derive from profile URL
  for (const { pattern, avatarFn } of PROFILE_TO_AVATAR) {
    const m = (result.url || '').match(pattern);
    if (m) return avatarFn(m);
  }
  // 3. Avatar URL embedded in snippet
  for (const re of AVATAR_REGEXES) {
    const m = (result.snippet || '').match(re);
    if (m) return m[0];
  }
  return null;
}

async function fetchHash(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 8000,
      headers: { 'User-Agent': 'Tracer/1.0' },
      maxRedirects: 3,
    });
    return crypto
      .createHash('md5')
      .update(Buffer.from(response.data))
      .digest('hex');
  } catch (err) {
    console.error('[avatarHunter]', err.message);
    return null;
  }
}

/**
 * Hunts avatar recurrences across a result set.
 * Returns an array of clusters: each cluster is { avatarHash, urls } where
 * urls is the list of result URLs that share the same avatar image bytes.
 * Only clusters with two or more distinct result URLs are returned.
 */
export async function hunt(results) {
  // Map resultUrl -> avatarUrl
  const resultAvatarMap = new Map();
  const avatarUrls = new Set();

  for (const result of results) {
    const avatarUrl = extractAvatarUrl(result);
    if (avatarUrl && result.url) {
      resultAvatarMap.set(result.url, avatarUrl);
      avatarUrls.add(avatarUrl);
    }
  }

  if (avatarUrls.size === 0) return [];

  // Download and hash each unique avatar URL
  const hashMap = new Map(); // avatarUrl -> md5 hash
  await Promise.all(
    [...avatarUrls].map(async (url) => {
      const hash = await fetchHash(url);
      if (hash) hashMap.set(url, hash);
    })
  );

  // Group result URLs by avatar hash
  const clusters = new Map(); // hash -> Set<resultUrl>
  for (const [resultUrl, avatarUrl] of resultAvatarMap) {
    const hash = hashMap.get(avatarUrl);
    if (!hash) continue;
    if (!clusters.has(hash)) clusters.set(hash, new Set());
    clusters.get(hash).add(resultUrl);
  }

  // Return only clusters where the same image appears for multiple results
  return [...clusters.entries()]
    .filter(([, urlSet]) => urlSet.size > 1)
    .map(([hash, urlSet]) => ({ avatarHash: hash, urls: [...urlSet] }));
}

