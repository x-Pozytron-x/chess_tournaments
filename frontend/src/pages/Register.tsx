import { Link } from 'react-router-dom';
import { useState } from 'react';

import './Auth.css';

export const Register = () => {

  const [user, setUser] = useState({
    login: '',
    pass: '',
    repass: '',
    invited: '',
    agree: true
  });

  const onChangeLogin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser((current) => ({ ...current, login: event.target.value }));
  }
  const onChangePass = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser((current) => ({ ...current, pass: event.target.value }));
  }
  const onChangeRePass = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser((current) => ({ ...current, repass: event.target.value }));
  }
  const onChangeInvited = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser((current) => ({ ...current, invited: event.target.value }));
  }
  const onChangeAgree = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser((current) => ({ ...current, agree: event.target.checked }));
  }
  return (
    <form className="authForm">
      <div className="authForm_content">
        <h3 className="authForm_title">Регистрация</h3>
        <p className="authForm_row">
          <i>👤</i>
          <input type="text" value={user.login} onChange={onChangeLogin} placeholder="Придумай классный ник" required />
        </p>
        <p className="authForm_row">
          <i>🔒</i>
          <input type="password" value={user.pass} onChange={onChangePass} placeholder="Пароль из мин. 8 символов" required />
        </p>
        <p className="authForm_row">
          <i>🔒</i>
          <input type="password" value={user.repass} onChange={onChangeRePass} placeholder="Повтори-ка пароль" required />
        </p>
        <p className="authForm_row">
          <i>🕵</i>
          <input type="text" value={user.invited} onChange={onChangeInvited} placeholder="Ник из Телеграма пригласившего" required />
        </p>

        <p className="authForm_row authForm_row--noBorder chkbx">
          <input className="authForm_chkbx" type="checkbox" checked={user.agree} onChange={onChangeAgree} required /> Я согласен соблюдать все правила и лишь очень редко создавать бунд
        </p>

        <p className="authForm_row authForm_row--noBorder">
          <button type="submit">Создать аккаунт</button>
        </p>

        <p className="authForm_row authForm_row--noBorder text" >
          Уже есть аккаунт? <Link to="/login" className='login'>Войти</Link>
        </p>
      </div>
    </form>
  )
}