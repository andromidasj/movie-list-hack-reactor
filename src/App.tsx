import { Route, Routes } from "react-router-dom";

import "./App.scss";
import Lists from "./pages/Lists.jsx";
import ListStats from "./pages/ListStats.jsx";
import Login from "./pages/Login.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import NewList from "./pages/NewList.jsx";
import SelectedList from "./pages/SelectedList.jsx";
import Settings from "./pages/Settings.jsx";

function App() {
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
