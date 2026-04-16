function normalise(source, query, result) {
  return {
    source: source || '',
    query: query || '',
    title: result.title || '',
    url: result.url || '',
    snippet: result.snippet || '',
    rank: typeof result.rank === 'number' ? result.rank : 0,
  };
}

module.exports = { normalise };
