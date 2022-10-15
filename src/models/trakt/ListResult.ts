import { TraktId } from "./TraktId";
import { User } from "./User";

export interface ListResult {
  name: string;
  description: string;
  privacy: string;
  type: string;
  displayNumbers: boolean;
  allowComments: boolean;
  sortBy: string;
  sortHow: string;
  createdAt: Date;
  updatedAt: Date;
  itemCount: number;
  commentCount: number;
  likes: number;
  ids: TraktId;
  user?: User;
}
