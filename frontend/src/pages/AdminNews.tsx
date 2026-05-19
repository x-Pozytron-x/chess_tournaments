import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

import { apiFetch } from '../api/apiFetch'
import { getNews } from '../api/news'
import type { News } from '../types/News'


export const AdminNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [fields, setFields] = useState({
    title: '',
    text: '',
  })
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setFields(prev => ({
      ...prev,
      [name]: value
    }))
  }
  useEffect(() => {
    getNews()
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])
  if (loading) return <div>Загрузка...</div>

  async function handleSave() {
    try {

      await apiFetch('/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
      })
      setIsModalOpen(false)

      setFields({
        title: '',
        text: '',
      })
      getNews()
        .then(setNews)
        .catch(console.error)
        .finally(() => setLoading(false))
    } catch (err) {
      console.error(err)
    }
  }


  return (
    <div className='admin_wrap'>
      <aside className='admin_menu'>
        <ul>
          <Link to='/admin' >Dashboard</Link>
          <Link to='#' className="active">News</Link>
          <Link to='players'>Players</Link>
          <Link to='tournaments'>Tournaments</Link>
          <Link to='settings'>Settings</Link>
        </ul>
      </aside>


      <section className='admin_main'>
        <div className='admin_breadcrumb'>Adminka &gt; News</div>


        <div className='admin_content'>

          <div className='borderRadius' style={{ borderRadius: '12px', background: '#252525', display: 'block', padding: '15px', margin: '10px 5px' }}>
            <h4 style={{ borderBottom: '2px solid #8ab4f8', marginBottom: '15px', paddingBottom: '5px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span> ♟ News:</span>
              <button style={{ width: '25px', height: '25px', cursor: 'pointer' }} onClick={() => setIsModalOpen(true)}> + </button>
            </h4>

            {news.length ? (
              news.map(n => (
                <a style={{ display: 'block', cursor: 'pointer' }} key={n.news_id}>
                  <span>{n.news_date} - {n.news_title}</span>
                </a>
              ))
            ) : (<p>No news yet</p>)
            }


          </div>


        </div>
      </section>


      {isModalOpen && (
        <div className="modal_overlay" >
          <div className="modal_window">
            <h3>Add news</h3>
            <input
              name="title"
              value={fields.title}
              onChange={handleChange}
              placeholder="News title"
            />
            <textarea
              name="text"
              value={fields.text}
              onChange={handleChange}
              placeholder="News text"
            />
            <div className="modal_actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  )
}