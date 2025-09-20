import React, { useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useFetchAlbumDetail } from "../hooks/useFetchAlbumDetail";
import LoadingPopup from "../components/LoadingPopup";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import AlbumDetailView from "../components/AlbumDetailView";
import Header from "../components/Header";

const AlbumDetail: React.FC = () => {
  const { artistSlug, albumSlug, id, mbid, spotifyId, discogsId, albums_collection } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const artist = artistSlug?.replace(/-/g, " ") || searchParams.get("artist") || undefined;
  const title = albumSlug?.replace(/-/g, " ") || searchParams.get("title") || undefined;

  const albumsCollection = albums_collection || searchParams.get("albums_collection") || "albums";

  const shouldFetch = artist || title || id || mbid || spotifyId || discogsId;

  const { album, loading, error } = useFetchAlbumDetail(
    albumsCollection,
    artist,
    title,
    id,
    mbid,
    spotifyId,
    discogsId
  );

  useEffect(() => {
    if (!shouldFetch) {
      console.error("No se proporcionaron identificadores válidos para buscar el álbum.");
    }
  }, [shouldFetch]);

  if (!shouldFetch) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-400">
        <FaExclamationTriangle className="text-6xl mb-4" />
        <p className="text-xl">No se proporcionaron datos suficientes para cargar el álbum.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none mt-6"
          aria-label="Volver"
        >
          <FaArrowLeft size={20} />
        </button>
      </div>
    );
  }

  if (loading) return <LoadingPopup isLoading={true} />;

  if (album && Object.keys(album).length === 1 && "error" in album) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center h-screen text-gray-400">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none mb-6"
            aria-label="Volver"
          >
            <FaArrowLeft size={20} />
          </button>
          <FaExclamationTriangle className="text-6xl mb-4" />
          <p className="text-xl">Álbum no encontrado.</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center h-screen text-gray-400">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none mb-6"
            aria-label="Volver"
          >
            <FaArrowLeft size={20} />
          </button>
          <FaExclamationTriangle className="text-6xl mb-4" />
          <p className="text-xl">Error cargando el álbum: {error}</p>
        </div>
      </>
    );
  }

  if (!album) return <p>Álbum no encontrado.</p>;

  return <AlbumDetailView album={album} albumsCollection={albumsCollection} />;
};

export default AlbumDetail;
