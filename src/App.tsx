import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useFetchAlbums } from "./hooks/useFetchAlbums";
import { useFetchRacks } from "./hooks/useFetchRacks";
import { useFetchAlbumsPendientes } from "./hooks/useFetchAlbumsPendientes";
import { useFetchRacksPendientes } from "./hooks/useFetchRacksPendientes";
import { useFetchRacksTypes } from "./hooks/useFetchRacksTypes";
import AlbumsPage from "./pages/AlbumsPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              useFetchAlbumsHook={useFetchAlbums}
              useFetchRacksHook={useFetchRacks}
            />
          }
        />
        <Route
          path="/pendientes"
          element={
            <HomePage
              useFetchAlbumsHook={useFetchAlbumsPendientes}
              useFetchRacksHook={useFetchRacksPendientes}
            />
          }
        />
        <Route
          path="/types"
          element={
            <HomePage
              useFetchAlbumsHook={useFetchAlbums}
              useFetchRacksHook={useFetchRacksTypes}
            />
          }
        />
        <Route path="/:category/*" element={<AlbumsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
