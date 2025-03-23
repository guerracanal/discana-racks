import { useInView } from "react-intersection-observer";
import RackCarousel from "./RackCarousel";
import LoadingPopup from "./LoadingPopup"; // Import LoadingPopup

interface LazyRackProps {
  albums_collection: string;
  rack_collection: string;
  rack: {
    title: string;
    endpoint: string;
    icono: string;
  };
  options: any;
  fetchAlbumsHook: (albums_collection: string, endpoint: string, random: boolean) => { albums: any[]; loading: boolean; error: any};
  random: boolean;
}

const LazyRack: React.FC<LazyRackProps> = ({albums_collection, rack, options, fetchAlbumsHook, random }) => {
  const fetchAlbums = () => fetchAlbumsHook(albums_collection, rack.endpoint, random);
  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: "200px",
  });
  const { loading, error } = fetchAlbums(); // Call fetchAlbums immediately

  return (
    <div ref={ref} className="lazy-rack min-h-100">
      <LoadingPopup isLoading={loading} /> {/* Show LoadingPopup while loading */}
      {inView && (
        <RackCarousel
          title={rack.title}
          endpoint={rack.endpoint}
          options={options}
          icono={rack.icono}
          fetchAlbumsHook={fetchAlbums} 
          albums_collection={albums_collection}
           />
      )}
      {error && <p>Error loading {rack.title}: {error}</p>} {/* Display error message */}
    </div>
  );
};

export default LazyRack;
