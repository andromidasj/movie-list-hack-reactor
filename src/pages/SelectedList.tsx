import { Alert, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';
import { ExclamationCircle } from 'react-bootstrap-icons';
import { useSearchParams } from 'react-router-dom';
import { SearchBar, Tabs, TitleNav } from '../components';
import Movies from '../containers/Movies/Movies';
import Search from '../containers/Search/Search';
import useStore from '../store';
import { API } from '../util/api';

function SelectedList() {
  const [searchParams] = useSearchParams();
  const listId = searchParams.get('list');
  const watchedId = searchParams.get('watched');
  // TODO: If params are missing, redirect (then remove !)
  const name = searchParams.get('name')!;

  const searchQuery = useStore((state) => state.searchQuery);
  const tab = useStore((state) => state.tab);

  const {
    data: list,
    isLoading: isLoadingList,
    isError: isErrorList,
  } = useQuery(['listItems', listId], () => API.getListItems(+listId!), {
    staleTime: 1000 * 60 * 60,
  });

  const {
    data: watched,
    isLoading: isLoadingWatched,
    isError: isErrorWatched,
  } = useQuery(['listItems', watchedId], () => API.getListItems(+watchedId!), {
    staleTime: 1000 * 60 * 60,
  });

  if (isErrorList || isErrorWatched) {
    return (
      <>
        <div className="sl-top-bar-container">
          <TitleNav title={name!} />
        </div>
        <Alert
          icon={<ExclamationCircle size={16} />}
          style={{ minWidth: '100vw' }}
          title="Bummer!"
          color="red"
          variant="filled"
          radius="lg"
          className="error-notification"
        >
          Something went wrong while loading the list.
        </Alert>
      </>
    );
  }
  const listFiltered = _.orderBy(
    list?.data.filter((movie) =>
      movie.movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    'listed_at'
  );
  console.log('🚀 ~ SelectedList ~ listFiltered', listFiltered);

  const watchedFiltered = _.orderBy(
    watched?.data.filter((movie) =>
      movie.movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    'listed_at'
  );

  return (
    <>
      <div className="sl-top-bar-container">
        <TitleNav title={name!} info />
        <SearchBar />
      </div>

      {tab === 'toWatch' && (
        <>
          {isLoadingList ? (
            <Loader className="body-loader" />
          ) : (
            <Movies
              movies={listFiltered}
              list={listId}
              watched={watchedId}
              listName={name}
            />
          )}
        </>
      )}

      {tab === 'watched' && (
        <>
          {isLoadingWatched ? (
            <Loader className="body-loader" />
          ) : (
            <Movies
              movies={watchedFiltered}
              list={listId}
              watched={watchedId}
              listName={name}
            />
          )}
        </>
      )}

      {tab === 'search' && !isLoadingList && !isLoadingWatched && (
        <Search listName={name} />
      )}

      <Tabs />
    </>
  );
}

export default SelectedList;
