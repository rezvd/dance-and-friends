import { useState } from 'react'

import balboaVideoOne from '@/assets/video/balboa_1.mp4'
import balboaVideoTwo from '@/assets/video/balboa_2.mp4'
import bluesVideoOne from '@/assets/video/blues_1.mp4'
import bluesVideoTwo from '@/assets/video/blues_2.mp4'
import lindyVideoOne from '@/assets/video/lindy_1.mp4'
import lindyVideoTwo from '@/assets/video/lindy_2.mp4'
import { directions } from '@/entities/project/model/school-info'

import './directions-page.css'

const directionMedia = {
  lindy: {
    videos: [lindyVideoOne, lindyVideoTwo],
  },
  blues: {
    videos: [bluesVideoOne, bluesVideoTwo],
  },
  balboa: {
    videos: [balboaVideoOne, balboaVideoTwo],
  },
} as const

export function DirectionsPage() {
  return (
    <div className="directions-page">
      <header className="directions-page__hero">
        <div className="directions-page__hero-inner">
          <h1>Наши направления</h1>
        </div>
      </header>

      <section
        className="directions-page__list"
        aria-label="Танцевальные направления"
      >
        {directions.map((direction) => {
          const media = directionMedia[direction.id]

          return (
            <article className="direction-card" key={direction.id}>
                <div className="direction-card__media">
                  <DirectionVideoGallery
                    title={direction.title}
                    videos={media.videos}
                />
              </div>
              <div className="direction-card__content">
                <h2>{direction.title}</h2>
                <p>{renderHighlightedText(direction.description)}</p>
              </div>
            </article>
          )
        })}
      </section>

      <section className="directions-start" aria-labelledby="directions-start-title">
        <h2 id="directions-start-title">С чего начать?</h2>
        <div className="directions-start__grid">
          <article className="directions-start__card directions-start__card--accent">
            <h3>Попробовать</h3>
            <p>
              Приходите на пробное занятие — познакомитесь с танцами вживую и
              сможете понять, что нравится именно вам
            </p>
          </article>
          <article className="directions-start__card directions-start__card--strong">
            <h3>Можно не выбирать :)</h3>
            <p>
              Совсем не обязательно останавливаться на одном танце! Многие со
              временем пробуют два, а то и все три направления — опыт в одном
              помогает быстрее освоиться в другом
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}

type DirectionVideoGalleryProps = {
  title: string
  videos: readonly string[]
}

function DirectionVideoGallery({
  title,
  videos,
}: DirectionVideoGalleryProps) {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0)
  const activeVideo = videos[activeVideoIndex]

  const showPreviousVideo = () => {
    setActiveVideoIndex((index) => (index - 1 + videos.length) % videos.length)
  }

  const showNextVideo = () => {
    setActiveVideoIndex((index) => (index + 1) % videos.length)
  }

  return (
    <div className="video-gallery">
      <div className="video-gallery__frame">
        <video
          aria-label={`${title}, видео ${activeVideoIndex + 1}`}
          controls
          key={activeVideo}
          playsInline
          preload="metadata"
          src={activeVideo}
        />
        <button
          className="video-gallery__arrow video-gallery__arrow--previous"
          type="button"
          aria-label="Предыдущее видео"
          onClick={showPreviousVideo}
        >
          &lt;
        </button>

        <button
          className="video-gallery__arrow video-gallery__arrow--next"
          type="button"
          aria-label="Следующее видео"
          onClick={showNextVideo}
        >
          &gt;
        </button>
      </div>
    </div>
  )
}

function renderHighlightedText(text: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong className="direction-card__highlight" key={`${part}-${index}`}>
          {part.slice(2, -2)}
        </strong>
      )
    }

    return part
  })
}
