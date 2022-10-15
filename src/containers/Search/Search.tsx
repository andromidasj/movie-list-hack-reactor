import { Container, SimpleGrid, Space } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import React from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import uuid from 'react-uuid';
import { MovieCard } from '../../components';
import useStore from '../../store';
import API from '../../util/api';
import './Search.scss';

function Search({ listName }) {
  const [searchParams] = useSearchParams();
  const listId = searchParams.get('list');
  const watchedId = searchParams.get('watched');

  const searchQuery = useStore((state) => state.searchQuery);
  const [debouncedQuery] = useDebouncedValue(searchQuery, 500);

  const { data, isLoading, isError } = useQuery(
    ['search', debouncedQuery],
    () => API.search(debouncedQuery),
    { enabled: debouncedQuery.length > 0 }
  );

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  if (isError) {
    return <h1>Error</h1>;
  }

  return (
    <>
      {data && (
        <>
          <Space h="14vh" />
          <Space h="sm" />
          <Container>
            <SimpleGrid cols={3}>
              {data.data.results.map((movie) => {
                if (movie.poster_path) {
                  return (
                    <MovieCard
                      tmdb_id={movie.id}
                      title={movie.title}
                      year={movie.release_date?.substring(0, 4)}
                      list={listId}
                      watched={watchedId}
                      key={uuid()}
                      listName={listName}
                    />
                  );
                }
              })}
            </SimpleGrid>
          </Container>
        </>
      )}
    </>
  );
}

export default Search;
