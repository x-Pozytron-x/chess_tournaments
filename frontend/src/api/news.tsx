export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

import type { News } from '../types/News'

export async function getNews(): Promise<News[]> {
  const res = await fetch('/api/news.php')
  const json: ApiResponse<News[]> = await res.json()

  if (!json.success) {
    throw new Error(json.error ?? 'Unknown error')
  }

  return json.data!
}