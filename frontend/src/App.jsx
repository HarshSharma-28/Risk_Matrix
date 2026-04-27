import React, { useContext, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import { Logo } from './components/Logo';
import CustomerDashboard from './pages/customer/Dashboard';
import EmployeeDashboard from './pages/employee/Dashboard';
import Loans from './pages/customer/Loans';
import Vault from './pages/customer/Vault';
import WrongPortal from './pages/auth/WrongPortal';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);
  
  if (loading) return (
    <div className="min-h-screen bg-[#F0F4FF] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <WrongPortal currentRole={user.role} />;
  }
  
  return children;
};

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF] font-sans">
       <div className="flex flex-col items-center space-y-6">
          <Logo height="48" />
          <div className="flex flex-col items-center">
            <div className="w-16 h-1 bg-[#E2E8F0] rounded-full overflow-hidden relative">
              <div 
                className="absolute left-0 top-0 h-full bg-[#4F46E5] animate-progress"
                style={{ width: '40%' }}
              />
            </div>
            <span className="font-bold uppercase tracking-[0.2em] text-[10px] text-[#94A3B8] mt-4">SafeLink Session Initializing</span>
          </div>
       </div>
    </div>
  );

  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
        
        <Route path="/" element={
          !user ? <Navigate to="/login" replace /> : 
          user.role === 'employee' || user.role === 'admin' ? <Navigate to="/command-center" replace /> :
          <Navigate to="/dashboard/customer" replace />
        } />

        <Route path="/dashboard/customer" element={
          <ProtectedRoute roles={['customer']}><CustomerDashboard /></ProtectedRoute>
        } />
        
        <Route path="/dashboard/customer/loans" element={
          <ProtectedRoute roles={['customer']}><Loans /></ProtectedRoute>
        } />
        
        <Route path="/dashboard/customer/vault" element={
          <ProtectedRoute roles={['customer']}><Vault /></ProtectedRoute>
        } />
        
        <Route path="/command-center" element={
          <ProtectedRoute roles={['employee', 'admin']}><EmployeeDashboard /></ProtectedRoute>
        } />
      </Routes>
    </ToastProvider>
  );
}

export default App;
