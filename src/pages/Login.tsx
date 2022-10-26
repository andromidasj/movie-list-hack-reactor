import {
  Button,
  Center,
  Container,
  Image,
  Space,
  TextInput,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import axios from 'axios';
import { useEffect, useState } from 'react';
import urlJoin from 'url-join';
import { LocalStorage } from '../enums/LocalStorageKeys';
import { API, TRAKT_BASE_URL } from '../util/api';
import getTraktHeaders from '../util/getTraktHeaders';

const TRAKT_API_KEY = import.meta.env.VITE_TRAKT_API_KEY;
const TRAKT_SECRET = import.meta.env.VITE_TRAKT_SECRET;

const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';
const AUTH_URL = 'https://trakt.tv/oauth/authorize';
const TOKEN_URL = 'https://api.trakt.tv/oauth/token';

function Login() {
  const [clickedLogin, setClickedLogin] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState<React.ReactElement | null>(null);

  const [, setToken] = useLocalStorage({ key: LocalStorage.ACCESS_TOKEN });
  const [, setUsername] = useLocalStorage({ key: LocalStorage.USER_ID });

  // TODO: replace window with useNavigation()
  useEffect(() => {
    API.getStats()
      .then(() => {
        window.location.replace('/');
      })
      .catch((err) => {
        console.log('🚀 ~ useEffect ~ err', err);
      });
  }, []);

  const authRedirect = () => {
    const authUrl = new URL(AUTH_URL);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', TRAKT_API_KEY!);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);

    window.open(authUrl);
    setClickedLogin(true);
  };

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
    <>
      <div className="lists-title-container">
        <h1 className="page-title-large">Login</h1>
      </div>

      <Space h={50} />
      <Center>
        <Button
          color="dark"
          radius="md"
          size="xl"
          onClick={authRedirect}
          rightIcon={
            <Image width={30} height={30} src={'/trakt-icon-red.svg'} />
          }
        >
          Login with Trakt
        </Button>
      </Center>
      <Space h={50} />

      {clickedLogin && (
        <Container px="xl">
          <TextInput
            radius="md"
            placeholder="Insert code here"
            onChange={(e) => {
              setCode(e.target.value);
            }}
            size="xl"
          />
          <Space h="lg" />
          <Button radius="md" size="lg" fullWidth onClick={handleAuth}>
            Submit
          </Button>
        </Container>
      )}

      {error}
    </>
  );
}

export default Login;
