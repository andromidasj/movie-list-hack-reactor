interface Result {
  description: string;
  favoriteCount: number;
  id: number;
  itemCount: number;
  iso6391: string;
  listType: string;
  name: string;
  posterPath?: any;
}

export interface AllLists {
  page: number;
  results: Result[];
  totalPages: number;
  totalResults: number;
}
