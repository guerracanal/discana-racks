import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import AlbumCard from "./AlbumCard";

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
  title: string
  albums: Album[]
}

interface Album {
  id: string;
  title: string;
  cover: string;
}

interface CarouselProps {
  title: string;
  albums: Album[];
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options, albums, title} = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <section className="embla">
      <h2 className="text-5xl font-bold mb-2">{title}</h2>
      <p>Ver más →</p>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
        {albums
          //.sort(() => Math.random() - 0.5)  // Reordena los elementos aleatoriamente
          .map((album) => (
            <div className="embla__slide" key={album.id}>
              <div className="embla__slide__card"><AlbumCard album={album} /></div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
