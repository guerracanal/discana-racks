import { useState, useEffect, forwardRef, JSX } from "react";
import cdIcon from "../assets/icons/cd.png";
import vinylIcon from "../assets/icons/vinyl.png";
import cardIcon from "../assets/card.svg";

import Marquee from "react-fast-marquee";
import { Album, AlbumCardProps } from '../types/album';
import { SiDiscogs } from "react-icons/si";
import { FaLastfm, FaSpotify } from "react-icons/fa";
import { RiHeartAdd2Line } from "react-icons/ri";

// Helper function to get the flag emoji
const getFlagEmoji = (countryCode: string) => {
  // Special handling for Scotland
  if (countryCode.toUpperCase() === "GB-SCT") {
    return "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}";
  }
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

// Helper function to determine the link to use
const getLink = (album: Album) => {
  if (album.spotify_link) return album.spotify_link;
  if (album.discogs_link) return album.discogs_link;
  if (album.lastfm_link) return album.lastfm_link;
  return "#";
};

// Helper function to determine the content for the mood section
const getTopContent = (album: Album, isTopLong: boolean) => {
  if (album.mood && album.mood.length > 0) {
    const moodString = album.mood.join(', ');
    return isTopLong ? (
      <Marquee speed={30}>
        <p className="text-center text-base">&emsp;{moodString}</p>
      </Marquee>
    ) : (
      <p className="text-center text-base">{moodString}</p>
    );
  } else if (album.playcount) {
    const scrobblingsString = "Tus scrobblings: " + album.playcount;
    return isTopLong ? (
      <Marquee speed={30}>
        <p className="text-center text-base">&emsp;{scrobblingsString}</p>
      </Marquee>
    ) : (
      <p className="text-center text-base">{scrobblingsString}</p>
    );
  }
};

// Helper function to determine the format icons
const getFormatIcons = (album: Album): JSX.Element[] => {
  const icons: JSX.Element[] = [];
  if (album.format && album.format.length > 0) {
    if (album.format.includes("CD")) icons.push(<img key="cd" src={cdIcon} alt="CD" loading="lazy" className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />);
    if (album.format.includes("vinilo")) icons.push(<img key="vinyl" src={vinylIcon} alt="Vinilo" loading="lazy" className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />);
    if (album.format.includes("card")) icons.push(<span className="text-black"><img src={cardIcon} className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" alt="Card"/></span>);
  }
  if (album.compilations && album.compilations.length > 0) {
    if (album.compilations.includes("whistlist")) icons.push(<span className="text-black"><RiHeartAdd2Line key="whistlist" className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" /></span>);
  }
  if (album.discogs_link) {
    icons.push(<span className="text-black"><SiDiscogs key="discogs" className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" /></span>);
  } if (album.lastfm_link) {
    icons.push(<span className="text-red-600"><FaLastfm key="lastfm" className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" /></span>);
  } if (album.spotify_link) {
    icons.push(<span className="text-[#1ED760]"><FaSpotify key="spotify" className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" /></span>);
  }

  return icons;
};



const AlbumCard = forwardRef<HTMLDivElement, AlbumCardProps>(({ album }: AlbumCardProps, ref) => {

  // Constants for maximum lengths
  const MAX_TITLE_LENGTH: number = 18;
  const MAX_ARTIST_LENGTH: number = 15;
  const MAX_MOOD_LENGTH: number = 20;
  const MAX_SUBGENRES_LENGTH: number = 20;

  // State variables
  const [isTitleLong, setIsTitleLong] = useState<boolean>(false);
  const [isArtistLong, setIsArtistLong] = useState<boolean>(false);
  const [isTopLong, setisTopLong] = useState<boolean>(false);
  const [isSubgenresLong, setIsSubgenresLong] = useState<boolean>(false);
  const [formatIcons, setFormatIcons] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // Calculate long strings
    const moodString: string = album.mood?.join(", ") || "";
    const subgenresString: string = album.subgenres?.join(", ") || "";

    setIsTitleLong((album.title || "").length > MAX_TITLE_LENGTH);
    setIsArtistLong((album.artist || "").length > MAX_ARTIST_LENGTH);
    setisTopLong(moodString.length > MAX_MOOD_LENGTH);
    setIsSubgenresLong(subgenresString.length > MAX_SUBGENRES_LENGTH);
    // Set format icons
    setFormatIcons(getFormatIcons(album));
  }, [album]);

  const link = getLink(album);
  const openInNewTab = link !== "#";

  return (
    <a
      className="link"
      href={link}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
    >
      <div ref={ref} className="card p-2 sm:p-4">
        <div className="top"> {/* Added padding */}
          <div className="mood w-full flex items-center justify-center"> {/* Removed unnecessary widths */}
            {getTopContent(album, isTopLong)}
          </div>
        </div>
        <img className="cover aspect-square object-cover rounded-lg mx-auto" src={album.image || ""} loading="lazy" alt={album.title || "Unknown Album"} />

        <div className="box w-full text-sm"> {/* Added padding */}
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
            <Marquee speed={10}>
              <h4 className="artist sm:text-base md:text-2lg lg:text-3xl">&emsp;{album.artist || "Unknown Artist"}</h4>
            </Marquee>
          ) : (
            <h4 className="artist sm:text-base md:text-2lg lg:text-3xl">
              {album.artist || "Unknown Artist"}
            </h4>
          )}

          <div className="text-sm md:text-base lg:text-lg"> {/* Simplified text sizes */}
            <p className="info">{album.date_release || album.listens + ' escuchas'} - {album.duration || "?"} min ({album.tracks || "?"} tracks)</p>
            <p className="genre font-bold">{album.genre?.join(', ') || ""}</p>
            {isSubgenresLong ? (
              <Marquee speed={10}> {/* Hidden on screens smaller than sm */}
                &emsp;<p className="subgenres">{album.subgenres?.join(', ') || ""}</p>
              </Marquee>
            ) : (
              <p className="subgenres"> {/* Hidden on screens smaller than sm */}
                {album.subgenres?.join(', ') || ""}
              </p>
            )}
          </div>

        </div>

        {/* Flag and format icons */}
        <div className="bottom flex items-center justify-between"> {/* Added padding */}
          <span className="text-xl md:text-2xl lg:text-3xl">{getFlagEmoji(album.country || "")}</span>
          <div className="flex space-x-2">
            {formatIcons}
          </div>
        </div>
      </div>
    </a>
  );
});

export default AlbumCard;
