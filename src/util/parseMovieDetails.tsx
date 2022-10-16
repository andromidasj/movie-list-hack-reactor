import uuid from 'react-uuid';
import { TmdbMovie } from '../models/tmdb/TmdbMovie';

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
    a.name.toLowerCase().includes('official')
      ? -1
      : b.name.toLowerCase().includes('official')
      ? 1
      : 0
  );

  const video = videoArrSorted?.[0];
  const trailerLink = 'https://www.youtube.com/embed/' + video?.key;

  // Cast
  const actorArr = [];
  for (let i = 0; i < 60; i++) {
    const actor = movie.credits.cast[i];
    if (!actor) break;
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
  const runtime = `
      ${Math.floor(movie.runtime! / 60)} hr
      ${movie.runtime! % 60} min
    `;

  const genres = movie.genres
    .slice(0, 3)
    .map((genre) => <span key={uuid()}>{genre.name}</span>);

  return { trailerLink, mpaaRating, runtime, genres, video, actorArr };
}
