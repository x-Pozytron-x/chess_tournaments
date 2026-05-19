import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import { getDashboard } from '../api/dashboard'
import type { DashboardData } from '../types/dashboard'
import './Admin.css';

export const AdminPage = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)


  useEffect(() => {
    async function load() {
      try {
        const data = await getDashboard()
        setDashboard(data)
      } catch (err) {
        console.error(err)
      }
    }

    load()
  }, [])

  return (
    <div className='admin_wrap'>
      <aside className='admin_menu'>
        <ul>
          <Link to='/admin' className="active">Dashboard</Link>
          <Link to='news'>News</Link>
          <Link to='players'>Players</Link>
          <Link to='tournaments'>Tournaments</Link>
          <Link to='settings'>Settings</Link>
        </ul>
      </aside>


      <section className='admin_main'>
        <div className='admin_breadcrumb'>Adminka &gt; Dashboard</div>


        <div className='admin_content'>
          <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between' }}>
            <div style={{ borderRadius: '12px', background: '#252525', display: 'inline-block', height: '125px', padding: '15px', margin: '0 5px' }}>
              <h4 style={{ borderBottom: '2px solid #8ab4f8', marginBottom: '8px', paddingBottom: '5px' }}>👥 Users:</h4>
              <h2 style={{ fontSize: '42px', textAlign: 'center' }}>{dashboard?.usersCount}</h2>
            </div>


            <div style={{ borderRadius: '12px', background: '#252525', display: 'inline-block', height: '125px', padding: '15px', margin: '0 5px' }}>
              <h4 style={{ borderBottom: '2px solid #8ab4f8', marginBottom: '15px', paddingBottom: '5px' }}>👤 Последние регистрации: </h4>

              {dashboard?.latestUsers.map(u => (
                <a style={{ display: 'block' }} key={u.user_id}>
                  <span> {u.user_name} </span>
                </a>
              ))}
            </div>
          </div>


          <div className='borderRadius' style={{ borderRadius: '12px', background: '#252525', display: 'block', padding: '15px', margin: '10px 5px' }}>
            <h4 style={{ borderBottom: '2px solid #8ab4f8', marginBottom: '15px', paddingBottom: '5px' }}>♟ Active Tournament: </h4>

            {dashboard?.activeTournaments.length ? (
              dashboard.activeTournaments.map(n => (
                <a style={{ display: 'block' }} key={n.tournament_id}>
                  <span>🏆 {n.tournament_name}</span> - <span>✏️</span>
                </a>
              ))
            ) : (<p>No tournaments yet</p>)
            }


          </div>


          <div style={{ borderRadius: '12px', background: '#252525', padding: '15px 25px', margin: '10px 5px' }}>
            <h4 style={{ borderBottom: '2px solid #8ab4f8', marginBottom: '15px', paddingBottom: '5px' }}>📰 Последние новости:</h4>
            {dashboard?.latestNews.map(n => (
              <a style={{ display: 'block' }} key={n.news_id}>
                <span> {n.news_title} - {n.created_at} </span> - <span>✏️</span>
              </a>
            ))}
          </div>

        </div>
      </section>
    </div>
  )
}