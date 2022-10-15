import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import './App.scss';
import Lists from './pages/Lists';
import ListStats from './pages/ListStats';
import Login from './pages/Login';
import MovieDetails from './pages/MovieDetails';
import NewList from './pages/NewList';
import SelectedList from './pages/SelectedList';
import Settings from './pages/Settings';
import { API } from './util/api';

function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/login') {
      API.getStats().catch(() => {
        window.location.replace('/login');
      });
    }
  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Lists />} />
        <Route path="login" element={<Login />} />
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
