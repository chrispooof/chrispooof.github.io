import type { Book } from '../types/hardcover'
import type { MALAnimeEntry, MALMangaEntry } from '../types/mal'

const LAMBDA_URL = 'https://wf7u6z3z05.execute-api.us-east-1.amazonaws.com/prod/'

export const STATUS_COLORS: Record<string, string> = {
  watching: '#E6ADD8',
  reading: '#E6ADD8',
  plan_to_watch: '#D7E6AD',
  plan_to_read: '#D7E6AD',
  on_hold: '#F5D76E',
  dropped: '#E6BBAD',
  completed: '#E7F3F7',
}

const lambdaPost = (
  operation: string,
): Promise<{ status_code: number; response: { data: unknown[] } }> =>
  fetch(LAMBDA_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation }),
  }).then((r) => r.json())

/** Fetches the MAL anime list, attaching a status-based color to each entry. */
export const fetchAnimeList = async (): Promise<MALAnimeEntry[]> => {
  const data = await lambdaPost('get_anime_list')
  if (data.status_code !== 200) return []
  return (data.response.data as MALAnimeEntry[]).map((e) => ({
    ...e,
    node: { ...e.node, color: STATUS_COLORS[e.list_status.status] ?? '#F6FCFC' },
  }))
}

/** Fetches books from all Hardcover shelves, keyed by shelf name. */
export const fetchBookList = async (): Promise<Record<string, Book[]>> => {
  const data: { status_code: number; response: Record<string, Book[]> } = await fetch(LAMBDA_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'get_books_from_all_shelves' }),
  }).then((r) => r.json())
  if (data.status_code !== 200) return {}
  return data.response
}

/** Fetches the MAL manga list, attaching a status-based color to each entry. */
export const fetchMangaList = async (): Promise<MALMangaEntry[]> => {
  const data = await lambdaPost('get_manga_list')
  if (data.status_code !== 200) return []
  return (data.response.data as MALMangaEntry[]).map((e) => ({
    ...e,
    node: { ...e.node, color: STATUS_COLORS[e.list_status.status] ?? '#F6FCFC' },
  }))
}
