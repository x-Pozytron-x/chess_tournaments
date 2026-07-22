import { Navigate } from 'react-router-dom'
import { useAuthCheck } from '../store/useAuthCheck'

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthChecked, isLoading, user } = useAuthCheck()

  if (!isAuthChecked) return null

  if (isLoading) return null

  if (!user) return <Navigate to="/admin/login" />

  if (!user.permissions.includes('admin.access')) {
    return <Navigate to="/" />
  }

  return children
}
