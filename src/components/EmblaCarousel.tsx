import React, { useCallback, useEffect, useState } from 'react'
import { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import AlbumCard from "./AlbumCard";
import { Album } from '../types/album';

import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import { FaAngleDoubleRight } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';

type PropType = {
  options?: EmblaOptionsType
  title: string
  albums: Album[]
  endpoint: string
  icono: string
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options, albums, title, endpoint, icono } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all';
  const [scrollProgress, setScrollProgress] = useState(0)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()))
    // setScrollProgress(progress * 100) // sin loop
    setScrollProgress((prevProgress) => {
      if (Math.abs(prevProgress - progress * 100) > 0.5) {
        return progress * 100;
      }
      return prevProgress;
    });
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onScroll(emblaApi)
    emblaApi
      .on('reInit', onScroll)
      .on('scroll', onScroll)
      .on('slideFocus', onScroll)
  }, [emblaApi, onScroll])

  return (
    <section className="embla">
      <div className="embla__header flex items-center justify-between">
        <a href={`${endpoint}?title=${encodeURIComponent(title)}&filter=${filter}`}><h2 className="title-rack text-xl lg:text-4xl font-bold group inline-flex items-center">
          {icono && (
            <img
              src={icono}
              alt={title}
              className="w-6 h-6 mr-2"
            />
          )}
          {title}
          <span className="more text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2">
            <span className="flex items-center space-x-1">
              <FaAngleDoubleRight />
            </span>
          </span>
        </h2>
        </a>


        <div className="embla__progress">
          <div
            className="embla__progress__bar"
            style={{ transform: `translate3d(${scrollProgress}%, 0, 0)` }}
          />
        </div>
      </div>
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {albums.map((album) => (
            <div className="embla__slide" key={title + album.artist + album.title}>
              <div className="embla__slide__card">
                <AlbumCard album={album} filter={'all'} />
              </div>
            </div>
          ))}
        </div>

        <PrevButton
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
          className="embla__button embla__button--prev"
        />
        <NextButton
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
          className="embla__button embla__button--next"
        />
      </div>
    </section>
  )
}

export default EmblaCarousel
