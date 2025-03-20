import Header from "../components/Header";
import LazyRack from "../components/LazyRack";
import { Rack } from "../types/rack";
import { HomePageProps } from "../types/home";
import { FC } from "react";
import LoadingPopup from "../components/LoadingPopup";

interface HomePagePropsExtended extends HomePageProps {
  albums_collection: string;
  racks_collection: string;
  random: boolean;
}

const HomePage: FC<HomePagePropsExtended> = ({ useFetchAlbumsHook, useFetchRacksHook, albums_collection, racks_collection, random }) => {

  const OPTIONS = {
    align: "start",
    dragFree: true,
    loop: true,
  };

  const { racks, loading, error } = useFetchRacksHook(racks_collection);

  <LoadingPopup isLoading={loading} />

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto text-red-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="8" />
          </svg>
          <p className="mt-4 text-lg font-semibold text-red-400">
            Error cargando: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      {/* Espacio para evitar que el contenido quede tapado por el header */}
      <div className="pt-16">
        <main className="p-4">
          {racks.map((rack: Rack) => (
            <LazyRack
              key={rack.title}
              rack={rack}
              options={OPTIONS}
              fetchAlbumsHook={useFetchAlbumsHook}
              rack_collection={racks_collection} 
              albums_collection={albums_collection}
              random={random} />
          ))}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
