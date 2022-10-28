import { Episode } from './Episode';
import { Movie } from './Movie';
import { Person } from './Person';
import { Season } from './Season';
import { Show } from './Show';

export interface ListItems {
  rank: number;
  id: number;
  listedAt: Date;
  type: string;
  movie: Movie;
  show?: Show;
  season?: Season;
  episode?: Episode;
  person?: Person;
}

export interface ItemPresent {
  id?: number | null;
  itemPresent: boolean;
}

export function createListItem(id: number): ListItems {
  return {
    rank: 0,
    id: 0,
    listedAt: new Date(),
    type: '',
    movie: {
      title: '',
      year: 2000,
      ids: { uuid: '', tmdb: id },
    },
  };
}
