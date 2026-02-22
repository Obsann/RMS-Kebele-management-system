import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AuthContext } from './context/AuthContext';
import { authAPI, getStoredUser, clearAuth } from './services/api';

import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/admin/Dashboard';
import AdminResidents from './pages/admin/Residents';
import AdminResidentProfile from './pages/admin/ResidentProfile';
import AdminEmployees from './pages/admin/Employees';
import AdminSpecialEmployees from './pages/admin/SpecialEmployees';
import AdminJobs from './pages/admin/Jobs';
import AdminRequests from './pages/admin/Requests';
import AdminDigitalID from './pages/admin/DigitalID';
import AdminNotifications from './pages/admin/Notifications';
import AdminHouseholds from './pages/admin/Households';
import AdminReports from './pages/admin/Reports';
import AdminAuditLog from './pages/admin/AuditLog';
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeJobs from './pages/employee/Jobs';
import EmployeeRequests from './pages/employee/Requests';
import EmployeeIdVerification from './pages/employee/IdVerification';
import ResidentDashboard from './pages/resident/Dashboard';
import ResidentRequests from './pages/resident/Requests';
import ResidentProfile from './pages/resident/Profile';
import ResidentDigitalID from './pages/resident/DigitalID';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const [user, setUser] = useState(getStoredUser());

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const roleRedirects = {
      admin: '/admin/dashboard',
      'special-employee': '/admin/jobs',
      employee: '/employee/dashboard',
      resident: '/resident/dashboard',
    };
    return <Navigate to={roleRedirects[user.role] || '/login'} replace />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = getStoredUser();
      if (storedUser) {
        try {
          // Verify token is still valid
          const response = await authAPI.checkUser();
          setUser(response.user);
        } catch (error) {
          console.error('Auth check failed:', error);
          clearAuth();
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const register = async (data) => {
    try {
      const response = await authAPI.register({
        username: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        unit: data.unitNumber,
        role: 'resident',
      });
      return { success: true, message: response.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update stored user when user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthContext.Provider value={{ user, login, logout, register, setUser }}>
        <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword onBack={() => window.location.href = '/login'} />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/residents"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminResidents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/residents/:id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminResidentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/employees"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminEmployees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/special-employees"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminSpecialEmployees />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute allowedRoles={['admin', 'special-employee']}>
                  <AdminJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/digital-id"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDigitalID />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notifications"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/households"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminHouseholds />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminAuditLog />
                </ProtectedRoute>
              }
            />

            {/* Employee Routes */}
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/jobs"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/requests"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/verify-id"
              element={
                <ProtectedRoute allowedRoles={['employee']}>
                  <EmployeeIdVerification />
                </ProtectedRoute>
              }
            />

            {/* Resident Routes */}
            <Route
              path="/resident/dashboard"
              element={
                <ProtectedRoute allowedRoles={['resident']}>
                  <ResidentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resident/requests"
              element={
                <ProtectedRoute allowedRoles={['resident']}>
                  <ResidentRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resident/profile"
              element={
                <ProtectedRoute allowedRoles={['resident']}>
                  <ResidentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/resident/digital-id"
              element={
                <ProtectedRoute allowedRoles={['resident']}>
                  <ResidentDigitalID />
                </ProtectedRoute>
              }
            />

            {/* Catch all route - redirect to welcome */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </AuthContext.Provider>
    </ErrorBoundary>
  );
}

export default App;