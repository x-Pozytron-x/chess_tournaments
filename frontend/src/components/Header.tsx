import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';


import './Header.css';
import logotype from '../assets/logo.png';

export const Header = () => {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const isLoading = useAuthStore(s => s.isLoading)
  const isAdmin = useAuthStore(s => s.isAdmin())
  const logout = useAuthStore(s => s.logout)

  const handleLogout = async () => {
    await logout()
  }


  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user])
  return (

    <header className='header'>
      <Link to="/" className="logo">
        <img src={logotype} alt="" width="70px" />
        <span>CyberChess</span>
      </Link>

      <nav className='nav'>
        {isLoading ? (
          <span>...</span>
        ) : user ? (
          <>
            <span>Hi, {user.user_name}</span>
            <Link to="/profile">👤</Link>
            <Link to="/settings">⚙️</Link>

            {isAdmin && (
              <Link to="/admin">🤖</Link>
            )}

            <button onClick={handleLogout}>⏻</button>
          </>
        ) : (
          <>
            <Link to="/contacts">Контакты</Link>
            <Link to="/about">О сайте</Link>
            <Link to="/register" className='register'>Регистрация</Link>
            <Link to="/login" className='login'>Вход</Link>
          </>
        )}

      </nav>
      {/* <nav className='nav'>
        <Link to="/contacts">Контакты</Link>
        <Link to="/about">О сайте</Link>
        <Link to="/register" className='register'>Регистрация</Link>
        <Link to="/login" className='login'>Вход</Link>
      </nav> */}
    </header>
  )

}