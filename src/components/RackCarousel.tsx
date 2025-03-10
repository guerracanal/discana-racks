import EmblaCarousel from "./EmblaCarousel"; // Asumiendo que ya lo tienes

interface RackCarouselProps {
  title: string;
  endpoint: string;
  options: any;
  fetchAlbumsHook: (endpoint: string) => { albums: any[]; loading: boolean; error: any };
}

const RackCarousel = ({
  title,
  endpoint,
  options,
  fetchAlbumsHook, // Puede ser useFetchAlbums o useFetchAlbumsPendientes
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
    />
  );
};

export default RackCarousel;
