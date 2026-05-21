import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import type { FC } from 'react';

import { apiFetch } from '../api/apiFetch'
import { getNews } from '../api/news'
import type { News } from '../types/News'


export const AdminNews: FC = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedNews, setSelectedNews] = useState<News | null>(null)

  const [fields, setFields] = useState({
    news_id: '',
    title: '',
    text: '',
    status: false
  })
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFields(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  useEffect(() => {
    getNews()
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])
  if (loading) return <div>Загрузка...</div>

  async function handleAdd() {
    try {
      await apiFetch('/api/admin/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
      })

      //done  and clear fields
      setIsModalOpen(false)
      setFields({
        news_id: '',
        title: '',
        text: '',
        status: false
      })

      // get news and rerender
      getNews()
        .then(setNews)
        .catch(console.error)
        .finally(() => setLoading(false))
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSave() {
    try {
      await apiFetch('/api/admin/news', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
      })

      //done  and clear fields
      setIsModalOpen(false)
      setFields({
        news_id: '',
        title: '',
        text: '',
        status: false
      })

      // get news and rerender
      getNews()
        .then(setNews)
        .catch(console.error)
        .finally(() => setLoading(false))
    } catch (err) {
      console.error(err)
    }
  }


  async function handleDelete() {
    try {
      await apiFetch('/api/admin/news', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
      })

      //done  and clear fields
      setIsModalOpen(false)
      setFields({
        news_id: '',
        title: '',
        text: '',
        status: false
      })

      // get news and rerender
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

          <button style={{ width: '25px', height: '25px', cursor: 'pointer' }}
            onClick={() => {
              setSelectedNews(null)
              setFields({
                news_id: '',
                title: '',
                text: '',
                status: false
              })
              setIsModalOpen(true)
            }}
          > + </button>

          <div className='borderRadius' style={{ borderRadius: '12px', background: '#252525', display: 'block', padding: '15px', margin: '10px 5px' }}>
            <h4 style={{ borderBottom: '2px solid #8ab4f8', marginBottom: '15px', paddingBottom: '5px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span> ♟ News:</span>
            </h4>
            {news.length ? (
              news.map(n => (
                n.news_status ? ('') : (
                  <div
                    onClick={() => {
                      setSelectedNews(n)
                      setFields({
                        news_id: n.news_id,
                        title: n.news_title,
                        text: n.news_descr,
                        status: n.news_status
                      })
                      setIsModalOpen(true)
                    }}
                    className="admin_news_item"
                    style={{ display: 'block', cursor: 'pointer' }}
                    key={n.news_id} >

                    <span>{n.news_date} - {n.news_title}</span>

                  </div>
                )
              ))
            ) : (<p>No news yet</p>)
            }
          </div>

          <div className='borderRadius' style={{ borderRadius: '12px', background: '#252525', display: 'block', padding: '15px', margin: '10px 5px' }}>
            <h4 style={{ borderBottom: '2px solid #8ab4f8', marginBottom: '15px', paddingBottom: '5px', width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span> 🗓️ Plans:</span>
            </h4>
            {news.length ? (
              news.map(n => (
                n.news_status ? (
                  <div
                    onClick={() => {
                      setSelectedNews(n)
                      setFields({
                        news_id: n.news_id,
                        title: n.news_title,
                        text: n.news_descr,
                        status: n.news_status
                      })
                      setIsModalOpen(true)
                    }}
                    className="admin_news_item" style={{ display: 'block', cursor: 'pointer' }} key={n.news_id}>
                    <span>{n.news_date} - {n.news_title}</span>
                  </div>
                ) : ('')
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
            {fields.status}
            <input
              className='modal_window_inputT'
              name="title"
              value={fields.title}
              onChange={handleChange}
              placeholder="News title"
            />
            <input
              className='modal_window_inputT'
              name="text"
              value={fields.text}
              onChange={handleChange}
              placeholder="News descr"
            />
            <label>
              <input type="checkbox" name="status" checked={fields.status}
                onChange={handleChange} /> News / Plan
            </label>

            <div className="modal_actions">

              {!selectedNews && (
                <button onClick={handleAdd}>Add</button>
              )}


              {selectedNews && (
                <>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={handleDelete}>
                    Delete
                  </button>
                </>
              )}

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