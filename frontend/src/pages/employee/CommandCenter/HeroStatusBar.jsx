import React, { useState, useEffect } from 'react';
import { Shield, Clock, Users, LogOut } from 'lucide-react';
import { Logo } from '../../../components/Logo';
import { supabase } from '../../../lib/supabaseClient';
import { AuthContext } from '../../../context/AuthContext';
import { useContext } from 'react';

const HeroStatusBar = ({ user }) => {
  const [time, setTime] = useState(new Date());
  const [staffName, setStaffName] = useState('');
  // Use the AuthContext logout so it also clears user state in context
  const { logout } = useContext(AuthContext);

  // Tick every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setStaffName(
      user?.first_name ||
      user?.user_metadata?.first_name ||
      user?.email?.split('@')[0] ||
      'Staff'
    );
  }, [user]);

  const handleLogout = () => {
    logout(); // clears sessionStorage + sets user null + hard reloads to /login
  };

  const formattedTime = time.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="w-full bg-white border-b border-[#E5E7EB] px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Left: Logo + Status */}
      <div className="flex items-center space-x-8">
        <Logo height="36" />

        <div className="flex items-center space-x-2 pl-6 border-l border-[#E5E7EB]">
          <div className="relative">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <div className="absolute inset-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">Systems Online</span>
        </div>

        <div className="flex items-center space-x-2 border-l border-[#E5E7EB] pl-6">
          <Clock className="w-3.5 h-3.5 text-[#6B7280]" />
          {/* Bold time */}
          <span className="text-[13px] font-black text-[#0F172A] tracking-widest font-mono">
            {formattedTime} <span className="text-[10px] font-bold text-[#6B7280]">IST</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 border-l border-[#E5E7EB] pl-6">
          <Users className="w-3.5 h-3.5 text-[#6B7280]" />
          <span className="text-[11px] font-semibold text-[#0F172A]">12 active users</span>
        </div>
      </div>

      {/* Right: Name (bold + indigo) + Logout */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <span className="block text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest">Logged in as</span>
          {/* Bold first name — pulled live from DB */}
          <span className="block text-[14px] font-black text-[#4F46E5] uppercase tracking-wide">
            {staffName}
          </span>
        </div>
        <div className="w-9 h-9 rounded-xl bg-[#4F46E5]/10 border border-[#4F46E5]/20 flex items-center justify-center">
          <Shield className="w-4 h-4 text-[#4F46E5]" />
        </div>
        <button
          onClick={handleLogout}
          title="Log Out"
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-[#E5E7EB] text-[11px] font-bold text-[#6B7280] hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default HeroStatusBar;
