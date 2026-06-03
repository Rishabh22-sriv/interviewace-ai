import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import FloatingAIWidget from './components/FloatingAIWidget';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import InterviewPage from './pages/InterviewPage';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import AnalyticsPage from './pages/AnalyticsPage';
import InterviewHistoryPage from './pages/InterviewHistoryPage';
import InterviewReportPage from './pages/InterviewReportPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          gutter={8}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0D1627',
              color: '#F1F5F9',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            },
            success: {
              iconTheme: { primary: '#10B981', secondary: '#1E293B' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#1E293B' },
            },
          }}
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="interview" element={<InterviewPage />} />
            <Route path="resume" element={<ResumeAnalyzer />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="history" element={<InterviewHistoryPage />} />
            <Route path="report/:id" element={<InterviewReportPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <FloatingAIWidget />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
