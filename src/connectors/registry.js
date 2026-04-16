const ALL_CONNECTORS = [
  // ── CORE ──────────────────────────────────────────────────────────────────
  {
    id: 'brave', label: 'Brave Search', tier: 'core', requiresKey: 'brave',
    search: (q, ak) => require('./brave').search(q, ak.brave),
  },
  {
    id: 'serpapi', label: 'SerpAPI', tier: 'core', requiresKey: 'serpapi',
    search: (q, ak) => require('./serpapi').search(q, ak.serpapi),
  },
  {
    id: 'mojeek', label: 'Mojeek', tier: 'core', requiresKey: 'mojeek',
    search: (q, ak) => require('./mojeek').search(q, ak.mojeek),
  },
  {
    id: 'kagi', label: 'Kagi', tier: 'core', requiresKey: 'kagi',
    search: (q, ak) => require('./kagi').search(q, ak),
  },
  {
    id: 'bing', label: 'Bing', tier: 'core', requiresKey: 'bing',
    search: (q, ak) => require('./bing').search(q, ak),
  },
  {
    id: 'google', label: 'Google Custom Search', tier: 'core', requiresKey: ['google', 'googleCx'],
    search: (q, ak) => require('./google').search(q, ak),
  },
  {
    id: 'metager', label: 'MetaGer', tier: 'core', requiresKey: 'metager',
    search: (q, ak) => require('./metager').search(q, ak),
  },
  {
    id: 'swisscows', label: 'Swisscows', tier: 'core', requiresKey: 'swisscows',
    search: (q, ak) => require('./swisscows').search(q, ak),
  },
  {
    id: 'listennotes', label: 'Listen Notes', tier: 'core', requiresKey: 'listennotes',
    search: (q, ak) => require('./listennotes').search(q, ak),
  },

  // ── OPEN ──────────────────────────────────────────────────────────────────
  {
    id: 'duckduckgo', label: 'DuckDuckGo', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./duckduckgo').search(q, ak),
  },
  {
    id: 'searxng', label: 'SearXNG', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./searxng').search(q, ak),
  },
  {
    id: 'marginalia', label: 'Marginalia', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./marginalia').search(q, ak),
  },
  {
    id: 'wiby', label: 'Wiby', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./wiby').search(q, ak),
  },
  {
    id: 'qwant', label: 'Qwant', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./qwant').search(q, ak),
  },
  {
    id: 'yep', label: 'Yep', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./yep').search(q, ak),
  },
  {
    id: 'searchcode', label: 'SearchCode', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./searchcode').search(q, ak),
  },
  {
    id: 'grep.app', label: 'grep.app', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./grepdotapp').search(q, ak),
  },
  {
    id: 'openverse', label: 'Openverse', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./openverse').search(q, ak),
  },
  {
    id: 'base', label: 'BASE', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./base').search(q, ak),
  },
  {
    id: 'crt.sh', label: 'crt.sh', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./crtsh').search(q, ak),
  },
  {
    id: 'urlscan', label: 'urlscan.io', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./urlscan').search(q, ak),
  },
  {
    id: 'opencorporates', label: 'OpenCorporates', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./opencorporates').search(q, ak),
  },
  {
    id: 'opensanctions', label: 'OpenSanctions', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./opensanctions').search(q, ak),
  },
  {
    id: 'semantic-scholar', label: 'Semantic Scholar', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./semanticscholar').search(q, ak),
  },
  {
    id: 'crossref', label: 'CrossRef', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./crossref').search(q, ak),
  },
  {
    id: 'openalex', label: 'OpenAlex', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./openalex').search(q, ak),
  },
  {
    id: 'worldcat', label: 'WorldCat', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./worldcat').search(q, ak),
  },
  {
    id: 'ahmia', label: 'Ahmia', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./ahmia').search(q, ak),
  },
  {
    id: 'carrot2', label: 'Carrot2', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./carrot2').search(q, ak),
  },
  {
    id: 'whats-my-name', label: "What's My Name", tier: 'open', requiresKey: null,
    search: (q, ak) => require('./whatsMyName').search(q, ak),
  },
  {
    id: 'social-searcher', label: 'Social Searcher', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./socialsearcher').search(q, ak),
  },

  // ── OSINT ─────────────────────────────────────────────────────────────────
  {
    id: 'shodan', label: 'Shodan', tier: 'osint', requiresKey: 'shodan',
    search: (q, ak) => require('./shodan').search(q, ak),
  },
  {
    id: 'censys', label: 'Censys', tier: 'osint', requiresKey: ['censysId', 'censysSecret'],
    search: (q, ak) => require('./censys').search(q, ak),
  },
  {
    id: 'hunter', label: 'Hunter.io', tier: 'osint', requiresKey: 'hunter',
    search: (q, ak) => require('./hunter').search(q, ak),
  },
  {
    id: 'intelx', label: 'IntelX', tier: 'osint', requiresKey: 'intelx',
    search: (q, ak) => require('./intelx').search(q, ak),
  },
  {
    id: 'publicwww', label: 'PublicWWW', tier: 'osint', requiresKey: 'publicwww',
    search: (q, ak) => require('./publicwww').search(q, ak),
  },

  // ── REGIONAL ──────────────────────────────────────────────────────────────
  {
    id: 'yandex', label: 'Yandex', tier: 'regional', requiresKey: 'yandex',
    search: (q, ak) => require('./yandex').search(q, ak),
  },
  {
    id: 'baidu', label: 'Baidu', tier: 'regional', requiresKey: null,
    search: (q, ak) => require('./baidu').search(q, ak),
  },
  {
    id: 'naver', label: 'Naver', tier: 'regional', requiresKey: ['naverClientId', 'naverClientSecret'],
    search: (q, ak) => require('./naver').search(q, ak),
  },
  {
    id: 'sogou', label: 'Sogou', tier: 'regional', requiresKey: null,
    search: (q, ak) => require('./sogou').search(q, ak),
  },
  {
    id: 'so360', label: 'So.com (360)', tier: 'regional', requiresKey: null,
    search: (q, ak) => require('./so360').search(q, ak),
  },
  {
    id: 'seznam', label: 'Seznam', tier: 'regional', requiresKey: null,
    search: (q, ak) => require('./seznam').search(q, ak),
  },

  // ── META ──────────────────────────────────────────────────────────────────
  {
    id: 'startpage', label: 'Startpage', tier: 'meta', requiresKey: null,
    search: (q, ak) => require('./startpage').search(q, ak),
  },
  {
    id: 'dogpile', label: 'Dogpile', tier: 'meta', requiresKey: null,
    search: (q, ak) => require('./dogpile').search(q, ak),
  },
  {
    id: 'metacrawler', label: 'MetaCrawler', tier: 'meta', requiresKey: null,
    search: (q, ak) => require('./metacrawler').search(q, ak),
  },
  {
    id: 'etools', label: 'eTools', tier: 'meta', requiresKey: null,
    search: (q, ak) => require('./etools').search(q, ak),
  },
  {
    id: 'ecosia', label: 'Ecosia', tier: 'meta', requiresKey: null,
    search: (q, ak) => require('./ecosia').search(q, ak),
  },
  {
    id: 'presearch', label: 'Presearch', tier: 'meta', requiresKey: null,
    search: (q, ak) => require('./presearch').search(q, ak),
  },
  {
    id: 'webcrawler', label: 'WebCrawler', tier: 'meta', requiresKey: null,
    search: (q, ak) => require('./webcrawler').search(q, ak),
  },
  {
    id: 'faganfinder', label: 'FaganFinder', tier: 'meta', requiresKey: null,
    search: (q, ak) => require('./faganfinder').search(q, ak),
  },

  // ── OBSCURE ───────────────────────────────────────────────────────────────
  {
    id: 'refseek', label: 'RefSeek', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./refseek').search(q, ak),
  },
  {
    id: 'lycos', label: 'Lycos', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./lycos').search(q, ak),
  },
  {
    id: 'millionshort', label: 'MillionShort', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./millionshort').search(q, ak),
  },
  {
    id: 'boardreader', label: 'BoardReader', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./boardreader').search(q, ak),
  },
  {
    id: 'sourcegraph', label: 'Sourcegraph', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./sourcegraph').search(q, ak),
  },
  {
    id: 'scholar-google', label: 'Google Scholar', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./scholarGoogle').search(q, ak),
  },
  {
    id: 'yippy', label: 'Yippy', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./yippy').search(q, ak),
  },
  {
    id: 'exactseek', label: 'ExactSeek', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./exactseek').search(q, ak),
  },
  {
    id: 'alltheinternet', label: 'AllTheInternet', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./alltheinternet').search(q, ak),
  },

  // ── ADDITIONAL CORE ───────────────────────────────────────────────────────
  {
    id: 'exa', label: 'Exa AI', tier: 'core', requiresKey: 'exa',
    search: (q, ak) => require('./exa').search(q, ak),
  },
  {
    id: 'perplexity', label: 'Perplexity AI', tier: 'core', requiresKey: 'perplexity',
    search: (q, ak) => require('./perplexity').search(q, ak),
  },

  // ── ADDITIONAL OPEN ───────────────────────────────────────────────────────
  {
    id: 'social-profiles', label: 'Social Profile Checker', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./socialProfiles').search(q, ak),
  },
  {
    id: 'arxiv', label: 'ArXiv', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./arxiv').search(q, ak),
  },
  {
    id: 'lens', label: 'Lens.org', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./lens').search(q, ak),
  },
  {
    id: 'orcid', label: 'ORCID', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./orcid').search(q, ak),
  },
  {
    id: 'stract', label: 'Stract', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./stract').search(q, ak),
  },
  {
    id: 'crowdview', label: 'CrowdView', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./crowdview').search(q, ak),
  },
  {
    id: 'yacy', label: 'YaCy', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./yacy').search(q, ak),
  },
  {
    id: 'europeana', label: 'Europeana', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./europeana').search(q, ak),
  },
  {
    id: 'jstor', label: 'JSTOR', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./jstor').search(q, ak),
  },
  {
    id: 'companies-house', label: 'UK Companies House', tier: 'open', requiresKey: null,
    search: (q, ak) => require('./companieshouse').search(q, ak),
  },

  // ── ADDITIONAL OSINT ──────────────────────────────────────────────────────
  {
    id: 'tineye', label: 'TinEye', tier: 'osint', requiresKey: 'tineye',
    search: (q, ak) => require('./tineye').search(q, ak),
  },

  // ── ADDITIONAL REGIONAL ───────────────────────────────────────────────────
  {
    id: 'mail.ru', label: 'Mail.ru', tier: 'regional', requiresKey: null,
    search: (q, ak) => require('./mailru').search(q, ak),
  },
  {
    id: 'rambler', label: 'Rambler', tier: 'regional', requiresKey: null,
    search: (q, ak) => require('./rambler').search(q, ak),
  },

  // ── ADDITIONAL META ───────────────────────────────────────────────────────
  {
    id: 'yahoo', label: 'Yahoo', tier: 'meta', requiresKey: null,
    search: (q, ak) => require('./yahoo').search(q, ak),
  },
  {
    id: 'gibiru', label: 'Gibiru', tier: 'meta', requiresKey: null,
    search: (q, ak) => require('./gibiru').search(q, ak),
  },
  {
    id: 'freespoke', label: 'Freespoke', tier: 'meta', requiresKey: null,
    search: (q, ak) => require('./freespoke').search(q, ak),
  },
  {
    id: 'mamma', label: 'Mamma', tier: 'meta', requiresKey: null,
    search: (q, ak) => require('./mamma').search(q, ak),
  },
  {
    id: 'you.com', label: 'You.com', tier: 'meta', requiresKey: null,
    search: (q, ak) => require('./youcom').search(q, ak),
  },

  // ── ADDITIONAL OBSCURE ────────────────────────────────────────────────────
  {
    id: 'oscobo', label: 'Oscobo', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./oscobo').search(q, ak),
  },
  {
    id: 'searchencrypt', label: 'SearchEncrypt', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./searchencrypt').search(q, ak),
  },
  {
    id: 'info', label: 'Info.com', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./info').search(q, ak),
  },
  {
    id: 'searchalot', label: 'SearchAlot', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./searchalot').search(q, ak),
  },
  {
    id: 'anoox', label: 'Anoox', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./anoox').search(q, ak),
  },
  {
    id: 'secretsearch', label: 'Secret Search Engine Labs', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./secretsearch').search(q, ak),
  },
  {
    id: 'blog-search', label: 'Blog Search', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./blogsearch').search(q, ak),
  },
  {
    id: 'findsounds', label: 'FindSounds', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./findsounds').search(q, ak),
  },
  {
    id: 'rpmfind', label: 'RPMFind', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./rpmfind').search(q, ak),
  },
  {
    id: 'worldwidescience', label: 'WorldWideScience', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./worldwidescience').search(q, ak),
  },
  {
    id: 'scienceopen', label: 'ScienceOpen', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./scienceopen').search(q, ak),
  },
  {
    id: 'krugle', label: 'Krugle', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./krugle').search(q, ak),
  },
  {
    id: 'researchgate', label: 'ResearchGate', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./researchgate').search(q, ak),
  },
  {
    id: 'academia', label: 'Academia.edu', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./academia').search(q, ak),
  },
  {
    id: 'ssrn', label: 'SSRN', tier: 'obscure', requiresKey: null,
    search: (q, ak) => require('./ssrn').search(q, ak),
  },
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
