function dedupe(results) {
  const seen = new Set();
  return results.filter((r) => {
    if (!r.url || seen.has(r.url)) return false;
    seen.add(r.url);
    return true;
  });
}

module.exports = { dedupe };
