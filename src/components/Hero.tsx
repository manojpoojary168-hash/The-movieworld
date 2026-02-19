import type { TMDBTitle } from '../tmdb/types'
import { tmdbImageUrl } from '../tmdb/client'
import { getTitleName } from '../utils/title'
import { IconInfo, IconPlay } from './icons'
import './hero.css'

type Props = {
  item?: TMDBTitle
  onPlay: () => void
  onMoreInfo: () => void
}

export function Hero({ item, onPlay, onMoreInfo }: Props) {
  const title = item ? getTitleName(item) : 'Loading…'
  const overview = item?.overview || ''
  const backdrop = tmdbImageUrl(item?.backdrop_path || item?.poster_path, 'original')

  return (
    <section className="hero" aria-label="Featured">
      <div className="hero__bg" style={backdrop ? { backgroundImage: `url(${backdrop})` } : undefined} />
      <div className="hero__shade" />

      <div className="hero__content">
        <div className="hero__kicker">N SERIES</div>
        <h1 className="hero__title">{title}</h1>
        <p className="hero__desc">{overview || 'Discover something great to watch today.'}</p>

        <div className="hero__actions">
          <button className="btn btn--primary" onClick={onPlay} disabled={!item} aria-label="Play trailer">
            <IconPlay />
            <span>Play</span>
          </button>
          <button className="btn btn--ghost" onClick={onMoreInfo} disabled={!item} aria-label="More info">
            <IconInfo />
            <span>Watch Trailer</span>
          </button>
        </div>
      </div>
    </section>
  )
}

