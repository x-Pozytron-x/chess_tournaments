import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuthStore } from './store/authStore'

import './index.css'
import './App.css'

import { Header } from "./components/Header";

import { Home } from "./pages/Home";
import { Contacts } from "./pages/Contacts";
import { About } from "./pages/About";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";

type AppRoute = {
  path: string
  component: React.FC
  protected?: boolean
}
const ROUTES: AppRoute[] = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/contacts", component: Contacts },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/profile", component: Profile, protected: true },
];

export const App = () => {
  const checkAuth = useAuthStore(s => s.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {ROUTES.map(({ path, component: Component, protected: isProtected }) => {
          const element = <Component />

          return (
            <Route
              key={path}
              path={path}
              element={
                isProtected ? (
                  <ProtectedRoute>{element}</ProtectedRoute>
                ) : (
                  element
                )
              }
            />
          )
        })}
      </Routes>
    </BrowserRouter>
  )
}