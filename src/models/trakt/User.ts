import { TraktId } from "./TraktId";

export interface UserSettings {
  user: User;
  account: Account;
  connections: Connections;
  sharingText: SharingText;
  limits: Limits;
}

export interface User {
  username: string;
  private: boolean;
  name: string;
  vip: boolean;
  vipEp: boolean;
  ids: TraktId;
  joinedAt: string;
  location: string;
  about: string;
  gender: string;
  age: number;
  images: Images;
  vipOg: boolean;
  vipYears: number;
}

interface Images {
  avatar: Avatar;
}

interface Avatar {
  full: string;
}

interface Account {
  timezone: string;
  dateFormat: string;
  time24hr: boolean;
  coverImage: string;
}

interface Connections {
  facebook: boolean;
  twitter: boolean;
  google: boolean;
  tumblr: boolean;
  medium: boolean;
  slack: boolean;
  apple: boolean;
}

interface SharingText {
  watching: string;
  watched: string;
  rated: string;
}

interface Limits {
  list: List;
  watchlist: Watchlist;
  recommendations: Recommendations;
}

interface List {
  count: number;
  itemCount: number;
}

interface Watchlist {
  itemCount: number;
}

interface Recommendations {
  itemCount: number;
}
