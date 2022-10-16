import {
  Container,
  Group,
  Image,
  Loader,
  Space,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { CollectionPlay } from 'react-bootstrap-icons';
import uuid from 'react-uuid';
import { Flatrate } from '../../models/tmdb/TmdbMovie';
import { MovieCollection } from '../../models/trakt/MovieCollection';
import useStore from '../../store';
import { API } from '../../util/api';
import './WatchProviders.scss';

interface WatchProvidersProps {
  providers?: Flatrate[];
  title: string;
}

const containerStyle = {
  width: '70vw',
  backgroundColor: '#000',
  borderRadius: 15,
  padding: 10,
};

const URL = 'https://image.tmdb.org/t/p/original';

function WatchProviders({ providers, title }: WatchProvidersProps) {
  const myProviders = useStore((state) => state.providers)
    .filter((e) => e.active)
    .map((e) => e.name);

  const { data, isError, isLoading } = useQuery(
    ['collection'],
    API.getCollection
  );

  if (isLoading || isError) return <Loader />;

  const collected = data.data.find(
    (collected: MovieCollection) => collected.movie.title === title
  );

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
            height={50}
            width={50}
          />
          <Container>
            <Text align="center">{provider.providerName}</Text>
          </Container>
        </Group>
      </Container>
    )) || [];

  if (collected) {
    providersArr.push(
      <Container style={containerStyle} key={uuid()}>
        <Group noWrap position="apart">
          <ThemeIcon size={50} variant="outline" radius="md">
            <CollectionPlay className="wp-logo-collected" size={60} />
          </ThemeIcon>
          <Container>
            <Text align="center">Collection</Text>
          </Container>
        </Group>
      </Container>
    );
  }

  return (
    <>
      <h2>Available on</h2>
      <Space h="lg" />
      <Stack>
        {providersArr.length ? (
          providersArr
        ) : (
          <Text>Not Available On Your Services</Text>
        )}
      </Stack>
      <Space h="xl" />
    </>
  );
}

export default WatchProviders;
