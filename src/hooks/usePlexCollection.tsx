import { useQueries, useQuery } from '@tanstack/react-query';
import axios, { AxiosPromise } from 'axios';
import urlJoin from 'url-join';
import { QUERY_KEYS } from '../enums/QueryKeys';

interface LibraryResult {
  MediaContainer: {
    Directory: {
      key: string;
      type: string;
      title: string;
    }[];
  };
}

const axiosConfig = {
  headers: { accept: 'application/json' },
  params: {
    'X-Plex-Token': import.meta.env.PLEX_ACCESS_TOKEN,
  },
};

const PLEX_URL = import.meta.env.PLEX_URL;
const MOVIE_TYPE = 'movie';
const LIBRARY_SECTIONS = 'library/sections';
const GET_LIBRARIES_PATH = urlJoin(PLEX_URL || '', LIBRARY_SECTIONS);

/**
 *
 * @param title The movie title.
 * @param year The 4-digit release year.
 * @returns getPlexCollection -> boolean - Whether or not the movie is in the Plex collection.
 */
export default function usePlexCollection(title: string, year: string) {
  function getPlexCollection() {
    // Get all movie libraries from plex
    const { data } = useQuery([QUERY_KEYS.PLEX_ALL_LIBRARIES], () =>
      axios.get<LibraryResult>(GET_LIBRARIES_PATH, axiosConfig)
    );

    const movieLibraries =
      data?.data.MediaContainer.Directory.filter(
        (library) => library.type === MOVIE_TYPE
      ) || [];

    const results = useQueries<LibraryResult[]>({
      queries: movieLibraries.map((lib) => ({
        queryKey: [QUERY_KEYS.PLEX_LIBRARY, lib.key],
        queryFn: (): AxiosPromise<LibraryResult> =>
          axios.get(urlJoin(GET_LIBRARIES_PATH, lib.key, 'all'), axiosConfig),
        staleTime: Infinity,
      })),
    });

    // Iterate through all movie libraries -- return true if title and year match
    for (let i = 0; i < results.length; i++) {
      const result: any = results[i];
      for (
        let j = 0;
        j < result.data?.data.MediaContainer.Metadata.length;
        j++
      ) {
        const movie = result.data?.data.MediaContainer.Metadata[j];
        if (movie.title === title && movie.year == year) return true;
      }
    }

    return false;
  }

  return { getPlexCollection };
}
