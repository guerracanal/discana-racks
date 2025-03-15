import React, { useRef, useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom"; // Import useSearchParams
import usePaginatedAlbums from "../hooks/usePaginatedAlbums";
import AlbumCard from "../components/AlbumCard";
import "../styles/AlbumsPage.css"; // Import the new CSS file
import Header from "../components/Header"; // Import the Header component

const AlbumsPage: React.FC = () => {
  const { category, "*": restPath } = useParams<{ category: string; "*": string }>();
  const path = `${category}/${restPath}`;
  const { albums, loadMore, hasMore, loading } = usePaginatedAlbums(path);
  const [searchParams] = useSearchParams(); // Get searchParams
  const filter = (searchParams.get('filter') as "all" | "disc" | "spotify") || 'all'; // Get filter from searchParams

  useEffect(() => {
    // Ensure usePaginatedAlbums is called only once when the component mounts
    loadMore();
  }, [path, loadMore, filter]); // Add filter as a dependency

  const observer = useRef<IntersectionObserver | null>(null);
  const lastAlbumElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadMore, hasMore]
  );

  return (
    <>
      <Header /> {/* Render the Header component */}
      <section className="albums-grid">
        {albums.map((album, index) => {
          if (albums.length === index + 1) {
            return (
              <div className="albums-grid__item" key={album._id} ref={lastAlbumElementRef}>
                <AlbumCard album={album} filter={filter} /> {/* Pass filter to AlbumCard */}
              </div>
            );
          } else {
            return (
              <div className="albums-grid__item" key={album._id}>
                <AlbumCard album={album} filter={filter} /> {/* Pass filter to AlbumCard */}
              </div>
            );
          }
        })}
      </section>
    </>
  );
};

export default AlbumsPage;