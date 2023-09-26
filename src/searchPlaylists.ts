import fetch from 'node-fetch';
import context from './context.js';
import { PlaylistPreview } from './models.js';
import { parsePlaylistItem } from './parsers.js';

export const parseSearchPlaylistsBody = (
  body: any,
  onlyOfficialPlaylists: boolean
): PlaylistPreview[] => {
  const contents =
    body.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.pop()
      .musicShelfRenderer?.contents;

  if (!contents) {
    return [];
  }


  const results: PlaylistPreview[] = [];

  contents.forEach((content: any) => {
    try {
      const playlist = parsePlaylistItem(content, onlyOfficialPlaylists);
      if (playlist) {
        results.push(playlist);
      }
    } catch (e) {
      console.error(e);
    }
  });
  return results;
};

export async function searchPlaylists(
  query: string,
  options?: {
    onlyOfficialPlaylists?: boolean;
  }
): Promise<PlaylistPreview[]> {
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
