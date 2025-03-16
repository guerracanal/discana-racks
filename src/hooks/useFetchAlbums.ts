import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';

export function useFetchAlbums(albums_collection: string, endpoint: string = "", ramdom: boolean = false) {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const page = 1;
  const limit = 50;

  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/api/v2/a/${albums_collection}/${endpoint}?limit=${limit}&page=${page}&filter=${filter}&random=${ramdom}`;
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error en la respuesta");
        const result = await response.json();
        setAlbums(result.data);
      } catch (err) {
        console.error("Error fetching albums:", error);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [albums_collection, endpoint, filter]);

  return { albums, loading, error };
}
