import { Link } from 'react-router-dom';
import './Header.css';
import logotype from '../assets/logo.png';
export const Header = () => {
  return (

    <header className='header'>
      <div className="logo">
        <img src={logotype} alt="" width="70px" />
        <span>CyberChess</span>
      </div>
      <nav className='nav'>
        <Link to="/">Главная</Link>
        <Link to="/contacts">Контакты</Link>
        <Link to="/about">О сайте</Link>
        <Link to="/register" className='register'>Регистрация</Link>
        <Link to="/login" className='login'>Вход</Link>
      </nav>
    </header>
  )

}