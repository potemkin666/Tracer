globalThis.TRACER_ENGINE_METADATA = {
  "keyDefs": [
    {
      "id": "brave",
      "label": "BRAVE KEY"
    },
    {
      "id": "kagi",
      "label": "KAGI KEY"
    },
    {
      "id": "bing",
      "label": "BING KEY"
    },
    {
      "id": "google",
      "label": "GOOGLE KEY"
    },
    {
      "id": "googleCx",
      "label": "GOOGLE CX"
    },
    {
      "id": "serpapi",
      "label": "SERPAPI KEY"
    },
    {
      "id": "mojeek",
      "label": "MOJEEK KEY"
    },
    {
      "id": "exa",
      "label": "EXA KEY"
    },
    {
      "id": "perplexity",
      "label": "PERPLEXITY KEY"
    },
    {
      "id": "shodan",
      "label": "SHODAN KEY"
    },
    {
      "id": "censysId",
      "label": "CENSYS ID"
    },
    {
      "id": "censysSecret",
      "label": "CENSYS SECRET"
    },
    {
      "id": "hunter",
      "label": "HUNTER KEY"
    },
    {
      "id": "intelx",
      "label": "INTELX KEY"
    },
    {
      "id": "publicwww",
      "label": "PUBLICWWW KEY"
    },
    {
      "id": "tineye",
      "label": "TINEYE KEY"
    },
    {
      "id": "dehashed",
      "label": "DEHASHED email:key"
    },
    {
      "id": "hibp",
      "label": "HIBP API KEY"
    },
    {
      "id": "greynoise",
      "label": "GREYNOISE KEY"
    },
    {
      "id": "yandex",
      "label": "YANDEX user:key"
    },
    {
      "id": "naverClientId",
      "label": "NAVER CLIENT ID"
    },
    {
      "id": "naverClientSecret",
      "label": "NAVER SECRET"
    },
    {
      "id": "metager",
      "label": "METAGER KEY"
    },
    {
      "id": "swisscows",
      "label": "SWISSCOWS KEY"
    },
    {
      "id": "listennotes",
      "label": "LISTENNOTES KEY"
    },
    {
      "id": "searxngUrl",
      "label": "SEARXNG INSTANCE URL"
    }
  ],
  "standalone": {
    "openFetchers": [
      "wikipedia",
      "wikidata",
      "github-users",
      "github-repos",
      "hackernews",
      "stackoverflow",
      "archive.org",
      "openlibrary",
      "pubmed",
      "duckduckgo",
      "npm",
      "openalex",
      "semantic-scholar",
      "crossref",
      "orcid",
      "wayback",
      "arxiv",
      "core",
      "europeana",
      "nominatim",
      "doaj",
      "wikibooks",
      "commons",
      "google-books",
      "zenodo",
      "datacite",
      "openverse",
      "packagist",
      "rubygems",
      "crates",
      "musicbrainz",
      "gbif",
      "google-scholar",
      "gitlab-users",
      "codeberg-users",
      "bluesky",
      "mastodon",
      "keybase",
      "gravatar",
      "reddit-users",
      "stackexchange-users",
      "lichess",
      "marginalia",
      "wiby"
    ],
    "keyBackedFetchers": [
      "brave",
      "google",
      "serpapi",
      "shodan",
      "hunter",
      "intelx",
      "exa",
      "mojeek",
      "hibp",
      "greynoise",
      "searxng"
    ],
    "sourceTierMap": {
      "wikipedia": "open",
      "wikidata": "open",
      "github": "open",
      "hackernews": "open",
      "stackoverflow": "open",
      "archive.org": "open",
      "openlibrary": "open",
      "pubmed": "open",
      "npm": "open",
      "arxiv": "open",
      "core": "open",
      "europeana": "open",
      "nominatim": "open",
      "doaj": "open",
      "wikibooks": "open",
      "commons": "open",
      "google-books": "open",
      "zenodo": "open",
      "datacite": "open",
      "openverse": "open",
      "packagist": "open",
      "rubygems": "open",
      "crates": "open",
      "musicbrainz": "open",
      "gbif": "open",
      "google-scholar": "open",
      "gitlab": "social",
      "codeberg": "social",
      "bluesky": "social",
      "mastodon": "social",
      "keybase": "social",
      "gravatar": "social",
      "reddit-users": "social",
      "stackexchange-users": "social",
      "reddit": "social",
      "lichess": "social",
      "marginalia": "open",
      "wiby": "open",
      "wayback": "wayback"
    }
  },
  "serverConnectors": [
    {
      "id": "brave",
      "label": "Brave Search",
      "tier": "core",
      "requiresKey": "brave",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "serpapi",
      "label": "SerpAPI",
      "tier": "core",
      "requiresKey": "serpapi",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "mojeek",
      "label": "Mojeek",
      "tier": "core",
      "requiresKey": "mojeek",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "kagi",
      "label": "Kagi",
      "tier": "core",
      "requiresKey": "kagi",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "bing",
      "label": "Bing",
      "tier": "core",
      "requiresKey": "bing",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "google",
      "label": "Google Custom Search",
      "tier": "core",
      "requiresKey": [
        "google",
        "googleCx"
      ],
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "metager",
      "label": "MetaGer",
      "tier": "core",
      "requiresKey": "metager",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "swisscows",
      "label": "Swisscows",
      "tier": "core",
      "requiresKey": "swisscows",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "listennotes",
      "label": "Listen Notes",
      "tier": "core",
      "requiresKey": "listennotes",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "exa",
      "label": "Exa AI",
      "tier": "core",
      "requiresKey": "exa",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "perplexity",
      "label": "Perplexity AI",
      "tier": "core",
      "requiresKey": "perplexity",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "duckduckgo",
      "label": "DuckDuckGo",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 10000,
        "retries": 1
      }
    },
    {
      "id": "searxng",
      "label": "SearXNG",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "marginalia",
      "label": "Marginalia",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "wiby",
      "label": "Wiby",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "qwant",
      "label": "Qwant",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "yep",
      "label": "Yep",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "searchcode",
      "label": "SearchCode",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "grep.app",
      "label": "grep.app",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "openverse",
      "label": "Openverse",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 20000,
        "retries": 1
      }
    },
    {
      "id": "base",
      "label": "BASE",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "crt.sh",
      "label": "crt.sh",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "urlscan",
      "label": "urlscan.io",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "opencorporates",
      "label": "OpenCorporates",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 20000,
        "retries": 1
      }
    },
    {
      "id": "opensanctions",
      "label": "OpenSanctions",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "semantic-scholar",
      "label": "Semantic Scholar",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "crossref",
      "label": "CrossRef",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "openalex",
      "label": "OpenAlex",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "worldcat",
      "label": "WorldCat",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 20000,
        "retries": 1
      }
    },
    {
      "id": "ahmia",
      "label": "Ahmia",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "carrot2",
      "label": "Carrot2",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "whats-my-name",
      "label": "What's My Name",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "social-searcher",
      "label": "Social Searcher",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "social-profiles",
      "label": "Social Profile Checker",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "arxiv",
      "label": "ArXiv",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "lens",
      "label": "Lens.org",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "orcid",
      "label": "ORCID",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "stract",
      "label": "Stract",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "crowdview",
      "label": "CrowdView",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "yacy",
      "label": "YaCy",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "europeana",
      "label": "Europeana",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 20000,
        "retries": 1
      }
    },
    {
      "id": "jstor",
      "label": "JSTOR",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 20000,
        "retries": 1
      }
    },
    {
      "id": "companies-house",
      "label": "UK Companies House",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "google-maps",
      "label": "Google Maps",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "google-books",
      "label": "Google Books",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "bing-maps",
      "label": "Bing Maps",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "yandex-maps",
      "label": "Yandex Maps",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "baidu-index",
      "label": "Baidu Index",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "weixin-sogou",
      "label": "Weixin Sogou",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "tusksearch",
      "label": "TuskSearch",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "excite",
      "label": "Excite",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "biznar",
      "label": "Biznar",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "mednar",
      "label": "MedNar",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "scienceresearch",
      "label": "ScienceResearch",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "kiddle",
      "label": "Kiddle",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "petalsearch",
      "label": "Petal Search",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "grok",
      "label": "Grok",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "loc-gov",
      "label": "Library of Congress",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "hathitrust",
      "label": "HathiTrust",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "british-museum",
      "label": "British Museum",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "royal-collection",
      "label": "Royal Collection Trust",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "british-library",
      "label": "British Library",
      "tier": "open",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "shodan",
      "label": "Shodan",
      "tier": "osint",
      "requiresKey": "shodan",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "censys",
      "label": "Censys",
      "tier": "osint",
      "requiresKey": [
        "censysId",
        "censysSecret"
      ],
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "hunter",
      "label": "Hunter.io",
      "tier": "osint",
      "requiresKey": "hunter",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "intelx",
      "label": "IntelX",
      "tier": "osint",
      "requiresKey": "intelx",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "publicwww",
      "label": "PublicWWW",
      "tier": "osint",
      "requiresKey": "publicwww",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "tineye",
      "label": "TinEye",
      "tier": "osint",
      "requiresKey": "tineye",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "dehashed",
      "label": "DeHashed",
      "tier": "osint",
      "requiresKey": "dehashed",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "haveibeenpwned",
      "label": "Have I Been Pwned",
      "tier": "osint",
      "requiresKey": "hibp",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "greynoise",
      "label": "GreyNoise",
      "tier": "osint",
      "requiresKey": "greynoise",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "pimeyes",
      "label": "PimEyes",
      "tier": "osint",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "libraries-io",
      "label": "Libraries.io",
      "tier": "osint",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "wolfram-alpha",
      "label": "Wolfram Alpha",
      "tier": "osint",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "netlas",
      "label": "Netlas",
      "tier": "osint",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "yandex",
      "label": "Yandex",
      "tier": "regional",
      "requiresKey": "yandex",
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "baidu",
      "label": "Baidu",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "naver",
      "label": "Naver",
      "tier": "regional",
      "requiresKey": [
        "naverClientId",
        "naverClientSecret"
      ],
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "sogou",
      "label": "Sogou",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "so360",
      "label": "So.com (360)",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "seznam",
      "label": "Seznam",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "mail.ru",
      "label": "Mail.ru",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "rambler",
      "label": "Rambler",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "no-1881",
      "label": "1881.no",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gulesider",
      "label": "Gule Sider",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "kvasir",
      "label": "Kvasir",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "sol-no",
      "label": "Sol.no",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "brreg",
      "label": "Brønnøysundregistrene",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "proff-no",
      "label": "Proff.no",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "norge-no",
      "label": "Norge.no",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "oria-no",
      "label": "Oria",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "digitalarkivet",
      "label": "Digitalarkivet",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nidirect",
      "label": "NIDirect",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "proni-street",
      "label": "PRONI Street Directories",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nibusinessinfo",
      "label": "NI Business Info",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nifed",
      "label": "NIFED",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "linkupni",
      "label": "LinkUpNI",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nijobs",
      "label": "NIJobs",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "propertypal",
      "label": "PropertyPal",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "propertynews",
      "label": "PropertyNews",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "4ni",
      "label": "4NI",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "callupcontact",
      "label": "CallUpContact NI",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "belfasttelegraph",
      "label": "Belfast Telegraph",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "irishnews",
      "label": "Irish News",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "sluggerotoole",
      "label": "Slugger O'Toole",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "genesreunited",
      "label": "Genes Reunited",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "thegazette",
      "label": "The Gazette",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "kvk",
      "label": "KVK (Dutch Chamber)",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "business-gov-nl",
      "label": "Business.gov.nl",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "telefoonboek",
      "label": "Telefoonboek",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "detelefoongids",
      "label": "De Telefoongids",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "goudengids",
      "label": "Gouden Gids",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "telefoongids-nl",
      "label": "Telefoongids-NL",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "kompass-nl",
      "label": "Kompass NL",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "dutchregistry",
      "label": "Dutch Registry",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "adhocdata",
      "label": "Ad Hoc Data",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "kadaster",
      "label": "Kadaster",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "archieven-nl",
      "label": "Archieven.nl",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "openarchieven",
      "label": "Open Archieven",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "wiewaswie",
      "label": "WieWasWie",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "genealogie-online",
      "label": "Genealogie Online",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "delpher",
      "label": "Delpher",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nieuwe-instituut",
      "label": "Het Nieuwe Instituut",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "open-overheid",
      "label": "Open Overheid",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "rijksoverheid",
      "label": "Rijksoverheid",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "werk-nl",
      "label": "Werk.nl",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nationalevacaturebank",
      "label": "Nationale Vacaturebank",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "zoeken-nl",
      "label": "Zoeken.nl",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gov-wales",
      "label": "Gov.Wales",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "business-wales",
      "label": "Business Wales",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "library-wales",
      "label": "National Library of Wales",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "archives-wales",
      "label": "Archives Wales",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "rcahmw",
      "label": "RCAHMW Coflein",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "cadw",
      "label": "Cadw",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "walesonline-dir",
      "label": "WalesOnline Directory",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "findwales",
      "label": "FindWales",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "wales-business-network",
      "label": "Wales Business Network",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "libraries-wales",
      "label": "Libraries Wales",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "national-archives-uk",
      "label": "UK National Archives",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "senedd",
      "label": "Senedd Wales",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "old-bailey",
      "label": "Old Bailey Online",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "layers-of-london",
      "label": "Layers of London",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "booth-poverty-map",
      "label": "Booth Poverty Map",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "locating-london",
      "label": "Locating London",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "london-picture-archive",
      "label": "London Picture Archive",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "british-history-online",
      "label": "British History Online",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "map-of-london",
      "label": "Map of Early Modern London",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gm-lives",
      "label": "GM Lives",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "fireball",
      "label": "Fireball",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gelbeseiten",
      "label": "Gelbe Seiten",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "dastelefonbuch",
      "label": "Das Telefonbuch",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "dasoertliche",
      "label": "Das Örtliche",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "de-11880",
      "label": "11880.com",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "meinestadt",
      "label": "meinestadt.de",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "web-de",
      "label": "Web.de",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "t-online",
      "label": "T-Online",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gesis",
      "label": "GESIS",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "bund-de",
      "label": "Bund.de",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "goldenpages-ie",
      "label": "Golden Pages IE",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "businessworld-ie",
      "label": "Business World IE",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "solocheck",
      "label": "SoloCheck",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "cro-ie",
      "label": "CRO Ireland",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gov-ie",
      "label": "Gov.ie",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "data-gov-ie",
      "label": "Data.gov.ie",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "cso-ie",
      "label": "CSO Ireland",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "national-archives-ie",
      "label": "National Archives IE",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nli-ie",
      "label": "National Library of Ireland",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "askaboutireland",
      "label": "Ask About Ireland",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "rootsireland",
      "label": "Roots Ireland",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "findmypast-ie",
      "label": "FindMyPast IE",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "myhome-ie",
      "label": "MyHome.ie",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "daft-ie",
      "label": "Daft.ie",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "jobs-ie",
      "label": "Jobs.ie",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "irishjobs",
      "label": "IrishJobs",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "rip-ie",
      "label": "RIP.ie",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "yellowpages-eg",
      "label": "Yellow Pages Egypt",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "dalil140",
      "label": "Dalil 140",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "forasna",
      "label": "Forasna",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "wuzzuf",
      "label": "Wuzzuf",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "aqarmap",
      "label": "Aqarmap",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "dubizzle-eg",
      "label": "Dubizzle Egypt",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "olx-eg",
      "label": "OLX Egypt",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "egypt-business",
      "label": "Egypt Business",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "egyptian-industry",
      "label": "Egyptian Industry",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "idsc-eg",
      "label": "IDSC Egypt",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "invest-egypt",
      "label": "Invest in Egypt",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "capmas",
      "label": "CAPMAS Egypt",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "egx",
      "label": "Egyptian Exchange",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "whitepages-be",
      "label": "White Pages Belgium",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "acp-cd",
      "label": "ACP Congo",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "rcst-cd",
      "label": "RCST Congo",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "odd-dashboard-cd",
      "label": "ODD Dashboard Congo",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "inrb-cd",
      "label": "INRB Congo",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "drc-precop-cd",
      "label": "DRC PreCOP Environment",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "julisha-cd",
      "label": "Julisha Congo",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "pnmls-cd",
      "label": "PNMLS Documentation",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "infoleg-ar",
      "label": "InfoLeg Argentina",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "justicia-ar",
      "label": "Argentina Justicia",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "mseg-ar",
      "label": "MSEG Buenos Aires",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "pjn-ar",
      "label": "PJN Argentina",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "cij-ar",
      "label": "CIJ Argentina",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "boletin-oficial-ar",
      "label": "Boletín Oficial Argentina",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "afip-ar",
      "label": "AFIP Argentina",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "datos-abiertos-ar",
      "label": "Datos Abiertos Argentina",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "migraciones-ar",
      "label": "Migraciones Argentina",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "comprar-ar",
      "label": "Comprar Argentina",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "politia-ro",
      "label": "Romanian Police",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "politia-frontiera-ro",
      "label": "Border Police Romania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "onrc-ro",
      "label": "ONRC Romania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "listafirme-ro",
      "label": "Lista Firme",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "romanian-companies",
      "label": "Romanian Companies",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "arhiva-nationala-ro",
      "label": "National Archives Romania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "biblioteca-nationala-ro",
      "label": "National Library Romania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "e-licitatie-ro",
      "label": "e-Licitatie Romania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "anaf-ro",
      "label": "ANAF Romania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "portal-just-ro",
      "label": "Portal Just Romania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "rejust-ro",
      "label": "ReJust Romania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "rolii-ro",
      "label": "ROLII Romania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "genealogica-ro",
      "label": "Genealogica Romania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "sicap-ro",
      "label": "SICAP Romania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "shabait-er",
      "label": "Shabait Eritrea",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "eritrea-info-er",
      "label": "Eritrea Information",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "eritrea-yellow-pages",
      "label": "Eritrea Yellow Pages",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "erilaw-er",
      "label": "EriLaw",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "worldlii-er",
      "label": "WorldLII Eritrea",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "irandoc-ir",
      "label": "IranDoc",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "sid-ir",
      "label": "SID Iran",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nlai-ir",
      "label": "National Library Iran",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "jref-ir",
      "label": "JREF Iran",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "vlist-ir",
      "label": "VList Iran",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "company-register-ir",
      "label": "Company Register Iran",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "symposia-ir",
      "label": "Symposia Iran",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "trade-with-iran",
      "label": "Trade With Iran",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "mfa-ir",
      "label": "MFA Iran",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "iran-law-ir",
      "label": "Iran Law Journal",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "lbr-lu",
      "label": "LBR Luxembourg",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "guichet-lu",
      "label": "Guichet Luxembourg",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "legilux-lu",
      "label": "Legilux",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "justice-lu",
      "label": "Justice Luxembourg",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "data-lu",
      "label": "Data Luxembourg",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "geoportail-lu",
      "label": "Geoportail Luxembourg",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "police-lu",
      "label": "Police Luxembourg",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "editus-lu",
      "label": "Editus Luxembourg",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "proff-lu",
      "label": "Proff Luxembourg",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "archives-lu",
      "label": "Archives Luxembourg",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "bnl-lu",
      "label": "National Library Luxembourg",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "cc-lu",
      "label": "Chamber of Commerce Luxembourg",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "harrow-planning",
      "label": "Harrow Planning",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "richmond-planning",
      "label": "Richmond Planning",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "wandsworth-planning",
      "label": "Wandsworth Planning",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "merton-planning",
      "label": "Merton Planning",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "bromley-planning",
      "label": "Bromley Planning",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "sutton-planning",
      "label": "Sutton Planning",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "kingston-planning",
      "label": "Kingston Planning",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "enfield-planning",
      "label": "Enfield Planning",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "hackney-archives",
      "label": "Hackney Archives",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "london-archives",
      "label": "London Archives",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "met-police",
      "label": "Metropolitan Police",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gmp-police",
      "label": "Greater Manchester Police",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "cornwall-gov",
      "label": "Cornwall Council",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "devon-cornwall-police",
      "label": "Devon & Cornwall Police",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gov-im",
      "label": "Isle of Man Gov",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "planning-im",
      "label": "Isle of Man Planning",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "birmingham-planning",
      "label": "Birmingham Planning",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "dol-ny",
      "label": "NY DOL Contractor Registry",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nyscr-ny",
      "label": "NY State Contract Reporter",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "dmv-ny",
      "label": "NY DMV",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nysm-ny",
      "label": "NY State Museum",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "pagesjaunes-fr",
      "label": "PagesJaunes",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "118712-fr",
      "label": "118712",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "118000-fr",
      "label": "118000",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "orange-annuaire-fr",
      "label": "Orange Annuaire",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "societe-fr",
      "label": "Societe.com",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "verif-fr",
      "label": "Verif.com",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "infobel-fr",
      "label": "Infobel France",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "europages-fr",
      "label": "Europages France",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "kompass-fr",
      "label": "Kompass France",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "service-public-fr",
      "label": "Service-Public.fr",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "jdn-fr",
      "label": "Journal du Net",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "recherche-fr",
      "label": "Recherche.fr",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "voila-fr",
      "label": "Voila.fr",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "onet-pl",
      "label": "Onet.pl",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "wp-pl",
      "label": "Wirtualna Polska",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "interia-pl",
      "label": "Interia.pl",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gazeta-pl",
      "label": "Gazeta.pl",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "whitepages-pl",
      "label": "WhitePages Poland",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "biznes-gov-pl",
      "label": "Biznes.gov.pl",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "ceidg-pl",
      "label": "CEIDG Poland",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "regon-pl",
      "label": "REGON Poland",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "krs-pl",
      "label": "KRS Poland",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "knf-pl",
      "label": "KNF Poland",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "uprp-pl",
      "label": "UPRP Poland",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "ppm-pl",
      "label": "PPM.edu.pl",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "pkt-pl",
      "label": "PKT.pl",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "zumi-pl",
      "label": "Zumi.pl",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "o2-pl",
      "label": "O2.pl",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "search-ch",
      "label": "Search.ch",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "local-ch",
      "label": "Local.ch",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "tiger-ch",
      "label": "Tiger.ch",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "daum-kr",
      "label": "Daum",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "kakao-map-kr",
      "label": "Kakao Map",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nate-kr",
      "label": "Nate",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "zum-kr",
      "label": "Zum",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "11st-kr",
      "label": "11st",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "coupang-kr",
      "label": "Coupang",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gmarket-kr",
      "label": "Gmarket",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "auction-kr",
      "label": "Auction",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "jobkorea-kr",
      "label": "JobKorea",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "saramin-kr",
      "label": "Saramin",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "114-kr",
      "label": "114.co.kr",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "koreatechdesk",
      "label": "Korea Tech Desk",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nrs-catalogue",
      "label": "NRS Online Catalogue",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "scotlands-people",
      "label": "ScotlandsPeople",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "trove-scot",
      "label": "Trove.scot",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "canmore",
      "label": "Canmore",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "pastmap",
      "label": "PastMap",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nls-collections",
      "label": "NLS Collections",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nls-manuscripts",
      "label": "NLS Manuscripts",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nls-maps",
      "label": "NLS Maps",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "electric-scotland",
      "label": "Electric Scotland",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "scottish-indexes",
      "label": "Scottish Indexes",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "directories-scot",
      "label": "Directories.scot",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "opendata-scot",
      "label": "OpenData.scot",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "stirling-archives",
      "label": "Stirling Archives",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "mapgenie-uk",
      "label": "MapGenie UK",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "debida-diligencia-pe",
      "label": "Debida Diligencia Peru",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "pj-pe",
      "label": "Poder Judicial Peru",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "sunarp-pe",
      "label": "SUNARP Peru",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "osce-pe",
      "label": "OSCE Peru",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "sunat-pe",
      "label": "SUNAT Peru",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "migraciones-pe",
      "label": "Migraciones Peru",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "sbs-pe",
      "label": "SBS Peru",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "jne-pe",
      "label": "JNE Peru",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "politi-dk",
      "label": "Danish Police",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "domstol-dk",
      "label": "Danish Courts",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "retsinformation-dk",
      "label": "Retsinformation",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "virk-dk",
      "label": "Virk.dk",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "cvr-dk",
      "label": "CVR Denmark",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "tinglysning-dk",
      "label": "Tinglysning Denmark",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "skat-dk",
      "label": "Skat Denmark",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "proff-dk",
      "label": "Proff.dk",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "krak-dk",
      "label": "Krak.dk",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "boligen-dk",
      "label": "Boligsiden Denmark",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "police-lt",
      "label": "Lithuanian Police",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "ird-lt",
      "label": "IRD Lithuania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "lkpb-lt",
      "label": "LKPB Lithuania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "teismai-lt",
      "label": "Lithuanian Courts",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "e-teismas-lt",
      "label": "Lithuanian E-Court",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "liteko-lt",
      "label": "LITEKO Court Decisions",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "lrs-lt",
      "label": "Lithuanian Parliament",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "infolex-lt",
      "label": "Infolex Legal",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "rekvizitai-lt",
      "label": "Rekvizitai Company Search",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "registru-centras-lt",
      "label": "Centre of Registers Lithuania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "vmi-lt",
      "label": "Lithuanian Tax Inspectorate",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "cpo-lt",
      "label": "CPO Lithuania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "cvpp-lt",
      "label": "CVPP Public Procurement",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "lb-lt",
      "label": "Bank of Lithuania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "fntt-lt",
      "label": "FNTT Lithuania",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "lrv-open-data-lt",
      "label": "Lithuanian Open Data",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "muitine-lt",
      "label": "Lithuanian Customs",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "e-tar-lt",
      "label": "Lithuanian Legal Acts Register",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "azdor-az",
      "label": "AZ Unclaimed Property",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "missing-money",
      "label": "MissingMoney",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "pima-inmate",
      "label": "Pima County Inmate Search",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "phoenix-open-data",
      "label": "Phoenix Open Data",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "phoenix-public-records",
      "label": "Phoenix Public Records",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "az-geo",
      "label": "AZ Geospatial Data",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "azdhs-gis",
      "label": "AZ Health Services GIS",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "phoenix-chamber",
      "label": "Phoenix Chamber",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "chandler-chamber",
      "label": "Chandler Chamber",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "just-go-az",
      "label": "Just Go Arizona",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "visit-arizona",
      "label": "Visit Arizona",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "azsos-trade-names",
      "label": "AZ Secretary of State Trade Names",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "azcc-business",
      "label": "AZ Corporation Commission",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "az-league-jobs",
      "label": "AZ League Jobs",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "phx-soul",
      "label": "PHXSoul Business Directory",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "az-job-connection",
      "label": "AZ Job Connection",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "arizona-at-work",
      "label": "Arizona@Work",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "des-az-jobs",
      "label": "AZ DES Employment",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "az-corrections",
      "label": "AZ Corrections Inmate Search",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "azdps",
      "label": "AZ Dept of Public Safety",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "icrime-watch",
      "label": "iCrimeWatch AZ",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "nsopw",
      "label": "National Sex Offender Registry",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "az-archives-online",
      "label": "AZ Archives Online",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "az-library",
      "label": "AZ State Library",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "uk-data-service",
      "label": "UK Data Service",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "paul-mellon-centre",
      "label": "Paul Mellon Centre",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "british-newspaper-archive",
      "label": "British Newspaper Archive",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gazetteer-uk",
      "label": "Gazetteer UK",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "genuki",
      "label": "GENUKI",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "british-listed-buildings",
      "label": "British Listed Buildings",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "leigh-surrey-history",
      "label": "Leigh & District History",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "huncote-history",
      "label": "Huncote Parish History",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "appleby-magna-history",
      "label": "Appleby Magna History",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "flitwick-history",
      "label": "History of Flitwick",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "bblhs",
      "label": "Beds & Bucks Local History Society",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "cemetery-scribes",
      "label": "Cemetery Scribes",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "community-archives",
      "label": "Community Archives",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "the-old-school",
      "label": "The Old School Archive",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "local-history-links",
      "label": "Local History Links",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "ukbmd-parish",
      "label": "UKBMD Parish Records",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "historic-england",
      "label": "Historic England",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "exploring-surreys-past",
      "label": "Exploring Surrey's Past",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "old-maps-online",
      "label": "Old Maps Online",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "fiva-bo",
      "label": "FIVA Bolivia Tax",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "siat-bo",
      "label": "SIAT Bolivia Tax Info",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "senapi-bo",
      "label": "SENAPI Bolivia IP",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "autoridad-minera-bo",
      "label": "Bolivia Mining Authority",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gaceta-santa-cruz-bo",
      "label": "Santa Cruz Official Gazette",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "bcb-bo",
      "label": "Central Bank of Bolivia",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "sicoes-bo",
      "label": "SICOES Bolivia Procurement",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "open-camden",
      "label": "Camden Open Data",
      "tier": "regional",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "startpage",
      "label": "Startpage",
      "tier": "meta",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "dogpile",
      "label": "Dogpile",
      "tier": "meta",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "metacrawler",
      "label": "MetaCrawler",
      "tier": "meta",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "etools",
      "label": "eTools",
      "tier": "meta",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "ecosia",
      "label": "Ecosia",
      "tier": "meta",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "presearch",
      "label": "Presearch",
      "tier": "meta",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "webcrawler",
      "label": "WebCrawler",
      "tier": "meta",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "faganfinder",
      "label": "FaganFinder",
      "tier": "meta",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "yahoo",
      "label": "Yahoo",
      "tier": "meta",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gibiru",
      "label": "Gibiru",
      "tier": "meta",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "freespoke",
      "label": "Freespoke",
      "tier": "meta",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "mamma",
      "label": "Mamma",
      "tier": "meta",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "you.com",
      "label": "You.com",
      "tier": "meta",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "refseek",
      "label": "RefSeek",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "lycos",
      "label": "Lycos",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "millionshort",
      "label": "MillionShort",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "boardreader",
      "label": "BoardReader",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "sourcegraph",
      "label": "Sourcegraph",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "scholar-google",
      "label": "Google Scholar",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "yippy",
      "label": "Yippy",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "exactseek",
      "label": "ExactSeek",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "alltheinternet",
      "label": "AllTheInternet",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "oscobo",
      "label": "Oscobo",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "searchencrypt",
      "label": "SearchEncrypt",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "info",
      "label": "Info.com",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "searchalot",
      "label": "SearchAlot",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "anoox",
      "label": "Anoox",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "secretsearch",
      "label": "Secret Search Engine Labs",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "blog-search",
      "label": "Blog Search",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "findsounds",
      "label": "FindSounds",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "rpmfind",
      "label": "RPMFind",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "worldwidescience",
      "label": "WorldWideScience",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "scienceopen",
      "label": "ScienceOpen",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "krugle",
      "label": "Krugle",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "researchgate",
      "label": "ResearchGate",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "academia",
      "label": "Academia.edu",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "ssrn",
      "label": "SSRN",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gigablast",
      "label": "Gigablast",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "webwiki",
      "label": "WebWiki",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "2lingual",
      "label": "2lingual",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "aol",
      "label": "AOL Search",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "exalead",
      "label": "Exalead",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "givewater",
      "label": "GiveWater",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    },
    {
      "id": "gnod",
      "label": "Gnod",
      "tier": "obscure",
      "requiresKey": null,
      "runtime": {
        "timeoutMs": 15000,
        "retries": 0
      }
    }
  ],
  "serverTierMap": {
    "brave": "core",
    "serpapi": "core",
    "mojeek": "core",
    "kagi": "core",
    "bing": "core",
    "google": "core",
    "metager": "core",
    "swisscows": "core",
    "listennotes": "core",
    "exa": "core",
    "perplexity": "core",
    "duckduckgo": "open",
    "searxng": "open",
    "marginalia": "open",
    "wiby": "open",
    "qwant": "open",
    "yep": "open",
    "searchcode": "open",
    "grep.app": "open",
    "openverse": "open",
    "base": "open",
    "crt.sh": "open",
    "urlscan": "open",
    "opencorporates": "open",
    "opensanctions": "open",
    "semantic-scholar": "open",
    "crossref": "open",
    "openalex": "open",
    "worldcat": "open",
    "ahmia": "open",
    "carrot2": "open",
    "whats-my-name": "open",
    "social-searcher": "open",
    "social-profiles": "open",
    "arxiv": "open",
    "lens": "open",
    "orcid": "open",
    "stract": "open",
    "crowdview": "open",
    "yacy": "open",
    "europeana": "open",
    "jstor": "open",
    "companies-house": "open",
    "google-maps": "open",
    "google-books": "open",
    "bing-maps": "open",
    "yandex-maps": "open",
    "baidu-index": "open",
    "weixin-sogou": "open",
    "tusksearch": "open",
    "excite": "open",
    "biznar": "open",
    "mednar": "open",
    "scienceresearch": "open",
    "kiddle": "open",
    "petalsearch": "open",
    "grok": "open",
    "loc-gov": "open",
    "hathitrust": "open",
    "british-museum": "open",
    "royal-collection": "open",
    "british-library": "open",
    "shodan": "osint",
    "censys": "osint",
    "hunter": "osint",
    "intelx": "osint",
    "publicwww": "osint",
    "tineye": "osint",
    "dehashed": "osint",
    "haveibeenpwned": "osint",
    "greynoise": "osint",
    "pimeyes": "osint",
    "libraries-io": "osint",
    "wolfram-alpha": "osint",
    "netlas": "osint",
    "yandex": "regional",
    "baidu": "regional",
    "naver": "regional",
    "sogou": "regional",
    "so360": "regional",
    "seznam": "regional",
    "mail.ru": "regional",
    "rambler": "regional",
    "no-1881": "regional",
    "gulesider": "regional",
    "kvasir": "regional",
    "sol-no": "regional",
    "brreg": "regional",
    "proff-no": "regional",
    "norge-no": "regional",
    "oria-no": "regional",
    "digitalarkivet": "regional",
    "nidirect": "regional",
    "proni-street": "regional",
    "nibusinessinfo": "regional",
    "nifed": "regional",
    "linkupni": "regional",
    "nijobs": "regional",
    "propertypal": "regional",
    "propertynews": "regional",
    "4ni": "regional",
    "callupcontact": "regional",
    "belfasttelegraph": "regional",
    "irishnews": "regional",
    "sluggerotoole": "regional",
    "genesreunited": "regional",
    "thegazette": "regional",
    "kvk": "regional",
    "business-gov-nl": "regional",
    "telefoonboek": "regional",
    "detelefoongids": "regional",
    "goudengids": "regional",
    "telefoongids-nl": "regional",
    "kompass-nl": "regional",
    "dutchregistry": "regional",
    "adhocdata": "regional",
    "kadaster": "regional",
    "archieven-nl": "regional",
    "openarchieven": "regional",
    "wiewaswie": "regional",
    "genealogie-online": "regional",
    "delpher": "regional",
    "nieuwe-instituut": "regional",
    "open-overheid": "regional",
    "rijksoverheid": "regional",
    "werk-nl": "regional",
    "nationalevacaturebank": "regional",
    "zoeken-nl": "regional",
    "gov-wales": "regional",
    "business-wales": "regional",
    "library-wales": "regional",
    "archives-wales": "regional",
    "rcahmw": "regional",
    "cadw": "regional",
    "walesonline-dir": "regional",
    "findwales": "regional",
    "wales-business-network": "regional",
    "libraries-wales": "regional",
    "national-archives-uk": "regional",
    "senedd": "regional",
    "old-bailey": "regional",
    "layers-of-london": "regional",
    "booth-poverty-map": "regional",
    "locating-london": "regional",
    "london-picture-archive": "regional",
    "british-history-online": "regional",
    "map-of-london": "regional",
    "gm-lives": "regional",
    "fireball": "regional",
    "gelbeseiten": "regional",
    "dastelefonbuch": "regional",
    "dasoertliche": "regional",
    "de-11880": "regional",
    "meinestadt": "regional",
    "web-de": "regional",
    "t-online": "regional",
    "gesis": "regional",
    "bund-de": "regional",
    "goldenpages-ie": "regional",
    "businessworld-ie": "regional",
    "solocheck": "regional",
    "cro-ie": "regional",
    "gov-ie": "regional",
    "data-gov-ie": "regional",
    "cso-ie": "regional",
    "national-archives-ie": "regional",
    "nli-ie": "regional",
    "askaboutireland": "regional",
    "rootsireland": "regional",
    "findmypast-ie": "regional",
    "myhome-ie": "regional",
    "daft-ie": "regional",
    "jobs-ie": "regional",
    "irishjobs": "regional",
    "rip-ie": "regional",
    "yellowpages-eg": "regional",
    "dalil140": "regional",
    "forasna": "regional",
    "wuzzuf": "regional",
    "aqarmap": "regional",
    "dubizzle-eg": "regional",
    "olx-eg": "regional",
    "egypt-business": "regional",
    "egyptian-industry": "regional",
    "idsc-eg": "regional",
    "invest-egypt": "regional",
    "capmas": "regional",
    "egx": "regional",
    "whitepages-be": "regional",
    "acp-cd": "regional",
    "rcst-cd": "regional",
    "odd-dashboard-cd": "regional",
    "inrb-cd": "regional",
    "drc-precop-cd": "regional",
    "julisha-cd": "regional",
    "pnmls-cd": "regional",
    "infoleg-ar": "regional",
    "justicia-ar": "regional",
    "mseg-ar": "regional",
    "pjn-ar": "regional",
    "cij-ar": "regional",
    "boletin-oficial-ar": "regional",
    "afip-ar": "regional",
    "datos-abiertos-ar": "regional",
    "migraciones-ar": "regional",
    "comprar-ar": "regional",
    "politia-ro": "regional",
    "politia-frontiera-ro": "regional",
    "onrc-ro": "regional",
    "listafirme-ro": "regional",
    "romanian-companies": "regional",
    "arhiva-nationala-ro": "regional",
    "biblioteca-nationala-ro": "regional",
    "e-licitatie-ro": "regional",
    "anaf-ro": "regional",
    "portal-just-ro": "regional",
    "rejust-ro": "regional",
    "rolii-ro": "regional",
    "genealogica-ro": "regional",
    "sicap-ro": "regional",
    "shabait-er": "regional",
    "eritrea-info-er": "regional",
    "eritrea-yellow-pages": "regional",
    "erilaw-er": "regional",
    "worldlii-er": "regional",
    "irandoc-ir": "regional",
    "sid-ir": "regional",
    "nlai-ir": "regional",
    "jref-ir": "regional",
    "vlist-ir": "regional",
    "company-register-ir": "regional",
    "symposia-ir": "regional",
    "trade-with-iran": "regional",
    "mfa-ir": "regional",
    "iran-law-ir": "regional",
    "lbr-lu": "regional",
    "guichet-lu": "regional",
    "legilux-lu": "regional",
    "justice-lu": "regional",
    "data-lu": "regional",
    "geoportail-lu": "regional",
    "police-lu": "regional",
    "editus-lu": "regional",
    "proff-lu": "regional",
    "archives-lu": "regional",
    "bnl-lu": "regional",
    "cc-lu": "regional",
    "harrow-planning": "regional",
    "richmond-planning": "regional",
    "wandsworth-planning": "regional",
    "merton-planning": "regional",
    "bromley-planning": "regional",
    "sutton-planning": "regional",
    "kingston-planning": "regional",
    "enfield-planning": "regional",
    "hackney-archives": "regional",
    "london-archives": "regional",
    "met-police": "regional",
    "gmp-police": "regional",
    "cornwall-gov": "regional",
    "devon-cornwall-police": "regional",
    "gov-im": "regional",
    "planning-im": "regional",
    "birmingham-planning": "regional",
    "dol-ny": "regional",
    "nyscr-ny": "regional",
    "dmv-ny": "regional",
    "nysm-ny": "regional",
    "pagesjaunes-fr": "regional",
    "118712-fr": "regional",
    "118000-fr": "regional",
    "orange-annuaire-fr": "regional",
    "societe-fr": "regional",
    "verif-fr": "regional",
    "infobel-fr": "regional",
    "europages-fr": "regional",
    "kompass-fr": "regional",
    "service-public-fr": "regional",
    "jdn-fr": "regional",
    "recherche-fr": "regional",
    "voila-fr": "regional",
    "onet-pl": "regional",
    "wp-pl": "regional",
    "interia-pl": "regional",
    "gazeta-pl": "regional",
    "whitepages-pl": "regional",
    "biznes-gov-pl": "regional",
    "ceidg-pl": "regional",
    "regon-pl": "regional",
    "krs-pl": "regional",
    "knf-pl": "regional",
    "uprp-pl": "regional",
    "ppm-pl": "regional",
    "pkt-pl": "regional",
    "zumi-pl": "regional",
    "o2-pl": "regional",
    "search-ch": "regional",
    "local-ch": "regional",
    "tiger-ch": "regional",
    "daum-kr": "regional",
    "kakao-map-kr": "regional",
    "nate-kr": "regional",
    "zum-kr": "regional",
    "11st-kr": "regional",
    "coupang-kr": "regional",
    "gmarket-kr": "regional",
    "auction-kr": "regional",
    "jobkorea-kr": "regional",
    "saramin-kr": "regional",
    "114-kr": "regional",
    "koreatechdesk": "regional",
    "nrs-catalogue": "regional",
    "scotlands-people": "regional",
    "trove-scot": "regional",
    "canmore": "regional",
    "pastmap": "regional",
    "nls-collections": "regional",
    "nls-manuscripts": "regional",
    "nls-maps": "regional",
    "electric-scotland": "regional",
    "scottish-indexes": "regional",
    "directories-scot": "regional",
    "opendata-scot": "regional",
    "stirling-archives": "regional",
    "mapgenie-uk": "regional",
    "debida-diligencia-pe": "regional",
    "pj-pe": "regional",
    "sunarp-pe": "regional",
    "osce-pe": "regional",
    "sunat-pe": "regional",
    "migraciones-pe": "regional",
    "sbs-pe": "regional",
    "jne-pe": "regional",
    "politi-dk": "regional",
    "domstol-dk": "regional",
    "retsinformation-dk": "regional",
    "virk-dk": "regional",
    "cvr-dk": "regional",
    "tinglysning-dk": "regional",
    "skat-dk": "regional",
    "proff-dk": "regional",
    "krak-dk": "regional",
    "boligen-dk": "regional",
    "police-lt": "regional",
    "ird-lt": "regional",
    "lkpb-lt": "regional",
    "teismai-lt": "regional",
    "e-teismas-lt": "regional",
    "liteko-lt": "regional",
    "lrs-lt": "regional",
    "infolex-lt": "regional",
    "rekvizitai-lt": "regional",
    "registru-centras-lt": "regional",
    "vmi-lt": "regional",
    "cpo-lt": "regional",
    "cvpp-lt": "regional",
    "lb-lt": "regional",
    "fntt-lt": "regional",
    "lrv-open-data-lt": "regional",
    "muitine-lt": "regional",
    "e-tar-lt": "regional",
    "azdor-az": "regional",
    "missing-money": "regional",
    "pima-inmate": "regional",
    "phoenix-open-data": "regional",
    "phoenix-public-records": "regional",
    "az-geo": "regional",
    "azdhs-gis": "regional",
    "phoenix-chamber": "regional",
    "chandler-chamber": "regional",
    "just-go-az": "regional",
    "visit-arizona": "regional",
    "azsos-trade-names": "regional",
    "azcc-business": "regional",
    "az-league-jobs": "regional",
    "phx-soul": "regional",
    "az-job-connection": "regional",
    "arizona-at-work": "regional",
    "des-az-jobs": "regional",
    "az-corrections": "regional",
    "azdps": "regional",
    "icrime-watch": "regional",
    "nsopw": "regional",
    "az-archives-online": "regional",
    "az-library": "regional",
    "uk-data-service": "regional",
    "paul-mellon-centre": "regional",
    "british-newspaper-archive": "regional",
    "gazetteer-uk": "regional",
    "genuki": "regional",
    "british-listed-buildings": "regional",
    "leigh-surrey-history": "regional",
    "huncote-history": "regional",
    "appleby-magna-history": "regional",
    "flitwick-history": "regional",
    "bblhs": "regional",
    "cemetery-scribes": "regional",
    "community-archives": "regional",
    "the-old-school": "regional",
    "local-history-links": "regional",
    "ukbmd-parish": "regional",
    "historic-england": "regional",
    "exploring-surreys-past": "regional",
    "old-maps-online": "regional",
    "fiva-bo": "regional",
    "siat-bo": "regional",
    "senapi-bo": "regional",
    "autoridad-minera-bo": "regional",
    "gaceta-santa-cruz-bo": "regional",
    "bcb-bo": "regional",
    "sicoes-bo": "regional",
    "open-camden": "regional",
    "startpage": "meta",
    "dogpile": "meta",
    "metacrawler": "meta",
    "etools": "meta",
    "ecosia": "meta",
    "presearch": "meta",
    "webcrawler": "meta",
    "faganfinder": "meta",
    "yahoo": "meta",
    "gibiru": "meta",
    "freespoke": "meta",
    "mamma": "meta",
    "you.com": "meta",
    "refseek": "obscure",
    "lycos": "obscure",
    "millionshort": "obscure",
    "boardreader": "obscure",
    "sourcegraph": "obscure",
    "scholar-google": "obscure",
    "yippy": "obscure",
    "exactseek": "obscure",
    "alltheinternet": "obscure",
    "oscobo": "obscure",
    "searchencrypt": "obscure",
    "info": "obscure",
    "searchalot": "obscure",
    "anoox": "obscure",
    "secretsearch": "obscure",
    "blog-search": "obscure",
    "findsounds": "obscure",
    "rpmfind": "obscure",
    "worldwidescience": "obscure",
    "scienceopen": "obscure",
    "krugle": "obscure",
    "researchgate": "obscure",
    "academia": "obscure",
    "ssrn": "obscure",
    "gigablast": "obscure",
    "webwiki": "obscure",
    "2lingual": "obscure",
    "aol": "obscure",
    "exalead": "obscure",
    "givewater": "obscure",
    "gnod": "obscure"
  },
  "sourceTierMap": {
    "brave": "core",
    "serpapi": "core",
    "mojeek": "core",
    "kagi": "core",
    "bing": "core",
    "google": "core",
    "metager": "core",
    "swisscows": "core",
    "listennotes": "core",
    "exa": "core",
    "perplexity": "core",
    "duckduckgo": "open",
    "searxng": "open",
    "marginalia": "open",
    "wiby": "open",
    "qwant": "open",
    "yep": "open",
    "searchcode": "open",
    "grep.app": "open",
    "openverse": "open",
    "base": "open",
    "crt.sh": "open",
    "urlscan": "open",
    "opencorporates": "open",
    "opensanctions": "open",
    "semantic-scholar": "open",
    "crossref": "open",
    "openalex": "open",
    "worldcat": "open",
    "ahmia": "open",
    "carrot2": "open",
    "whats-my-name": "open",
    "social-searcher": "open",
    "social-profiles": "open",
    "arxiv": "open",
    "lens": "open",
    "orcid": "open",
    "stract": "open",
    "crowdview": "open",
    "yacy": "open",
    "europeana": "open",
    "jstor": "open",
    "companies-house": "open",
    "google-maps": "open",
    "google-books": "open",
    "bing-maps": "open",
    "yandex-maps": "open",
    "baidu-index": "open",
    "weixin-sogou": "open",
    "tusksearch": "open",
    "excite": "open",
    "biznar": "open",
    "mednar": "open",
    "scienceresearch": "open",
    "kiddle": "open",
    "petalsearch": "open",
    "grok": "open",
    "loc-gov": "open",
    "hathitrust": "open",
    "british-museum": "open",
    "royal-collection": "open",
    "british-library": "open",
    "shodan": "osint",
    "censys": "osint",
    "hunter": "osint",
    "intelx": "osint",
    "publicwww": "osint",
    "tineye": "osint",
    "dehashed": "osint",
    "haveibeenpwned": "osint",
    "greynoise": "osint",
    "pimeyes": "osint",
    "libraries-io": "osint",
    "wolfram-alpha": "osint",
    "netlas": "osint",
    "yandex": "regional",
    "baidu": "regional",
    "naver": "regional",
    "sogou": "regional",
    "so360": "regional",
    "seznam": "regional",
    "mail.ru": "regional",
    "rambler": "regional",
    "no-1881": "regional",
    "gulesider": "regional",
    "kvasir": "regional",
    "sol-no": "regional",
    "brreg": "regional",
    "proff-no": "regional",
    "norge-no": "regional",
    "oria-no": "regional",
    "digitalarkivet": "regional",
    "nidirect": "regional",
    "proni-street": "regional",
    "nibusinessinfo": "regional",
    "nifed": "regional",
    "linkupni": "regional",
    "nijobs": "regional",
    "propertypal": "regional",
    "propertynews": "regional",
    "4ni": "regional",
    "callupcontact": "regional",
    "belfasttelegraph": "regional",
    "irishnews": "regional",
    "sluggerotoole": "regional",
    "genesreunited": "regional",
    "thegazette": "regional",
    "kvk": "regional",
    "business-gov-nl": "regional",
    "telefoonboek": "regional",
    "detelefoongids": "regional",
    "goudengids": "regional",
    "telefoongids-nl": "regional",
    "kompass-nl": "regional",
    "dutchregistry": "regional",
    "adhocdata": "regional",
    "kadaster": "regional",
    "archieven-nl": "regional",
    "openarchieven": "regional",
    "wiewaswie": "regional",
    "genealogie-online": "regional",
    "delpher": "regional",
    "nieuwe-instituut": "regional",
    "open-overheid": "regional",
    "rijksoverheid": "regional",
    "werk-nl": "regional",
    "nationalevacaturebank": "regional",
    "zoeken-nl": "regional",
    "gov-wales": "regional",
    "business-wales": "regional",
    "library-wales": "regional",
    "archives-wales": "regional",
    "rcahmw": "regional",
    "cadw": "regional",
    "walesonline-dir": "regional",
    "findwales": "regional",
    "wales-business-network": "regional",
    "libraries-wales": "regional",
    "national-archives-uk": "regional",
    "senedd": "regional",
    "old-bailey": "regional",
    "layers-of-london": "regional",
    "booth-poverty-map": "regional",
    "locating-london": "regional",
    "london-picture-archive": "regional",
    "british-history-online": "regional",
    "map-of-london": "regional",
    "gm-lives": "regional",
    "fireball": "regional",
    "gelbeseiten": "regional",
    "dastelefonbuch": "regional",
    "dasoertliche": "regional",
    "de-11880": "regional",
    "meinestadt": "regional",
    "web-de": "regional",
    "t-online": "regional",
    "gesis": "regional",
    "bund-de": "regional",
    "goldenpages-ie": "regional",
    "businessworld-ie": "regional",
    "solocheck": "regional",
    "cro-ie": "regional",
    "gov-ie": "regional",
    "data-gov-ie": "regional",
    "cso-ie": "regional",
    "national-archives-ie": "regional",
    "nli-ie": "regional",
    "askaboutireland": "regional",
    "rootsireland": "regional",
    "findmypast-ie": "regional",
    "myhome-ie": "regional",
    "daft-ie": "regional",
    "jobs-ie": "regional",
    "irishjobs": "regional",
    "rip-ie": "regional",
    "yellowpages-eg": "regional",
    "dalil140": "regional",
    "forasna": "regional",
    "wuzzuf": "regional",
    "aqarmap": "regional",
    "dubizzle-eg": "regional",
    "olx-eg": "regional",
    "egypt-business": "regional",
    "egyptian-industry": "regional",
    "idsc-eg": "regional",
    "invest-egypt": "regional",
    "capmas": "regional",
    "egx": "regional",
    "whitepages-be": "regional",
    "acp-cd": "regional",
    "rcst-cd": "regional",
    "odd-dashboard-cd": "regional",
    "inrb-cd": "regional",
    "drc-precop-cd": "regional",
    "julisha-cd": "regional",
    "pnmls-cd": "regional",
    "infoleg-ar": "regional",
    "justicia-ar": "regional",
    "mseg-ar": "regional",
    "pjn-ar": "regional",
    "cij-ar": "regional",
    "boletin-oficial-ar": "regional",
    "afip-ar": "regional",
    "datos-abiertos-ar": "regional",
    "migraciones-ar": "regional",
    "comprar-ar": "regional",
    "politia-ro": "regional",
    "politia-frontiera-ro": "regional",
    "onrc-ro": "regional",
    "listafirme-ro": "regional",
    "romanian-companies": "regional",
    "arhiva-nationala-ro": "regional",
    "biblioteca-nationala-ro": "regional",
    "e-licitatie-ro": "regional",
    "anaf-ro": "regional",
    "portal-just-ro": "regional",
    "rejust-ro": "regional",
    "rolii-ro": "regional",
    "genealogica-ro": "regional",
    "sicap-ro": "regional",
    "shabait-er": "regional",
    "eritrea-info-er": "regional",
    "eritrea-yellow-pages": "regional",
    "erilaw-er": "regional",
    "worldlii-er": "regional",
    "irandoc-ir": "regional",
    "sid-ir": "regional",
    "nlai-ir": "regional",
    "jref-ir": "regional",
    "vlist-ir": "regional",
    "company-register-ir": "regional",
    "symposia-ir": "regional",
    "trade-with-iran": "regional",
    "mfa-ir": "regional",
    "iran-law-ir": "regional",
    "lbr-lu": "regional",
    "guichet-lu": "regional",
    "legilux-lu": "regional",
    "justice-lu": "regional",
    "data-lu": "regional",
    "geoportail-lu": "regional",
    "police-lu": "regional",
    "editus-lu": "regional",
    "proff-lu": "regional",
    "archives-lu": "regional",
    "bnl-lu": "regional",
    "cc-lu": "regional",
    "harrow-planning": "regional",
    "richmond-planning": "regional",
    "wandsworth-planning": "regional",
    "merton-planning": "regional",
    "bromley-planning": "regional",
    "sutton-planning": "regional",
    "kingston-planning": "regional",
    "enfield-planning": "regional",
    "hackney-archives": "regional",
    "london-archives": "regional",
    "met-police": "regional",
    "gmp-police": "regional",
    "cornwall-gov": "regional",
    "devon-cornwall-police": "regional",
    "gov-im": "regional",
    "planning-im": "regional",
    "birmingham-planning": "regional",
    "dol-ny": "regional",
    "nyscr-ny": "regional",
    "dmv-ny": "regional",
    "nysm-ny": "regional",
    "pagesjaunes-fr": "regional",
    "118712-fr": "regional",
    "118000-fr": "regional",
    "orange-annuaire-fr": "regional",
    "societe-fr": "regional",
    "verif-fr": "regional",
    "infobel-fr": "regional",
    "europages-fr": "regional",
    "kompass-fr": "regional",
    "service-public-fr": "regional",
    "jdn-fr": "regional",
    "recherche-fr": "regional",
    "voila-fr": "regional",
    "onet-pl": "regional",
    "wp-pl": "regional",
    "interia-pl": "regional",
    "gazeta-pl": "regional",
    "whitepages-pl": "regional",
    "biznes-gov-pl": "regional",
    "ceidg-pl": "regional",
    "regon-pl": "regional",
    "krs-pl": "regional",
    "knf-pl": "regional",
    "uprp-pl": "regional",
    "ppm-pl": "regional",
    "pkt-pl": "regional",
    "zumi-pl": "regional",
    "o2-pl": "regional",
    "search-ch": "regional",
    "local-ch": "regional",
    "tiger-ch": "regional",
    "daum-kr": "regional",
    "kakao-map-kr": "regional",
    "nate-kr": "regional",
    "zum-kr": "regional",
    "11st-kr": "regional",
    "coupang-kr": "regional",
    "gmarket-kr": "regional",
    "auction-kr": "regional",
    "jobkorea-kr": "regional",
    "saramin-kr": "regional",
    "114-kr": "regional",
    "koreatechdesk": "regional",
    "nrs-catalogue": "regional",
    "scotlands-people": "regional",
    "trove-scot": "regional",
    "canmore": "regional",
    "pastmap": "regional",
    "nls-collections": "regional",
    "nls-manuscripts": "regional",
    "nls-maps": "regional",
    "electric-scotland": "regional",
    "scottish-indexes": "regional",
    "directories-scot": "regional",
    "opendata-scot": "regional",
    "stirling-archives": "regional",
    "mapgenie-uk": "regional",
    "debida-diligencia-pe": "regional",
    "pj-pe": "regional",
    "sunarp-pe": "regional",
    "osce-pe": "regional",
    "sunat-pe": "regional",
    "migraciones-pe": "regional",
    "sbs-pe": "regional",
    "jne-pe": "regional",
    "politi-dk": "regional",
    "domstol-dk": "regional",
    "retsinformation-dk": "regional",
    "virk-dk": "regional",
    "cvr-dk": "regional",
    "tinglysning-dk": "regional",
    "skat-dk": "regional",
    "proff-dk": "regional",
    "krak-dk": "regional",
    "boligen-dk": "regional",
    "police-lt": "regional",
    "ird-lt": "regional",
    "lkpb-lt": "regional",
    "teismai-lt": "regional",
    "e-teismas-lt": "regional",
    "liteko-lt": "regional",
    "lrs-lt": "regional",
    "infolex-lt": "regional",
    "rekvizitai-lt": "regional",
    "registru-centras-lt": "regional",
    "vmi-lt": "regional",
    "cpo-lt": "regional",
    "cvpp-lt": "regional",
    "lb-lt": "regional",
    "fntt-lt": "regional",
    "lrv-open-data-lt": "regional",
    "muitine-lt": "regional",
    "e-tar-lt": "regional",
    "azdor-az": "regional",
    "missing-money": "regional",
    "pima-inmate": "regional",
    "phoenix-open-data": "regional",
    "phoenix-public-records": "regional",
    "az-geo": "regional",
    "azdhs-gis": "regional",
    "phoenix-chamber": "regional",
    "chandler-chamber": "regional",
    "just-go-az": "regional",
    "visit-arizona": "regional",
    "azsos-trade-names": "regional",
    "azcc-business": "regional",
    "az-league-jobs": "regional",
    "phx-soul": "regional",
    "az-job-connection": "regional",
    "arizona-at-work": "regional",
    "des-az-jobs": "regional",
    "az-corrections": "regional",
    "azdps": "regional",
    "icrime-watch": "regional",
    "nsopw": "regional",
    "az-archives-online": "regional",
    "az-library": "regional",
    "uk-data-service": "regional",
    "paul-mellon-centre": "regional",
    "british-newspaper-archive": "regional",
    "gazetteer-uk": "regional",
    "genuki": "regional",
    "british-listed-buildings": "regional",
    "leigh-surrey-history": "regional",
    "huncote-history": "regional",
    "appleby-magna-history": "regional",
    "flitwick-history": "regional",
    "bblhs": "regional",
    "cemetery-scribes": "regional",
    "community-archives": "regional",
    "the-old-school": "regional",
    "local-history-links": "regional",
    "ukbmd-parish": "regional",
    "historic-england": "regional",
    "exploring-surreys-past": "regional",
    "old-maps-online": "regional",
    "fiva-bo": "regional",
    "siat-bo": "regional",
    "senapi-bo": "regional",
    "autoridad-minera-bo": "regional",
    "gaceta-santa-cruz-bo": "regional",
    "bcb-bo": "regional",
    "sicoes-bo": "regional",
    "open-camden": "regional",
    "startpage": "meta",
    "dogpile": "meta",
    "metacrawler": "meta",
    "etools": "meta",
    "ecosia": "meta",
    "presearch": "meta",
    "webcrawler": "meta",
    "faganfinder": "meta",
    "yahoo": "meta",
    "gibiru": "meta",
    "freespoke": "meta",
    "mamma": "meta",
    "you.com": "meta",
    "refseek": "obscure",
    "lycos": "obscure",
    "millionshort": "obscure",
    "boardreader": "obscure",
    "sourcegraph": "obscure",
    "scholar-google": "obscure",
    "yippy": "obscure",
    "exactseek": "obscure",
    "alltheinternet": "obscure",
    "oscobo": "obscure",
    "searchencrypt": "obscure",
    "info": "obscure",
    "searchalot": "obscure",
    "anoox": "obscure",
    "secretsearch": "obscure",
    "blog-search": "obscure",
    "findsounds": "obscure",
    "rpmfind": "obscure",
    "worldwidescience": "obscure",
    "scienceopen": "obscure",
    "krugle": "obscure",
    "researchgate": "obscure",
    "academia": "obscure",
    "ssrn": "obscure",
    "gigablast": "obscure",
    "webwiki": "obscure",
    "2lingual": "obscure",
    "aol": "obscure",
    "exalead": "obscure",
    "givewater": "obscure",
    "gnod": "obscure",
    "wikipedia": "open",
    "wikidata": "open",
    "github": "open",
    "hackernews": "open",
    "stackoverflow": "open",
    "archive.org": "open",
    "openlibrary": "open",
    "pubmed": "open",
    "npm": "open",
    "core": "open",
    "nominatim": "open",
    "doaj": "open",
    "wikibooks": "open",
    "commons": "open",
    "zenodo": "open",
    "datacite": "open",
    "packagist": "open",
    "rubygems": "open",
    "crates": "open",
    "musicbrainz": "open",
    "gbif": "open",
    "google-scholar": "open",
    "gitlab": "social",
    "codeberg": "social",
    "bluesky": "social",
    "mastodon": "social",
    "keybase": "social",
    "gravatar": "social",
    "reddit-users": "social",
    "stackexchange-users": "social",
    "reddit": "social",
    "lichess": "social",
    "wayback": "wayback"
  }
};
