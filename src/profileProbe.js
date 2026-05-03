import httpClient from './httpClient.js';
import { buildQueryPlan, uniqueCaseInsensitive } from './queryPlanner.js';

const PROFILE_TARGETS = [
  { source: 'github-direct', buildUrl: (handle) => `https://github.com/${handle}`, tags: ['profile', 'direct-probe', 'tech'] },
  { source: 'gitlab-direct', buildUrl: (handle) => `https://gitlab.com/${handle}`, tags: ['profile', 'direct-probe', 'tech'] },
  { source: 'codeberg-direct', buildUrl: (handle) => `https://codeberg.org/${handle}`, tags: ['profile', 'direct-probe', 'tech'] },
  { source: 'keybase-direct', buildUrl: (handle) => `https://keybase.io/${handle}`, tags: ['profile', 'direct-probe', 'tech'] },
  { source: 'reddit-direct', buildUrl: (handle) => `https://www.reddit.com/user/${handle}`, tags: ['profile', 'direct-probe', 'social'] },
  { source: 'hn-direct', buildUrl: (handle) => `https://news.ycombinator.com/user?id=${encodeURIComponent(handle)}`, tags: ['profile', 'direct-probe', 'forum'] },
  { source: 'devto-direct', buildUrl: (handle) => `https://dev.to/${handle}`, tags: ['profile', 'direct-probe', 'tech'] },
];

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
  const body = String(response.data || '').slice(0, 600).toLowerCase();
  return /not found|page not found|doesn.?t exist|404/u.test(body);
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

  return {
    title: `${handle} on ${target.source.replace(/-direct$/u, '')}`,
    url,
    source: target.source,
    rank: 1,
    snippet: `Direct profile probe matched ${handle}`,
    meta: {
      username: handle,
      tags: target.tags,
      platform: target.source.replace(/-direct$/u, ''),
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
