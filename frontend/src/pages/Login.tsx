import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { FC } from 'react';
import './Auth.css';

interface LoginFields {
  login: string;
  pass: string;
  remmember: boolean;
}
type Errors = Partial<Record<keyof LoginFields, string>>;

export const Login: FC = () => {
  const [errors, setErrors] = useState<Errors>({});
  const [fields, setFields] = useState<LoginFields>({
    login: '',
    pass: '',
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

  }

  return (
    <form className="authForm" onSubmit={handleSubmit}>
      <div className="authForm_content">
        <h3 className="authForm_title">Вход</h3>

        {/* {submitted && <p className="authForm_success">{result}</p>} */}

        <p className="authForm_row">
          <i>👤</i>
          <input
            name="login"
            type="text"
            value={fields.login}
            onChange={handleChange}
            placeholder="Твой ник на сайте"
          />
        </p>
        {errors.login && <p className="authForm_error">{errors.login}</p>}

        <p className="authForm_row">
          <i>🔒</i>
          <input
            name="pass"
            type="password"
            value={fields.pass}
            onChange={handleChange}
            placeholder="Введи свой мегапароль"
          />
        </p>
        {errors.pass && <p className="authForm_error">{errors.pass}</p>}

        <p className="authForm_row authForm_row--noBorder chkbx">
          <input
            className="authForm_chkbx"
            name="agree"
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