import { Avatar, Spoiler } from '@mantine/core';
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import uuid from 'react-uuid';
import { ListActions, TitleNav, WatchProviders } from '../components';
import parseMovieDetails from '../util/parseMovieDetails';

import { API } from '../util/api';
import './MovieDetails.scss';

const BACKDROP_URL = 'https://image.tmdb.org/t/p/w780';

function MovieDetails() {
  const { movieId } = useParams();
  const { data, isLoading, isError, error } = useQuery(['movie', movieId], () =>
    API.getMovieInfo(+movieId!)
  );
  const navigate = useNavigate();

  if (!movieId) {
    navigate('/');
  }

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
  console.log('🚀 ~ MovieDetails ~ movie', movie);

  const { runtime, genres, mpaaRating, trailerLink, video, actorArr } =
    parseMovieDetails(movie);

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
          providers={movie.watchProviders.results.us}
          title={movie.title}
        />
      </div>
    </>
  );
}

export default MovieDetails;
