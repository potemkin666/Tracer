/* global AbortSignal, DOMParser, EventSource, TextEncoder, URLSearchParams, crypto, document, fetch, localStorage, location, sessionStorage */

import { buildQueryPlan, queryVariants } from './shared/queryShared.js';
import { createKeyStorage } from './shared/keyStorage.js';
import { buildResultsBrief } from './shared/resultBrief.js';
import {
  buildConsensusFractureMap,
  buildRelatedQueries,
  buildSourceFamilyTree,
  buildTimeline,
  findFirstBlood,
} from './shared/resultInsightsShared.js';
import {
  searchDirect as runStandaloneSearch,
  searchVariants,
} from './standalone/search.js';

// ── BUBBLES ──────────────────────────────────────────────────────────────────
(function(){
  const c=document.getElementById('bubbles');
  for(let i=0;i<26;i++){
    const b=document.createElement('div');b.className='bubble';
    const s=4+Math.random()*14;
    b.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;`+
      `animation-duration:${9+Math.random()*22}s;animation-delay:${-Math.random()*28}s;`+
      `opacity:${.15+Math.random()*.45}`;
    c.appendChild(b);
  }
})();

// ── FISH ─────────────────────────────────────────────────────────────────────
(function(){
    const glyphs=['🐟','🐠','🐡','🦈','🐙'];
  for(let i=0;i<5;i++){
    const f=document.createElement('div');f.className='fish';
    f.textContent=glyphs[i%glyphs.length];
    f.style.cssText=`top:${10+Math.random()*80}%;font-size:${.9+Math.random()*1.1}rem;`+
      `animation-duration:${28+Math.random()*38}s;animation-delay:${-Math.random()*55}s`;
    document.body.appendChild(f);
  }
})();

let _lastResults=[];

// ── SHARED ENGINE METADATA ────────────────────────────────────────────────────
const ENGINE_METADATA=globalThis.TRACER_ENGINE_METADATA||{
  keyDefs:[],
  standalone:{openFetchers:[],sourceTierMap:{}},
  sourceTierMap:{},
};
const KEY_DEFS=ENGINE_METADATA.keyDefs||[];
const keyStorage = createKeyStorage({ storage: sessionStorage, prefix: 'tracer_' });

// Build key grid
(function(){
  const grid=document.getElementById('keys-grid');
  KEY_DEFS.forEach(k=>{
    const div=document.createElement('div');div.className='key-item';
    const isUrl=k.id==='searxngUrl'||k.id==='googleCx';
    div.innerHTML=`<label>${k.label}</label>`+
      `<input type="${isUrl?'text':'password'}" id="k-${k.id}" autocomplete="off">`;
    grid.appendChild(div);
  });
})();

function loadKeys(){KEY_DEFS.forEach(k=>{const el=document.getElementById('k-'+k.id);if(el)el.value=keyStorage.get(k.id)})}
function saveKeys(){KEY_DEFS.forEach(k=>{const el=document.getElementById('k-'+k.id);if(el)el.value?keyStorage.set(k.id,el.value):keyStorage.remove(k.id)});showErr('Keys saved for this session.',false)}
function clearKeys(){KEY_DEFS.forEach(k=>{keyStorage.remove(k.id);const el=document.getElementById('k-'+k.id);if(el)el.value=''})}
function collectKeys(){const o={};KEY_DEFS.forEach(k=>{const el=document.getElementById('k-'+k.id);if(el&&el.value.trim())o[k.id]=el.value.trim()});return o}

// ── CONNECTION ────────────────────────────────────────────────────────────────
let connected=false;
const isFileProtocol=location.protocol==='file:';
const isStandaloneClient=isFileProtocol||location.hostname.endsWith('.github.io');
const LOCAL_SERVER_BASE='http://localhost:3000';
const CONNECTION_TIMEOUT_MS=3000;
function setUiStatus(status,text){
  document.body.dataset.status=status;
  const el=document.getElementById('status-text');
  if(el&&text)el.textContent=text;
}
function getStandaloneEngineLabel(){
  const openCount=(ENGINE_METADATA.standalone&&ENGINE_METADATA.standalone.openFetchers
    ?ENGINE_METADATA.standalone.openFetchers.length
    :0);
  if(!isStandaloneClient)return '0 open currents (local station offline)';
  if(isFileProtocol)return `${openCount} open currents (portable surface sweep active)`;
  return `${openCount} open currents (standalone shoreline mode)`;
}

async function checkConn(){
  const base=LOCAL_SERVER_BASE;
  try{
    const r=await fetch(base+'/health',{signal:AbortSignal.timeout(CONNECTION_TIMEOUT_MS)});
    if(r.ok){
      connected=true;
      document.getElementById('dot').className='dot on';
      document.getElementById('conn-lbl').textContent='ONLINE';
      updateEngCount(base);
      return true;
    }
  }catch{
    // ignore offline health failures
  }
  connected=false;
  document.getElementById('dot').className='dot'+(isStandaloneClient?' standalone':'');
  document.getElementById('conn-lbl').textContent=isStandaloneClient?'STANDALONE':'OFFLINE';
  document.getElementById('eng-count').textContent=getStandaloneEngineLabel();
  return false;
}

async function updateEngCount(base){
  try{
    const r=await fetch(base+'/engines',{signal:AbortSignal.timeout(CONNECTION_TIMEOUT_MS)});
    if(r.ok){const d=await r.json();document.getElementById('eng-count').textContent=d.total+' engines ('+d.active+' live currents) — sonar streaming';return}
  }catch{
    // ignore engine count failures
  }
  document.getElementById('eng-count').textContent='connected (sonar streaming)';
}

// ── DIRECT CLIENT-SIDE SEARCH (no local server needed) ───────────────────────
// All sources run in parallel via Promise.allSettled for maximum speed.
// Each fetcher is a self-contained async function that returns an array of results.
// Sources that lack CORS support from browsers are still included (they fail silently).

// ── fetchWithRetry: single retry with exponential backoff + 429 handling ──
const _rateLimitWarnings=[];
async function fetchWithRetry(url,opts,retries=1){
  const timeout=10000;
  async function attempt(){
    const r=await fetch(url,Object.assign({signal:AbortSignal.timeout(timeout)},opts||{}));
    if(r.status===429){
      const src=new URL(url).hostname;
      // Retry-After may be seconds (integer) or an HTTP-date; handle both
      const raHeader=r.headers.get('Retry-After');
      let waitSec=30;
      if(raHeader){
        const asNum=parseInt(raHeader,10);
        if(!isNaN(asNum)&&asNum>0&&asNum<=120)waitSec=asNum;
        else{const d=Date.parse(raHeader);if(!isNaN(d))waitSec=Math.min(120,Math.max(1,Math.ceil((d-Date.now())/1000)))}
      }
      _rateLimitWarnings.push(`${src} rate-limited — retry in ${waitSec}s`);
      if(retries>0){
        await new Promise(ok=>setTimeout(ok,waitSec*1000));
        retries--;
        return attempt();
      }
      const err=new Error(`429 rate-limited: ${src}`);err._rateLimited=true;throw err;
    }
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    return r.json();
  }
  try{return await attempt()}
  catch(e){
    if(retries>0&&!e._rateLimited){
      retries--;
      await new Promise(ok=>setTimeout(ok,2000));
      return attempt();
    }
    throw e;
  }
}
// Safely decode HTML entities (StackExchange API returns encoded titles).
function decodeEntities(s){const el=document.createElement('textarea');el.innerHTML=s;return el.value;}
function stripHtml(s){return String(s||'').replace(/<\/?[^>]+(>|$)/g,'');}
function formatStackExchangeUserSnippet(user){
  const badgeCounts=user.badge_counts||{};
  return [
    user.reputation?`${user.reputation} reputation`:'',
    user.location||'',
    badgeCounts.gold?`${badgeCounts.gold} gold badges`:'',
  ].filter(Boolean).join(' · ');
}

async function searchDirect(query){
  const plan=buildQueryPlan(query);
  const q=encodeURIComponent(plan.raw);
  _rateLimitWarnings.length=0;

  // Each fetcher has a name and function returning an array of results
  const openFetchers=[

    // ── Wikipedia ──
    {name:'wikipedia',fn:async()=>{
        const d=await fetchWithRetry(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${q}&srlimit=8&format=json&origin=*`);
        return(d.query&&d.query.search||[]).map((item,i)=>({source:'wikipedia',
          title:item.title||'',url:`https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`,
          snippet:stripHtml(item.snippet).slice(0,180),
          score:8-i,seenOn:['wikipedia']}));
    }},

    // ── Wikidata ──
    {name:'wikidata',fn:async()=>{
      const d=await fetchWithRetry(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${q}&language=en&limit=5&format=json&origin=*`);
      return(d.search||[]).map((item,i)=>({source:'wikidata',
        title:item.label||item.id||'',url:item.concepturi||`https://www.wikidata.org/wiki/${item.id}`,
        snippet:item.description||'',
        score:6-i,seenOn:['wikidata']}));
    }},

    // ── GitHub Users ──
    {name:'github-users',fn:async()=>{
      return searchVariants(queryVariants(plan,{includeSlug:true,includeUnderscored:true,includeHyphenated:true,includeDotted:true,includeHandle:true,includeLocalPart:true}),async(_term,encoded)=>{
        const d=await fetchWithRetry(`https://api.github.com/search/users?q=${encoded}&per_page=5`);
        return(d.items||[]).map((u,i)=>({source:'github',
          title:u.login||'',url:u.html_url||'',
          snippet:`GitHub user · Score ${u.score||0}`,
          score:7-i,seenOn:['github']}));
      });
    }},

    // ── GitHub Repos ──
    {name:'github-repos',fn:async()=>{
      const d=await fetchWithRetry(`https://api.github.com/search/repositories?q=${q}&per_page=5&sort=stars`);
      return(d.items||[]).map((r,i)=>({source:'github',
        title:r.full_name||'',url:r.html_url||'',
        snippet:[r.description||'',r.stargazers_count?`★ ${r.stargazers_count}`:'',r.language||''].filter(Boolean).join(' · ').slice(0,180),
        score:6-i,seenOn:['github']}));
    }},

    // ── Hacker News (Algolia) ──
    {name:'hackernews',fn:async()=>{
      const d=await fetchWithRetry(`https://hn.algolia.com/api/v1/search?query=${q}&hitsPerPage=8`);
      return(d.hits||[]).map((h,i)=>({source:'hackernews',
        title:h.title||h.story_title||'',url:h.url||h.story_url||`https://news.ycombinator.com/item?id=${h.objectID}`,
        snippet:[h.author?`by ${h.author}`:'',h.num_comments !== null && h.num_comments !== undefined ? `${h.num_comments} comments` : '',h.points?`${h.points} pts`:''].filter(Boolean).join(' · '),
        score:5-i,seenOn:['hackernews']}));
    }},

    // ── StackExchange ──
    {name:'stackoverflow',fn:async()=>{
      const d=await fetchWithRetry(`https://api.stackexchange.com/2.3/search?intitle=${q}&site=stackoverflow&pagesize=5&order=desc&sort=relevance`);
      return(d.items||[]).map((item,i)=>({source:'stackoverflow',
        title:decodeEntities(item.title||''),
        url:item.link||'',
        snippet:[item.tags?item.tags.slice(0,4).join(', '):'',item.answer_count !== null && item.answer_count !== undefined ? `${item.answer_count} answers` : '',item.score !== null && item.score !== undefined ? `score ${item.score}` : ''].filter(Boolean).join(' · '),
        score:4-i,seenOn:['stackoverflow']}));
    }},

    // ── Archive.org (Internet Archive) ──
    {name:'archive.org',fn:async()=>{
      const d=await fetchWithRetry(`https://archive.org/advancedsearch.php?q=${q}&output=json&rows=6&fl[]=identifier,title,description,mediatype`);
      return((d.response&&d.response.docs)||[]).map((item,i)=>({source:'archive.org',
        title:item.title||item.identifier||'',url:`https://archive.org/details/${item.identifier}`,
        snippet:[item.mediatype||'',typeof item.description==='string'?item.description.slice(0,150):Array.isArray(item.description)?(item.description[0]||'').slice(0,150):''].filter(Boolean).join(' · '),
        score:4-i,seenOn:['archive.org']}));
    }},

    // ── OpenLibrary ──
    {name:'openlibrary',fn:async()=>{
      const d=await fetchWithRetry(`https://openlibrary.org/search.json?q=${q}&limit=5&fields=key,title,author_name,first_publish_year,edition_count`);
      return(d.docs||[]).map((item,i)=>({source:'openlibrary',
        title:item.title||'',url:`https://openlibrary.org${item.key}`,
        snippet:[(item.author_name||[]).slice(0,2).join(', '),item.first_publish_year?`Published ${item.first_publish_year}`:'',item.edition_count?`${item.edition_count} editions`:''].filter(Boolean).join(' · '),
        score:3-i,seenOn:['openlibrary']}));
    }},

    // ── PubMed (NCBI) ──
    {name:'pubmed',fn:async()=>{
      const ids=await fetchWithRetry(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${q}&retmax=5&retmode=json`);
      const idList=(ids.esearchresult&&ids.esearchresult.idlist)||[];
      if(!idList.length)return[];
      const summ=await fetchWithRetry(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idList.join(',')}&retmode=json`);
      return idList.map((id,i)=>{const a=summ.result&&summ.result[id];if(!a)return null;return{source:'pubmed',
        title:a.title||'',url:`https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        snippet:[(a.authors||[]).slice(0,2).map(x=>x.name).join(', '),a.source||'',a.pubdate||''].filter(Boolean).join(' · '),
        score:4-i,seenOn:['pubmed']};}).filter(Boolean);
    }},

    // ── DuckDuckGo Instant Answer ──
    {name:'duckduckgo',fn:async()=>{
      return searchVariants(queryVariants(plan,{includeExact:true}),async(_term,encoded)=>{
        const d=await fetchWithRetry(`https://api.duckduckgo.com/?q=${encoded}&format=json&no_html=1&skip_disambig=0`);
        const out=[];
        if(d.AbstractText)out.push({source:'duckduckgo',title:d.Heading||plan.raw,url:d.AbstractURL||'',snippet:d.AbstractText.slice(0,200),score:9,seenOn:['duckduckgo']});
        (d.RelatedTopics||[]).slice(0,5).forEach((t,i)=>{
          if(t.Text&&t.FirstURL)out.push({source:'duckduckgo',title:t.Text.slice(0,100),url:t.FirstURL,snippet:t.Text.slice(0,180),score:6-i,seenOn:['duckduckgo']});
        });
        return out;
      });
    }},

    // ── npm registry ──
    {name:'npm',fn:async()=>{
      const d=await fetchWithRetry(`https://registry.npmjs.org/-/v1/search?text=${q}&size=5`);
      return(d.objects||[]).map((o,i)=>{const p=o.package||{};return{source:'npm',
        title:p.name||'',url:p.links&&p.links.npm||`https://www.npmjs.com/package/${p.name}`,
        snippet:[p.description||'',p.version?`v${p.version}`:''].filter(Boolean).join(' · ').slice(0,180),
        score:3-i,seenOn:['npm']};});
    }},

    // ── OpenAlex ──
    {name:'openalex',fn:async()=>{
      const d=await fetchWithRetry(`https://api.openalex.org/works?search=${q}&per_page=8`);
      return(d.results||[]).map((item,i)=>({source:'openalex',title:item.title||'',
        url:item.doi?`https://doi.org/${item.doi.replace('https://doi.org/','')}`:(item.id||''),
        snippet:`${item.publication_year||''} · ${(item.authorships||[]).slice(0,2).map(a=>a.author&&a.author.display_name||'').join(', ')}`,
        score:6-i,seenOn:['openalex']}));
    }},

    // ── Semantic Scholar ──
    {name:'semantic-scholar',fn:async()=>{
      const d=await fetchWithRetry(`https://api.semanticscholar.org/graph/v1/paper/search?query=${q}&limit=8&fields=title,url,abstract,authors,year`);
      return(d.data||[]).map((item,i)=>({source:'semantic-scholar',title:item.title||'',
        url:item.url||`https://www.semanticscholar.org/paper/${item.paperId}`,
        snippet:item.abstract?(item.abstract.slice(0,180)+'…'):`Year: ${item.year||''}`,
        score:5-i,seenOn:['semantic-scholar']}));
    }},

    // ── CrossRef ──
    {name:'crossref',fn:async()=>{
      const d=await fetchWithRetry(`https://api.crossref.org/works?query=${q}&rows=8`);
        return((d.message&&d.message.items)||[]).map((item,i)=>({source:'crossref',
          title:(item.title||[])[0]||'',url:item.URL||'',
          snippet:item.abstract?(stripHtml(item.abstract).slice(0,150)+'…'):'',
          score:4-i,seenOn:['crossref']}));
    }},

    // ── ORCID ──
    {name:'orcid',fn:async()=>{
      const d=await fetchWithRetry(`https://pub.orcid.org/v3.0/expanded-search/?q=${q}&rows=5`,{headers:{Accept:'application/json'}});
      return((d['expanded-result'])||[]).map((r,i)=>({source:'orcid',
        title:`${r['given-names']||''} ${r['family-names']||''}`.trim()||r['orcid-id']||'',
        url:`https://orcid.org/${r['orcid-id']}`,
        snippet:(r['institution-name']||[]).slice(0,2).join(' · '),
        score:5-i,seenOn:['orcid']}));
    }},

    // ── Wayback CDX ──
    {name:'wayback',fn:async()=>{
      const rows=await fetchWithRetry(`https://web.archive.org/cdx/search/cdx?url=*${encodeURIComponent(plan.noSpaces||plan.lower)}*&output=json&fl=original,timestamp,statuscode&filter=statuscode:200&limit=8&collapse=urlkey`);
      if(!Array.isArray(rows)||rows.length<=1)return[];
      const hi=rows[0].indexOf('original'),ti=rows[0].indexOf('timestamp');
      return rows.slice(1).map((row,i)=>{
        const url=row[hi],ts=row[ti];
        return{source:'wayback',title:`Archived: ${url}`,
          url:`https://web.archive.org/web/${ts}/${url}`,
          snippet:`Captured ${ts.slice(0,4)}-${ts.slice(4,6)}-${ts.slice(6,8)}`,
          score:3-i,seenOn:['wayback']};
      });
    }},

    // ── arXiv ──
    {name:'arxiv',fn:async()=>{
      const r=await fetch(`https://export.arxiv.org/api/query?search_query=all:${q}&start=0&max_results=6`,{signal:AbortSignal.timeout(10000)});
      if(!r.ok)throw new Error(`HTTP ${r.status}`);
      const xml=await r.text();
      const parser=new DOMParser();const doc=parser.parseFromString(xml,'application/xml');
      const entries=doc.querySelectorAll('entry');
      return Array.from(entries).map((e,i)=>({source:'arxiv',
        title:(e.querySelector('title')?.textContent||'').replace(/\s+/g,' ').trim(),
        url:e.querySelector('id')?.textContent||'',
        snippet:((e.querySelector('summary')?.textContent||'').replace(/\s+/g,' ').trim()).slice(0,180),
        score:5-i,seenOn:['arxiv']}));
    }},

    // ── CORE (academic papers) ──
    {name:'core',fn:async()=>{
      const d=await fetchWithRetry(`https://api.core.ac.uk/v3/search/works?q=${q}&limit=6`);
      return(d.results||[]).map((item,i)=>({source:'core',
        title:item.title||'',url:item.downloadUrl||item.sourceFulltextUrls?.[0]||`https://core.ac.uk/works/${item.id}`,
        snippet:(item.abstract||'').slice(0,180),
        score:4-i,seenOn:['core']}));
    }},

    // ── Europeana (cultural heritage) ──
    {name:'europeana',fn:async()=>{
      const d=await fetchWithRetry(`https://api.europeana.eu/record/v2/search.json?query=${q}&rows=6&wskey=api2demo`);
      return(d.items||[]).map((item,i)=>({source:'europeana',
        title:(item.title||[])[0]||'',url:item.guid||item.edmIsShownAt?.[0]||'',
        snippet:[(item.dataProvider||[])[0]||'',(item.dcCreator||[])[0]||'',item.year?.[0]||''].filter(Boolean).join(' · '),
        score:3-i,seenOn:['europeana']}));
    }},

    // ── Nominatim / OpenStreetMap (geo lookup) ──
    {name:'nominatim',fn:async()=>{
      const d=await fetchWithRetry(`https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=5&addressdetails=1`,{headers:{'User-Agent':'Tracer/1.0'}});
      return(d||[]).map((item,i)=>({source:'nominatim',
        title:item.display_name||'',url:`https://www.openstreetmap.org/${item.osm_type}/${item.osm_id}`,
        snippet:[item.type,item.class,item.addresstype].filter(Boolean).join(' · '),
        score:2-i,seenOn:['nominatim']}));
    }},

    // ── DOAJ (Directory of Open Access Journals) ──
    {name:'doaj',fn:async()=>{
      const d=await fetchWithRetry(`https://doaj.org/api/search/articles/${q}?page=1&pageSize=6`);
      return(d.results||[]).map((item,i)=>{const b=item.bibjson||{};return{source:'doaj',
        title:b.title||'',url:(b.link||[]).find(l=>l.type==='fulltext')?.url||`https://doaj.org/article/${item.id}`,
        snippet:[(b.author||[]).slice(0,2).map(a=>a.name).join(', '),b.journal?.title||'',b.year||''].filter(Boolean).join(' · '),
        score:3-i,seenOn:['doaj']};});
    }},

    // ── Wikibooks ──
    {name:'wikibooks',fn:async()=>{
        const d=await fetchWithRetry(`https://en.wikibooks.org/w/api.php?action=query&list=search&srsearch=${q}&srlimit=5&format=json&origin=*`);
        return(d.query&&d.query.search||[]).map((item,i)=>({source:'wikibooks',
          title:item.title||'',url:`https://en.wikibooks.org/wiki/${encodeURIComponent(item.title)}`,
          snippet:stripHtml(item.snippet).slice(0,180),
          score:3-i,seenOn:['wikibooks']}));
    }},

    // ── Wikimedia Commons ──
    {name:'commons',fn:async()=>{
        const d=await fetchWithRetry(`https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${q}&srlimit=5&srnamespace=6&format=json&origin=*`);
        return(d.query&&d.query.search||[]).map((item,i)=>({source:'commons',
          title:item.title||'',url:`https://commons.wikimedia.org/wiki/${encodeURIComponent(item.title)}`,
          snippet:stripHtml(item.snippet).slice(0,180),
          score:2-i,seenOn:['commons']}));
    }},

    // ── Google Books (FREE — no API key needed) ──
    {name:'google-books',fn:async()=>{
      const d=await fetchWithRetry(`https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=8`);
      return(d.items||[]).map((item,i)=>{const v=item.volumeInfo||{};return{source:'google-books',
        title:v.title||'',url:v.infoLink||v.canonicalVolumeLink||'',
        snippet:[(v.authors||[]).slice(0,2).join(', '),v.publishedDate||'',v.publisher||'',
          (v.description||'').slice(0,120)].filter(Boolean).join(' · '),
        score:6-i,seenOn:['google-books']};});
    }},

    // ── Zenodo ──
    {name:'zenodo',fn:async()=>{
      const d=await fetchWithRetry(`https://zenodo.org/api/records/?q=${q}&size=6`);
      return(((d.hits&&d.hits.hits)||[])).map((item,i)=>{
        const creators=(item.metadata?.creators||[]).slice(0,2).map((creator)=>creator.name).join(', ');
        const description=stripHtml(item.metadata?.description).slice(0,110);
        return{source:'zenodo',
          title:item.metadata?.title||'',url:item.links?.html||`https://zenodo.org/records/${item.id}`,
          snippet:[creators,item.metadata?.publication_date||'',description].filter(Boolean).join(' · '),
          score:5-i,seenOn:['zenodo']};
      });
    }},

    // ── DataCite ──
    {name:'datacite',fn:async()=>{
      const d=await fetchWithRetry(`https://api.datacite.org/dois?query=${q}&page[size]=6`);
      return(d.data||[]).map((item,i)=>{
        const attrs=item.attributes||{};
        const creators=(attrs.creators||[]).slice(0,2).map((creator)=>creator.name).join(', ');
        const description=((attrs.descriptions||[])[0]?.description||'').slice(0,110);
        return{source:'datacite',
          title:(attrs.titles||[])[0]?.title||attrs.doi||'',url:attrs.url||`https://doi.org/${attrs.doi}`,
          snippet:[creators,attrs.publicationYear||'',description].filter(Boolean).join(' · '),
          score:4-i,seenOn:['datacite']};
      });
    }},

    // ── Openverse ──
    {name:'openverse',fn:async()=>{
      const d=await fetchWithRetry(`https://api.openverse.org/v1/images/?q=${q}&page_size=6`);
      return(d.results||[]).map((item,i)=>({source:'openverse',
        title:item.title||item.id||'',url:item.foreign_landing_url||item.url||'',
        snippet:[item.creator||'',item.source||'',item.license||''].filter(Boolean).join(' · '),
        score:4-i,seenOn:['openverse']}));
    }},

    // ── Packagist ──
    {name:'packagist',fn:async()=>{
      const d=await fetchWithRetry(`https://packagist.org/search.json?q=${q}&per_page=6`);
      return(d.results||[]).map((item,i)=>({source:'packagist',
        title:item.name||'',url:item.url||`https://packagist.org/packages/${item.name}`,
        snippet:[item.description||'',item.repository||''].filter(Boolean).join(' · ').slice(0,180),
        score:5-i,seenOn:['packagist']}));
    }},

    // ── RubyGems ──
    {name:'rubygems',fn:async()=>{
      const d=await fetchWithRetry(`https://rubygems.org/api/v1/search.json?query=${q}`);
      return(d||[]).slice(0,6).map((item,i)=>({source:'rubygems',
        title:item.name||'',url:item.project_uri||`https://rubygems.org/gems/${item.name}`,
        snippet:[item.info||'',item.version?`v${item.version}`:'',item.authors||''].filter(Boolean).join(' · ').slice(0,180),
        score:4-i,seenOn:['rubygems']}));
    }},

    // ── crates.io ──
    {name:'crates',fn:async()=>{
      const d=await fetchWithRetry(`https://crates.io/api/v1/crates?page=1&per_page=6&q=${q}`);
      return(d.crates||[]).map((item,i)=>({source:'crates',
        title:item.name||'',url:`https://crates.io/crates/${item.name}`,
        snippet:[item.description||'',item.max_version?`v${item.max_version}`:'',item.downloads?`${item.downloads} downloads`:''].filter(Boolean).join(' · ').slice(0,180),
        score:4-i,seenOn:['crates']}));
    }},

    // ── MusicBrainz ──
    {name:'musicbrainz',fn:async()=>{
      const d=await fetchWithRetry(`https://musicbrainz.org/ws/2/artist?query=${q}&fmt=json&limit=6`,{headers:{Accept:'application/json'}});
      return(d.artists||[]).map((item,i)=>({source:'musicbrainz',
        title:item.name||'',url:`https://musicbrainz.org/artist/${item.id}`,
        snippet:[item.country||'',item.disambiguation||'',item['life-span']?.begin||''].filter(Boolean).join(' · '),
        score:3-i,seenOn:['musicbrainz']}));
    }},

    // ── GBIF ──
    {name:'gbif',fn:async()=>{
      const d=await fetchWithRetry(`https://api.gbif.org/v1/species/search?q=${q}&limit=6`);
      return(d.results||[]).map((item,i)=>({source:'gbif',
        title:item.canonicalName||item.scientificName||'',url:item.key?`https://www.gbif.org/species/${item.key}`:'',
        snippet:[item.rank||'',item.kingdom||'',item.datasetTitle||''].filter(Boolean).join(' · '),
        score:2-i,seenOn:['gbif']}));
    }},

    // ── Google Scholar profiles (FREE — no API key needed) ──
    // Uses the Semantic Scholar API which indexes Google Scholar papers
    // and provides CORS-friendly JSON responses
    {name:'google-scholar',fn:async()=>{
      const d=await fetchWithRetry(`https://api.semanticscholar.org/graph/v1/author/search?query=${q}&limit=5&fields=name,url,paperCount,citationCount,hIndex`);
      return(d.data||[]).map((a,i)=>({source:'google-scholar',
        title:a.name||'',url:a.url||`https://www.semanticscholar.org/author/${a.authorId}`,
        snippet:[a.paperCount?`${a.paperCount} papers`:'',a.citationCount?`${a.citationCount} citations`:'',a.hIndex?`h-index ${a.hIndex}`:''].filter(Boolean).join(' · '),
        score:6-i,seenOn:['google-scholar']}));
    }},

    // ═══════════════════════════════════════════════════════════════════════════
    // ── PEOPLE / USERNAME SEARCH (FREE — no API keys needed) ─────────────────
    // ═══════════════════════════════════════════════════════════════════════════

    // ── GitLab Users (complements GitHub) ──
    {name:'gitlab-users',fn:async()=>{
      return searchVariants(queryVariants(plan,{includeSlug:true,includeUnderscored:true,includeHyphenated:true,includeDotted:true,includeHandle:true,includeLocalPart:true}),async(_term,encoded)=>{
        const d=await fetchWithRetry(`https://gitlab.com/api/v4/users?search=${encoded}&per_page=5`);
        return(d||[]).map((u,i)=>({source:'gitlab',
          title:u.username||u.name||'',url:u.web_url||`https://gitlab.com/${encodeURIComponent(u.username||u.name||'')}`,
          snippet:[u.name||'',u.bio?u.bio.slice(0,120):'',u.location||''].filter(Boolean).join(' · '),
          score:7-i,seenOn:['gitlab']}));
      });
    }},

    // ── Codeberg Users (Gitea-based, open-source alternative) ──
    {name:'codeberg-users',fn:async()=>{
      return searchVariants(queryVariants(plan,{includeSlug:true,includeUnderscored:true,includeHyphenated:true,includeDotted:true,includeHandle:true,includeLocalPart:true}),async(_term,encoded)=>{
        const d=await fetchWithRetry(`https://codeberg.org/api/v1/users/search?q=${encoded}&limit=5`);
        return((d.data||d)||[]).map((u,i)=>{const uname=u.login||u.username||'';return{source:'codeberg',
          title:uname,url:u.html_url||`https://codeberg.org/${encodeURIComponent(uname)}`,
          snippet:[u.full_name||'',u.description?u.description.slice(0,120):'',u.location||''].filter(Boolean).join(' · '),
          score:5-i,seenOn:['codeberg']};});
      });
    }},

    // ── Bluesky account search ──
    {name:'bluesky',fn:async()=>{
      return searchVariants(queryVariants(plan,{includeSlug:true,includeUnderscored:true,includeHyphenated:true,includeDotted:true,includeHandle:true,includeLocalPart:true}),async(_term,encoded)=>{
        const d=await fetchWithRetry(`https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?q=${encoded}&limit=5`);
        return(d.actors||[]).map((a,i)=>({source:'bluesky',
          title:a.handle||a.displayName||'',url:`https://bsky.app/profile/${a.handle||''}`,
          snippet:[a.displayName||'',a.description?(a.description.slice(0,120)):'',a.followersCount?`${a.followersCount} followers`:''].filter(Boolean).join(' · '),
          score:7-i,seenOn:['bluesky']}));
      });
    }},

    // ── Mastodon / Fediverse account search ──
    {name:'mastodon',fn:async()=>{
      return searchVariants(queryVariants(plan,{includeSlug:true,includeUnderscored:true,includeHyphenated:true,includeDotted:true,includeHandle:true,includeLocalPart:true}),async(_term,encoded)=>{
        const d=await fetchWithRetry(`https://mastodon.social/api/v2/search?q=${encoded}&type=accounts&limit=5`);
        return(d.accounts||[]).map((a,i)=>({source:'mastodon',
          title:`@${a.acct||a.username||''}`,url:a.url||'',
          snippet:[a.display_name||'',stripHtml(a.note).slice(0,120),a.followers_count?`${a.followers_count} followers`:''].filter(Boolean).join(' · '),
          score:7-i,seenOn:['mastodon']}));
      });
    }},

    // ── Keybase identity search ──
    {name:'keybase',fn:async()=>{
      return searchVariants(queryVariants(plan,{includeSlug:true,includeUnderscored:true,includeHyphenated:true,includeDotted:true,includeHandle:true,includeLocalPart:true}),async(_term,encoded)=>{
        const d=await fetchWithRetry(`https://keybase.io/_/api/1.0/user/autocomplete.json?q=${encoded}`);
        return((d.completions)||[]).slice(0,5).map((c,i)=>{const comp=c.components||{};return{source:'keybase',
          title:comp.username?.val||'',url:`https://keybase.io/${comp.username?.val||''}`,
          snippet:[comp.full_name?.val||'',comp.websites?.val?`Web: ${comp.websites.val}`:'',
            comp.key_fingerprint?.val?'PGP verified':''].filter(Boolean).join(' · '),
          score:7-i,seenOn:['keybase']};});
      });
    }},

    // ── Gravatar profile lookup (email queries) ──
    {name:'gravatar',fn:async()=>{
      if(!query.includes('@'))return[];
      const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(query.trim().toLowerCase())).then(b=>Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''));
      const d=await fetchWithRetry(`https://api.gravatar.com/v3/profiles/${hash}`);
      if(!d||d.error)return[];
      return[{source:'gravatar',title:d.display_name||d.preferred_username||query,
        url:d.profile_url||`https://gravatar.com/${hash}`,
        snippet:[d.job_title||'',d.company||'',d.location||'',d.verified_accounts?`${d.verified_accounts.length} linked accounts`:''].filter(Boolean).join(' · '),
        score:8,seenOn:['gravatar']}];
    }},

    // ── Reddit user search ──
    {name:'reddit-users',fn:async()=>{
      return searchVariants(queryVariants(plan,{includeSlug:true,includeUnderscored:true,includeHyphenated:true,includeDotted:true,includeHandle:true,includeLocalPart:true}),async(_term,encoded)=>{
        const d=await fetchWithRetry(`https://www.reddit.com/users/search.json?q=${encoded}&limit=5`,{headers:{'User-Agent':'Tracer/1.0'}});
        return((d.data&&d.data.children)||[]).map((c,i)=>{const u=c.data||{};return{source:'reddit-users',
          title:`u/${u.name||''}`,url:`https://www.reddit.com/user/${u.name}`,
          snippet:[u.subreddit?.public_description?u.subreddit.public_description.slice(0,100):'',
            u.link_karma?`${u.link_karma} link karma`:'',u.comment_karma?`${u.comment_karma} comment karma`:''].filter(Boolean).join(' · '),
          score:7-i,seenOn:['reddit-users']};});
      });
    }},

    // ── Stack Exchange user search ──
    {name:'stackexchange-users',fn:async()=>{
      return searchVariants(queryVariants(plan,{includeSlug:true,includeUnderscored:true,includeHyphenated:true,includeDotted:true,includeHandle:true,includeLocalPart:true}),async(_term,encoded)=>{
        const d=await fetchWithRetry(`https://api.stackexchange.com/2.3/users?inname=${encoded}&site=stackoverflow&pagesize=5&order=desc&sort=reputation`);
        return(d.items||[]).map((u,i)=>({source:'stackexchange-users',
          title:u.display_name||'',url:u.link||'',
          snippet:formatStackExchangeUserSnippet(u),
          score:6-i,seenOn:['stackexchange-users']}));
      });
    }},

    // ── Lichess player search ──
    {name:'lichess',fn:async()=>{
      return searchVariants(queryVariants(plan,{includeSlug:true,includeUnderscored:true,includeHyphenated:true,includeDotted:true,includeHandle:true,includeLocalPart:true}),async(_term,encoded)=>{
        const d=await fetchWithRetry(`https://lichess.org/api/player/autocomplete?term=${encoded}&object=true&friend=false`,{headers:{Accept:'application/json'}});
        return((d.result||d)||[]).slice(0,5).map((u,i)=>({source:'lichess',
          title:u.name||u.id||'',url:`https://lichess.org/@/${u.name||u.id}`,
          snippet:[u.title?`Title: ${u.title}`:'',u.patron?'Patron':'',u.online?'Online now':''].filter(Boolean).join(' · ')||'Lichess player',
          score:4-i,seenOn:['lichess']}));
      });
    }},

    // ═══════════════════════════════════════════════════════════════════════════
    // ── FREE WEB SEARCH ENGINES (no API key needed) ──────────────────────────
    // ═══════════════════════════════════════════════════════════════════════════

    // ── Marginalia Search (indie/small web) ──
    {name:'marginalia',fn:async()=>{
      return searchVariants(queryVariants(plan,{includeExact:true}),async(_term,encoded)=>{
        const d=await fetchWithRetry(`https://api.marginalia.nu/public/search/${encoded}?count=8&index=0`);
        return((d.results)||[]).map((item,i)=>({source:'marginalia',
          title:item.title||item.url||'',url:item.url||'',
          snippet:(item.description||'').slice(0,180),
          score:5-i,seenOn:['marginalia']}));
      });
    }},

    // ── Wiby Search (retro/small web) ──
    {name:'wiby',fn:async()=>{
      return searchVariants(queryVariants(plan,{includeExact:true}),async(_term,encoded)=>{
        const r=await fetch(`https://wiby.me/json/?q=${encoded}`,{signal:AbortSignal.timeout(10000)});
        if(!r.ok)throw new Error(`HTTP ${r.status}`);
        const d=await r.json();
        return(d||[]).slice(0,8).map((item,i)=>({source:'wiby',
          title:item.Title||item.URL||'',url:item.URL||'',
          snippet:(item.Snippet||'').slice(0,180),
          score:4-i,seenOn:['wiby']}));
      });
    }},
  ];

  // ── KEY-BACKED FETCHERS — only added when user supplies API keys ────────
  const openFetcherIds=(ENGINE_METADATA.standalone&&ENGINE_METADATA.standalone.openFetchers)||openFetchers.map(fetcher=>fetcher.name);
  const openFetcherMap=new Map(openFetchers.map(fetcher=>[fetcher.name,fetcher]));
  const namedFetchers=openFetcherIds.map(id=>openFetcherMap.get(id)).filter(Boolean);
  const keys=collectKeys();
  const keyFetchers=new Map();

  if(keys.brave){
    keyFetchers.set('brave',{name:'brave',fn:async()=>{
      const d=await fetchWithRetry(`https://api.search.brave.com/res/v1/web/search?q=${q}&count=10`,{headers:{'X-Subscription-Token':keys.brave,'Accept':'application/json'}});
      return((d.web&&d.web.results)||[]).map((item,i)=>({source:'brave',
        title:item.title||'',url:item.url||'',
        snippet:(item.description||'').slice(0,180),
        score:9-i,seenOn:['brave']}));
    }});
  }

  if(keys.google&&keys.googleCx){
    keyFetchers.set('google',{name:'google',fn:async()=>{
      const d=await fetchWithRetry(`https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(keys.google)}&cx=${encodeURIComponent(keys.googleCx)}&q=${q}&num=10`);
      return(d.items||[]).map((item,i)=>({source:'google',
        title:item.title||'',url:item.link||'',
        snippet:(item.snippet||'').slice(0,180),
        score:9-i,seenOn:['google']}));
    }});
  }

  if(keys.serpapi){
    keyFetchers.set('serpapi',{name:'serpapi',fn:async()=>{
      const d=await fetchWithRetry(`https://serpapi.com/search.json?q=${q}&api_key=${encodeURIComponent(keys.serpapi)}&num=10`);
      return(d.organic_results||[]).map((item,i)=>({source:'serpapi',
        title:item.title||'',url:item.link||'',
        snippet:(item.snippet||'').slice(0,180),
        score:8-i,seenOn:['serpapi']}));
    }});
  }

  if(keys.shodan){
    keyFetchers.set('shodan',{name:'shodan',fn:async()=>{
      const d=await fetchWithRetry(`https://api.shodan.io/shodan/host/search?key=${encodeURIComponent(keys.shodan)}&query=${q}&minify=true`);
      return(d.matches||[]).slice(0,8).map((m,i)=>({source:'shodan',
        title:`${m.ip_str||''}:${m.port||''}`,url:`https://www.shodan.io/host/${m.ip_str}`,
        snippet:[m.org||'',m.product||'',m.os||'',m.location?.country_name||''].filter(Boolean).join(' · '),
        score:6-i,seenOn:['shodan']}));
    }});
  }

  if(keys.hunter){
    keyFetchers.set('hunter',{name:'hunter',fn:async()=>{
      const isEmail=query.includes('@');
      if(isEmail){
        const d=await fetchWithRetry(`https://api.hunter.io/v2/email-verifier?email=${q}&api_key=${encodeURIComponent(keys.hunter)}`);
        const e=d.data||{};
        return e.email?[{source:'hunter',title:e.email,url:`https://hunter.io/verify/${e.email}`,
          snippet:[e.status,e.result,e.score !== null && e.score !== undefined ? `score ${e.score}` : ''].filter(Boolean).join(' · '),
          score:7,seenOn:['hunter']}]:[];
      }
      const d=await fetchWithRetry(`https://api.hunter.io/v2/domain-search?domain=${q}&api_key=${encodeURIComponent(keys.hunter)}&limit=8`);
      return((d.data&&d.data.emails)||[]).map((e,i)=>({source:'hunter',
        title:e.value||'',url:`https://hunter.io/verify/${e.value}`,
        snippet:[e.first_name,e.last_name,e.type,e.department].filter(Boolean).join(' · '),
        score:6-i,seenOn:['hunter']}));
    }});
  }

  if(keys.intelx){
    keyFetchers.set('intelx',{name:'intelx',fn:async()=>{
      const searchResp=await fetchWithRetry(`https://2.intelx.io/intelligent/search`,{method:'POST',headers:{'x-key':keys.intelx,'Content-Type':'application/json'},body:JSON.stringify({term:query,maxresults:8,media:0,timeout:5})});
      const sid=searchResp.id;if(!sid)return[];
      await new Promise(ok=>setTimeout(ok,2000));
      const d=await fetchWithRetry(`https://2.intelx.io/intelligent/search/result?id=${sid}&limit=8`,{headers:{'x-key':keys.intelx}});
      return(d.records||[]).map((r,i)=>({source:'intelx',
        title:r.name||r.systemid||'',url:`https://intelx.io/?s=${encodeURIComponent(query)}`,
        snippet:[r.mediah||'',r.bucketh||'',r.date||''].filter(Boolean).join(' · '),
        score:7-i,seenOn:['intelx']}));
    }});
  }

  if(keys.exa){
    keyFetchers.set('exa',{name:'exa',fn:async()=>{
      const d=await fetchWithRetry(`https://api.exa.ai/search`,{method:'POST',headers:{'x-api-key':keys.exa,'Content-Type':'application/json'},body:JSON.stringify({query:query,numResults:8,useAutoprompt:true})});
      return(d.results||[]).map((item,i)=>({source:'exa',
        title:item.title||'',url:item.url||'',
        snippet:(item.text||item.highlights?.[0]||'').slice(0,180),
        score:8-i,seenOn:['exa']}));
    }});
  }

  if(keys.mojeek){
    keyFetchers.set('mojeek',{name:'mojeek',fn:async()=>{
      const d=await fetchWithRetry(`https://www.mojeek.com/search?q=${q}&fmt=json&api_key=${encodeURIComponent(keys.mojeek)}`);
      return((d.response&&d.response.results)||[]).slice(0,8).map((item,i)=>({source:'mojeek',
        title:item.title||'',url:item.url||'',
        snippet:(item.desc||'').slice(0,180),
        score:7-i,seenOn:['mojeek']}));
    }});
  }

  if(keys.hibp){
    keyFetchers.set('hibp',{name:'hibp',fn:async()=>{
      const isEmail=query.includes('@');
      if(!isEmail)return[];
      const d=await fetchWithRetry(`https://haveibeenpwned.com/api/v3/breachedaccount/${q}?truncateResponse=false`,{headers:{'hibp-api-key':keys.hibp,'user-agent':'Tracer'}});
      return(d||[]).map((b,i)=>({source:'hibp',
        title:`Breach: ${b.Name||''}`,url:`https://haveibeenpwned.com/`,
        snippet:[b.Domain||'',b.BreachDate||'',`${(b.DataClasses||[]).slice(0,3).join(', ')}`].filter(Boolean).join(' · '),
        score:8-i,seenOn:['hibp']}));
    }});
  }

  if(keys.greynoise){
    keyFetchers.set('greynoise',{name:'greynoise',fn:async()=>{
      const d=await fetchWithRetry(`https://api.greynoise.io/v3/community/${q}`,{headers:{key:keys.greynoise}});
      if(!d||!d.ip)return[];
      return[{source:'greynoise',title:`IP: ${d.ip}`,url:`https://viz.greynoise.io/ip/${d.ip}`,
        snippet:[d.noise?'Noise':'Clean',d.riot?'RIOT':'',d.classification||'',d.name||''].filter(Boolean).join(' · '),
        score:6,seenOn:['greynoise']}];
    }});
  }

  if(keys.searxngUrl){
    const sxUrl=keys.searxngUrl.replace(/\/$/,'');
    keyFetchers.set('searxng',{name:'searxng',fn:async()=>{
      const d=await fetchWithRetry(`${sxUrl}/search?q=${q}&format=json&categories=general&pageno=1`);
      return(d.results||[]).slice(0,10).map((item,i)=>({source:'searxng',
        title:item.title||'',url:item.url||'',
        snippet:(item.content||'').slice(0,180),
        score:7-i,seenOn:['searxng']}));
    }});
  }

  const keyFetcherIds=(ENGINE_METADATA.standalone&&ENGINE_METADATA.standalone.keyBackedFetchers)||[];
  keyFetcherIds.forEach(id=>{
    const fetcher=keyFetchers.get(id);
    if(fetcher)namedFetchers.push(fetcher);
  });

  return runStandaloneSearch(query,namedFetchers,{
    connected,
    initLiveProgress,
    updateLiveProgress,
    renderSourceStatus,
    showEngineSummary(summary){
      const bar=document.getElementById('eng-bar');
      if(bar)bar.textContent=summary;
    },
    showWarnings(message){
      showErr(message,true);
    },
    rateLimitWarnings:_rateLimitWarnings,
    extraRatio:0.1,
  });
}

