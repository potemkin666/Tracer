const axios = require('axios');
const { normalise } = require('../normaliser');

async function search(query) {
  try {
    const response = await axios.get('https://api.company-information.service.gov.uk/search/companies', {
      params: { q: query, items_per_page: 10 },
      timeout: 10000,
    });
    const items = (response.data && response.data.items) || [];
    return items.map((item, i) =>
      normalise('companies-house', query, {
        title: item.title || '',
        url: `https://find-and-update.company-information.service.gov.uk/company/${item.company_number}`,
        snippet: [item.company_type, item.company_status, item.address_snippet].filter(Boolean).join(' | '),
        rank: i + 1,
      })
    );
  } catch (err) { console.error('[connectors/companieshouse]', err.message); return []; }
}
module.exports = { search };
