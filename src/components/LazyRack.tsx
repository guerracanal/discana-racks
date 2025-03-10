import { useInView } from "react-intersection-observer";
import RackCarousel from "./RackCarousel";

interface LazyRackProps {
  rack: {
    title: string;
    endpoint: string;
  };
  options: any;
  fetchAlbumsHook: (endpoint: string) => { albums: any[]; loading: boolean; error: any };
}

const LazyRack: React.FC<LazyRackProps> = ({ rack, options, fetchAlbumsHook }) => {
  const fetchAlbums = () => fetchAlbumsHook(rack.endpoint);
    const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: "200px",
  });

  return (
    <div ref={ref} className="min-h-100">
      {inView && (
        <RackCarousel
          title={rack.title}
          endpoint={rack.endpoint}
          options={options}
          fetchAlbumsHook={fetchAlbums}
        />
      )}
    </div>
  );
};

export default LazyRack;
