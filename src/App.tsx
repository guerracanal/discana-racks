import { useFetchAlbums } from "./hooks/useFetchAlbums";
import EmblaCarousel from "./components/EmblaCarousel";
import { EmblaOptionsType } from 'embla-carousel'

export default function App() {

  const OPTIONS: EmblaOptionsType = {}
  
  const racks = [
    { title: "Novedades", endpoint: "/decade/2024" },
    { title: "Shoegaze", endpoint: "/all-genres/shoegaze" },
    { title: "Metal", endpoint: "/compilations/Acero" },
    { title: "Rock Alternativo", endpoint: "/genre/Rock Alternativo" },
    { title: "Punk", endpoint: "/any-genres/Punk Rock" },
    { title: "Grunge", endpoint: "/any-genres/Grunge" },
    { title: "Japón", endpoint: "/any-genres/J-Rock/j-pop/jpop" },
    { title: "Rock Español", endpoint: "/any-genres/Rock Urbano" },
    { title: "Oldies", endpoint: "/decade/1960" },
    { title: "Épico", endpoint: "/compilations/dragón" },
    { title: "Funk", endpoint: "/all-genres/funk" },
    { title: "Folk", endpoint: "/genre/folk" },
    { title: "Jazz", endpoint: "/all-genres/jazz" },
    { title: "RHCP", endpoint: "/artist/Red Hot Chili Peppers" },
    { title: "Cortitos", endpoint: "/duration/30" },
    { title: "En vinilo", endpoint: "/format/vinilo" },
    { title: "En CD", endpoint: "/format/cd" },
  ];

  return (
    <div className="p-4 text-white min-h-screen">
      <h1 className="text-5xl font-bold text-center mb-4">Discos</h1>
      {racks.map(({ title, endpoint }) => {
        const { albums, loading, error } = useFetchAlbums(endpoint);
        if (loading) return <p>Cargando {title}...</p>;
        if (error) return <p>Error cargando {title}: {error}</p>;
        return <EmblaCarousel key={title} title={title} albums={albums} options={OPTIONS} />
      })}
    </div>
  );
}

