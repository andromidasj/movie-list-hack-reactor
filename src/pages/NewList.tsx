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
import { useInputState, useToggle } from '@mantine/hooks';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { ExclamationCircle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import TitleNav from '../components/TitleNav/TitleNav';
import { API } from '../util/api';
import './NewList.scss';

function NewList() {
  const [name, setName] = useInputState('');
  const [description, setDescription] = useInputState('');
  const [privacy, togglePrivacy] = useToggle(['public', 'private'] as const);
  const [errorAlert, setErrorAlert] = useState<boolean>(false);

  const mutation = useMutation(API.newList, {
    onSuccess: (data) => {
      console.log('Successfully created list', data);
    },
  });

  const navigate = useNavigate();

  const handleSubmit = () => {
    const watchedName = '__' + name;
    const watchlist = {
      name,
      description,
      privacy,
    };
    const watched = {
      name: watchedName,
      description: `Accompanying watched list for "${name}".\n`,
      privacy,
    };

    [watchlist, watched].forEach((list) => {
      mutation.mutate(list, {
        onSuccess: () => {
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
      <TitleNav title="New List" />
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
          onChange={setName}
        />
        <Textarea
          placeholder="Optional description"
          radius="lg"
          size="lg"
          autoComplete="off"
          onChange={setDescription}
        />
        <Switch
          checked={privacy === 'private'}
          label="Private list"
          size="xl"
          onChange={() => togglePrivacy()}
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
