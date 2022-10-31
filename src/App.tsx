import { useQuery } from '@tanstack/react-query';
import { Route, Routes } from 'react-router-dom';
import './App.scss';
import Lists from './pages/Lists';
import ListStats from './pages/ListStats';
import MovieDetails from './pages/MovieDetails';
import NewList from './pages/NewList';
import SelectedList from './pages/SelectedList';
import Settings from './pages/Settings';
import { API } from './util/api';

function App() {
  const { data, isLoading, isError } = useQuery(['account'], API.getAccount);

  if (isLoading || isError) return <p>...</p>;

  localStorage.setItem('tmdb_account_id', data.data.id);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Lists />} />
        <Route path="settings" element={<Settings />} />
        <Route path="list" element={<SelectedList />} />
        <Route path="list/stats" element={<ListStats />} />
        <Route path="new-list" element={<NewList />} />
        <Route path="movie/:movieId" element={<MovieDetails />} />
      </Routes>
    </div>
  );
}

export default App;
