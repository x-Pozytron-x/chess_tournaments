import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import { getNews } from '../api/news.tsx'
import type { News } from '../types/News'


export const AdminNews = () => {
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
    <div className='admin_wrap'>
      <aside className='admin_menu'>
        <ul>
          <Link to='/admin' >Dashboard</Link>
          <Link to='news' className="active">News</Link>
          <Link to='players'>Players</Link>
          <Link to='tournaments'>Tournaments</Link>
          <Link to='settings'>Settings</Link>
        </ul>
      </aside>


      <section className='admin_main'>
        <div className='admin_breadcrumb'>Adminka &gt; News</div>


        <div className='admin_content'>

          <div className='borderRadius' style={{ borderRadius: '12px', background: '#252525', display: 'block', padding: '15px', margin: '10px 5px' }}>
            <h4 style={{ borderBottom: '2px solid #8ab4f8', marginBottom: '15px', paddingBottom: '5px', width: '100%', display: 'flex', justifyContent: 'space-between' }}> <span> ♟ News:</span> <button> + </button></h4>

            {news.length ? (
              news.map(n => (
                <a style={{ display: 'block' }} key={n.news_id}>
                  <span>{n.news_title}</span>
                </a>
              ))
            ) : (<p>No news yet</p>)
            }


          </div>


        </div>
      </section>
    </div>
  )
}