import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Props {
  albumsCollection: string;
}

const RandomAlbumRedirect: React.FC<Props> = ({ albumsCollection }) => {
  const navigate = useNavigate();
  const redirected = useRef(false);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      if (redirected.current) return; // Evita redirecciones múltiples
      redirected.current = true;
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/v2/a/${albumsCollection}?limit=1&page=1&filter=all&random=true`;
        const response = await axios.get(apiUrl);
        const album = response.data?.data?.[0];
        if (album) {
          const artistSlug = encodeURIComponent(
            (typeof album.artist === "string" ? album.artist.toLowerCase() : "unknown-artist").replace(/\s+/g, "-")
          );
          const albumSlug = encodeURIComponent(
            (typeof album.title === "string" ? album.title.toLowerCase() : "unknown-album").replace(/\s+/g, "-")
          );
          let path = `/${albumsCollection}/album/${artistSlug}/${albumSlug}`;
          if (album._id) path += `/db/${album._id}`;
          else if (album.spotify_id) path += `/spotify/${album.spotify_id}`;
          else if (album.mbid) path += `/mbid/${album.mbid}`;
          else if (album.discogs_id) path += `/discogs/${album.discogs_id}`;
          navigate(path, { replace: true });
        }
      } catch (error) {
        alert('No se pudo obtener un álbum aleatorio');
        navigate("/", { replace: true });
      }
    };
    fetchAndRedirect();
  }, [albumsCollection, navigate]);

  return <div className="text-white p-8 text-center">Cargando álbum aleatorio...</div>;
};

export default RandomAlbumRedirect;