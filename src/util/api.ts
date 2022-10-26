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

interface ListMovieInput {
  movieId: number;
  listId: number;
}

const TRAKT_API_KEY = import.meta.env.VITE_TRAKT_API_KEY;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const ACCOUNT_ID = JSON.parse(
  localStorage.getItem(LocalStorage.USER_ID) || '""'
);

const ACCESS_TOKEN = JSON.parse(
  localStorage.getItem(LocalStorage.ACCESS_TOKEN) || '""'
);

const LANG = 'en-US';
const BASE_URL = 'https://api.themoviedb.org';
const TMDB_API_VERSION = '3';
const WATCH_REGION = 'US';

const USERS = 'users';
const LISTS = 'lists';
const LIST_PATH = urlJoin(USERS, ACCOUNT_ID, LISTS);

const TMDB = applyCaseMiddleware(axios.create({ baseURL: BASE_URL }));

export const TRAKT = applyCaseMiddleware(
  axios.create({
    baseURL: 'https://api.trakt.tv',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': TRAKT_API_KEY!,
    },
  })
);

const params = {
  language: LANG,
  api_key: TMDB_API_KEY,
  append_to_response:
    'videos,credits,watch/providers,similar,recommendations,release_dates',
};

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
    TRAKT.get(urlJoin(LIST_PATH, String(listId), 'items')),

  getCollection: (): AxiosPromise<MovieCollection[]> =>
    TRAKT.get('sync/collection/movies'),

  getMovieInfo: (movieId: number): AxiosPromise<TmdbMovie> =>
    TMDB.get(urlJoin(TMDB_API_VERSION, 'movie', String(movieId)), {
      params,
    }),

  addMovieToList: ({
    movieId,
    listId,
  }: ListMovieInput): AxiosPromise<AddListItemsResponse> =>
    TRAKT.post(urlJoin(LIST_PATH, String(listId), 'items'), {
      movies: [{ ids: { tmdb: movieId } }],
    }),

  removeMovieFromList: ({
    movieId,
    listId,
  }: ListMovieInput): AxiosPromise<RemoveListItemsResponse> =>
    TRAKT.post(urlJoin(LIST_PATH, String(listId), 'items/remove'), {
      movies: [{ ids: { tmdb: movieId } }],
    }),

  search: (query: string): AxiosPromise<SearchResponse> =>
    TMDB.get(urlJoin(TMDB_API_VERSION, 'search/movie'), {
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
    TMDB.get(urlJoin(TMDB_API_VERSION, 'watch/providers/movie'), {
      params: {
        api_key: TMDB_API_KEY,
        language: LANG,
        watch_region: WATCH_REGION,
      },
    }),
};
