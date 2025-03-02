import { useState, useEffect, useRef } from "react";
import cdIcon from "../assets/icons/cd.png";
import vinylIcon from "../assets/icons/vinyl.png";
import Marquee from "react-fast-marquee";

interface Album {
  id: string;
  title: string;
  image: string;
  artist: string;
  genre: string[];
  subgenres: string[];
  duration: string;
  tracks: number;
  mood: string[];
  date_release: string;
  spotify_link: string;
  format: string[];
  country: string;
}

interface AlbumCardProps {
  album: Album;
}

const getFlagEmoji = (countryCode: string) => {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

export default function AlbumCard({ album }: AlbumCardProps) {
  const [isTitleLong, setIsTitleLong] = useState(false);
  const [isArtistLong, setIsArtistLong] = useState(false);
  const [isMoodLong, setIsMoodLong] = useState(false);
  const [isSubgenresLong, setIsSubgenresLong] = useState(false);

  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const artistRef = useRef<HTMLHeadingElement | null>(null);
  const moodRef = useRef<HTMLParagraphElement | null>(null);
  const subgenresRef = useRef<HTMLParagraphElement | null>(null);

  const formatIcon = album.format.includes("CD")
    ? cdIcon
    : album.format.includes("vinilo")
      ? vinylIcon
      : null;

  useEffect(() => {
    if (titleRef.current && artistRef.current && moodRef.current && subgenresRef.current) {
      const titleHeight = titleRef.current.offsetHeight;
      const artistHeight = artistRef.current.offsetHeight;
      const moodHeight = moodRef.current.offsetHeight;
      const subgenresHeight = subgenresRef.current.offsetHeight;

      setIsTitleLong(titleHeight > 30);
      setIsArtistLong(artistHeight > 30);
      setIsMoodLong(moodHeight > 30);
      setIsSubgenresLong(subgenresHeight > 30);
    }
  }, [album.title, album.artist, album.mood, album.subgenres]);

  return (
    <a href={album.spotify_link}>
      <div className="text-black text-center w-full h-full place-content-center">
        {isMoodLong ? (
          <Marquee speed="20" className="absolute top-3 right-2">
            <p className="mood text-center text-base text-gray-400">&emsp;{album.mood.join(', ')}</p>
          </Marquee>
        ) : (
          <p ref={moodRef} className="mood absolute top-3 right-2 text-center text-base text-gray-400">
            {album.mood.join(', ')}
          </p>
        )}

        <img className="image bg-cover bg-center rounded-lg w-full h-full sm:w-20 sm:h-20 md:w-30 md:h-30 lg:w-85 lg:h-85 mx-auto" src={album.image} />

        {isTitleLong ? (
          <Marquee speed="20">
            <h3 className="w-full title text-2xl sm:text-xl md:text-2xl lg:text-3xl font-bold mt-2">&emsp;{album.title}</h3>
          </Marquee>
        ) : (
          <h3 ref={titleRef} className="title text-2xl sm:text-xl md:text-2xl lg:text-3xl font-bold mt-2">
            {album.title}
          </h3>
        )}

        {isArtistLong ? (
          <Marquee speed="20">
            <h4 className="artist text-2lg sm:text-base md:text-2lg lg:text-3xl text-gray-300">&emsp;{album.artist}</h4>
          </Marquee>
        ) : (
          <h4 ref={artistRef} className="artist text-2lg sm:text-base md:text-2lg lg:text-3xl text-gray-300">
            {album.artist}
          </h4>
        )}

        <div className="mt-2 text-md sm:text-sm md:text-base lg:text-lg">
          <p className="text-gray-100">{album.date_release} - {album.duration} min ({album.tracks} tracks)</p>
          <p className="text-gray-100"><strong className="text-white text-2xl">{album.genre.join(', ')}</strong></p>
          {isSubgenresLong ? (
            <Marquee speed="20">
              &emsp;<p className="text-gray-100">{album.subgenres.join(', ')}</p>
            </Marquee>
          ) : (
            <p ref={subgenresRef} className="text-gray-100">
              {album.subgenres.join(', ')}
            </p>
          )}
        </div>

        {formatIcon && (
          <img
            src={formatIcon}
            alt="Formato"
            className="format absolute bottom-2 right-2 w-8 h-8 sm:w-6 sm:h-6"
          />
        )}

        <span className="absolute bottom-2 left-10 text-3xl">
          {getFlagEmoji(album.country)}
        </span>
      </div>
    </a>
  );
}
