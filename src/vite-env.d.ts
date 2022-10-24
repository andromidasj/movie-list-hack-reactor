/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TRAKT_API_KEY: string;
  readonly VITE_TRAKT_SECRET: string;
  readonly VITE_TMDB_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
