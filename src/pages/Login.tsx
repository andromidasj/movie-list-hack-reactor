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
import { useQuery } from 'react-query';

import { API, TRAKT } from '../util/api';

const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

function Login() {
  const [clickedLogin, setClickedLogin] = useState(false);
  const [code, setCode] = useState('');
  console.log('🚀 ~ Login ~ code', code);
  const [error, setError] = useState<React.ReactElement | null>(null);

  const [, setToken] = useLocalStorage({
    key: 'access_token',
  });
  const [, setUsername] = useLocalStorage({
    key: 'user_id',
  });

  const settings = useQuery(['settings'], () => {
    TRAKT.get('https://api.trakt.tv/users/settings');
  });
  console.log('🚀 ~ Lists ~ settings', settings);

  // TODO: replace window with useNavigation()
  useEffect(() => {
    API.getStats()
      .then((response) => {
        console.log('🚀 ~ useEffect ~ response', response);
        window.location.replace('/');
      })
      .catch((err) => {
        console.log('🚀 ~ useEffect ~ err', err);
      });
  }, []);

  const authRedirect = () => {
    const authUrl = new URL('https://trakt.tv/oauth/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', process.env.REACT_APP_TRAKT_API_KEY!);
    authUrl.searchParams.set('redirect_uri', REDIRECT_URI);

    window.open(authUrl);
    setClickedLogin(true);
  };

  const handleAuth = async () => {
    const obj = {
      code: code,
      client_id: process.env.REACT_APP_TRAKT_API_KEY,
      client_secret: process.env.REACT_APP_TRAKT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    };

    try {
      const response = await axios.post(
        'https://api.trakt.tv/oauth/token',
        obj,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('🚀 ~ handleAuth ~ response', response);
      setToken(response.data.access_token);

      const userInfo = await axios.get('https://api.trakt.tv/users/settings', {
        headers: {
          'content-type': 'application/json',
          'trakt-api-version': '2',
          'trakt-api-key': process.env.REACT_APP_TRAKT_API_KEY!,
          Authorization: `Bearer ${response.data.access_token}`,
        },
      });

      // console.log('🚀 ~ handleAuth ~ userInfo', userInfo);
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
            <Image width={30} height={30} src={'assets/trakt-icon-red.svg'} />
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
