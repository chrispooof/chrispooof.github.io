import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import type { AniListAnime, AniListSeasonResponse, AnimeSeason } from '../types/anilist'
import type {
  MALAnimeEntry,
  MALMangaEntry,
  Book,
  LambdaAnimeResponse,
  LambdaMangaResponse,
  LambdaBookResponse,
} from '../types/mal'

const t = initTRPC.create({ allowOutsideOfServer: true })

const LAMBDA_URL = 'https://wf7u6z3z05.execute-api.us-east-1.amazonaws.com/prod/'
const ANILIST_URL = 'https://graphql.anilist.co'

const LAMBDA_OPTS = {
  method: 'POST',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
}

const SEASON_QUERY = `
  query ($season: MediaSeason, $page: Int, $perPage: Int, $seasonYear: Int) {
    page: Page(page: $page, perPage: $perPage) {
      anime: media(season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC) {
        title { native romaji english }
        description
        startDate { year month day }
        endDate { year month day }
        coverImage { extraLarge large medium color }
        bannerImage
        genres
        nextAiringEpisode { airingAt timeUntilAiring episode }
        popularity
        externalLinks { id url site }
      }
    }
  }
`

const STATUS_COLORS: Record<string, string> = {
  watching: '#E6ADD8',
  reading: '#E6ADD8',
  plan_to_watch: '#D7E6AD',
  plan_to_read: '#D7E6AD',
  dropped: '#E6BBAD',
  completed: '#E7F3F7',
}

async function fetchCurrentSeason(season: AnimeSeason, year: number): Promise<AniListAnime[]> {
  const res = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query: SEASON_QUERY, variables: { season, page: 1, perPage: 20, seasonYear: year } }),
  })
  const data: AniListSeasonResponse = await res.json()
  return data.data.page.anime
}

async function fetchAnimeList(): Promise<MALAnimeEntry[]> {
  const res = await fetch(LAMBDA_URL, {
    ...LAMBDA_OPTS,
    body: JSON.stringify({ operation: 'get_anime_list' }),
  })
  const data: LambdaAnimeResponse = await res.json()
  if (data.status_code !== 200) return []
  return data.response.data.map((entry) => ({
    ...entry,
    node: { ...entry.node, color: STATUS_COLORS[entry.list_status.status] ?? '#F6FCFC' },
  }))
}

async function fetchMangaList(): Promise<MALMangaEntry[]> {
  const res = await fetch(LAMBDA_URL, {
    ...LAMBDA_OPTS,
    body: JSON.stringify({ operation: 'get_manga_list' }),
  })
  const data: LambdaMangaResponse = await res.json()
  if (data.status_code !== 200) return []
  return data.response.data.map((entry) => ({
    ...entry,
    node: { ...entry.node, color: STATUS_COLORS[entry.list_status.status] ?? '#F6FCFC' },
  }))
}

async function fetchBookList(): Promise<Record<string, Book[]>> {
  const res = await fetch(LAMBDA_URL, {
    ...LAMBDA_OPTS,
    body: JSON.stringify({ operation: 'get_books_from_all_shelves' }),
  })
  const data: LambdaBookResponse = await res.json()
  if (data.status_code !== 200) return {}
  return data.response
}

export const appRouter = t.router({
  anime: t.router({
    getCurrentSeason: t.procedure
      .input(z.object({ season: z.enum(['WINTER', 'SPRING', 'SUMMER', 'FALL']), year: z.number().int() }))
      .query(({ input }) => fetchCurrentSeason(input.season, input.year)),
    getMyList: t.procedure.query(() => fetchAnimeList()),
  }),
  manga: t.router({
    getMyList: t.procedure.query(() => fetchMangaList()),
  }),
  books: t.router({
    getAll: t.procedure.query(() => fetchBookList()),
  }),
})

export type AppRouter = typeof appRouter
export const createCaller = t.createCallerFactory(appRouter)
