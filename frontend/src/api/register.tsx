import type { User } from '../types/User'
import { apiFetch } from './apiFetch'

type Fields = {
  login: string,
  pass: string,
  repass: string,
  invited: string,
  agree: boolean,
}

export async function addUser(fields: Fields): Promise<User> {
  return apiFetch<User>('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
}