import { useAuthStore } from './authStore'

/**
 * Единый хук для защищённых роутов.
 * Возвращает актуальное состояние авторизации из authStore.
 *
 * Паттерн использования в роутах:
 *   const { isAuthChecked, isLoading, user } = useAuthCheck()
 *   if (!isAuthChecked) return null
 *   if (isLoading) return <Loading />
 *   if (!user) return <Navigate to="/login" />
 */
export function useAuthCheck() {
  const user = useAuthStore(s => s.user)
  const isLoading = useAuthStore(s => s.isLoading)
  const isAuthChecked = useAuthStore(s => s.isAuthChecked)

  return { user, isLoading, isAuthChecked }
}
