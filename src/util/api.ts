import axios, { AxiosPromise } from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import urlJoin from 'url-join';
import { LocalStorage } from '../enums/LocalStorageKeys';
import { SearchResponse } from '../models/tmdb/SearchResponse';
import { TmdbMovie } from '../models/tmdb/TmdbMovie';
import { WatchProviderResponse } from '../models/tmdb/WatchProviderResponse';
import { AddListItemsResponse } from '../models/trakt/AddListItemsResponse';
import { ListItems } from '../models/trakt/ListItems';
import { ListResult } from '../models/trakt/ListResult';
import { MovieCollection } from '../models/trakt/MovieCollection';
import { NewListInput } from '../models/trakt/NewListInput';
import { RemoveListItemsResponse } from '../models/trakt/RemoveListItemsResponse';
import { UserSettings } from '../models/trakt/User';
import getTraktHeaders from './getTraktHeaders';

interface ListMovieInput {
  movieId: number;
  listId: number;
}

const ACCOUNT_ID = JSON.parse(
  localStorage.getItem(LocalStorage.USER_ID) || '""'
);

const ACCESS_TOKEN = JSON.parse(
  localStorage.getItem(LocalStorage.ACCESS_TOKEN) || '""'
);

// TMDB
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org';

const TMDB = applyCaseMiddleware(axios.create({ baseURL: TMDB_BASE_URL }));

const LANG = 'en-US';
const TMDB_API_VERSION = '3';
const WATCH_REGION = 'US';
const MOVIE = 'movie';
const TMDB_PARAMS = {
  language: LANG,
  api_key: TMDB_API_KEY,
  append_to_response: [
    'videos',
    'credits',
    'watch/providers',
    'similar',
    'recommendations',
    'release_dates',
  ].join(','),
};

// TRAKT
export const TRAKT_BASE_URL = 'https://api.trakt.tv';
const USERS = 'users';
const LISTS = 'lists';
const ITEMS = 'items';
const LIST_PATH = urlJoin(USERS, ACCOUNT_ID, LISTS);

export const TRAKT = applyCaseMiddleware(
  axios.create({
    baseURL: TRAKT_BASE_URL,
    headers: getTraktHeaders(ACCESS_TOKEN),
  })
);

export const API = {
  newList: ({
    name,
    description = '',
    privacy,
  }: NewListInput): AxiosPromise<ListResult> => {
    const body = {
      name,
      description,
      privacy,
      sort_by: 'added',
    };
    return TRAKT.post(LIST_PATH, body);
  },

  getLists: (): AxiosPromise<ListResult[]> => TRAKT.get(LIST_PATH),

  getListInfo: (listId: number): AxiosPromise<ListResult> =>
    TRAKT.get(urlJoin(LIST_PATH, String(listId))),

  getListItems: (listId: number): AxiosPromise<ListItems[]> =>
    TRAKT.get(urlJoin(LIST_PATH, String(listId), ITEMS)),

  getCollection: (): AxiosPromise<MovieCollection[]> =>
    TRAKT.get('sync/collection/movies'),

  getMovieInfo: (movieId: number): AxiosPromise<TmdbMovie> =>
    TMDB.get(urlJoin(TMDB_API_VERSION, MOVIE, String(movieId)), {
      params: TMDB_PARAMS,
    }),

  addMovieToList: ({
    movieId,
    listId,
  }: ListMovieInput): AxiosPromise<AddListItemsResponse> =>
    TRAKT.post(urlJoin(LIST_PATH, String(listId), ITEMS), {
      movies: [{ ids: { tmdb: movieId } }],
    }),

  removeMovieFromList: ({
    movieId,
    listId,
  }: ListMovieInput): AxiosPromise<RemoveListItemsResponse> =>
    TRAKT.post(urlJoin(LIST_PATH, String(listId), ITEMS, 'remove'), {
      movies: [{ ids: { tmdb: movieId } }],
    }),

  search: (query: string): AxiosPromise<SearchResponse> =>
    TMDB.get(urlJoin(TMDB_API_VERSION, 'search', MOVIE), {
      params: {
        query,
        api_key: TMDB_API_KEY,
        language: LANG,
        page: 1,
        include_adult: false,
      },
    }),

  deleteLists: (listId: number): AxiosPromise =>
    TRAKT.delete(urlJoin(LIST_PATH, String(listId))),

  getStats: (): AxiosPromise<UserSettings> =>
    TRAKT.get(urlJoin(USERS, 'settings')),

  getWatchProviders: (): AxiosPromise<WatchProviderResponse> =>
    TMDB.get(urlJoin(TMDB_API_VERSION, 'watch/providers', MOVIE), {
      params: {
        api_key: TMDB_API_KEY,
        language: LANG,
        watch_region: WATCH_REGION,
      },
    }),
};
