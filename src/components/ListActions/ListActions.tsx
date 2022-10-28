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
import { useSearchParams } from 'react-router-dom';
import { QUERY_KEYS } from '../../enums/QueryKeys';
import { SEARCH_PARAMS } from '../../enums/SearchParams';
import useChangeListItems from '../../hooks/useChangeListItems';
import { API } from '../../util/api';
import './ListActions.scss';

interface Props {
  movieId: string;
}

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

function ListActions({ movieId }: Props) {
  const [searchParams] = useSearchParams();
  const listId = searchParams.get(SEARCH_PARAMS.LIST);
  const watchedId = searchParams.get(SEARCH_PARAMS.WATCHED);
  const name = searchParams.get(SEARCH_PARAMS.NAME);

  const [confetti, setConfetti] = useState(false);

  // TODO: If no movieId, redirect

  const { mutate: addMovieToWatchlist } = useChangeListItems({
    movieId,
    targetListId: listId!,
    insertion: true,
  });
  const { mutate: markMovieWatched } = useChangeListItems({
    movieId,
    targetListId: watchedId!,
    insertion: true,
  });
  const { mutate: removeMovieFromWatchlist } = useChangeListItems({
    movieId,
    targetListId: listId!,
    insertion: false,
  });
  const { mutate: markMovieUnwatched } = useChangeListItems({
    movieId,
    targetListId: watchedId!,
    insertion: false,
  });

  const inListCheck = useQuery(
    [QUERY_KEYS.IS_IN_LIST, movieId, listId],
    () => API.checkIsInList(listId!, movieId!),
    { retry: API.checkListRetryUnlessNotFound }
  );

  const inWatchedCheck = useQuery(
    [QUERY_KEYS.IS_IN_LIST, movieId, watchedId],
    () => API.checkIsInList(watchedId!, movieId!),
    { retry: API.checkListRetryUnlessNotFound }
  );

  if (inListCheck.isLoading || inWatchedCheck.isLoading) return null;

  const inList = !!inListCheck.data?.data.itemPresent;
  const inWatched = !!inWatchedCheck.data?.data.itemPresent;

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
