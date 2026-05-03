import httpClient from './httpClient.js';
import { buildQueryPlan, uniqueCaseInsensitive } from './queryPlanner.js';

const PROFILE_TARGETS = [
  { source: 'github-direct', buildUrl: (handle) => `https://github.com/${encodeURIComponent(handle)}`, tags: ['profile', 'direct-probe', 'tech'] },
  { source: 'gitlab-direct', buildUrl: (handle) => `https://gitlab.com/${encodeURIComponent(handle)}`, tags: ['profile', 'direct-probe', 'tech'] },
  { source: 'codeberg-direct', buildUrl: (handle) => `https://codeberg.org/${encodeURIComponent(handle)}`, tags: ['profile', 'direct-probe', 'tech'] },
  { source: 'keybase-direct', buildUrl: (handle) => `https://keybase.io/${encodeURIComponent(handle)}`, tags: ['profile', 'direct-probe', 'tech'] },
  { source: 'reddit-direct', buildUrl: (handle) => `https://www.reddit.com/user/${encodeURIComponent(handle)}`, tags: ['profile', 'direct-probe', 'social'] },
  { source: 'hn-direct', buildUrl: (handle) => `https://news.ycombinator.com/user?id=${encodeURIComponent(handle)}`, tags: ['profile', 'direct-probe', 'forum'] },
  { source: 'devto-direct', buildUrl: (handle) => `https://dev.to/${encodeURIComponent(handle)}`, tags: ['profile', 'direct-probe', 'tech'] },
];
const MAX_ERROR_CHECK_LENGTH = 600;
const MAX_INSPECTION_LINKS = 4;

function normaliseHandleCandidate(value) {
  const candidate = String(value || '')
    .trim()
    .replace(/^@+/u, '')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/gu, '');
  if (!candidate || candidate.length < 2 || candidate.length > 39) return null;
  return /^[a-z0-9._-]+$/u.test(candidate) ? candidate : null;
}

export function buildProfileProbeHandles(input) {
  const plan = buildQueryPlan(input);
  const baseHandle = normaliseHandleCandidate(plan.localPart);
  const localPartTokens = String(plan.localPart || '').split(/[._-]+/u).filter(Boolean);
  return uniqueCaseInsensitive([
    baseHandle,
    normaliseHandleCandidate(localPartTokens.join('')),
    normaliseHandleCandidate(localPartTokens.join('_')),
    normaliseHandleCandidate(localPartTokens.join('-')),
    normaliseHandleCandidate(plan.noSpaces),
    normaliseHandleCandidate(plan.underscored),
    normaliseHandleCandidate(plan.hyphenated),
  ]).slice(0, 3);
}

function looksMissing(response) {
  const body = String(response.data || '').slice(0, MAX_ERROR_CHECK_LENGTH).toLowerCase();
  return /not found|page not found|doesn.?t exist|404/u.test(body);
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/gu, '&')
    .replace(/&lt;/gu, '<')
    .replace(/&gt;/gu, '>')
    .replace(/&quot;/gu, '"')
    .replace(/&#39;/gu, "'");
}

function inspectProfilePage(html, handle, baseUrl) {
  const body = String(html || '');
  const title = decodeHtml(body.match(/<title[^>]*>([^<]*)<\/title>/iu)?.[1] || '').trim();
  const emails = [...new Set((body.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/giu) || []).map((email) => email.toLowerCase()))].slice(0, 3);
  const outboundLinks = [...new Set(Array.from(
    body.matchAll(/href=["'](https?:\/\/[^"']+)["']/giu),
    (match) => {
      try {
        return new URL(match[1], baseUrl).toString();
      } catch {
        return '';
      }
    }
  ).filter(Boolean))].slice(0, MAX_INSPECTION_LINKS);
  const usernames = [...new Set([
    handle,
    ...Array.from(body.matchAll(/@([a-z0-9._-]{2,39})/giu), (match) => match[1].toLowerCase()),
  ].filter(Boolean))].slice(0, 4);
  return {
    title: title || null,
    emails,
    outboundLinks,
    usernames,
  };
}

async function probeTarget(target, handle, signal) {
  const url = target.buildUrl(handle);
  const response = await httpClient.get(url, {
    signal,
    timeout: 5000,
    maxRedirects: 5,
    responseType: 'text',
    validateStatus: () => true,
  });

  if (response.status < 200 || response.status >= 300 || looksMissing(response)) {
    return null;
  }

  const pageInspection = inspectProfilePage(response.data, handle, url);

  return {
    title: pageInspection.title || `${handle} on ${target.source.replace(/-direct$/u, '')}`,
    url,
    source: target.source,
    rank: 1,
    snippet: pageInspection.emails.length || pageInspection.outboundLinks.length
      ? `Direct probe matched ${handle} · ${pageInspection.emails.length} emails · ${pageInspection.outboundLinks.length} outbound links`
      : `Direct profile probe matched ${handle}`,
    meta: {
      username: handle,
      tags: target.tags,
      platform: target.source.replace(/-direct$/u, ''),
      pageInspection,
    },
  };
}

export async function search(input, _apiKeys, { signal } = {}) {
  const handles = buildProfileProbeHandles(input);
  if (!handles.length) return [];

  const settled = await Promise.allSettled(
    handles.flatMap((handle) => PROFILE_TARGETS.map((target) => probeTarget(target, handle, signal)))
  );

  return settled
    .filter((entry) => entry.status === 'fulfilled' && entry.value)
    .map((entry) => entry.value);
}
