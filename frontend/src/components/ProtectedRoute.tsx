import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore(s => s.user)
  const isLoading = useAuthStore(s => s.isLoading)
  const isAuthChecked = useAuthStore(s => s.isAuthChecked)

  if (!isAuthChecked) return null

  // 🟡 ЖДЁМ проверки
  if (isLoading) {
    return <div>Loading...</div>
  }

  // 🔴 НЕ авторизован
  if (!user) {
    return <Navigate to="/login" />
  }

  // 🟢 авторизован
  return children
}