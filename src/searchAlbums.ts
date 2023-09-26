import got from 'got';
import context from './context.js';
import { AlbumPreview } from './models.js';
import { parseAlbumItem } from './parsers.js';

export const parseSearchAlbumsBody = (body: any): AlbumPreview[] => {
  const { contents } =
    body.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.pop()
      .musicShelfRenderer;

  const results: AlbumPreview[] = [];

  contents.forEach((content: any) => {
    try {
      const album = parseAlbumItem(content);
      if (album) {
        results.push(album);
      }
    } catch (err) {
      console.error(err);
    }
  });
  return results;
};

export async function searchAlbums(query: string): Promise<AlbumPreview[]> {
  const response = await got.post(
    'https://music.youtube.com/youtubei/v1/search?alt=json&key=' + process.env.YOUTUBE_API_KEY,
    {
      json: {
        ...context.body,
        params: 'EgWKAQIYAWoKEAkQAxAEEAUQCg%3D%3D',
        query,
      },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        origin: 'https://music.youtube.com',
      },
    }
  );
  try {
    return parseSearchAlbumsBody(JSON.parse(response.body));
  } catch (e) {
    console.error(e);
    return [];
  }
}
