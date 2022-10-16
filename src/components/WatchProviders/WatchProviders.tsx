import {
  Container,
  Group,
  Image,
  Space,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { CollectionPlay } from 'react-bootstrap-icons';
import { useQuery } from 'react-query';
import uuid from 'react-uuid';
import useStore from '../../store';
import { API } from '../../util/api';
import './WatchProviders.scss';

interface WatchProvidersProps {
  providers: any;
  title: any;
}

const URL = 'https://image.tmdb.org/t/p/original';

function WatchProviders({ providers, title }: WatchProvidersProps) {
  // TODO: Add isLoading & isError
  const { data } = useQuery('collection', API.getCollection);

  const collected = data?.data?.find((e: any) => e.movie.title === title);

  const myProviders = useStore((state) => state.providers)
    .filter((e) => e.active)
    .map((e) => e.name);

  const filteredProviders = providers?.flatrate?.filter((provider: any) =>
    myProviders.includes(provider.provider_name)
  );

  const containerStyle = {
    width: '70vw',
    backgroundColor: '#000',
    borderRadius: 15,
    padding: 10,
  };

  const providersArr =
    filteredProviders?.map((provider: any) => (
      <Container style={containerStyle} key={uuid()}>
        <Group noWrap key={uuid()} position="apart">
          <Image
            src={URL + provider.logo_path}
            radius="md"
            height={50}
            width={50}
          />
          <Container>
            <Text align="center">{provider.provider_name}</Text>
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
        {providersArr?.length ? (
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
