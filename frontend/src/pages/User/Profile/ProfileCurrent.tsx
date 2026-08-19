import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types/User'

export const ProfileCurrent = () => {
  const currentUser = useAuthStore(s => s.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      setLoading(false)
    }
  }, [currentUser])

  if (loading) {
    return <div>Загрузка...</div>
  }

  if (!currentUser) {
    return <div>Пользователь не найден</div>
  }

  return (
    <div>
      <h1>{`Привет, ${currentUser.user_name}`}</h1>
      <div>
        <p>Рейтинг: {currentUser.user_rating}</p>
        {currentUser.user_fullname && <p>Имя: {currentUser.user_fullname}</p>}
        {currentUser.user_avatar && (
          <img src={currentUser.user_avatar} alt="Avatar" style={{ maxWidth: 100, borderRadius: 50 }} />
        )}
        <ul>
          {currentUser.roles && currentUser.roles.map(role => (
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
        {currentUser.user_chesscom && (
          <a href={`https://www.chess.com/member/${currentUser.user_chesscom}`} target="_blank" rel="noopener noreferrer">
            Chess.com
          </a>
        )}
        {currentUser.user_lichess && (
          <a href={`https://lichess.org/@/${currentUser.user_lichess}`} target="_blank" rel="noopener noreferrer">
            Lichess
          </a>
        )}
        {currentUser.user_telegram && (
          <a href={`https://telegram.me/${currentUser.user_telegram}`} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        )}
      </div>
      {(!currentUser.user_chesscom && !currentUser.user_lichess && !currentUser.user_telegram) && (
        <p>No external profiles linked</p>
      )}
    </div>
  )
}