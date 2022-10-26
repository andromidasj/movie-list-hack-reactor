import { ActionIcon } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, InfoCircle } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import urlJoin from 'url-join';
import './TitleNav.scss';

interface TitleNavProps {
  title: string;
  info?: boolean;
}

function TitleNav({ title, info = false }: TitleNavProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <>
      <div className="title-nav">
        <ActionIcon
          color="blue"
          onClick={() => {
            queryClient.invalidateQueries();
            navigate(-1);
          }}
        >
          <ChevronLeft size={20} />
        </ActionIcon>
        <h4 className="page-title-small">{title}</h4>
        {info && (
          <ActionIcon
            color="blue"
            onClick={() => {
              navigate(urlJoin('stats', window.location.search));
            }}
          >
            <InfoCircle size={20} />
          </ActionIcon>
        )}
      </div>
      <div className="title-nav-spacer" />
    </>
  );
}

export default TitleNav;
