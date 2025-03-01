import { useFetchAlbums } from "./hooks/useFetchAlbums";
import EmblaCarousel from "./components/EmblaCarousel";
import { EmblaOptionsType } from 'embla-carousel'

export default function App() {

  const OPTIONS: EmblaOptionsType = {}
  
  const racks = [
    { title: "Novedades", endpoint: "/decade/2024" },
    { title: "Relax", endpoint: "/mood/relajado" },
    { title: "Energico", endpoint: "/mood/Energético" },
    { title: "Los 90", endpoint: "/decade/1990" },
    { title: "Cortitos", endpoint: "/duration/30" },
    { title: "Shoegaze & Dream Pop", endpoint: "/all-genres/shoegaze/dream pop" },
    { title: "Metal", endpoint: "/compilations/Acero" },
    { title: "Japón", endpoint: "/any-genres/J-Rock/j-pop/jpop" },
    { title: "Españita", endpoint: "/country/es" },
    { title: "Épico", endpoint: "/compilations/dragón" },
    { title: "Folk", endpoint: "/all-genres/folk" },
    { title: "Jazz", endpoint: "/all-genres/jazz" },
    { title: "Larga duración", endpoint: "/duration/120/500" },
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

