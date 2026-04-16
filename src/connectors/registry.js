// Connector module cache — modules are loaded on first search() call only.
const _cache = new Map();

/**
 * Build a lazy-loaded search function for a connector module.
 *
 * All connector modules must export a `search(query, apiKeys)` function that
 * returns a Promise<object[]> of normalised results. Every connector receives
 * the full apiKeys map and self-extracts the keys it needs.
 *
 * New connectors should extend the Connector base class in
 * `src/connectors/Connector.js` for automatic error handling and contract
 * enforcement.
 *
 * @param {string} modulePath – relative path to the connector module
 */
function lazySearch(modulePath) {
  return async (q, ak) => {
    if (!_cache.has(modulePath)) {
      const mod = await import(modulePath);
      if (typeof mod.search !== 'function') {
        throw new Error(`Connector at ${modulePath} does not export a search() function`);
      }
      _cache.set(modulePath, mod);
    }
    return _cache.get(modulePath).search(q, ak);
  };
}

const ALL_CONNECTORS = [
  // ── CORE ──────────────────────────────────────────────────────────────────
  { id: 'brave', label: 'Brave Search', tier: 'core', requiresKey: 'brave', search: lazySearch('./brave.js') },
  { id: 'serpapi', label: 'SerpAPI', tier: 'core', requiresKey: 'serpapi', search: lazySearch('./serpapi.js') },
  { id: 'mojeek', label: 'Mojeek', tier: 'core', requiresKey: 'mojeek', search: lazySearch('./mojeek.js') },
  { id: 'kagi', label: 'Kagi', tier: 'core', requiresKey: 'kagi', search: lazySearch('./kagi.js') },
  { id: 'bing', label: 'Bing', tier: 'core', requiresKey: 'bing', search: lazySearch('./bing.js') },
  { id: 'google', label: 'Google Custom Search', tier: 'core', requiresKey: ['google', 'googleCx'], search: lazySearch('./google.js') },
  { id: 'metager', label: 'MetaGer', tier: 'core', requiresKey: 'metager', search: lazySearch('./metager.js') },
  { id: 'swisscows', label: 'Swisscows', tier: 'core', requiresKey: 'swisscows', search: lazySearch('./swisscows.js') },
  { id: 'listennotes', label: 'Listen Notes', tier: 'core', requiresKey: 'listennotes', search: lazySearch('./listennotes.js') },
  { id: 'exa', label: 'Exa AI', tier: 'core', requiresKey: 'exa', search: lazySearch('./exa.js') },
  { id: 'perplexity', label: 'Perplexity AI', tier: 'core', requiresKey: 'perplexity', search: lazySearch('./perplexity.js') },

  // ── OPEN ──────────────────────────────────────────────────────────────────
  { id: 'duckduckgo', label: 'DuckDuckGo', tier: 'open', requiresKey: null, search: lazySearch('./duckduckgo.js') },
  { id: 'searxng', label: 'SearXNG', tier: 'open', requiresKey: null, search: lazySearch('./searxng.js') },
  { id: 'marginalia', label: 'Marginalia', tier: 'open', requiresKey: null, search: lazySearch('./marginalia.js') },
  { id: 'wiby', label: 'Wiby', tier: 'open', requiresKey: null, search: lazySearch('./wiby.js') },
  { id: 'qwant', label: 'Qwant', tier: 'open', requiresKey: null, search: lazySearch('./qwant.js') },
  { id: 'yep', label: 'Yep', tier: 'open', requiresKey: null, search: lazySearch('./yep.js') },
  { id: 'searchcode', label: 'SearchCode', tier: 'open', requiresKey: null, search: lazySearch('./searchcode.js') },
  { id: 'grep.app', label: 'grep.app', tier: 'open', requiresKey: null, search: lazySearch('./grepdotapp.js') },
  { id: 'openverse', label: 'Openverse', tier: 'open', requiresKey: null, search: lazySearch('./openverse.js') },
  { id: 'base', label: 'BASE', tier: 'open', requiresKey: null, search: lazySearch('./base.js') },
  { id: 'crt.sh', label: 'crt.sh', tier: 'open', requiresKey: null, search: lazySearch('./crtsh.js') },
  { id: 'urlscan', label: 'urlscan.io', tier: 'open', requiresKey: null, search: lazySearch('./urlscan.js') },
  { id: 'opencorporates', label: 'OpenCorporates', tier: 'open', requiresKey: null, search: lazySearch('./opencorporates.js') },
  { id: 'opensanctions', label: 'OpenSanctions', tier: 'open', requiresKey: null, search: lazySearch('./opensanctions.js') },
  { id: 'semantic-scholar', label: 'Semantic Scholar', tier: 'open', requiresKey: null, search: lazySearch('./semanticscholar.js') },
  { id: 'crossref', label: 'CrossRef', tier: 'open', requiresKey: null, search: lazySearch('./crossref.js') },
  { id: 'openalex', label: 'OpenAlex', tier: 'open', requiresKey: null, search: lazySearch('./openalex.js') },
  { id: 'worldcat', label: 'WorldCat', tier: 'open', requiresKey: null, search: lazySearch('./worldcat.js') },
  { id: 'ahmia', label: 'Ahmia', tier: 'open', requiresKey: null, search: lazySearch('./ahmia.js') },
  { id: 'carrot2', label: 'Carrot2', tier: 'open', requiresKey: null, search: lazySearch('./carrot2.js') },
  { id: 'whats-my-name', label: "What's My Name", tier: 'open', requiresKey: null, search: lazySearch('./whatsMyName.js') },
  { id: 'social-searcher', label: 'Social Searcher', tier: 'open', requiresKey: null, search: lazySearch('./socialsearcher.js') },
  { id: 'social-profiles', label: 'Social Profile Checker', tier: 'open', requiresKey: null, search: lazySearch('./socialProfiles.js') },
  { id: 'arxiv', label: 'ArXiv', tier: 'open', requiresKey: null, search: lazySearch('./arxiv.js') },
  { id: 'lens', label: 'Lens.org', tier: 'open', requiresKey: null, search: lazySearch('./lens.js') },
  { id: 'orcid', label: 'ORCID', tier: 'open', requiresKey: null, search: lazySearch('./orcid.js') },
  { id: 'stract', label: 'Stract', tier: 'open', requiresKey: null, search: lazySearch('./stract.js') },
  { id: 'crowdview', label: 'CrowdView', tier: 'open', requiresKey: null, search: lazySearch('./crowdview.js') },
  { id: 'yacy', label: 'YaCy', tier: 'open', requiresKey: null, search: lazySearch('./yacy.js') },
  { id: 'europeana', label: 'Europeana', tier: 'open', requiresKey: null, search: lazySearch('./europeana.js') },
  { id: 'jstor', label: 'JSTOR', tier: 'open', requiresKey: null, search: lazySearch('./jstor.js') },
  { id: 'companies-house', label: 'UK Companies House', tier: 'open', requiresKey: null, search: lazySearch('./companieshouse.js') },
  { id: 'google-maps', label: 'Google Maps', tier: 'open', requiresKey: null, search: lazySearch('./googleMaps.js') },
  { id: 'google-books', label: 'Google Books', tier: 'open', requiresKey: null, search: lazySearch('./googleBooks.js') },
  { id: 'bing-maps', label: 'Bing Maps', tier: 'open', requiresKey: null, search: lazySearch('./bingMaps.js') },
  { id: 'yandex-maps', label: 'Yandex Maps', tier: 'open', requiresKey: null, search: lazySearch('./yandexMaps.js') },
  { id: 'baidu-index', label: 'Baidu Index', tier: 'open', requiresKey: null, search: lazySearch('./baiduIndex.js') },
  { id: 'weixin-sogou', label: 'Weixin Sogou', tier: 'open', requiresKey: null, search: lazySearch('./weixinSogou.js') },
  { id: 'tusksearch', label: 'TuskSearch', tier: 'open', requiresKey: null, search: lazySearch('./tuskSearch.js') },
  { id: 'excite', label: 'Excite', tier: 'open', requiresKey: null, search: lazySearch('./excite.js') },
  { id: 'biznar', label: 'Biznar', tier: 'open', requiresKey: null, search: lazySearch('./biznar.js') },
  { id: 'mednar', label: 'MedNar', tier: 'open', requiresKey: null, search: lazySearch('./mednar.js') },
  { id: 'scienceresearch', label: 'ScienceResearch', tier: 'open', requiresKey: null, search: lazySearch('./scienceResearch.js') },
  { id: 'kiddle', label: 'Kiddle', tier: 'open', requiresKey: null, search: lazySearch('./kiddle.js') },
  { id: 'petalsearch', label: 'Petal Search', tier: 'open', requiresKey: null, search: lazySearch('./petalSearch.js') },
  { id: 'grok', label: 'Grok', tier: 'open', requiresKey: null, search: lazySearch('./grok.js') },
  { id: 'loc-gov', label: 'Library of Congress', tier: 'open', requiresKey: null, search: lazySearch('./locGov.js') },
  { id: 'hathitrust', label: 'HathiTrust', tier: 'open', requiresKey: null, search: lazySearch('./hathiTrust.js') },
  { id: 'british-museum', label: 'British Museum', tier: 'open', requiresKey: null, search: lazySearch('./britishMuseum.js') },
  { id: 'royal-collection', label: 'Royal Collection Trust', tier: 'open', requiresKey: null, search: lazySearch('./royalCollectionTrust.js') },
  { id: 'british-library', label: 'British Library', tier: 'open', requiresKey: null, search: lazySearch('./britishLibrary.js') },

  // ── OSINT ─────────────────────────────────────────────────────────────────
  { id: 'shodan', label: 'Shodan', tier: 'osint', requiresKey: 'shodan', search: lazySearch('./shodan.js') },
  { id: 'censys', label: 'Censys', tier: 'osint', requiresKey: ['censysId', 'censysSecret'], search: lazySearch('./censys.js') },
  { id: 'hunter', label: 'Hunter.io', tier: 'osint', requiresKey: 'hunter', search: lazySearch('./hunter.js') },
  { id: 'intelx', label: 'IntelX', tier: 'osint', requiresKey: 'intelx', search: lazySearch('./intelx.js') },
  { id: 'publicwww', label: 'PublicWWW', tier: 'osint', requiresKey: 'publicwww', search: lazySearch('./publicwww.js') },
  { id: 'tineye', label: 'TinEye', tier: 'osint', requiresKey: 'tineye', search: lazySearch('./tineye.js') },
  { id: 'dehashed', label: 'DeHashed', tier: 'osint', requiresKey: 'dehashed', search: lazySearch('./dehashed.js') },
  { id: 'haveibeenpwned', label: 'Have I Been Pwned', tier: 'osint', requiresKey: 'hibp', search: lazySearch('./haveibeenpwned.js') },
  { id: 'greynoise', label: 'GreyNoise', tier: 'osint', requiresKey: 'greynoise', search: lazySearch('./greynoise.js') },

  // ── REGIONAL ──────────────────────────────────────────────────────────────
  { id: 'yandex', label: 'Yandex', tier: 'regional', requiresKey: 'yandex', search: lazySearch('./yandex.js') },
  { id: 'baidu', label: 'Baidu', tier: 'regional', requiresKey: null, search: lazySearch('./baidu.js') },
  { id: 'naver', label: 'Naver', tier: 'regional', requiresKey: ['naverClientId', 'naverClientSecret'], search: lazySearch('./naver.js') },
  { id: 'sogou', label: 'Sogou', tier: 'regional', requiresKey: null, search: lazySearch('./sogou.js') },
  { id: 'so360', label: 'So.com (360)', tier: 'regional', requiresKey: null, search: lazySearch('./so360.js') },
  { id: 'seznam', label: 'Seznam', tier: 'regional', requiresKey: null, search: lazySearch('./seznam.js') },
  { id: 'mail.ru', label: 'Mail.ru', tier: 'regional', requiresKey: null, search: lazySearch('./mailru.js') },
  { id: 'rambler', label: 'Rambler', tier: 'regional', requiresKey: null, search: lazySearch('./rambler.js') },

  // ── REGIONAL – Norway ──────────────────────────────────────────────────────
  { id: 'no-1881', label: '1881.no', tier: 'regional', requiresKey: null, search: lazySearch('./no1881.js') },
  { id: 'gulesider', label: 'Gule Sider', tier: 'regional', requiresKey: null, search: lazySearch('./gulesider.js') },
  { id: 'kvasir', label: 'Kvasir', tier: 'regional', requiresKey: null, search: lazySearch('./kvasir.js') },
  { id: 'sol-no', label: 'Sol.no', tier: 'regional', requiresKey: null, search: lazySearch('./solNo.js') },
  { id: 'brreg', label: 'Brønnøysundregistrene', tier: 'regional', requiresKey: null, search: lazySearch('./brreg.js') },
  { id: 'proff-no', label: 'Proff.no', tier: 'regional', requiresKey: null, search: lazySearch('./proffNo.js') },
  { id: 'norge-no', label: 'Norge.no', tier: 'regional', requiresKey: null, search: lazySearch('./norgeNo.js') },
  { id: 'oria-no', label: 'Oria', tier: 'regional', requiresKey: null, search: lazySearch('./oriaNO.js') },
  { id: 'digitalarkivet', label: 'Digitalarkivet', tier: 'regional', requiresKey: null, search: lazySearch('./digitalarkivet.js') },

  // ── REGIONAL – Northern Ireland ────────────────────────────────────────────
  { id: 'nidirect', label: 'NIDirect', tier: 'regional', requiresKey: null, search: lazySearch('./nidirect.js') },
  { id: 'proni-street', label: 'PRONI Street Directories', tier: 'regional', requiresKey: null, search: lazySearch('./proniStreetDir.js') },
  { id: 'nibusinessinfo', label: 'NI Business Info', tier: 'regional', requiresKey: null, search: lazySearch('./nibusinessinfo.js') },
  { id: 'nifed', label: 'NIFED', tier: 'regional', requiresKey: null, search: lazySearch('./nifed.js') },
  { id: 'linkupni', label: 'LinkUpNI', tier: 'regional', requiresKey: null, search: lazySearch('./linkupni.js') },
  { id: 'nijobs', label: 'NIJobs', tier: 'regional', requiresKey: null, search: lazySearch('./nijobs.js') },
  { id: 'propertypal', label: 'PropertyPal', tier: 'regional', requiresKey: null, search: lazySearch('./propertypal.js') },
  { id: 'propertynews', label: 'PropertyNews', tier: 'regional', requiresKey: null, search: lazySearch('./propertynews.js') },
  { id: '4ni', label: '4NI', tier: 'regional', requiresKey: null, search: lazySearch('./fourni.js') },
  { id: 'callupcontact', label: 'CallUpContact NI', tier: 'regional', requiresKey: null, search: lazySearch('./callupcontact.js') },
  { id: 'belfasttelegraph', label: 'Belfast Telegraph', tier: 'regional', requiresKey: null, search: lazySearch('./belfasttelegraph.js') },
  { id: 'irishnews', label: 'Irish News', tier: 'regional', requiresKey: null, search: lazySearch('./irishnewsCo.js') },
  { id: 'sluggerotoole', label: "Slugger O'Toole", tier: 'regional', requiresKey: null, search: lazySearch('./sluggerotoole.js') },
  { id: 'genesreunited', label: 'Genes Reunited', tier: 'regional', requiresKey: null, search: lazySearch('./genesreunited.js') },
  { id: 'thegazette', label: 'The Gazette', tier: 'regional', requiresKey: null, search: lazySearch('./thegazette.js') },

  // ── REGIONAL – Netherlands ─────────────────────────────────────────────────
  { id: 'kvk', label: 'KVK (Dutch Chamber)', tier: 'regional', requiresKey: null, search: lazySearch('./kvk.js') },
  { id: 'business-gov-nl', label: 'Business.gov.nl', tier: 'regional', requiresKey: null, search: lazySearch('./businessGovNl.js') },
  { id: 'telefoonboek', label: 'Telefoonboek', tier: 'regional', requiresKey: null, search: lazySearch('./telefoonboek.js') },
  { id: 'detelefoongids', label: 'De Telefoongids', tier: 'regional', requiresKey: null, search: lazySearch('./detelefoongids.js') },
  { id: 'goudengids', label: 'Gouden Gids', tier: 'regional', requiresKey: null, search: lazySearch('./goudengids.js') },
  { id: 'telefoongids-nl', label: 'Telefoongids-NL', tier: 'regional', requiresKey: null, search: lazySearch('./telefoongidsNl.js') },
  { id: 'kompass-nl', label: 'Kompass NL', tier: 'regional', requiresKey: null, search: lazySearch('./kompassNl.js') },
  { id: 'dutchregistry', label: 'Dutch Registry', tier: 'regional', requiresKey: null, search: lazySearch('./dutchregistry.js') },
  { id: 'adhocdata', label: 'Ad Hoc Data', tier: 'regional', requiresKey: null, search: lazySearch('./adhocdata.js') },
  { id: 'kadaster', label: 'Kadaster', tier: 'regional', requiresKey: null, search: lazySearch('./kadaster.js') },
  { id: 'archieven-nl', label: 'Archieven.nl', tier: 'regional', requiresKey: null, search: lazySearch('./archievenNl.js') },
  { id: 'openarchieven', label: 'Open Archieven', tier: 'regional', requiresKey: null, search: lazySearch('./openarchieven.js') },
  { id: 'wiewaswie', label: 'WieWasWie', tier: 'regional', requiresKey: null, search: lazySearch('./wiewaswie.js') },
  { id: 'genealogie-online', label: 'Genealogie Online', tier: 'regional', requiresKey: null, search: lazySearch('./genealogieOnline.js') },
  { id: 'delpher', label: 'Delpher', tier: 'regional', requiresKey: null, search: lazySearch('./delpher.js') },
  { id: 'nieuwe-instituut', label: 'Het Nieuwe Instituut', tier: 'regional', requiresKey: null, search: lazySearch('./nieuweInstituut.js') },
  { id: 'open-overheid', label: 'Open Overheid', tier: 'regional', requiresKey: null, search: lazySearch('./openOverheid.js') },
  { id: 'rijksoverheid', label: 'Rijksoverheid', tier: 'regional', requiresKey: null, search: lazySearch('./rijksoverheid.js') },
  { id: 'werk-nl', label: 'Werk.nl', tier: 'regional', requiresKey: null, search: lazySearch('./werkNl.js') },
  { id: 'nationalevacaturebank', label: 'Nationale Vacaturebank', tier: 'regional', requiresKey: null, search: lazySearch('./nationalevacaturebank.js') },

  // ── REGIONAL – Wales ───────────────────────────────────────────────────────
  { id: 'gov-wales', label: 'Gov.Wales', tier: 'regional', requiresKey: null, search: lazySearch('./govWales.js') },
  { id: 'business-wales', label: 'Business Wales', tier: 'regional', requiresKey: null, search: lazySearch('./businessWales.js') },
  { id: 'library-wales', label: 'National Library of Wales', tier: 'regional', requiresKey: null, search: lazySearch('./libraryWales.js') },
  { id: 'archives-wales', label: 'Archives Wales', tier: 'regional', requiresKey: null, search: lazySearch('./archivesWales.js') },
  { id: 'rcahmw', label: 'RCAHMW Coflein', tier: 'regional', requiresKey: null, search: lazySearch('./rcahmw.js') },
  { id: 'cadw', label: 'Cadw', tier: 'regional', requiresKey: null, search: lazySearch('./cadw.js') },
  { id: 'walesonline-dir', label: 'WalesOnline Directory', tier: 'regional', requiresKey: null, search: lazySearch('./walesOnlineDir.js') },
  { id: 'findwales', label: 'FindWales', tier: 'regional', requiresKey: null, search: lazySearch('./findWales.js') },
  { id: 'wales-business-network', label: 'Wales Business Network', tier: 'regional', requiresKey: null, search: lazySearch('./walesBusinessNetwork.js') },
  { id: 'libraries-wales', label: 'Libraries Wales', tier: 'regional', requiresKey: null, search: lazySearch('./librariesWales.js') },
  { id: 'national-archives-uk', label: 'UK National Archives', tier: 'regional', requiresKey: null, search: lazySearch('./nationalArchivesUk.js') },
  { id: 'senedd', label: 'Senedd Wales', tier: 'regional', requiresKey: null, search: lazySearch('./senedd.js') },

  // ── REGIONAL – London Historical ───────────────────────────────────────────
  { id: 'old-bailey', label: 'Old Bailey Online', tier: 'regional', requiresKey: null, search: lazySearch('./oldBailey.js') },
  { id: 'layers-of-london', label: 'Layers of London', tier: 'regional', requiresKey: null, search: lazySearch('./layersOfLondon.js') },
  { id: 'booth-poverty-map', label: 'Booth Poverty Map', tier: 'regional', requiresKey: null, search: lazySearch('./boothPovertyMap.js') },
  { id: 'locating-london', label: 'Locating London', tier: 'regional', requiresKey: null, search: lazySearch('./locatingLondon.js') },
  { id: 'london-picture-archive', label: 'London Picture Archive', tier: 'regional', requiresKey: null, search: lazySearch('./londonPictureArchive.js') },
  { id: 'british-history-online', label: 'British History Online', tier: 'regional', requiresKey: null, search: lazySearch('./britishHistoryOnline.js') },
  { id: 'map-of-london', label: 'Map of Early Modern London', tier: 'regional', requiresKey: null, search: lazySearch('./mapOfLondon.js') },
  { id: 'gm-lives', label: 'GM Lives', tier: 'regional', requiresKey: null, search: lazySearch('./gmLives.js') },

  // ── REGIONAL – Germany ─────────────────────────────────────────────────────
  { id: 'fireball', label: 'Fireball', tier: 'regional', requiresKey: null, search: lazySearch('./fireball.js') },
  { id: 'gelbeseiten', label: 'Gelbe Seiten', tier: 'regional', requiresKey: null, search: lazySearch('./gelbeseiten.js') },
  { id: 'dastelefonbuch', label: 'Das Telefonbuch', tier: 'regional', requiresKey: null, search: lazySearch('./dasTelefonbuch.js') },
  { id: 'dasoertliche', label: 'Das Örtliche', tier: 'regional', requiresKey: null, search: lazySearch('./dasOertliche.js') },
  { id: 'de-11880', label: '11880.com', tier: 'regional', requiresKey: null, search: lazySearch('./de11880.js') },
  { id: 'meinestadt', label: 'meinestadt.de', tier: 'regional', requiresKey: null, search: lazySearch('./meinestadt.js') },
  { id: 'web-de', label: 'Web.de', tier: 'regional', requiresKey: null, search: lazySearch('./webDe.js') },
  { id: 't-online', label: 'T-Online', tier: 'regional', requiresKey: null, search: lazySearch('./tOnline.js') },
  { id: 'gesis', label: 'GESIS', tier: 'regional', requiresKey: null, search: lazySearch('./gesis.js') },
  { id: 'bund-de', label: 'Bund.de', tier: 'regional', requiresKey: null, search: lazySearch('./bundDe.js') },

  // ── REGIONAL – Ireland ─────────────────────────────────────────────────────
  { id: 'goldenpages-ie', label: 'Golden Pages IE', tier: 'regional', requiresKey: null, search: lazySearch('./goldenpagesIe.js') },
  { id: 'businessworld-ie', label: 'Business World IE', tier: 'regional', requiresKey: null, search: lazySearch('./businessWorldIe.js') },
  { id: 'solocheck', label: 'SoloCheck', tier: 'regional', requiresKey: null, search: lazySearch('./solocheck.js') },
  { id: 'cro-ie', label: 'CRO Ireland', tier: 'regional', requiresKey: null, search: lazySearch('./croIe.js') },
  { id: 'gov-ie', label: 'Gov.ie', tier: 'regional', requiresKey: null, search: lazySearch('./govIe.js') },
  { id: 'data-gov-ie', label: 'Data.gov.ie', tier: 'regional', requiresKey: null, search: lazySearch('./dataGovIe.js') },
  { id: 'cso-ie', label: 'CSO Ireland', tier: 'regional', requiresKey: null, search: lazySearch('./cso.js') },
  { id: 'national-archives-ie', label: 'National Archives IE', tier: 'regional', requiresKey: null, search: lazySearch('./nationalArchivesIe.js') },
  { id: 'nli-ie', label: 'National Library of Ireland', tier: 'regional', requiresKey: null, search: lazySearch('./nli.js') },
  { id: 'askaboutireland', label: 'Ask About Ireland', tier: 'regional', requiresKey: null, search: lazySearch('./askAboutIreland.js') },
  { id: 'rootsireland', label: 'Roots Ireland', tier: 'regional', requiresKey: null, search: lazySearch('./rootsIreland.js') },
  { id: 'findmypast-ie', label: 'FindMyPast IE', tier: 'regional', requiresKey: null, search: lazySearch('./findmypastIe.js') },
  { id: 'myhome-ie', label: 'MyHome.ie', tier: 'regional', requiresKey: null, search: lazySearch('./myhomeIe.js') },
  { id: 'daft-ie', label: 'Daft.ie', tier: 'regional', requiresKey: null, search: lazySearch('./daft.js') },
  { id: 'jobs-ie', label: 'Jobs.ie', tier: 'regional', requiresKey: null, search: lazySearch('./jobsIe.js') },
  { id: 'irishjobs', label: 'IrishJobs', tier: 'regional', requiresKey: null, search: lazySearch('./irishjobs.js') },
  { id: 'rip-ie', label: 'RIP.ie', tier: 'regional', requiresKey: null, search: lazySearch('./ripIe.js') },

  // ── REGIONAL – Egypt ───────────────────────────────────────────────────────
  { id: 'yellowpages-eg', label: 'Yellow Pages Egypt', tier: 'regional', requiresKey: null, search: lazySearch('./yellowpagesEg.js') },
  { id: 'dalil140', label: 'Dalil 140', tier: 'regional', requiresKey: null, search: lazySearch('./dalil140.js') },
  { id: 'forasna', label: 'Forasna', tier: 'regional', requiresKey: null, search: lazySearch('./forasna.js') },
  { id: 'wuzzuf', label: 'Wuzzuf', tier: 'regional', requiresKey: null, search: lazySearch('./wuzzuf.js') },
  { id: 'aqarmap', label: 'Aqarmap', tier: 'regional', requiresKey: null, search: lazySearch('./aqarmap.js') },
  { id: 'dubizzle-eg', label: 'Dubizzle Egypt', tier: 'regional', requiresKey: null, search: lazySearch('./dubizzleEg.js') },
  { id: 'olx-eg', label: 'OLX Egypt', tier: 'regional', requiresKey: null, search: lazySearch('./olxEg.js') },
  { id: 'egypt-business', label: 'Egypt Business', tier: 'regional', requiresKey: null, search: lazySearch('./egyptBusiness.js') },
  { id: 'egyptian-industry', label: 'Egyptian Industry', tier: 'regional', requiresKey: null, search: lazySearch('./egyptianIndustry.js') },
  { id: 'idsc-eg', label: 'IDSC Egypt', tier: 'regional', requiresKey: null, search: lazySearch('./idscEg.js') },
  { id: 'invest-egypt', label: 'Invest in Egypt', tier: 'regional', requiresKey: null, search: lazySearch('./investEgypt.js') },
  { id: 'capmas', label: 'CAPMAS Egypt', tier: 'regional', requiresKey: null, search: lazySearch('./capmas.js') },
  { id: 'egx', label: 'Egyptian Exchange', tier: 'regional', requiresKey: null, search: lazySearch('./egx.js') },

  // ── REGIONAL – Belgium ─────────────────────────────────────────────────────
  { id: 'whitepages-be', label: 'White Pages Belgium', tier: 'regional', requiresKey: null, search: lazySearch('./whitepagesBe.js') },

  // ── REGIONAL – DRC (Congo) ──────────────────────────────────────────────
  { id: 'acp-cd', label: 'ACP Congo', tier: 'regional', requiresKey: null, search: lazySearch('./acpCd.js') },
  { id: 'rcst-cd', label: 'RCST Congo', tier: 'regional', requiresKey: null, search: lazySearch('./rcstCd.js') },
  { id: 'odd-dashboard-cd', label: 'ODD Dashboard Congo', tier: 'regional', requiresKey: null, search: lazySearch('./oddDashboardCd.js') },
  { id: 'inrb-cd', label: 'INRB Congo', tier: 'regional', requiresKey: null, search: lazySearch('./inrbCd.js') },
  { id: 'drc-precop-cd', label: 'DRC PreCOP Environment', tier: 'regional', requiresKey: null, search: lazySearch('./drcPrecopCd.js') },
  { id: 'julisha-cd', label: 'Julisha Congo', tier: 'regional', requiresKey: null, search: lazySearch('./julishaCd.js') },
  { id: 'pnmls-cd', label: 'PNMLS Documentation', tier: 'regional', requiresKey: null, search: lazySearch('./pnmlsCd.js') },

  // ── REGIONAL – Argentina ────────────────────────────────────────────────────
  { id: 'infoleg-ar', label: 'InfoLeg Argentina', tier: 'regional', requiresKey: null, search: lazySearch('./infolegAr.js') },
  { id: 'justicia-ar', label: 'Argentina Justicia', tier: 'regional', requiresKey: null, search: lazySearch('./justiciaAr.js') },
  { id: 'mseg-ar', label: 'MSEG Buenos Aires', tier: 'regional', requiresKey: null, search: lazySearch('./msegAr.js') },
  { id: 'pjn-ar', label: 'PJN Argentina', tier: 'regional', requiresKey: null, search: lazySearch('./pjnAr.js') },
  { id: 'cij-ar', label: 'CIJ Argentina', tier: 'regional', requiresKey: null, search: lazySearch('./cijAr.js') },
  { id: 'boletin-oficial-ar', label: 'Boletín Oficial Argentina', tier: 'regional', requiresKey: null, search: lazySearch('./boletinOficialAr.js') },
  { id: 'afip-ar', label: 'AFIP Argentina', tier: 'regional', requiresKey: null, search: lazySearch('./afipAr.js') },
  { id: 'datos-abiertos-ar', label: 'Datos Abiertos Argentina', tier: 'regional', requiresKey: null, search: lazySearch('./datosAbiertosAr.js') },
  { id: 'migraciones-ar', label: 'Migraciones Argentina', tier: 'regional', requiresKey: null, search: lazySearch('./migracionesAr.js') },
  { id: 'comprar-ar', label: 'Comprar Argentina', tier: 'regional', requiresKey: null, search: lazySearch('./comprarAr.js') },

  // ── REGIONAL – Romania ──────────────────────────────────────────────────────
  { id: 'politia-ro', label: 'Romanian Police', tier: 'regional', requiresKey: null, search: lazySearch('./politiaRo.js') },
  { id: 'politia-frontiera-ro', label: 'Border Police Romania', tier: 'regional', requiresKey: null, search: lazySearch('./politiaFrontieraRo.js') },
  { id: 'onrc-ro', label: 'ONRC Romania', tier: 'regional', requiresKey: null, search: lazySearch('./onrcRo.js') },
  { id: 'listafirme-ro', label: 'Lista Firme', tier: 'regional', requiresKey: null, search: lazySearch('./listafirmeRo.js') },
  { id: 'romanian-companies', label: 'Romanian Companies', tier: 'regional', requiresKey: null, search: lazySearch('./romanianCompanies.js') },
  { id: 'arhiva-nationala-ro', label: 'National Archives Romania', tier: 'regional', requiresKey: null, search: lazySearch('./arhivaNationalaRo.js') },
  { id: 'biblioteca-nationala-ro', label: 'National Library Romania', tier: 'regional', requiresKey: null, search: lazySearch('./bibliotecaNationalaRo.js') },
  { id: 'e-licitatie-ro', label: 'e-Licitatie Romania', tier: 'regional', requiresKey: null, search: lazySearch('./eLicitatieRo.js') },
  { id: 'anaf-ro', label: 'ANAF Romania', tier: 'regional', requiresKey: null, search: lazySearch('./anafRo.js') },
  { id: 'portal-just-ro', label: 'Portal Just Romania', tier: 'regional', requiresKey: null, search: lazySearch('./portalJustRo.js') },
  { id: 'rejust-ro', label: 'ReJust Romania', tier: 'regional', requiresKey: null, search: lazySearch('./rejustRo.js') },
  { id: 'rolii-ro', label: 'ROLII Romania', tier: 'regional', requiresKey: null, search: lazySearch('./roliiRo.js') },
  { id: 'genealogica-ro', label: 'Genealogica Romania', tier: 'regional', requiresKey: null, search: lazySearch('./genealogicaRo.js') },
  { id: 'sicap-ro', label: 'SICAP Romania', tier: 'regional', requiresKey: null, search: lazySearch('./sicapRo.js') },

  // ── REGIONAL – Eritrea ──────────────────────────────────────────────────────
  { id: 'shabait-er', label: 'Shabait Eritrea', tier: 'regional', requiresKey: null, search: lazySearch('./shabaitEr.js') },
  { id: 'eritrea-info-er', label: 'Eritrea Information', tier: 'regional', requiresKey: null, search: lazySearch('./eritreaInfoEr.js') },
  { id: 'eritrea-yellow-pages', label: 'Eritrea Yellow Pages', tier: 'regional', requiresKey: null, search: lazySearch('./eritreaYellowPages.js') },
  { id: 'erilaw-er', label: 'EriLaw', tier: 'regional', requiresKey: null, search: lazySearch('./erilawEr.js') },
  { id: 'worldlii-er', label: 'WorldLII Eritrea', tier: 'regional', requiresKey: null, search: lazySearch('./worldliiEr.js') },

  // ── REGIONAL – Iran ─────────────────────────────────────────────────────────
  { id: 'irandoc-ir', label: 'IranDoc', tier: 'regional', requiresKey: null, search: lazySearch('./irandocIr.js') },
  { id: 'sid-ir', label: 'SID Iran', tier: 'regional', requiresKey: null, search: lazySearch('./sidIr.js') },
  { id: 'nlai-ir', label: 'National Library Iran', tier: 'regional', requiresKey: null, search: lazySearch('./nlaiIr.js') },
  { id: 'jref-ir', label: 'JREF Iran', tier: 'regional', requiresKey: null, search: lazySearch('./jrefIr.js') },
  { id: 'vlist-ir', label: 'VList Iran', tier: 'regional', requiresKey: null, search: lazySearch('./vlistIr.js') },
  { id: 'company-register-ir', label: 'Company Register Iran', tier: 'regional', requiresKey: null, search: lazySearch('./companyRegisterIr.js') },
  { id: 'symposia-ir', label: 'Symposia Iran', tier: 'regional', requiresKey: null, search: lazySearch('./symposiaIr.js') },
  { id: 'trade-with-iran', label: 'Trade With Iran', tier: 'regional', requiresKey: null, search: lazySearch('./tradeWithIranIr.js') },
  { id: 'mfa-ir', label: 'MFA Iran', tier: 'regional', requiresKey: null, search: lazySearch('./mfaIr.js') },
  { id: 'iran-law-ir', label: 'Iran Law Journal', tier: 'regional', requiresKey: null, search: lazySearch('./iranLawIr.js') },

  // ── REGIONAL – Luxembourg ───────────────────────────────────────────────────
  { id: 'lbr-lu', label: 'LBR Luxembourg', tier: 'regional', requiresKey: null, search: lazySearch('./lbrLu.js') },
  { id: 'guichet-lu', label: 'Guichet Luxembourg', tier: 'regional', requiresKey: null, search: lazySearch('./guichetLu.js') },
  { id: 'legilux-lu', label: 'Legilux', tier: 'regional', requiresKey: null, search: lazySearch('./legiluxLu.js') },
  { id: 'justice-lu', label: 'Justice Luxembourg', tier: 'regional', requiresKey: null, search: lazySearch('./justiceLu.js') },
  { id: 'data-lu', label: 'Data Luxembourg', tier: 'regional', requiresKey: null, search: lazySearch('./dataLu.js') },
  { id: 'geoportail-lu', label: 'Geoportail Luxembourg', tier: 'regional', requiresKey: null, search: lazySearch('./geoportailLu.js') },
  { id: 'police-lu', label: 'Police Luxembourg', tier: 'regional', requiresKey: null, search: lazySearch('./policeLu.js') },
  { id: 'editus-lu', label: 'Editus Luxembourg', tier: 'regional', requiresKey: null, search: lazySearch('./editusLu.js') },
  { id: 'proff-lu', label: 'Proff Luxembourg', tier: 'regional', requiresKey: null, search: lazySearch('./proffLu.js') },
  { id: 'archives-lu', label: 'Archives Luxembourg', tier: 'regional', requiresKey: null, search: lazySearch('./archivesLu.js') },
  { id: 'bnl-lu', label: 'National Library Luxembourg', tier: 'regional', requiresKey: null, search: lazySearch('./bnlLu.js') },
  { id: 'cc-lu', label: 'Chamber of Commerce Luxembourg', tier: 'regional', requiresKey: null, search: lazySearch('./ccLu.js') },

  // ── REGIONAL – London Boroughs ──────────────────────────────────────────────
  { id: 'harrow-planning', label: 'Harrow Planning', tier: 'regional', requiresKey: null, search: lazySearch('./harrowPlanning.js') },
  { id: 'richmond-planning', label: 'Richmond Planning', tier: 'regional', requiresKey: null, search: lazySearch('./richmondPlanning.js') },
  { id: 'wandsworth-planning', label: 'Wandsworth Planning', tier: 'regional', requiresKey: null, search: lazySearch('./wandsworthPlanning.js') },
  { id: 'merton-planning', label: 'Merton Planning', tier: 'regional', requiresKey: null, search: lazySearch('./mertonPlanning.js') },
  { id: 'bromley-planning', label: 'Bromley Planning', tier: 'regional', requiresKey: null, search: lazySearch('./bromleyPlanning.js') },
  { id: 'sutton-planning', label: 'Sutton Planning', tier: 'regional', requiresKey: null, search: lazySearch('./suttonPlanning.js') },
  { id: 'kingston-planning', label: 'Kingston Planning', tier: 'regional', requiresKey: null, search: lazySearch('./kingstonPlanning.js') },
  { id: 'enfield-planning', label: 'Enfield Planning', tier: 'regional', requiresKey: null, search: lazySearch('./enfieldPlanning.js') },
  { id: 'hackney-archives', label: 'Hackney Archives', tier: 'regional', requiresKey: null, search: lazySearch('./hackneyArchives.js') },
  { id: 'london-archives', label: 'London Archives', tier: 'regional', requiresKey: null, search: lazySearch('./londonArchives.js') },
  { id: 'met-police', label: 'Metropolitan Police', tier: 'regional', requiresKey: null, search: lazySearch('./metPolice.js') },
  { id: 'gmp-police', label: 'Greater Manchester Police', tier: 'regional', requiresKey: null, search: lazySearch('./gmpPolice.js') },

  // ── REGIONAL – Cornwall ─────────────────────────────────────────────────────
  { id: 'cornwall-gov', label: 'Cornwall Council', tier: 'regional', requiresKey: null, search: lazySearch('./cornwallGov.js') },
  { id: 'devon-cornwall-police', label: 'Devon & Cornwall Police', tier: 'regional', requiresKey: null, search: lazySearch('./devonCornwallPolice.js') },

  // ── REGIONAL – Isle of Man ──────────────────────────────────────────────────
  { id: 'gov-im', label: 'Isle of Man Gov', tier: 'regional', requiresKey: null, search: lazySearch('./govIm.js') },
  { id: 'planning-im', label: 'Isle of Man Planning', tier: 'regional', requiresKey: null, search: lazySearch('./planningIm.js') },

  // ── REGIONAL – Birmingham ───────────────────────────────────────────────────
  { id: 'birmingham-planning', label: 'Birmingham Planning', tier: 'regional', requiresKey: null, search: lazySearch('./birminghamPlanning.js') },

  // ── REGIONAL – New York State ──────────────────────────────────────────────
  { id: 'dol-ny', label: 'NY DOL Contractor Registry', tier: 'regional', requiresKey: null, search: lazySearch('./dolNy.js') },
  { id: 'nyscr-ny', label: 'NY State Contract Reporter', tier: 'regional', requiresKey: null, search: lazySearch('./nyscrNy.js') },
  { id: 'dmv-ny', label: 'NY DMV', tier: 'regional', requiresKey: null, search: lazySearch('./dmvNy.js') },
  { id: 'nysm-ny', label: 'NY State Museum', tier: 'regional', requiresKey: null, search: lazySearch('./nysmNy.js') },

  // ── REGIONAL – France ──────────────────────────────────────────────────────
  { id: 'pagesjaunes-fr', label: 'PagesJaunes', tier: 'regional', requiresKey: null, search: lazySearch('./pagesJaunesFr.js') },
  { id: '118712-fr', label: '118712', tier: 'regional', requiresKey: null, search: lazySearch('./fr118712.js') },
  { id: '118000-fr', label: '118000', tier: 'regional', requiresKey: null, search: lazySearch('./fr118000.js') },
  { id: 'orange-annuaire-fr', label: 'Orange Annuaire', tier: 'regional', requiresKey: null, search: lazySearch('./orangeAnnuaireFr.js') },
  { id: 'societe-fr', label: 'Societe.com', tier: 'regional', requiresKey: null, search: lazySearch('./societeFr.js') },
  { id: 'verif-fr', label: 'Verif.com', tier: 'regional', requiresKey: null, search: lazySearch('./verifFr.js') },
  { id: 'infobel-fr', label: 'Infobel France', tier: 'regional', requiresKey: null, search: lazySearch('./infobelFr.js') },
  { id: 'europages-fr', label: 'Europages France', tier: 'regional', requiresKey: null, search: lazySearch('./europagesFr.js') },
  { id: 'kompass-fr', label: 'Kompass France', tier: 'regional', requiresKey: null, search: lazySearch('./kompassFr.js') },
  { id: 'service-public-fr', label: 'Service-Public.fr', tier: 'regional', requiresKey: null, search: lazySearch('./servicePublicFr.js') },
  { id: 'jdn-fr', label: 'Journal du Net', tier: 'regional', requiresKey: null, search: lazySearch('./jdnFr.js') },
  { id: 'recherche-fr', label: 'Recherche.fr', tier: 'regional', requiresKey: null, search: lazySearch('./rechercheFr.js') },
  { id: 'voila-fr', label: 'Voila.fr', tier: 'regional', requiresKey: null, search: lazySearch('./voilaFr.js') },

  // ── REGIONAL – Poland ──────────────────────────────────────────────────────
  { id: 'onet-pl', label: 'Onet.pl', tier: 'regional', requiresKey: null, search: lazySearch('./onetPl.js') },
  { id: 'wp-pl', label: 'Wirtualna Polska', tier: 'regional', requiresKey: null, search: lazySearch('./wpPl.js') },
  { id: 'interia-pl', label: 'Interia.pl', tier: 'regional', requiresKey: null, search: lazySearch('./interiaPl.js') },
  { id: 'gazeta-pl', label: 'Gazeta.pl', tier: 'regional', requiresKey: null, search: lazySearch('./gazetaPl.js') },
  { id: 'whitepages-pl', label: 'WhitePages Poland', tier: 'regional', requiresKey: null, search: lazySearch('./whitepagesPl.js') },
  { id: 'biznes-gov-pl', label: 'Biznes.gov.pl', tier: 'regional', requiresKey: null, search: lazySearch('./biznesGovPl.js') },
  { id: 'ceidg-pl', label: 'CEIDG Poland', tier: 'regional', requiresKey: null, search: lazySearch('./ceidgPl.js') },
  { id: 'regon-pl', label: 'REGON Poland', tier: 'regional', requiresKey: null, search: lazySearch('./regonPl.js') },
  { id: 'krs-pl', label: 'KRS Poland', tier: 'regional', requiresKey: null, search: lazySearch('./krsPl.js') },
  { id: 'knf-pl', label: 'KNF Poland', tier: 'regional', requiresKey: null, search: lazySearch('./knfPl.js') },
  { id: 'uprp-pl', label: 'UPRP Poland', tier: 'regional', requiresKey: null, search: lazySearch('./uprpPl.js') },
  { id: 'ppm-pl', label: 'PPM.edu.pl', tier: 'regional', requiresKey: null, search: lazySearch('./ppmPl.js') },
  { id: 'pkt-pl', label: 'PKT.pl', tier: 'regional', requiresKey: null, search: lazySearch('./pktPl.js') },
  { id: 'zumi-pl', label: 'Zumi.pl', tier: 'regional', requiresKey: null, search: lazySearch('./zumiPl.js') },
  { id: 'o2-pl', label: 'O2.pl', tier: 'regional', requiresKey: null, search: lazySearch('./o2Pl.js') },

  // ── REGIONAL – Switzerland ────────────────────────────────────────────────
  { id: 'search-ch', label: 'Search.ch', tier: 'regional', requiresKey: null, search: lazySearch('./searchCh.js') },
  { id: 'local-ch', label: 'Local.ch', tier: 'regional', requiresKey: null, search: lazySearch('./localCh.js') },
  { id: 'tiger-ch', label: 'Tiger.ch', tier: 'regional', requiresKey: null, search: lazySearch('./tigerCh.js') },

  // ── REGIONAL – South Korea ────────────────────────────────────────────────
  { id: 'daum-kr', label: 'Daum', tier: 'regional', requiresKey: null, search: lazySearch('./daumKr.js') },
  { id: 'kakao-map-kr', label: 'Kakao Map', tier: 'regional', requiresKey: null, search: lazySearch('./kakaoMapKr.js') },
  { id: 'nate-kr', label: 'Nate', tier: 'regional', requiresKey: null, search: lazySearch('./nateKr.js') },
  { id: 'zum-kr', label: 'Zum', tier: 'regional', requiresKey: null, search: lazySearch('./zumKr.js') },
  { id: '11st-kr', label: '11st', tier: 'regional', requiresKey: null, search: lazySearch('./kr11st.js') },
  { id: 'coupang-kr', label: 'Coupang', tier: 'regional', requiresKey: null, search: lazySearch('./coupangKr.js') },
  { id: 'gmarket-kr', label: 'Gmarket', tier: 'regional', requiresKey: null, search: lazySearch('./gmarketKr.js') },
  { id: 'auction-kr', label: 'Auction', tier: 'regional', requiresKey: null, search: lazySearch('./auctionKr.js') },
  { id: 'jobkorea-kr', label: 'JobKorea', tier: 'regional', requiresKey: null, search: lazySearch('./jobKoreaKr.js') },
  { id: 'saramin-kr', label: 'Saramin', tier: 'regional', requiresKey: null, search: lazySearch('./saraminKr.js') },
  { id: '114-kr', label: '114.co.kr', tier: 'regional', requiresKey: null, search: lazySearch('./kr114.js') },
  { id: 'koreatechdesk', label: 'Korea Tech Desk', tier: 'regional', requiresKey: null, search: lazySearch('./koreaTechDesk.js') },

  // ── META ──────────────────────────────────────────────────────────────────
  { id: 'startpage', label: 'Startpage', tier: 'meta', requiresKey: null, search: lazySearch('./startpage.js') },
  { id: 'dogpile', label: 'Dogpile', tier: 'meta', requiresKey: null, search: lazySearch('./dogpile.js') },
  { id: 'metacrawler', label: 'MetaCrawler', tier: 'meta', requiresKey: null, search: lazySearch('./metacrawler.js') },
  { id: 'etools', label: 'eTools', tier: 'meta', requiresKey: null, search: lazySearch('./etools.js') },
  { id: 'ecosia', label: 'Ecosia', tier: 'meta', requiresKey: null, search: lazySearch('./ecosia.js') },
  { id: 'presearch', label: 'Presearch', tier: 'meta', requiresKey: null, search: lazySearch('./presearch.js') },
  { id: 'webcrawler', label: 'WebCrawler', tier: 'meta', requiresKey: null, search: lazySearch('./webcrawler.js') },
  { id: 'faganfinder', label: 'FaganFinder', tier: 'meta', requiresKey: null, search: lazySearch('./faganfinder.js') },
  { id: 'yahoo', label: 'Yahoo', tier: 'meta', requiresKey: null, search: lazySearch('./yahoo.js') },
  { id: 'gibiru', label: 'Gibiru', tier: 'meta', requiresKey: null, search: lazySearch('./gibiru.js') },
  { id: 'freespoke', label: 'Freespoke', tier: 'meta', requiresKey: null, search: lazySearch('./freespoke.js') },
  { id: 'mamma', label: 'Mamma', tier: 'meta', requiresKey: null, search: lazySearch('./mamma.js') },
  { id: 'you.com', label: 'You.com', tier: 'meta', requiresKey: null, search: lazySearch('./youcom.js') },

  // ── OBSCURE ───────────────────────────────────────────────────────────────
  { id: 'refseek', label: 'RefSeek', tier: 'obscure', requiresKey: null, search: lazySearch('./refseek.js') },
  { id: 'lycos', label: 'Lycos', tier: 'obscure', requiresKey: null, search: lazySearch('./lycos.js') },
  { id: 'millionshort', label: 'MillionShort', tier: 'obscure', requiresKey: null, search: lazySearch('./millionshort.js') },
  { id: 'boardreader', label: 'BoardReader', tier: 'obscure', requiresKey: null, search: lazySearch('./boardreader.js') },
  { id: 'sourcegraph', label: 'Sourcegraph', tier: 'obscure', requiresKey: null, search: lazySearch('./sourcegraph.js') },
  { id: 'scholar-google', label: 'Google Scholar', tier: 'obscure', requiresKey: null, search: lazySearch('./scholarGoogle.js') },
  { id: 'yippy', label: 'Yippy', tier: 'obscure', requiresKey: null, search: lazySearch('./yippy.js') },
  { id: 'exactseek', label: 'ExactSeek', tier: 'obscure', requiresKey: null, search: lazySearch('./exactseek.js') },
  { id: 'alltheinternet', label: 'AllTheInternet', tier: 'obscure', requiresKey: null, search: lazySearch('./alltheinternet.js') },
  { id: 'oscobo', label: 'Oscobo', tier: 'obscure', requiresKey: null, search: lazySearch('./oscobo.js') },
  { id: 'searchencrypt', label: 'SearchEncrypt', tier: 'obscure', requiresKey: null, search: lazySearch('./searchencrypt.js') },
  { id: 'info', label: 'Info.com', tier: 'obscure', requiresKey: null, search: lazySearch('./info.js') },
  { id: 'searchalot', label: 'SearchAlot', tier: 'obscure', requiresKey: null, search: lazySearch('./searchalot.js') },
  { id: 'anoox', label: 'Anoox', tier: 'obscure', requiresKey: null, search: lazySearch('./anoox.js') },
  { id: 'secretsearch', label: 'Secret Search Engine Labs', tier: 'obscure', requiresKey: null, search: lazySearch('./secretsearch.js') },
  { id: 'blog-search', label: 'Blog Search', tier: 'obscure', requiresKey: null, search: lazySearch('./blogsearch.js') },
  { id: 'findsounds', label: 'FindSounds', tier: 'obscure', requiresKey: null, search: lazySearch('./findsounds.js') },
  { id: 'rpmfind', label: 'RPMFind', tier: 'obscure', requiresKey: null, search: lazySearch('./rpmfind.js') },
  { id: 'worldwidescience', label: 'WorldWideScience', tier: 'obscure', requiresKey: null, search: lazySearch('./worldwidescience.js') },
  { id: 'scienceopen', label: 'ScienceOpen', tier: 'obscure', requiresKey: null, search: lazySearch('./scienceopen.js') },
  { id: 'krugle', label: 'Krugle', tier: 'obscure', requiresKey: null, search: lazySearch('./krugle.js') },
  { id: 'researchgate', label: 'ResearchGate', tier: 'obscure', requiresKey: null, search: lazySearch('./researchgate.js') },
  { id: 'academia', label: 'Academia.edu', tier: 'obscure', requiresKey: null, search: lazySearch('./academia.js') },
  { id: 'ssrn', label: 'SSRN', tier: 'obscure', requiresKey: null, search: lazySearch('./ssrn.js') },
];

export function getActive(apiKeys, mode) {
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

export { ALL_CONNECTORS };
