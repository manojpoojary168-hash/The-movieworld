export type TMDBMediaType = 'movie' | 'tv'

export type TMDBTitle = {
  id: number
  media_type?: TMDBMediaType
  title?: string
  name?: string
  original_title?: string
  original_name?: string
  overview?: string
  backdrop_path?: string | null
  poster_path?: string | null
  vote_average?: number
  release_date?: string
  first_air_date?: string
  genre_ids?: number[]
}

export type TMDBListResponse<T> = {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export type TMDBVideo = {
  id: string
  iso_639_1: string
  iso_3166_1: string
  key: string
  name: string
  official: boolean
  published_at: string
  site: 'YouTube' | string
  size: number
  type: string
}

export type TMDBVideosResponse = {
  id: number
  results: TMDBVideo[]
}

