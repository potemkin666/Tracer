/**
 * Shared platform registry for username-based profile checking.
 * Used by both namechk.js and socialProfiles.js to avoid duplicate lists.
 */
const PLATFORMS = [
  // ── Code & Dev ────────────────────────────────────────────────────────────
  { id: 'GitHub', url: u => `https://github.com/${u}` },
  { id: 'Gist', url: u => `https://gist.github.com/${u}` },
  { id: 'GitLab', url: u => `https://gitlab.com/${u}` },
  { id: 'Bitbucket', url: u => `https://bitbucket.org/${u}` },
  { id: 'SourceHut', url: u => `https://sr.ht/~${u}` },

  // ── Social / Forums ───────────────────────────────────────────────────────
  { id: 'Reddit', url: u => `https://www.reddit.com/user/${u}` },
  { id: 'Medium', url: u => `https://medium.com/@${u}` },
  { id: 'Substack', url: u => `https://substack.com/@${u}` },
  { id: 'Mastodon', url: u => `https://mastodon.social/@${u}` },
  { id: 'Bluesky', url: u => `https://bsky.app/profile/${u}` },
  { id: 'Twitter/X', url: u => `https://x.com/${u}` },
  { id: 'Instagram', url: u => `https://www.instagram.com/${u}/` },
  { id: 'TikTok', url: u => `https://www.tiktok.com/@${u}` },
  { id: 'LinkedIn', url: u => `https://www.linkedin.com/in/${u}` },
  { id: 'Facebook', url: u => `https://www.facebook.com/${u}` },
  { id: 'Snapchat', url: u => `https://www.snapchat.com/add/${u}` },
  { id: 'Threads', url: u => `https://www.threads.net/@${u}` },
  { id: 'Telegram', url: u => `https://t.me/${u}` },
  { id: 'Discord', url: u => `https://discord.com/users/${u}` },

  // ── Video / Audio ─────────────────────────────────────────────────────────
  { id: 'YouTube', url: u => `https://www.youtube.com/@${u}` },
  { id: 'Twitch', url: u => `https://www.twitch.tv/${u}` },
  { id: 'Vimeo', url: u => `https://vimeo.com/${u}` },
  { id: 'SoundCloud', url: u => `https://soundcloud.com/${u}` },
  { id: 'Bandcamp', url: u => `https://${u}.bandcamp.com` },
  { id: 'Spotify', url: u => `https://open.spotify.com/user/${u}` },
  { id: 'Last.fm', url: u => `https://www.last.fm/user/${u}` },

  // ── Images / Design ───────────────────────────────────────────────────────
  { id: 'Flickr', url: u => `https://www.flickr.com/photos/${u}/` },
  { id: 'Imgur', url: u => `https://imgur.com/user/${u}` },
  { id: 'Pinterest', url: u => `https://www.pinterest.com/${u}/` },
  { id: 'Behance', url: u => `https://www.behance.net/${u}` },
  { id: 'Dribbble', url: u => `https://dribbble.com/${u}` },
  { id: 'DeviantArt', url: u => `https://www.deviantart.com/${u}` },

  // ── Blogging / Publishing ─────────────────────────────────────────────────
  { id: 'Tumblr', url: u => `https://${u}.tumblr.com` },
  { id: 'WordPress', url: u => `https://${u}.wordpress.com` },
  { id: 'Blogger', url: u => `https://${u}.blogspot.com` },

  // ── Misc ──────────────────────────────────────────────────────────────────
  { id: 'Pastebin', url: u => `https://pastebin.com/u/${u}` },
  { id: 'SpeakerDeck', url: u => `https://speakerdeck.com/${u}` },
  { id: 'SlideShare', url: u => `https://www.slideshare.net/${u}` },
  { id: 'Issuu', url: u => `https://issuu.com/${u}` },
  { id: 'About.me', url: u => `https://about.me/${u}` },
  { id: 'Goodreads', url: u => `https://www.goodreads.com/${u}` },
  { id: 'ResearchGate', url: u => `https://www.researchgate.net/profile/${u}` },
  { id: 'Academia.edu', url: u => `https://${u}.academia.edu` },

  // ── Gaming / Tech ────────────────────────────────────────────────────────
  { id: 'Steam', url: u => `https://steamcommunity.com/id/${u}` },
  { id: 'Keybase', url: u => `https://keybase.io/${u}` },
  { id: 'HackerOne', url: u => `https://hackerone.com/${u}` },
  { id: 'Replit', url: u => `https://replit.com/@${u}` },
  { id: 'CodePen', url: u => `https://codepen.io/${u}` },
  { id: 'npm', url: u => `https://www.npmjs.com/~${u}` },
  { id: 'PyPI', url: u => `https://pypi.org/user/${u}/` },
  { id: 'Kaggle', url: u => `https://www.kaggle.com/${u}` },
  { id: 'Gravatar', url: u => `https://en.gravatar.com/${u}` },
  { id: 'Linktree', url: u => `https://linktr.ee/${u}` },
];

export { PLATFORMS };
