export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logoPath: string;
  name: string;
  originCountry: string;
}

export interface ProductionCountry {
  iso31661: string;
  name: string;
}

export interface SpokenLanguage {
  iso6391: string;
  name: string;
}

export interface Movie {
  adult: boolean;
  backdropPath: string | null;
  belongsToCollection: null | object;
  budget: number;
  genres: [Genre];
  homepage: string | null;
  id: number;
  imdbId: string | null;
  originalLanguage: string;
  originalTitle: string;
  overview: string | null;
  popularity: number;
  posterPath: any | null;
  productionCompanies: [ProductionCompany];
  productionCountries: [ProductionCountry];
  releaseDate: string;
  revenue: number;
  runtime: number | null;
  spokenLanguages: [SpokenLanguage];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  voteAverage: number;
  voteCount: number;
}

export interface SearchResult {
  posterPath: string | null;
  adult: boolean;
  overview: string;
  releaseDate: string;
  genreIds: [number];
  id: number;
  originalTitle: string;
  originalLanguage: string;
  title: string;
  backdropPath: string | null;
  popularity: number;
  voteCount: number;
  video: boolean;
  voteAverage: number;
}

export interface SearchResponse {
  page: number;
  results: [SearchResult];
  totalResults: number;
  totalPages: number;
}

export interface WatchProviderResult {
  iso31661: string;
  englishName: string;
  nativeName: string;
}

export interface WatchProviderResponse {
  results: [WatchProviderResult];
}
