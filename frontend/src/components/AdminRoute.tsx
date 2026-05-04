import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore(s => s.user)
  const isLoading = useAuthStore(s => s.isLoading)

  if (isLoading) return null

  if (!user) return <Navigate to="/login" />

  if (user.user_role !== 1) {
    return <Navigate to="/" />
  }

  return children
}