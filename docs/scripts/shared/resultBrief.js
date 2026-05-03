function uniqueSources(result) {
  return [...new Set([
    ...(Array.isArray(result.sources) ? result.sources : []),
    ...(Array.isArray(result.seenOn) ? result.seenOn : []),
    result.source,
  ].filter(Boolean))];
}

function truncate(value, max = 70) {
  const text = String(value || '').trim();
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

export function buildResultsBrief(results = []) {
  if (!results.length) return '';

  const corroborated = results.filter((result) => uniqueSources(result).length > 1).length;
  const highConfidence = results.filter((result) => (result.score || 0) >= 70).length;
  const sourceCounts = new Map();

  results.forEach((result) => {
    uniqueSources(result).forEach((source) => {
      sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
    });
  });

  const topSources = [...sourceCounts.entries()]
    .sort((leftEntry, rightEntry) => (
      rightEntry[1] - leftEntry[1] || leftEntry[0].localeCompare(rightEntry[0])
    ))
    .slice(0, 3)
    .map(([source, count]) => `${source} (${count})`)
    .join(', ');

  const lead = results[0] || {};
  const leadLabel = truncate(lead.title || lead.url || 'top lead');
  const leadSources = uniqueSources(lead);

  const parts = [
    `${results.length} unique signal${results.length === 1 ? '' : 's'} after deduplication.`,
    highConfidence
      ? `${highConfidence} high-confidence match${highConfidence === 1 ? '' : 'es'} surfaced.`
      : 'No high-confidence matches yet.',
    corroborated
      ? `${corroborated} corroborated by multiple sources.`
      : 'No cross-source corroboration yet.',
    `Top lead: ${leadLabel}${leadSources[0] ? ` via ${leadSources[0]}` : ''}.`,
  ];

  if (topSources) {
    parts.push(`Most active sources: ${topSources}.`);
  }

  return parts.join(' ');
}
