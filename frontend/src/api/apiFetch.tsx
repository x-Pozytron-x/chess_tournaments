import type { ApiResponse } from '../types/Api'
import { ApiError } from './apiError'

export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<T> {

  let res: Response

  try {
    res = await fetch(url, {
      ...options,
      credentials: 'include'
    })
  } catch {
    throw new ApiError('NETWORK_ERROR')
  }

  const json: ApiResponse<T> = await res.json()

  if (!res.ok || !json.success) {

    console.log(json)
    throw new ApiError(
      json.success === false ? json.errorCode : 'UNKNOWN_ERROR',
      res.status
    )
  }
  return json.data
}