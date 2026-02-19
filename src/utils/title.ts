import type { TMDBTitle } from '../tmdb/types'

export function getTitleName(t: TMDBTitle) {
  return t.title || t.name || t.original_title || t.original_name || 'Untitled'
}

export function getYear(t: TMDBTitle) {
  const date = t.release_date || t.first_air_date
  return date ? date.slice(0, 4) : ''
}

