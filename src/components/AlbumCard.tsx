import cdIcon from "../assets/icons/cd.png";
import vinylIcon from "../assets/icons/vinyl.png";

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

  const formatIcon = album.format.includes("CD")
    ? cdIcon
    : album.format.includes("vinilo")
    ? vinylIcon
    : null;

  return (
    <a href={album.spotify_link}>
      <div className="text-black text-center w-full h-full place-content-center">
        <img className="bg-cover bg-center rounded-lg w-full h-full sm:w-20 sm:h-20 md:w-30 md:h-30 lg:w-85 lg:h-85 mx-auto" src ={album.image}/>
        <h3 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-bold mt-2">{album.title}</h3>
        <h4 className="text-2lg sm:text-base md:text-2lg lg:text-3xl text-gray-300">{album.artist}</h4>

        <div className="mt-2 text-md sm:text-sm md:text-base lg:text-lg">
          <p className="text-gray-100">{album.date_release} - {album.duration} min ({album.tracks} tracks)</p>
          <p className="text-gray-100"><strong className="text-white text-2xl">{album.genre.join(', ')}</strong> <span>{album.subgenres.join(', ')}</span></p>
          <p className="text-gray-100">{album.mood.join(', ')}</p>
        </div>

        {/* Icono del formato (CD/Vinilo) */}
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
