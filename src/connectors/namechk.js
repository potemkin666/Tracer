const axios = require('axios');
const { normalise } = require('../normaliser');

const PLATFORMS = [
  { name: 'GitHub', url: (u) => `https://github.com/${u}` },
  { name: 'Twitter', url: (u) => `https://twitter.com/${u}` },
  { name: 'Instagram', url: (u) => `https://instagram.com/${u}` },
  { name: 'Reddit', url: (u) => `https://reddit.com/user/${u}` },
];

async function search(username) {
  const results = [];

  await Promise.all(
    PLATFORMS.map(async (platform) => {
      const url = platform.url(username);
      try {
        const response = await axios.head(url, { timeout: 5000 });
        if (response.status === 200) {
          results.push(
            normalise('namechk', username, {
              title: `${platform.name}: ${username}`,
              url,
              snippet: `Username @${username} exists on ${platform.name}`,
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
