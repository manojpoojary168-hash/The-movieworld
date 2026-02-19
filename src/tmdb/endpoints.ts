import { tmdbGet } from './client'
import type { TMDBListResponse, TMDBTitle, TMDBVideosResponse } from './types'

export const tmdb = {
  trendingAllWeek: (signal?: AbortSignal) =>
    tmdbGet<TMDBListResponse<TMDBTitle>>('/trending/all/week', { signal }),

  trendingMoviesWeek: (signal?: AbortSignal) =>
    tmdbGet<TMDBListResponse<TMDBTitle>>('/trending/movie/week', { signal }),

  topRatedMovies: (signal?: AbortSignal) =>
    tmdbGet<TMDBListResponse<TMDBTitle>>('/movie/top_rated', { signal }),

  upcomingMovies: (signal?: AbortSignal) =>
    tmdbGet<TMDBListResponse<TMDBTitle>>('/movie/upcoming', { signal }),

  nowPlayingMovies: (signal?: AbortSignal) =>
    tmdbGet<TMDBListResponse<TMDBTitle>>('/movie/now_playing', { signal }),

  popularTv: (signal?: AbortSignal) => tmdbGet<TMDBListResponse<TMDBTitle>>('/tv/popular', { signal }),

  videos: (mediaType: 'movie' | 'tv', id: number, signal?: AbortSignal) =>
    tmdbGet<TMDBVideosResponse>(`/${mediaType}/${id}/videos`, { signal }),
}

