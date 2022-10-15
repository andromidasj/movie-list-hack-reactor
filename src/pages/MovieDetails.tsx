import { Avatar, Spoiler } from '@mantine/core';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import { ListActions, TitleNav, WatchProviders } from '../components';

import { API } from '../util/api';
import './MovieDetails.scss';

const BACKDROP_URL = 'https://image.tmdb.org/t/p/w780';

function MovieDetails() {
  const { movieId } = useParams();
  const { data, isLoading, isError, error } = useQuery(['movie', movieId], () =>
    API.getMovieInfo(+movieId!)
  );

  // TODO: If movieId is missing, redirect

  if (isLoading) {
    return (
      <>
        <TitleNav title={movieId!} />
        <div
          className="md-backdrop-container loading"
          style={{ opacity: 0.25 }}
        />
      </>
    );
  }

  if (isError) return <p>{JSON.stringify(error)}</p>;

  const movie = data!.data;

  // TODO: extract to util fn
  // Sort by 1. official, 2. type, 3. official (title)
  let videoArrSorted = movie.videos.results.sort((a, b) => {
    return a.official === b.official ? 0 : a.official ? -1 : 1;
  });

  videoArrSorted = videoArrSorted.sort((a, b) => {
    return a.type === b.type ? 0 : a.type === 'Trailer' ? -1 : 1;
  });

  videoArrSorted = videoArrSorted.sort((a, b) => {
    return a.name.toLowerCase().includes('official')
      ? -1
      : b.name.toLowerCase().includes('official')
      ? 1
      : 0;
  });
  //

  const video = videoArrSorted?.[0];
  const trailerLink = 'https://www.youtube.com/embed/' + video?.key;

  const actorArr = [];
  for (let i = 0; i < 60; i++) {
    const actor = movie.credits.cast[i];
    if (!actor) {
      break;
    }
    actorArr.push(actor);
  }

  const usRating = movie.releaseDates.results.find((e) => e.iso31661 === 'US');

  const mpaaRating =
    usRating?.releaseDates[usRating.releaseDates.length - 1].certification ||
    movie.releaseDates.results[0].releaseDates[0].certification;

  // TODO: runtime can be null
  const runtime = `
      ${Math.floor(movie.runtime! / 60)} hr
      ${movie.runtime! % 60} min
    `;

  const genres = movie.genres
    .slice(0, 3)
    .map((genre) => <span key={uuid()}>{genre.name}</span>);

  // const watchProviders = movie['watch/providers'].results.US;

  // const recommendedMoviesArr = [];
  // for (let i = 0; i < 10; i++) {
  //   recommendedMoviesArr.push(movie.recommendations.results[i])
  // }
  // console.log('recommendedMoviesArr', recommendedMoviesArr);

  return (
    <>
      <TitleNav title={movie.title} />
      <div className="md-backdrop-container">
        <img
          className="md-backdrop"
          alt="backdrop"
          src={BACKDROP_URL + movie.backdropPath}
        />
        <div className="md-inner-backdrop-info">
          <div className="md-runtime-container">
            <span className="md-rating">{mpaaRating}</span>
            <span>{runtime}</span>
          </div>
          <div className="md-genre-container">{genres}</div>
        </div>
      </div>
      <div className="md-body-container">
        <Spoiler
          maxHeight={76}
          showLabel="Show more"
          hideLabel="Hide"
          className="spoiler-container"
        >
          <p>{movie.overview}</p>
        </Spoiler>
        <ListActions />
        {video && (
          <iframe src={trailerLink} title="movie trailer" className="trailer" />
        )}
        <div className="md-actor-container">
          {actorArr.map((actor) => (
            <div className="actor-card" key={uuid()}>
              <Avatar
                src={
                  actor
                    ? `https://image.tmdb.org/t/p/w342${actor.profilePath}`
                    : ''
                }
                className="actor-avatar"
                radius="xl"
                size="lg"
              />
              <p className="actor-name">{actor?.originalName}</p>
              <p className="character-name">{actor?.character}</p>
            </div>
          ))}
        </div>

        <WatchProviders
          providers={movie['watch/providers'].results.US}
          title={movie.title}
        />
      </div>
    </>
  );
}

export default MovieDetails;
