/**
 * Base class for all Tracer search connectors.
 *
 * Every connector must extend this class and implement `_search(query, apiKeys)`.
 * The public `search()` method delegates to `_search()` and guarantees the
 * contract: always returns an array (never throws to the caller).
 *
 * @example
 *   const Connector = require('./Connector');
 *   const { normalise } = require('../normaliser');
 *
 *   class BraveConnector extends Connector {
 *     constructor() {
 *       super({ id: 'brave', label: 'Brave Search', tier: 'core', requiresKey: 'brave' });
 *     }
 *     async _search(query, apiKeys) {
 *       // ... fetch results ...
 *       return items.map((item, i) => normalise(this.id, query, { ... }));
 *     }
 *   }
 */
class Connector {
  /**
   * @param {object} opts
   * @param {string} opts.id          – unique connector identifier (e.g. 'brave')
   * @param {string} opts.label       – human-readable name (e.g. 'Brave Search')
   * @param {string} opts.tier        – one of 'core', 'open', 'osint', 'regional', 'meta', 'obscure'
   * @param {string|string[]|null} opts.requiresKey – API-key name(s) needed, or null
   */
  constructor({ id, label, tier, requiresKey = null }) {
    if (!id || !label || !tier) {
      throw new Error(`Connector requires id, label, and tier (got id=${id})`);
    }
    this.id = id;
    this.label = label;
    this.tier = tier;
    this.requiresKey = requiresKey;
  }

  /**
   * Public entry point. Calls `_search()` and guarantees an array result.
   *
   * @param {string} query   – the search term
   * @param {object} apiKeys – full apiKeys map (connector extracts what it needs)
   * @returns {Promise<object[]>} – normalised result objects
   */
  async search(query, apiKeys = {}) {
    try {
      const results = await this._search(query, apiKeys);
      return Array.isArray(results) ? results : [];
    } catch (err) {
      console.error(`[connectors/${this.id}]`, err.message);
      return [];
    }
  }

  /**
   * Subclasses MUST override this method.
   *
   * @abstract
   * @param {string} query   – the search term
   * @param {object} apiKeys – full apiKeys map
   * @returns {Promise<object[]>} – normalised result objects
   */
  async _search(_query, _apiKeys) {
    throw new Error(`${this.constructor.name} must implement _search()`);
  }
}

module.exports = Connector;
