import React, { JSX, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useFetchAlbumDetail } from "../hooks/useFetchAlbumDetail";
import LoadingPopup from "../components/LoadingPopup";
import Header from "../components/Header";
import { FaArrowLeft, FaSpotify, FaLastfm, FaExclamationTriangle } from "react-icons/fa";
import { SiDiscogs } from "react-icons/si";
import cdIcon from "../assets/icons/cd.png";
import vinylIcon from "../assets/icons/vinyl.png";
import cardIcon from "../assets/card.svg";

const getFlagEmoji = (countryCode: string) => {
  if (countryCode.toUpperCase() === "GB-SCT") {
    return "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}";
  }
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

const getFormatIcons = (formats: string[] | undefined) => {
  const icons: JSX.Element[] = [];
  const iconSize = "w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28";

  const formatIcons = [
    { format: "CD", icon: cdIcon },
    { format: "vinilo", icon: vinylIcon },
    { format: "Vinyl", icon: vinylIcon },
    { format: "card", icon: cardIcon },
  ];

  formatIcons.forEach(({ format, icon }) => {
    if (formats?.includes(format)) {
      icons.push(
        <img key={format} src={icon} alt={format} className={iconSize} />
      );
    }
  });

  return icons;
};

const AlbumDetail: React.FC = () => {
  const { artistSlug, albumSlug } = useParams(); 
  const [searchParams] = useSearchParams(); 
  const navigate = useNavigate();

  const artist = artistSlug?.replace(/-/g, " ") || searchParams.get("artist") || undefined;
  const title = albumSlug?.replace(/-/g, " ") || searchParams.get("title") || undefined;
  const albums_collection = searchParams.get("albums_collection") || "albums"; // Default to "albums"

  const { album, loading, error } = useFetchAlbumDetail(albums_collection, artist, title);

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/"); 
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Manejar otros errores (por ejemplo, errores de red).
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

  const fallbackImage =
    album.image ||
    album.spotify?.image || 
    album.lastfm?.image?.find((img) => img.size === "extralarge")?.["#text"] ||
    album.discogs?.image ||
    ""; 

  const fallbackDateRelease =
    album.date_release ||
    album.spotify?.date_release ||
    album.discogs?.date_release;

  const fallbackGenres =
    album.genre?.join(", ") ||
    album.spotify?.genre?.join(", ") ||
    (Array.isArray(album.lastfm?.tags?.tag)
      ? album.lastfm.tags.tag.map((tag) => tag.name).join(", ")
      : "") ||
    album.discogs?.genre?.join(", ");

  const fallbackSubgenres =
    album.subgenres?.join(", ") ||
    album.discogs?.genre?.join(", ") ||
    "";

  const fallbackDuration =
    album.duration ||
    (Array.isArray(album.discogs?.tracklist)
      ? Math.floor(
          album.discogs.tracklist.reduce((total, track) => total + (track.duration || 0), 0) / 60
        )
      : "N/A");

  const fallbackTracks = Array.isArray(album.lastfm?.tracks?.track)
    ? album.lastfm.tracks.track
    : Array.isArray(album.spotify?.tracks)
    ? album.spotify.tracks
    : Array.isArray(album.discogs?.tracklist)
    ? album.discogs.tracklist
    : [];

  return (
    <>
      <Header />
      <div
        className="popup-container"
        style={{
          position: "relative",
          overflow: "visible",
          marginTop: "80px",
          paddingTop: "0px",
        }}
      >
        <header className="sticky top-16 left-0 right-0 z-40 bg-gray-800 shadow-lg h-16 flex items-center popup-header">
          <button onClick={handleBackNavigation} className="cursor-pointer text-white ml-4">
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white mx-auto">
            {album.artist || album.spotify?.artist || album.lastfm?.artist} -{" "}
            {album.title || album.spotify?.title || album.lastfm?.name}
          </h1>
        </header>

        <div className="mx-auto rounded-lg shadow-lg p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="flex flex-col items-center">
              <img
                src={fallbackImage}
                alt={album.title || "Álbum"}
                className="w-full max-w-[500px] max-h-[500px] h-auto rounded-lg mb-4"
              />
              <div className="flex gap-4 justify-center mb-4">
                {(album.spotify_link || album.spotify?.spotify_link) && (
                  <a
                    href={album.spotify_link || album.spotify?.spotify_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1ED760] hover:underline"
                  >
                    <FaSpotify className="w-15 h-15" />
                  </a>
                )}
                {(album.discogs_link || album.discogs?.discogs_link) && (
                  <a
                    href={album.discogs_link || album.discogs?.discogs_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:underline"
                  >
                    <SiDiscogs className="w-15 h-15" />
                  </a>
                )}
                {album.lastfm?.url && (
                  <a
                    href={album.lastfm.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:underline"
                  >
                    <FaLastfm className="w-15 h-15" />
                  </a>
                )}
              </div>
            </div>
            {/* Columna derecha */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl font-bold mb-2">
                {album.title || album.spotify?.title || album.lastfm?.name}
              </h1>
              <h2 className="text-2xl text-gray-400 mb-4">
                {album.artist || album.spotify?.artist || album.lastfm?.artist}
              </h2>
              <div className="mb-4 flex gap-4">
                {album.country && <span className="text-8xl">{getFlagEmoji(album.country)}</span>}
                <div className="flex gap-2">{getFormatIcons(album.format)}</div>
              </div>
              <div className="mb-4">
                {fallbackDateRelease && (
                  <p>
                    <strong>Fecha de lanzamiento:</strong> {fallbackDateRelease}
                  </p>
                )}
                {fallbackGenres && (
                  <p>
                    <strong>Género:</strong> {fallbackGenres}
                  </p>
                )}
                {fallbackSubgenres && (
                  <p>
                    <strong>Subgéneros:</strong> {fallbackSubgenres}
                  </p>
                )}
                {fallbackDuration && (
                  <p>
                    <strong>Duración:</strong> {fallbackDuration} minutos
                  </p>
                )}
                {(album.mood ?? []).length > 0 && (
                  <p>
                    <strong>Estado de ánimo:</strong> {(album.mood ?? []).join(", ")}
                  </p>
                )}
              </div>
              {album.lastfm?.wiki?.summary && (
                <div className="mb-4">
                  <strong>Descripción:</strong>
                  <p dangerouslySetInnerHTML={{ __html: album.lastfm.wiki.summary }} />
                </div>
              )}
            </div>
          </div>
          {/* Segunda fila: Tracklist y botones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Columna izquierda: Tracklist */}
            <div>
              <table className="w-[90%] mx-auto text-base text-left text-gray-300 mt-4 border-collapse border border-gray-700 rounded-lg overflow-hidden">
                <tbody>
                  <tr className="bg-gray-800 text-gray-100">
                    <td className="px-4 py-3 text-center font-bold text-xl" colSpan={3}>
                      Tracklist
                    </td>
                  </tr>
                  {fallbackTracks.length > 0 ? (
                    fallbackTracks.map((track, index) => (
                      <tr
                        key={track.name || index}
                        className={`${
                          index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                        } hover:bg-gray-600`}
                      >
                        <td className="px-4 py-2 text-center border border-gray-700">{index + 1}</td>
                        <td className="px-4 py-2 border border-gray-700">
                          {track.url ? (
                            <a
                              href={track.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline"
                            >
                              {track.name}
                            </a>
                          ) : (
                            track.name
                          )}
                        </td>
                        <td className="px-4 py-2 text-center border border-gray-700">
                          {track.duration
                            ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, "0")} min`
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-6 text-center text-gray-400" colSpan={3}>
                        No hay datos disponibles.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Columna derecha: Botones */}
            <div className="flex flex-col gap-4 justify-center items-center">
              <button
                className="bg-gray-600 text-gray-400 cursor-not-allowed p-3 rounded-lg shadow-md w-full"
                disabled
              >
                Hacer scrobble
              </button>
              <button
                className="bg-gray-600 text-gray-400 cursor-not-allowed p-3 rounded-lg shadow-md w-full"
                disabled
              >
                Guardar en colección personal
              </button>
              <button
                className="bg-gray-600 text-gray-400 cursor-not-allowed p-3 rounded-lg shadow-md w-full"
                disabled
              >
                Generar carta
              </button>
              <button
                className="bg-gray-600 text-gray-400 cursor-not-allowed p-3 rounded-lg shadow-md w-full"
                disabled
              >
                Añadir a colección
              </button>
              <button
                className="bg-gray-600 text-gray-400 cursor-not-allowed p-3 rounded-lg shadow-md w-full"
                disabled
              >
                Escuchar luego
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 focus:outline-none"
        aria-label="Scroll to top"
      >
        <FaArrowLeft size={20} />
      </button>
    </>
  );
};

export default AlbumDetail;
