import './About.css';

export const About = () => {
  return (
    <main>


      <div className="about-page">
        <div className="about-container">
          <div className="about-header">
            <h1>О проекте</h1>
            <div className="subtitle">Шахматы для своих · Сделано с душой</div>
          </div>

          <div className="about-content">
            <div className="profile-section">
              <div className="profile-avatar">
                ♞
              </div>
              <div className="profile-text">
                <h2>Привет! Я - Pozytron</h2>
                <p>
                  Программист, шахматист-любитель и просто человек, который любит
                  создавать полезные вещи. Днём пишу код, вечером играю в шахматы
                  (иногда даже выигрываю). Этот сайт родился из простой идеи —
                  сделать удобный инструмент для турниров среди друзей.
                </p>
                <p>
                  Больше не нужно рисовать таблицы в Excel или путаться в
                  расписании. Всё автоматизировано, красиво и понятно.
                </p>
              </div>
            </div>

            {/* Технологии */}
            <div className="tech-stack">
              <h3>Стек технологий</h3>
              <div className="tech-grid">
                <div className="tech-card">
                  <div className="tech-icon">🐘</div>
                  <h4>PHP + MySQL</h4>
                  <p>Надёжный бэкенд с подготовленными запросами и JWT-аутентификацией. Балансировка нагрузки и кэширование запросов.</p>
                </div>

                <div className="tech-card">
                  <div className="tech-icon">⚛️</div>
                  <h4>React + TypeScript</h4>
                  <p>Компонентный подход, строгая типизация и никаких багов на пустом месте. Vite для быстрой сборки.</p>
                </div>

                <div className="tech-card">
                  <div className="tech-icon">🐻</div>
                  <h4>Zustand</h4>
                  <p>Легковесное управление состоянием. Проще Redux, но не менее мощное. Идеально для турнирных таблиц.</p>
                </div>

                <div className="tech-card">
                  <div className="tech-icon">🎨</div>
                  <h4>Дизайн</h4>
                  <p>Тёмная тема, стеклянные карточки, золотые акценты. Шахматная эстетика в каждой детали.</p>
                </div>
              </div>
            </div>

            <div className="motivation-section">
              <h3>Зачем я это сделал?</h3>
              <div className="motivation-grid">
                <div className="motivation-item">
                  <div className="motivation-icon">🎯</div>
                  <p>Хотел простой инструмент для турниров без регистраций и смс</p>
                </div>
                <div className="motivation-item">
                  <div className="motivation-icon">🤝</div>
                  <p>Для друзей и знакомых шахматистов, чтобы играть с комфортом</p></div>
                <div className="motivation-item">
                  <div className="motivation-icon">⚡</div>
                  <p>Практика в разработке fullstack приложений с современным стеком</p>
                </div>
              </div>
            </div>

            <div className="quote-section">
              <div className='blockquote'>
                Шахматы — это не просто игра. Это способ мышления, который помогает в жизни.
              </div>
              <div className="quote-author">
                — Основатель проекта, между партиями
              </div>
            </div>
          </div>

          <div className="chess-decoration"></div>
        </div>
      </div>



    </main>
  )
}
