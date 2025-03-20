import EmblaCarousel from "./EmblaCarousel";

interface RackCarouselProps {
  title: string;
  endpoint: string;
  options: any;
  icono: string;
  fetchAlbumsHook: (endpoint: string) => { albums: any[]; loading: boolean; error: any };
  albums_collection: string;
}

const RackCarousel = ({
  title,
  endpoint,
  options,
  icono,
  fetchAlbumsHook,
  albums_collection,
}: RackCarouselProps) => {
  const { albums, loading, error } = fetchAlbumsHook(endpoint);

  if (loading)
    return <div className="h-64 animate-pulse bg-gray-800 rounded" />;
  if (error)
    return <p>Error cargando {title}: {error}</p>;
  if (albums.length === 0) return null; // Omitir si no hay elementos

  return (
    <EmblaCarousel
      title={title}
      albums={albums}
      options={options}
      endpoint={endpoint}
      icono={icono}
      albums_collection={albums_collection}
    />
  );
};

export default RackCarousel;
