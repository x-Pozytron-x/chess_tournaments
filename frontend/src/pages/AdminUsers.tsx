import { useState, useEffect } from 'react';
import type { FC } from 'react';

import { apiFetch } from '../api/apiFetch'
import type { User } from '../types/User'
import { Role } from '../types/User'

export const AdminUsers: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [fields, setFields] = useState({
    user_id: 0,
    user_fullname: '',
    user_role: 0,
    is_active: 1,
    user_rating: 1000,
    user_telegram: '',
    user_chesscom: '',
    user_lichess: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFields(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : type === 'number' ? Number(value) : value,
    }));
  }

  useEffect(() => {
    apiFetch<User[]>('/api/admin/users')
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Загрузка...</div>

  async function handleSave() {
    try {
      await apiFetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      })

      setIsModalOpen(false)
      setSelectedUser(null)

      apiFetch<User[]>('/api/admin/users')
        .then(setUsers)
        .catch(console.error)
    } catch (err) {
      console.error(err)
    }
  }

  function openEdit(user: User) {
    setSelectedUser(user)
    setFields({
      user_id: user.user_id,
      user_fullname: user.user_fullname ?? '',
      user_role: user.user_role,
      is_active: user.is_active,
      user_rating: user.user_rating ?? 1000,
      user_telegram: user.user_telegram ?? '',
      user_chesscom: user.user_chesscom ?? '',
      user_lichess: user.user_lichess ?? '',
    })
    setIsModalOpen(true)
  }

  return (
    <>
        <div className='admin_breadcrumb'>Adminka &gt; Users</div>

        <div className='admin_content'>
          <div className='admin_section'>
            <h4 className="admin_section_title">
              <span>👥 Users ({users.length})</span>
            </h4>

            {users.length ? (
              users.map(u => (
                <div
                  onClick={() => openEdit(u)}
                  className="admin_news_item"
                  key={u.user_id}
                >
                  <span>
                    {u.user_name}
                    {u.user_role === Role.ADMIN && ' 🛡️'}
                    {!u.is_active && ' ❌'}
                    {' — '}rating: {u.user_rating}
                  </span>
                </div>
              ))
            ) : (<p>No users yet</p>)}
          </div>
        </div>

      {isModalOpen && selectedUser && (
        <div className="modal_overlay">
          <div className="modal_window">
            <h3>Edit: {selectedUser.user_name}</h3>

            <label>Full name</label>
            <input
              className='modal_window_inputT'
              name="user_fullname"
              value={fields.user_fullname}
              onChange={handleChange}
              placeholder="Full name"
            />

            <label>Role</label>
            <select
              className='modal_window_inputT'
              name="user_role"
              value={fields.user_role}
              onChange={handleChange}
            >
              <option value={Role.USER}>User (0)</option>
              <option value={Role.ADMIN}>Admin (1)</option>
            </select>

            <label>Rating</label>
            <input
              className='modal_window_inputT'
              name="user_rating"
              type="number"
              value={fields.user_rating}
              onChange={handleChange}
            />

            <label>Telegram</label>
            <input
              className='modal_window_inputT'
              name="user_telegram"
              value={fields.user_telegram}
              onChange={handleChange}
              placeholder="@username"
            />

            <label>Chess.com</label>
            <input
              className='modal_window_inputT'
              name="user_chesscom"
              value={fields.user_chesscom}
              onChange={handleChange}
              placeholder="username"
            />

            <label>Lichess</label>
            <input
              className='modal_window_inputT'
              name="user_lichess"
              value={fields.user_lichess}
              onChange={handleChange}
              placeholder="username"
            />

            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={fields.is_active === 1}
                onChange={handleChange}
              /> Active
            </label>

            <div className="modal_actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => { setIsModalOpen(false); setSelectedUser(null) }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
