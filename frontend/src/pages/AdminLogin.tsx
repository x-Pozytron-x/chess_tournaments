import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FC } from 'react';

import { useAuthStore } from '../store/authStore'
import { messages } from './../utils/messages'
import './Auth.css';

interface LoginFields {
  username: string;
  password: string;
}

type Errors = Partial<Record<keyof LoginFields, string>>;

/**
 * Отдельный вход для администраторов.
 * После успешного входа — редирект на /admin.
 * Не показывает «Запомнить» и «Регистрацию».
 */
export const AdminLogin: FC = () => {
  const navigate = useNavigate()

  const login = useAuthStore(s => s.login)
  const user = useAuthStore(s => s.user)
  const error = useAuthStore(s => s.error)

  const [errors, setErrors] = useState<Errors>({});
  const [fields, setFields] = useState<LoginFields>({
    username: '',
    password: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));

    if (errors[name as keyof LoginFields]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    await login({
      username: fields.username,
      password: fields.password,
      remember: false,
    })

    setSubmitted(true)
  }

  useEffect(() => {
    if (user) {
      navigate('/admin')
    }
  }, [user])

  return (
    <form className="authForm" onSubmit={handleSubmit}>
      <div className="authForm_content">
        <h3 className="authForm_title">Админ-панель</h3>

        {submitted && user && (
          <p className="authForm_success">
            Добро пожаловать, {user.user_name}!
          </p>
        )}

        {submitted && error && (
          <p className="authForm_error">
            {messages[error] ?? 'Ошибка входа'}
          </p>
        )}

        <p className="authForm_row">
          <i>👤</i>
          <input
            name="username"
            type="text"
            value={fields.username}
            onChange={handleChange}
            placeholder="Логин"
          />
        </p>
        {errors.username && <p className="authForm_error">{errors.username}</p>}

        <p className="authForm_row">
          <i>🔒</i>
          <input
            name="password"
            type="password"
            value={fields.password}
            onChange={handleChange}
            placeholder="Пароль"
          />
        </p>
        {errors.password && <p className="authForm_error">{errors.password}</p>}

        <p className="authForm_row authForm_row--noBorder">
          <button type="submit">Войти в админку</button>
        </p>
      </div>
    </form>
  )
}
