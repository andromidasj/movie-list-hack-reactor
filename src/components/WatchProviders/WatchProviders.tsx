import {
  Container,
  Group,
  Image,
  Loader,
  Space,
  Stack,
  Text,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import uuid from 'react-uuid';
import { QUERY_KEYS } from '../../enums/QueryKeys';
import { Flatrate } from '../../models/tmdb/TmdbMovie';
import { MovieCollection } from '../../models/trakt/MovieCollection';
import useStore from '../../store';
import { API } from '../../util/api';
import CollectionBar from './CollectionBar';
import './WatchProviders.scss';

interface WatchProvidersProps {
  providers?: Flatrate[];
  title: string;
}

export const containerStyle = {
  width: '100%',
  height: 80,
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
    [QUERY_KEYS.COLLECTION],
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

  if (collected) {
    providersArr.push(<CollectionBar />);
  }

  return (
    <Stack>
      <h2>Available on</h2>
      <Stack>
        {providersArr.length ? (
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
