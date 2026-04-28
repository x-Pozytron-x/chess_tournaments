export type ApiResponse<T> = {
  success: boolean
  data?: T
  message?: string
}
type ApiSuccess<T> = {
  data: T
  message?: string
}
import type { User } from '../types/User'

// api/client.ts — базовый fetcher, чтобы не повторять логику в каждом запросе
export class ApiError extends Error {
  public status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<ApiSuccess<T>> {
  let res: Response

  try {
    res = await fetch(url, options)
  } catch {
    throw new ApiError('Нет соединения с сервером')
  }

  const json: ApiResponse<T> = await res.json()

  if (!res.ok || !json.success) {
    //console.log('errrr - ' + json.message)
    throw new ApiError(json.message ?? 'Неизвестная ошибка', res.status)
  }

  if (json.data === undefined) {
    throw new ApiError('Сервер вернул пустой ответ')
  }

  return {
    data: json.data,
    message: json.message
  }
}

type Fields = {
  login: string,
  pass: string,
  repass: string,
  invited: string,
  agree: boolean,
}
export async function addUser(fields: Fields): Promise<ApiSuccess<User>> {
  return apiFetch<User>('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
}