import {
  Button,
  Group,
  Modal,
  Space,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Download, Trash } from 'react-bootstrap-icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import uuid from 'react-uuid';
import { TitleNav } from '../components';
import { ListItems } from '../models/trakt/ListItems';
import { API } from '../util/api';
import './ListStats.scss';

function ListStats() {
  const [searchParams] = useSearchParams();
  const listId = searchParams.get('list');
  const watchedId = searchParams.get('watched');
  const name = searchParams.get('name');
  const navigate = useNavigate();

  const [modalOpened, setModalOpened] = useState(false);
  const deleteList = useMutation(API.deleteLists);

  const list = useQuery(['listInfo', listId], () => API.getListInfo(+listId!));
  const watched = useQuery(['listInfo', watchedId], () =>
    API.getListInfo(+watchedId!)
  );

  const { data: listItems } = useQuery(['listItems', listId], () =>
    API.getListItems(+listId!)
  );

  const { data: watchedItems } = useQuery(['listItems', watchedId], () =>
    API.getListItems(+watchedId!)
  );

  const detailsData = [
    {
      title: 'Name',
      value: name,
    },
    {
      title: 'Description',
      value: list.data?.data.description || '',
    },
  ];

  const statsData = [
    {
      title: 'Watched Movies',
      value: watched.data?.data.itemCount,
    },
    {
      title: 'Movies left to watch',
      value: list.data?.data.itemCount,
    },
  ];

  const handleListDelete = () => {
    [listId, watchedId].forEach((list) => {
      deleteList.mutate(+list!, {
        onSuccess: () => {
          navigate('/');
        },
        onError: (data) => {
          console.log(data);
        },
      });
    });
  };

  const handleDownload = (): void => {
    if (!listItems || !watchedItems) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'watched?,trakt_id,tmdb_id,imdb_id,title,year\n';

    const appendMovieVals = (movie: ListItems, row: string[]) => {
      row.push(movie.movie.ids.trakt?.toString() || '');
      row.push(movie.movie.ids.tmdb?.toString() || '');
      row.push(movie.movie.ids.imdb?.toString() || '');
      row.push(`"${movie.movie.title}"`);
      row.push(movie.movie.year.toString() || '');
    };

    listItems.data.forEach((movie) => {
      let newRow = ['false'];
      appendMovieVals(movie, newRow);
      csvContent += newRow.join(',') + '\n';
    });

    watchedItems.data.forEach((movie) => {
      let newRow = ['true'];
      appendMovieVals(movie, newRow);
      csvContent += newRow.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);

    // Download file with specified name
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `${name?.split(' ').join('_')}_movielist_backup.csv`
    );

    document.body.appendChild(link); // Required for FF
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <TitleNav title="List Details" />
      <div className="stats-container">
        <Modal
          opened={modalOpened}
          onClose={() => {
            setModalOpened(false);
          }}
          title="Are you sure?"
        >
          <Title order={2}>
            <Text color="red" weight="bold" inherit component="span">
              Deleting{' '}
            </Text>
            this list will permanently delete all list data. Are you sure you
            want to continue?
          </Title>
          <Space h="lg" />
          <Group grow>
            <Button
              color="red"
              onClick={handleListDelete}
              loading={deleteList.isLoading}
            >
              Delete forever!
            </Button>
            <Button
              onClick={() => {
                setModalOpened(false);
              }}
            >
              Cancel
            </Button>
          </Group>
        </Modal>
        <Title order={2} className="list-detail-title">
          Details
        </Title>
        <Table striped>
          <tbody>
            {detailsData.map((e) => (
              <tr key={uuid()}>
                <td>{e.title}</td>
                <td>{e.value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Title order={2} className="list-detail-title">
          Stats
        </Title>
        <Table striped>
          <tbody>
            {statsData.map((e) => (
              <tr key={uuid()}>
                <td>{e.title}</td>
                <td>{e.value}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Space h={150} />

        <Stack spacing="xl">
          <Button leftIcon={<Download />} onClick={handleDownload} fullWidth>
            Download CSV
          </Button>
          <Button
            color="red"
            fullWidth
            leftIcon={<Trash />}
            onClick={() => {
              setModalOpened(true);
            }}
          >
            Delete List
          </Button>
        </Stack>
      </div>
    </>
  );
}

export default ListStats;
