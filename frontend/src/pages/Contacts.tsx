import './Contacts.css';

export const Contacts = () => {
  return (
    <main>

      <div className="container">
        <div className="cheader">
          <h1>Контакты</h1>
          <p>Всегда на связи · Всегда в игре</p>
        </div>

        <div className="contacts-grid">
          <a href="https://t.me/Pozytron" target="_blank" className="contact-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.18-.04-.26-.02-.11.02-1.84 1.17-5.2 3.44-.49.34-.94.5-1.34.49-.44-.01-1.29-.25-1.92-.46-.77-.25-1.39-.39-1.34-.83.03-.23.27-.46.74-.7 2.89-1.26 4.82-2.09 5.78-2.49 2.75-1.14 3.32-1.34 3.69-1.34.08 0 .27.02.39.12.1.08.13.19.14.27-.01.09-.02.23-.04.37z" />
              </svg>
            </div>
            <div className="card-title">Telegram</div>
            <div className="card-handle">@Pozytron</div>
          </a>

          <a href="https://github.com/x-Pozytron-x" target="_blank" className="contact-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1.01.07 1.54 1.03 1.54 1.03.9 1.54 2.36 1.1 2.94.84.09-.65.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.66-.33 2.51-.33.85 0 1.71.11 2.51.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.58.68.48C19.14 20.16 22 16.42 22 12c0-5.52-4.48-10-10-10z" />
              </svg>
            </div>
            <div className="card-title">GitHub</div>
            <div className="card-handle">@x-Pozytron-x</div>
          </a>

          <a href="https://x.com/Pozytronix" className="contact-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div className="card-title">X (Twitter)</div>
            <div className="card-handle">@Pozytronix</div>
          </a>

          <a href="https://www.linkedin.com/in/pozytron/" target="_blank" className="contact-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.68-1.68-1.68a1.68 1.68 0 0 0-1.68 1.68c0 .93.75 1.68 1.68 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </div>
            <div className="card-title">LinkedIn</div>
            <div className="card-handle">/in/pozytron/</div>
          </a>
        </div>

        <div className="extra-info">
          <div className="info-card">
            <div className="info-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <div className="info-content">
              <h3>Часовой пояс</h3>
              <p>Česke Budějovice (GMT+1) · Отвечаю в течение дня</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              ♞
            </div>
            <div className="info-content">
              <h3>По вопросам сотрудничества</h3>
              <p><a href="mailto:stetsenko.vitaliy@gmail.com">stetsenko.vitaliy@gmail.com</a></p>
            </div>
          </div>
        </div>

        <div className="chess-decoration"></div>
      </div>

    </main>
  )
}