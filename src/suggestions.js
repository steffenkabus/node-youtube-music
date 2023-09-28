const fetch = require('node-fetch');
const parsers = require('./parsers.js');
const context = require('./context.js');

module.exports.parseGetSuggestionsBody = (body) => {
  const { contents } =
    body.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer
      .watchNextTabbedResultsRenderer.tabs[0].tabRenderer.content
      .musicQueueRenderer.content.playlistPanelRenderer;

  const results = [];

  contents.forEach((content) => {
    try {
      const video = parsers.parseSuggestionItem(content);
      if (video) {
        results.push(video);
      }
    } catch (e) {
      console.error(e);
    }
  });
  return results;
};

module.exports.getSuggestions = async (videoId) => {
  const response = await fetch(
    'https://music.youtube.com/youtubei/v1/next?alt=json&key=' + process.env.YOUTUBE_API_KEY,
    {
      method: "POST",
      body: JSON.stringify({
        ...context.body,
        enablePersistentPlaylistPanel: true,
        isAudioOnly: true,
        params: 'mgMDCNgE',
        playerParams: 'igMDCNgE',
        tunerSettingValue: 'AUTOMIX_SETTING_NORMAL',
        playlistId: `RDAMVM${videoId}`,
        videoId,
      }),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        origin: 'https://music.youtube.com',
      },
    }
  );
  try {
    return parseGetSuggestionsBody(await response.json());
  } catch {
    return [];
  }
}
