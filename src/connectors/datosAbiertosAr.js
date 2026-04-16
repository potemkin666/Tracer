import httpClient from '../httpClient.js';
import { normalise } from '../normaliser.js';

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

async function search(query, apiKeys = {}) {
  try {
    const response = await httpClient.get('https://catalogo.datos.gob.ar/api/3/action/package_search', {
      params: { q: query, rows: 10 },
      headers: {
        'User-Agent': UA,
        Accept: 'application/json',
        'Accept-Language': 'es-AR,es;q=0.9',
      },
      timeout: 10000,
    });
    const items = response.data.result.results || [];
    return items.map((item, i) =>
      normalise('datos-abiertos-ar', query, {
        title: item.title,
        url: `https://catalogo.datos.gob.ar/dataset/${item.name}`,
        snippet: item.notes?.slice(0, 200) || '',
        rank: i + 1,
      }),
    );
  } catch (err) { console.error('[connectors/datos-abiertos-ar]', err.message); return []; }
}

export { search };
