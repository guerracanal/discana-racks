import React, { JSX, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useFetchAlbumDetail } from "../hooks/useFetchAlbumDetail";
import LoadingPopup from "../components/LoadingPopup";
import Header from "../components/Header";
import { FaArrowLeft, FaSpotify, FaLastfm, FaExclamationTriangle, FaCalendarAlt, FaClock, FaMusic } from "react-icons/fa";
import { SiDiscogs, SiGenius, SiMusicbrainz } from "react-icons/si";
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

const getYearIcon = (dateRelease: string | undefined) => {
  if (!dateRelease || typeof dateRelease !== "string") return null; // Validar que dateRelease sea una cadena
  const year = dateRelease.includes("/") ? dateRelease.split("/").pop() : dateRelease; // Extraer el año o usar directamente
  if (!year || isNaN(Number(year))) return null; // Validar que el año sea un número
  return (
    <div className="flex items-center justify-center bg-blue-600 text-white w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full shadow-md">
      <span className="text-3xl font-bold">{year}</span>
    </div>
  );
};

const getDurationIcon = (duration: number | undefined) => {
  if (!duration || typeof duration !== "number" || duration <= 0) return null; // Validar que duration sea un número válido
  return (
    <div className="flex items-center justify-center bg-green-600 text-white w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full shadow-md">
      <span className="text-3xl font-bold">{duration}m</span>
    </div>
  );
};

