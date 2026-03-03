import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import type { AniListAnime, AniListSeasonResponse, AnimeSeason } from '../types/anilist'
import type { JikanAnimeEntry, JikanMangaEntry } from '../types/jikan'

const t = initTRPC.create({ allowOutsideOfServer: true })

const JIKAN_USERNAME = 'chrisfernandes18'
const ANILIST_URL = 'https://graphql.anilist.co'
const JIKAN_URL = 'https://api.jikan.moe/v4'

const SEASON_QUERY = `
  query ($season: MediaSeason, $page: Int, $perPage: Int, $seasonYear: Int) {
    page: Page(page: $page, perPage: $perPage) {
      pageInfo {
        total perPage currentPage lastPage hasNextPage
      }
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

async function fetchAniListSeason(season: AnimeSeason, year: number): Promise<AniListAnime[]> {
  const response = await fetch(ANILIST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      query: SEASON_QUERY,
      variables: { season, page: 1, perPage: 20, seasonYear: year },
    }),
  })
  const data: AniListSeasonResponse = await response.json()
  return data.data.page.anime
}

async function fetchJikanAnimeList(): Promise<JikanAnimeEntry[]> {
  const response = await fetch(
    `${JIKAN_URL}/users/${JIKAN_USERNAME}/animelist?limit=300`,
  )
  const data = await response.json()
  return data.data as JikanAnimeEntry[]
}

async function fetchJikanMangaList(): Promise<JikanMangaEntry[]> {
  const response = await fetch(
    `${JIKAN_URL}/users/${JIKAN_USERNAME}/mangalist?limit=300`,
  )
  const data = await response.json()
  return data.data as JikanMangaEntry[]
}

export const appRouter = t.router({
  anime: t.router({
    getCurrentSeason: t.procedure
      .input(
        z.object({
          season: z.enum(['WINTER', 'SPRING', 'SUMMER', 'FALL']),
          year: z.number().int(),
        }),
      )
      .query(({ input }) => fetchAniListSeason(input.season, input.year)),

    getMyList: t.procedure
      .query(() => fetchJikanAnimeList()),
  }),

  manga: t.router({
    getMyList: t.procedure
      .query(() => fetchJikanMangaList()),
  }),
})

export type AppRouter = typeof appRouter
export const createCaller = t.createCallerFactory(appRouter)
