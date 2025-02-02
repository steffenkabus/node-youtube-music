const fetch = require('node-fetch');
const parsers = require('./parsers.js');
const context = require('./context.js');

module.exports.parseSearchPlaylistsBody = (
  body,
  onlyOfficialPlaylists
) => {
  const contents =
    body.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.pop()
      .musicShelfRenderer?.contents;

  if (!contents) {
    return [];
  }


  const results = [];

  contents.forEach((content) => {
    try {
      const playlist = parsers.parsePlaylistItem(content, onlyOfficialPlaylists);
      if (playlist) {
        results.push(playlist);
      }
    } catch (e) {
      console.error(e);
    }
  });
  return results;
};

module.exports.searchPlaylists = async (
  query,
  options
) => {
  const response = await fetch(
    'https://music.youtube.com/youtubei/v1/search?alt=json&key=' + process.env.YOUTUBE_API_KEY,
    {
      method: 'POST',
      body: JSON.stringify({
        ...context.body,
        params: 'EgWKAQIoAWoKEAoQAxAEEAUQCQ%3D%3D',
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
    return parseSearchPlaylistsBody(
      await response.json(),
      options?.onlyOfficialPlaylists ?? false
    );
  } catch (e) {
    console.error(e);
    return [];
  }
}
