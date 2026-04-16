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

  // ── OSINT ─────────────────────────────────────────────────────────────────
  { id: 'shodan', label: 'Shodan', tier: 'osint', requiresKey: 'shodan', search: lazySearch('./shodan.js') },
  { id: 'censys', label: 'Censys', tier: 'osint', requiresKey: ['censysId', 'censysSecret'], search: lazySearch('./censys.js') },
  { id: 'hunter', label: 'Hunter.io', tier: 'osint', requiresKey: 'hunter', search: lazySearch('./hunter.js') },
  { id: 'intelx', label: 'IntelX', tier: 'osint', requiresKey: 'intelx', search: lazySearch('./intelx.js') },
  { id: 'publicwww', label: 'PublicWWW', tier: 'osint', requiresKey: 'publicwww', search: lazySearch('./publicwww.js') },
  { id: 'tineye', label: 'TinEye', tier: 'osint', requiresKey: 'tineye', search: lazySearch('./tineye.js') },

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
