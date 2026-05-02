import { Navigate, useInRouterContext } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const ProtectedRoute = ({ children }: Props) => {
  const user = useAuthStore(s => s.user)
  const isLoading = useAuthStore(s => s.isLoading)

  if (isLoading) return <div>Loading...</div>

  if (!user) return <Navigate to="/login" />

  return children
}