import { SearchResult } from "./SearchResult";

export interface SearchResponse {
  page: number;
  results: SearchResult[];
  totalResults: number;
  totalPages: number;
}
