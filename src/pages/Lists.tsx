import {
  ActionIcon,
  Badge,
  Button,
  Container,
  Group,
  Space,
} from '@mantine/core';
import React, { useEffect } from 'react';
import { GearWideConnected, PlusLg } from 'react-bootstrap-icons';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';

import useStore from '../store.js';
import API from '../util/api.js';
import './Lists.scss';

function Lists() {
  useEffect(() => {
    API.getStats().catch(() => {
      window.location.replace('/login');
    });
  }, []);

  const navigate = useNavigate();

  // Default Zustand to 'toWatch' tab when lists load
  const setTab = useStore((state) => state.setTab);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  setTab('toWatch');
  setSearchQuery('');

  const {
    data: lists,
    isLoading,
    isError,
    error,
  } = useQuery('lists', API.getLists);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError) {
    navigate('/login');
  }

  let listInfoArray = [];
  const watched = lists.data.filter((list) => list.name.startsWith('__'));
  const watchList = lists.data.filter((list) => !list.name.startsWith('__'));

  watchList.forEach((list) => {
    const b = watched.find((watched) => watched.name === `__${list.name}`);
    if (b) {
      listInfoArray.push([
        list.ids.trakt,
        b?.ids.trakt,
        list.name,
        list.item_count,
      ]);
    }
  });

  // Sort lists alphabetically
  // listInfoArray = listInfoArray.sort((a, b) => a[2].localeCompare(b[2]));

  const gradients = [
    { from: 'indigo', to: 'cyan' },
    { from: 'teal', to: 'blue' },
    { from: '#6d9a31', to: '#2f6a9e' },
    { from: 'orange', to: 'green' },
  ];

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
      {/* <div className="lists-container"> */}
      <Space h="xl" />
      <Container px="xl">
        <Group grow direction="column">
          {listInfoArray.map((listInfoItem, i) => (
            <Button
              component={Link}
              to={`/list?list=${listInfoItem[0]}&watched=${listInfoItem[1]}&name=${listInfoItem[2]}`}
              uppercase
              color="dark"
              size="xl"
              radius="lg"
              key={listInfoItem[0]}
              style={{
                height: 100,
                fontSize: 24,
                maxWidth: '100%',
                wordWrap: 'break-word',
              }}
              variant="gradient"
              gradient={gradients[i % gradients.length]}
            >
              <Badge color="dark" className="list-badge">
                {listInfoItem[3]}
              </Badge>
              {listInfoItem[2]}
            </Button>
          ))}
        </Group>
      </Container>
      {/* </div> */}
    </>
  );
}

export default Lists;
