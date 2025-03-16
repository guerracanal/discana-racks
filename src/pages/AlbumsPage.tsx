import React, { useRef, useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import usePaginatedAlbums from "../hooks/usePaginatedAlbums";
import AlbumCard from "../components/AlbumCard";
import "../styles/AlbumsPage.css";
import Header from "../components/Header";

interface AlbumsPageProps {}

const AlbumsPage: React.FC<AlbumsPageProps> = () => {
  const { albums_collection = "albums", "*": category } = useParams<{ albums_collection: string; "*": string }>();
  const path = category || "";
  const { albums, loadMore, hasMore, loading } = usePaginatedAlbums(albums_collection, path);
  const [searchParams] = useSearchParams();
  const filter = (searchParams.get('filter') as "all" | "disc" | "spotify") || 'all';
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const title = queryParams.get('title');
  const [isPopupVisible, setIsPopupVisible] = useState(window.innerWidth >= 1024);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCloseClick = () => {
    setIsPopupVisible(false);
    navigate(-1);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsPopupVisible(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    loadMore();
  }, [path, loadMore, filter]);

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
      <div className={`pt-0 ${isPopupVisible ? 'popup-container' : ''}`}>
        <header className={`fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-lg h-16 flex items-center ${isPopupVisible ? 'popup-header' : ''}`}>
          <button onClick={handleBackClick} className="text-white ml-4">
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white mx-auto">{title}</h1>
          {isPopupVisible && (
            <button onClick={handleCloseClick} className="text-white mr-4">
              <FaTimes size={20} />
            </button>
          )}
        </header>

        <section className="albums-grid pt-16">
          {albums.map((album, index) => {
            if (albums.length === index + 1) {
              return (
                <div className="albums-grid__item" key={album._id} ref={lastAlbumElementRef}>
                  <AlbumCard album={album} filter={filter} />
                </div>
              );
            } else {
              return (
                <div className="albums-grid__item" key={album._id}>
                  <AlbumCard album={album} filter={filter} />
                </div>
              );
            }
          })}
        </section>
      </div>
    </>
  );
};

export default AlbumsPage;