import fetch from 'node-fetch';
import context from './context.js';
import { MusicVideo } from './models.js';
import { parseMusicInPlaylistItem } from './parsers.js';

export const parseListMusicsFromPlaylistBody = (body: {
  contents: {
    singleColumnBrowseResultsRenderer: {
      tabs: {
        tabRenderer: {
          content: {
            sectionListRenderer: {
              contents: {
                musicPlaylistShelfRenderer?: { contents: [] };
                musicCarouselShelfRenderer: { contents: [] };
              }[];
            };
          };
        };
      }[];
    };
  };
}): MusicVideo[] => {
  const content =
    body.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
      .sectionListRenderer.contents[0];
  const { contents } =
    content.musicPlaylistShelfRenderer ?? content.musicCarouselShelfRenderer;

  const results: MusicVideo[] = [];

  contents.forEach((content: any) => {
    try {
      const song = parseMusicInPlaylistItem(content);
      if (song) {
        results.push(song);
      }
    } catch (e) {
      console.error(e);
    }
  });
  return results;
};

export async function listMusicsFromPlaylist(
  playlistId: string
): Promise<MusicVideo[]> {
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
    return parseListMusicsFromPlaylistBody(await response.json() as any);
  } catch (error) {
    console.error(`Error in listMusicsFromPlaylist: ${error}`);
    return [];
  }
}
