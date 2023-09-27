const fetch = require('node-fetch');
const parseMusicItem = require('./parsers.js');
const context = require('./context.js');

module.exports.parseSearchMusicsBody = (body) => {
  const { contents } =
    body.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.pop()
      .musicShelfRenderer;

  const results = [];

  contents.forEach((content) => {
    try {
      const song = parseMusicItem(content);
      if (song) {
        results.push(song);
      }
    } catch (e) {
      console.error(e);
    }
  });
  return results;
};

module.exports.searchMusics = async (query) => {
  const response = await fetch(
    'https://music.youtube.com/youtubei/v1/search?alt=json&key=' + process.env.YOUTUBE_API_KEY,
    {
      method: "POST",
      body: JSON.stringify({
        ...context.body,
        params: 'EgWKAQIIAWoKEAoQCRADEAQQBQ%3D%3D',
        query,
      }),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        origin: 'https://music.youtube.com',
      },
    }
  );
  try {
    return parseSearchMusicsBody(await response.json());
  } catch {
    return [];
  }
}
