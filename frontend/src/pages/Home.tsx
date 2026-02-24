import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './Home.css';

import { getNews } from '../api/news.tsx'
import type { News } from '../types/News'

// Временные данные (потом будут приходить с бэкенда)
const mockTournaments = {
  ongoing: {
    id: 1,
    name: 'JW Tournament',
    status: 'ongoing',
    round: 4,
    totalRounds: 7,
    participants: 12,
    maxParticipants: 12
  },
  upcoming: {
    id: 2,
    name: 'JW Tournament',
    status: 'upcoming',
    startDate: '1 июня',
    participants: 5,
    maxParticipants: 12
  },
  completed: {
    id: 3,
    name: 'Панда ест макбук',
    status: 'completed',
    winner: '@alex',
    completedAt: '1222 дня назад'
  }
};
export function Home() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNews()
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])
  if (loading) return <div>Загрузка...</div>
  return (
    <main>

      <div className="home-page">
        <h1>Добро пожаловать на сайт шахматных турниров!</h1>
        <div className="home-container">
          {/* Заголовок */}
          <br /> <br />
          <h1 className="section-title">Ближайшие турниры</h1>

          {/* Сетка турниров */}
          <div className="tournaments-grid">
            {/* Текущий турнир */}
            {mockTournaments.ongoing && (
              <div className="tournament-card ongoing">
                <span className="tournament-status status-ongoing">🔴 Идет сейчас</span>
                <h3 className="tournament-name">{mockTournaments.ongoing.name}</h3>
                <div className="tournament-details">
                  <div className="tournament-detail">
                    <svg viewBox="0 0 24 24">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.22-13h-.06c-.4 0-.72.32-.72.72v4.72c0 .35.18.68.49.86l4.15 2.49c.34.2.78.1.98-.24.21-.34.1-.79-.25-.99l-3.87-2.3V7.72c0-.4-.32-.72-.72-.72z" />
                    </svg>
                    <span>{mockTournaments.ongoing.round} тур из {mockTournaments.ongoing.totalRounds}</span>
                  </div>
                  <div className="tournament-detail">
                    <svg viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-1 .05 1.16.84 2 1.87 2 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                    <span>{mockTournaments.ongoing.participants} участников</span>
                  </div>
                </div>
                <Link to={`/tournament/${mockTournaments.ongoing.id}`} className="tournament-link">
                  Перейти к турниру →
                </Link>
              </div>
            )}

            {/* Ближайший старт */}
            {mockTournaments.upcoming && (
              <div className="tournament-card upcoming">
                <span className="tournament-status status-upcoming">🟡 Старт скоро</span>
                <h3 className="tournament-name">{mockTournaments.upcoming.name}</h3>
                <div className="tournament-details">
                  <div className="tournament-detail">
                    <svg viewBox="0 0 24 24">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                    </svg>
                    <span>Старт: {mockTournaments.upcoming.startDate}</span>
                  </div>
                  <div className="tournament-detail">
                    <svg viewBox="0 0 24 24">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-1 .05 1.16.84 2 1.87 2 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                    <span>Регистрация: {mockTournaments.upcoming.participants}/{mockTournaments.upcoming.maxParticipants}</span>
                  </div>
                </div>
                <Link to={`/tournament/${mockTournaments.upcoming.id}`} className="tournament-link">
                  Подробнее →
                </Link>
              </div>
            )}

            {/* Завершенный турнир */}
            {mockTournaments.completed && (
              <div className="tournament-card completed">
                <span className="tournament-status status-completed">✅ Завершен</span>
                <h3 className="tournament-name">{mockTournaments.completed.name}</h3>
                <div className="tournament-details">
                  <div className="tournament-detail">
                    <svg viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    <span>Победитель: {mockTournaments.completed.winner}</span>
                  </div>
                  <div className="tournament-detail">
                    <svg viewBox="0 0 24 24">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
                    </svg>
                    <span>Завершен: {mockTournaments.completed.completedAt}</span>
                  </div>
                </div>
                <Link to={`/tournament/${mockTournaments.completed.id}`} className="tournament-link">
                  Итоги турнира →
                </Link>
              </div>
            )}
          </div>

          {/* Два блока: Новости и Планы */}
          <div className="double-section">
            {/* Новости */}
            <div className="info-card">
              <h3>
                <span>📰</span> Новости
              </h3>
              <ul className="news-list">
                {news.map(p => (
                  <li className="news-item" key={p.news_id}>
                    <h4> {p.news_title}</h4>
                    <p>{p.news_descr}</p>
                    <span className="news-date">1999 99 99</span>
                  </li>
                ))}
              </ul>
              <Link to="/news" className="action-link">
                Все новости →
              </Link>
            </div>

            {/* Планы */}
            <div className="info-card">
              <h3>
                <span>🚀</span> В планах
              </h3>
              <ul className="plans-list">
                {news.map(p => (
                  <li className="news-item" key={p.news_id}>
                    <h4> {p.news_title}</h4>
                    <p>{p.news_descr}</p>
                    <span className="news-date">1999 99 99</span>
                  </li>
                ))}
              </ul>
              <Link to="/feedback" className="action-link">
                Предложить идею →
              </Link>
            </div>
          </div>

          {/* Нижняя навигация */}
          {/* <div className="bottom-nav">
            <Link to="/tournaments">Все турниры</Link>
            <Link to="/about">О проекте</Link>
          </div> */}

          {/* Декоративная доска */}
          <div className="chess-decoration"></div>
        </div>
      </div>
      {/* 
      <h1>Добро пожаловать на сайт шахматных турниров!</h1>

      <div>Пройдите простую регистрацию, чтобы принимать участие в турнирах</div> */}


      {/* <div className='homeContent'>

        <section>
          <h2>🔔 Что нового?</h2>
          <ul>
            {news.map(p => (
              <li key={p.news_id}> <h4> {p.news_title}</h4> <p>{p.news_descr}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>В планах:</h2>
        </section>

      </div> */}

    </main>
  )
}