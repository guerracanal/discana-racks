import { useState, useEffect } from "react";
import { Album } from "../types/album";

export const useFetchAlbumDetail = (
  albums_collection: string,
  artist: string | undefined,
  title: string | undefined,
  id?: string,
  mbid?: string,
  spotifyId?: string,
  discogsId?: string
) => {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar que al menos uno de los identificadores esté presente
    if (!artist && !title && !id && !mbid && !spotifyId && !discogsId) {
      setLoading(false);
      setError("No se proporcionaron identificadores válidos para buscar el álbum.");
      return;
    }

    const fetchAlbumDetail = async () => {
      try {
        setLoading(true);

        const spotify_user_id = sessionStorage.getItem('spotifyUserData') 
          ? JSON.parse(sessionStorage.getItem('spotifyUserData')!).spotify_id 
          : null;
        const discogs_user_id = sessionStorage.getItem('discogsUserData') 
          ? JSON.parse(sessionStorage.getItem('discogsUserData')!).discogs_user 
          : null;
        const lastfm_user_id = sessionStorage.getItem('lastfmUserData') 
          ? JSON.parse(sessionStorage.getItem('lastfmUserData')!).lastfm_user 
          : null;

        const url = new URL(`${import.meta.env.VITE_API_URL}/api/v2/a/${albums_collection}/detail/all`);
        if (id) url.searchParams.append("db_id", id);
        if (mbid) url.searchParams.append("mbid", mbid);
        if (spotifyId) url.searchParams.append("spotify_id", spotifyId);
        if (discogsId) url.searchParams.append("discogs_id", discogsId);
        if (artist) url.searchParams.append("artist", encodeURIComponent(artist));
        if (title) url.searchParams.append("title", encodeURIComponent(title));
        if (spotify_user_id) url.searchParams.append('spotify_user_id', spotify_user_id);
        if (discogs_user_id) url.searchParams.append('discogs_user_id', discogs_user_id);
        if (lastfm_user_id) url.searchParams.append('lastfm_user_id', lastfm_user_id);

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Error al obtener los detalles del álbum");
        const data = await response.json();
        setAlbum(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumDetail();
  }, [albums_collection, artist, title, id, mbid, spotifyId, discogsId]);

  return { album, loading, error };
};
