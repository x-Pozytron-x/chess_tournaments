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
              <Link to="/admin" className='header-icon-button' style={{marginRight: '1.5rem'}}>
                <svg width="24" height="24" style={{ width: '34px',
                height: '34px', color: '#2ca7e6'}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.75L19.25 5.5V11C19.25 15.75 16.25 19.5 12 21.25C7.75 19.5 4.75 15.75 4.75 11V5.5L12 2.75Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11.25L11 13.25L15.25 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            )}
            
            <Link to="/profile"  className='header-icon-button'>
              <svg width="24" height="24" style={{ width: '34px',
                height: '34px', color: '#9530d8'}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.5 20V18.5C5.5 15.74 7.74 13.5 10.5 13.5H13.5C16.26 13.5 18.5 15.74 18.5 18.5V20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            </Link>
            <Link to="/settings"  className='header-icon-button'>
              <svg width="24" height="24" style={{ width: '34px',
                height: '34px', color: '#628597'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.5 6.5H14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <path d="M17.25 6.5H19.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <circle cx="15.75" cy="6.5" r="1.75" stroke="currentColor" strokeWidth="1.75"/>
              
                <path d="M4.5 12H7.25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <path d="M10.5 12H19.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <circle cx="8.75" cy="12" r="1.75" stroke="currentColor" strokeWidth="1.75"/>
              
                <path d="M4.5 17.5H11.25" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <path d="M14.5 17.5H19.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
                <circle cx="12.75" cy="17.5" r="1.75" stroke="currentColor" strokeWidth="1.75"/>
              </svg>
            </Link>
            <Link to="/rating"  className='header-icon-button'>
              <svg width="24" height="24" style={{ width: '34px',
                height: '34px', color: '#ffd700'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 17v-5"/>
  <path d="M12 17v-9"/>
  <path d="M18 17v-3"/>
  <path d="M4 17h16"/>
              </svg>
            </Link>

            <button onClick={handleLogout}  className='header-icon-button' style={{cursor: 'pointer', background: 'transparent' , border: '0'}}>
              <svg width="24" height="24" style={{ width: '34px',
                height: '34px', color: '#db4d4d'}} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 20H6.5C5.4 20 4.5 19.1 4.5 18V6C4.5 4.9 5.4 4 6.5 4H10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 16.25L19.25 12L15 7.75" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12H9.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
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