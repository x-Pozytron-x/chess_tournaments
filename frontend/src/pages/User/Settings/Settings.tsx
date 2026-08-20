import { useAuthStore } from '@/store/authStore';
import { apiFetch } from '@/api/apiFetch';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import './Settings.css';

export const Settings: FC = () => {
  const currentUser = useAuthStore(s => s.user);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    user_telegram: '',
    user_chesscom: '',
    user_lichess: '',
    user_email: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    const loadData = async () => {
      try {
        const data = await apiFetch<{
          user_telegram?: string | null;
          user_chesscom?: string | null;
          user_lichess?: string | null;
          user_email?: string | null;
        }>('/api/me');
        setProfileData({
          user_telegram: data.user_telegram || '',
          user_chesscom: data.user_chesscom || '',
          user_lichess: data.user_lichess || '',
          user_email: data.user_email || '',
        });
      } catch {
        // Ignore errors, fields will remain empty
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentUser]);

  const saveProfile = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    setSavedMessage('');
    try {
      await apiFetch('/api/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      setSavedMessage('Changes saved');
    } catch {
      setSavedMessage('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const changePassword = async () => {
    if (!currentUser) return;
    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match');
      return;
    }
    setChangingPassword(true);
    setPasswordMessage('');
    try {
      await apiFetch('/api/me/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_password: currentPassword,
          new_password: newPassword,
        }),
      });
      setPasswordMessage('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      if (error.status === 401) {
        setPasswordMessage('Current password is incorrect');
      } else if (error.status === 400 || error.error === 'PASSWORD_TOO_SHORT') {
        setPasswordMessage('Password is too short');
      } else {
        setPasswordMessage('Failed to change password');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  if (!currentUser) {
    return <div>Пожалуйста, войдите в аккаунт</div>;
  }

  return (
    <main>
      <h1 className="mainTitle">Settings</h1>
      {loading && <div>Загрузка...</div>}
      <div className="settingsGrid">
        {/* Account Information */}
        <section className="settingsCard">
          <h2>Account Information</h2>
          <div className="settingsRow">
            <label>Username</label>
            {currentUser.user_name || '-'}
          </div>
          <div className="settingsRow">
            <label>Account status</label>
            {currentUser.is_active ? (
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
            {currentUser.created_at ? (
              <time dateTime={currentUser.created_at}>
                {new Date(currentUser.created_at).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            ) : (
              '-'
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
                value={profileData.user_telegram}
                onChange={(e) => setProfileData(prev => ({ ...prev, user_telegram: e.target.value }))}
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
                value={profileData.user_chesscom}
                onChange={(e) => setProfileData(prev => ({ ...prev, user_chesscom: e.target.value }))}
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
                value={profileData.user_lichess}
                onChange={(e) => setProfileData(prev => ({ ...prev, user_lichess: e.target.value }))}
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
                value={profileData.user_email}
                onChange={(e) => setProfileData(prev => ({ ...prev, user_email: e.target.value }))}
            />
            </div>
          </div>
          <div className="settingsRow">
            <button
              type="button"
              className="settingsBtn settingsBtn--primary"
              onClick={saveProfile}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          <div className="settingsRow">
            {savedMessage && <span className="settingsMessage">{savedMessage}</span>}
          </div>
          <div className="settingsRow">
            <label>Avatar</label>
            <div className="settingsAvatar">
              {/* <div className="avatarPreview">
                {currentUser.user_avatar ? (
                  <img src={currentUser.user_avatar} alt="Avatar" />
                ) : (
                  <div className="avatarPlaceholder">??</div>
                )}
              </div> */}
              <div className="avatarUpload">
                <span>Avatar upload — Coming soon</span>
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
                   placeholder="********"
                   value={currentPassword}
                   onChange={(e) => setCurrentPassword(e.target.value)}
                 />
               </div>
             </div>
             <div className="passwordField">
               <label htmlFor="newPassword">New password</label>
               <div className="settingsInput">
                 <input
                   type="password"
                   id="newPassword"
                   placeholder="********"
                   value={newPassword}
                   onChange={(e) => setNewPassword(e.target.value)}
                 />
               </div>
             </div>
             <div className="passwordField">
               <label htmlFor="confirmPassword">Confirm new password</label>
               <div className="settingsInput">
                 <input
                   type="password"
                   id="confirmPassword"
                   placeholder="********"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                 />
               </div>
             </div>
             <div className="passwordField">
               <button
                 type="button"
                 className="settingsBtn settingsBtn--primary"
                 onClick={changePassword}
                 disabled={changingPassword}
               >
                 {changingPassword ? 'Changing...' : 'Update password'}
               </button>
             </div>
          </div>
        </section>
      </div>
    </main>
  );
};