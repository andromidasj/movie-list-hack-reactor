import { AspectRatio, Image, Text } from '@mantine/core';
import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';

import API from '../../util/api';
import './MovieCard.scss';

function MovieCard({ tmdb_id, title, year, list, watched, listName }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });
  const POSTER_PATH = 'https://www.themoviedb.org/t/p/w342';

  const { data, isError, isLoading } = useQuery(
    [tmdb_id],
    () => API.getMovieInfo(tmdb_id),
    { enabled: inView }
  );

  if (isLoading || isError) {
    return (
      <AspectRatio ratio={2 / 3}>
        <Image withPlaceholder />
      </AspectRatio>
    );
  }

  // inView && console.log(`${title} in view`);

  return (
    <Link
      to={`/movie/${data?.data?.id}?list=${list}&watched=${watched}&name=${listName}`}
      className="movie-card"
    >
      <AspectRatio ratio={2 / 3}>
        <Image
          src={POSTER_PATH + data?.data?.poster_path}
          alt="poster"
          radius="md"
          loading="lazy"
          ref={ref}
          withPlaceholder
        />
      </AspectRatio>
      <Text
        transform="uppercase"
        align="center"
        size="xs"
        py={5}
      >{`${title} (${year})`}</Text>
    </Link>
  );
}

export default MovieCard;
