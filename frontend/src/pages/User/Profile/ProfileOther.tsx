import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiFetch } from '@/api/apiFetch'
import { ApiError } from '@/api/apiError'
import type { User } from '@/types/User'

// Helper function to format date from ISO format to DD.MM.YYYY
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

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
        setError(null)
        const data = await apiFetch<User | null>(`/api/users/${user_name}`)
        // Handle case where API returns null or undefined
        if (data === null || data === undefined) {
          setError('Пользователь не найден')
          setUser(null)
        } else {
          setUser(data)
        }
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 404) {
            setError('Пользователь не найден')
          } else if (err.status === 401) {
            setError('Необходима авторизация')
          } else if (err.status === 403) {
            setError('Доступ запрещен')
          } else if (err.status === 500) {
            setError('Внутренняя ошибка сервера')
          } else {
            setError('Произошла ошибка при загрузке профиля')
          }
        } else {
          setError('Сетевая ошибка при загрузке профиля')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [user_name])

  if (loading) {
    return <div className="profile-container">Загрузка профиля...</div>
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-container">
          <div className="error-card">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <div className="profile-container">Пользователь не найден</div>
  }

  return (
    <div className="profile-container">

      {/* Profile Information Section */}
      <div className="profile-section">
        <h2 className="profile-section-title">{user.user_name}</h2>
        <div className="profile-info-grid">
          <div className="profile-info-item">
            <span className="profile-info-label">Рейтинг:</span>
            <span className="profile-info-value">{user.user_rating || 0}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Email:</span>
            <span className="profile-info-value">{user.user_email || ' - '}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">На сайте с:</span>
            <span className="profile-info-value">{user.created_at ? formatDate(user.created_at) : '—'}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Статус:</span>
            <span className="profile-info-value">{user.is_active ? 'Активен' : 'Неактивен'}</span>
          </div>
          <div className="profile-info-item">
            <span className="profile-info-label">Роль:</span>
            <span className="profile-info-value">
              {user.roles && user.roles.length > 0 ? user.roles[0].role_name : 'Пользователь'}
            </span>
          </div>
        </div>
      </div>

      {/* Tournament Statistics Section */}
      <div className="profile-section">
        <h2 className="profile-section-title">Статистика турниров</h2>
        <div className="profile-tournament-stats">
          <div className="profile-stat-item">
            <div className="profile-stat-label">Участий</div>
            <div className="profile-stat-value">{user.user_tournaments_count || 0}</div>
          </div>
          <div className="profile-stat-item">
            <div className="profile-stat-label">Побед</div>
            <div className="profile-stat-value">{user.user_tournaments_wins || 0}</div>
          </div>
          {user.user_tournaments_first_places !== undefined && user.user_tournaments_first_places !== null && (
            <div className="profile-stat-item">
              <div className="profile-stat-label">Первые места</div>
              <div className="profile-stat-value">{user.user_tournaments_first_places || 0}</div>
            </div>
          )}
          {user.user_tournaments_second_places !== undefined && user.user_tournaments_second_places !== null && (
            <div className="profile-stat-item">
              <div className="profile-stat-label">Вторые места</div>
              <div className="profile-stat-value">{user.user_tournaments_second_places || 0}</div>
            </div>
          )}
          {user.user_tournaments_third_places !== undefined && user.user_tournaments_third_places !== null && (
            <div className="profile-stat-item">
              <div className="profile-stat-label">Третьи места</div>
              <div className="profile-stat-value">{user.user_tournaments_third_places || 0}</div>
            </div>
          )}
        </div>
      </div>

      {/* Links Section */}
      <div className="profile-section">
        <h2 className="profile-section-title">Ссылки</h2>
        <div className="profile-links-container">
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
          {(!user.user_chesscom && !user.user_lichess && !user.user_telegram) && (
            <p className="profile-no-links-message">Нет внешних профилей</p>
          )}
        </div>
      </div>
    </div>
  )
}