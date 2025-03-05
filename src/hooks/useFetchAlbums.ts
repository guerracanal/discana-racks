import { useState, useEffect } from "react";

export function useFetchAlbums(endpoint: string) {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const page = 1
  const limit = 30

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = import.meta.env.VITE_API_URL + '/api/albums/' + endpoint + "?limit=" + limit + "&page=" + page;

        console.log(url);

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
