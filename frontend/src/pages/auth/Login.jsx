import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2, ChevronDown, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../../components/Logo';
import { supabase } from '../../lib/supabaseClient';
import { AuthContext } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [accessType, setAccessType] = useState('Personal Banking');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffId, setStaffId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const user = data.user;
      const role = user.user_metadata?.role;

      // Merge role + name to top-level so all components read user.first_name directly
      const userWithRole = {
        ...user,
        role,
        first_name: user.user_metadata?.first_name || '',
        last_name:  user.user_metadata?.last_name  || '',
      };

      if (accessType === 'Personal Banking') {
        if (role === 'customer') {
          sessionStorage.setItem('auth_token', data.session.access_token);
          sessionStorage.setItem('user', JSON.stringify(userWithRole));
          setUser(userWithRole);
          navigate('/dashboard/customer');
        } else {
          setError('This account requires Staff Access. Please update your selection.');
        }
      } else if (accessType === 'Staff Access') {
        if (role === 'employee' || role === 'admin') {
          sessionStorage.setItem('auth_token', data.session.access_token);
          sessionStorage.setItem('user', JSON.stringify(userWithRole));
          setUser(userWithRole);
          
          if (role === 'admin') {
            navigate('/command-center?mode=admin');
          } else {
            navigate('/command-center');
          }
        } else {
          setError('This account is not registered under Staff Access. Please select Personal Banking.');
        }
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccessChange = (e) => {
    setAccessType(e.target.value);
    setError(null);
    if (e.target.value === 'Personal Banking') {
      setStaffId('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans selection:bg-blue-500/20">
      
      {/* Decorative Background Glows */}
      <div className="fixed top-[-10%] right-[-5%] w-[45rem] h-[45rem] bg-indigo-100/40 rounded-full blur-[130px] pointer-events-none animate-pulse"></div>
      <div className="fixed bottom-[-10%] left-[-5%] w-[35rem] h-[35rem] bg-blue-100/30 rounded-full blur-[110px] pointer-events-none"></div>
      
      <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-900/5 border border-white/60 p-10 relative z-10">
        
        {/* Logo Header */}
        <div className="mb-10 flex flex-col items-center">
          <Logo height="48" className="mb-4" />
          <h2 className="text-[28px] font-black tracking-tighter text-[#0F172A] leading-tight">
            Welcome Back
          </h2>
          <div className="text-sm font-medium mt-1 tracking-tight text-[#64748B]">
            Sign in to continue to RiskMatrix
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* ACCESS TYPE Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-widest text-[#64748B] ml-1">
              ACCESS TYPE
            </label>
            <div className="relative group">
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none group-focus-within:text-blue-600 transition-colors" />
              <select
                value={accessType}
                onChange={handleAccessChange}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] px-4 py-4 text-[14px] font-medium text-[#0F172A] appearance-none outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/30 focus:bg-white transition-all cursor-pointer"
              >
                <option value="Personal Banking">Personal Banking (Customer)</option>
                <option value="Staff Access">Staff Access</option>
              </select>
            </div>
            {error && (
              <p className="text-[12px] font-bold text-red-500 mt-2 px-2 bg-red-50 rounded-lg py-2 border border-red-100">
                {error}
              </p>
            )}
          </div>

          {/* MEMBER ID / EMAIL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-widest text-[#64748B] ml-1">
              EMAIL ADDRESS
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-blue-600 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] pl-12 pr-4 py-4 text-[14px] font-medium text-[#0F172A] placeholder-[#94A3B8] outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/30 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* STAFF ID (Conditional) */}
          {accessType === 'Staff Access' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5 overflow-hidden">
              <label className="block text-xs font-black uppercase tracking-widest text-[#64748B] ml-1">
                STAFF ID (Optional)
              </label>
              <div className="relative group">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-blue-600 transition-colors" />
                <input
                  type="text"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  placeholder="EMP-XXXX"
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] pl-12 pr-4 py-4 text-[14px] font-medium text-[#0F172A] placeholder-[#94A3B8] outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/30 focus:bg-white transition-all"
                />
              </div>
            </motion.div>
          )}

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <label className="block text-xs font-black uppercase tracking-widest text-[#64748B] ml-1">
              PASSWORD
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-blue-600 transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] pl-12 pr-4 py-4 text-[14px] font-medium text-[#0F172A] placeholder-[#94A3B8] outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/30 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 px-1">
            <label className="flex items-center space-x-2 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded-md border-gray-300 text-blue-600 focus:ring-blue-600/20 bg-gray-50"
              />
              <span className="text-[11px] font-black text-[#64748B] uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                Remember Me
              </span>
            </label>
            <button
              type="button"
              className="text-[11px] font-black text-blue-600 uppercase tracking-wider hover:underline"
            >
              Lost Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0F172A] text-white py-4 mt-2 rounded-[1.25rem] text-[13px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50 shadow-xl shadow-blue-500/10 flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* OR BIOMETRIC Divider */}
        <div className="my-8 flex items-center text-[#E5E7EB]">
          <div className="flex-1 h-px bg-[#E5E7EB]" />
          <span className="px-4 text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">
            Or Continue With
          </span>
          <div className="flex-1 h-px bg-[#E5E7EB]" />
        </div>

        {/* IDENTITY TOUCH ID BUTTON */}
        <button
          type="button"
          className="w-full bg-white border border-gray-200 text-[#0F172A] py-4 rounded-[1.25rem] text-[12px] font-black uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors"
        >
          <Fingerprint className="w-4 h-4 text-blue-600" />
          <span>Biometric Access</span>
        </button>

        {/* REGISTRATION LINK */}
        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <p className="text-[12px] font-bold text-[#64748B] uppercase tracking-wide">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
