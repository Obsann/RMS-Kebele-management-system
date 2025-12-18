import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// CORRECTED: Import Context from the separate file to fix circular dependency
import { AuthContext } from './context/AuthContext';

import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/Dashboard';
import AdminResidents from './pages/admin/Residents';
import AdminResidentProfile from './pages/admin/ResidentProfile';
import AdminEmployees from './pages/admin/Employees';
import AdminSpecialEmployees from './pages/admin/SpecialEmployees';
import AdminJobs from './pages/admin/Jobs';
import AdminRequests from './pages/admin/Requests';
import AdminDigitalID from './pages/admin/DigitalID';
import EmployeeDashboard from './pages/employee/Dashboard';
import ResidentDashboard from './pages/resident/Dashboard';
import ResidentRequests from './pages/resident/Requests';
import ResidentProfile from './pages/resident/Profile';
import ResidentDigitalID from './pages/resident/DigitalID';

function App() {
  const [user, setUser] = useState(null);

  const login = (email, password, role) => {
    // Mock login - in real app, this would validate against backend
    setUser({
      id: '1',
      name:
        role === 'admin'
          ? 'Admin User'
          : role === 'special-employee'
          ? 'Special Employee'
          : role === 'employee'
          ? 'John Smith'
          : 'Jane Doe',
      email,
      role,
    });
    return true; // This ensures Login.jsx knows the login succeeded
  };

  const logout = () => {
    setUser(null);
  };

  const register = (data) => {
    setUser({
      id: '1',
      name: data.name,
      email: data.email,
      role: 'resident',
    });
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/residents"
            element={user?.role === 'admin' ? <AdminResidents /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/residents/:id"
            element={user?.role === 'admin' ? <AdminResidentProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/employees"
            element={user?.role === 'admin' ? <AdminEmployees /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/special-employees"
            element={user?.role === 'admin' ? <AdminSpecialEmployees /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/jobs"
            element={
              user?.role === 'admin' || user?.role === 'special-employee'
                ? <AdminJobs />
                : <Navigate to="/login" />
            }
          />
          <Route
            path="/admin/requests"
            element={user?.role === 'admin' ? <AdminRequests /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin/digital-id"
            element={user?.role === 'admin' ? <AdminDigitalID /> : <Navigate to="/login" />}
          />

          {/* Employee Routes */}
          <Route
            path="/employee/dashboard"
            element={user?.role === 'employee' ? <EmployeeDashboard /> : <Navigate to="/login" />}
          />

          {/* Resident Routes */}
          <Route
            path="/resident/dashboard"
            element={user?.role === 'resident' ? <ResidentDashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/resident/requests"
            element={user?.role === 'resident' ? <ResidentRequests /> : <Navigate to="/login" />}
          />
          <Route
            path="/resident/profile"
            element={user?.role === 'resident' ? <ResidentProfile /> : <Navigate to="/login" />}
          />
          <Route
            path="/resident/digital-id"
            element={user?.role === 'resident' ? <ResidentDigitalID /> : <Navigate to="/login" />}
          />

          {/* Catch all route - redirect to welcome */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="top-right" richColors />
    </AuthContext.Provider>
  );
}

export default App;