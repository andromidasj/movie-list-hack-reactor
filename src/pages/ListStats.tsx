import { Button, Group, Modal, Space, Table, Text, Title } from '@mantine/core';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Trash } from 'react-bootstrap-icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import uuid from 'react-uuid';
import { TitleNav } from '../components';
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
              Deleting
            </Text>{' '}
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
        {/* <Center> */}
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
        {/* </Center> */}
      </div>
    </>
  );
}

export default ListStats;
