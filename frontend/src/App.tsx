import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'
import { useAuthStore } from './store/authStore'

import './index.css'
import './App.css'

import { Header } from "./components/Header";

import { Home } from "./pages/Home/Home";
import { Contacts } from "./pages/Contacts/Contacts";
import { About } from "./pages/About/About";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { ProfileCurrent } from "./pages/User/Profile/ProfileCurrent";
import { ProfileOther } from "./pages/User/Profile/ProfileOther";
import { AdminLogin } from "./pages/Admin/Login/AdminLogin";
import { AdminLayout } from "./pages/Admin/Layout/AdminLayout";
import { AdminPage } from "./pages/Admin/Dashboard/AdminPage";
import { AdminNews } from "./pages/Admin/News/AdminNews";
import { AdminUsers } from "./pages/Admin/Users/AdminUsers";


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
  { path: "/profile", component: ProfileCurrent, protected: true },
  { path: "/profile/:user_name", component: ProfileOther, protected: true },
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
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminPage />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  )
}