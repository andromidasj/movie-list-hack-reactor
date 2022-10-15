import axios, { AxiosResponse } from "axios";
import applyCaseMiddleware from "axios-case-converter";
import { Movie, SearchResponse } from "../models/TmdbTypes";
import { ListResult } from "../models/TraktTypes";

const ACCOUNT_ID = localStorage.getItem("user_id");
const ACCESS_TOKEN = localStorage.getItem("access_token");

const TMDB = applyCaseMiddleware(
  axios.create({
    baseURL: "https://api.themoviedb.org",
    timeout: 1000,
  })
);

const TRAKT = applyCaseMiddleware(
  axios.create({
    baseURL: "https://api.trakt.tv",
    timeout: 1000,
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      "trakt-api-version": "2",
      "trakt-api-key": process.env.TRAKT_API_KEY,
      // 'x-sort-by': 'added',
      // 'x-sort-how': 'asc',
    },
  })
);

const params = {
  language: "en-US",
  api_key: process.env.TMDB_API_KEY,
  append_to_response:
    "videos,credits,watch/providers,similar,recommendations,release_dates",
};

const API = {
  newList: ({ name, desc = "", privateList }) => {
    let privacy;
    privateList ? (privacy = "private") : (privacy = "public");
    const body = {
      name,
      description: desc,
      privacy,
      sort_by: "added",
    };
    privateList ? (body.privacy = "private") : (body.privacy = "public");
    return TRAKT.post(`users/${ACCOUNT_ID}/lists`, body);
  },

  getLists: (): Promise<AxiosResponse<ListResult>> =>
    TRAKT.get(`users/${ACCOUNT_ID}/lists`),

  getListInfo: (listId: number): Promise<AxiosResponse<ListResult>> =>
    TRAKT.get(`users/${ACCOUNT_ID}/lists/${listId}`),

  getListItems: (listId) =>
    TRAKT.get(`users/${ACCOUNT_ID}/lists/${listId}/items`),

  // updateList: (listId: number) => TMDB.get(`4/list/${listId}`),

  getCollection: () => TRAKT.get(`sync/collection/movies`),

  getMovieInfo: (movieId: number): Promise<AxiosResponse<Movie>> =>
    TMDB.get(`3/movie/${movieId}`, {
      params,
    }),

  addMovieToList: ({ movieId, listId }) => {
    // console.log('🚀 ~ addMovieToList ~ movieId', movieId)
    // console.log('🚀 ~ addMovieToList ~ listId', listId)
    return TRAKT.post(`users/${ACCOUNT_ID}/lists/${listId}/items`, {
      movies: [
        {
          ids: {
            tmdb: movieId,
          },
        },
      ],
    });
  },
  removeMovieFromList: ({ movieId, listId }) => {
    return TRAKT.post(`users/${ACCOUNT_ID}/lists/${listId}/items/remove`, {
      movies: [
        {
          ids: {
            tmdb: movieId,
          },
        },
      ],
    });
  },

  search: (query: string): Promise<AxiosResponse<SearchResponse>> => {
    return TMDB.get("3/search/movie", {
      params: {
        query,
        api_key: "6510d49734ddf67fe88d4fb506250046",
        language: "en-US",
        page: 1,
        include_adult: false,
      },
    });
  },

  deleteLists: (listId) => {
    return TRAKT.delete(`users/${ACCOUNT_ID}/lists/${listId}`);
  },
  getStats: () => TRAKT.get("users/settings"),

  getWatchProviders: () =>
    TMDB.get("3/watch/providers/movie", {
      params: {
        api_key: "6510d49734ddf67fe88d4fb506250046",
        language: "en-US",
        watch_region: "US",
      },
    }),
};

export default API;
