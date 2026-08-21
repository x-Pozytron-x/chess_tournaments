export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

// api/news.ts
import { apiFetch } from './apiFetch'
import type { News } from '../types/News'

export async function getNews(): Promise<News[]> {
  return apiFetch<News[]>('/api/news')
}

// И так же легко добавлять новые эндпоинты:
export async function getNewsById(id: number): Promise<News> {
  const response = await fetch(`/api/new/id=${id}`);
  const data = await response.json();
  return data;
}