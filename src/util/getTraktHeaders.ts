const TRAKT_SECRET = import.meta.env.VITE_TRAKT_SECRET;

export default function getTraktHeaders() {
  return {
    Authorization: `Bearer ${TRAKT_SECRET}`,
    'content-type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': TRAKT_SECRET,
  };
}
