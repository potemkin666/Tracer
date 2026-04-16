import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://data.brreg.no/enhetsregisteret/api/enheter', {
      params: { navn: query },
      headers: {
        'User-Agent': 'Tracer/1.0',
        'Accept-Language': 'nb-NO',
      },
      timeout: 10000,
    });
    const units = (response.data && response.data._embedded && response.data._embedded.enheter) || [];
    return units.slice(0, 15).map((u, i) => normalise('brreg', query, {
      title: u.navn || '',
      url: `https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=${u.organisasjonsnummer}`,
      snippet: [u.organisasjonsform?.beskrivelse, u.forretningsadresse?.kommune, u.organisasjonsnummer].filter(Boolean).join(' | '),
      rank: i + 1,
    }));
  } catch (err) { console.error('[connectors/brreg]', err.message); return []; }
}

export { search };
