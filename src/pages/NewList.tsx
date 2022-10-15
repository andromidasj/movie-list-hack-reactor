import {
  Alert,
  Button,
  Center,
  Stack,
  Switch,
  Textarea,
  TextInput,
  Transition,
} from '@mantine/core';
import React, { useState } from 'react';
import { ExclamationCircle } from 'react-bootstrap-icons';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { TitleNav } from '../components';
import API from '../util/api';
import './NewList.scss';

function NewList() {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [privateList, setPrivateList] = useState(true);
  const [errorAlert, setErrorAlert] = useState(false);

  const mutation = useMutation(API.newList, {
    onSuccess: (data) => {
      console.log('Successfully created list', data);
    },
    retry: 3,
  });

  const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.log('🚀 ~ NewList ~ darkTheme?', darkThemeMq);

  const navigate = useNavigate();

  const handleSubmit = () => {
    const watchedName = '__' + name;
    const watchlist = { name, desc, privateList };
    const watched = {
      name: watchedName,
      desc: `Accompanying watched list for "${name}".\n`,
      privateList,
    };

    [watchlist, watched].forEach((list) => {
      mutation.mutate(list, {
        onSuccess: () => {
          console.log('Done!');
          navigate('/', { replace: true });
        },
        onError: (error) => {
          console.log('Error:', error);
          setErrorAlert(true);
        },
      });
    });
  };

  return (
    <>
      <TitleNav title="New List" back="/" />
      <Transition
        mounted={errorAlert}
        transition="slide-down"
        duration={400}
        timingFunction="ease"
      >
        {(styles) => (
          <Alert
            icon={<ExclamationCircle size={16} />}
            style={{ ...styles, minWidth: '100vw' }}
            title="Bummer!"
            color="red"
            variant="filled"
            radius="lg"
            withCloseButton
            className="error-notification"
            onClose={() => {
              setErrorAlert(false);
            }}
          >
            Something went wrong with creating the list.
          </Alert>
        )}
      </Transition>
      <Stack className="new-list-container">
        <TextInput
          placeholder="Name your list"
          radius="lg"
          size="lg"
          required
          autoComplete="off"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Textarea
          placeholder="Optional description"
          radius="lg"
          size="lg"
          autoComplete="off"
          onChange={(e) => {
            setDesc(e.target.value);
          }}
        />
        <Switch
          checked={privateList}
          label="Private list"
          size="xl"
          onChange={(event) => setPrivateList(event.currentTarget.checked)}
          color="green"
        />
        <Center>
          <Button
            className="new-list-button"
            variant="light"
            radius="lg"
            size="xl"
            fullWidth
            onClick={handleSubmit}
            disabled={name.length === 0}
            loading={mutation.isLoading}
          >
            Create
          </Button>
        </Center>
      </Stack>
    </>
  );
}

export default NewList;