// ── SERVER SSE STREAMING SEARCH ───────────────────────────────────────────────
// Uses EventSource to /search/stream for real-time progress from all 550+
// server connectors.  Falls back to POST /search if SSE fails.
function searchViaSSE(base,query){
  return new Promise((resolve,reject)=>{
    const params=new URLSearchParams({
      input:query,
      mode:document.getElementById('mode').value,
      fossils:document.getElementById('opt-fossils').checked,
      avatars:document.getElementById('opt-avatars').checked,
      timeSliceMode:document.getElementById('opt-timeslice').checked,
      documents:document.getElementById('opt-docs').checked,
    });
    const url=base+'/search/stream?'+params.toString();
    const es=new EventSource(url);

    // Track connectors for the live progress grid
    const seenConnectors=new Set();
    let progressPhase='';
    let settled=false;  // guard against double resolve/reject

    function finish(fn,val){
      if(settled)return;
      settled=true;
      clearTimeout(timer);
      es.close();
      fn(val);
    }

    es.addEventListener('progress',function(e){
      if(settled)return;
      try{
        const info=JSON.parse(e.data);
        // info = { phase, connector?, resultsSoFar?, error? }
        if(info.connector&&!seenConnectors.has(info.connector)){
          seenConnectors.add(info.connector);
          // Lazily init the progress grid the first time we see connectors
          if(seenConnectors.size===1){
            const wrap=document.getElementById('live-progress');
            const grid=document.getElementById('progress-grid');
            const counter=document.getElementById('progress-counter');
            if(wrap){wrap.style.display='block'}
            if(counter){counter.textContent='0 connectors reporting…'}
            if(grid){grid.replaceChildren()}
          }
          // Add a chip for this connector
          const grid=document.getElementById('progress-grid');
          if(grid){
            const span=document.createElement('span');
            span.id='pg-'+info.connector;
            span.className=info.error?'pg-fail':'pg-ok';
            span.textContent=(info.error?'✗ ':'✓ ')+info.connector;
            grid.appendChild(span);
          }
        }
        // Update counter
        const counter=document.getElementById('progress-counter');
        if(counter){
          counter.textContent=seenConnectors.size+' connectors reporting'+(info.resultsSoFar !== null && info.resultsSoFar !== undefined ? ' · '+info.resultsSoFar+' results so far' : '')+'…';
        }
        // Update engine bar with phase info
        if(info.phase&&info.phase!==progressPhase){
          progressPhase=info.phase;
          const bar=document.getElementById('eng-bar');
          if(bar){
            const phases={cache:'Using cached sweep',connectors:'Scanning connectors',wayback:'Wayback Machine',namechk:'Username check',profileProbe:'Direct profile probing',timeSlice:'Time slicing',docSearch:'Document search',dedupe:'Deduplicating',fossils:'Fossil hunting',archiveFirst:'Archive-first expansion'};
            bar.textContent='SERVER · '+(phases[info.phase]||info.phase)+'…';
          }
        }
      }catch{
        // ignore parse errors
      }
    });

    es.addEventListener('done',function(e){
      try{
        const data=JSON.parse(e.data);
        finish(resolve,{
          results:data.results||[],
          avatarClusters:data.avatarClusters||[],
          graph:data.graph||null,
          connectorStats:data.connectorStats||[],
          telemetry:data.telemetry||null,
          searchNarrative:data.searchNarrative||null,
        });
      }catch{
        finish(reject,new Error('Failed to parse server response'));
      }
    });

    es.addEventListener('error',function(e){
      if(e.data){
        try{
          const d=JSON.parse(e.data);
          finish(reject,new Error(d.error||'Server error'));
        }catch{
          finish(reject,new Error('Server stream error'));
        }
      }else{
        finish(reject,new Error('SSE connection lost'));
      }
    });

    // Safety timeout: if no 'done' event within 3 minutes, abort
    const timer=setTimeout(()=>{
      finish(reject,new Error('Server search timed out (180s)'));
    },180000);
  });
}

