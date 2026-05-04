export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

import type { News } from '../types/News'

// api/client.ts — базовый fetcher, чтобы не повторять логику в каждом запросе
export class ApiError extends Error {
  public status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  let res: Response

  try {
    res = await fetch(url, options)
  } catch {
    throw new ApiError('Нет соединения с сервером')
  }

  const json: ApiResponse<T> = await res.json()

  if (!res.ok || !json.success) {
    throw new ApiError(json.error ?? 'Неизвестная ошибка', res.status)
  }

  if (json.data === undefined) {
    throw new ApiError('Сервер вернул пустой ответ')
  }

  return json.data
}

// api/news.ts
export async function getNews(): Promise<News[]> {
  return apiFetch<News[]>('/api/news')
}

// И так же легко добавлять новые эндпоинты:
export async function getNewsById(id: number): Promise<News> {
  return apiFetch<News>(`/api/new/id=${id}`)
}