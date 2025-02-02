const fetch = require('node-fetch');
const parsers = require('./parsers.js');
const context = require('./context.js');

module.exports.parseListMusicsFromPlaylistBody = (body) => {
  const content =
    body.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
      .sectionListRenderer.contents[0];
  const { contents } =
    content.musicPlaylistShelfRenderer ?? content.musicCarouselShelfRenderer;

  const results = [];

  contents.forEach((content) => {
    try {
      const song = parsers.parseMusicInPlaylistItem(content);
      if (song) {
        results.push(song);
      }
    } catch (e) {
      console.error(e);
    }
  });
  return results;
};

module.exports.listMusicsFromPlaylist = async (
  playlistId
) => {
  let browseId;

  if (!playlistId.startsWith('VL')) {
    browseId = 'VL' + playlistId;
  }

  try {
    const response = await fetch(
      'https://music.youtube.com/youtubei/v1/browse?alt=json&key=' + process.env.YOUTUBE_API_KEY,
      {
        method: 'POST',
        body: JSON.stringify({
          ...context.body,
          browseId,
        }),
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          origin: 'https://music.youtube.com',
        },
      }
    );
    return parseListMusicsFromPlaylistBody(await response.json());
  } catch (error) {
    console.error(`Error in listMusicsFromPlaylist: ${error}`);
    return [];
  }
}
