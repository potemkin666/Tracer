const axios = require('axios');
const { normalise } = require('../normaliser');

const PLATFORMS = [
  { id: 'GitHub', url: u => `https://github.com/${u}` },
  { id: 'Gist', url: u => `https://gist.github.com/${u}` },
  { id: 'GitLab', url: u => `https://gitlab.com/${u}` },
  { id: 'Bitbucket', url: u => `https://bitbucket.org/${u}` },
  { id: 'SourceHut', url: u => `https://sr.ht/~${u}` },
  { id: 'Reddit', url: u => `https://www.reddit.com/user/${u}` },
  { id: 'Medium', url: u => `https://medium.com/@${u}` },
  { id: 'Substack', url: u => `https://substack.com/@${u}` },
  { id: 'Mastodon', url: u => `https://mastodon.social/@${u}` },
  { id: 'Bluesky', url: u => `https://bsky.app/profile/${u}` },
  { id: 'Twitter/X', url: u => `https://x.com/${u}` },
  { id: 'Instagram', url: u => `https://www.instagram.com/${u}/` },
  { id: 'TikTok', url: u => `https://www.tiktok.com/@${u}` },
  { id: 'YouTube', url: u => `https://www.youtube.com/@${u}` },
  { id: 'Twitch', url: u => `https://www.twitch.tv/${u}` },
  { id: 'Vimeo', url: u => `https://vimeo.com/${u}` },
  { id: 'SoundCloud', url: u => `https://soundcloud.com/${u}` },
  { id: 'Bandcamp', url: u => `https://${u}.bandcamp.com` },
  { id: 'Flickr', url: u => `https://www.flickr.com/photos/${u}/` },
  { id: 'Imgur', url: u => `https://imgur.com/user/${u}` },
  { id: 'Pinterest', url: u => `https://www.pinterest.com/${u}/` },
  { id: 'Tumblr', url: u => `https://${u}.tumblr.com` },
  { id: 'WordPress', url: u => `https://${u}.wordpress.com` },
  { id: 'Blogger', url: u => `https://${u}.blogspot.com` },
  { id: 'Pastebin', url: u => `https://pastebin.com/u/${u}` },
  { id: 'SpeakerDeck', url: u => `https://speakerdeck.com/${u}` },
  { id: 'SlideShare', url: u => `https://www.slideshare.net/${u}` },
  { id: 'Issuu', url: u => `https://issuu.com/${u}` },
  { id: 'Behance', url: u => `https://www.behance.net/${u}` },
  { id: 'Dribbble', url: u => `https://dribbble.com/${u}` },
  { id: 'DeviantArt', url: u => `https://www.deviantart.com/${u}` },
  { id: 'About.me', url: u => `https://about.me/${u}` },
  { id: 'Goodreads', url: u => `https://www.goodreads.com/${u}` },
  { id: 'ResearchGate', url: u => `https://www.researchgate.net/profile/${u}` },
  { id: 'Academia.edu', url: u => `https://${u}.academia.edu` },
];

async function checkUrl(url) {
  try {
    const res = await axios.head(url, {
      timeout: 5000,
      maxRedirects: 3,
      validateStatus: s => s < 500,
    });
    return res.status === 200 || res.status === 301 || res.status === 302;
  } catch {
    try {
      const res = await axios.get(url, {
        timeout: 5000,
        maxRedirects: 3,
        validateStatus: s => s < 500,
        responseType: 'stream',
      });
      res.data.destroy();
      return res.status === 200 || res.status === 301 || res.status === 302;
    } catch {
      return false;
    }
  }
}

async function checkHackerNews(u) {
  try {
    const res = await axios.get(`https://hacker-news.firebaseio.com/v0/user/${u}.json`, { timeout: 5000 });
    return res.data && res.data.created ? { found: true, url: `https://news.ycombinator.com/user?id=${u}` } : { found: false };
  } catch {
    return { found: false };
  }
}

async function checkStackOverflow(u) {
  try {
    const res = await axios.get('https://api.stackexchange.com/2.3/users', {
      params: { site: 'stackoverflow', filter: '!9Z(-wwYGT', inname: u, pagesize: 5 },
      timeout: 5000,
    });
    const items = (res.data && res.data.items) || [];
    if (items.length > 0) {
      return { found: true, url: items[0].link };
    }
    return { found: false };
  } catch {
    return { found: false };
  }
}

async function search(query, apiKeys = {}) {
  try {
    const parts = query.trim().toLowerCase().split(/\s+/);
    const u1 = parts[0];
    const u2 = parts.join('');
    const usernames = u1 === u2 ? [u1] : [u1, u2];

    const results = [];
    const seen = new Set();

    const checks = [];

    for (const u of usernames) {
      for (const platform of PLATFORMS) {
        const url = platform.url(u);
        checks.push(
          checkUrl(url).then(found => {
            if (found && !seen.has(platform.id + u)) {
              seen.add(platform.id + u);
              results.push({ platform: platform.id, url, u });
            }
          })
        );
      }

      checks.push(
        checkHackerNews(u).then(r => {
          if (r.found && !seen.has('HackerNews' + u)) {
            seen.add('HackerNews' + u);
            results.push({ platform: 'Hacker News', url: r.url, u });
          }
        })
      );

      checks.push(
        checkStackOverflow(u).then(r => {
          if (r.found && !seen.has('StackOverflow' + u)) {
            seen.add('StackOverflow' + u);
            results.push({ platform: 'Stack Overflow', url: r.url, u });
          }
        })
      );
    }

    await Promise.allSettled(checks);

    return results.map((r, i) =>
      normalise('social-profiles', query, {
        title: `[${r.platform}] ${r.url}`,
        url: r.url,
        snippet: `${r.platform} profile found for username: ${r.u}`,
        rank: i + 1,
        meta: { tags: ['social', 'profile'] },
      })
    );
  } catch {
    return [];
  }
}

module.exports = { search };
