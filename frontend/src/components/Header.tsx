import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';

import './Header.css';
import logotype from '../assets/logo.png';

export const Header = () => {
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const isLoading = useAuthStore(s => s.isLoading)
  const isAdmin = useAuthStore(s => s.isAdmin())
  const logout = useAuthStore(s => s.logout)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className='header'>
      <Link to="/" className="logo">
        <img src={logotype} alt="" width="70px" />
        <span className="logo-text">CyberChess</span>
      </Link>

      <nav className='nav'>
        {isLoading ? (
          <span>...</span>
        ) : user ? (
          <>
            {isAdmin && (
              <Link to="/admin" className='nav_c' style={{marginRight: '1.5rem'}}>🤖</Link>
            )}
            
            <Link to="/profile" className='nav_c'>👤</Link>
            <Link to="/settings" className='nav_c'>⚙️</Link>
            <Link to="/rating" className='nav_c'>📊</Link>

            <button onClick={handleLogout} className='nav_c'>⏻</button>
          </>
        ) : (
          <>
            <Link to="/rating" className='nav_a'>Рейтинг</Link>
            <Link to="/register" className='nav_a register'>Регистрация</Link>
            <Link to="/login" className='nav_a login'>Вход</Link>
          </>
        )}
      </nav>

      {/* Mobile menu button for guest users */}
      <button className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
        <span className="hamburger"></span>
      </button>

      {/* Mobile menu for guest users */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <nav>
          
          <Link to="/register" className='nav-link'  onClick={toggleMobileMenu}>Регистрация</Link>
          <Link to="/login" className='nav-link' onClick={toggleMobileMenu}>Вход</Link>
          <Link to="/rating" className="nav-link" onClick={toggleMobileMenu}>Рейтинг</Link>
        </nav>
      </div>
    </header>
  )
}