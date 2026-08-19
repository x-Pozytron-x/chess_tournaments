import { useAuthStore } from '@/store/authStore'

export const Profile = () => {
  const user = useAuthStore(s => s.user)

  console.log('Profile user:', user)
  console.log('Profile user.user_name:', user?.user_name)
  console.log('Profile user.user_rating:', user?.user_rating)
  console.log('Profile user.permissions:', user?.permissions)
  console.log('Profile user.roles:', user?.roles)

  if (!user) {
    return <div>Загрузка...</div>
  }

  return (
    <div>
      <h1>Профиль</h1>
      <div>
        <p>Привет, {user?.user_name}</p>
        <p>Рейтинг: {user?.user_rating}</p>
        {user?.user_fullname && <p>Имя: {user?.user_fullname}</p>}
        {user?.user_avatar && (
          <img src={user?.user_avatar} alt="Avatar" style={{ maxWidth: 100, borderRadius: 50 }} />
        )}
        <ul>
          {user?.roles && user.roles.map(role => (
            <li key={role.role_id}>{role.role_name}</li>
          ))}
        </ul>
        {user?.user_telegram && (
          <a href={`https://t.me/${user?.user_telegram}`} target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
        )}
        {user?.user_lichess && (
          <a href={`https://lichess.org/@/${user?.user_lichess}`} target="_blank" rel="noopener noreferrer">
            Lichess
          </a>
        )}
        {user?.user_chesscom && (
          <a href={`https://www.chess.com/member/${user?.user_chesscom}`} target="_blank" rel="noopener noreferrer">
            Chess.com
          </a>
        )}

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