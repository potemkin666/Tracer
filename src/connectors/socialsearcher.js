const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://api.social-searcher.com/v2/search', {
      params: { q: query, limit: 10 },
      timeout: 10000,
    });
    const posts = response.data.posts || [];
    return posts.map((post, i) =>
      normalise('social-searcher', query, {
        title: post.title || post.network || '',
        url: post.url || '',
        snippet: post.text || '',
        rank: i + 1,
      })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
