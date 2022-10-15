export interface ListId {
  trakt: number;
  slug: string;
}

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
  ids: ListId;
  user?: User;
}

export interface Ids2 {
  slug: string;
}

export interface User {
  username: string;
  private: boolean;
  name: string;
  vip: boolean;
  vipEp: boolean;
  ids: Ids2;
}
