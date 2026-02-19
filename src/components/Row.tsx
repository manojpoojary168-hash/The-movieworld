import { useMemo, useRef } from 'react'
import type { TMDBTitle } from '../tmdb/types'
import { tmdbImageUrl } from '../tmdb/client'
import { getTitleName, getYear } from '../utils/title'
import { IconChevronLeft, IconChevronRight } from './icons'
import './row.css'

type Props = {
  title: string
  items: TMDBTitle[]
  poster?: boolean
  onPick: (t: TMDBTitle) => void
}

export function Row({ title, items, poster = false, onPick }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const cardSize = poster ? 150 : 220

  const rowItems = useMemo(() => items.filter((t) => (poster ? t.poster_path : t.backdrop_path || t.poster_path)), [
    items,
    poster,
  ])
  const skeletonCount = poster ? 12 : 10

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * (cardSize * 4), behavior: 'smooth' })
  }

  return (
    <section className="row" aria-label={title}>
      <div className="row__head">
        <h2 className="row__title">{title}</h2>
        <div className="row__controls">
          <button className="row__btn" onClick={() => scrollBy(-1)} aria-label="Scroll left">
            <IconChevronLeft />
          </button>
          <button className="row__btn" onClick={() => scrollBy(1)} aria-label="Scroll right">
            <IconChevronRight />
          </button>
        </div>
      </div>

      <div className="row__viewport">
        <div className="row__scroller" ref={scrollerRef}>
          {rowItems.length === 0
            ? Array.from({ length: skeletonCount }).map((_, idx) => (
                <div key={`sk-${idx}`} className={`card card--skeleton ${poster ? 'card--poster' : ''}`} aria-hidden="true" />
              ))
            : rowItems.map((t) => {
                const img = poster ? tmdbImageUrl(t.poster_path, 'w300') : tmdbImageUrl(t.backdrop_path || t.poster_path, 'w500')
                const name = getTitleName(t)
                const year = getYear(t)
                return (
                  <button
                    key={`${t.id}-${t.media_type ?? 'x'}`}
                    className={`card ${poster ? 'card--poster' : ''}`}
                    onClick={() => onPick(t)}
                  >
                    <img className="card__img" src={img} alt={name} loading="lazy" />
                    <div className="card__meta">
                      <div className="card__name">{name}</div>
                      {year ? <div className="card__year">{year}</div> : null}
                    </div>
                  </button>
                )
              })}
        </div>
      </div>
    </section>
  )
}

