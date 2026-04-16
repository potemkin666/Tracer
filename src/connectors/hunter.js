const axios = require('axios');
const { normalise } = require('../normaliser');

function looksLikeDomain(q) {
  return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(q.replace(/^https?:\/\//, '').split('/')[0]);
}

async function search(query, apiKeys = {}) {
  try {
    if (looksLikeDomain(query)) {
      const domain = query.replace(/^https?:\/\//, '').split('/')[0];
      const response = await axios.get('https://api.hunter.io/v2/domain-search', {
        params: { domain, api_key: apiKeys.hunter, limit: 10 },
        timeout: 10000,
      });
      const emails = (response.data.data && response.data.data.emails) || [];
      return emails.map((email, i) =>
        normalise('hunter', query, {
          title: `${email.first_name || ''} ${email.last_name || ''} <${email.value}>`.trim(),
          url: email.linkedin || `https://hunter.io`,
          snippet: email.position || '',
          rank: i + 1,
        })
      );
    } else {
      const response = await axios.get('https://api.hunter.io/v2/email-finder', {
        params: { full_name: query, api_key: apiKeys.hunter },
        timeout: 10000,
      });
      const data = response.data.data || {};
      if (!data.email) return [];
      return [
        normalise('hunter', query, {
          title: `${data.first_name || ''} ${data.last_name || ''} <${data.email}>`.trim(),
          url: data.linkedin || 'https://hunter.io',
          snippet: data.position || '',
          rank: 1,
        }),
      ];
    }
  } catch (err) { console.error('[connectors/hunter]', err.message); return []; }
}

module.exports = { search };
