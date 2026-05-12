import { useState, useEffect } from 'react';

import { getNews } from '../api/news.tsx'
import type { News } from '../types/News'

export const AdminPage = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNews()
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])
  if (loading) return <div>Загрузка...</div>


  return (
    <div>
      <h1>Adminka</h1>

      <section>
        <h2>News</h2>
        <div>
          {news.map(p => (
            <div style={{ border: 'solid 1px gold' }} key={p.news_id}>
              <h4> {p.news_title}</h4>
              <p>{p.news_descr}</p>
              <span className="news-date">{p.news_date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}