const renderDiscogsFormats = (formats: any[] | undefined) => {
  if (!formats || formats.length === 0) return null;

  const getFormatIcon = (name: string) => {
    if (name.toLowerCase().includes("vinyl")) return vinylIcon;
    if (name.toLowerCase().includes("cd")) return cdIcon;
    return cardIcon; // Icono genérico si no es CD ni Vinilo
  };

  return (
    <div id="discogs" className="flex flex-col gap-4 p-4 bg-gray-800 text-white rounded-lg shadow-md col-span-3">
      <div className="flex items-center gap-4">
        <SiDiscogs className="w-8 h-8 text-black" />
        <h3 className="text-lg font-bold">Ediciones en tu colección:</h3>
      </div>
      <div className="flex flex-wrap gap-6 mt-4 justify-center">
        {formats.map((format, formatIndex) => (
          <a
            key={format.id || `format-${formatIndex}`}
            href={format.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center border border-gray-700 rounded-lg p-4 w-48 bg-gray-900 shadow-md hover:bg-gray-700 transition-colors"
          >
            {Array.isArray(format.formats) &&
              format.formats.map((f: any, index: number) => (
                <div key={`${format.id || formatIndex}-format-${index}`} className="flex flex-col items-center">
                  <img
                    src={getFormatIcon(f.name)}
                    alt={f.name}
                    className="w-12 h-12 mb-2"
                  />
                  <p className="text-sm text-center">
                    <strong>{f.name}</strong> {f.qty && `(${f.qty})`}
                  </p>
                  {f.text && <p className="text-xs text-gray-400">{f.text}</p>}
                  {f.descriptions && f.descriptions.length > 0 && (
                    <p className="text-xs text-gray-400">
                      {f.descriptions.join(", ")}
                    </p>
                  )}
                </div>
              ))}
          </a>
        ))}
      </div>
    </div>
  );
};

const renderInfo = (dateRelease: string | undefined, duration: number | undefined, tracks: any[]) => {
  const parts: JSX.Element[] = [];

  if (dateRelease) {
    parts.push(
      <span key="date" className="inline-flex items-center mr-2">
        <FaCalendarAlt className="mr-1" />
        {dateRelease}
      </span>
    );
  }

  if (duration) {
    parts.push(
      <span key="duration" className="inline-flex items-center mr-2">
        <FaClock className="mr-1" />
        {duration}m
      </span>
    );
  }

  if (tracks.length > 0) {
    parts.push(
      <span key="tracks" className="inline-flex items-center">
        <FaMusic className="mr-1" />
        {tracks.length}
      </span>
    );
  }

  return (
    <div className="info flex gap-2 items-center text-gray-300 flex-wrap">
      {parts}
    </div>
  );
};

const AlbumDetail: React.FC = () => {
  const { artistSlug, albumSlug, id, mbid, spotifyId, discogsId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const artist = artistSlug?.replace(/-/g, " ") || searchParams.get("artist") || undefined;
  const title = albumSlug?.replace(/-/g, " ") || searchParams.get("title") || undefined;

  const albums_collection = searchParams.get("albums_collection") || "albums"; // Default to "albums"

  // Solo realizar la llamada si al menos uno de los identificadores está definido
  const shouldFetch = artist || title || id || mbid || spotifyId || discogsId;

  const { album, loading, error } = useFetchAlbumDetail(
    albums_collection,
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

  const rateYourMusicLink = album?.musicbrainz?.relations?.find(
    (relation: { type: string; url: { resource: string | string[]; }; }) => relation.type === "other databases" && relation.url.resource.includes("rateyourmusic")
  )?.url.resource;

  const geniusLink = album?.musicbrainz?.relations?.find(
    (relation: { type: string; url: { resource: string | string[]; }; }) => relation.type === "lyrics" && relation.url.resource.includes("genius.com")
  )?.url.resource;

  const musicBrainzLink = album?.musicbrainz?.id
    ? `https://musicbrainz.org/release-group/${album.musicbrainz.id}`
    : null;

  const rateYourMusicIcon = "https://e.snmc.io/3.0/img/logo/sonemic-32.png"; // Icono de rateyourmusic

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
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

  const fallbackGenres = [
    ...(album.genre ?? []),
    ...(album.subgenres ?? []),
    ...(album.discogs?.genre ?? []),
    ...(album.discogs?.subgenres ?? []),
    ...(Array.isArray(album.musicbrainz?.genres)
      ? album.musicbrainz.genres.map((genre: string | { name: string }) =>
        typeof genre === "string" ? genre : genre.name
      )
      : []),
  ].filter(
    (value, index, self) =>
      self.findIndex((v) => v.toLowerCase() === value.toLowerCase()) === index
  ); // Eliminar duplicados ignorando mayúsculas y minúsculas

  const fallbackDuration =
    typeof album.duration === "number" && album.duration > 0
      ? Math.round(album.duration) // Redondear duración principal
      : typeof album.spotify?.duration === "number" && album.spotify.duration > 0
        ? Math.round(album.spotify.duration) // Redondear duración de Spotify
        : Array.isArray(album.discogs?.tracklist)
          ? Math.floor(
            album.discogs.tracklist.reduce((total, track) => total + (track.duration || 0), 0) / 60
          )
          : null; // Asegurarse de que fallbackDuration sea null si no es válido

  const fallbackTracks = Array.isArray(album.spotify?.track_details)
    ? album.spotify.track_details.map((track) => ({
      name: track.name,
      duration: Math.floor(track.duration_ms / 1000), // Convertir ms a segundos
      url: track.uri ? `https://open.spotify.com/track/${track.id}` : null,
    }))
    : Array.isArray(album.lastfm?.tracks?.track)
      ? album.lastfm.tracks.track
      : Array.isArray(album.discogs?.tracklist)
        ? album.discogs.tracklist
        : [];

  const fallbackTags = [
    ...(Array.isArray(album.musicbrainz?.tags)
      ? album.musicbrainz.tags.map((tag: { name: string }) => tag.name)
      : []),
  ].filter(
    (value, index, self) =>
      self.findIndex((v) => v.toLowerCase() === value.toLowerCase()) === index
  ); // Eliminar duplicados ignorando mayúsculas y minúsculas

  const MAX_TAGS = 10; // Máximo de etiquetas permitidas
  const MAX_TAG_LENGTH = 20; // Longitud máxima de una etiqueta

  const filteredTags = fallbackTags
    .filter((tag) => tag.length <= MAX_TAG_LENGTH) // Omitir etiquetas demasiado largas
    .slice(0, MAX_TAGS); // Limitar a las 10 primeras

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
          <div
            className="grid grid-cols-1 md:grid-cols-5 gap-6"
            style={{ gridAutoRows: "min-content" }} // Asegura que las filas se ajusten a su contenido
          >
            {/* Columna izquierda */}
            <div id="cover" className="flex flex-col items-center w-full col-span-2">
              <img
                src={fallbackImage}
                alt={album.title || "Álbum"}
                className="w-full max-w-[500px] max-h-[500px] h-auto rounded-lg mb-4"
              />
              <div className="flex gap-4 justify-center mb-4" id="links">
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
                {rateYourMusicLink && (
                  <a
                    href={rateYourMusicLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    <img src={rateYourMusicIcon} alt="RateYourMusic" className="w-15 h-15" />
                  </a>
                )}
                {geniusLink && (
                  <a
                    href={geniusLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    <SiGenius className="w-15 h-15" />
                  </a>
                )}
                {musicBrainzLink && (
                  <a
                    href={musicBrainzLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline"
                  >
                    <SiMusicbrainz className="w-15 h-15" />
                  </a>
                )}
              </div>
            </div>
            {/* Columna derecha */}
            <div id="details" className="flex flex-col justify-center w-full col-span-3">
              <div className="flex items-center justify-between mb-6" id="header">
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    {album.title || album.spotify?.title || album.lastfm?.name}
                  </h1>
                  <h2 className="text-3xl text-gray-400 mt-2">
                    {album.artist || album.spotify?.artist || album.lastfm?.artist}
                  </h2>
                </div>
                {album.country && <span className="text-6xl">{getFlagEmoji(album.country)}</span>}
              </div>
              <div className="mb-6 flex gap-4" id="icons">
                {getYearIcon(typeof fallbackDateRelease === "string" ? fallbackDateRelease : undefined)}
                {getDurationIcon(typeof fallbackDuration === "number" ? fallbackDuration : undefined)}
                <div className="flex gap-2">{getFormatIcons(album.format)}</div>
              </div>

              <div className="mb-6 space-y-6">
                {renderInfo(
                  typeof fallbackDateRelease === "string" ? fallbackDateRelease : undefined,
                  typeof fallbackDuration === "number" ? fallbackDuration : undefined,
                  fallbackTracks
                )}
                {fallbackGenres.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold">
                        {fallbackGenres[0]}
                      </span>
                      {fallbackGenres.slice(1).map((genre, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {Array.isArray(album.mood) && album.mood.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-2 mt-2 text-lg">
                      {album.mood.map((mood, index) => (
                        <span key={index} className="bg-green-600 text-white px-3 py-1 rounded-lg">
                          {mood}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {filteredTags.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-2 mt-2 text-lg">
                      {filteredTags.map((tag, index) => (
                        <span key={index} className="bg-purple-600 text-white px-3 py-1 rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div id="description" className="p-4 bg-gray-800 rounded-lg shadow-md w-full">
                {album.lastfm?.wiki?.summary ? (
                  <p
                    className="text-gray-300 mt-2 text-xl leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: album.lastfm.wiki.summary }}
                  />
                ) : (
                  <p className="text-gray-400">No hay descripción disponible para este álbum.</p>
                )}
              </div>
            </div>
          </div>

          {/* Nueva fila */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
            {/* Columna izquierda: Cajas de Spotify, Last.fm y Discogs */}
            <div id="services" className="flex flex-col gap-4 w-full max-w-[500px] mx-auto col-span-2">
              {album.spotify?.is_saved && (
                <div className="flex items-center gap-4 p-4 bg-green-600 text-black rounded-lg shadow-md">
                  <FaSpotify className="w-8 h-8" />
                  <div>
                    <p className="text-lg font-bold">Este álbum está guardado en tu Spotify.</p>
                    {album.spotify?.recently_listened && (
                      <p className="text-lg">Escuchado recientemente.</p>
                    )}
                    {album.spotify?.last_listened_date && (
                      <p className="text-lg">
                        Última escucha:{" "}
                        {new Date(album.spotify.last_listened_date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {album.lastfm && (
                <div className="flex items-center gap-4 p-4 bg-red-600 text-white rounded-lg shadow-md">
                  <FaLastfm className="w-8 h-8" />
                  <div className="text-lg">
                    {album.lastfm?.album_playcount !== undefined && album.lastfm.album_playcount > 0 && (
                      <p className="text-lg font-bold">
                        <strong>Escuchaste este álbum {Math.round(album.lastfm.album_playcount)} veces</strong>
                      </p>
                    )}
                    {album.lastfm?.user_scrobbles !== undefined && album.lastfm.user_scrobbles > 0 && (
                      <p>
                        <strong>Scrobbles:</strong> {album.lastfm.user_scrobbles}
                      </p>
                    )}
                    {album.lastfm?.user_most_listened_track?.name && album.lastfm.user_most_listened_track.user_playcount !== undefined && (
                      <p>
                        Tú canción más escuchada es <strong>{album.lastfm.user_most_listened_track.name}{" "}</strong>
                        ({album.lastfm.user_most_listened_track.user_playcount} veces)
                      </p>
                    )}
                    {album.lastfm?.listeners && (
                      <p>
                        Hay {album.lastfm.listeners} oyentes que han scrobleado{" "}
                        {album.lastfm.playcount ? album.lastfm.playcount : "un número desconocido"} veces este álbum.
                      </p>
                    )}
                    {album.lastfm?.total_most_listened_track?.name && (
                      <p>
                        La canción más popular es <strong>{album.lastfm.total_most_listened_track.name}{" "}</strong> con {album.lastfm.total_most_listened_track.total_playcount || 0} reproducciones
                      </p>
                    )}
                    {album.lastfm?.recently_listened && (
                      <p>
                        <strong>Escuchado recientemente.</strong>
                      </p>
                    )}
                    {album.lastfm?.last_listened_date && (
                      <p>
                        <strong>Última escucha:</strong>{" "}
                        {new Date(album.lastfm.last_listened_date).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Columna derecha: Descripción */}
            {album.discogs?.formats && renderDiscogsFormats(album.discogs.formats)}

          </div>

          {/* Segunda fila: Tracklist y iframe */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
            {/* Columna izquierda: Tracklist */}
            <div id="tracklist" className="self-start w-full max-w-[500px] mx-auto col-span-2">
              <table className="w-full max-w-[500px] mx-auto text-base text-left text-gray-300 mt-4 border-collapse border border-gray-700 rounded-lg overflow-hidden shadow-lg table-fixed">
                <thead>
                  <tr className="bg-gray-800 text-gray-100">
                    <th className="px-4 py-3 text-center font-bold text-lg w-1/12">#</th>
                    <th className="px-4 py-3 font-bold text-lg w-7/12">Título</th>
                    <th className="px-4 py-3 text-center font-bold text-lg w-4/12">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  {fallbackTracks.length > 0 ? (
                    fallbackTracks.map((track, index) => (
                      <tr
                        key={track.name || index}
                        className={`${index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                          } hover:bg-gray-600 transition-colors`}
                      >
                        <td className="px-4 py-2 text-center border border-gray-700 font-medium align-top">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 border border-gray-700 align-top">
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
                        <td className="px-4 py-2 text-center border border-gray-700 font-medium align-top">
                          {track.duration
                            ? `${Math.floor(track.duration / 60)}:${String(track.duration % 60).padStart(2, "0")} min`
                            : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="px-4 py-6 text-center text-gray-400 font-medium"
                        colSpan={3}
                      >
                        No hay datos disponibles.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Columna derecha: Iframe */}
            <div id="iframe" className="w-full mx-auto col-span-3">
              {album.spotify?.spotify_link && (
                <iframe
                  src={`https://open.spotify.com/embed/album/${album.spotify?.spotify_id}`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="encrypted-media"
                  title="Spotify Album Widget"
                  className="rounded-lg shadow-md"
                ></iframe>
              )}
            </div>
          </div>

          {/* Nueva fila: Botones */}
          <div className="grid grid-cols-1 mt-6">
            <div id="buttons" className="flex flex-col gap-4 items-center w-full mx-auto">
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
    </>
  );
};

export default AlbumDetail;
