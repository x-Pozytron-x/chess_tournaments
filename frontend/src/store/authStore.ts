import { create } from 'zustand'
import type { User } from '../types/User'
import { login, me, logout } from '../api/auth'
import { ApiError } from '../api/apiError'

type AuthState = {
  user: User | null
  isLoading: boolean
  error: string | null

  login: (data: {
    username: string
    password: string
    remember: boolean
  }) => Promise<void>

  checkAuth: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const user = await login(data)
      set({ user })
    } catch (err) {
      if (err instanceof ApiError) {
        set({ error: err.code })
      } else {
        set({ error: 'UNKNOWN_ERROR' })
      }
    } finally {
      set({ isLoading: false })
    }
  },

  checkAuth: async () => {
    try {
      const user = await me()
      set({ user })
    } catch {
      set({ user: null })
    }
  },

  logout: async () => {
    await logout()
    set({ user: null })
  },
}))