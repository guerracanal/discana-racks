import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaSync, FaBolt } from 'react-icons/fa';
import { GiJapan, GiNightSleep, GiSpain } from "react-icons/gi";
import { TbTimeDuration30, TbTimeDuration60, TbTimeDuration10 } from "react-icons/tb";
import { MdNewReleases } from "react-icons/md";
import { useFetchAlbums } from '../hooks/useFetchAlbums';
import { useFetchAlbumDetail } from '../hooks/useFetchAlbumDetail';
import AlbumDetailView from '../components/AlbumDetailView';
import LoadingPopup from '../components/LoadingPopup';
import '../styles/RandomAlbumPage.css';

import cdIcon from '../assets/icons/cd.png';
import vinylIcon from '../assets/icons/vinyl.png';

// --- Nuevo componente Toggle ---
const CollectionToggle: React.FC<{ baseCollection: string }> = ({ baseCollection }) => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(baseCollection);

  const handleToggle = () => {
    const next = current === "albums" ? "pendientes" : "albums";
    setCurrent(next);
    navigate(`/random/${next}`);
  };

  return (
    <button
      onClick={handleToggle}
      className="cursor-pointer text-2xl sm:text-3xl font-bold bg-gray-700 text-white px-4 py-1 rounded-full hover:bg-gray-600 transition"
    >
      {current === "albums" ? "Colección: Albums" : "Colección: Pendientes"}
    </button>
  );
};

// --- Resto de tu código igual ---
const useAlbumEndpoint = (params: any): string => {
  const { albums_collection, ...filters } = params;

  if (!Object.values(filters).some(value => value)) {
    return albums_collection;
  }

  const filterParts = Object.entries(filters)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}/${value}`);

  return `${albums_collection}/${filterParts.join('/')}`;
};

const AlbumDetailRenderer: React.FC<{ albumId: string; albumsCollection: string }> = ({ albumId, albumsCollection }) => {
  const { album, loading, error } = useFetchAlbumDetail(
    albumsCollection,
    undefined,
    undefined,
    albumId,
    undefined,
    undefined,
    undefined
  );

  if (loading) return <LoadingPopup isLoading={true} />;
  if (error) return <div>Error al cargar el álbum: {error}</div>;
  if (!album) return <div>No se pudo cargar el álbum.</div>;

  return <AlbumDetailView album={album} albumsCollection={albumsCollection} />;
};

const RandomAlbumPage: React.FC = () => {
  const params = useParams<any>();

  if (!params.albums_collection) {
    return <div>Error: No se especificó una colección de álbumes.</div>;
  }

  const endpoint = useAlbumEndpoint(params);
  const baseCollection = params.albums_collection;

  const { albums, loading, error } = useFetchAlbums(endpoint);
  const [randomAlbumId, setRandomAlbumId] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleReload = () => setReloadTrigger(prev => prev + 1);

  useEffect(() => {
    if (!loading && albums && albums.length > 0) {
      const randomIndex = Math.floor(Math.random() * albums.length);
      const randomAlbum = albums[randomIndex];
      if (randomAlbum?._id) setRandomAlbumId(randomAlbum._id);
    }
  }, [loading, albums, reloadTrigger]);

  if (loading) return <LoadingPopup isLoading={true} />;
  if (error) return <div>Error al obtener álbumes: {error}</div>;

  const filterInfo = Object.entries(params)
    .filter(([key, value]) => key !== 'albums_collection' && value)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  if (albums.length === 0) {
    return (
      <div>
        No se encontraron álbumes para la colección "{baseCollection}"
        {filterInfo && ` con filtros: ${filterInfo}`}
      </div>
    );
  }

  return (
    <div>
      <header className="
  grid grid-cols-1 gap-y-2 
  sm:grid-cols-3 sm:gap-y-0 
  items-center 
  px-4 py-2 bg-gray-800 shadow-lg sticky top-16 z-40 
  min-h-24 sm:h-16
">
        {/* FILA 1: iconos */}
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start sm:col-span-1">
          <Link to={`/random/albums/format/vinilo`}>
            <img src={vinylIcon} alt="Vinilo" className="icon w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
          </Link>
          <Link to={`/random/albums/format/CD`}>
            <img src={cdIcon} alt="CD" className="icon w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
          </Link>
          <Link to={`/random/${baseCollection}/compilations/relax`}>
            <GiNightSleep size={24} className="mood-icon" />
          </Link>
          <Link to={`/random/${baseCollection}/compilations/energic`}>
            <FaBolt size={24} className="mood-icon" />
          </Link>
          <Link to={`/random/${baseCollection}/duration_max/10`}>
            <TbTimeDuration10 size={24} className="mood-icon" />
          </Link>
          <Link to={`/random/${baseCollection}/duration/10/30`}>
            <TbTimeDuration30 size={24} className="mood-icon" />
          </Link>
          <Link to={`/random/${baseCollection}/duration_min/60`}>
            <TbTimeDuration60 size={24} className="mood-icon" />
          </Link>
          <Link to={`/random/${baseCollection}/country/es`}>
            <GiSpain size={24} className="mood-icon" />
          </Link>
          <Link to={`/random/${baseCollection}/country/jp`}>
            <GiJapan size={24} className="mood-icon" />
          </Link>
          <Link to={`/random/${baseCollection}/releases/366`}>
            <MdNewReleases size={24} className="mood-icon" />
          </Link>
        </div>

        {/* FILA 2: interruptor + filtros */}
        <div className="flex flex-col sm:flex-row items-center justify-center sm:col-span-1 sm:col-start-2">
          <CollectionToggle baseCollection={baseCollection} />
          {filterInfo && <span className="m-2 bg-gray-900 text-white px-4 py-1 rounded-full text-gray-300 text-2xl sm:text-3xl">{filterInfo}</span>}
        </div>

        {/* en escritorio el botón reload va en la tercera columna */}
        <div className="hidden sm:flex justify-end">
          <button
            onClick={handleReload}
            className="p-2 text-gray-300 hover:text-gray-600 cursor-pointer"
            title="Cargar otro álbum aleatorio"
          >
            <FaSync size={24} />
          </button>
        </div>
      </header>


      {randomAlbumId ? (
        <AlbumDetailRenderer albumId={randomAlbumId} albumsCollection={baseCollection} />
      ) : (
        <div>Seleccionando un álbum aleatorio...</div>
      )}
    </div>
  );
};

export default RandomAlbumPage;
