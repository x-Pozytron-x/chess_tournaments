import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

import './Home.css';

import { getNews } from '@/api/news'
import type { News } from '@/types/News'
import { apiFetch } from '@/api/apiFetch'

// Тип для турнира
interface Tournament {
  tournament_id: number;
  tournament_name: string;
  tournament_description: string;
  tournament_format: string;
  tournament_status: string;
  registration_start: string;
  registration_end: string;
  start_at: string;
  end_at: string;
  created_at: string;
}

export function Home() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const user = useAuthStore(s => s.user)

  useEffect(() => {
    // Получаем новости
    getNews()
      .then(setNews)
      .catch(error => {
        console.error('Failed to fetch news:', error)
        setNews([])
      })
      .finally(() => setLoading(false))
    
    // Получаем турниры
    apiFetch<{ tournaments: Tournament[] }>('/api/tournaments')
      .then(response => {
        if (response && typeof response === 'object' && 'tournaments' in response) {
          setTournaments(response.tournaments || []);
        } else {
          console.error('Unexpected response format:', response);
          setTournaments([]);
        }
      })
      .catch(error => {
        console.error('API call failed completely:', error);
        setTournaments([]);
      })
  }, [])
  
  // Функция для получения ближайшего запланированного турнира
  const getUpcomingTournament = () => {
    // Проверяем, что tournaments определен и не пуст
    if (!tournaments || tournaments.length === 0) {
      console.log('Нет турниров');
      return null;
    }
    
    console.log('Турниры для фильтрации:', tournaments);
    
    // Ищем турниры со статусом "upcoming" (который соответствует запланированным)
    const scheduledTournaments = tournaments.filter(tournament => 
      tournament.tournament_status === 'upcoming' || 
      tournament.tournament_status === 'registration' ||
      tournament.tournament_status === 'active'
    );
    
    console.log('Фильтр по статусу upcoming/registration/active:', scheduledTournaments);
    
    if (scheduledTournaments.length === 0) {
      console.log('Нет турниров со статусом upcoming/registration/active');
      return null;
    }
    
    // Сортируем по дате начала и возвращаем первый (ближайший)
    const sorted = scheduledTournaments
      .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
    
    console.log('Отсортированные турниры:', sorted);
    
    return sorted[0];
  }

  const upcomingTournament = getUpcomingTournament();
  
  if (loading) return <div>Загрузка...</div>
  return (
    <main>

      <div className="home-page">
        {!user && <h1>Добро пожаловать на сайт шахматных турниров!</h1>}
        <div className="home-container">
          {/* Заголовок */}
          <h1 className="section-title">Ближайшие турниры</h1>

          {/* Сетка турниров */}
          <div className="tournaments-grid">
            {/* Текущий турнир */}
            <div className="tournament-card ongoing">
              <span className="tournament-status status-ongoing">🔴 Идет сейчас</span>
              <h3 className="tournament-name">Сейчас турниры не проводятся.</h3>
            </div>

            {/* Ближайший старт */}
            <div className="tournament-card upcoming">
              <span className="tournament-status status-upcoming">🟡 Старт скоро</span>
              {upcomingTournament ? (
                <>
                  <h3 className="tournament-name">{upcomingTournament.tournament_name}</h3>
                  <div className="tournament-date">
                    {new Date(upcomingTournament.start_at).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>
                </>
              ) : (
                <h3 className="tournament-name">Турниры пока не запланированы.</h3>
              )}
            </div>

            {/* Завершенный турнир */}
            <div className="tournament-card completed">
              <span className="tournament-status status-completed">✅ Завершен</span>
              <h3 className="tournament-name">Завершённых турниров пока нет.</h3>
            </div>
          </div>

          {/* Два блока: Новости и Планы */}
          <div className="double-section">
            {/* Новости */}
            <div className="info-card">
              <h3>
                <span>📰</span> Новости
              </h3>
              <ul className="news-list">
                {Array.isArray(news) && news
                  .sort((a, b) => {
                    if (a.news_date > b.news_date) {
                      return -1;
                    }
                    if (a.news_date < b.news_date) {
                      return 1;
                    }
                    return 0;
                  })
                  .map(p => (
                    p.news_status ? ('') : (
                      <li className="news-item" key={p.news_id}>
                        <h4>{p.news_title}</h4>
                        <p>{p.news_descr}</p>
                        <span className="news-date">{p.news_date}</span>
                      </li>
                    )
                  ))
                }
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
                {Array.isArray(news) && news.map(p => (
                  p.news_status ? (
                    <li className="news-item" key={p.news_id}>
                      <h4> {p.news_title}</h4>
                      <p>{p.news_descr}</p>
                      <span className="news-date">{p.news_date}</span>
                    </li>
                  ) : ('')
                )
                )
                }
              </ul>
              <Link to="/feedback" className="action-link">
                Предложить идею →
              </Link>
            </div>
          </div>


          {/* Декоративная доска */}
          <div className="chess-decoration"></div>
        </div>
      </div>

    </main >
  )
}