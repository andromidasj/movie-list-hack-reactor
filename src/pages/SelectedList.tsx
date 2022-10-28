import { Alert, Loader } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { ExclamationCircle } from 'react-bootstrap-icons';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';
import Tabs from '../components/Tabs/Tabs';
import TitleNav from '../components/TitleNav/TitleNav';
import Movies from '../containers/Movies';
import Search from '../containers/Search';
import { QUERY_KEYS } from '../enums/QueryKeys';
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
  } = useQuery([QUERY_KEYS.LIST_ITEMS, listId], () =>
    API.getListItems(listId!)
  );

  const {
    data: watched,
    isLoading: isLoadingWatched,
    isError: isErrorWatched,
  } = useQuery([QUERY_KEYS.LIST_ITEMS, watchedId], () =>
    API.getListItems(watchedId!)
  );

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

  const listFiltered = list?.data.items.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const watchedFiltered = watched?.data.items.filter((movie) =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
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
              movies={listFiltered!}
              list={listId!}
              watched={watchedId!}
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
              movies={watchedFiltered!}
              list={listId!}
              watched={watchedId!}
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
