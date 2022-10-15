import { Movie } from "./Movie";

export interface MovieCollection {
  collectedAt: Date;
  updatedAt: Date;
  movie: Movie;
}
