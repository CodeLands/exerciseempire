import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import ThreeColumnWithSidebar from './layouts/ThreeColumnWithSidebar'
import SimpleLayout from './layouts/SimpleLayout'

import WelcomePage from './features/WelcomePage'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import HomePage from './features/HomePage'


function App() {

  return (
    <>
    <Router>

        <Routes>
          <Route path="/" element={<SimpleLayout />}>
            <Route index element={<WelcomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} /> 
          </Route>
          <Route path="/" element={<ThreeColumnWithSidebar />}>
            <Route path="home" element={<HomePage />} />
          </Route>
        </Routes>
    </Router>
    </>
  )
}

export default App
