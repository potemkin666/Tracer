import { SERVER_CONNECTORS } from '../engineMetadata.js';

const _cache = new Map();

function lazySearch(modulePath) {
  return async (query, apiKeys, options) => {
    if (!_cache.has(modulePath)) {
      const mod = await import(modulePath);
      if (typeof mod.search !== 'function') {
        throw new Error(`Connector at ${modulePath} does not export a search() function`);
      }
      _cache.set(modulePath, mod);
    }
    return _cache.get(modulePath).search(query, apiKeys, options);
  };
}

const ALL_CONNECTORS = SERVER_CONNECTORS.map(({ modulePath, ...connector }) => ({
  ...connector,
  search: lazySearch(modulePath),
}));

export function getActive(apiKeys, mode) {
  const tiers = mode === 'aggressive'
    ? ['core', 'open', 'osint', 'regional', 'meta', 'obscure']
    : ['core', 'open', 'meta'];
  return ALL_CONNECTORS.filter((connector) => {
    if (!tiers.includes(connector.tier)) return false;
    if (!connector.requiresKey) return true;
    const keys = Array.isArray(connector.requiresKey)
      ? connector.requiresKey
      : [connector.requiresKey];
    return keys.every((key) => !!apiKeys[key]);
  });
}

export { ALL_CONNECTORS };
