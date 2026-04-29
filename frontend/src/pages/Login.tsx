import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useAuthStore } from '../store/authStore'

import type { FC } from 'react';
import './Auth.css';


// import { ApiError } from '../api/apiError'
import { messages } from './../utils/messages'
// import { apiFetch } from '../api/apiFetch'

interface LoginFields {
  username: string;
  password: string;
  remember: boolean;
}

interface User {
  user_id: number,
  user_name: string,
  user_email: string,
  user_fullname: string,
  user_role: number
}
type Errors = Partial<Record<keyof LoginFields, string>>;

export const Login: FC = () => {
  const navigate = useNavigate()

  const login = useAuthStore(s => s.login)
  const user = useAuthStore(s => s.user)
  const error = useAuthStore(s => s.error)


  const [errors, setErrors] = useState<Errors>({});
  const [fields, setFields] = useState<LoginFields>({
    username: '',
    password: '',
    remember: false,
  });
  const [submitted, setSubmitted] = useState(false);
  // const [result, setResult] = useState<string>('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setFields(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof LoginFields]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()

    await login({
      username: fields.username,
      password: fields.password,
      remember: fields.remember,
    })

    setSubmitted(true)
  }

  useEffect(() => {
    if (user) {
      navigate('/profile')
    }
  }, [user])

  return (
    <form className="authForm" onSubmit={handleSubmit}>
      <div className="authForm_content">
        <h3 className="authForm_title">Вход</h3>

        {submitted && user && (
          <p className="authForm_success">
            Привет, {user.user_name}! Вы успешно вошли
          </p>
        )}

        {submitted && error && (
          <p className="authForm_error">
            {messages[error]}
          </p>
        )}

        <p className="authForm_row">
          <i>👤</i>
          <input
            name="username"
            type="text"
            value={fields.username}
            onChange={handleChange}
            placeholder="Твой ник на сайте"
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
            placeholder="Введи свой мегапароль"
          />
        </p>
        {errors.password && <p className="authForm_error">{errors.password}</p>}

        <p className="authForm_row authForm_row--noBorder chkbx">
          <input
            className="authForm_chkbx"
            name="remember"
            type="checkbox"
            checked={fields.remember}
            onChange={handleChange}
          />
          Запомнить вход где-то на 1 месяц
        </p>
        {errors.remember && <p className="authForm_error">{errors.remember}</p>}

        <p className="authForm_row authForm_row--noBorder">
          <button type="submit">Войти</button>
        </p>

        <p className="authForm_row authForm_row--noBorder text">
          Еще нет аккаунта? <Link to="/register" className="login">Зарегистрироваться</Link>
        </p>
      </div>
    </form>
  )
}