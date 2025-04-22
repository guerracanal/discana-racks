import { useState, useEffect } from "react";
import { Album } from "../types/album";

export const useFetchAlbumDetail = (albums_collection: string, artist: string | undefined, title: string | undefined) => {
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artist || !title) return;

    const fetchAlbumDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v2/a/${albums_collection}/detail/?artist=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`
        );
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
  }, [artist, title]);

  return { album, loading, error };
};
