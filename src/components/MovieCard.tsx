import { AspectRatio, Image, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { createSearchParams, Link } from 'react-router-dom';
import urlJoin from 'url-join';
import { QUERY_KEYS } from '../enums/QueryKeys';
import { API } from '../util/api';

interface MovieCardProps {
  tmdbId: number;
  title: string;
  year: string;
  list: string;
  watched: string;
  listName: string;
}

const MOVIE_PATH = '/movie';
const POSTER_PATH = 'https://www.themoviedb.org/t/p/w342';
const IMG_RATIO = 2 / 3;

function MovieCard({
  tmdbId,
  title,
  year,
  list,
  watched,
  listName,
}: MovieCardProps) {
  const { ref, entry } = useInView({ triggerOnce: true });

  const { data } = useQuery(
    [QUERY_KEYS.MOVIE, tmdbId],
    () => API.getMovieInfo(tmdbId),
    { enabled: !!entry?.isIntersecting }
  );

  if (data) {
    const movie = data!.data;
    const pathname = urlJoin(MOVIE_PATH, movie.id.toString());
    const search = createSearchParams({
      list,
      watched,
      name: listName,
    }).toString();

    return (
      <Link to={{ pathname, search }} style={{ textDecoration: 'none' }}>
        <Image
          radius="md"
          alt={`${movie.title} movie poster`}
          withPlaceholder
          ref={ref}
          src={urlJoin(POSTER_PATH, movie.posterPath!)}
        />
        <Text
          color="white"
          transform="uppercase"
          align="center"
          size="xs"
          py={5}
        >
          {title} ({year})
        </Text>
      </Link>
    );
  }

  return (
    <AspectRatio ratio={IMG_RATIO}>
      <Image
        ref={ref}
        src={null}
        alt="With default placeholder"
        withPlaceholder
        height={167}
      />
    </AspectRatio>
  );
}

export default MovieCard;
