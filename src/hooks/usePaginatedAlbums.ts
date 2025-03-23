import { useState, useEffect, useRef } from "react";
import { Album } from "../types/album";
import { useSearchParams } from 'react-router-dom';

const usePaginatedAlbums = (albums_collection: string, endpoint: string) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const random = searchParams.get('random') || 'false';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    setAlbums([]);
    setPage(1);
    setHasMore(true);
  }, [albums_collection, endpoint, filter, searchQuery]); // Add searchQuery as a dependency

  useEffect(() => {
    const fetchAlbums = async () => {
      if (loadingRef.current || !hasMore) return;
      loadingRef.current = true;
      setLoading(true);

      const cacheKey = `${albums_collection}-${endpoint}-${page}-${filter}-${random}-${searchQuery}`;
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        setAlbums((prevAlbums) => [...prevAlbums, ...JSON.parse(cachedData)]);
        setLoading(false);
        loadingRef.current = false;
        return;
      }

      try {
        let baseUrl = `${import.meta.env.VITE_API_URL}/api/v2/a/${albums_collection}`;
        let urlParams = new URLSearchParams();
        urlParams.append('page', page.toString());
        urlParams.append('limit', '50'); // Keep limit consistent
        urlParams.append('filter', filter);
        urlParams.append('random', random);


        //Improved URL parameter handling (mirroring useFetchAlbums)
        if (endpoint.includes("?")) {
          const [baseEndpoint, queryParams] = endpoint.split("?");
          baseUrl += `/${baseEndpoint}`;
          const endpointParams = new URLSearchParams(queryParams);

          // Override default parameters if they exist in the endpoint
          if (endpointParams.has('limit')) urlParams.set('limit', endpointParams.get('limit')!);
          if (endpointParams.has('page')) urlParams.set('page', endpointParams.get('page')!);
          if (endpointParams.has('filter')) urlParams.set('filter', endpointParams.get('filter')!);
          if (endpointParams.has('random')) urlParams.set('random', endpointParams.get('random')!);

          // Append the rest of the endpoint params
          for (const [key, value] of endpointParams.entries()) {
            if (!urlParams.has(key)) urlParams.append(key, value);
          }
        } else if (endpoint) {
          baseUrl += `/${endpoint}`;
        }

        let url = `${baseUrl}?${urlParams.toString()}`;
        if (searchQuery) {
          url = `${import.meta.env.VITE_API_URL}/api/v2/a/${albums_collection}/title/${searchQuery}?${urlParams.toString()}`;
        }

        // Check for user_id in session and append it to the URL if it exists
        const user_id = sessionStorage.getItem('user_id');
        if (user_id) {
          url += `&user_id=${user_id}`;
        }

        console.log(url);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error fetching albums");
        const data = await response.json();

        const newAlbums = data.data.filter((album: Album) => !albums.some((a) => a._id === album._id));
        sessionStorage.setItem(cacheKey, JSON.stringify(newAlbums));
        setAlbums((prevAlbums) => [...prevAlbums, ...newAlbums]);
        setHasMore(data.pagination.page < data.pagination.total_pages);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    fetchAlbums();
  }, [albums_collection, endpoint, page, filter, random, searchQuery]); // Add searchQuery as a dependency

  const loadMore = () => {
    if (hasMore && !loadingRef.current) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return { albums, loadMore, hasMore, loading, error };
};

export default usePaginatedAlbums;