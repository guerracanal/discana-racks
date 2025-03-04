import { useState, useEffect } from "react";
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
  // Soporte especial para Escocia
  if (countryCode.toUpperCase() === "GB-SCT") {
    // Bandera de Escocia
    return "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}";
  }
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

export default function AlbumCard({ album }: AlbumCardProps) {

  // Ajusta estos valores según tu preferencia
  const MAX_TITLE_LENGTH = 18;
  const MAX_ARTIST_LENGTH = 18;
  const MAX_MOOD_LENGTH = 25;
  const MAX_SUBGENRES_LENGTH = 20;

  // Estados para indicar si el texto supera el umbral de caracteres
  const [isTitleLong, setIsTitleLong] = useState(false);
  const [isArtistLong, setIsArtistLong] = useState(false);
  const [isMoodLong, setIsMoodLong] = useState(false);
  const [isSubgenresLong, setIsSubgenresLong] = useState(false);

  // Array de iconos de formato (puede tener CD, vinilo, etc.)
  const formatIcons: string[] = [];
  if (album.format.includes("CD")) formatIcons.push(cdIcon);
  if (album.format.includes("vinilo")) formatIcons.push(vinylIcon);

  useEffect(() => {
    // Creamos los strings de mood y subgéneros
    const moodString = album.mood.join(", ");
    const subgenresString = album.subgenres.join(", ");

    // Comprobamos la longitud de cada campo
    setIsTitleLong(album.title.length > MAX_TITLE_LENGTH);
    setIsArtistLong(album.artist.length > MAX_ARTIST_LENGTH);
    setIsMoodLong(moodString.length > MAX_MOOD_LENGTH);
    setIsSubgenresLong(subgenresString.length > MAX_SUBGENRES_LENGTH);
  }, [album]);

  return (
    <a className="link" href={album.spotify_link}>
      <div className="w-full h-full place-content-center">

      <div className="top absolute top-3">
        <div className="w-5/6 mx-auto flex items-center justify-between">
          {isMoodLong ? (
            <Marquee speed={20} className="">
              <p className="text-center text-base text-gray-400">&emsp;{album.mood.join(', ')}</p>
            </Marquee>
          ) : (
            <p className="text-center text-base text-gray-400">
              {album.mood.join(', ')}
            </p>
          )}
        </div>
      </div>
        <img className="cover bg-cover bg-center rounded-lg w-full h-full sm:w-20 sm:h-20 md:w-30 md:h-30 lg:w-85 lg:h-85 mx-auto" src={album.image} />

        <div className="box w-5/6 mx-auto">
          {isTitleLong ? (
            <Marquee speed={20}>
              <h3 className="w-full title sm:text-xl md:text-2xl lg:text-3xl font-bold">&emsp;{album.title}</h3>
            </Marquee>
          ) : (
            <h3 className="title sm:text-xl md:text-2xl lg:text-3xl font-bold">
              {album.title}
            </h3>
          )}

          {isArtistLong ? (
            <Marquee speed={20}>
              <h4 className="artist text-2lg sm:text-base md:text-2lg lg:text-3xl text-gray-300">&emsp;{album.artist}</h4>
            </Marquee>
          ) : (
            <h4 className="artist text-2lg sm:text-base md:text-2lg lg:text-3xl text-gray-300">
              {album.artist}
            </h4>
          )}

          <div className="text-md sm:text-sm md:text-base lg:text-lg">
            <p className="text-gray-100">{album.date_release} - {album.duration} min ({album.tracks} tracks)</p>
            <p className="text-gray-100"><strong className="text-white text-2xl">{album.genre.join(', ')}</strong></p>

            {isSubgenresLong ? (
              <Marquee speed={20}>
                &emsp;<p className="text-gray-100">{album.subgenres.join(', ')}</p>
              </Marquee>
            ) : (
              <p className="text-gray-100">
                {album.subgenres.join(', ')}
              </p>
            )}
          </div>

        </div>

        {/* Contenedor de bandera + iconos de formato */}
        <div className="absolute bottom-2 left-8 right-0 flex items-center justify-between px-2">
          <span className="text-3xl leading-none">
            {getFlagEmoji(album.country)}
          </span>

          <div className="flex space-x-2">
            {formatIcons.map((icon, index) => (
              <img
                key={index}
                src={icon}
                alt="Formato"
                className="w-10 h-10 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
                />
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}
