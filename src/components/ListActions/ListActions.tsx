import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Bookmark,
  BookmarkFill,
  CheckCircle,
  CheckCircleFill,
} from 'react-bootstrap-icons';
import { useParams, useSearchParams } from 'react-router-dom';
import { API } from '../../util/api';
import './ListActions.scss';

function ListActions() {
  const queryClient = useQueryClient();
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const listId = searchParams.get('list');
  const watchedId = searchParams.get('watched');
  const name = searchParams.get('name');

  // TODO: If no movieId, redirect

  const getList = useQuery(['list', listId], () => API.getListItems(+listId!));

  const getWatched = useQuery(['list', watchedId], () =>
    API.getListItems(+watchedId!)
  );

  const mutationSideEffects = {
    onSuccess: () => {
      queryClient.invalidateQueries(['list']);
      queryClient.invalidateQueries(['listItems']);
    },
  };

  const addMovie = useMutation(API.addMovieToList, mutationSideEffects);
  const removeMovie = useMutation(API.removeMovieFromList, mutationSideEffects);

  if (getList.isLoading || getWatched.isLoading) {
    return (
      <div className="md-list-actions-container">
        <div className="md-list-action">
          <Bookmark style={{ opacity: 0 }} />
          <span style={{ opacity: 0 }}>Add to List</span>
        </div>
        <div className="md-list-action">
          <CheckCircle style={{ opacity: 0 }} />
          <span style={{ opacity: 0 }}>Unwatched</span>
        </div>
      </div>
    );
  }

  if (getList.isError || getWatched.isError) {
    return <h1>{`Error ${getList.error || getWatched.error}`}</h1>;
  }

  const inList = getList.data!.data.find(
    (movie) => movie.movie.ids.tmdb === Number(movieId)
  );

  const inWatched = getWatched.data!.data.find(
    (movie) => movie.movie.ids.tmdb === Number(movieId)
  );

  return (
    <>
      <h4 className="md-list-title">{name}</h4>
      <div className="md-list-actions-container">
        {inList ? (
          <div
            className="md-list-action"
            onClick={() => {
              removeMovie.mutate({ movieId: +movieId!, listId: +listId! });
            }}
          >
            <BookmarkFill className="action-icon" />
            <span>Added to List</span>
          </div>
        ) : (
          <div
            className="md-list-action"
            onClick={() => {
              addMovie.mutate({ movieId: +movieId!, listId: +listId! });
            }}
          >
            <Bookmark className="action-icon" />
            <span>Add to List</span>
          </div>
        )}
        {inWatched ? (
          <div
            className="md-list-action"
            onClick={() => {
              removeMovie.mutate({ movieId: +movieId!, listId: +watchedId! });
            }}
          >
            <CheckCircleFill className="action-icon" />
            <span>Watched</span>
          </div>
        ) : (
          <div
            className="md-list-action"
            onClick={() => {
              addMovie.mutate({ movieId: +movieId!, listId: +watchedId! });
            }}
          >
            <CheckCircle className="action-icon" />
            <span>Unwatched</span>
          </div>
        )}
      </div>
    </>
  );
}

export default ListActions;
