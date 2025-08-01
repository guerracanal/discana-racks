import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useFetchAlbums } from "./hooks/useFetchAlbums";
import { useFetchRacks } from "./hooks/useFetchRacks";
import AlbumsPage from "./pages/AlbumsPage";
import ScrollToTopButton from "./components/ScrollToTopButton";
import AlbumDetail from "./pages/AlbumDetail";
import RandomAlbumRedirect from "./components/RandomAlbumRedirect";


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
          <Route path=":albums_collection/album/:artistSlug?/:albumSlug?/db/:id" element={<AlbumDetail />} />
          <Route path=":albums_collection/album/:artistSlug?/:albumSlug?/mbid/:mbid" element={<AlbumDetail />} />
          <Route path=":albums_collection/album/:artistSlug?/:albumSlug?/spotify/:spotifyId" element={<AlbumDetail />} />
          <Route path=":albums_collection/album/:artistSlug?/:albumSlug?/discogs/:discogsId" element={<AlbumDetail />} />
          <Route path=":albums_collection/album/:artistSlug/:albumSlug" element={<AlbumDetail />} />
          <Route path=":albums_collection/album/detail" element={<AlbumDetail />} />
          <Route path="/ramdom" element={<RandomAlbumRedirect albumsCollection="albums" />} />
          <Route path="/ramdom-p" element={<RandomAlbumRedirect albumsCollection="albums_ptes" />} />

        </Routes>
      </Router>
      <ScrollToTopButton />
    </div>
  );
};

export default App;
