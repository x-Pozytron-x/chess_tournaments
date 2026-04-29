import { apiFetch } from './apiFetch'
import type { User } from '../types/User'

export function login(data: {
  username: string
  password: string
  remember: boolean
}): Promise<User> {
  return apiFetch<User>('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // ВАЖНО
    body: JSON.stringify(data),
  })
}

export function me(): Promise<User> {
  return apiFetch<User>('/api/me', {
    credentials: 'include',
  })
}

export function logout(): Promise<void> {
  return apiFetch<void>('/api/logout', {
    method: 'POST',
    credentials: 'include',
  })
}