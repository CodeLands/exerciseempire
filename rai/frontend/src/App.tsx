import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ThreeColumnWithSidebar from './layouts/ThreeColumnWithSidebar'
import WelcomePage from './features/WelcomePage'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import HomePage from './features/HomePage'
import NotFoundPage from './features/NotFoundPage';
import BlankLayout from './layouts/BlankLayout';
import GuestLayout from './layouts/GuestLayout';
import ProtectedRoute from './features/auth/ProtectedRoute';


function App() {

  return (
    <>
    <Router>

        <Routes>
          {/* Protected Routes */}
          <Route path="/" element={<ThreeColumnWithSidebar />}>
            <Route element={<ProtectedRoute />}>
              <Route path="home" element={<HomePage />} />
            </Route>
          </Route>
          {/* Public Routes */}
            {/* BlankLayout Routes */}
          <Route path="/" element={<BlankLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} /> 
          <Route path="*" element={<NotFoundPage />} />
          </Route>
            {/* GuestLayout Routes */}
          <Route path="/" element={<GuestLayout />}>
            <Route index element={<WelcomePage />} />
          </Route>
        </Routes>
    </Router>
    </>
  )
}

export default App
