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
      "google-scholar",
      "gitlab-users",
      "codeberg-users",
      "mastodon",
      "keybase",
      "gravatar",
      "reddit-users",
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
      "google-scholar": "open",
      "gitlab": "social",
      "codeberg": "social",
      "mastodon": "social",
      "keybase": "social",
      "gravatar": "social",
      "reddit-users": "social",
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
      "requiresKey": "brave"
    },
    {
      "id": "serpapi",
      "label": "SerpAPI",
      "tier": "core",
      "requiresKey": "serpapi"
    },
    {
      "id": "mojeek",
      "label": "Mojeek",
      "tier": "core",
      "requiresKey": "mojeek"
    },
    {
      "id": "kagi",
      "label": "Kagi",
      "tier": "core",
      "requiresKey": "kagi"
    },
    {
      "id": "bing",
      "label": "Bing",
      "tier": "core",
      "requiresKey": "bing"
    },
    {
      "id": "google",
      "label": "Google Custom Search",
      "tier": "core",
      "requiresKey": [
        "google",
        "googleCx"
      ]
    },
    {
      "id": "metager",
      "label": "MetaGer",
      "tier": "core",
      "requiresKey": "metager"
    },
    {
      "id": "swisscows",
      "label": "Swisscows",
      "tier": "core",
      "requiresKey": "swisscows"
    },
    {
      "id": "listennotes",
      "label": "Listen Notes",
      "tier": "core",
      "requiresKey": "listennotes"
    },
    {
      "id": "exa",
      "label": "Exa AI",
      "tier": "core",
      "requiresKey": "exa"
    },
    {
      "id": "perplexity",
      "label": "Perplexity AI",
      "tier": "core",
      "requiresKey": "perplexity"
    },
    {
      "id": "duckduckgo",
      "label": "DuckDuckGo",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "searxng",
      "label": "SearXNG",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "marginalia",
      "label": "Marginalia",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "wiby",
      "label": "Wiby",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "qwant",
      "label": "Qwant",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "yep",
      "label": "Yep",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "searchcode",
      "label": "SearchCode",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "grep.app",
      "label": "grep.app",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "openverse",
      "label": "Openverse",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "base",
      "label": "BASE",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "crt.sh",
      "label": "crt.sh",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "urlscan",
      "label": "urlscan.io",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "opencorporates",
      "label": "OpenCorporates",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "opensanctions",
      "label": "OpenSanctions",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "semantic-scholar",
      "label": "Semantic Scholar",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "crossref",
      "label": "CrossRef",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "openalex",
      "label": "OpenAlex",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "worldcat",
      "label": "WorldCat",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "ahmia",
      "label": "Ahmia",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "carrot2",
      "label": "Carrot2",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "whats-my-name",
      "label": "What's My Name",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "social-searcher",
      "label": "Social Searcher",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "social-profiles",
      "label": "Social Profile Checker",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "arxiv",
      "label": "ArXiv",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "lens",
      "label": "Lens.org",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "orcid",
      "label": "ORCID",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "stract",
      "label": "Stract",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "crowdview",
      "label": "CrowdView",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "yacy",
      "label": "YaCy",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "europeana",
      "label": "Europeana",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "jstor",
      "label": "JSTOR",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "companies-house",
      "label": "UK Companies House",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "google-maps",
      "label": "Google Maps",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "google-books",
      "label": "Google Books",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "bing-maps",
      "label": "Bing Maps",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "yandex-maps",
      "label": "Yandex Maps",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "baidu-index",
      "label": "Baidu Index",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "weixin-sogou",
      "label": "Weixin Sogou",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "tusksearch",
      "label": "TuskSearch",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "excite",
      "label": "Excite",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "biznar",
      "label": "Biznar",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "mednar",
      "label": "MedNar",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "scienceresearch",
      "label": "ScienceResearch",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "kiddle",
      "label": "Kiddle",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "petalsearch",
      "label": "Petal Search",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "grok",
      "label": "Grok",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "loc-gov",
      "label": "Library of Congress",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "hathitrust",
      "label": "HathiTrust",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "british-museum",
      "label": "British Museum",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "royal-collection",
      "label": "Royal Collection Trust",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "british-library",
      "label": "British Library",
      "tier": "open",
      "requiresKey": null
    },
    {
      "id": "shodan",
      "label": "Shodan",
      "tier": "osint",
      "requiresKey": "shodan"
    },
    {
      "id": "censys",
      "label": "Censys",
      "tier": "osint",
      "requiresKey": [
        "censysId",
        "censysSecret"
      ]
    },
    {
      "id": "hunter",
      "label": "Hunter.io",
      "tier": "osint",
      "requiresKey": "hunter"
    },
    {
      "id": "intelx",
      "label": "IntelX",
      "tier": "osint",
      "requiresKey": "intelx"
    },
    {
      "id": "publicwww",
      "label": "PublicWWW",
      "tier": "osint",
      "requiresKey": "publicwww"
    },
    {
      "id": "tineye",
      "label": "TinEye",
      "tier": "osint",
      "requiresKey": "tineye"
    },
    {
      "id": "dehashed",
      "label": "DeHashed",
      "tier": "osint",
      "requiresKey": "dehashed"
    },
    {
      "id": "haveibeenpwned",
      "label": "Have I Been Pwned",
      "tier": "osint",
      "requiresKey": "hibp"
    },
    {
      "id": "greynoise",
      "label": "GreyNoise",
      "tier": "osint",
      "requiresKey": "greynoise"
    },
    {
      "id": "pimeyes",
      "label": "PimEyes",
      "tier": "osint",
      "requiresKey": null
    },
    {
      "id": "libraries-io",
      "label": "Libraries.io",
      "tier": "osint",
      "requiresKey": null
    },
    {
      "id": "wolfram-alpha",
      "label": "Wolfram Alpha",
      "tier": "osint",
      "requiresKey": null
    },
    {
      "id": "netlas",
      "label": "Netlas",
      "tier": "osint",
      "requiresKey": null
    },
    {
      "id": "yandex",
      "label": "Yandex",
      "tier": "regional",
      "requiresKey": "yandex"
    },
    {
      "id": "baidu",
      "label": "Baidu",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "naver",
      "label": "Naver",
      "tier": "regional",
      "requiresKey": [
        "naverClientId",
        "naverClientSecret"
      ]
    },
    {
      "id": "sogou",
      "label": "Sogou",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "so360",
      "label": "So.com (360)",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "seznam",
      "label": "Seznam",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "mail.ru",
      "label": "Mail.ru",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "rambler",
      "label": "Rambler",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "no-1881",
      "label": "1881.no",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "gulesider",
      "label": "Gule Sider",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "kvasir",
      "label": "Kvasir",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "sol-no",
      "label": "Sol.no",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "brreg",
      "label": "Brønnøysundregistrene",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "proff-no",
      "label": "Proff.no",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "norge-no",
      "label": "Norge.no",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "oria-no",
      "label": "Oria",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "digitalarkivet",
      "label": "Digitalarkivet",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nidirect",
      "label": "NIDirect",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "proni-street",
      "label": "PRONI Street Directories",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nibusinessinfo",
      "label": "NI Business Info",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nifed",
      "label": "NIFED",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "linkupni",
      "label": "LinkUpNI",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nijobs",
      "label": "NIJobs",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "propertypal",
      "label": "PropertyPal",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "propertynews",
      "label": "PropertyNews",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "4ni",
      "label": "4NI",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "callupcontact",
      "label": "CallUpContact NI",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "belfasttelegraph",
      "label": "Belfast Telegraph",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "irishnews",
      "label": "Irish News",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "sluggerotoole",
      "label": "Slugger O'Toole",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "genesreunited",
      "label": "Genes Reunited",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "thegazette",
      "label": "The Gazette",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "kvk",
      "label": "KVK (Dutch Chamber)",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "business-gov-nl",
      "label": "Business.gov.nl",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "telefoonboek",
      "label": "Telefoonboek",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "detelefoongids",
      "label": "De Telefoongids",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "goudengids",
      "label": "Gouden Gids",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "telefoongids-nl",
      "label": "Telefoongids-NL",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "kompass-nl",
      "label": "Kompass NL",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "dutchregistry",
      "label": "Dutch Registry",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "adhocdata",
      "label": "Ad Hoc Data",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "kadaster",
      "label": "Kadaster",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "archieven-nl",
      "label": "Archieven.nl",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "openarchieven",
      "label": "Open Archieven",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "wiewaswie",
      "label": "WieWasWie",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "genealogie-online",
      "label": "Genealogie Online",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "delpher",
      "label": "Delpher",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nieuwe-instituut",
      "label": "Het Nieuwe Instituut",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "open-overheid",
      "label": "Open Overheid",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "rijksoverheid",
      "label": "Rijksoverheid",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "werk-nl",
      "label": "Werk.nl",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nationalevacaturebank",
      "label": "Nationale Vacaturebank",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "zoeken-nl",
      "label": "Zoeken.nl",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "gov-wales",
      "label": "Gov.Wales",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "business-wales",
      "label": "Business Wales",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "library-wales",
      "label": "National Library of Wales",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "archives-wales",
      "label": "Archives Wales",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "rcahmw",
      "label": "RCAHMW Coflein",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "cadw",
      "label": "Cadw",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "walesonline-dir",
      "label": "WalesOnline Directory",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "findwales",
      "label": "FindWales",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "wales-business-network",
      "label": "Wales Business Network",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "libraries-wales",
      "label": "Libraries Wales",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "national-archives-uk",
      "label": "UK National Archives",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "senedd",
      "label": "Senedd Wales",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "old-bailey",
      "label": "Old Bailey Online",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "layers-of-london",
      "label": "Layers of London",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "booth-poverty-map",
      "label": "Booth Poverty Map",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "locating-london",
      "label": "Locating London",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "london-picture-archive",
      "label": "London Picture Archive",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "british-history-online",
      "label": "British History Online",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "map-of-london",
      "label": "Map of Early Modern London",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "gm-lives",
      "label": "GM Lives",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "fireball",
      "label": "Fireball",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "gelbeseiten",
      "label": "Gelbe Seiten",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "dastelefonbuch",
      "label": "Das Telefonbuch",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "dasoertliche",
      "label": "Das Örtliche",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "de-11880",
      "label": "11880.com",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "meinestadt",
      "label": "meinestadt.de",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "web-de",
      "label": "Web.de",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "t-online",
      "label": "T-Online",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "gesis",
      "label": "GESIS",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "bund-de",
      "label": "Bund.de",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "goldenpages-ie",
      "label": "Golden Pages IE",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "businessworld-ie",
      "label": "Business World IE",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "solocheck",
      "label": "SoloCheck",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "cro-ie",
      "label": "CRO Ireland",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "gov-ie",
      "label": "Gov.ie",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "data-gov-ie",
      "label": "Data.gov.ie",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "cso-ie",
      "label": "CSO Ireland",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "national-archives-ie",
      "label": "National Archives IE",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nli-ie",
      "label": "National Library of Ireland",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "askaboutireland",
      "label": "Ask About Ireland",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "rootsireland",
      "label": "Roots Ireland",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "findmypast-ie",
      "label": "FindMyPast IE",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "myhome-ie",
      "label": "MyHome.ie",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "daft-ie",
      "label": "Daft.ie",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "jobs-ie",
      "label": "Jobs.ie",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "irishjobs",
      "label": "IrishJobs",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "rip-ie",
      "label": "RIP.ie",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "yellowpages-eg",
      "label": "Yellow Pages Egypt",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "dalil140",
      "label": "Dalil 140",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "forasna",
      "label": "Forasna",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "wuzzuf",
      "label": "Wuzzuf",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "aqarmap",
      "label": "Aqarmap",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "dubizzle-eg",
      "label": "Dubizzle Egypt",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "olx-eg",
      "label": "OLX Egypt",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "egypt-business",
      "label": "Egypt Business",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "egyptian-industry",
      "label": "Egyptian Industry",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "idsc-eg",
      "label": "IDSC Egypt",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "invest-egypt",
      "label": "Invest in Egypt",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "capmas",
      "label": "CAPMAS Egypt",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "egx",
      "label": "Egyptian Exchange",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "whitepages-be",
      "label": "White Pages Belgium",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "acp-cd",
      "label": "ACP Congo",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "rcst-cd",
      "label": "RCST Congo",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "odd-dashboard-cd",
      "label": "ODD Dashboard Congo",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "inrb-cd",
      "label": "INRB Congo",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "drc-precop-cd",
      "label": "DRC PreCOP Environment",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "julisha-cd",
      "label": "Julisha Congo",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "pnmls-cd",
      "label": "PNMLS Documentation",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "infoleg-ar",
      "label": "InfoLeg Argentina",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "justicia-ar",
      "label": "Argentina Justicia",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "mseg-ar",
      "label": "MSEG Buenos Aires",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "pjn-ar",
      "label": "PJN Argentina",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "cij-ar",
      "label": "CIJ Argentina",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "boletin-oficial-ar",
      "label": "Boletín Oficial Argentina",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "afip-ar",
      "label": "AFIP Argentina",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "datos-abiertos-ar",
      "label": "Datos Abiertos Argentina",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "migraciones-ar",
      "label": "Migraciones Argentina",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "comprar-ar",
      "label": "Comprar Argentina",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "politia-ro",
      "label": "Romanian Police",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "politia-frontiera-ro",
      "label": "Border Police Romania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "onrc-ro",
      "label": "ONRC Romania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "listafirme-ro",
      "label": "Lista Firme",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "romanian-companies",
      "label": "Romanian Companies",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "arhiva-nationala-ro",
      "label": "National Archives Romania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "biblioteca-nationala-ro",
      "label": "National Library Romania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "e-licitatie-ro",
      "label": "e-Licitatie Romania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "anaf-ro",
      "label": "ANAF Romania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "portal-just-ro",
      "label": "Portal Just Romania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "rejust-ro",
      "label": "ReJust Romania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "rolii-ro",
      "label": "ROLII Romania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "genealogica-ro",
      "label": "Genealogica Romania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "sicap-ro",
      "label": "SICAP Romania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "shabait-er",
      "label": "Shabait Eritrea",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "eritrea-info-er",
      "label": "Eritrea Information",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "eritrea-yellow-pages",
      "label": "Eritrea Yellow Pages",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "erilaw-er",
      "label": "EriLaw",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "worldlii-er",
      "label": "WorldLII Eritrea",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "irandoc-ir",
      "label": "IranDoc",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "sid-ir",
      "label": "SID Iran",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nlai-ir",
      "label": "National Library Iran",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "jref-ir",
      "label": "JREF Iran",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "vlist-ir",
      "label": "VList Iran",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "company-register-ir",
      "label": "Company Register Iran",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "symposia-ir",
      "label": "Symposia Iran",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "trade-with-iran",
      "label": "Trade With Iran",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "mfa-ir",
      "label": "MFA Iran",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "iran-law-ir",
      "label": "Iran Law Journal",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "lbr-lu",
      "label": "LBR Luxembourg",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "guichet-lu",
      "label": "Guichet Luxembourg",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "legilux-lu",
      "label": "Legilux",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "justice-lu",
      "label": "Justice Luxembourg",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "data-lu",
      "label": "Data Luxembourg",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "geoportail-lu",
      "label": "Geoportail Luxembourg",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "police-lu",
      "label": "Police Luxembourg",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "editus-lu",
      "label": "Editus Luxembourg",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "proff-lu",
      "label": "Proff Luxembourg",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "archives-lu",
      "label": "Archives Luxembourg",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "bnl-lu",
      "label": "National Library Luxembourg",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "cc-lu",
      "label": "Chamber of Commerce Luxembourg",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "harrow-planning",
      "label": "Harrow Planning",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "richmond-planning",
      "label": "Richmond Planning",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "wandsworth-planning",
      "label": "Wandsworth Planning",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "merton-planning",
      "label": "Merton Planning",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "bromley-planning",
      "label": "Bromley Planning",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "sutton-planning",
      "label": "Sutton Planning",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "kingston-planning",
      "label": "Kingston Planning",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "enfield-planning",
      "label": "Enfield Planning",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "hackney-archives",
      "label": "Hackney Archives",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "london-archives",
      "label": "London Archives",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "met-police",
      "label": "Metropolitan Police",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "gmp-police",
      "label": "Greater Manchester Police",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "cornwall-gov",
      "label": "Cornwall Council",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "devon-cornwall-police",
      "label": "Devon & Cornwall Police",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "gov-im",
      "label": "Isle of Man Gov",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "planning-im",
      "label": "Isle of Man Planning",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "birmingham-planning",
      "label": "Birmingham Planning",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "dol-ny",
      "label": "NY DOL Contractor Registry",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nyscr-ny",
      "label": "NY State Contract Reporter",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "dmv-ny",
      "label": "NY DMV",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nysm-ny",
      "label": "NY State Museum",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "pagesjaunes-fr",
      "label": "PagesJaunes",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "118712-fr",
      "label": "118712",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "118000-fr",
      "label": "118000",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "orange-annuaire-fr",
      "label": "Orange Annuaire",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "societe-fr",
      "label": "Societe.com",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "verif-fr",
      "label": "Verif.com",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "infobel-fr",
      "label": "Infobel France",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "europages-fr",
      "label": "Europages France",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "kompass-fr",
      "label": "Kompass France",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "service-public-fr",
      "label": "Service-Public.fr",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "jdn-fr",
      "label": "Journal du Net",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "recherche-fr",
      "label": "Recherche.fr",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "voila-fr",
      "label": "Voila.fr",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "onet-pl",
      "label": "Onet.pl",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "wp-pl",
      "label": "Wirtualna Polska",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "interia-pl",
      "label": "Interia.pl",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "gazeta-pl",
      "label": "Gazeta.pl",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "whitepages-pl",
      "label": "WhitePages Poland",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "biznes-gov-pl",
      "label": "Biznes.gov.pl",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "ceidg-pl",
      "label": "CEIDG Poland",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "regon-pl",
      "label": "REGON Poland",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "krs-pl",
      "label": "KRS Poland",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "knf-pl",
      "label": "KNF Poland",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "uprp-pl",
      "label": "UPRP Poland",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "ppm-pl",
      "label": "PPM.edu.pl",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "pkt-pl",
      "label": "PKT.pl",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "zumi-pl",
      "label": "Zumi.pl",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "o2-pl",
      "label": "O2.pl",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "search-ch",
      "label": "Search.ch",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "local-ch",
      "label": "Local.ch",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "tiger-ch",
      "label": "Tiger.ch",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "daum-kr",
      "label": "Daum",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "kakao-map-kr",
      "label": "Kakao Map",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nate-kr",
      "label": "Nate",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "zum-kr",
      "label": "Zum",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "11st-kr",
      "label": "11st",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "coupang-kr",
      "label": "Coupang",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "gmarket-kr",
      "label": "Gmarket",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "auction-kr",
      "label": "Auction",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "jobkorea-kr",
      "label": "JobKorea",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "saramin-kr",
      "label": "Saramin",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "114-kr",
      "label": "114.co.kr",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "koreatechdesk",
      "label": "Korea Tech Desk",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nrs-catalogue",
      "label": "NRS Online Catalogue",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "scotlands-people",
      "label": "ScotlandsPeople",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "trove-scot",
      "label": "Trove.scot",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "canmore",
      "label": "Canmore",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "pastmap",
      "label": "PastMap",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nls-collections",
      "label": "NLS Collections",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nls-manuscripts",
      "label": "NLS Manuscripts",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nls-maps",
      "label": "NLS Maps",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "electric-scotland",
      "label": "Electric Scotland",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "scottish-indexes",
      "label": "Scottish Indexes",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "directories-scot",
      "label": "Directories.scot",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "opendata-scot",
      "label": "OpenData.scot",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "stirling-archives",
      "label": "Stirling Archives",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "mapgenie-uk",
      "label": "MapGenie UK",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "debida-diligencia-pe",
      "label": "Debida Diligencia Peru",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "pj-pe",
      "label": "Poder Judicial Peru",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "sunarp-pe",
      "label": "SUNARP Peru",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "osce-pe",
      "label": "OSCE Peru",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "sunat-pe",
      "label": "SUNAT Peru",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "migraciones-pe",
      "label": "Migraciones Peru",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "sbs-pe",
      "label": "SBS Peru",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "jne-pe",
      "label": "JNE Peru",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "politi-dk",
      "label": "Danish Police",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "domstol-dk",
      "label": "Danish Courts",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "retsinformation-dk",
      "label": "Retsinformation",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "virk-dk",
      "label": "Virk.dk",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "cvr-dk",
      "label": "CVR Denmark",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "tinglysning-dk",
      "label": "Tinglysning Denmark",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "skat-dk",
      "label": "Skat Denmark",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "proff-dk",
      "label": "Proff.dk",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "krak-dk",
      "label": "Krak.dk",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "boligen-dk",
      "label": "Boligsiden Denmark",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "police-lt",
      "label": "Lithuanian Police",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "ird-lt",
      "label": "IRD Lithuania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "lkpb-lt",
      "label": "LKPB Lithuania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "teismai-lt",
      "label": "Lithuanian Courts",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "e-teismas-lt",
      "label": "Lithuanian E-Court",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "liteko-lt",
      "label": "LITEKO Court Decisions",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "lrs-lt",
      "label": "Lithuanian Parliament",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "infolex-lt",
      "label": "Infolex Legal",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "rekvizitai-lt",
      "label": "Rekvizitai Company Search",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "registru-centras-lt",
      "label": "Centre of Registers Lithuania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "vmi-lt",
      "label": "Lithuanian Tax Inspectorate",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "cpo-lt",
      "label": "CPO Lithuania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "cvpp-lt",
      "label": "CVPP Public Procurement",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "lb-lt",
      "label": "Bank of Lithuania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "fntt-lt",
      "label": "FNTT Lithuania",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "lrv-open-data-lt",
      "label": "Lithuanian Open Data",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "muitine-lt",
      "label": "Lithuanian Customs",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "e-tar-lt",
      "label": "Lithuanian Legal Acts Register",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "azdor-az",
      "label": "AZ Unclaimed Property",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "missing-money",
      "label": "MissingMoney",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "pima-inmate",
      "label": "Pima County Inmate Search",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "phoenix-open-data",
      "label": "Phoenix Open Data",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "phoenix-public-records",
      "label": "Phoenix Public Records",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "az-geo",
      "label": "AZ Geospatial Data",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "azdhs-gis",
      "label": "AZ Health Services GIS",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "phoenix-chamber",
      "label": "Phoenix Chamber",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "chandler-chamber",
      "label": "Chandler Chamber",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "just-go-az",
      "label": "Just Go Arizona",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "visit-arizona",
      "label": "Visit Arizona",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "azsos-trade-names",
      "label": "AZ Secretary of State Trade Names",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "azcc-business",
      "label": "AZ Corporation Commission",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "az-league-jobs",
      "label": "AZ League Jobs",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "phx-soul",
      "label": "PHXSoul Business Directory",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "az-job-connection",
      "label": "AZ Job Connection",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "arizona-at-work",
      "label": "Arizona@Work",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "des-az-jobs",
      "label": "AZ DES Employment",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "az-corrections",
      "label": "AZ Corrections Inmate Search",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "azdps",
      "label": "AZ Dept of Public Safety",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "icrime-watch",
      "label": "iCrimeWatch AZ",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "nsopw",
      "label": "National Sex Offender Registry",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "az-archives-online",
      "label": "AZ Archives Online",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "az-library",
      "label": "AZ State Library",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "uk-data-service",
      "label": "UK Data Service",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "paul-mellon-centre",
      "label": "Paul Mellon Centre",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "british-newspaper-archive",
      "label": "British Newspaper Archive",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "gazetteer-uk",
      "label": "Gazetteer UK",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "genuki",
      "label": "GENUKI",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "british-listed-buildings",
      "label": "British Listed Buildings",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "leigh-surrey-history",
      "label": "Leigh & District History",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "huncote-history",
      "label": "Huncote Parish History",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "appleby-magna-history",
      "label": "Appleby Magna History",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "flitwick-history",
      "label": "History of Flitwick",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "bblhs",
      "label": "Beds & Bucks Local History Society",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "cemetery-scribes",
      "label": "Cemetery Scribes",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "community-archives",
      "label": "Community Archives",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "the-old-school",
      "label": "The Old School Archive",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "local-history-links",
      "label": "Local History Links",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "ukbmd-parish",
      "label": "UKBMD Parish Records",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "historic-england",
      "label": "Historic England",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "exploring-surreys-past",
      "label": "Exploring Surrey's Past",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "old-maps-online",
      "label": "Old Maps Online",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "fiva-bo",
      "label": "FIVA Bolivia Tax",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "siat-bo",
      "label": "SIAT Bolivia Tax Info",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "senapi-bo",
      "label": "SENAPI Bolivia IP",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "autoridad-minera-bo",
      "label": "Bolivia Mining Authority",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "gaceta-santa-cruz-bo",
      "label": "Santa Cruz Official Gazette",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "bcb-bo",
      "label": "Central Bank of Bolivia",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "sicoes-bo",
      "label": "SICOES Bolivia Procurement",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "open-camden",
      "label": "Camden Open Data",
      "tier": "regional",
      "requiresKey": null
    },
    {
      "id": "startpage",
      "label": "Startpage",
      "tier": "meta",
      "requiresKey": null
    },
    {
      "id": "dogpile",
      "label": "Dogpile",
      "tier": "meta",
      "requiresKey": null
    },
    {
      "id": "metacrawler",
      "label": "MetaCrawler",
      "tier": "meta",
      "requiresKey": null
    },
    {
      "id": "etools",
      "label": "eTools",
      "tier": "meta",
      "requiresKey": null
    },
    {
      "id": "ecosia",
      "label": "Ecosia",
      "tier": "meta",
      "requiresKey": null
    },
    {
      "id": "presearch",
      "label": "Presearch",
      "tier": "meta",
      "requiresKey": null
    },
    {
      "id": "webcrawler",
      "label": "WebCrawler",
      "tier": "meta",
      "requiresKey": null
    },
    {
      "id": "faganfinder",
      "label": "FaganFinder",
      "tier": "meta",
      "requiresKey": null
    },
    {
      "id": "yahoo",
      "label": "Yahoo",
      "tier": "meta",
      "requiresKey": null
    },
    {
      "id": "gibiru",
      "label": "Gibiru",
      "tier": "meta",
      "requiresKey": null
    },
    {
      "id": "freespoke",
      "label": "Freespoke",
      "tier": "meta",
      "requiresKey": null
    },
    {
      "id": "mamma",
      "label": "Mamma",
      "tier": "meta",
      "requiresKey": null
    },
    {
      "id": "you.com",
      "label": "You.com",
      "tier": "meta",
      "requiresKey": null
    },
    {
      "id": "refseek",
      "label": "RefSeek",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "lycos",
      "label": "Lycos",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "millionshort",
      "label": "MillionShort",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "boardreader",
      "label": "BoardReader",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "sourcegraph",
      "label": "Sourcegraph",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "scholar-google",
      "label": "Google Scholar",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "yippy",
      "label": "Yippy",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "exactseek",
      "label": "ExactSeek",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "alltheinternet",
      "label": "AllTheInternet",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "oscobo",
      "label": "Oscobo",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "searchencrypt",
      "label": "SearchEncrypt",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "info",
      "label": "Info.com",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "searchalot",
      "label": "SearchAlot",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "anoox",
      "label": "Anoox",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "secretsearch",
      "label": "Secret Search Engine Labs",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "blog-search",
      "label": "Blog Search",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "findsounds",
      "label": "FindSounds",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "rpmfind",
      "label": "RPMFind",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "worldwidescience",
      "label": "WorldWideScience",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "scienceopen",
      "label": "ScienceOpen",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "krugle",
      "label": "Krugle",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "researchgate",
      "label": "ResearchGate",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "academia",
      "label": "Academia.edu",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "ssrn",
      "label": "SSRN",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "gigablast",
      "label": "Gigablast",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "webwiki",
      "label": "WebWiki",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "2lingual",
      "label": "2lingual",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "aol",
      "label": "AOL Search",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "exalead",
      "label": "Exalead",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "givewater",
      "label": "GiveWater",
      "tier": "obscure",
      "requiresKey": null
    },
    {
      "id": "gnod",
      "label": "Gnod",
      "tier": "obscure",
      "requiresKey": null
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
    "google-scholar": "open",
    "gitlab": "social",
    "codeberg": "social",
    "mastodon": "social",
    "keybase": "social",
    "gravatar": "social",
    "reddit-users": "social",
    "reddit": "social",
    "lichess": "social",
    "wayback": "wayback"
  }
};
