import { useQueries, useQuery } from '@tanstack/react-query';
import axios, { AxiosPromise } from 'axios';
import urlJoin from 'url-join';

interface LibraryResult {
  MediaContainer: {
    Directory: object[];
  };
}

const axiosConfig = {
  headers: { accept: 'application/json' },
  params: { 'X-Plex-Token': import.meta.env.VITE_PLEX_ACCESS_TOKEN },
};

const PLEX_URL = import.meta.env.VITE_PLEX_URL;

export default function usePlexCollection(
  title: string,
  year: string
): boolean {
  // get all movies libraries from plex
  const { data } = useQuery<any>(['plex-libraries'], () =>
    axios.get(urlJoin(PLEX_URL, 'library/sections'), axiosConfig)
  );

  const movieLibraries =
    data?.data.MediaContainer.Directory.filter(
      (library: any) => library.type === 'movie'
    ) || [];

  const results = useQueries<LibraryResult[]>({
    queries: movieLibraries.map((lib: any) => ({
      queryKey: ['plex-library', lib.key],
      queryFn: (): AxiosPromise<LibraryResult> =>
        axios.get(
          urlJoin(PLEX_URL, 'library/sections', lib.key, 'all'),
          axiosConfig
        ),
      staleTime: Infinity,
    })),
  });

  // Iterate through all movie libraries -- return true if title and year match
  for (let i = 0; i < results.length; i++) {
    const result: any = results[i];
    for (let j = 0; j < result.data?.data.MediaContainer.Metadata.length; j++) {
      const movie = result.data?.data.MediaContainer.Metadata[j];
      if (movie.title === title && movie.year == year) {
        return true;
      }
    }
  }

  return false;
}
