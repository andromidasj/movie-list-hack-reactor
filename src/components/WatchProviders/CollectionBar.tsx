import { Container, Group, Image, Text } from '@mantine/core';
import { containerStyle } from './WatchProviders';

const LOGO_URL =
  'https://www.plex.tv/wp-content/themes/plex/assets/img/plex-logo.svg';

export default function CollectionBar() {
  return (
    <Container style={containerStyle}>
      <Group noWrap position="apart">
        <Image
          src={LOGO_URL}
          radius="md"
          height={60}
          width={60}
          fit="contain"
        />
        <Container>
          <Text align="center" size={22} weight="bold">
            Collection
          </Text>
        </Container>
      </Group>
    </Container>
  );
}
