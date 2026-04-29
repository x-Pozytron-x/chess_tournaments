import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Auth.css';

import { addUser } from '../api/register'
import { ApiError } from '../api/apiError';
import { messages } from './../utils/messages'
interface FormFields {
  login: string;
  pass: string;
  repass: string;
  invited: string;
  agree: boolean;
}
// type RegisterResult = {
//   id: number
//   username: string
// }
// type User = {
//   news_id: number
//   news_title: string
//   news_descr: string
// }
type Errors = Partial<Record<keyof FormFields, string>>;

const validate = (fields: FormFields): Errors => {
  const errors: Errors = {};

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(fields.login)) {
    errors.login = 'Никнейм: 3–20 символов, только англ. буквы, цифры и _';
  }
  if (fields.pass.length < 8) {
    errors.pass = 'Пароль должен быть не менее 8 символов';
  }
  if (fields.pass !== fields.repass) {
    errors.repass = 'Пароли не совпадают';
  }
  if (!fields.invited.trim()) {
    errors.invited = 'Укажи ник того, кто тебя пригласил';
  }
  if (!fields.agree) {
    errors.agree = 'Нужно согласиться с правилами';
  }

  return errors;
};

export const Register = () => {
  const [fields, setFields] = useState<FormFields>({
    login: '',
    pass: '',
    repass: '',
    invited: '',
    agree: false,
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFields(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof FormFields]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const [result, setResult] = useState<string>('');

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const newErrors = validate(fields);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }


    try {
      const response = await addUser(fields)
      setResult("Регистрация успешна")
      console.log(response)
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setResult(messages[err.code] ?? "Ошибка")
      } else {
        setResult('Unknown error')
      }
    } finally {
      setSubmitted(true)
    }
  };

  return (
    <form className="authForm" onSubmit={handleSubmit}>
      <div className="authForm_content">
        <h3 className="authForm_title">Регистрация</h3>

        {submitted && <p className="authForm_success">{result}</p>}

        <p className="authForm_row">
          <i>👤</i>
          <input
            name="login"
            type="text"
            value={fields.login}
            onChange={handleChange}
            placeholder="Придумай классный ник"
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
            placeholder="Пароль из мин. 8 символов"
          />
        </p>
        {errors.pass && <p className="authForm_error">{errors.pass}</p>}

        <p className="authForm_row">
          <i>🔒</i>
          <input
            name="repass"
            type="password"
            value={fields.repass}
            onChange={handleChange}
            placeholder="Повтори-ка пароль"
          />
        </p>
        {errors.repass && <p className="authForm_error">{errors.repass}</p>}

        <p className="authForm_row">
          <i>@</i>
          <input
            name="invited"
            type="text"
            value={fields.invited}
            onChange={handleChange}
            placeholder="Ник из Телеграма пригласившего"
          />
        </p>
        {errors.invited && <p className="authForm_error">{errors.invited}</p>}

        <p className="authForm_row authForm_row--noBorder chkbx">
          <input
            className="authForm_chkbx"
            name="agree"
            type="checkbox"
            checked={fields.agree}
            onChange={handleChange}
          />
          Я согласен соблюдать все правила и лишь очень редко создавать бунд
        </p>
        {errors.agree && <p className="authForm_error">{errors.agree}</p>}

        <p className="authForm_row authForm_row--noBorder">
          <button type="submit">Создать аккаунт</button>
        </p>

        <p className="authForm_row authForm_row--noBorder text">
          Уже есть аккаунт? <Link to="/login" className="login">Войти</Link>
        </p>
      </div>
    </form>
  );
};