// ── SEARCH ────────────────────────────────────────────────────────────────────
async function doSearch(){
  const query=document.getElementById('query').value.trim();
  if(!query)return;
  const deepSearch=document.getElementById('mode').value==='aggressive'||document.getElementById('opt-timeslice').checked;
  setUiStatus('searching',deepSearch?'DESCENT ACTIVE':'SONAR SWEEP ACTIVE');
  showLoading(true);clearResults();showErr('',false);

  let results=[],avatarClusters=[],searchContext={};

  // Always try the local server first (even on GitHub Pages — the user may have
  // launched `npm run serve` locally and the server now has CORS enabled).
  // Use SSE streaming for real-time progress from all 550+ connectors.
  // Fall back to standalone client-side search if the server isn't reachable.
  const base=LOCAL_SERVER_BASE;
  const online=connected||await checkConn();
  if(online){
    try{
      const data=await searchViaSSE(base,query);
      results=data.results||[];
      avatarClusters=data.avatarClusters||[];
      searchContext={
        telemetry:data.telemetry||null,
        searchNarrative:data.searchNarrative||null,
        connectorStats:data.connectorStats||[],
      };
      // Update engine bar with final stats
      const bar=document.getElementById('eng-bar');
      if(bar){
        const stats=data.connectorStats||[];
        const ok=stats.filter(s=>s.ok).length;
        bar.textContent=`LIVE STATION · ${results.length} shoreline traces from ${ok}/${stats.length} currents`;
      }
    }catch(e){
      showErr('Server error: '+e.message+'. Falling back to open APIs…',true);
      results=await searchDirect(query);
    }
  }else{
    results=await searchDirect(query);
  }

  renderResults(results,avatarClusters,searchContext);
  _lastResults=results;
  addToHistory(query,results.length);
  hideLiveProgress();
  showLoading(false);
}
document.getElementById('query').addEventListener('keydown',e=>{if(e.key==='Enter')doSearch()});

