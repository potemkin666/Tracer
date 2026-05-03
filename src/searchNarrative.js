function topConnectors(connectorStats = []) {
  return connectorStats
    .filter((stat) => stat.ok)
    .sort((left, right) => (right.count || 0) - (left.count || 0))
    .slice(0, 3)
    .map((stat) => `${stat.id} (${stat.count || 0})`);
}

export function buildSearchNarrative({ results = [], connectorStats = [], telemetry = null } = {}) {
  const ok = connectorStats.filter((stat) => stat.ok);
  const fail = connectorStats.filter((stat) => !stat.ok);
  const inspected = results.filter((result) => result.meta?.pageInspection).length;
  const archiveLane = results.filter((result) => result.source === 'archive-first').length;
  const highConfidence = results.filter((result) => (result.score || 0) >= 70).length;
  const top = topConnectors(connectorStats);

  if (!results.length) {
    return {
      headline: 'No strong trace survived this sweep.',
      details: [
        ok.length ? `${ok.length} connectors still returned data.` : 'No connectors produced usable evidence.',
        fail.length ? `${fail.length} connectors failed or timed out.` : 'No connector failures were recorded.',
      ],
      status: 'empty',
    };
  }

  const resultLabel = `${results.length} result${results.length === 1 ? '' : 's'}`;
  return {
    headline: `${resultLabel} survived because ${highConfidence || inspected || archiveLane ? 'strong evidence stacks formed' : 'multiple weak traces still lined up'}.`,
    details: [
      top.length ? `Most productive connectors: ${top.join(', ')}.` : `${ok.length} connectors produced evidence.`,
      inspected ? `${inspected} results include page-inspection evidence.` : 'No direct page inspection evidence surfaced.',
      archiveLane ? `${archiveLane} archive-lane expansions came from dead links.` : 'Archive expansion did not drive this result set.',
      telemetry?.topFamilies?.length ? `Recent winning families: ${telemetry.topFamilies.slice(0, 2).map((entry) => entry.family).join(', ')}.` : '',
    ].filter(Boolean),
    status: 'ok',
  };
}
