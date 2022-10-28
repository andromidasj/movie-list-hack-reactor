import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../enums/QueryKeys';
import { ListItems } from '../models/trakt/ListItems';
import { API } from '../util/api';

interface MovieListInputs {
  movieId: string;
  targetListId: string;
}

interface ListItemArray {
  data: ListItems[];
}

function useRemoveMovieFromList({ movieId, targetListId }: MovieListInputs) {
  const queryClient = useQueryClient();

  return useMutation(
    () => API.removeMovieFromList({ movieId: +movieId, listId: +targetListId }),
    {
      onMutate: async () => {
        queryClient.cancelQueries([QUERY_KEYS.LIST_ITEMS]);

        const previousTargetList = queryClient.getQueryData<ListItemArray>([
          QUERY_KEYS.LIST_ITEMS,
          targetListId,
        ]);

        if (previousTargetList) {
          queryClient.setQueryData<ListItemArray>(
            [QUERY_KEYS.LIST_ITEMS, targetListId],
            {
              ...previousTargetList,
              data: previousTargetList.data.filter(
                (listItem) => listItem.movie.ids.tmdb !== +movieId
              ),
            }
          );
        }

        return { previousTargetList };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousTargetList) {
          queryClient.setQueryData<ListItemArray>(
            [QUERY_KEYS.LIST_ITEMS, targetListId],
            context.previousTargetList
          );
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries([QUERY_KEYS.LIST_ITEMS]);
      },
      retry: 6,
      retryDelay: 200,
    }
  );
}

export default useRemoveMovieFromList;
