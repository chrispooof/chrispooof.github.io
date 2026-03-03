export interface AniListTitle {
  native: string | null
  romaji: string | null
  english: string | null
}

export interface AniListDate {
  year: number | null
  month: number | null
  day: number | null
}

export interface AniListCoverImage {
  extraLarge: string | null
  large: string | null
  medium: string | null
  color: string | null
}

export interface AniListNextAiringEpisode {
  airingAt: number
  timeUntilAiring: number
  episode: number
}

export interface AniListExternalLink {
  id: number
  url: string
  site: string
}

export interface AniListAnime {
  title: AniListTitle
  description: string | null
  startDate: AniListDate
  endDate: AniListDate
  coverImage: AniListCoverImage
  bannerImage: string | null
  genres: string[]
  nextAiringEpisode: AniListNextAiringEpisode | null
  popularity: number
  externalLinks: AniListExternalLink[]
}

export interface AniListPageInfo {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  hasNextPage: boolean
}

export interface AniListSeasonResponse {
  data: {
    page: {
      pageInfo: AniListPageInfo
      anime: AniListAnime[]
    }
  }
}

export type AnimeSeason = 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'
