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
    if (!albums_collection) {
      setLoading(false);
      return;
    }
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
        let baseUrl = `${import.meta.env.VITE_API_URL}/api/v2/a/${albums_collection}`;
        let urlParams = new URLSearchParams();
        urlParams.append('limit', limit.toString());
        urlParams.append('page', page.toString());
        urlParams.append('filter', filter);
        urlParams.append('random', random.toString());

        // Check if endpoint has URL parameters
        if (endpoint.includes("?")) {
          const [baseEndpoint, queryParams] = endpoint.split("?");
          baseUrl += `/${baseEndpoint}`;

          const endpointParams = new URLSearchParams(queryParams);

          // Override default parameters if they exist in the endpoint
          if (endpointParams.has('limit')) {
            urlParams.set('limit', endpointParams.get('limit')!);
          }
          if (endpointParams.has('page')) {
            urlParams.set('page', endpointParams.get('page')!);
          }
          if (endpointParams.has('filter')) {
            urlParams.set('filter', endpointParams.get('filter')!);
          }
          if (endpointParams.has('random')) {
            urlParams.set('random', endpointParams.get('random')!);
          }

          // Append the rest of the endpoint params
          for (const [key, value] of endpointParams.entries()) {
            if (!urlParams.has(key)) {
              urlParams.append(key, value);
            }
          }
        } else if (endpoint) {
          baseUrl += `/${endpoint}`;
        }

        let url = `${baseUrl}?${urlParams.toString()}`;
        console.log("Recuperando datos de la API: " + url)

        // Check for user_id in session and append it to the URL if it exists
        const user_id = sessionStorage.getItem('user_id');
        console.log('Recuperando user_id: ' + user_id);
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
