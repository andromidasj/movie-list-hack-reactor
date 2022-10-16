import { AspectRatio, Image, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { createSearchParams, Link } from 'react-router-dom';
import { API } from '../../util/api';
import './MovieCard.scss';

interface MovieCardProps {
  tmdbId: number;
  title: string;
  year: string;
  // TODO: specify types
  list: any;
  watched: any;
  listName: string;
}

function MovieCard({
  tmdbId,
  title,
  year,
  list,
  watched,
  listName,
}: MovieCardProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
  });
  // console.log('🚀 ~ inView', title, inView.valueOf());
  const POSTER_PATH = 'https://www.themoviedb.org/t/p/w342';

  const { data, isError, isLoading } = useQuery(
    ['movie', tmdbId],
    () => API.getMovieInfo(tmdbId)
    // { enabled: inView }
  );

  if (isLoading || isError) {
    return (
      <AspectRatio ratio={2 / 3}>
        <Image withPlaceholder />
      </AspectRatio>
    );
  }

  const movie = data.data;

  return (
    <Link
      // `/movie/${movie?.id}?list=${list}&watched=${watched}&name=${listName}`
      to={{
        pathname: `/movie/${movie?.id}`,
        search: createSearchParams({
          list,
          watched,
          name: listName,
        }).toString(),
      }}
      className="movie-card"
    >
      <AspectRatio ratio={2 / 3}>
        <Image
          ref={ref}
          src={POSTER_PATH + movie?.posterPath}
          alt="poster"
          radius="md"
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
