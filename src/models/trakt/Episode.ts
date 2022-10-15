import { TraktId } from "./TraktId";

export interface Episode {
  season: number;
  number: number;
  title: string;
  ids: TraktId;
}
