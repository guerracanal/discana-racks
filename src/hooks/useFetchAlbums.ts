import { useState, useEffect } from "react";
import { useSearchParams } from 'react-router-dom';

export function useFetchAlbums(albums_collection: string, endpoint: string = "", random: boolean = false) {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const page = 1;
  const limit = 30;

  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `${albums_collection}-${endpoint}-${filter}-${random}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        console.log("Recuperando datos del caché");
        setAlbums(JSON.parse(cachedData));
        setLoading(false);
        return;
      }

      try {
        let url = `${import.meta.env.VITE_API_URL}/api/v2/a/${albums_collection}/${endpoint}?limit=${limit}&page=${page}&filter=${filter}&random=${random}`;
        
        // Check for user_id in session and append it to the URL if it exists
        const user_id = sessionStorage.getItem('user_id');
        if (user_id) {
          url += `&user_id=${user_id}`;
        }

        console.log(url);
        console.log("Recuperando datos de la API");
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error en la respuesta");
        const result = await response.json();
        sessionStorage.setItem(cacheKey, JSON.stringify(result.data));
        setAlbums(result.data);
      } catch (err) {
        console.error("Error fetching albums:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [albums_collection, endpoint, filter, random]);

  return { albums, loading, error };
}
