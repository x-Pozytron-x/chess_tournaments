import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import './App.css'

import { Header } from "./components/Header.tsx";

import { Home } from "./pages/Home.tsx";
import { Contacts } from "./pages/Contacts.tsx";
import { About } from "./pages/About.tsx";
import { Login } from "./pages/Login.tsx";
import { Register } from "./pages/Register.tsx";
import { Profile } from "./pages/Profile.tsx";

const ROUTES = [
  { path: "/", component: Home },
  { path: "/about", component: About },
  { path: "/contacts", component: Contacts },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  // { path: "/signup", component: SignUp },
  { path: "/profile", component: Profile },
];




ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Публичные */}
        {/* <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/register" element={<Register />} /> */}


        {ROUTES.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}

      </Routes>

    </BrowserRouter>

  </React.StrictMode>
);