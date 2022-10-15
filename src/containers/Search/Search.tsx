import { Container, SimpleGrid, Space } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import uuid from 'react-uuid';
import { MovieCard } from '../../components';
import useStore from '../../store';
import { API } from '../../util/api';
import './Search.scss';

interface SearchProps {
  listName: string;
}

function Search({ listName }: SearchProps) {
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
          {/* TODO: change to vh:14 */}
          <Space h={50} />
          <Space h="sm" />
          <Container>
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
