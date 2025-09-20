import React, { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSpotify, FaLastfm, FaCalendarAlt, FaClock, FaMusic, FaTag } from "react-icons/fa";
import { SiDiscogs, SiGenius, SiMusicbrainz } from "react-icons/si";
import cdIcon from "../assets/icons/cd.png";
import vinylIcon from "../assets/icons/vinyl.png";
import cardIcon from "../assets/card.svg";
import Header from "./Header";
import { Album } from "../types/album";

const getFlagEmoji = (countryCode: string) => {
  if (countryCode.toUpperCase() === "GB-SCT") {
    return "🏴󠁧󠁢󠁳󠁣󠁴󠁿";
  }
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

const getFormatIcons = (formats: string[] | undefined, albumsCollection: string) => {
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
        <a
      href={`/ap/${albumsCollection}?endpoint=format%2F${format}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-80"
    >
        <img key={format} src={icon} alt={format} className={iconSize} />
     </a>
      );
    }
  });

  return icons;
};

const getYearIcon = (dateRelease: string | undefined, albumsCollection: string) => {
  if (!dateRelease || typeof dateRelease !== "string") return null;
  const year = dateRelease.includes("/") ? dateRelease.split("/").pop() : dateRelease;
  if (!year || isNaN(Number(year))) return null;
  return (
    <a
      href={`/ap/${albumsCollection}?endpoint=year%2F${year}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-80"
    >
      <div className="flex items-center justify-center bg-blue-600 text-white w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full shadow-md">
        <span className="text-3xl font-bold">{year}</span>
      </div>
    </a>
  );
};

const getDurationIcon = (duration: number | undefined, albumsCollection: string) => {
  if (!duration || typeof duration !== "number" || duration <= 0) return null;
  return (
    <a
      href={`/ap/${albumsCollection}?endpoint=duration%2F${duration}`}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-80"
    >
      <div className="flex items-center justify-center bg-green-600 text-white w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full shadow-md">
        <span className="text-3xl font-bold">{duration}m</span>
      </div>
    </a>
  );
};

const renderDiscogsFormats = (formats: any[] | undefined) => {
  if (!formats || formats.length === 0) return null;

  const getFormatIcon = (name: string) => {
    if (name.toLowerCase().includes("vinyl")) return vinylIcon;
    if (name.toLowerCase().includes("cd")) return cdIcon;
    return cardIcon;
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

const renderInfo = (dateRelease: string | undefined, duration: number | undefined, tracks: any[], label: string | undefined, albumsCollection: string) => {
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
      <span key="tracks" className="inline-flex items-center mr-2">
        <FaMusic className="mr-1" />
        {tracks.length}
      </span>
    );
  }

  if (label && label.trim() !== '') {
    parts.push(
      <span key="label" className="inline-flex items-center mr-2">
        <FaTag className="mr-1" />
        <a
          href={`/ap/${albumsCollection}?endpoint=label%2F${encodeURIComponent(label)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          {label}
        </a>
      </span>
    );
  }

  return (
    <div className="info flex gap-2 items-center text-gray-300 flex-wrap">
      {parts}
    </div>
  );
};

interface AlbumDetailViewProps {
    album: Album;
    albumsCollection: string;
}

const AlbumDetailView: React.FC<AlbumDetailViewProps> = ({ album, albumsCollection }) => {
    const navigate = useNavigate();

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

    const genres = album.genre ?? [];
    const subgenres = album.subgenres ?? [];

    const additionalTags = [
        ...(album.discogs?.genre ?? []),
        ...(album.discogs?.subgenres ?? []),
        ...(Array.isArray(album.musicbrainz?.genres)
        ? album.musicbrainz.genres.map((genre: string | { name: string }) =>
            typeof genre === "string" ? genre : genre.name
            )
        : []),
    ];

    const fallbackDuration =
        typeof album.duration === "number" && album.duration > 0
        ? Math.round(album.duration)
        : typeof album.spotify?.duration === "number" && album.spotify.duration > 0
            ? Math.round(album.spotify.duration)
            : Array.isArray(album.discogs?.tracklist)
            ? Math.floor(
                album.discogs.tracklist.reduce((total, track) => total + (track.duration || 0), 0) / 60
                )
            : null;

    const fallbackTracks = Array.isArray(album.spotify?.track_details)
        ? album.spotify.track_details.map((track) => ({
            name: track.name,
            duration: Math.floor(track.duration_ms / 1000),
            url: track.uri ? `https://open.spotify.com/track/${track.id}` : null,
        }))
        : Array.isArray(album.lastfm?.tracks?.track)
        ? album.lastfm.tracks.track
        : Array.isArray(album.discogs?.tracklist)
            ? album.discogs.tracklist
            : [];

    const fallbackTags = [
        ...additionalTags,
        ...(Array.isArray(album.musicbrainz?.tags)
        ? album.musicbrainz.tags.map((tag: { name: string }) => tag.name)
        : []),
    ].filter(
        (value, index, self) =>
        self.findIndex((v) => v.toLowerCase() === value.toLowerCase()) === index
    );

    const MAX_TAGS = 10;
    const MAX_TAG_LENGTH = 20;

    const filteredTags = fallbackTags
        .filter((tag) => tag.length <= MAX_TAG_LENGTH)
        .slice(0, MAX_TAGS);

    const rateYourMusicLink = album?.musicbrainz?.relations?.find(
        (relation: { type: string; url: { resource: string | string[]; }; }) => relation.type === "other databases" && relation.url.resource.includes("rateyourmusic")
    )?.url.resource;

    const geniusLink = album?.musicbrainz?.relations?.find(
        (relation: { type: string; url: { resource: string | string[]; }; }) => relation.type === "lyrics" && relation.url.resource.includes("genius.com")
    )?.url.resource;

    const musicBrainzLink = album?.musicbrainz?.id
        ? `https://musicbrainz.org/release-group/${album.musicbrainz.id}`
        : null;

    const rateYourMusicIcon = "https://e.snmc.io/3.0/img/logo/sonemic-32.png";

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
            style={{ gridAutoRows: "min-content" }}
          >
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
            <div id="details" className="flex flex-col justify-center w-full col-span-3">
              <div className="flex items-center justify-between mb-6" id="header">
                <div>
                  <h1 className="text-4xl font-bold text-white">
                    {album.title || album.spotify?.title || album.lastfm?.name}
                  </h1>
                  <h2 className="text-3xl text-gray-400 mt-2">
                    <a
                      href={`/ap/${albumsCollection}?endpoint=artist%2F${encodeURIComponent(album.artist || album.spotify?.artist || album.lastfm?.artist || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white"
                    >
                      {album.artist || album.spotify?.artist || album.lastfm?.artist}
                    </a>
                  </h2>
                </div>
                {album.country && (
                  <a
                    href={`/ap/${albumsCollection}?endpoint=country%2F${encodeURIComponent(album.country)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-6xl hover:opacity-80">{getFlagEmoji(album.country)}</span>
                  </a>
                )}
              </div>
              <div className="mb-6 flex gap-4" id="icons">
                {getYearIcon(typeof fallbackDateRelease === "string" ? fallbackDateRelease : undefined, albumsCollection)}
                {getDurationIcon(typeof fallbackDuration === "number" ? fallbackDuration : undefined, albumsCollection)}
                <div className="flex gap-2">{getFormatIcons(album.format, albumsCollection)}</div>
              </div>

              <div className="mb-6 space-y-6">
                {renderInfo(
                  typeof fallbackDateRelease === "string" ? fallbackDateRelease : undefined,
                  typeof fallbackDuration === "number" ? fallbackDuration : undefined,
                  fallbackTracks,
                  album.label,
                  albumsCollection
                )}
                                {(genres.length > 0 || subgenres.length > 0) && (
                  <div id="genres">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {genres.map((genre, index) => (
                        <a
                          key={`genre-${index}`}
                          href={`/ap/${albumsCollection}?endpoint=genres%2F${encodeURIComponent(genre)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold">
                            {genre}
                          </span>
                        </a>
                      ))}
                      {subgenres.map((subgenre, index) => (
                        <a
                          key={`subgenre-${index}`}
                          href={`/ap/${albumsCollection}?endpoint=genres%2F${encodeURIComponent(subgenre)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-lg">
                            {subgenre}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {Array.isArray(album.mood) && album.mood.length > 0 && (
                  <div id="moods">
                    <div className="flex flex-wrap gap-2 mt-2 text-lg">
                      {album.mood.map((mood, index) => (
                        <a
                          key={index}
                          href={`/ap/${albumsCollection}?endpoint=moods%2F${encodeURIComponent(mood)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="bg-green-600 text-white px-3 py-1 rounded-lg">
                            {mood}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {filteredTags.length > 0 && (
                  <div>
                    <div className="flex flex-wrap gap-2 mt-2 text-lg">
                      {filteredTags.map((tag, index) => (
                        <span key={index} className="text-white px-1 py-1 rounded-lg">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div id="description" className="p-4 bg-gray-800 rounded-lg shadow-md w-full">
                {album.text && album.text.trim() !== '' ? (
                  <p
                    className="text-gray-300 mt-2 text-xl leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: album.text }}
                  />
                ) : album.lastfm?.wiki?.summary ? (
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

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
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

            {album.discogs?.formats && renderDiscogsFormats(album.discogs.formats)}

          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
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

export default AlbumDetailView;
