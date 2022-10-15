import { Genre } from './Genre';
import { ProductionCompany } from './ProductionCompany';
import { ProductionCountry } from './ProductionCountry';
import { SpokenLanguage } from './SpokenLanguage';

export interface TmdbMovie {
  adult: boolean;
  backdropPath: string | null;
  belongsToCollection: null | object;
  budget: number;
  genres: Genre[];
  homepage: string | null;
  id: number;
  imdbId: string | null;
  originalLanguage: string;
  originalTitle: string;
  overview: string | null;
  popularity: number;
  posterPath: any | null;
  productionCompanies: ProductionCompany[];
  productionCountries: ProductionCountry[];
  releaseDate: string;
  revenue: number;
  runtime: number | null;
  spokenLanguages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
  videos: Videos;
  watchProviders: WatchProviders;
  releaseDates: ReleaseDates;
  recommendations: Recommendations;
  credits: Credits;
  similar: Similar;
}

// appendedValues

interface Videos {
  results: Video[];
}

interface Video {
  iso6391: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  publishedAt: string;
  id: string;
}

interface ReleaseDates {
  results: ReleaseDateResult[];
}

interface ReleaseDateResult {
  iso_3166_1: string;
  releaseDates: ReleaseDate[];
}

interface ReleaseDate {
  certification: string;
  iso6391: string;
  note?: string;
  releaseDate: string;
  type: number;
}

interface Recommendations {
  page: number;
  results: Recommendation[];
  totalPages: number;
  totalResults: number;
}

export interface Recommendation {
  adult: boolean;
  backdropPath: string;
  id: number;
  title: string;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  mediaType: string;
  genreIds: number[];
  popularity: number;
  releaseDate: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
}

interface Credits {
  cast: Cast[];
  crew: Crew[];
}

interface Cast {
  adult: boolean;
  gender: number;
  id: number;
  knownForDepartment: string;
  name: string;
  originalName: string;
  popularity: number;
  profilePath?: string;
  castId: number;
  character: string;
  creditId: string;
  order: number;
}

interface Crew {
  adult: boolean;
  gender: number;
  id: number;
  knownForDepartment: string;
  name: string;
  originalName: string;
  popularity: number;
  profilePath?: string;
  creditId: string;
  department: string;
  job: string;
}

interface Similar {
  page: number;
  results: SimilarResult[];
  totalPages: number;
  totalResults: number;
}

interface SimilarResult {
  adult: boolean;
  backdropPath: string;
  genreIds: number[];
  id: number;
  originalLanguage: string;
  originalTitle: string;
  overview: string;
  popularity: number;
  posterPath: string;
  releaseDate: string;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
}

interface WatchProviders {
  results: WPResults;
}

interface WPResults {
  us: Us;
}

interface Us {
  link: string;
  rent: Rent[];
  buy: Buy[];
  flatrate: Flatrate[];
}

interface Rent {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

interface Buy {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

interface Flatrate {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}