// ── RENDER ────────────────────────────────────────────────────────────────────
const TIER_MAP=ENGINE_METADATA.sourceTierMap||{};
const SERVER_CONNECTORS=ENGINE_METADATA.serverConnectors||[];
const KEY_BACKED_FETCHERS=new Set((ENGINE_METADATA.standalone&&ENGINE_METADATA.standalone.keyBackedFetchers)||[]);
const GATED_SOURCES=new Set([
  ...SERVER_CONNECTORS.filter((connector)=>connector.requiresKey).map((connector)=>connector.id),
  ...KEY_BACKED_FETCHERS,
]);
const QUERY_TYPE_LABELS={
  name:'NAME TRACE',
  handle:'HANDLE TRACE',
  email:'EMAIL TRACE',
  phone:'PHONE TRACE',
  image:'IMAGE TRACE',
  company:'COMPANY TRACE',
};
function bclass(src,tags){
  if(tags&&tags.includes('fossil'))return'b-wayback';
  if(tags&&tags.includes('document'))return'b-obscure';
  if(tags&&tags.includes('timeslice'))return'b-wayback';
  if(src==='wayback'||src==='wayback-docs')return'b-wayback';
  if(src==='social-profiles')return'b-social';
  return'b-'+(TIER_MAP[src]||'obscure');
}

