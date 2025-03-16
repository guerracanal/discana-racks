import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useFetchAlbums } from "./hooks/useFetchAlbums";
import { useFetchRacks } from "./hooks/useFetchRacks";
import AlbumsPage from "./pages/AlbumsPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              useFetchAlbumsHook={(albums_collection: string, endpoint: string, random: boolean) => useFetchAlbums(albums_collection, endpoint, random)}
              useFetchRacksHook={(racks_collection: string) => useFetchRacks(racks_collection)}
              albums_collection="albums"
              racks_collection="racks"
              random={true}
            />
          }
        />
        <Route
          path="/pendientes"
          element={
            <HomePage
              useFetchAlbumsHook={(albums_collection: string, endpoint: string, random: boolean) => useFetchAlbums(albums_collection, endpoint, random)}
              useFetchRacksHook={(racks_collection: string) => useFetchRacks(racks_collection)}
              albums_collection="albums_ptes"
              racks_collection="racks_ptes" 
              random={false}            
            />
          }
        />
        <Route
          path="/types"
          element={
            <HomePage
              useFetchAlbumsHook={(albums_collection: string, endpoint: string, random: boolean) => useFetchAlbums(albums_collection, endpoint, random)}
              useFetchRacksHook={(racks_collection: string) => useFetchRacks(racks_collection)}
              albums_collection="albums"
              racks_collection="racks_types"
              random={true}            
            />
          }
        />
        <Route path="/ap/:albums_collection/*" element={<AlbumsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
