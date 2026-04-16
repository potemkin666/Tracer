import axios from 'axios';
import { normalise } from './normaliser.js';

// Profile-like paths that often preserve old bios, contact info, and usernames.
const LEGACY_PATHS = ['/about', '/bio', '/contact', '/profile', '/user', '/me', '/whois'];

function extractProfileUrls(results) {
  const seen = new Set();
  const urls = [];
  for (const r of results) {
    const url = r.url || '';
    if (url && !seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  }
  return urls;
}

function deriveLegacyUrls(input) {
  const username = input.replace(/\s+/g, '').toLowerCase();
  const urls = [];
  for (const path of LEGACY_PATHS) {
    urls.push(`*${username}${path}*`);
    urls.push(`*${path}/${username}*`);
  }
  // Old domain registration / WHOIS pages archived on Wayback
  urls.push(`*whois*${username}*`);
  return urls;
}

async function fetchOldCaptures(urlPattern, input) {
  try {
    const response = await axios.get('https://web.archive.org/cdx/search/cdx', {
      params: {
        url: urlPattern,
        output: 'json',
        fl: 'original,timestamp,statuscode',
        filter: 'statuscode:200',
        from: '20040101',
        to: '20181231',
        limit: 5,
        collapse: 'urlkey',
      },
      timeout: 10000,
    });

    const rows = response.data;
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const headers = rows[0];
    const originalIdx = headers.indexOf('original');
    const timestampIdx = headers.indexOf('timestamp');

    return rows.slice(1).map((row, i) => {
      const url = row[originalIdx] || '';
      const timestamp = row[timestampIdx] || '';
      const year = timestamp.slice(0, 4);
      return normalise('fossil', input, {
        title: `[Fossil ~${year}] ${url}`,
        url: `https://web.archive.org/web/${timestamp}/${url}`,
        snippet: `Old capture from ${year} — may contain legacy username, bio, or contact info`,
        rank: i + 1,
        meta: { era: parseInt(year, 10), tags: ['fossil'] },
      });
    });
  } catch (err) { console.error('[fossilHunter]', err.message); return []; }
}

export async function hunt(input, results) {
  const profileUrls = extractProfileUrls(results);
  const legacyUrlPatterns = deriveLegacyUrls(input);

  // Fetch old captures for the top profile URLs found in the main pipeline
  const profileFetches = profileUrls
    .slice(0, 6)
    .map((url) => fetchOldCaptures(url, input));

  // Fetch old captures for legacy path patterns derived from the input
  const legacyFetches = legacyUrlPatterns
    .slice(0, 6)
    .map((pattern) => fetchOldCaptures(pattern, input));

  const batches = await Promise.all([...profileFetches, ...legacyFetches]);
  return batches.flat();
}

