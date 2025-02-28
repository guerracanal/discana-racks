import { useState } from "react";
import AlbumCard from "./AlbumCard";
import useEmblaCarousel from 'embla-carousel-react'

interface Album {
  id: string;
  title: string;
  cover: string;
}

interface CarouselProps {
  title: string;
  albums: Album[];
}

export default function Carousel({ title, albums }: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [emblaRef] = useEmblaCarousel()

  return (
    <div className="embla" ref={emblaRef}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="embla__container">
        <div className="embla__slide">
          {albums.slice(index, index + 5).map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </div>
    </div>
  );
}
