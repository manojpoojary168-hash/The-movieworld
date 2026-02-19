const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string | undefined

export function assertTmdbConfigured() {
  if (!API_KEY) {
    throw new Error('Missing VITE_TMDB_API_KEY. Add it to .env.local and restart the dev server.')
  }
}

export function tmdbImageUrl(
  path: string | null | undefined,
  size: 'w300' | 'w500' | 'w780' | 'original' = 'w500',
) {
  if (!path) return ''
  return `https://image.tmdb.org/t/p/${size}${path}`
}

type RequestOptions = {
  signal?: AbortSignal
  params?: Record<string, string | number | boolean | undefined>
}

export async function tmdbGet<T>(path: string, options: RequestOptions = {}): Promise<T> {
  assertTmdbConfigured()

  const url = new URL(`${BASE_URL}${path}`)
  url.searchParams.set('api_key', API_KEY!)
  url.searchParams.set('language', 'en-US')

  if (options.params) {
    for (const [key, value] of Object.entries(options.params)) {
      if (value === undefined) continue
      url.searchParams.set(key, String(value))
    }
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    signal: options.signal,
    headers: {
      accept: 'application/json',
    },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`TMDB ${res.status} ${res.statusText}${body ? `: ${body}` : ''}`)
  }

  return (await res.json()) as T
}

