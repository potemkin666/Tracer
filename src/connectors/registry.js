// Connector module cache — modules are loaded on first search() call only.
const _cache = new Map();

function lazySearch(modulePath, keyExtractor) {
  return (q, ak) => {
    if (!_cache.has(modulePath)) {
      _cache.set(modulePath, require(modulePath));
    }
    return _cache.get(modulePath).search(q, keyExtractor ? keyExtractor(ak) : ak);
  };
}

const ALL_CONNECTORS = [
  // ── CORE ──────────────────────────────────────────────────────────────────
  { id: 'brave', label: 'Brave Search', tier: 'core', requiresKey: 'brave', search: lazySearch('./brave', ak => ak.brave) },
  { id: 'serpapi', label: 'SerpAPI', tier: 'core', requiresKey: 'serpapi', search: lazySearch('./serpapi', ak => ak.serpapi) },
  { id: 'mojeek', label: 'Mojeek', tier: 'core', requiresKey: 'mojeek', search: lazySearch('./mojeek', ak => ak.mojeek) },
  { id: 'kagi', label: 'Kagi', tier: 'core', requiresKey: 'kagi', search: lazySearch('./kagi') },
  { id: 'bing', label: 'Bing', tier: 'core', requiresKey: 'bing', search: lazySearch('./bing') },
  { id: 'google', label: 'Google Custom Search', tier: 'core', requiresKey: ['google', 'googleCx'], search: lazySearch('./google') },
  { id: 'metager', label: 'MetaGer', tier: 'core', requiresKey: 'metager', search: lazySearch('./metager') },
  { id: 'swisscows', label: 'Swisscows', tier: 'core', requiresKey: 'swisscows', search: lazySearch('./swisscows') },
  { id: 'listennotes', label: 'Listen Notes', tier: 'core', requiresKey: 'listennotes', search: lazySearch('./listennotes') },
  { id: 'exa', label: 'Exa AI', tier: 'core', requiresKey: 'exa', search: lazySearch('./exa') },
  { id: 'perplexity', label: 'Perplexity AI', tier: 'core', requiresKey: 'perplexity', search: lazySearch('./perplexity') },

  // ── OPEN ──────────────────────────────────────────────────────────────────
  { id: 'duckduckgo', label: 'DuckDuckGo', tier: 'open', requiresKey: null, search: lazySearch('./duckduckgo') },
  { id: 'searxng', label: 'SearXNG', tier: 'open', requiresKey: null, search: lazySearch('./searxng') },
  { id: 'marginalia', label: 'Marginalia', tier: 'open', requiresKey: null, search: lazySearch('./marginalia') },
  { id: 'wiby', label: 'Wiby', tier: 'open', requiresKey: null, search: lazySearch('./wiby') },
  { id: 'qwant', label: 'Qwant', tier: 'open', requiresKey: null, search: lazySearch('./qwant') },
  { id: 'yep', label: 'Yep', tier: 'open', requiresKey: null, search: lazySearch('./yep') },
  { id: 'searchcode', label: 'SearchCode', tier: 'open', requiresKey: null, search: lazySearch('./searchcode') },
  { id: 'grep.app', label: 'grep.app', tier: 'open', requiresKey: null, search: lazySearch('./grepdotapp') },
  { id: 'openverse', label: 'Openverse', tier: 'open', requiresKey: null, search: lazySearch('./openverse') },
  { id: 'base', label: 'BASE', tier: 'open', requiresKey: null, search: lazySearch('./base') },
  { id: 'crt.sh', label: 'crt.sh', tier: 'open', requiresKey: null, search: lazySearch('./crtsh') },
  { id: 'urlscan', label: 'urlscan.io', tier: 'open', requiresKey: null, search: lazySearch('./urlscan') },
  { id: 'opencorporates', label: 'OpenCorporates', tier: 'open', requiresKey: null, search: lazySearch('./opencorporates') },
  { id: 'opensanctions', label: 'OpenSanctions', tier: 'open', requiresKey: null, search: lazySearch('./opensanctions') },
  { id: 'semantic-scholar', label: 'Semantic Scholar', tier: 'open', requiresKey: null, search: lazySearch('./semanticscholar') },
  { id: 'crossref', label: 'CrossRef', tier: 'open', requiresKey: null, search: lazySearch('./crossref') },
  { id: 'openalex', label: 'OpenAlex', tier: 'open', requiresKey: null, search: lazySearch('./openalex') },
  { id: 'worldcat', label: 'WorldCat', tier: 'open', requiresKey: null, search: lazySearch('./worldcat') },
  { id: 'ahmia', label: 'Ahmia', tier: 'open', requiresKey: null, search: lazySearch('./ahmia') },
  { id: 'carrot2', label: 'Carrot2', tier: 'open', requiresKey: null, search: lazySearch('./carrot2') },
  { id: 'whats-my-name', label: "What's My Name", tier: 'open', requiresKey: null, search: lazySearch('./whatsMyName') },
  { id: 'social-searcher', label: 'Social Searcher', tier: 'open', requiresKey: null, search: lazySearch('./socialsearcher') },
  { id: 'social-profiles', label: 'Social Profile Checker', tier: 'open', requiresKey: null, search: lazySearch('./socialProfiles') },
  { id: 'arxiv', label: 'ArXiv', tier: 'open', requiresKey: null, search: lazySearch('./arxiv') },
  { id: 'lens', label: 'Lens.org', tier: 'open', requiresKey: null, search: lazySearch('./lens') },
  { id: 'orcid', label: 'ORCID', tier: 'open', requiresKey: null, search: lazySearch('./orcid') },
  { id: 'stract', label: 'Stract', tier: 'open', requiresKey: null, search: lazySearch('./stract') },
  { id: 'crowdview', label: 'CrowdView', tier: 'open', requiresKey: null, search: lazySearch('./crowdview') },
  { id: 'yacy', label: 'YaCy', tier: 'open', requiresKey: null, search: lazySearch('./yacy') },
  { id: 'europeana', label: 'Europeana', tier: 'open', requiresKey: null, search: lazySearch('./europeana') },
  { id: 'jstor', label: 'JSTOR', tier: 'open', requiresKey: null, search: lazySearch('./jstor') },
  { id: 'companies-house', label: 'UK Companies House', tier: 'open', requiresKey: null, search: lazySearch('./companieshouse') },

  // ── OSINT ─────────────────────────────────────────────────────────────────
  { id: 'shodan', label: 'Shodan', tier: 'osint', requiresKey: 'shodan', search: lazySearch('./shodan') },
  { id: 'censys', label: 'Censys', tier: 'osint', requiresKey: ['censysId', 'censysSecret'], search: lazySearch('./censys') },
  { id: 'hunter', label: 'Hunter.io', tier: 'osint', requiresKey: 'hunter', search: lazySearch('./hunter') },
  { id: 'intelx', label: 'IntelX', tier: 'osint', requiresKey: 'intelx', search: lazySearch('./intelx') },
  { id: 'publicwww', label: 'PublicWWW', tier: 'osint', requiresKey: 'publicwww', search: lazySearch('./publicwww') },
  { id: 'tineye', label: 'TinEye', tier: 'osint', requiresKey: 'tineye', search: lazySearch('./tineye') },

  // ── REGIONAL ──────────────────────────────────────────────────────────────
  { id: 'yandex', label: 'Yandex', tier: 'regional', requiresKey: 'yandex', search: lazySearch('./yandex') },
  { id: 'baidu', label: 'Baidu', tier: 'regional', requiresKey: null, search: lazySearch('./baidu') },
  { id: 'naver', label: 'Naver', tier: 'regional', requiresKey: ['naverClientId', 'naverClientSecret'], search: lazySearch('./naver') },
  { id: 'sogou', label: 'Sogou', tier: 'regional', requiresKey: null, search: lazySearch('./sogou') },
  { id: 'so360', label: 'So.com (360)', tier: 'regional', requiresKey: null, search: lazySearch('./so360') },
  { id: 'seznam', label: 'Seznam', tier: 'regional', requiresKey: null, search: lazySearch('./seznam') },
  { id: 'mail.ru', label: 'Mail.ru', tier: 'regional', requiresKey: null, search: lazySearch('./mailru') },
  { id: 'rambler', label: 'Rambler', tier: 'regional', requiresKey: null, search: lazySearch('./rambler') },

  // ── META ──────────────────────────────────────────────────────────────────
  { id: 'startpage', label: 'Startpage', tier: 'meta', requiresKey: null, search: lazySearch('./startpage') },
  { id: 'dogpile', label: 'Dogpile', tier: 'meta', requiresKey: null, search: lazySearch('./dogpile') },
  { id: 'metacrawler', label: 'MetaCrawler', tier: 'meta', requiresKey: null, search: lazySearch('./metacrawler') },
  { id: 'etools', label: 'eTools', tier: 'meta', requiresKey: null, search: lazySearch('./etools') },
  { id: 'ecosia', label: 'Ecosia', tier: 'meta', requiresKey: null, search: lazySearch('./ecosia') },
  { id: 'presearch', label: 'Presearch', tier: 'meta', requiresKey: null, search: lazySearch('./presearch') },
  { id: 'webcrawler', label: 'WebCrawler', tier: 'meta', requiresKey: null, search: lazySearch('./webcrawler') },
  { id: 'faganfinder', label: 'FaganFinder', tier: 'meta', requiresKey: null, search: lazySearch('./faganfinder') },
  { id: 'yahoo', label: 'Yahoo', tier: 'meta', requiresKey: null, search: lazySearch('./yahoo') },
  { id: 'gibiru', label: 'Gibiru', tier: 'meta', requiresKey: null, search: lazySearch('./gibiru') },
  { id: 'freespoke', label: 'Freespoke', tier: 'meta', requiresKey: null, search: lazySearch('./freespoke') },
  { id: 'mamma', label: 'Mamma', tier: 'meta', requiresKey: null, search: lazySearch('./mamma') },
  { id: 'you.com', label: 'You.com', tier: 'meta', requiresKey: null, search: lazySearch('./youcom') },

  // ── OBSCURE ───────────────────────────────────────────────────────────────
  { id: 'refseek', label: 'RefSeek', tier: 'obscure', requiresKey: null, search: lazySearch('./refseek') },
  { id: 'lycos', label: 'Lycos', tier: 'obscure', requiresKey: null, search: lazySearch('./lycos') },
  { id: 'millionshort', label: 'MillionShort', tier: 'obscure', requiresKey: null, search: lazySearch('./millionshort') },
  { id: 'boardreader', label: 'BoardReader', tier: 'obscure', requiresKey: null, search: lazySearch('./boardreader') },
  { id: 'sourcegraph', label: 'Sourcegraph', tier: 'obscure', requiresKey: null, search: lazySearch('./sourcegraph') },
  { id: 'scholar-google', label: 'Google Scholar', tier: 'obscure', requiresKey: null, search: lazySearch('./scholarGoogle') },
  { id: 'yippy', label: 'Yippy', tier: 'obscure', requiresKey: null, search: lazySearch('./yippy') },
  { id: 'exactseek', label: 'ExactSeek', tier: 'obscure', requiresKey: null, search: lazySearch('./exactseek') },
  { id: 'alltheinternet', label: 'AllTheInternet', tier: 'obscure', requiresKey: null, search: lazySearch('./alltheinternet') },
  { id: 'oscobo', label: 'Oscobo', tier: 'obscure', requiresKey: null, search: lazySearch('./oscobo') },
  { id: 'searchencrypt', label: 'SearchEncrypt', tier: 'obscure', requiresKey: null, search: lazySearch('./searchencrypt') },
  { id: 'info', label: 'Info.com', tier: 'obscure', requiresKey: null, search: lazySearch('./info') },
  { id: 'searchalot', label: 'SearchAlot', tier: 'obscure', requiresKey: null, search: lazySearch('./searchalot') },
  { id: 'anoox', label: 'Anoox', tier: 'obscure', requiresKey: null, search: lazySearch('./anoox') },
  { id: 'secretsearch', label: 'Secret Search Engine Labs', tier: 'obscure', requiresKey: null, search: lazySearch('./secretsearch') },
  { id: 'blog-search', label: 'Blog Search', tier: 'obscure', requiresKey: null, search: lazySearch('./blogsearch') },
  { id: 'findsounds', label: 'FindSounds', tier: 'obscure', requiresKey: null, search: lazySearch('./findsounds') },
  { id: 'rpmfind', label: 'RPMFind', tier: 'obscure', requiresKey: null, search: lazySearch('./rpmfind') },
  { id: 'worldwidescience', label: 'WorldWideScience', tier: 'obscure', requiresKey: null, search: lazySearch('./worldwidescience') },
  { id: 'scienceopen', label: 'ScienceOpen', tier: 'obscure', requiresKey: null, search: lazySearch('./scienceopen') },
  { id: 'krugle', label: 'Krugle', tier: 'obscure', requiresKey: null, search: lazySearch('./krugle') },
  { id: 'researchgate', label: 'ResearchGate', tier: 'obscure', requiresKey: null, search: lazySearch('./researchgate') },
  { id: 'academia', label: 'Academia.edu', tier: 'obscure', requiresKey: null, search: lazySearch('./academia') },
  { id: 'ssrn', label: 'SSRN', tier: 'obscure', requiresKey: null, search: lazySearch('./ssrn') },
];

function getActive(apiKeys, mode) {
  const tiers = mode === 'aggressive'
    ? ['core', 'open', 'osint', 'regional', 'meta', 'obscure']
    : ['core', 'open'];
  return ALL_CONNECTORS.filter((c) => {
    if (!tiers.includes(c.tier)) return false;
    if (!c.requiresKey) return true;
    const keys = Array.isArray(c.requiresKey) ? c.requiresKey : [c.requiresKey];
    return keys.every((k) => !!apiKeys[k]);
  });
}

module.exports = { ALL_CONNECTORS, getActive };
