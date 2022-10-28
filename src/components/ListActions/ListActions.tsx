import { Button, CSSObject, Group, MantineTheme, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
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
  const [inList2, setInList2] = useState(false);
  const [inWatched2, setInWatched2] = useState(false);

  // TODO: If no movieId, redirect

  useEffect(() => {
    async function checkListStatus() {
      try {
        const resList = await API.checkIsInList(listId!, movieId!);
        console.log('🚀 ~ checkListStatus ~ resList', resList);
        if (resList.data.success) {
          setInList2(true);
        }
      } catch (err) {}

      try {
        const resWatched = await API.checkIsInList(watchedId!, movieId!);
        console.log('🚀 ~ checkListStatus ~ resWatched', resWatched);
        if (resWatched.data.success) {
          setInWatched2(true);
        }
      } catch (err) {}
    }
    checkListStatus();
  });

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

  const inListCheck = useQuery(
    [QUERY_KEYS.IS_IN_LIST, movieId, listId],
    () => API.checkIsInList(listId!, movieId!),
    { retry: false }
  );

  const inWatchedCheck = useQuery(
    [QUERY_KEYS.IS_IN_LIST, movieId, watchedId],
    () => API.checkIsInList(watchedId!, movieId!),
    { retry: false }
  );

  if (inListCheck.isLoading || inWatchedCheck.isLoading) return null;

  const inList = !!inListCheck.data;
  const inWatched = !!inWatchedCheck.data;

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
