import * as React from "react";
import { useRef, useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import usePaginatedAlbums from "../hooks/usePaginatedAlbums";
import AlbumCard from "../components/AlbumCard";
import "../styles/AlbumsPage.css";
import Header from "../components/Header";
import LoadingPopup from "../components/LoadingPopup";
import spinner from "../assets/spinner.svg";

const AlbumsPage: React.FC = () => {
  //const { albums_collection = "albums", "*": category } = useParams<{ albums_collection: string; "*": string }>();
  //const path = category || "";
  //const { albums, loadMore, hasMore, loading } = usePaginatedAlbums(albums_collection, path);
  const { albums_collection = "albums" } = useParams(); // Keep this for albums_collection
  const [searchParams] = useSearchParams();
  const endpoint = searchParams.get('endpoint') || ''; // Or a more appropriate default
  const filterType = (searchParams.get('filter') as "all" | "disc" | "spotify") || 'all';
  const albumsCollectionParam = searchParams.get('albums_collection'); // Get albums_collection from query parameters if available
  const albums_collection_param = albumsCollectionParam ?? albums_collection; // Use query parameter or route parameter

  const { albums, loadMore, hasMore, loading } = usePaginatedAlbums(albums_collection_param, endpoint); // Usa albums_collection_param

  const searchQuery = searchParams.get('search') || '';
  const navigate = useNavigate();
  const location = useLocation();
  const { title: stateTitle } = location.state || {};
  const pageTitle = stateTitle || `Resultados de la búsqueda: ${searchQuery}`;
  const [isPopupVisible, setPopupVisibility] = useState(window.innerWidth >= 1024);
  const [initialLoading, setInitialLoading] = useState(true); // Track initial loading state

  const handleBackNavigation = () => navigate(-1);

  const handleClosePopup = () => {
    setPopupVisibility(false);
    navigate(-1);
  };

  useEffect(() => {
    const updatePopupVisibility = () => setPopupVisibility(window.innerWidth >= 1024);
    window.addEventListener('resize', updatePopupVisibility);
    return () => window.removeEventListener('resize', updatePopupVisibility);
  }, []);

  useEffect(() => {
    if (initialLoading) {
      loadMore(); // Load the first page of albums
      setInitialLoading(false); // Mark initial loading as complete
    }
  }, [initialLoading, loadMore]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastAlbumRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadMore, hasMore]
  );

  return (
    <>
      <Header />
      <LoadingPopup isLoading={initialLoading} /> {/* Show only during initial loading */}
      <div
        className={`${isPopupVisible ? 'popup-container' : ''}`}
        style={{
          position: "relative",
          overflow: "visible",
          marginTop: isPopupVisible ? "80px" : "0",
          paddingTop: isPopupVisible ? "0px" : "0"
        }}
      >
        <header className={`sticky top-16 left-0 right-0 z-40 bg-gray-800 shadow-lg h-16 flex items-center ${isPopupVisible ? 'popup-header' : ''}`}>
          <button onClick={handleBackNavigation} className="cursor-pointer text-white ml-4">
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-white mx-auto">{pageTitle}</h1>
          {isPopupVisible && (
            <button onClick={handleClosePopup} className="cursor-pointer text-white mr-4">
              <FaTimes size={20} />
            </button>
          )}
        </header>

        <section className="albums-grid pt-16">
          {albums.map((album, index) => (
            <div
              className="albums-grid__item"
              key={album._id}
              ref={albums.length === index + 1 ? lastAlbumRef : null}
            >
              <AlbumCard album={album} filter={filterType} albums_collection={albums_collection}/>
            </div>
          ))}
        </section>

        {loading && (
          <div className="text-center text-white mt-4">
            <img
              src={spinner}
              alt="Cargando..."
              className="w-12 h-12 mx-auto"
            />
            Cargando...
          </div>
        )}
      </div>
    </>
  );
};

export default AlbumsPage;