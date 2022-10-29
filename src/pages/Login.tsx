import { Button, Center, Image, Stack } from '@mantine/core';
import { useInputState, useLocalStorage } from '@mantine/hooks';
import axios from 'axios';
import { useEffect, useState } from 'react';
import urlJoin from 'url-join';
import { LocalStorage } from '../enums/LocalStorageKeys';
import { API } from '../util/api';
import getTraktHeaders from '../util/getTraktHeaders';

const TRAKT_API_KEY = import.meta.env.VITE_TRAKT_API_KEY;
const TRAKT_SECRET = import.meta.env.VITE_TRAKT_SECRET;
const TMDB_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';
const AUTH_URL = 'https://trakt.tv/oauth/authorize';
const TOKEN_URL = 'https://api.trakt.tv/oauth/token';

const TMDB_REQ_TOKEN_URL = 'https://api.themoviedb.org/4/auth/request_token';
const TMDB_ACCESS_TOKEN_URL = 'https://www.themoviedb.org/auth/access';

function Login() {
  const [clickedLogin, setClickedLogin] = useState(false);
  const [code, setCode] = useInputState('');
  const [error, setError] = useState<React.ReactElement | null>(null);

  const [, setToken] = useLocalStorage({
    key: LocalStorage.TRAKT_ACCESS_TOKEN,
  });
  const [, setUsername] = useLocalStorage({ key: LocalStorage.TRAKT_USER_ID });

  // TODO: replace window with useNavigation()
  useEffect(() => {
    console.log('useEffect login');
    API.getAccount()
      .then(() => {
        window.location.replace('/');
      })
      .catch((err) => {
        console.log('🚀 ~ useEffect ~ err', err);
      });
  });

  const authRedirect = () => {
    const authUrl = new URL(AUTH_URL);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', TRAKT_API_KEY!);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);

    window.open(authUrl);
    setClickedLogin(true);
  };

  async function tmdbAuthRedirect() {
    const windowReference = window.open();

    const { data } = await axios.post(
      TMDB_REQ_TOKEN_URL,
      { redirect_to: '/login' },
      { headers: { Authorization: `Bearer ${TMDB_TOKEN}` } }
    );
    const reqToken = data.request_token;

    const authUrl = new URL(TMDB_ACCESS_TOKEN_URL);
    authUrl.searchParams.set('request_token', reqToken);

    // @ts-ignore
    windowReference.location = authUrl;

    setClickedLogin(true);
    setToken(reqToken);
  }

  const handleAuth = async () => {
    const obj = {
      code,
      client_id: TRAKT_API_KEY,
      client_secret: TRAKT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    };

    try {
      const response = await axios.post(TOKEN_URL, obj);

      setToken(response.data.access_token);

      const userInfo = await axios.get(
        urlJoin(TRAKT_BASE_URL, 'users/settings'),
        { headers: getTraktHeaders(response.data.access_token) }
      );

      setUsername(userInfo.data.user.username);

      window.location.replace('/');
    } catch (err) {
      setError(<p>{JSON.stringify(err)}</p>);
    }
  };

  return (
    <Stack spacing={50}>
      <div className="lists-title-container">
        <h1 className="page-title-large">Login</h1>
      </div>

      <Center>
        <Button
          color="dark"
          radius="md"
          size="xl"
          onClick={tmdbAuthRedirect}
          rightIcon={<Image width={30} height={30} src="/trakt-icon-red.svg" />}
        >
          Login with TMDB
        </Button>
      </Center>

      {/* <Center>
        <Button
          color="dark"
          radius="md"
          size="xl"
          onClick={authRedirect}
          rightIcon={<Image width={30} height={30} src="/trakt-icon-red.svg" />}
        >
          Login with Trakt
        </Button>
      </Center> */}

      {clickedLogin && (
        <Button>Refresh</Button>
        // <Container px="xl">
        //   <TextInput
        //     radius="md"
        //     placeholder="Insert code here"
        //     onChange={setCode}
        //     size="xl"
        //   />
        //   <Space h="lg" />
        //   <Button radius="md" size="lg" fullWidth onClick={handleAuth}>
        //     Submit
        //   </Button>
        // </Container>
      )}

      {error}
    </Stack>
  );
}

export default Login;
