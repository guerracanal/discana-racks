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

type PropType = {
  options?: EmblaOptionsType
  title: string
  albums: Album[]
  endpoint: string
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { options, albums, title, endpoint } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
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
        <h2 className="title-rack text-xl lg:text-4xl font-bold group inline-flex items-center">
          {title}
          <span className="more text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2">
            <a href={endpoint} className="flex items-center space-x-1">
              <span>ver más</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 transition-colors duration-200"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </a>
          </span>
        </h2>

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
                <AlbumCard album={album} />
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
