import { useInView } from 'react-intersection-observer';
import { useFetchAlbums } from "./hooks/useFetchAlbums";
import EmblaCarousel from "./components/EmblaCarousel";
import { EmblaOptionsType } from 'embla-carousel'
import { useFetchRacks } from "./hooks/useFetchRacks";

interface Rack {
  title: string;
  endpoint: string;
}

const RackCarousel = ({ title, endpoint, options }: Rack & { options: EmblaOptionsType }) => {
  const { albums, loading, error } = useFetchAlbums(endpoint);
  
  if (loading) return <div className="h-64 animate-pulse bg-gray-800 rounded" />;
  if (error) return <p>Error cargando {title}: {error}</p>;
  
  return <EmblaCarousel title={title} albums={albums} options={options} />;
};

const LazyRack = ({ rack, options }: { rack: Rack; options: EmblaOptionsType }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px',
  });

  return (
    <div ref={ref} className="min-h-[400px]">
      {inView && <RackCarousel title={rack.title} endpoint={rack.endpoint} options={options} />}
    </div>
  );
};

export default function App() {
  const OPTIONS: EmblaOptionsType = {align: 'start', dragFree: true, loop: true };
  const { racks, loading, error } = useFetchRacks();

  if (loading) return <p>Cargando racks...</p>;
  if (error) return <p>Error cargando racks: {error}</p>;

  return (
    <div className="p-4 text-white min-h-screen">
      <h1 className="text-5xl font-bold text-center mb-4">Discos</h1>
      {racks.map((rack: Rack) => (
        <LazyRack key={rack.title} rack={rack} options={OPTIONS} />
      ))}
    </div>
  );
}