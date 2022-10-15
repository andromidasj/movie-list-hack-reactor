import { TraktId } from "./TraktId";

export interface Movie {
  title: string;
  year: number;
  ids: TraktId;
}
