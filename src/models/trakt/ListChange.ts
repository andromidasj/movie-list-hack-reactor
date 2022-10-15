import { Movie } from "./Movie";

export interface Added {
  movies?: number;
  shows?: number;
  seasons?: number;
  episodes?: number;
  people?: number;
}

export interface Existing {
  movies?: number;
  shows?: number;
  seasons?: number;
  episodes?: number;
  people?: number;
}

export interface NotFound {
  movies?: Movie[];
  shows?: any[];
  seasons?: any[];
  episodes?: any[];
  people?: any[];
}

export interface List {
  updatedAt: string;
  itemCount: number;
}

export interface Deleted {
  movies: number;
  shows: number;
  seasons: number;
  episodes: number;
  people: number;
}
