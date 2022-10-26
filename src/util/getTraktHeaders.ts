const TRAKT_API_KEY = import.meta.env.VITE_TRAKT_API_KEY;

export default function getTraktHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'content-type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': TRAKT_API_KEY!,
  };
}
