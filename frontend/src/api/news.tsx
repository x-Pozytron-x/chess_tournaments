export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

import type { News } from '../types/News'

// api/news.ts
export async function getNews(): Promise<News[]> {
  const response = await fetch('/api/news');
  const data = await response.json();
  return data;
}

// И так же легко добавлять новые эндпоинты:
export async function getNewsById(id: number): Promise<News> {
  const response = await fetch(`/api/new/id=${id}`);
  const data = await response.json();
  return data;
}