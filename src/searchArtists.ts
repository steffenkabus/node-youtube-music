import fetch from 'node-fetch';
import context from './context.js';
import { ArtistPreview } from './models.js';
import { parseArtistSearchResult } from './parsers.js';

export const parseArtistsSearchBody = (body: any): ArtistPreview[] => {
  const { contents } =
    body.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents.pop()
      .musicShelfRenderer;
  const results: ArtistPreview[] = [];

  contents.forEach((content: any) => {
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

export async function searchArtists(
  query: string,
  options?: {
    lang?: string;
    country?: string;
  }
): Promise<ArtistPreview[]> {
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