function formatQueryType(intent){
  return QUERY_TYPE_LABELS[intent]||`${String(intent||'name').toUpperCase()} TRACE`;
}

function openResultInNewTab(url){
  if(!url)return;
  globalThis.open(url,'_blank','noopener,noreferrer');
}

function renderFirstBloodPanel(firstBlood){
  if(!firstBlood)return '';
  const echoCount=firstBlood.echoCount??Math.max((firstBlood.familySize||1)-1,0);
  const sourceLink=firstBlood.url
    ? `<a href="${esc(firstBlood.url)}" target="_blank" rel="noopener noreferrer">${esc(firstBlood.title)}</a>`
    : esc(firstBlood.title);
  return '<details class="cluster" open><summary class="cluster-hdr">🩸 FIRST-BLOOD FINDER</summary><div class="tree-item">'+
    `<strong>${esc(firstBlood.dateLabel||'Earliest surfaced lead')}</strong> · ${sourceLink}`+
    `<div class="card-seen">ORIGIN SOURCE <span>${esc(firstBlood.source||'unknown')}</span> · FAMILY <span>${esc(firstBlood.sourceFamily||'unknown')}</span> · ECHOES <span>${echoCount}</span></div>`+
    '</div></details>';
}

function renderSourceFamilyPanel(familyTree){
  if(!familyTree.length)return '';
  return '<details class="cluster"><summary class="cluster-hdr">🧬 SOURCE FAMILY TREE</summary><div class="tree-list">'+
    familyTree.map((family)=>{
      const originLink=family.ancestor.url
        ? `<a href="${esc(family.ancestor.url)}" target="_blank" rel="noopener noreferrer">${esc(family.ancestor.source||family.ancestor.hostname||'origin')}</a>`
        : esc(family.ancestor.source||family.ancestor.hostname||'origin');
      return `<div class="tree-item"><strong>${esc(family.label)}</strong><div class="card-seen">ANCESTOR <span>${family.ancestor.dateLabel?esc(family.ancestor.dateLabel):'undated'}</span> · ${originLink} · ECHOES <span>${family.echoCount}</span> · HOSTS <span>${family.hostnames.length}</span></div></div>`;
    }).join('')+
    '</div></details>';
}

