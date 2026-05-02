import { useAuthStore } from '../store/authStore'

export const Profile = () => {
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div>
      <h1>Профиль</h1>
      <p>Привет, {user?.user_name}</p>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  )
}