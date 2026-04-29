import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { FC } from 'react';
import './Auth.css';

import { ApiError } from '../api/apiError'
import { messages } from './../utils/messages'
import { apiFetch } from '../api/apiFetch'

interface LoginFields {
  username: string;
  password: string;
  remmember: boolean;
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
  const [errors, setErrors] = useState<Errors>({});
  const [fields, setFields] = useState<LoginFields>({
    username: '',
    password: '',
    remmember: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<string>('');

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
    e.preventDefault();

    try {


      let res = await apiFetch<User>('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })

      setResult("Привет, " + res.user_name + "! Вы успешно вошли")
      console.log(res);

    } catch (err) {
      // throw new ApiError('Нет соединения с сервером')
      if (err instanceof ApiError) {
        // console.log(err.status)
        setResult(messages[err.code] ?? "Ошибка")
      }
    } finally {
      setSubmitted(true)
    }
  }

  return (
    <form className="authForm" onSubmit={handleSubmit}>
      <div className="authForm_content">
        <h3 className="authForm_title">Вход</h3>

        {submitted && <p className="authForm_success">{result}</p>}

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
            checked={fields.remmember}
            onChange={handleChange}
          />
          Запомнить вход где-то на 1 месяц
        </p>
        {errors.remmember && <p className="authForm_error">{errors.remmember}</p>}

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