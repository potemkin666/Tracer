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

function normaliseValues(values = []) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).toLowerCase().trim()))];
}

function extractEmailDomains(result) {
  return normaliseValues((result.meta?.entities?.emails || []).map((email) => email.split('@')[1] || ''));
}

function extractOrgs(result) {
  return normaliseValues(result.meta?.entities?.orgs || []);
}

function extractRegions(result) {
  return normaliseValues([result.meta?.region].filter(Boolean));
}

function extractProfilePattern(result) {
  return normaliseValues([
    result.meta?.username || '',
    fingerprintPath(result.url),
  ]);
}

function hasConflict(left = [], right = []) {
  if (!left.length || !right.length) return false;
  return !left.some((value) => right.includes(value));
}

function buildContradictionFingerprint(result) {
  return {
    emailDomains: extractEmailDomains(result),
    orgs: extractOrgs(result),
    regions: extractRegions(result),
    profilePatterns: extractProfilePattern(result),
  };
}

function isCompatibleWithGroup(result, group) {
  const fingerprint = buildContradictionFingerprint(result);
  return !group.some((candidate) => {
    const other = buildContradictionFingerprint(candidate);
    return hasConflict(fingerprint.emailDomains, other.emailDomains)
      || hasConflict(fingerprint.orgs, other.orgs)
      || hasConflict(fingerprint.regions, other.regions)
      || hasConflict(fingerprint.profilePatterns, other.profilePatterns);
  });
}

function splitContradictoryGroup(group) {
  return group.reduce((partitions, result) => {
    const existing = partitions.find((partition) => isCompatibleWithGroup(result, partition));
    if (existing) {
      existing.push(result);
      return partitions;
    }
    partitions.push([result]);
    return partitions;
  }, []);
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
    splitContradictoryGroup(group).forEach((partition, partitionIndex) => {
      if (partition.length < 2) return;
      const label = fingerprintTitle(partition[0].title) || fingerprintPath(partition[0].url) || 'similar pages';
      const maxScore = Math.max(...partition.map((item) => item.score || 0));
      const clusterId = `cluster-${clusterIndex++}`;
      partition.forEach((item) => {
        clusterMeta.set(item.url || `${key}:${partitionIndex}:${item.title}`, {
          id: clusterId,
          size: partition.length,
          label,
          maxScore,
          contradictionChecked: group.length > partition.length,
        });
      });
    });
  });

  return keyed
    .map(({ result, key }) => {
      const meta = key ? clusterMeta.get(result.url || `${key}:${result.title}`) : null;
      if (!meta) return result;
      return {
        ...result,
        meta: {
          ...(result.meta || {}),
          clusterId: meta.id,
          clusterSize: meta.size,
          clusterLabel: meta.label,
          clusterScore: meta.maxScore,
          clusterContradictionChecked: meta.contradictionChecked,
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
