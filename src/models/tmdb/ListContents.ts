import { TmdbMovie } from './TmdbMovie';

interface CreatedBy {
  gravatarHash: string;
  name: string;
  username: string;
}

export interface ListContents {
  posterPath: string;
  id: number;
  backdropPath: string;
  totalResults: number;
  public: boolean;
  revenue: string;
  page: number;
  results: TmdbMovie[];
  objectIds: Object;
  iso6391: string;
  totalPages: number;
  description: string;
  createdBy: CreatedBy;
  iso31661: string;
  averageRating: number;
  runtime: number;
  name: string;
  comments: Object;
}
