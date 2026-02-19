import { useEffect } from 'react'
import './playerModal.css'

type Props = {
  open: boolean
  title: string
  youtubeKey?: string
  onClose: () => void
}

export function PlayerModal({ open, title, youtubeKey, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="playerModal" role="dialog" aria-modal="true" aria-label="Trailer player">
      <button className="playerModal__backdrop" onClick={onClose} aria-label="Close" />
      <div className="playerModal__panel">
        <div className="playerModal__header">
          <div className="playerModal__title" title={title}>
            {title}
          </div>
          <button className="playerModal__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="playerModal__body">
          {youtubeKey ? (
            <iframe
              className="playerModal__frame"
              src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&mute=0&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="playerModal__empty">Trailer not available.</div>
          )}
        </div>
      </div>
    </div>
  )
}

