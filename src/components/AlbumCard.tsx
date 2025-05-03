import { useState, useEffect, forwardRef, JSX } from "react";
import cdIcon from "../assets/icons/cd.png";
import vinylIcon from "../assets/icons/vinyl.png";
import cardIcon from "../assets/card.svg";
import Marquee from "react-fast-marquee";
import { Album, AlbumCardProps } from '../types/album';
import { SiDiscogs } from "react-icons/si";
import { FaLastfm, FaSpotify, FaCalendarAlt, FaClock, FaMusic } from "react-icons/fa";
import { RiHeartAdd2Line } from "react-icons/ri";
import { FaHeadphones } from "react-icons/fa";

const getFlagEmoji = (countryCode: string) => {
  if (countryCode.toUpperCase() === "GB-SCT") {
    return "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}";
  }
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

const getLink = (album: Album) => {
  const artistSlug = encodeURIComponent(
    (typeof album.artist === "string" ? album.artist.toLowerCase() : "unknown-artist").replace(/\s+/g, "-")
  );
  const albumSlug = encodeURIComponent(
    (typeof album.title === "string" ? album.title.toLowerCase() : "unknown-album").replace(/\s+/g, "-")
  );

  if (album._id) {
    return `/album/${artistSlug}/${albumSlug}/db/${album._id}`;
  }
  if (album.spotify_id) {
    return `/album/${artistSlug}/${albumSlug}/spotify/${album.spotify_id}`;
  }
  if (album.mbid) {
    return `/album/${artistSlug}/${albumSlug}/mbid/${album.mbid}`;
  }
  if (album.discogs_id) {
    return `/album/${artistSlug}/${albumSlug}/discogs/${album.discogs_id}`;
  }

  return `/album/${artistSlug}/${albumSlug}`;
};

const isValidListen = (listens: unknown): listens is number => {
  return typeof listens === 'number' && listens >= 0;
};

const getListenColor = (listens: number) => {
  if (listens === 0) return 'text-red-500';
  if (listens <= 10) return 'text-orange-500';
  if (listens <= 20) return 'text-yellow-500';
  if (listens <= 30) return 'text-green-500';
  if (listens <= 40) return 'text-blue-500';
  if (listens <= 50) return 'text-indigo-500';
  return 'text-purple-500';
};

const getFormatIcons = (album: Album): JSX.Element[] => {
  const icons: JSX.Element[] = [];
  const iconSize = "w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12";

  const formats = album.format || [];

  if (formats.length > 0) {
    const formatIcons = [
      { format: "CD", icon: cdIcon },
      { format: "vinilo", icon: vinylIcon },
      { format: "Vinyl", icon: vinylIcon },
      { format: "card", icon: cardIcon },
    ];

    formatIcons.forEach(({ format, icon }) => {
      if (formats.includes(format)) {
        icons.push(
          <img key={`${format}-${album._id}`} src={icon} alt={format} loading="lazy" className={iconSize} />
        );
      }
    });
  }

  if (album.compilations?.includes("whistlist")) {
    icons.push(
      <RiHeartAdd2Line
        key={`whistlist-${album._id}`}
        className={`text-black ${iconSize}`}
      />
    );
  }

  if (album.listens !== undefined && isValidListen(album.listens)) {
    const colorClass = getListenColor(album.listens);

    icons.push(<span className={`${colorClass} text-2xl sm:text-2xl md:text-4xl lg:text-4xl font-bold`}>{album.listens}</span>);
    icons.push(<span className={`${colorClass}`}><FaHeadphones key={`listen-${album._id}`} className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" /></span>);

  }

  const serviceIcons = [
    { condition: album.discogs_link, Icon: SiDiscogs, key: "discogs", color: "text-black" },
    { condition: album.lastfm_link, Icon: FaLastfm, key: "lastfm", color: "text-red-600" },
    { condition: album.spotify_link, Icon: FaSpotify, key: "spotify", color: "text-[#1ED760]" }
  ];

  serviceIcons.forEach(({ condition, Icon, key, color }) => {
    if (condition) {
      icons.push(
        <Icon
          key={`${key}-${album._id}`}
          className={`${iconSize} ${color}`}
        />
      );
    }
  });

  return icons;
};


const renderInfo = (album: Album) => {
  const parts: JSX.Element[] = [];

  if (album.date_release) {
    parts.push(
      <span key={`date-${album._id}`} className="inline-flex items-center mr-1">
        <FaCalendarAlt className="mr-1" />
        {album.date_release}
      </span>
    );
  }

  if (album.duration) {
    parts.push(
      <span key={`duration-${album._id}`} className="inline-flex items-center mr-1">
        <FaClock className="mr-1" />
        {album.duration}'
      </span>
    );
  }

  if (album.tracks) {
    parts.push(
      <span key={`tracks-${album._id}`} className="inline-flex items-center mr-1">
        <FaMusic className="mr-1" />
        {album.tracks}
      </span>
    );
  }

  if (album.playcount) {
    parts.push(
      <span key={`playcount-${album._id}`} className="inline-flex items-center mr-1">
        <FaHeadphones className="mr-1" />
        {album.playcount}
      </span>
    );
  }

  return (
    <div className="info flex gap-2 items-center text-gray-600 dark:text-gray-400 flex-wrap">
      {parts}
    </div>
  )
};



const AlbumCard = forwardRef<HTMLDivElement, AlbumCardProps>(({ album }: AlbumCardProps, ref) => {

  const MAX_TITLE_LENGTH: number = 18;
  const MAX_ARTIST_LENGTH: number = 15;
  const MAX_SUBGENRES_LENGTH: number = 20;

  const [isTitleLong, setIsTitleLong] = useState<boolean>(false);
  const [isArtistLong, setIsArtistLong] = useState<boolean>(false);
  const [isSubgenresLong, setIsSubgenresLong] = useState<boolean>(false);
  const [formatIcons, setFormatIcons] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const subgenresString: string = album.subgenres?.join(", ") || "";

    setIsTitleLong((album.title || "").length > MAX_TITLE_LENGTH);
    setIsArtistLong((album.artist || "").length > MAX_ARTIST_LENGTH);
    setIsSubgenresLong(subgenresString.length > MAX_SUBGENRES_LENGTH);
    setFormatIcons(getFormatIcons(album));
  }, [album]);

  const link = getLink(album);
  const openInNewTab = false; // Abrir en la misma pestaña

  return (
    <a
      className="link"
      href={link}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      key={`a-${album._id}`}
    >
      <div
        ref={ref}
        className={`card w-full max-w-[500px] mx-auto ${album.tracks === 1
            ? 'card-blue'
            : (album.duration ?? 0) < 20
              ? 'card-green'
              : (album.duration ?? 0) > 100
                ? 'card-purple'
                : ''
          } p-2 sm:p-4`}
        key={`card-${album._id}`}
      >
        <div className="inner-border"></div>
        <div className="card-content relative z-4">

          <img 
            className="cover w-full h-auto object-cover rounded-lg mx-auto"
            src={album.image || ""}
            loading="lazy"
            alt={album.title || "Unknown Album"}
            key={`cover-${album._id}`}
          />

          <div className="box w-full text-sm">
            {isTitleLong ? (
              <Marquee speed={10}>
                <h3 className="title sm:text-xl md:text-2xl lg:text-3xl font-bold">&emsp;{album.title || "Unknown Title"}</h3>
              </Marquee>
            ) : (
              <h3 className="title sm:text-xl md:text-2xl lg:text-3xl font-bold">
                {album.title || "Unknown Title"}

              </h3>
            )}

            {isArtistLong ? (
              <Marquee speed={5}>
                <h4 className="artist sm:text-base md:text-2lg lg:text-3xl">&emsp;{album.artist || "Unknown Artist"}</h4>
              </Marquee>
            ) : (
              <h4 className="artist sm:text-base md:text-2lg lg:text-3xl">
                {album.artist || "Unknown Artist"}
              </h4>
            )}

            <div className="text-sm md:text-base lg:text-lg">
              {renderInfo(album)}

              <p className="genre font-bold">{album.genre?.join(', ') || ""}</p>
              {isSubgenresLong ? (
                <Marquee speed={30}>
                  &emsp;<p className="subgenres">{album.subgenres?.join(', ') || ""}</p>
                </Marquee>
              ) : (
                <p className="subgenres">
                  {album.subgenres?.join(', ') || ""}
                </p>
              )}
            </div>

          </div>

          <div className="bottom flex items-center justify-between">
            <span className="text-xl md:text-2xl lg:text-3xl">
              {getFlagEmoji(album.country || "")}
            </span>
            <div className="flex items-center gap-2">
              {formatIcons.map((icon, index) => (
                <div
                  key={`icon-${album._id}-${index}`}
                  className="flex items-center justify-center"
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
});

export default AlbumCard;
