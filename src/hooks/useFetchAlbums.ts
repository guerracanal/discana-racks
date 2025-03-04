import { useState, useEffect } from "react";

export function useFetchAlbums(endpoint: string) {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //const getRandomPage = (maxPages = 3) => Math.floor(Math.random() * maxPages) + 1;
  const page = 1
  const limit = 500

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Construir la URL según el endpoint
        const url = import.meta.env.VITE_API_URL + '/api/albums' + endpoint + "?limit=" + limit + "&page=" + page;

        const response = await fetch(url,{
          /*headers: {
            'X-Forwarded-Proto': 'https'  // Forza HTTPS en el backend
          }*/
        });

        if (!response.ok) throw new Error("Error al obtener los datos");

        const data = await response.json();

        // Ordenamos data de manera aleatoria
        const shuffledData = data.sort(() => Math.random() - 0.5);

        setAlbums(shuffledData);
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
