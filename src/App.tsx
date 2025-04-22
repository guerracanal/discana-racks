import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useFetchAlbums } from "./hooks/useFetchAlbums";
import { useFetchRacks } from "./hooks/useFetchRacks";
import AlbumsPage from "./pages/AlbumsPage";
import ScrollToTopButton from "./components/ScrollToTopButton";
import AlbumDetail from "./pages/AlbumDetail";

const App: React.FC = () => {
  return (
    <div>
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
          <Route path="/ap/:albums_collection" element={<AlbumsPage />} />
          <Route path="/ap/albums" element={<AlbumsPage />} />
          <Route
            path="/spotify"
            element={
              <HomePage
                useFetchAlbumsHook={(albums_collection: string, endpoint: string, random: boolean) =>
                  useFetchAlbums(albums_collection, endpoint, random)
                }
                useFetchRacksHook={(racks_collection: string) => useFetchRacks(racks_collection)}
                albums_collection="spotify"
                racks_collection="racks_spotify"
                random={false}
              />
            }
          />
          <Route
            path="/lastfm"
            element={
              <HomePage
                useFetchAlbumsHook={(albums_collection: string, endpoint: string, random: boolean) =>
                  useFetchAlbums(albums_collection, endpoint, random)
                }
                useFetchRacksHook={(racks_collection: string) => useFetchRacks(racks_collection)}
                albums_collection="lastfm"
                racks_collection="racks_lastfm"
                random={false}
              />
            }
          />
          <Route
            path="/discogs"
            element={
              <HomePage
                useFetchAlbumsHook={(albums_collection: string, endpoint: string, random: boolean) =>
                  useFetchAlbums(albums_collection, endpoint, random)
                }
                useFetchRacksHook={(racks_collection: string) => useFetchRacks(racks_collection)}
                albums_collection="discogs"
                racks_collection="racks_discogs"
                random={false}
              />
            }
          />
          <Route path="/album/:artistSlug/:albumSlug" element={<AlbumDetail />} />
          <Route path="/album/detail" element={<AlbumDetail />} />
        </Routes>
      </Router>
      <ScrollToTopButton />
    </div>
  );
};

export default App;
