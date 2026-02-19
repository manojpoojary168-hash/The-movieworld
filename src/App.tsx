import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { useAbortController } from './hooks/useAbortController'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { Hero } from './components/Hero'
import { Row } from './components/Row'
import { PlayerModal } from './components/PlayerModal'
import { tmdb } from './tmdb/endpoints'
import type { TMDBTitle } from './tmdb/types'
import { getTitleName } from './utils/title'

function guessMediaType(t: TMDBTitle): 'movie' | 'tv' {
  if (t.media_type === 'tv' || t.media_type === 'movie') return t.media_type
  if (t.first_air_date) return 'tv'
  return 'movie'
}

export default function App() {
  const controller = useAbortController()
  const configured = Boolean(import.meta.env.VITE_TMDB_API_KEY)

  const [featured, setFeatured] = useState<TMDBTitle | undefined>()
  const [trendingNow, setTrendingNow] = useState<TMDBTitle[]>([])
  const [newThisWeek, setNewThisWeek] = useState<TMDBTitle[]>([])
  const [topRated, setTopRated] = useState<TMDBTitle[]>([])
  const [popularTv, setPopularTv] = useState<TMDBTitle[]>([])
  const [error, setError] = useState<string | null>(null)

  const [playerOpen, setPlayerOpen] = useState(false)
  const [playerTitle, setPlayerTitle] = useState('')
  const [playerKey, setPlayerKey] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!configured) return
    const signal = controller.signal

    Promise.all([
      tmdb.trendingAllWeek(signal),
      tmdb.trendingMoviesWeek(signal),
      tmdb.nowPlayingMovies(signal),
      tmdb.topRatedMovies(signal),
      tmdb.popularTv(signal),
    ])
      .then(([allWeek, moviesWeek, nowPlaying, top, tv]) => {
        setError(null)
        setTrendingNow(allWeek.results)
        setNewThisWeek(moviesWeek.results)
        setTopRated(top.results)
        setPopularTv(tv.results)

        const pool = [...allWeek.results, ...nowPlaying.results].filter((t) => t.backdrop_path || t.poster_path)
        const picked = pool[Math.floor(Math.random() * Math.max(pool.length, 1))]
        setFeatured(picked)
      })
      .catch((e: unknown) => {
        if (signal.aborted) return
        setError(e instanceof Error ? e.message : String(e))
      })
  }, [configured, controller])

  const openTrailer = useCallback(
    async (t: TMDBTitle) => {
      const mediaType = guessMediaType(t)
      setPlayerTitle(getTitleName(t))
      setPlayerKey(undefined)
      setPlayerOpen(true)

      try {
        const v = await tmdb.videos(mediaType, t.id, controller.signal)
        const youtube = v.results.filter((x) => x.site === 'YouTube')
        const best =
          youtube.find((x) => x.type === 'Trailer' && x.official) ||
          youtube.find((x) => x.type === 'Trailer') ||
          youtube.find((x) => x.type === 'Teaser') ||
          youtube[0]
        setPlayerKey(best?.key)
      } catch {
        if (controller.signal.aborted) return
        setPlayerKey(undefined)
      }
    },
    [controller],
  )

  const closePlayer = useCallback(() => setPlayerOpen(false), [])

  const heroItem = useMemo(() => featured || trendingNow.find((t) => t.backdrop_path) || trendingNow[0], [featured, trendingNow])
  const configError = configured ? null : 'TMDB key missing. Add VITE_TMDB_API_KEY to .env.local and restart the dev server.'
  const shownError = configError || error

  return (
    <div className="app">
      <Sidebar />
      <TopBar username="Manoj" />

      {shownError ? <div className="errorBanner">{shownError}</div> : null}

      <Hero
        item={heroItem}
        onPlay={() => {
          if (heroItem) void openTrailer(heroItem)
        }}
        onMoreInfo={() => {
          if (heroItem) void openTrailer(heroItem)
        }}
      />

      <main className="main">
        <Row
          title="New this week"
          items={newThisWeek}
          poster
          onPick={(t) => {
            void openTrailer(t)
          }}
        />
        <Row
          title="Trending Now"
          items={trendingNow}
          onPick={(t) => {
            void openTrailer(t)
          }}
        />
        <Row
          title="Top Rated Movies"
          items={topRated}
          onPick={(t) => {
            void openTrailer(t)
          }}
        />
        <Row
          title="Popular TV"
          items={popularTv}
          onPick={(t) => {
            void openTrailer(t)
          }}
        />
      </main>

      <PlayerModal open={playerOpen} title={playerTitle} youtubeKey={playerKey} onClose={closePlayer} />
    </div>
  )
}
