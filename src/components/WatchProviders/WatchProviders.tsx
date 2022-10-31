import { Container, Group, Image, Space, Stack, Text } from '@mantine/core';
import uuid from 'react-uuid';
import usePlexCollection from '../../hooks/usePlexCollection';
import { Flatrate } from '../../models/tmdb/TmdbMovie';
import useStore from '../../store';
import CollectionBar from './CollectionBar';
import './WatchProviders.scss';

interface WatchProvidersProps {
  providers?: Flatrate[];
  title: string;
  year: string;
}

export const containerStyle = {
  width: '100%',
  height: 80,
  backgroundColor: '#000',
  borderRadius: 15,
  padding: 10,
};

const URL = 'https://image.tmdb.org/t/p/original';

function WatchProviders({ providers, title, year }: WatchProvidersProps) {
  const myProviders = useStore((state) => state.providers)
    .filter((e) => e.active)
    .map((e) => e.name);

  const { getPlexCollection } = usePlexCollection(title, year);

  const inPlex =
    (import.meta.env.VITE_PLEX_URL && import.meta.env.VITE_PLEX_ACCESS_TOKEN) ||
    (process?.env.PLEX_URL && process?.env.PLEX_ACCESS_TOKEN)
      ? getPlexCollection()
      : null;

  const filteredProviders =
    providers?.filter((provider: Flatrate) =>
      myProviders.includes(provider.providerName)
    ) || [];

  const providersArr =
    filteredProviders.map((provider: any) => (
      <Container style={containerStyle} key={uuid()}>
        <Group noWrap position="apart" key={uuid()}>
          <Image
            src={URL + provider.logoPath}
            radius="md"
            height={60}
            width={60}
          />
          <Container>
            <Text align="center" size={22} weight="bold">
              {provider.providerName}
            </Text>
          </Container>
        </Group>
      </Container>
    )) || [];

  if (inPlex) {
    providersArr.push(<CollectionBar key={uuid()} />);
  }

  return (
    <Stack>
      <h2>Available on</h2>
      <Stack>
        {providersArr?.length ? (
          providersArr
        ) : (
          <Text>Not Available On Your Services</Text>
        )}
      </Stack>
      <Space h="xl" />
    </Stack>
  );
}

export default WatchProviders;
