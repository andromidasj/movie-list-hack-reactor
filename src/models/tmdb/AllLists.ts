// V3
interface Result {
  description: string;
  favoriteCount: number;
  id: number;
  itemCount: number;
  iso6391: string;
  listType: string;
  name: string;
  posterPath?: string;
}

export interface AllLists {
  page: number;
  results: Result[];
  totalPages: number;
  totalResults: number;
}

// V4
// interface Result {
//   accountObjectId: string;
//   id: number;
//   featured: number;
//   description: string;
//   revenue: string;
//   public: number;
//   name: string;
//   updatedAt: string;
//   createdAt: string;
//   sortBy: number;
//   backdropPath: string;
//   runtime: number;
//   averageRating: number;
//   iso_3166_1: string;
//   adult: number;
//   numberOfItems: number;
//   posterPath: string;
// }

// export interface AllLists {
//   page: number;
//   totalResults: number;
//   totalPages: number;
//   results: Result[];
// }
