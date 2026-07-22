import { Navigate } from 'react-router-dom'
import { useAuthCheck } from '../store/useAuthCheck'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthChecked, isLoading, user } = useAuthCheck()

  if (!isAuthChecked) return null

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}
