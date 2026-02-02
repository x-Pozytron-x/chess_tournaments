import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Добро пожаловать на сайт шахматных турниров!</h1>
      <div>Пройдите простую регистрацию, чтобы принимать участие в турнирах</div>
      <a href="">Регистрация</a>  или <a href="">Вход</a>
    </>
  )
}

export default App
