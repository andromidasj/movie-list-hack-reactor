/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRAKT_API_KEY: string;
  readonly VITE_TRAKT_SECRET: string;
  readonly VITE_TMDB_API_KEY: string;
  readonly VITE_TMDB_ACCESS_TOKEN: string;
  readonly VITE_TMDB_ACCOUNT_ID: string;
  readonly VITE_PLEX_ACCESS_TOKEN: string;
  readonly VITE_PLEX_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
