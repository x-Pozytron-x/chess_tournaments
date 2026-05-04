import { useAuthStore } from '../store/authStore'

export const Profile = () => {
  const user = useAuthStore(s => s.user)


  return (
    <div>
      <h1>Профиль</h1>
      <p>Привет, {user?.user_name}</p>
    </div>
  )
}