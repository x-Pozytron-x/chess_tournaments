import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiFetch } from '@/api/apiFetch'
import type { User } from '@/types/User'

export const ProfileOther = () => {
  const { user_name } = useParams<{ user_name: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user_name) {
      return
    }

    const fetchUser = async () => {
      try {
        setLoading(true)
        const data = await apiFetch<User | null>(`/api/users/${user_name}`)
        setUser(data)
        setError(null)
      } catch {
        setError('Пользователь не найден')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [user_name])

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!user) {
    return <div>Пользователь не найден</div>
  }

  return (
    <div>
      <br />
      <h1>{` ${user.user_name}`}</h1>
      <div>
        <p>Рейтинг: {user.user_rating}</p>
        {user.user_fullname && <p>Имя: {user.user_fullname}</p>}
        {user.user_avatar && (
          <img src={user.user_avatar} alt="Avatar" style={{ maxWidth: 100, borderRadius: 50 }} />
        )}
        <ul>
          {user.roles && user.roles.map(role => (
            <li key={role.role_id}>{role.role_name}</li>
          ))}
        </ul>

        {/* Tournament Statistics */}
        <div className="stat-card">
          <div className="stat-label">Tournament Stats:</div>
          <div className="stat-value">Coming soon</div>
        </div>
      </div>

      <h2>Links</h2>
      <div className="links-container">
        {user.user_chesscom && (
          <a href={`https://www.chess.com/member/${user.user_chesscom}`} target="_blank" rel="noopener noreferrer">
            Chess.com
          </a>
        )}
        {user.user_lichess && (
          <a href={`https://lichess.org/@/${user.user_lichess}`} target="_blank" rel="noopener noreferrer">
            Lichess
          </a>
        )}
        {user.user_telegram && (
          <a href={`https://telegram.me/${user.user_telegram}`} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        )}
      </div>
      {(!user.user_chesscom && !user.user_lichess && !user.user_telegram) && (
        <p>No external profiles linked</p>
      )}
    </div>
  )
}