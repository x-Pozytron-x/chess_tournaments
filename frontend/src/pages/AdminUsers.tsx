import { useState, useEffect } from 'react';
import type { FC } from 'react';

import { apiFetch } from '../api/apiFetch'
import type { User } from '../types/User'
import type { RoleItem } from '../types/User'

// ---- Компонент ----

export const AdminUsers: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [allRoles, setAllRoles] = useState<RoleItem[]>([]);
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

  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([])

  // Загрузка пользователей и списка ролей
  // Независимые вызовы: roles может упасть, users — нет
  useEffect(() => {
    apiFetch<User[]>('/api/admin/users')
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false))

    apiFetch<RoleItem[]>('/api/admin/roles')
      .then(setAllRoles)
      .catch(console.error)
  }, [])

  if (loading) return <div>Загрузка...</div>

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFields(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : type === 'number' ? Number(value) : value,
    }));
  }

  function handleRoleToggle(roleId: number) {
    setSelectedRoleIds(prev =>
      prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    )
  }

  // Сохранение основных полей пользователя
  async function handleSave() {
    try {
      await apiFetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields)
      })

      setIsModalOpen(false)
      setSelectedUser(null)

      const updated = await apiFetch<User[]>('/api/admin/users')
      setUsers(updated)
    } catch (err) {
      console.error(err)
    }
  }

  // Сохранение ролей
  async function handleSaveRoles() {
    if (!selectedUser) return

    try {
      await apiFetch('/api/admin/users/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: selectedUser.user_id,
          role_ids: selectedRoleIds,
        })
      })

      setIsModalOpen(false)
      setSelectedUser(null)

      const updated = await apiFetch<User[]>('/api/admin/users')
      setUsers(updated)
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
    setSelectedRoleIds(user.roles.map(r => r.role_id))
    setIsModalOpen(true)
  }

  function getUserRoleNames(user: User): string {
    return user.roles.map(r => r.role_name).join(', ') || '—'
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
                    {!u.is_active && ' ❌'}
                    {' — '}rating: {u.user_rating}
                    {' — '}{getUserRoleNames(u)}
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

            {/* ---- Секция ролей ---- */}
            <label>Roles</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
              {allRoles.map(role => (
                <label key={role.role_id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedRoleIds.includes(role.role_id)}
                    onChange={() => handleRoleToggle(role.role_id)}
                  />
                  <strong>{role.role_name}</strong>
                  {role.description && <span style={{ color: '#888', fontSize: '0.85em' }}>— {role.description}</span>}
                </label>
              ))}
            </div>

            {/* ---- Legacy select (оставлен для обратной совместимости) ---- */}
            <label>Legacy role (user_role)</label>
            <select
              className='modal_window_inputT'
              name="user_role"
              value={fields.user_role}
              onChange={handleChange}
            >
              <option value={0}>User (0)</option>
              <option value={1}>Admin (1)</option>
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
              <button onClick={handleSave}>Save profile</button>
              <button onClick={handleSaveRoles}>Save roles</button>
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
