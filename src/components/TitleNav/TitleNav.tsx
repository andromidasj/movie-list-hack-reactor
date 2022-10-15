import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, BarChartFill } from 'react-bootstrap-icons';
import { ActionIcon, Space } from '@mantine/core';

import './TitleNav.scss';

function TitleNav({ title, back, backName = '', info = false }) {
  const navigate = useNavigate();

  return (
    <>
      <div className="title-nav">
        <ActionIcon
          color="blue"
          onClick={() => {
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
              navigate(`stats${window.location.search}`);
            }}
          >
            <BarChartFill size={20} />
          </ActionIcon>
        )}
      </div>
      <div className="title-nav-spacer" />
    </>
  );
}

export default TitleNav;
