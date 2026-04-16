const axios = require('axios');
const { normalise } = require('../normaliser');

let cachedData = null;

async function fetchData() {
  if (cachedData) return cachedData;
  const response = await axios.get(
    'https://raw.githubusercontent.com/WebBreacher/WhatsMyName/main/wmn-data.json',
    { timeout: 10000 }
  );
  cachedData = response.data;
  return cachedData;
}

async function search(query, apiKeys = {}) {
  try {
    const data = await fetchData();
    const sites = (data && data.sites) || [];
    return sites.slice(0, 20).map((site, i) => {
      const checkUri = (site.check_uri || '').replace('{account}', query);
      return normalise('whats-my-name', query, {
        title: `${site.name} — check for username "${query}"`,
        url: checkUri,
        snippet: `Category: ${site.category || ''} | URI: ${checkUri}`,
        rank: i + 1,
      });
    });
  } catch {
    return [];
  }
}

module.exports = { search };
