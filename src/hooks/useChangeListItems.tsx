import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { QUERY_KEYS } from '../enums/QueryKeys';
import { ItemPresent } from '../models/tmdb/ItemPresent';

import { API } from '../util/api';

interface MovieListInputs {
  movieId: string;
  targetListId: string;
  insertion: boolean;
}

// Configure optimistic updates so that list status button updates immediately
function useChangeListItems({
  movieId,
  targetListId,
  insertion,
}: MovieListInputs) {
  const queryClient = useQueryClient();

  const ids = [QUERY_KEYS.IS_IN_LIST, movieId, targetListId];
  const inputs = { movieId, targetListId };

  const apiCall = insertion
    ? () => API.addMovieToList(inputs)
    : () => API.removeMovieFromList(inputs);

  // TODO: Figure out types for React Query
  // @ts-ignore
  return useMutation(apiCall, {
    onMutate: async () => {
      queryClient.cancelQueries([QUERY_KEYS.IS_IN_LIST]);

      const previousTargetList =
        queryClient.getQueryData<AxiosResponse<ItemPresent>>(ids);

      if (previousTargetList) {
        queryClient.setQueryData<AxiosResponse<ItemPresent>>(ids, {
          ...previousTargetList,
          data: { itemPresent: insertion },
        });
      }

      return { previousTargetList };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTargetList) {
        queryClient.setQueryData<AxiosResponse<ItemPresent>>(
          ids,
          context.previousTargetList
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_KEYS.IS_IN_LIST]);
    },
  });
}

export default useChangeListItems;
