import { Added, Existing, List, NotFound } from "./ListChange";

export interface AddListItemsResponse {
  added: Added;
  existing: Existing;
  notFound: NotFound;
  list: List;
}
