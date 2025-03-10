import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useFetchAlbums } from "./hooks/useFetchAlbums";
import { useFetchRacks } from "./hooks/useFetchRacks";
import { useFetchAlbumsPendientes } from "./hooks/useFetchAlbumsPendientes";
import { useFetchRacksPendientes } from "./hooks/useFetchRacksPendientes";
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage useFetchAlbumsHook={useFetchAlbums}
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
      </Routes>
    </Router>
  );
}

export default App;
