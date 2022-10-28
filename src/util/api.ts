import axios, { AxiosError, AxiosPromise } from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
import urlJoin from 'url-join';
import { LocalStorage } from '../enums/LocalStorageKeys';
import { AllLists } from '../models/tmdb/AllLists';
import { EditListResponse } from '../models/tmdb/EditListResponse';
import { ListContents } from '../models/tmdb/ListContents';
import { SearchResponse } from '../models/tmdb/SearchResponse';
import { TmdbMovie } from '../models/tmdb/TmdbMovie';
import { WatchProviderResponse } from '../models/tmdb/WatchProviderResponse';
import { ItemPresent } from '../models/trakt/ListItems';
import { MovieCollection } from '../models/trakt/MovieCollection';
import { NewListInput } from '../models/trakt/NewListInput';
import getTraktHeaders from './getTraktHeaders';

interface ListMovieInput {
  movieId: string;
  targetListId: string;
}

const ACCOUNT_ID = JSON.parse(
  localStorage.getItem(LocalStorage.TRAKT_USER_ID) || '""'
);

const TRAKT_ACCESS_TOKEN = JSON.parse(
  localStorage.getItem(LocalStorage.TRAKT_ACCESS_TOKEN) || '""'
);

// TMDB
const TMDB_BASE_URL = 'https://api.themoviedb.org';
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_ACCOUNT_ID = import.meta.env.VITE_TMDB_ACCOUNT_ID;
const LANG = 'en-US';
const V3 = '3';
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

const TMDB = applyCaseMiddleware(
  axios.create({
    baseURL: TMDB_BASE_URL,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
    },
  })
);

// TRAKT
export const TRAKT_BASE_URL = 'https://api.trakt.tv';
const USERS = 'users';
const LISTS = 'lists';
const LIST_PATH = urlJoin(USERS, ACCOUNT_ID, LISTS);

export const TRAKT = applyCaseMiddleware(
  axios.create({
    baseURL: TRAKT_BASE_URL,
    headers: getTraktHeaders(),
  })
);

export const API = {
  newList: ({
    name,
    description = '',
    privacy,
  }: NewListInput): AxiosPromise<AllLists> => {
    const body = {
      name,
      description,
      privacy,
      sort_by: 'added',
    };
    return TRAKT.post(LIST_PATH, body);
  },

  getLists: (): AxiosPromise<AllLists> =>
    TMDB.get(urlJoin(V3, 'account', TMDB_ACCOUNT_ID, 'lists')),

  // getListInfo: (listId: string): AxiosPromise<AllLists> =>
  //   TMDB.get(urlJoin(V4, 'list', listId)),

  checkIsInList: (listId: string, movieId: string): AxiosPromise<ItemPresent> =>
    TMDB.get(urlJoin(V3, 'list', listId, 'item_status'), {
      params: { movieId },
    }),
  checkListRetryUnlessNotFound: (_failureCount: number, error: AxiosError) =>
    error.response?.status !== 404,

  getListItems: (listId: string): AxiosPromise<ListContents> =>
    TMDB.get(urlJoin(V3, 'list', listId)),

  getCollection: (): AxiosPromise<MovieCollection[]> =>
    TRAKT.get('sync/collection/movies'),

  getMovieInfo: (movieId: number): AxiosPromise<TmdbMovie> =>
    TMDB.get(urlJoin(V3, MOVIE, String(movieId)), { params: TMDB_PARAMS }),

  addMovieToList: ({
    movieId,
    targetListId,
  }: ListMovieInput): AxiosPromise<EditListResponse> =>
    TMDB.post(urlJoin(V3, 'list', targetListId, 'add_item'), {
      mediaId: +movieId,
    }),

  removeMovieFromList: ({
    movieId,
    targetListId,
  }: ListMovieInput): AxiosPromise<EditListResponse> =>
    TMDB.post(urlJoin(V3, 'list', targetListId, 'remove_item'), {
      mediaId: +movieId,
    }),
  // V4
  // removeMovieFromList: ({
  //   movieId,
  //   targetListId,
  // }: ListMovieInput): AxiosPromise<EditListResponse> =>
  //   TMDB.delete(urlJoin(V3, 'list', targetListId, 'add_item'), {
  //     data: {
  //       items: [{ mediaId: +movieId }],
  //     },
  //   }),

  search: (query: string): AxiosPromise<SearchResponse> =>
    TMDB.get(urlJoin(V3, 'search', MOVIE), {
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

  getAccount: (): AxiosPromise => TMDB.get(urlJoin(V3, 'account')),
  // TRAKT.get(urlJoin(USERS, 'settings')),

  getWatchProviders: (): AxiosPromise<WatchProviderResponse> =>
    TMDB.get(urlJoin(V3, 'watch/providers', MOVIE), {
      params: {
        api_key: TMDB_API_KEY,
        language: LANG,
        watch_region: WATCH_REGION,
      },
    }),
};
