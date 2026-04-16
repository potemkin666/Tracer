const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://pub.orcid.org/v3.0/expanded-search/', {
      params: { q: query, rows: 10 },
      headers: { Accept: 'application/json' },
      timeout: 10000,
    });
    const items = (response.data && response.data['expanded-result']) || [];
    return items.map((item, i) =>
      normalise('orcid', query, {
        title: `${item['given-names'] || ''} ${item['family-names'] || ''}`.trim(),
        url: `https://orcid.org/${item['orcid-id']}`,
        snippet: (item['institution-name'] || []).join(', '),
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/orcid]', err.message); return []; }
}

module.exports = { search };
