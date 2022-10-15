import {
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  Group,
  Space,
  Stack,
  Title,
} from '@mantine/core';
import React from 'react';
import uuid from 'react-uuid';
import { TitleNav } from '../components';

import useStore from '../store';
import './Settings.scss';

function Settings() {
  const providers = useStore((state) => state.providers);
  const setProviders = useStore((state) => state.setProviders);
  const handleLogout = () => {
    console.log('logout');
    localStorage.setItem('access_token', null);
    localStorage.setItem('user_id', null);
    window.location.replace('/login');
  };

  const list = providers.map((e, i) => (
    <Group key={uuid()} position="apart">
      <Title order={3}>{e.name}</Title>
      <Checkbox
        size="lg"
        radius="xl"
        checked={e.active}
        onChange={(evt) => {
          setProviders(i, e.name, evt.currentTarget.checked);
        }}
      />
    </Group>
  ));

  return (
    <>
      <TitleNav title="Settings" />
      <Space h={50} />
      <Center>
        <Button
          onClick={handleLogout}
          variant="outline"
          color="red"
          radius="md"
          size="lg"
        >
          Logout
        </Button>
      </Center>
      <Space h={50} />

      <Container>
        <Divider
          my="xs"
          label="My Providers"
          labelPosition="center"
          labelProps={{ size: 'xl' }}
        />
        <Stack>{list}</Stack>
      </Container>
    </>
  );
}

export default Settings;
