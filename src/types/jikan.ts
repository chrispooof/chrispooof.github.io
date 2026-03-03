export interface JikanImages {
  jpg: {
    image_url: string | null
    small_image_url: string | null
    large_image_url: string | null
  }
}

export interface JikanAnimeEntry {
  mal_id: number
  title: string
  url: string
  images: JikanImages
  score: number
  watched_episodes: number
  total_episodes: number
  watch_status: number // 1=watching, 2=completed, 3=on_hold, 4=dropped, 6=plan_to_watch
  airing_status: number // 1=airing, 2=finished
}

export interface JikanMangaEntry {
  mal_id: number
  title: string
  url: string
  images: JikanImages
  score: number
  chapters_read: number
  volumes_read: number
  total_chapters: number
  total_volumes: number
  reading_status: number // 1=reading, 2=completed, 3=on_hold, 4=dropped, 6=plan_to_read
  publishing_status: number // 1=publishing, 2=finished
}

export interface JikanUserAnimeListResponse {
  data: JikanAnimeEntry[]
  pagination: {
    has_next_page: boolean
    last_visible_page: number
  }
}

export interface JikanUserMangaListResponse {
  data: JikanMangaEntry[]
  pagination: {
    has_next_page: boolean
    last_visible_page: number
  }
}
