import {
  Bookmark,
  BookmarkFill,
  CheckCircle,
  CheckCircleFill,
} from "react-bootstrap-icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams, useSearchParams } from "react-router-dom";
import API from "../../util/api.js";
import "./ListActions.scss";

function ListActions() {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();
  const listId = searchParams.get("list");
  const watchedId = searchParams.get("watched");
  const name = searchParams.get("name");
  const queryClient = useQueryClient();

  const {
    data: list,
    isLoading: isLoadingList,
    isError: isErrorList,
    error: errorList,
  } = useQuery(["list", listId], () => API.getListItems(listId));

  const {
    data: watched,
    isLoading: isLoadingWatched,
    isError: isErrorWatched,
    error: errorWatched,
  } = useQuery(["list", watchedId], () => API.getListItems(watchedId));

  // console.log('~ListActions~ list', list);
  // console.log('~ListActions~ watched', watched);

  const invalidateQueriesOnSuccess = {
    onSuccess: () => {
      queryClient.invalidateQueries(["list", listId]);
      queryClient.invalidateQueries(["list", watchedId]);
    },
  };

  const addMovie = useMutation(API.addMovieToList, invalidateQueriesOnSuccess);
  const removeMovie = useMutation(
    API.removeMovieFromList,
    invalidateQueriesOnSuccess
  );

  if (isLoadingList || isLoadingWatched) {
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

  if (isErrorList || isErrorWatched) {
    return <h1>{`Error ${errorList || errorWatched}`}</h1>;
  }

  const inList = list!.data.find(
    (movie) => movie.movie.ids.tmdb === Number(movieId)
  );
  const inWatched = watched!.data.find(
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
              removeMovie.mutate({ movieId, listId });
            }}
          >
            <BookmarkFill className="action-icon" />
            <span>Added to List</span>
          </div>
        ) : (
          <div
            className="md-list-action"
            onClick={() => {
              addMovie.mutate({ movieId, listId });
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
              removeMovie.mutate({ movieId, listId: watchedId });
            }}
          >
            <CheckCircleFill className="action-icon" />
            <span>Watched</span>
          </div>
        ) : (
          <div
            className="md-list-action"
            onClick={() => {
              addMovie.mutate({ movieId, listId: watchedId });
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
