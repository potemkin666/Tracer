import httpClient from './httpClient.js';

function safeUrl(value) {
  try {
    return new URL(String(value || '')).toString();
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
