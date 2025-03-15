import { useState, useEffect, useRef } from "react";
import { Album } from "../types/album";
import { useSearchParams } from 'react-router-dom';

const usePaginatedAlbums = (endpoint: string) => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';

  useEffect(() => {
    setAlbums([]);
    setPage(1);
    setHasMore(true);
  }, [endpoint, filter]); // Add filter as a dependency

  useEffect(() => {
    const fetchAlbums = async () => {
      if (loadingRef.current || !hasMore) return;
      loadingRef.current = true;
      setLoading(true);

      try {
        const url = `${import.meta.env.VITE_API_URL}/api/albums/${endpoint}?page=${page}&limit=20&filter=${filter}`;
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) throw new Error("Error fetching albums");
        const data = await response.json();

        setAlbums((prevAlbums) => {
          const newAlbums = data.data.filter((album: Album) => !prevAlbums.some((a) => a._id === album._id));
          return [...prevAlbums, ...newAlbums];
        });
        setHasMore(data.pagination.page < data.pagination.total_pages);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
        loadingRef.current = false;
      }
    };

    fetchAlbums();
  }, [endpoint, page, filter]); // Add filter as a dependency

  const loadMore = () => {
    if (hasMore && !loadingRef.current) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return { albums, loadMore, hasMore, loading, error };
};

export default usePaginatedAlbums;