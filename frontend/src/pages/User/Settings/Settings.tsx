import { useAuthStore } from '@/store/authStore';
import type { FC } from 'react';
import './Settings.css';

export const Settings: FC = () => {
  const user = useAuthStore(s => s.user);

  if (!user) {
    return <div>Пожалуйста, войдите в аккаунт</div>;
  }

  return (
    <main>
      <h1 className="mainTitle">Settings</h1>

      <div className="settingsGrid">
        {/* Account Information */}
        <section className="settingsCard">
          <h2>Account Information</h2>

          <div className="settingsRow">
            <label>Username</label>
            {user.user_name || '—'}
          </div>

          <div className="settingsRow">
            <label>Account status</label>
            {user.is_active ? (
              <span className="status-badge status-active">
                <span className="status-dot"></span>Active
              </span>
            ) : (
              <span className="status-badge status-inactive">
                <span className="status-dot"></span>Inactive
              </span>
            )}
          </div>

          <div className="settingsRow">
            <label>Registration date</label>
            {user.created_at ? (
              <time dateTime={user.created_at}>
                {new Date(user.created_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            ) : (
              '—'
            )}
          </div>
        </section>

        {/* Profile Information */}
        <section className="settingsCard">
          <h2>Profile Information</h2>

          <div className="settingsRow">
            <label htmlFor="telegram">Telegram</label>
            <div className="settingsInput">
              <input
                type="text"
                id="telegram"
                placeholder="@username"
              />
            </div>
          </div>

          <div className="settingsRow">
            <label htmlFor="chesscom">Chess.com</label>
            <div className="settingsInput">
              <input
                type="text"
                id="chesscom"
                placeholder="username"
              />
            </div>
          </div>

          <div className="settingsRow">
            <label htmlFor="lichess">Lichess</label>
            <div className="settingsInput">
              <input
                type="text"
                id="lichess"
                placeholder="username"
              />
            </div>
          </div>

          <div className="settingsRow">
            <label htmlFor="email">Email</label>
            <div className="settingsInput">
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="settingsRow">
            <label>Avatar</label>
            <div className="settingsAvatar">
              <div className="avatarPreview">
                {user.user_avatar ? (
                  <img src={user.user_avatar} alt="Avatar" />
                ) : (
                  <div className="avatarPlaceholder">👤</div>
                )}
              </div>
              <div className="avatarUpload">
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  hidden
                />
                <button className="avatarBtn" type="button">
                  <span>📤</span>
                  <span>Загрузить аватарку</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Password */}
        <section className="settingsCard">
          <h2>Password</h2>

          <div className="passwordSection">
            <div className="passwordField">
              <label htmlFor="currentPassword">Current password</label>
              <div className="settingsInput">
                <input
                  type="password"
                  id="currentPassword"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="passwordField">
              <label htmlFor="newPassword">New password</label>
              <div className="settingsInput">
                <input
                  type="password"
                  id="newPassword"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="passwordField">
              <label htmlFor="confirmPassword">Confirm new password</label>
              <div className="settingsInput">
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="passwordField">
              <button type="button" disabled className="settingsBtn settingsBtn--primary">
                Изменить пароль
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
