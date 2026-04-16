const axios = require('axios');
const { normalise } = require('../normaliser');
const { PLATFORMS } = require('./platforms');

// Subset of platforms checked by namechk (quick-check tier).
const NAMECHK_IDS = new Set(['GitHub', 'Twitter/X', 'Instagram', 'Reddit']);
const NAMECHK_PLATFORMS = PLATFORMS.filter(p => NAMECHK_IDS.has(p.id));

async function search(username) {
  const results = [];

  await Promise.all(
    NAMECHK_PLATFORMS.map(async (platform) => {
      const url = platform.url(username);
      try {
        const response = await axios.get(url, {
          timeout: 5000,
          maxRedirects: 0,
          validateStatus: () => true,
          headers: { 'User-Agent': 'Tracer/1.0' },
        });
        // Content-based validation: only count as found when the page
        // returns 200 AND the response body contains the username.
        // This avoids false positives from soft-404 pages, login walls,
        // and generic homepage redirects.
        if (
          response.status === 200 &&
          typeof response.data === 'string' &&
          response.data.toLowerCase().includes(username.toLowerCase())
        ) {
          results.push(
            normalise('namechk', username, {
              title: `${platform.id}: ${username}`,
              url,
              snippet: `Username @${username} exists on ${platform.id}`,
              rank: 0,
            })
          );
        }
      } catch (err) {
        console.error('[connectors/namechk]', err.message);
      }
    })
  );

  return results;
}

module.exports = { search };
