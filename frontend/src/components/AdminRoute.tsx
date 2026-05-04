import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

import { Role } from '../types/User'

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore(s => s.user)
  const isLoading = useAuthStore(s => s.isLoading)

  if (isLoading) return null

  if (!user) return <Navigate to="/login" />

  if (user.user_role !== Role.ADMIN) {
    return <Navigate to="/" />
  }

  return children
}