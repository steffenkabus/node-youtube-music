<p align="center">
    <img width="400" alt="typescript-starter dark logo" src="https://user-images.githubusercontent.com/16015833/103463862-d9ee3200-4d2f-11eb-96d2-e02f5a5c9637.png" style="max-width:100%;">

<h2 align="center">
    Unofficial YouTube Music API for Node.js
</h2>

Based on the work of [baptisteArno](https://github.com/baptisteArno/node-youtube-music).

<p align="center">
  <a href="https://www.npmjs.com/package/node-youtube-music">
    <img src="https://img.shields.io/npm/v/node-youtube-music.svg" alt="version" />
  </a>
  <a href="https://npmjs.org/package/node-youtube-music">
    <img src="https://img.shields.io/npm/dm/node-youtube-music.svg" alt="downloads" />
  </a>
   <a href="https://packagephobia.now.sh/result?p=node-youtube-music">
    <img src="https://packagephobia.now.sh/badge?p=node-youtube-music" alt="install size" />
  </a>
</p>

## Features

- [x] Search
  - [x] Musics
  - [x] Playlists
  - [x] Albums
  - [x] Artists
- [x] List musics from playlist
- [x] List musics from album
- [x] List albums from artist
- [x] List musics from artist
- [x] Get suggestions from music
- [ ] Playlist management (create, push, remove)
- [ ] Library management

## Get started

```shell
npm install node-youtube-music
```

or

```shell
yarn add node-youtube-music
```

## How to use

```ts
import {
  searchMusics,
  searchAlbums,
  searchPlaylists,
  getSuggestions,
  listMusicsFromAlbum,
  listMusicsFromPlaylist,
  searchArtists,
  getArtist,
} from 'node-youtube-music';

const musics = await searchMusics('Never gonna give you up');

const albums = await searchAlbums('Human after all');

const playlists = await searchPlaylists('Jazz');

const suggestions = await getSuggestions(musics[0].youtubeId);

const albumSongs = await listMusicsFromAlbum(albums[0].albumId);

const playlistSongs = await listMusicsFromPlaylist(playlists[0].playlistId);

const artists = await searchArtists('Daft Punk');

const artist = await getArtist(artists[0].artistId);
```
