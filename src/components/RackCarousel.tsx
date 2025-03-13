import EmblaCarousel from "./EmblaCarousel"; // Asumiendo que ya lo tienes

interface RackCarouselProps {
  title: string;
  endpoint: string;
  options: any;
  icono: string;
  fetchAlbumsHook: (endpoint: string) => { albums: any[]; loading: boolean; error: any };
}

const RackCarousel = ({
  title,
  endpoint,
  options,
  icono,
  fetchAlbumsHook,
}: RackCarouselProps) => {
  const { albums, loading, error } = fetchAlbumsHook(endpoint);

  if (loading)
    return <div className="h-64 animate-pulse bg-gray-800 rounded" />;
  if (error)
    return <p>Error cargando {title}: {error}</p>;

  return (
    <EmblaCarousel
      title={title}
      albums={albums}
      options={options}
      endpoint={endpoint}
      icono={icono}
    />
  );
};

export default RackCarousel;
