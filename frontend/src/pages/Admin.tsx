import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { getNews } from '../api/news.tsx'
import type { News } from '../types/News'

import './Admin.css';

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
    <div className='admin_wrap'>
      <aside className='admin_menu'>
        <ul>
          <Link to='admin' className="active">Dashboard</Link>
          <Link to='admin/news'>News</Link>
          <Link to='admin/players'>Players</Link>
          <Link to='admin/tournaments'>Tournaments</Link>
          <Link to='admin/settings'>Settings</Link>
        </ul>
      </aside>


      <section className='admin_main'>
        <div className='admin_breadcrumb'>Adminka &gt; Dashboard</div>


        <div className='admin_content'>
          <div style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{ borderRadius: '12px', background: '#252525', display: 'inline-block', height: '125px', padding: '15px', margin: '0 5px' }}>
              <h4 style={{ borderBottom: '2px solid #8ab4f8', marginBottom: '8px', paddingBottom: '5px' }}>👥 Users:</h4>
              <h2 style={{ fontSize: '42px', textAlign: 'center' }}>345</h2>
            </div>


            <div style={{ borderRadius: '12px', background: '#252525', display: 'inline-block', height: '125px', padding: '15px', margin: '0 5px' }}>
              <h4 style={{ borderBottom: '2px solid #8ab4f8', marginBottom: '15px', paddingBottom: '5px' }}>👤 Последние регистрации: </h4>
              <a>cat</a><br />
              <a>dog</a>
            </div>
          </div>
          <div className='borderRadius' style={{ borderRadius: '12px', background: '#252525', display: 'block', padding: '15px', margin: '10px 5px' }}>
            <h4 style={{ borderBottom: '2px solid #8ab4f8', marginBottom: '15px', paddingBottom: '5px' }}>♟ Active Tournament: </h4>
            <a>🏆 jw - ✏️</a><br />
            <a>🏆 panda - ✏️</a>
          </div>


          <div style={{ borderRadius: '12px', background: '#252525', padding: '15px 25px', margin: '10px' }}>
            <h4 style={{ borderBottom: '2px solid #8ab4f8', marginBottom: '15px', paddingBottom: '5px' }}>📰 Последние новости:</h4>
            {news.map(p => (
              <a style={{ borderLeft: '4px solid #8ab4f8', padding: '5px', margin: '5px 0' }} key={p.news_id}>
                <span> {p.news_title} - <span >{p.news_date} 23.04.2026</span> - <span>✏️</span></span>
              </a>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}