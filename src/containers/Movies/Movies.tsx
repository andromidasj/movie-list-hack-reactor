import {
  Container,
  Image,
  SimpleGrid,
  Space,
  Stack,
  Title,
} from '@mantine/core';
import React from 'react';
import { Film } from 'react-bootstrap-icons';
import uuid from 'react-uuid';

import arrow from '../../assets/arrow.png';
import { MovieCard } from '../../components';
import './Movies.scss';

function Movies({ movies, list, watched, listName }) {
  if (!movies) {
    return <h3>Loading...</h3>;
  }

  // console.log('creating movieCards array...');
  const movieCards = movies.map((movie) => (
    <MovieCard
      tmdb_id={movie.movie.ids.tmdb}
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
          <Space h="14vh" />
          <Space h="sm" />
          <Container>
            <SimpleGrid cols={3} spacing="sm">
              {movieCards}
            </SimpleGrid>
            <Space h="14vh" />
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
