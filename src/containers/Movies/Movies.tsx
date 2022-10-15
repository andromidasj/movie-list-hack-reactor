import {
  Container,
  Image,
  SimpleGrid,
  Space,
  Stack,
  Title,
} from '@mantine/core';
import { Film } from 'react-bootstrap-icons';
import uuid from 'react-uuid';
import arrow from '../../assets/arrow.png';
import { MovieCard } from '../../components';
import './Movies.scss';

interface MoviesProps {
  // TODO: specify types
  movies: any;
  list: any;
  watched: any;
  listName: string;
}

function Movies({ movies, list, watched, listName }: MoviesProps) {
  if (!movies) {
    return <h3>Loading...</h3>;
  }

  // console.log('creating movieCards array...');
  // TODO: specify type
  const movieCards = movies.map((movie: any) => (
    <MovieCard
      tmdbId={movie.movie.ids.tmdb}
      title={movie.movie.title}
      year={movie.movie.year}
      list={list}
      watched={watched}
      key={uuid()}
      listName={listName}
    />
  ));
  // console.log('🚀 ~ Movies ~ movieCards', movieCards);

  return (
    <>
      {movies.length ? (
        <>
          {/* TODO: was h="14vh" */}
          <Space h={50} />
          <Space h="sm" />
          <Container>
            <SimpleGrid cols={3} spacing="sm">
              {movieCards}
            </SimpleGrid>
            <Space h={50} />
          </Container>
        </>
      ) : (
        <Stack
          align="center"
          style={{
            height: '100vh',
            justifyContent: 'center',
            opacity: 0.5,
            zIndex: 0,
          }}
        >
          <Film size={80} />
          <Space />
          <Title order={2}>No movies. </Title>
          <Title order={3}>Search one?</Title>
          <Image
            src={arrow}
            height={200}
            fit="contain"
            style={{
              marginRight: -40,
              marginTop: 40,
              opacity: 0.5,
            }}
          />
        </Stack>
      )}
    </>
  );
}

export default Movies;
