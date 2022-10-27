import { Button, CSSObject, Group, MantineTheme, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
  Bookmark,
  BookmarkFill,
  CheckCircle,
  CheckCircleFill,
} from 'react-bootstrap-icons';
import Confetti from 'react-dom-confetti';
import { useParams, useSearchParams } from 'react-router-dom';
import { QUERY_KEYS } from '../../enums/QueryKeys';
import { SEARCH_PARAMS } from '../../enums/SearchParams';
import useAddMovieToList from '../../hooks/useAddMovieToList';
import useRemoveMovieFromList from '../../hooks/useRemoveMovieFromList';
import { API } from '../../util/api';
import './ListActions.scss';

const activeButtonRoot: CSSObject = {
  height: 60,
  ':active': {
    scale: '95%',
    opacity: 0.5,
  },
};

const DISABLED_BUTTON_COLOR = 'black';

const disabledButtonStyle = (theme: MantineTheme) => ({
  leftIcon: { color: theme.colors.blue[4] },
  root: {
    ...activeButtonRoot,
    ':active': { ...activeButtonRoot, backgroundColor: DISABLED_BUTTON_COLOR },
    backgroundColor: DISABLED_BUTTON_COLOR,
  },
});

function ListActions() {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const listId = searchParams.get(SEARCH_PARAMS.LIST);
  const watchedId = searchParams.get(SEARCH_PARAMS.WATCHED);
  const name = searchParams.get(SEARCH_PARAMS.NAME);
  const [confetti, setConfetti] = useState(false);

  // TODO: If no movieId, redirect

  const getList = useQuery([QUERY_KEYS.LIST_ITEMS, listId], () =>
    API.getListItems(+listId!)
  );

  const getWatched = useQuery([QUERY_KEYS.LIST_ITEMS, watchedId], () =>
    API.getListItems(+watchedId!)
  );

  const movieAndList = {
    movieId: movieId!,
    targetListId: listId!,
  };
  const movieAndWatched = {
    movieId: movieId!,
    targetListId: watchedId!,
  };

  const { mutate: addMovieToWatchlist } = useAddMovieToList(movieAndList);
  const { mutate: markMovieWatched } = useAddMovieToList(movieAndWatched);

  const { mutate: removeMovieFromWatchlist } =
    useRemoveMovieFromList(movieAndList);
  const { mutate: markMovieUnwatched } =
    useRemoveMovieFromList(movieAndWatched);

  if (getList.isLoading || getWatched.isLoading) return null;

  if (getList.isError || getWatched.isError) {
    return <h1>{`Error ${getList.error || getWatched.error}`}</h1>;
  }

  const inList = getList.data!.data.find(
    (movie) => movie.movie.ids.tmdb === Number(movieId)
  );

  const inWatched = getWatched.data!.data.find(
    (movie) => movie.movie.ids.tmdb === Number(movieId)
  );

  const toggleConfetti = () => {
    setConfetti(true);
    setTimeout(() => {
      setConfetti(false);
    }, 2000);
  };

  const markAsWatched = () => {
    markMovieWatched();
    !!inList && removeMovieFromWatchlist();
    toggleConfetti();
  };

  return (
    <>
      <Title order={5} align="center" transform="uppercase" mt={10}>
        {name}
      </Title>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Confetti active={confetti} />
      </div>

      <Group grow position="apart" my={15}>
        {inList ? (
          <Button
            size="lg"
            radius="md"
            leftIcon={<BookmarkFill />}
            onClick={() => removeMovieFromWatchlist()}
            sx={activeButtonRoot}
          >
            Watchlist
          </Button>
        ) : (
          <Button
            size="lg"
            radius="md"
            leftIcon={<Bookmark />}
            onClick={() => addMovieToWatchlist()}
            styles={disabledButtonStyle}
          >
            Add to List
          </Button>
        )}
        {inWatched ? (
          <Button
            size="lg"
            radius="md"
            leftIcon={<CheckCircleFill />}
            onClick={() => markMovieUnwatched()}
            sx={activeButtonRoot}
          >
            Watched
          </Button>
        ) : (
          <Button
            size="lg"
            radius="md"
            leftIcon={<CheckCircle />}
            onClick={markAsWatched}
            styles={disabledButtonStyle}
          >
            Unwatched
          </Button>
        )}
      </Group>
    </>
  );
}

export default ListActions;
