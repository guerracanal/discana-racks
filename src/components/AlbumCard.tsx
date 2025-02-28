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
}

interface AlbumCardProps {
  album: Album;
}

export default function AlbumCard({ album }: AlbumCardProps) {
  return (
    <a href={album.spotify_link}>
      <div className="text-black text-center w-full h-full place-content-center">
        <div className="bg-cover bg-center rounded-lg w-full h-full sm:w-30 sm:h-30 md:w-50 md:h-50 lg:w-85 lg:h-85 mx-auto"
          style={{ backgroundImage: `url(${album.image})` }}>
        </div>
        <h3 className="text-2xl sm:text-xl md:text-2xl lg:text-3xl font-bold mt-2">{album.title}</h3>
        <h4 className="text-2lg sm:text-base md:text-2lg lg:text-3xl text-gray-400">{album.artist}</h4>

        <div className="mt-2 text-md sm:text-sm md:text-base lg:text-lg">
          <p>{album.date_release} - {album.duration} min ({album.tracks} tracks)</p>
          <p><strong>{album.genre.join(', ')}</strong> <span>{album.subgenres.join(', ')}</span></p>
          <span>{album.mood.join(', ')}</span>
        </div>
      </div>
    </a>
  );
}
