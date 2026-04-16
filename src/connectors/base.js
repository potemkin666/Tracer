const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get(
      'https://api.base-search.net/cgi-bin/BaseHttpSearchInterface.fcgi',
      {
        params: { func: 'PerformSearch', query, hits: 10, offset: 0, format: 'json' },
        timeout: 10000,
      }
    );
    const docs = (response.data.response && response.data.response.docs) || [];
    return docs.map((doc, i) =>
      normalise('base', query, {
        title: doc.dctitle,
        url: doc.dcidentifier,
        snippet: doc.dcdescription,
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/base]', err.message); return []; }
}

module.exports = { search };