function buildConsensusItems(title,items,renderItem,emptyState){
  if(!items.length){
    return `<div class="consensus-item"><strong>${title}</strong><div class="card-seen">${emptyState}</div></div>`;
  }
  return items.map(renderItem).join('');
}

function describeSourceBucket(result){
  const tags=(result.meta&&result.meta.tags)||[];
  const family=result.meta&&result.meta.sourceFamily;
  if(tags.includes('direct-probe'))return'direct probes';
  if(tags.includes('profile')||tags.includes('social')||tags.includes('username-check'))return'identity search';
  if(family==='archive'||tags.includes('fossil')||tags.includes('timeslice')||tags.includes('archive-lane')||result.meta?.pageStatus==='archived')return'archives';
  if(family==='official')return'official records';
  if(family==='academic')return'academic indexes';
  if(family==='forum')return'forums';
  if(family==='media')return'media';
  if(family==='package-ecosystem')return'package ecosystems';
  if(family==='code-hosting')return'code repositories';
  if(family==='broker-directory')return'people directories';
  return'open web';
}

function buildStrongestSourceSummary(results){
  if(!results.length)return'none yet';
  const counts=new Map();
  results.forEach((result)=>{
    const bucket=describeSourceBucket(result);
    counts.set(bucket,(counts.get(bucket)||0)+Math.max(1,(result.score||0)));
  });
  return [...counts.entries()]
    .sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))
    .slice(0,3)
    .map(([label])=>label)
    .join(', ');
}

function classifyResultState(result){
  const tags=(result.meta&&result.meta.tags)||[];
  const pageStatus=result.meta&&result.meta.pageStatus;
  if(pageStatus==='archived'||result.source==='wayback'||result.source==='archive-first'||tags.includes('fossil')||tags.includes('timeslice')||tags.includes('archive-lane'))return{label:'archived',tone:'archived'};
  if(GATED_SOURCES.has(result.source))return{label:'gated',tone:'gated'};
  if(pageStatus==='dead'||pageStatus==='unknown'||result.meta?.whySurvived||tags.includes('direct-probe')||tags.includes('username-check')||tags.includes('profile'))return{label:'inferred',tone:'inferred'};
  return{label:'live',tone:'live'};
}

