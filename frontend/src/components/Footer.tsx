import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">CyberChess</h3>
            <p className="footer-description">
              Современная платформа для шахматных игр
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Навигация</h3>
            <nav className="footer-nav">
              <Link to="/about" className="footer-link">О сайте</Link>
              <Link to="/contacts" className="footer-link">Контакты</Link>
              <Link to="/rating" className="footer-link">Рейтинг</Link>
            </nav>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Поддержка</h3>
            <nav className="footer-nav">
              <Link to="/help" className="footer-link">Помощь</Link>
              <Link to="/faq" className="footer-link">Часто задаваемые вопросы</Link>
            </nav>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Социальные сети</h3>
            <div className="social-links">
              <a href="#" className="social-link">VK</a>
              <a href="#" className="social-link">Twitter</a>
              <a href="#" className="social-link">Telegram</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} CyberChess. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};