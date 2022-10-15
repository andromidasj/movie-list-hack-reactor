import { Button, Checkbox, Divider, Group, Stack, Title } from '@mantine/core';
import uuid from 'react-uuid';
import { TitleNav } from '../components';
import { LocalStorage } from '../models/enums/LocalStorageKeys';

import useStore from '../store';
import './Settings.scss';

function Settings() {
  const providers = useStore((state) => state.providers);
  const setProviders = useStore((state) => state.setProviders);
  const handleLogout = () => {
    localStorage.removeItem(LocalStorage.ACCESS_TOKEN);
    localStorage.removeItem(LocalStorage.USER_ID);
    window.location.href = '/login';
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

      <Stack spacing="xl" m="xl">
        <Button
          onClick={handleLogout}
          variant="outline"
          color="red"
          radius="md"
          size="lg"
        >
          Logout
        </Button>

        <Divider
          my="xs"
          label="My Providers"
          labelPosition="center"
          labelProps={{ size: 'xl' }}
        />

        <Stack>{list}</Stack>
      </Stack>
    </>
  );
}

export default Settings;
