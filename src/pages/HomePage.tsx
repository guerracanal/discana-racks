import Header from "../components/Header";
import LazyRack from "../components/LazyRack";
import { Rack } from "../types/rack";
import { HomePageProps } from "../types/home";


import { FC } from "react";



const HomePage: FC<HomePageProps> = ({ useFetchAlbumsHook, useFetchRacksHook }) => {
  const OPTIONS = {
    align: "start",
    dragFree: true,
    loop: true,
  };

  const { racks, loading, error } = useFetchRacksHook();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        {/* Puedes reutilizar aquí el spinner de carga */}
        <div className="text-center text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto animate-spin text-gray-400"
            viewBox="0 0 64 64"
          >
            <g transform="rotate(-10 32 32)">
              <rect
                x="12"
                y="10"
                width="40"
                height="44"
                rx="6"
                ry="6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </g>
            <g>
              <circle
                cx="32"
                cy="32"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M32 22 a10 10 0 0 1 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <path
                d="M32 24 a8 8 0 0 1 0 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
              />
              <circle
                cx="32"
                cy="32"
                r="3"
                fill="currentColor"
                stroke="none"
              />
            </g>
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-400">Cargando colección...</p>
        </div>
      </div>
    );
  }

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
            />
          ))}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
