import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

// Tipos para los parámetros de filtro
interface FilterParams {
  albums_collection: string;
  format?: string;
  year?: string;
  duration?: string;
  label?: string;
  genres?: string;
  moods?: string;
  country?: string;
  artist?: string;
  title?: string;
}

// Hook personalizado para construir el endpoint basado en los filtros
const useAlbumEndpoint = (params: FilterParams): string => {
  const { albums_collection, ...filters } = params;
  
  if (!Object.values(filters).some(value => value)) {
    return albums_collection;
  }
  
  const filterParts = Object.entries(filters)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}/${value}`);
  
  return `${albums_collection}/${filterParts.join('/')}`;
};

// Componente para renderizar el detalle del álbum
const AlbumDetailRenderer: React.FC<{ 
  albumId: string; 
  albumsCollection: string;
}> = ({ albumId, albumsCollection }) => {
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
  const params = useParams<{
    albums_collection: string;
    format?: string;
    year?: string;
    duration?: string;
    label?: string;
    genres?: string;
    moods?: string;
    country?: string;
    artist?: string;
    title?: string;
  }>();

  if (!params.albums_collection) {
    return <div>Error: No se especificó una colección de álbumes.</div>;
  }

  const endpoint = useAlbumEndpoint(params as FilterParams);
  const baseCollection = params.albums_collection;

  const { albums, loading, error } = useFetchAlbums(endpoint);
  const [randomAlbumId, setRandomAlbumId] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const handleReload = () => {
    setReloadTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (!loading && albums && albums.length > 0) {
      const randomIndex = Math.floor(Math.random() * albums.length);
      const randomAlbum = albums[randomIndex];
      
      if (randomAlbum?._id) {
        setRandomAlbumId(randomAlbum._id);
      } else {
        console.error("El álbum aleatorio no tiene un ID válido:", randomAlbum);
      }
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
      <header className="grid grid-cols-3 items-center px-4 py-2 bg-gray-800 shadow-lg sticky top-16 z-40 h-16">
        <div className="flex gap-4 justify-self-start">
          <Link to={`/random/albums/format/vinilo`}>
            <img src={vinylIcon} alt="Vinilo" className="icon w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </Link>
          <Link to={`/random/albums/format/CD`} className="nav-button">
            <img src={cdIcon} alt="CD" className="icon w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
          </Link>
          <Link to={`/random/${baseCollection}/compilation/relax`} className="nav-button">
            <GiNightSleep size={24} className="mood-icon" />
          </Link>
          <Link to={`/random/${baseCollection}/compilation/energetic`} className="nav-button">
            <FaBolt size={24} className="mood-icon" />
          </Link>
          <Link to={`/random/${baseCollection}/duration_max/10`} className="nav-button">
            <TbTimeDuration10 size={24} className="mood-icon" />
          </Link>
          <Link to={`/random/${baseCollection}/duration/10/30`} className="nav-button">
            <TbTimeDuration30 size={24} className="mood-icon" />
          </Link>
          <Link to={`/random/${baseCollection}/duration_min/60`} className="nav-button">
            <TbTimeDuration60 size={24} className="mood-icon" />
          </Link>
          <Link to={`/random/${baseCollection}/country/es`} className="nav-button">
            <GiSpain size={24} className="mood-icon" />
          </Link>
            <Link to={`/random/${baseCollection}/country/jp`} className="nav-button">
            <GiJapan size={24} className="mood-icon" />
          </Link>
          <Link to={`/random/${baseCollection}/releases/366`} className="nav-button">
            <MdNewReleases size={24} className="mood-icon" />
          </Link>
        </div>
        <h1 className="justify-self-center text-center text-xl font-bold text-white">
          Álbum aleatorio de {baseCollection}
          {filterInfo && <span className="p-3 text-gray-300">{filterInfo}</span>}
        </h1>
        <button onClick={handleReload} className="justify-self-end p-2 text-gray-300 hover:text-gray-600 cursor-pointer reload-button" title="Cargar otro álbum aleatorio">
          <FaSync size={24} />
        </button>
      </header>

      {randomAlbumId ? (
        <AlbumDetailRenderer 
          albumId={randomAlbumId} 
          albumsCollection={baseCollection}
        />
      ) : (
        <div>Seleccionando un álbum aleatorio...</div>
      )}
    </div>
  );
};

export default RandomAlbumPage;
