import {
  ActionIcon,
  Badge,
  Button,
  Container,
  Group,
  Stack,
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { Bookmark, GearWideConnected, PlusLg } from 'react-bootstrap-icons';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import { QUERY_KEYS } from '../enums/QueryKeys';
import useStore from '../store';
import { API } from '../util/api';
import './Lists.scss';

type ListInfoTuple = [
  listId: number,
  watchedListId: number,
  listName: string,
  movieCount: number
];

const gradients = [
  { from: 'indigo', to: 'cyan' },
  { from: 'orange', to: 'green' },
  { from: 'teal', to: 'blue' },
  { from: '#6d9a31', to: '#2f6a9e' },
];

function Lists() {
  const navigate = useNavigate();
  const setTab = useStore((state) => state.setTab);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  // setTab('toWatch');
  // Causes error: Warning: Cannot update a component (`Tabs`) while rendering a different component (`Lists`).
  setSearchQuery('');

  const { data, isLoading, isError } = useQuery(
    [QUERY_KEYS.ALL_LISTS],
    API.getLists
  );

  if (isLoading) return <h1>Loading...</h1>;

  if (isError) navigate('/login');

  const lists = data!.data.results;
  const listInfoArray: ListInfoTuple[] = [];

  const watched = lists.filter((list) => list.name.startsWith('__'));
  const watchList = lists.filter((list) => !list.name.startsWith('__'));

  watchList.forEach((list) => {
    const w = watched.find((watched) => watched.name === `__${list.name}`);
    if (w) listInfoArray.push([list.id!, w.id!, list.name, list.itemCount]);
  });

  const allLists = listInfoArray
    .sort((a, b) => a[2].localeCompare(b[2]))
    .map((listInfoItem: ListInfoTuple, i: number) => {
      const params = {
        list: listInfoItem[0].toString(),
        watched: listInfoItem[1].toString(),
        name: listInfoItem[2],
      };

      return (
        <Button
          component={Link}
          to={{
            pathname: '/list',
            search: createSearchParams(params).toString(),
          }}
          uppercase
          color="dark"
          size="xl"
          radius="lg"
          key={listInfoItem[0]}
          style={{
            height: 100,
            fontSize: 24,
            wordWrap: 'break-word',
          }}
          variant="gradient"
          gradient={gradients[i % gradients.length]}
        >
          <Badge
            color="dark"
            className="badge list-badge"
            leftSection={<Bookmark />}
          >
            {listInfoItem[3]}
          </Badge>
          {/* <Badge
            color="dark"
            className="badge watched-badge"
            leftSection={<Bookmark />}
          >
            {listInfoItem[3]}
          </Badge> */}
          {listInfoItem[2]}
        </Button>
      );
    });

  return (
    <>
      <div className="lists-title-container">
        <h1 className="page-title-large">Lists</h1>
        <Group spacing="xl">
          <Link to="new-list">
            <ActionIcon color="blue">
              <PlusLg size={26} />
            </ActionIcon>
          </Link>
          <Link to="settings">
            <ActionIcon color="blue">
              <GearWideConnected size={26} />
            </ActionIcon>
          </Link>
        </Group>
      </div>

      <Container px="xl" mt="xl">
        <Stack>{allLists}</Stack>
      </Container>
    </>
  );
}

export default Lists;
