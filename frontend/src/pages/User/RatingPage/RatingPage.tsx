import { useEffect, useState } from 'react'
import { apiFetch } from '@/api/apiFetch'
import type { User } from '@/types/User'
import { Link } from 'react-router-dom'
import './RatingPage.css';



export const RatingPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Call the new /api/rating endpoint which returns users sorted by rating
        const response = await apiFetch<{ 
            success: boolean
            data: User[]
          }>('/api/rating')

        if (response.success && Array.isArray(response.data)) {
          const sortedUsers = [...response.data].sort(
            (a, b) => Number(b.user_rating) - Number(a.user_rating)
          )
          setUsers(sortedUsers)
        } else {
          throw new Error('Unexpected data structure from API')
        }    

        if (Array.isArray(response)) {
          // Filter and validate users
          const validUsers = response.filter(user => 
            user && typeof user.user_id === 'number' && 
            typeof user.user_name === 'string' &&
            typeof user.user_rating === 'number' &&
            typeof user.created_at === 'string'
          );
          
          // Sort users by rating in descending order (should already be sorted by backend)
          const sortedUsers = validUsers.sort((a, b) => (b.user_rating || 0) - (a.user_rating || 0))
          setUsers(sortedUsers)
        } else {
          throw new Error('Unexpected data structure from API')
        }
      } catch (err: any) {
        console.error('Error fetching users:', err)
        setError(err.message || 'Ошибка при загрузке данных')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return <div className="rating-container">Загрузка рейтинга...</div>
  }

  if (error) {
    return (
      <div className="rating-container">
        <div className="error-container">
          <div className="error-card">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rating-container">
      <h1 className="rating-title">Рейтинг игроков</h1>
      <div className="rating-table">
        <div className="rating-header">
          <div className="rating-header-cell">Место</div>
          <div className="rating-header-cell">Игрок</div>
          <div className="rating-header-cell">Рейтинг</div>
        </div>
        {users.map((user, index) => (
          <div className="rating-row" key={user.user_id}>
            <div className="rating-cell rank-cell">{index + 1}</div>
            <div className="rating-cell user-cell">
              <Link to={`/profile/${user.user_name}`}>{user.user_name}</Link>
            </div>
            <div className="rating-cell rating-cell-value">{user.user_rating || 0}</div>
            
          </div>
        ))}
      </div>
    </div>
  )
}