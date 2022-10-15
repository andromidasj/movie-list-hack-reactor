import { Deleted, List, NotFound } from "./ListChange";

export interface RemoveListItemsResponse {
  deleted: Deleted;
  notFound: NotFound;
  list: List;
}
