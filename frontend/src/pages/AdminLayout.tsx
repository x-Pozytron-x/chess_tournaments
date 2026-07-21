import { Link, useLocation, Outlet } from 'react-router-dom'

const LINKS = [
  { to: '/admin',          label: 'Dashboard' },
  { to: '/admin/news',     label: 'News' },
  { to: '/admin/users',    label: 'Users' },
  { to: '/admin/tournaments', label: 'Tournaments' },
  { to: '/admin/settings', label: 'Settings' },
]

export const AdminLayout = () => {
  const { pathname } = useLocation()

  return (
    <div className='admin_wrap'>
      <aside className='admin_menu'>
        <ul>
          {LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={pathname === to ? 'active' : ''}
            >
              {label}
            </Link>
          ))}
        </ul>
      </aside>

      <section className='admin_main'>
        <Outlet />
      </section>
    </div>
  )
}