function renderResults(results,clusters,context={}){
  const query=document.getElementById('query').value.trim();
  const queryPlan=buildQueryPlan(query);
  const queryType=formatQueryType((results[0]&&results[0].meta&&results[0].meta.queryIntent)||queryPlan.intent);
  const strongestSummary=buildStrongestSourceSummary(results);
  document.getElementById('results-section').style.display='block';
  document.getElementById('res-count').textContent=
    results.length+' UNIQUE TRACE'+(results.length!==1?'S':'')+' RECOVERED';

  // Show export buttons when there are results
  const expBar=document.getElementById('export-bar');
  if(expBar)expBar.style.display=results.length?'flex':'none';
  const brief=document.getElementById('results-brief');
  if(brief){
    const searchNarrative=context.searchNarrative
      ? [context.searchNarrative.headline,...(context.searchNarrative.details||[])].filter(Boolean).join(' ')
      : '';
    const telemetrySummary=context.telemetry&&context.telemetry.topFamilies&&context.telemetry.topFamilies.length
      ? `Recent winners: ${context.telemetry.topFamilies.slice(0,2).map((entry)=>entry.family).join(', ')}.`
      : '';
    brief.textContent=[buildResultsBrief(results),searchNarrative,telemetrySummary].filter(Boolean).join(' ');
    brief.style.display=results.length?'block':'none';
  }

  const meta=document.getElementById('results-meta');
  if(meta){
    meta.innerHTML=
      `<span class="meta-pill meta-pill-query">QUERY TYPE <strong>${esc(queryType)}</strong></span>`+
      `<span class="meta-pill meta-pill-summary">STRONGEST FROM <strong>${esc(strongestSummary)}</strong></span>`;
    meta.style.display='flex';
  }

  const cd=document.getElementById('avatar-clusters');cd.innerHTML='';
  (clusters||[]).forEach(c=>{
    const el=document.createElement('div');el.className='cluster';
    el.innerHTML=`<div class="cluster-hdr">⚠ AVATAR RECURRENCE — hash ${c.avatarHash.slice(0,10)}… across ${c.urls.length} sources</div>`+
      c.urls.map(u=>`<div style="font-size:.7rem;color:var(--teal);margin:.15rem 0">${esc(u)}</div>`).join('');
    cd.appendChild(el);
  });

  renderInsightPanels(results);

  const list=document.getElementById('results-list');list.innerHTML='';
  if(!results.length){
    setUiStatus('empty','NO TRACE FOUND');
    list.innerHTML=
      '<div class="no-results">'+
        '<div class="nr-sonar" aria-hidden="true"></div>'+
        '<div class="nr-hdr">NO TRACE FOUND</div>'+
        '<div class="nr-copy">The water stayed quiet on this pass. Tighten the ping and try another angle.</div>'+
        '<ul class="nr-tips">'+
          '<li>Check your spelling — a single wrong character can bury the signal</li>'+
          '<li>Try a real name, username, domain, or email address</li>'+
          '<li>Shorter pings often surface better shoreline traces in standalone mode</li>'+
          '<li>Some currents rate-limit — wait a minute, then send another ping</li>'+
          '<li>Launch the local station for the full 550+ engine descent</li>'+
        '</ul>'+
      '</div>';
    return;
  }
  setUiStatus('results','TRACES RECOVERED');
  let currentClusterId='';
  results.forEach((r,i)=>{
    const tags=(r.meta&&r.meta.tags)||[];
    const clusterId=r.meta&&r.meta.clusterId;
    const clusterSize=r.meta&&r.meta.clusterSize;
    const clusterLabel=r.meta&&r.meta.clusterLabel;
    const seenOn=r.seenOn||[];
    const bc=bclass(r.source,tags);
    const resultState=classifyResultState(r);
    const reliability=(r.meta&&r.meta.reliability)||'unknown';
    const language=(r.meta&&r.meta.languageLabel)||'Unknown';
    const region=r.meta&&r.meta.region?` · ${esc(String(r.meta.region).toUpperCase())}`:'';
    const entityParts=[
      ...((r.meta&&r.meta.entities&&r.meta.entities.names)||[]).slice(0,2),
      ...((r.meta&&r.meta.entities&&r.meta.entities.orgs)||[]).slice(0,2),
      ...((r.meta&&r.meta.entities&&r.meta.entities.emails)||[]).slice(0,1),
    ];
    const seenHtml=seenOn.length>1?
      `<div class="card-seen">SEEN ON ${seenOn.length}:${seenOn.map(s=>`<span>${esc(s)}</span>`).join('')}</div>`:'';
    const tagsHtml=tags.length?`<div class="tags">${tags.map(t=>`<span class="tag">${esc(t.toUpperCase())}</span>`).join('')}</div>`:'';
    const eraTag=r.meta&&r.meta.era?`<span class="tag" style="border-color:var(--gold);color:var(--gold)">ERA ${r.meta.era}</span>`:'';
    const ftTag=r.meta&&r.meta.fileType?`<span class="tag" style="border-color:#b5838d;color:#b5838d">${esc(r.meta.fileType.toUpperCase())}</span>`:'';
    const insightRow=`<div class="card-seen">RELIABILITY <span>${esc(reliability.toUpperCase())}</span> · LANG <span>${esc(language.toUpperCase())}</span>${region}</div>`;
    const whyHtml=r.meta&&r.meta.whySurvived?`<div class="card-seen">WHY THIS SURVIVED · ${esc(r.meta.whySurvived)}</div>`:'';
    const pageInspection=r.meta&&r.meta.pageInspection;
    const inspectionParts=pageInspection?[
      pageInspection.usernames&&pageInspection.usernames.length?`${pageInspection.usernames.slice(0,2).map((value)=>esc(value)).join(', ')} usernames`:null,
      pageInspection.emails&&pageInspection.emails.length?`${pageInspection.emails.length} emails`:null,
      pageInspection.outboundLinks&&pageInspection.outboundLinks.length?`${pageInspection.outboundLinks.length} outbound links`:null,
    ].filter(Boolean):[];
    const inspectionHtml=inspectionParts.length?`<div class="card-seen">PAGE INSPECTION · ${inspectionParts.join(' · ')}</div>`:'';
    const entityHtml=entityParts.length?`<div class="tags">${entityParts.map(v=>`<span class="tag">${esc(v)}</span>`).join('')}</div>`:'';
    const actionLinks=[
      r.meta&&r.meta.translationUrl?`<a href="${esc(r.meta.translationUrl)}" target="_blank" rel="noopener noreferrer">TRANSLATE</a>`:'',
      r.meta&&r.meta.snapshotViewerUrl?`<a href="${esc(r.meta.snapshotViewerUrl)}" target="_blank" rel="noopener noreferrer">SNAPSHOT</a>`:'',
      !r.meta?.snapshotViewerUrl&&r.meta&&r.meta.archiveUrl?`<a href="${esc(r.meta.archiveUrl)}" target="_blank" rel="noopener noreferrer">ARCHIVE</a>`:'',
    ].filter(Boolean);
    const actionsHtml=actionLinks.length?`<div class="card-seen">${actionLinks.join(' · ')}</div>`:'';
    if(clusterId&&clusterSize>1&&clusterId!==currentClusterId){
      currentClusterId=clusterId;
      const hdr=document.createElement('div');
      hdr.className='cluster';
      hdr.innerHTML=`<div class="cluster-hdr">≈ SIMILAR PAGES — ${clusterSize} results · ${esc(clusterLabel||'shared profile trail')}</div>`;
      list.appendChild(hdr);
    }
    const card=document.createElement('div');card.className='card';
    if(r.url){
      card.dataset.openable='true';
      card.title='Double-click to open in a new tab';
      card.addEventListener('dblclick',()=>openResultInNewTab(r.url));
    }
    card.style.animationDelay=(i*.035)+'s';
    card.innerHTML=
      `<div class="card-top">`+
        `<div class="card-title">${r.url?`<a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.title||r.url)}</a>`:esc(r.title||'—')}</div>`+
        `<span class="badge ${bc}">${esc(r.source)}</span>`+
        `<span class="state-tag state-${esc(resultState.tone)}">${esc(resultState.label)}</span>`+
        `<span class="score">▲${r.score||0}</span>`+
      `</div>`+
      (r.snippet?`<div class="card-snip">${esc(r.snippet)}</div>`:'')+
      (r.url?`<div class="card-url">${esc(r.url)}</div>`:'')+
      insightRow+
      whyHtml+
      inspectionHtml+
      seenHtml+
      actionsHtml+
      entityHtml+
      ((eraTag||ftTag||tagsHtml)?`<div class="tags">${eraTag}${ftTag}${tagsHtml}</div>`:'');
    list.appendChild(card);
  });
}

function renderInsightPanels(results){
  const timelineEl=document.getElementById('timeline-panel');
  const relatedEl=document.getElementById('related-panel');
  const insightsEl=document.getElementById('insights-panel');
  const originEl=document.getElementById('origin-panel');
  const familyEl=document.getElementById('family-panel');
  const consensusEl=document.getElementById('consensus-panel');
  if(timelineEl)timelineEl.innerHTML='';
  if(relatedEl)relatedEl.innerHTML='';
  if(insightsEl)insightsEl.innerHTML='';
  if(originEl)originEl.innerHTML='';
  if(familyEl)familyEl.innerHTML='';
  if(consensusEl)consensusEl.innerHTML='';
  if(!results.length)return;

  const query=document.getElementById('query').value.trim();
  const entities=[
    ...new Set(results.flatMap((result)=>[
      ...((result.meta&&result.meta.entities&&result.meta.entities.names)||[]),
      ...((result.meta&&result.meta.entities&&result.meta.entities.orgs)||[]),
      ...((result.meta&&result.meta.entities&&result.meta.entities.emails)||[]),
    ])),
  ].slice(0,8);
  if(insightsEl&&entities.length){
    insightsEl.innerHTML='<details class="cluster"><summary class="cluster-hdr">ENTITY EXTRACTION</summary><div class="tags">'+entities.map(v=>`<span class="tag">${esc(v)}</span>`).join('')+'</div></details>';
  }

  const firstBlood=findFirstBlood(results);
  if(originEl&&firstBlood){
    originEl.innerHTML=renderFirstBloodPanel(firstBlood);
  }

  const familyTree=buildSourceFamilyTree(results).slice(0,6);
  if(familyEl&&familyTree.length){
    familyEl.innerHTML=renderSourceFamilyPanel(familyTree);
  }

  const timeline=buildTimeline(results).slice(0,10);
  if(timelineEl&&timeline.length){
    timelineEl.innerHTML='<details class="cluster"><summary class="cluster-hdr">TIMELINE VIEW</summary>'+
      timeline.map((item)=>`<div class="card-seen"><span>${esc(item.label)}</span> · <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">${esc(item.title)}</a> · ${esc(item.reliability.toUpperCase())}</div>`).join('')+
      '</details>';
  }

  const consensus=buildConsensusFractureMap(results);
  if(consensusEl){
    const agreement=buildConsensusItems(
      'Agreement',
      consensus.agreement,
      (family)=>`<div class="consensus-item"><strong>Agreement</strong><div class="card-seen">${esc(family.label)} · reliable ${family.reliableCount} · echoes ${family.size}</div></div>`,
      'No multi-source reliable agreement yet.'
    );
    const divergence=buildConsensusItems(
      'Divergence',
      consensus.divergence,
      (family)=>`<div class="consensus-item"><strong>Divergence</strong><div class="card-seen">${esc(family.label)} · reliable ${family.reliableCount} · separate branch</div></div>`,
      'Reliable sources are not materially split on this pass.'
    );
    const amplification=buildConsensusItems(
      'Amplification risk',
      consensus.amplification,
      (family)=>`<div class="consensus-item"><strong>Amplification risk</strong><div class="card-seen">${esc(family.label)} · low-quality ${family.lowQualityCount} · echoes ${family.size}</div></div>`,
      'No weak-source repetition spike detected.'
    );
    consensusEl.innerHTML='<details class="cluster"><summary class="cluster-hdr">⚖️ CONSENSUS FRACTURE MAP</summary><div class="consensus-list">'+agreement+divergence+amplification+'</div></details>';
  }

  const related=buildRelatedQueries(query,results);
  if(relatedEl&&related.length){
    const wrap=document.createElement('div');
    wrap.className='cluster';
    wrap.innerHTML='<details><summary class="cluster-hdr">RELATED QUERIES</summary><div class="tags">'+
      related.map((value)=>`<button class="btn btn-sm related-query" data-query="${esc(value)}" type="button">${esc(value)}</button>`).join('')+
      '</div></details>';
    relatedEl.appendChild(wrap);
    relatedEl.querySelectorAll('[data-query]').forEach((btn)=>{
      btn.addEventListener('click',()=>{
        document.getElementById('query').value=btn.dataset.query||'';
        doSearch();
      });
    });
  }
}

