const fetch = require('node-fetch');
const parseMusicInAlbumItem = require('./parsers.js');
const context = require('./context.js');

module.exports.parseListMusicsFromAlbumBody = (body) => {
  const { contents } =
    body.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
      .sectionListRenderer.contents[0].musicShelfRenderer;
  const songs = [];
  const { thumbnailUrl, artist, album } = parseAlbumHeader(body.header);

  contents.forEach((element) => {
    try {
      const song = parseMusicInAlbumItem(element);
      if (song) {
        song.album = album;
        if (song.artists?.length === 0) song.artists = [{ name: artist }];
        song.thumbnailUrl = thumbnailUrl;
        songs.push(song);
      }
    } catch (err) {
      console.error(err);
    }
  });
  return songs;
};

module.exports.listMusicsFromAlbum = async (
  albumId
) => {
  const response = await fetch(
    'https://music.youtube.com/youtubei/v1/browse?alt=json&key=' + process.env.YOUTUBE_API_KEY,
    {
      method: "POST",
      body: JSON.stringify({
        ...context.body,
        browseId: albumId,
      }),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        origin: 'https://music.youtube.com',
      },
    }
  );
  try {
    return parseListMusicsFromAlbumBody(await response.json());
  } catch (e) {
    console.error(e);
    return [];
  }
}
