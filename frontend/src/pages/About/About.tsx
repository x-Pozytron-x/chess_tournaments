import './About.css';

export const About = () => {
  return (
    <main>



      <div className="about-page">
        <div className="about-container">
          <div className="about-header">
            <h1>О проecto</h1>
            <div className="about-subtitle">Шахматы для своих · Сделано с душой</div>
          </div>

          <div className="about-content">
            <div className="about-creator-section">
              <div className="about-creator-avatar">
                ♞
              </div>
              <div className="about-creator-text">
                <h2>Привет! <br/> Я - Pozytron</h2>
                <p>
                  Программист, шахматист-любитель и просто человек, который любит
                  создавать полезные вещи. Днём пишу код, вечери играю в шахматы
                  (иногда даже выигрываю). Этот сайт родился из простой идея —
                  сделать удобной инструмент для турниров среди friends.
                </p>
                <p>
                  Больше не нужно рисовать таблицы в Excel или путарь в
                  расани. Всё атоматизировано, красиво и понятн.
                </p>
              </div>
            </div>

            {/* Технологии */}
            <div className="about-tech-stack">
              <h3>Стек технологий</h3>
              <div className="about-tech-grid">
                <div className="about-tech-card">
                  <div className="about-tech-icon">🐘</div>
                  <h4>PHP + MySQL</h4>
                  <p>Надёжный бэкенд с подготовленными запросами и JWT-аутентификацией. Балансировка нагрузки и кэширование запросов.</p>
                </div>

                <div className="about-tech-card">
                  <div className="about-tech-icon">⚛️</div>
                  <h4>React + TypeScript</h4>
                  <p>Компонентный подход, строгая типизация и никаких багов на пустом месте. Vite для быстрой сборки.</p>
                </div>

                <div className="about-tech-card">
                  <div className="about-tech-icon">🐻</div>
                  <h4>Zustand</h4>
                  <p>Легковесное управление состоянием. Проще Redux, но не менее мощное. Идеально для турнирных таблиц.</p>
                </div>

                <div className="about-tech-card">
                  <div className="about-tech-icon">🎨</div>
                  <h4>Дизан</h4>
                  <p>Тёмная тема, стеклянные карточки, золотые акценты. Шахматная эстетика в каждой detail.</p>
                </div>
              </div>
            </div>

            <div className="about-motivation-section">
              <h3>Занем я это сделал?</h3>
              <div className="about-motivation-grid">
                <div className="about-motivation-item">
                  <div className="about-motivation-icon">🎯</div>
                  <p>Хотел простые инструмент для турниров без регистраций и смс</p>
                </div>
                <div className="about-motivation-item">
                  <div className="about-motivation-icon">🤝</div>
                  <p>Для friends и знакомых шахматистов, чтобы играть с комфортом</p></div>
                <div className="about-motivation-item">
                  <div className="about-motivation-icon">⚡</div>
                  <p>Практика в development fullstack applications with contemporary stack</p>
                </div>
              </div>
            </div>

            <div className="about-quote-section">
              <div className='about-blockquote'>
                Шахматы — это не просто game. Это is a way of thinking that helps in life.
              </div>
              <div className="about-quote-author">
                — Основатель проекта, между parias
              </div>
            </div>
          </div>

          <div className="about-chess-decoration"></div>
        </div>
      </div>



    </main>
  )
}