// ── SOURCE STATUS BREAKDOWN ──────────────────────────────────────────────────
function renderSourceStatus(statusArr){
  const wrap=document.getElementById('src-status-wrap');
  if(!wrap)return;
  wrap.innerHTML='';
  if(!statusArr||!statusArr.length)return;
  const ok=statusArr.filter(s=>s.status==='ok');
  const empty=statusArr.filter(s=>s.status==='empty');
  const fail=statusArr.filter(s=>s.status==='fail');
  const det=document.createElement('details');det.className='src-status';
  det.innerHTML=
    `<summary>SOURCE BREAKDOWN: ${ok.length} OK · ${empty.length} empty · ${fail.length} failed</summary>`+
    '<div class="src-grid">'+
    statusArr.map(s=>{
      if(s.status==='ok')return`<span class="src-ok">✓ ${esc(s.name)} (${s.count})</span>`;
      if(s.status==='empty')return`<span class="src-empty">○ ${esc(s.name)}</span>`;
      return`<span class="src-fail">✗ ${esc(s.name)}${s.reason?' ('+esc(s.reason)+')':''}</span>`;
    }).join('')+
    '</div>';
  wrap.appendChild(det);
}

// ── LIVE PROGRESS ────────────────────────────────────────────────────────────
let _progressTotal=0,_progressDone=0;
function initLiveProgress(sourceNames){
  _progressTotal=sourceNames.length;_progressDone=0;
  const wrap=document.getElementById('live-progress');
  const grid=document.getElementById('progress-grid');
  const counter=document.getElementById('progress-counter');
  if(!wrap||!grid||!counter)return;
  wrap.style.display='block';
  counter.textContent=`0 / ${_progressTotal} sources`;
  grid.innerHTML=sourceNames.map(name=>
    `<span class="pg-pending" id="pg-${name}">${esc(name)}</span>`
  ).join('');
}
function updateLiveProgress(name,status){
  _progressDone++;
  const el=document.getElementById('pg-'+name);
  if(el){
    el.className=status==='ok'?'pg-ok':status==='empty'?'pg-empty':'pg-fail';
    const icon=status==='ok'?'✓':status==='empty'?'○':'✗';
    el.textContent=icon+' '+name;
  }
  const counter=document.getElementById('progress-counter');
  if(counter)counter.textContent=`${_progressDone} / ${_progressTotal} sources`;
}
function hideLiveProgress(){
  const wrap=document.getElementById('live-progress');
  if(wrap)wrap.style.display='none';
}

function buildTextExport(results){
  const query=document.getElementById('query').value.trim();
  const familyTree=buildSourceFamilyTree(results);
  const firstBlood=findFirstBlood(results);
  const consensus=buildConsensusFractureMap(results);
  const sections=[
    '🧭 TRACER INTELLIGENCE BRIEF',
    `Query: ${query||'Untitled search'}`,
    `Generated: ${new Date().toISOString()}`,
    '',
    `🌊 Summary: ${buildResultsBrief(results)}`,
    '',
    '🩸 First-blood finder',
    firstBlood
      ? `- ${firstBlood.dateLabel||'Undated'} | ${firstBlood.title} | ${firstBlood.url||firstBlood.source}`
      : '- No dated origin surfaced.',
    '',
    '🧬 Source family tree',
    ...(familyTree.length
      ? familyTree.map((family,index)=>`${index+1}. ${family.label}\n   Ancestor: ${family.ancestor.dateLabel||'Undated'} | ${family.ancestor.title} | ${family.ancestor.url||family.ancestor.source}\n   Echoes: ${family.echoCount} | Reliable: ${family.reliableCount} | Low-quality: ${family.lowQualityCount}`)
      : ['- No echo families formed.']),
    '',
    '⚖️ Consensus fracture map',
    `- Agreement lanes: ${consensus.agreement.length?consensus.agreement.map((family)=>`${family.label} (${family.reliableCount} reliable / ${family.size} echoes)`).join('; '):'none yet'}`,
    `- Divergence lanes: ${consensus.divergence.length?consensus.divergence.map((family)=>family.label).join('; '):'none detected'}`,
    `- Amplification risk: ${consensus.amplification.length?consensus.amplification.map((family)=>`${family.label} (${family.lowQualityCount} low-quality repeats)`).join('; '):'no fake-certainty spike detected'}`,
    '',
    '📎 Result ledger',
    ...results.map((result,index)=>[
      `${index+1}. ${result.title||result.url||'Untitled result'}`,
      `   🔗 ${result.url||'No URL available'}`,
      `   🛰️ Source: ${result.source||'unknown'} | Score: ${result.score||0} | Reliability: ${(result.meta&&result.meta.reliability)||'unknown'}`,
      `   👀 Seen on: ${(result.seenOn||[]).join(', ')||'single source'}`,
      result.snippet?`   📝 ${String(result.snippet).replace(/\s+/gu,' ').trim()}`:'',
    ].filter(Boolean).join('\n')),
    '',
  ];
  return sections.join('\n');
}

// ── EXPORT (JSON + TXT) ──────────────────────────────────────────────────────
function exportJSON(){
  if(!_lastResults.length)return;
  const data=_lastResults.map(r=>({
    title:r.title||'',url:r.url||'',source:r.source||'',
    snippet:r.snippet||'',score:r.score||0,
    seenOn:r.seenOn||[]
  }));
  const blob=new globalThis.Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  downloadBlob(blob,'tracer-results.json');
}
function exportTXT(){
  if(!_lastResults.length)return;
  const blob=new globalThis.Blob([buildTextExport(_lastResults)],{type:'text/plain;charset=utf-8'});
  downloadBlob(blob,'tracer-results.txt');
}
function downloadBlob(blob,filename){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=filename;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},100);
}

function resetPanel(id){
  const panel=document.getElementById(id);
  if(panel)panel.innerHTML='';
}

// ── SEARCH HISTORY ───────────────────────────────────────────────────────────
const HISTORY_KEY='tracer_search_history';
const HISTORY_MAX=20;

function loadHistory(){
  try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]')}
  catch{
    return[];
  }
}
function saveHistory(arr){
  try{localStorage.setItem(HISTORY_KEY,JSON.stringify(arr.slice(0,HISTORY_MAX)))}
  catch{
    // ignore storage write failures
  }
}
function addToHistory(query,resultCount){
  const hist=loadHistory();
  // Remove duplicate if exists
  const idx=hist.findIndex(h=>h.query===query);
  if(idx>=0)hist.splice(idx,1);
  hist.unshift({query,results:resultCount,time:Date.now()});
  saveHistory(hist);
  renderHistory();
}
function clearHistory(){
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
}
function renderHistory(){
  const list=document.getElementById('history-list');
  if(!list)return;
  const hist=loadHistory();
  if(!hist.length){
    list.innerHTML='<div style="padding:.4rem;color:var(--dim);font-size:.7rem">No recent scans</div>';
    return;
  }
  list.innerHTML='';
  hist.forEach((h)=>{
    const d=new Date(h.time);
    const ts=d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
    const item=document.createElement('div');item.className='hist-item';
    const qSpan=document.createElement('span');
    qSpan.className='hist-query';
    qSpan.textContent=h.query;
    qSpan.title='Re-run this search';
    qSpan.addEventListener('click',()=>rerunSearch(h.query));
    const meta=document.createElement('span');
    meta.className='hist-meta';
    meta.textContent=`${h.results} signals · ${ts}`;
    item.appendChild(qSpan);
    item.appendChild(meta);
    list.appendChild(item);
  });
  const clearWrap=document.createElement('div');
  clearWrap.style.cssText='padding:.3rem .5rem;text-align:right';
  const clearBtn=document.createElement('span');
  clearBtn.className='hist-clear';
  clearBtn.textContent='CLEAR HISTORY';
  clearBtn.addEventListener('click',clearHistory);
  clearWrap.appendChild(clearBtn);
  list.appendChild(clearWrap);
}
function rerunSearch(query){
  document.getElementById('query').value=query;
  doSearch();
}

function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}
function showLoading(v){document.getElementById('loading').style.display=v?'block':'none';document.getElementById('srch-btn').disabled=v}
function clearResults(){
  document.getElementById('results-section').style.display='none';
  document.getElementById('results-list').innerHTML='';
  document.getElementById('avatar-clusters').innerHTML='';
  document.getElementById('src-status-wrap').innerHTML='';
  resetPanel('insights-panel');
  resetPanel('origin-panel');
  resetPanel('family-panel');
  resetPanel('timeline-panel');
  resetPanel('consensus-panel');
  resetPanel('related-panel');
  const eb=document.getElementById('export-bar');
  if(eb)eb.style.display='none';
  const meta=document.getElementById('results-meta');
  if(meta){
    meta.innerHTML='';
    meta.style.display='none';
  }
  const brief=document.getElementById('results-brief');
  if(brief){
    brief.textContent='';
    brief.style.display='none';
  }
  _lastResults=[];
}
function showErr(msg,isErr){const el=document.getElementById('err');el.textContent=msg;el.style.display=msg?'block':'none';if(!isErr){el.style.color='var(--bright)';return}setUiStatus('error','SIGNAL LOST')}

// ── INIT ─────────────────────────────────────────────────────────────────────
loadKeys();
renderHistory();
setUiStatus('idle','AWAITING SIGNAL');
document.getElementById('query').addEventListener('input',e=>setUiStatus(e.target.value.trim()?'typing':'idle',e.target.value.trim()?'SIGNAL FORMING':'AWAITING SIGNAL'));
// Always try the local server first. On GitHub Pages or file:// launches we
// start in STANDALONE mode but immediately attempt a connection — if the user
// has `npm run serve` running, the dot goes green and searches use the full
// engine set.
if(isStandaloneClient){
  document.getElementById('dot').className='dot standalone';
  document.getElementById('conn-lbl').textContent='STANDALONE';
  // Silently try to reach the server; if it's there, the dot turns green.
  checkConn();
}else{
  checkConn();
}
// Re-check periodically in case the server starts/stops while the page is open.
setInterval(checkConn,20000);

Object.assign(globalThis,{
  checkConn,
  clearKeys,
  doSearch,
  exportJSON,
  exportTXT,
  saveKeys,
});
