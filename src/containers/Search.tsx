/* eslint-disable array-callback-return */
import { Container, SimpleGrid } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import uuid from 'react-uuid';
import MovieCard from '../components/MovieCard';
import { QUERY_KEYS } from '../enums/QueryKeys';
import { SEARCH_PARAMS } from '../enums/SearchParams';
import useStore from '../store';
import { API } from '../util/api';

interface SearchProps {
  listName: string;
}

function Search({ listName }: SearchProps) {
  const [searchParams] = useSearchParams();
  const listId = searchParams.get(SEARCH_PARAMS.LIST);
  const watchedId = searchParams.get(SEARCH_PARAMS.WATCHED);

  const searchQuery = useStore((state) => state.searchQuery);
  const [debouncedQuery] = useDebouncedValue(searchQuery, 500);

  const { data, isLoading, isError } = useQuery(
    [QUERY_KEYS.SEARCH, debouncedQuery],
    () => API.search(debouncedQuery),
    { enabled: debouncedQuery.length > 0 }
  );

  if (isLoading) return <h1>Loading</h1>;

  if (isError) return <h1>Error</h1>;

  return (
    <>
      {data && (
        <>
          <Container mt={135}>
            <SimpleGrid cols={3}>
              {data.data.results.map((movie) => {
                if (movie.posterPath) {
                  return (
                    <MovieCard
                      tmdbId={movie.id}
                      title={movie.title}
                      year={movie.releaseDate?.substring(0, 4)}
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
