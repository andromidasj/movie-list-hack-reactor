import { TextInput } from '@mantine/core';
import React from 'react';
import { Search, XCircleFill } from 'react-bootstrap-icons';
import useStore from '../../store';
import './SearchBar.scss';

function SearchBar() {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);

  const activeSearch = searchQuery.length > 0;

  return (
    // <div className="search-bar-container">
    <div
      style={{
        width: '100vw',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
      }}
    >
      <TextInput
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        style={{ width: '95vw' }}
        icon={<Search />}
        radius="xl"
        size="md"
      />
      {activeSearch && (
        <XCircleFill
          fontSize={20}
          style={{ right: 33, position: 'relative' }}
          onClick={() => {
            setSearchQuery('');
          }}
        />
      )}
    </div>
    // </div>
  );
}

export default SearchBar;
