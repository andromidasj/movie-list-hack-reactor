import { Episode } from "./Episode";
import { Movie } from "./Movie";
import { Person } from "./Person";
import { Season } from "./Season";
import { Show } from "./Show";

export interface ListItems {
  rank: number;
  id: number;
  listedAt: Date;
  type: string;
  movie: Movie;
  show: Show;
  season: Season;
  episode: Episode;
  person: Person;
}
