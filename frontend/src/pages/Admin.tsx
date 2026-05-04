import { useAuthStore } from '../store/authStore'

export const AdminPage = () => {
  const user = useAuthStore(s => s.user)


  return (
    <div>
      <h1>Adminka</h1>
      <p>тут мы капец всем управляем</p>
    </div>
  )
}