import { TmdbMovie } from './TmdbMovie';

// V3
export interface ListContents {
  createdBy: string;
  description: string;
  favoriteCount: number;
  id: string;
  iso_639_1: string;
  itemCount: number;
  items: TmdbMovie[];
  name: string;
  posterPath: string;
}

// V4
// interface CreatedBy {
//   gravatarHash: string;
//   name: string;
//   username: string;
// }

// export interface ListContents {
//   posterPath: string;
//   id: number;
//   backdropPath: string;
//   totalResults: number;
//   public: boolean;
//   revenue: string;
//   page: number;
//   results: TmdbMovie[];
//   objectIds: Object;
//   iso6391: string;
//   totalPages: number;
//   description: string;
//   createdBy: CreatedBy;
//   iso31661: string;
//   averageRating: number;
//   runtime: number;
//   name: string;
//   comments: Object;
// }
