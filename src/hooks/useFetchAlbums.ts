import { useState, useEffect } from "react";

export function useFetchAlbums(endpoint: string) {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getRandomPage = (maxPages = 3) => Math.floor(Math.random() * maxPages) + 1;
  const page = 1
  const limit = 50

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construir la URL según el endpoint
        const url = `https://discana-api-346921755711.europe-west1.run.app/albums${endpoint}?limit=${limit}&page=${page}`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Error al obtener los datos");

        const data = await response.json();
        setAlbums(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { albums, loading, error };
}
