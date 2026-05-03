import httpClient from './httpClient.js';

function safeUrl(value) {
  try {
    const parsed = new URL(String(value || ''));
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === 'localhost'
      || hostname === '127.0.0.1'
      || hostname === '::1'
      || /^10\./u.test(hostname)
      || /^192\.168\./u.test(hostname)
      || /^172\.(1[6-9]|2\d|3[0-1])\./u.test(hostname)
      || /^169\.254\./u.test(hostname)
      || /^fc|^fd|^fe80/iu.test(hostname)
    ) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

export async function lookupArchiveSnapshot(url, { signal } = {}) {
  const target = safeUrl(url);
  if (!target) {
    return { url: '', archiveUrl: null, archiveTimestamp: null, pageStatus: 'invalid' };
  }

  const [archiveResponse, headResponse] = await Promise.allSettled([
    httpClient.get('https://archive.org/wayback/available', {
      params: { url: target },
      timeout: 8000,
      signal,
    }),
    httpClient.request({
      url: target,
      method: 'HEAD',
      timeout: 5000,
      validateStatus: () => true,
      maxRedirects: 5,
      signal,
    }),
  ]);

  const closest = archiveResponse.status === 'fulfilled'
    ? archiveResponse.value?.data?.archived_snapshots?.closest || null
    : null;
  const status = headResponse.status === 'fulfilled'
    ? headResponse.value?.status || 0
    : 0;

  return {
    url: target,
    archiveUrl: closest?.available ? closest.url : null,
    archiveTimestamp: closest?.timestamp || null,
    pageStatus: status >= 200 && status < 400 ? 'live' : status >= 400 ? 'dead' : 'unknown',
  };
}

export async function fetchArchiveTimeline(url, { signal, limit = 2 } = {}) {
  const target = safeUrl(url);
  if (!target) return [];

  try {
    const response = await httpClient.get('https://web.archive.org/cdx/search/cdx', {
      params: {
        url: target,
        output: 'json',
        fl: 'original,timestamp,statuscode',
        filter: 'statuscode:200',
        collapse: 'timestamp:8',
        limit,
      },
      timeout: 10_000,
      signal,
    });
    const rows = response.data;
    if (!Array.isArray(rows) || rows.length < 2) return [];
    const headers = rows[0];
    const originalIdx = headers.indexOf('original');
    const timestampIdx = headers.indexOf('timestamp');
    return rows.slice(1).map((row) => ({
      url: row[originalIdx] || target,
      timestamp: row[timestampIdx] || '',
    })).filter((entry) => entry.timestamp);
  } catch {
    return [];
  }
}

/**
 * Enrich top-ranked live results with archival fallback metadata.
 *
 * Only the first `limit` non-archive URLs are probed to keep latency bounded
 * during normal searches. The returned array is a shallow clone of the input
 * results with each result's `meta` object cloned before archive metadata is
 * attached.
 *
 * @param {object[]} results
 * @param {{ signal?: AbortSignal, limit?: number }} [options]
 * @returns {Promise<object[]>}
 */
export async function attachArchiveFallback(results = [], { signal, limit = 8 } = {}) {
  const next = results.map((result) => ({
    ...result,
    meta: { ...(result.meta || {}) },
  }));

  const targets = next
    .filter((result) => result.url && !/archive\.org|web\.archive\.org/iu.test(result.url))
    .slice(0, limit);

  const settled = await Promise.allSettled(
    targets.map((result) => lookupArchiveSnapshot(result.url, { signal }))
  );

  settled.forEach((entry, index) => {
    if (entry.status !== 'fulfilled') return;
    const result = targets[index];
    const meta = result.meta || (result.meta = {});
    meta.pageStatus = entry.value.pageStatus;
    if (entry.value.archiveUrl) {
      meta.archiveUrl = entry.value.archiveUrl;
      meta.archiveTimestamp = entry.value.archiveTimestamp;
      meta.snapshotViewerUrl = `/snapshot/view?url=${encodeURIComponent(result.url)}`;
      meta.tags = Array.isArray(meta.tags) ? meta.tags : [];
      if (!meta.tags.includes('archive-ready')) meta.tags.push('archive-ready');
    }
  });

  return next;
}

export async function expandArchiveFirstResults(
  results = [],
  {
    signal,
    limit = 3,
    capturesPerResult = 2,
    fetchTimelineImpl = fetchArchiveTimeline,
  } = {}
) {
  const candidates = results
    .filter((result) => (
      result.url
      && result.meta?.pageStatus === 'dead'
      && result.meta?.archiveUrl
      && (result.score || 0) >= 55
    ))
    .slice(0, limit);

  const expanded = await Promise.all(
    candidates.map(async (result) => {
      const captures = await fetchTimelineImpl(result.url, { signal, limit: capturesPerResult });
      return captures.map((capture, index) => {
      const year = Number.parseInt(capture.timestamp.slice(0, 4), 10);
      const safeYear = Number.isNaN(year) ? null : year;
      return {
        ...result,
        title: `[Archive lane ${safeYear || 'capture'}] ${result.title || result.url}`,
        url: `https://web.archive.org/web/${capture.timestamp}/${capture.url}`,
        source: 'archive-first',
        rank: (result.rank || 0) + index + 1,
        score: Math.max(1, (result.score || 0) - 4 - index),
        confidence: Math.max(0.01, (result.confidence || ((result.score || 0) / 100)) * (0.92 - (index * 0.04))),
        snippet: `Historical capture from ${safeYear || 'unknown year'} expanded from a dead but strong lead.`,
        meta: {
          ...(result.meta || {}),
          archiveSourceUrl: result.meta?.archiveSourceUrl || result.url,
          archiveTimestamp: capture.timestamp,
          pageStatus: 'archived',
          whySurvived: 'dead-link archive lane preserved this lead',
          timeline: safeYear ? {
            label: String(safeYear),
            year: safeYear,
            sortKey: `${safeYear}-01-01T00:00:00.000Z`,
          } : result.meta?.timeline,
          era: safeYear || result.meta?.era,
          tags: [...new Set([...(result.meta?.tags || []), 'archive-lane', 'fossil'])],
        },
      };
      });
    })
  );

  return expanded.flat();
}
