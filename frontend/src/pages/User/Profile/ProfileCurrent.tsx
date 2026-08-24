import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/authStore'

// Helper function to format date from ISO format to DD.MM.YYYY
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

export const ProfileCurrent = () => {
  const currentUser = useAuthStore(state => state.user)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      setLoading(false)
    }
  }, [currentUser])

  if (loading) {
    return <div className="profile-container">Загрузка профиля...</div>
  }

  if (!currentUser) {
    return <div className="profile-container">Пользователь не найден</div>
  }

  return (
    <div className="profile-container">

      {/* Profile Information Section */}
      <div className="profile-section">
        <h2 className="profile-section-title">{currentUser.user_name}</h2>
        <div className="profile-info-grid">
          <div className="profile-info-item">
            <span className="profile-info-label">Рейтинг:</span>
            <span className="profile-info-value">{currentUser.user_rating || 0}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Email:</span>
            <span className="profile-info-value">{currentUser.user_email || ' - '}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">На сайте с:</span>
            <span className="profile-info-value">{currentUser.created_at ? formatDate(currentUser.created_at) : '—'}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Статус:</span>
            <span className="profile-info-value">{currentUser.is_active ? 'Активен' : 'Неактивен'}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Роль:</span>
            <span className="profile-info-value">
              {currentUser.roles && currentUser.roles.length > 0 ? currentUser.roles[0].role_name : 'Пользователь'}
            </span>
          </div>
        </div>
      </div>

      {/* Tournament Statistics Section */}
      <div className="profile-section">
        <h2 className="profile-section-title">Статистика турниров</h2>
        <div className="tournament-stats">
          <div className="stat-item">
            <div className="stat-label">Участий</div>
            <div className="stat-value">{currentUser.user_tournaments_count || 0}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Побед</div>
            <div className="stat-value">{currentUser.user_tournaments_wins || 0}</div>
          </div>
          {currentUser.user_tournaments_first_places !== undefined && currentUser.user_tournaments_first_places !== null && (
            <div className="stat-item">
              <div className="stat-label">Первые места</div>
              <div className="stat-value">{currentUser.user_tournaments_first_places || 0}</div>
            </div>
          )}
          {currentUser.user_tournaments_second_places !== undefined && currentUser.user_tournaments_second_places !== null && (
            <div className="stat-item">
              <div className="stat-label">Вторые места</div>
              <div className="stat-value">{currentUser.user_tournaments_second_places || 0}</div>
            </div>
          )}
          {currentUser.user_tournaments_third_places !== undefined && currentUser.user_tournaments_third_places !== null && (
            <div className="stat-item">
              <div className="stat-label">Третьи места</div>
              <div className="stat-value">{currentUser.user_tournaments_third_places || 0}</div>
            </div>
          )}
        </div>
      </div>

      {/* Links Section */}
      <div className="profile-section">
        <h2 className="profile-section-title">Ссылки</h2>
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
          {(!currentUser.user_chesscom && !currentUser.user_lichess && !currentUser.user_telegram) && (
            <p className="no-links-message">Нет внешних профилей</p>
          )}
        </div>
      </div>
    </div>
  )
}