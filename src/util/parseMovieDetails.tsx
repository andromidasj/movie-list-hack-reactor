import uuid from 'react-uuid';
import { TmdbMovie } from '../models/tmdb/TmdbMovie';

const OFFICIAL_TEXT = 'official';
const MAX_ACTORS_TO_SHOW = 69;

export default function parseMovieDetails(movie: TmdbMovie) {
  // Sort and choose trailer
  // Sort by 1. official, 2. type, 3. official (title)
  let videoArrSorted = movie.videos.results.sort((a, b) =>
    a.official === b.official ? 0 : a.official ? -1 : 1
  );

  videoArrSorted = videoArrSorted.sort((a, b) =>
    a.type === b.type ? 0 : a.type === 'Trailer' ? -1 : 1
  );

  videoArrSorted = videoArrSorted.sort((a, b) =>
    a.name.toLowerCase().includes(OFFICIAL_TEXT)
      ? -1
      : b.name.toLowerCase().includes(OFFICIAL_TEXT)
      ? 1
      : 0
  );

  const video = videoArrSorted?.[0];
  const trailerLink = 'https://www.youtube-nocookie.com/embed/' + video?.key;

  // Cast
  const actorArr = [];
  for (
    let i = 0;
    i < Math.min(movie.credits.cast.length, MAX_ACTORS_TO_SHOW);
    i++
  ) {
    const actor = movie.credits.cast[i];
    actorArr.push(actor);
  }

  // MPAA rating & release dates
  const usReleases = movie.releaseDates.results.find(
    (e) => e.iso_3166_1 === 'US'
  )?.releaseDates;

  const mpaaRating =
    usReleases?.length || -1 > 0
      ? usReleases![usReleases!.length - 1]!.certification ||
        movie.releaseDates.results[0].releaseDates[0].certification
      : null;

  // TODO: runtime can be null
  const runtime = movie.runtime
    ? `
      ${Math.floor(movie.runtime! / 60)} hr
      ${movie.runtime! % 60} min
    `
    : 0;

  const genres = movie.genres
    .slice(0, 3)
    .map((genre) => <span key={uuid()}>{genre.name}</span>);

  return { trailerLink, mpaaRating, runtime, genres, video, actorArr };
}
