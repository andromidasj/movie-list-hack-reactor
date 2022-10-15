import axios, { AxiosResponse } from 'axios';
import applyCaseMiddleware from 'axios-case-converter';
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

const ACCOUNT_ID = JSON.parse(localStorage.getItem('user_id') || '');
const ACCESS_TOKEN = JSON.parse(localStorage.getItem('access_token') || '');
const BASE_URL = 'https://api.themoviedb.org';

const TMDB = applyCaseMiddleware(
  axios.create({
    baseURL: BASE_URL,
  })
);

export const TRAKT = applyCaseMiddleware(
  axios.create({
    baseURL: 'https://api.trakt.tv',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': process.env.REACT_APP_TRAKT_API_KEY!,
      // 'x-sort-by': 'added',
      // 'x-sort-how': 'asc',
    },
  })
);

const params = {
  language: 'en-US',
  api_key: process.env.REACT_APP_TMDB_API_KEY,
  append_to_response:
    'videos,credits,watch/providers,similar,recommendations,release_dates',
};

export const API = {
  newList: ({
    name,
    description = '',
    privacy,
  }: NewListInput): Promise<AxiosResponse<ListResult>> => {
    const body = {
      name,
      description,
      privacy,
      sort_by: 'added',
    };
    return TRAKT.post(`users/${ACCOUNT_ID}/lists`, body);
  },

  getLists: (): Promise<AxiosResponse<ListResult[]>> =>
    TRAKT.get(`users/${ACCOUNT_ID}/lists`),

  getListInfo: (listId: number): Promise<AxiosResponse<ListResult>> =>
    TRAKT.get(`users/${ACCOUNT_ID}/lists/${listId}`),

  getListItems: (listId: number): Promise<AxiosResponse<ListItems[]>> =>
    TRAKT.get(`users/${ACCOUNT_ID}/lists/${listId}/items`),

  // updateList: (listId: number) => TMDB.get(`4/list/${listId}`),

  getCollection: (): Promise<AxiosResponse<MovieCollection[]>> =>
    TRAKT.get(`sync/collection/movies`),

  getMovieInfo: (movieId: number): Promise<AxiosResponse<TmdbMovie>> =>
    TMDB.get(`3/movie/${movieId}`, {
      params,
    }),

  addMovieToList: ({
    movieId,
    listId,
  }: ListMovieInput): Promise<AxiosResponse<AddListItemsResponse>> =>
    TRAKT.post(`users/${ACCOUNT_ID}/lists/${listId}/items`, {
      movies: [{ ids: { tmdb: movieId } }],
    }),

  removeMovieFromList: ({
    movieId,
    listId,
  }: ListMovieInput): Promise<AxiosResponse<RemoveListItemsResponse>> => {
    return TRAKT.post(`users/${ACCOUNT_ID}/lists/${listId}/items/remove`, {
      movies: [{ ids: { tmdb: movieId } }],
    });
  },

  search: (query: string): Promise<AxiosResponse<SearchResponse>> =>
    TMDB.get('3/search/movie', {
      params: {
        query,
        api_key: process.env.REACT_APP_TMDB_API_KEY,
        language: 'en-US',
        page: 1,
        include_adult: false,
      },
    }),

  deleteLists: (listId: number): Promise<AxiosResponse> =>
    TRAKT.delete(`users/${ACCOUNT_ID}/lists/${listId}`),

  getStats: (): Promise<AxiosResponse<UserSettings>> => {
    console.log(TRAKT.defaults);
    return TRAKT.get('users/settings');
  },

  getWatchProviders: (): Promise<AxiosResponse<WatchProviderResponse>> =>
    TMDB.get('3/watch/providers/movie', {
      params: {
        api_key: process.env.REACT_APP_TMDB_API_KEY,
        language: 'en-US',
        watch_region: 'US',
      },
    }),
};
