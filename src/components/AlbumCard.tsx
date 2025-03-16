import React, { useState, useEffect } from "react";
import cdIcon from "../assets/icons/cd.png";
import vinylIcon from "../assets/icons/vinyl.png";
import Marquee from "react-fast-marquee";
import { AlbumCardProps } from '../types/album';

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

const AlbumCard = React.forwardRef<HTMLDivElement, AlbumCardProps>(({ album }, ref) => {

  // Ajusta estos valores según tu preferencia
  const MAX_TITLE_LENGTH = 18;
  const MAX_ARTIST_LENGTH = 15;
  const MAX_MOOD_LENGTH = 20;
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
      <div ref={ref} className="card text-sm w-full h-full place-content-center flex flex-col justify-between">
        <div className="top">
          <div className="mood w-5/6 sm:w-5/6 md:w-5/6 lg:w-5/6 mx-auto flex items-center justify-between">
            {isMoodLong ? (
              <Marquee speed={30}>
                <p className="text-center text-base">&emsp;{album.mood.join(', ')}</p>
              </Marquee>
            ) : (
              <p className="text-center text-base">
                {album.mood.join(', ')}
              </p>
            )}
          </div>
        </div>
        <img className="cover bg-cover bg-center rounded-lg sm:w-20 sm:h-20 md:w-30 md:h-30 lg:w-85 lg:h-85 mx-auto" src={album.image} loading="lazy" alt={album.title} />

        <div className="box w-5/6 sm:w-5/6 md:w-5/6 lg:w-5/6 mx-auto">
          {isTitleLong ? (
            <Marquee speed={10}>
              <h3 className="title sm:text-xl md:text-2xl lg:text-3xl font-bold">&emsp;{album.title}</h3>
            </Marquee>
          ) : (
            <h3 className="title sm:text-xl md:text-2xl lg:text-3xl font-bold">
              {album.title}
            </h3>
          )}

          {isArtistLong ? (
            <Marquee speed={10}>
              <h4 className="artist sm:text-base md:text-2lg lg:text-3xl">&emsp;{album.artist}</h4>
            </Marquee>
          ) : (
            <h4 className="artist sm:text-base md:text-2lg lg:text-3xl">
              {album.artist}
            </h4>
          )}

          <div className="sm:text-sm md:text-base lg:text-lg">
            <p className="info sm:text-sm md:text-base lg:text-lg">{album.date_release} - {album.duration} min ({album.tracks} tracks)</p>
            <p className="genre sm:text-sm md:text-base lg:text-lg"><strong>{album.genre.join(', ')}</strong></p>

            {isSubgenresLong ? (
              <Marquee speed={10}>
                &emsp;<p className="subgenres">{album.subgenres.join(', ')}</p>
              </Marquee>
            ) : (
              <p className="subgenres">
                {album.subgenres.join(', ')}
              </p>
            )}
          </div>

        </div>

        {/* Contenedor de bandera + iconos de formato */}
        <div className="flex items-center justify-between px-2 mt-4">
          <span className="text-xl sm:text-xl md:text-2xl lg:text-3xl leading-none">
            {getFlagEmoji(album.country)}
          </span>

          <div className="flex space-x-2">
            {formatIcons.map((icon, index) => (
              <img
                key={index}
                src={icon}
                alt="Formato"
                loading="lazy"
                className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12"
              />
            ))}
          </div>
        </div>
      </div>
    </a>
  );
});

export default AlbumCard;
