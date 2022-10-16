import { AspectRatio, Image, Text } from '@mantine/core';
import { useIntersection } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { createSearchParams, Link } from 'react-router-dom';
import urlJoin from 'url-join';
import { API } from '../util/api';

interface MovieCardProps {
  tmdbId: number;
  title: string;
  year: string;
  // TODO: specify types
  list: any;
  watched: any;
  listName: string;
}

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
  const { ref, entry } = useIntersection({ threshold: 0 });

  const { data } = useQuery(['movie', tmdbId], () => API.getMovieInfo(tmdbId), {
    enabled: !!entry?.isIntersecting,
  });

  if (data) {
    const movie = data!.data;
    const pathname = urlJoin('/movie', movie.id.toString());
    const search = createSearchParams({
      list,
      watched,
      name: listName,
    }).toString();

    return (
      <Link to={{ pathname, search }} style={{ textDecoration: 'none' }}>
        <AspectRatio ratio={IMG_RATIO}>
          <Image
            ref={ref}
            src={urlJoin(POSTER_PATH, movie.posterPath)}
            alt="poster"
            radius="md"
            withPlaceholder
          />
        </AspectRatio>
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
