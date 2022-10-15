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
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import API from '../util/api';

function Login() {
  useEffect(() => {
    API.getStats()
      .then((response) => {
        // console.log('🚀 ~ useEffect ~ response', response);
        window.location.replace('/');
      })
      .catch((err) => {
        console.log('🚀 ~ useEffect ~ err', err);
      });
  }, []);

  const [clickedLogin, setClickedLogin] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [token, setToken] = useLocalStorage({
    key: 'access_token',
    defaultValue: null,
    serialize: (value) => value,
  });
  const [username, setUsername] = useLocalStorage({
    key: 'user_id',
    defaultValue: null,
    serialize: (value) => value,
  });

  // console.log('🚀 ~ Login ~ username', username);
  // console.log('🚀 ~ Login ~ token', token);

  const authRedirect = () => {
    const authUrl = new URL('https://trakt.tv/oauth/authorize');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set(
      'client_id',
      '6847dcfb3fe1227b3cf32efec4fb7876e0f08f5d99fb4aeb978e577d7aafb59c'
    );
    authUrl.searchParams.set('redirect_uri', 'urn:ietf:wg:oauth:2.0:oob');

    window.open(authUrl);
    setClickedLogin(true);
  };

  const handleAuth = async () => {
    const obj = {
      code: code,
      client_id: process.env.TRAKT_API_KEY,
      client_secret: process.env.TRAKT_SECRET,
      redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
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
      // console.log('🚀 ~ handleAuth ~ response', response);
      setToken(response.data.access_token);

      const userInfo = await axios.get('https://api.trakt.tv/users/settings', {
        headers: {
          'content-type': 'application/json',
          'trakt-api-version': '2',
          'trakt-api-key': process.env.TRAKT_API_KEY,
          Authorization: `Bearer ${response.data.access_token}`,
        },
      });

      // console.log('🚀 ~ handleAuth ~ userInfo', userInfo);
      setUsername(userInfo.data.user.username);

      window.location.replace('/');
    } catch (err) {
      setError(<p>{err}</p>);
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
