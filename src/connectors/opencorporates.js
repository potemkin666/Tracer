const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query, apiKeys = {}) {
  try {
    const response = await axios.get('https://api.opencorporates.com/v0.4/companies/search', {
      params: { q: query, per_page: 10 },
      timeout: 10000,
    });
    const companies =
      (response.data.results && response.data.results.companies) || [];
    return companies.map((c, i) => {
      const co = c.company || {};
      return normalise('opencorporates', query, {
        title: co.name,
        url: co.opencorporates_url,
        snippet: `${co.jurisdiction_code || ''} / ${co.company_number || ''}`,
        rank: i + 1,
      });
    });
  } catch {
    return [];
  }
}

module.exports = { search };
