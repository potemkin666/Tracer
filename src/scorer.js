function score(results, originalInput) {
  const lowerInput = originalInput.toLowerCase();
  const urlMap = {};

  results.forEach((r) => {
    if (r.url) urlMap[r.url] = (urlMap[r.url] || 0) + 1;
  });

  const scored = results.map((r) => {
    let s = 0;
    const title = (r.title || '').toLowerCase();
    const snippet = (r.snippet || '').toLowerCase();
    const url = (r.url || '').toLowerCase();
    const tags = (r.meta && r.meta.tags) || [];

    if (title.includes(lowerInput) || snippet.includes(lowerInput)) s += 10;
    if (url.includes(lowerInput.replace(/\s+/g, ''))) s += 5;
    if ((urlMap[r.url] || 0) > 1) s += 3;
    if (r.source === 'wayback' || /https?:\/\/[^/]*\.archive\.org\//.test(r.url || '')) s += 2;
    if (tags.includes('fossil')) s += 4;
    if (tags.includes('timeslice')) s += 2;
    if (tags.includes('document')) s += 3;

    return { ...r, score: s };
  });

  return scored.sort((a, b) => b.score - a.score);
}

module.exports = { score };
