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
import { Download, Trash, Upload } from 'react-bootstrap-icons';
import { useCSVDownloader, useCSVReader } from 'react-papaparse';
import { useNavigate, useSearchParams } from 'react-router-dom';
import uuid from 'react-uuid';
import TitleNav from '../components/TitleNav/TitleNav';
import { QUERY_KEYS } from '../enums/QueryKeys';
import { SEARCH_PARAMS } from '../enums/SearchParams';
import { TmdbMovie } from '../models/tmdb/TmdbMovie';
import { API } from '../util/api';
import './ListStats.scss';

export interface CSVEntry {
  watched: boolean;
  tmdbId: number;
  title: string;
  year: number;
}

interface CSVResults {
  data: CSVEntry[];
  errors: CSVEntry[];
  meta: CSVEntry[];
}

function ListStats() {
  const [searchParams] = useSearchParams();
  const listId = searchParams.get(SEARCH_PARAMS.LIST);
  const watchedId = searchParams.get(SEARCH_PARAMS.WATCHED);
  const name = searchParams.get(SEARCH_PARAMS.NAME);
  const navigate = useNavigate();

  const [modalOpened, setModalOpened] = useState(false);
  const deleteList = useMutation(API.deleteLists);

  const [uploadIsLoading, setUploadIsLoading] = useState(false);
  const { CSVReader } = useCSVReader();
  const { CSVDownloader } = useCSVDownloader();

  const { data: list } = useQuery([QUERY_KEYS.LIST_ITEMS, listId], () =>
    API.getListItems(listId!)
  );
  const { data: watched } = useQuery([QUERY_KEYS.LIST_ITEMS, watchedId], () =>
    API.getListItems(watchedId!)
  );

  const detailsData = [{ title: 'Name', value: name }];

  !!list?.data.description &&
    detailsData.push({ title: 'Description', value: list?.data.description });

  const statsData = [
    { title: 'Watched Movies', value: watched?.data.itemCount },
    { title: 'Movies left to watch', value: list?.data.itemCount },
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

  const handleDownload = () => {
    const filter = (movie: TmdbMovie, watched: boolean): CSVEntry => ({
      watched,
      tmdbId: movie.id,
      title: movie.title.toString(),
      year: +movie.releaseDate.substring(0, 4),
    });

    const watchedFiltered =
      watched?.data.items.map((movie) => filter(movie, true)) || [];

    const listFiltered =
      list?.data.items.map((movie) => filter(movie, false)) || [];

    return listFiltered.concat(watchedFiltered);
  };

  const { mutateAsync: addItemsToList } = useMutation(API.addMoviesToListV4);

  const handleUpload = async (results: CSVResults) => {
    // TODO: show modal with summary - accept, cancel
    setUploadIsLoading(true);
    try {
      await addItemsToList({
        listId: listId!,
        items: results.data.filter((entry) => !entry.watched),
      });
      await addItemsToList({
        listId: watchedId!,
        items: results.data.filter((entry) => !!entry.watched),
      });
      console.log('success!');
      setUploadIsLoading(false);
    } catch (error) {
      console.log('error while adding items to lists');
    }
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
          <Group grow>
            <CSVDownloader data={handleDownload}>
              <Button fullWidth leftIcon={<Download />}>
                Download CSV
              </Button>
            </CSVDownloader>
            <CSVReader
              onUploadAccepted={handleUpload}
              config={{ header: true, dynamicTyping: true }}
            >
              {({ getRootProps }: any) => (
                <Button
                  {...getRootProps()}
                  leftIcon={<Upload />}
                  loading={uploadIsLoading}
                >
                  Upload CSV
                </Button>
              )}
            </CSVReader>
          </Group>
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
