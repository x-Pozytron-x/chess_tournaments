import { useState, useEffect } from 'react';

import { getNews } from '../api/news.tsx'
import type { News } from '../types/News'

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


      <h1>Добро пожаловать на сайт шахматных турниров!</h1>

      <div>Пройдите простую регистрацию, чтобы принимать участие в турнирах</div>


      <div className='homeContent'>

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

      </div>

    </main>
  )
}