import { useState, useEffect } from 'react'
import './App.css'
import { getNews } from './api/news.tsx'
import logotype from './assets/logo.png';
import type { News } from './types/News'

function App() {
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
    <>
      <header>
        <nav>
          <a href="">Контакты</a> |
          <a href="">О нас</a> |
          <a href="">Регистрация</a> |
          <a href="">Вход</a>
        </nav>
      </header>
      <img src={logotype} alt="" width="300px" />
      <h1>Добро пожаловать на сайт шахматных турниров!</h1>
      <div>Пройдите простую регистрацию, чтобы принимать участие в турнирах</div>
      <br /><br />
      <a className="button" href="">Регистрация</a>  или <a className="button" href="">Вход</a>
      <div>
        <div><h2>🔔 Что нового?</h2>
          <section>
            <ul>
              {news.map(p => (
                <li key={p.news_id}> <h4> {p.news_title}</h4> <p>{p.news_descr}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div><h2>В планах:</h2></div>
      </div>
      <footer>
        Created by Pozytron (pozytron.dev)
      </footer>
    </>
  )
}

export default App