// Hardcover API format (returned by the Lambda proxy)

export interface Book {
  title: string
  author: string
  avg: number | null
  cover_url: string | null
  user_rating: number | null
  url: string | null
}
