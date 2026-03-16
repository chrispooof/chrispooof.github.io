// MAL API v2 format (returned by the Lambda proxy)

export interface MALPicture {
  medium: string
  large: string
}

export interface MALAnimeNode {
  id: number
  title: string
  main_picture: MALPicture
  num_episodes: number
  color?: string
}

export interface MALAnimeListStatus {
  status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped' | 'on_hold'
  num_episodes_watched: number
  score: number
}

export interface MALAnimeEntry {
  node: MALAnimeNode
  list_status: MALAnimeListStatus
}

export interface MALMangaNode {
  id: number
  title: string
  main_picture: MALPicture
  num_chapters: number
  num_volumes: number
  color?: string
}

export interface MALMangaListStatus {
  status: 'reading' | 'completed' | 'plan_to_read' | 'dropped' | 'on_hold'
  num_chapters_read: number
  num_volumes_read: number
  score: number
}

export interface MALMangaEntry {
  node: MALMangaNode
  list_status: MALMangaListStatus
}
