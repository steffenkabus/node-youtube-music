const fetch = require('node-fetch');
const parseArtistSearchResult = require('./parsers.js');
const context = require('./context.js');

module.exports.parseArtistsSearchBody = (body) => {
  const { contents } =
    body.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.pop()
      .musicShelfRenderer;
  const results = [];

  contents.forEach((content) => {
    try {
      const artist = parseArtistSearchResult(content);
      if (artist) {
        results.push(artist);
      }
    } catch (err) {
      console.error(err);
    }
  });
  return results;
};

module.exports.searchArtists = async (
  query,
  options
) => {
  const response = await fetch(
    'https://music.youtube.com/youtubei/v1/search?alt=json&key=' + process.env.YOUTUBE_API_KEY,
    {
      method: "POST",
      body: JSON.stringify({
        ...context.body,
        params: 'EgWKAQIgAWoKEAMQBBAJEAoQBQ%3D%3D',
        query,
      }),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept-Language': options?.lang ?? 'en',
        origin: 'https://music.youtube.com',
      },
    }
  );
  try {
    return parseArtistsSearchBody(await response.json());
  } catch (e) {
    console.error(e);
    return [];
  }
}
