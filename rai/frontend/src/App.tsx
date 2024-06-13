import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ThreeColumnWithSidebar from "./layouts/ThreeColumnWithSidebar";
import WelcomePage from "./features/WelcomePage";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import HomePage from "./features/HomePage";
import NotFoundPage from "./features/NotFoundPage";
import BlankLayout from "./layouts/BlankLayout";
import GuestLayout from "./layouts/GuestLayout";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import ActivityHistory from "./features/activity-history/ActivityHistory";
import UserStatsGraph from "./features/statistics/UserStatsGraph";
import Settings from "./features/settings/Settings";
import { DarkModeProvider } from "./features/settings/DarkModeContext";
import ActivityList from './features/activities/ActivityList';
import ActivityDetail from './features/activity-history/ActivityDetail';

function App() {
  return (
    <DarkModeProvider>
      <>
        <Router>
          <Routes>
            {/* Protected Routes */}
            
            <Route path="/" element={<ThreeColumnWithSidebar />}>
              <Route element={<ProtectedRoute />} >
                <Route path="home" element={<HomePage />} />
                <Route path="activities" element={<ActivityList />} />
                <Route path="activity-history" element={<ActivityHistory />} />
                <Route path="activity-detail/:id" element={<ActivityDetail />} />
                <Route path="statistics" element={<UserStatsGraph />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
            {/* Public Routes */}
              {/* BlankLayout Routes */}
            <Route path="/" element={<BlankLayout />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
              {/* GuestLayout Routes */}
            <Route path="/" element={<GuestLayout />}>
              <Route index element={<WelcomePage />} />
            </Route>
          </Routes>
        </Router>
      </>
    </DarkModeProvider>
  );
}

export default App;
