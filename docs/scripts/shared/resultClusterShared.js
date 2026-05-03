function normaliseWords(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/https?:\/\/\S+/gu, ' ')
    .replace(/[^a-z0-9]+/gu, ' ')
    .trim()
    .split(/\s+/u)
    .filter(Boolean);
}

const CLUSTER_STOPWORDS = new Set([
  'a', 'an', 'and', 'for', 'from', 'home', 'official', 'page', 'profile', 'site', 'the', 'user',
]);

function fingerprintTitle(title) {
  const tokens = normaliseWords(title).filter((token) => !CLUSTER_STOPWORDS.has(token));
  return tokens.slice(0, 6).join(' ');
}

function fingerprintPath(url) {
  try {
    const parsed = new URL(url);
    return parsed.pathname
      .toLowerCase()
      .replace(/\/+/gu, '/')
      .replace(/(^\/|\/$)/gu, '')
      .split('/')
      .filter((segment) => segment && !/^\d+$/u.test(segment))
      .slice(-3)
      .join('/');
  } catch {
    return '';
  }
}

function buildClusterKey(result) {
  const username = String(result.meta?.username || '').toLowerCase();
  const titleKey = fingerprintTitle(result.title);
  const pathKey = fingerprintPath(result.url);

  if (username) return `username:${username}`;
  if (titleKey && pathKey) return `title-path:${titleKey}|${pathKey}`;
  if (titleKey) return `title:${titleKey}`;
  if (pathKey) return `path:${pathKey}`;
  return null;
}

export function clusterResults(results = []) {
  const keyed = results.map((result) => ({ result, key: buildClusterKey(result) }));
  const groups = new Map();

  keyed.forEach((entry) => {
    if (!entry.key) return;
    if (!groups.has(entry.key)) groups.set(entry.key, []);
    groups.get(entry.key).push(entry.result);
  });

  const clusterMeta = new Map();
  let clusterIndex = 1;

  groups.forEach((group, key) => {
    if (group.length < 2) return;
    const label = fingerprintTitle(group[0].title) || fingerprintPath(group[0].url) || 'similar pages';
    const maxScore = Math.max(...group.map((item) => item.score || 0));
    clusterMeta.set(key, {
      id: `cluster-${clusterIndex++}`,
      size: group.length,
      label,
      maxScore,
    });
  });

  return keyed
    .map(({ result, key }) => {
      const meta = key ? clusterMeta.get(key) : null;
      if (!meta) return result;
      return {
        ...result,
        meta: {
          ...(result.meta || {}),
          clusterId: meta.id,
          clusterSize: meta.size,
          clusterLabel: meta.label,
          clusterScore: meta.maxScore,
        },
      };
    })
    .sort((left, right) => {
      const leftCluster = left.meta?.clusterScore ?? left.score ?? 0;
      const rightCluster = right.meta?.clusterScore ?? right.score ?? 0;
      if (rightCluster !== leftCluster) return rightCluster - leftCluster;
      const leftSize = left.meta?.clusterSize ?? 1;
      const rightSize = right.meta?.clusterSize ?? 1;
      if (rightSize !== leftSize) return rightSize - leftSize;
      return (right.score || 0) - (left.score || 0);
    });
}
