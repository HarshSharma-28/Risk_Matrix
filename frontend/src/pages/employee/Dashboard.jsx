import React, { useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, User, Shield, Cpu, FileText,
  AlertCircle, CheckCircle2, Clock, TrendingUp, Plus, BarChart2
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import HeroStatusBar from './CommandCenter/HeroStatusBar';
import ApplicationQueue from './CommandCenter/ApplicationQueue';
import KPITriptych from './CommandCenter/KPITriptych';
import AnomalyFeed from './CommandCenter/AnomalyFeed';
import ActionDock from './CommandCenter/ActionDock';

// ─── Modal Backdrop ────────────────────────────────────────────
const Backdrop = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
    onClick={onClose}
  />
);

// ─── Search Customer Modal ─────────────────────────────────────
const SearchModal = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(false);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, first_name, last_name, email, role, created_at, is_active')
        .or(`email.ilike.*${query.trim()}*,first_name.ilike.*${query.trim()}*,last_name.ilike.*${query.trim()}*`)
        .eq('role', 'customer')
        .limit(10);

      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <>
      <Backdrop onClose={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="fixed inset-0 z-[101] flex items-start justify-center pt-24 px-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-white rounded-[1.5rem] border border-[#E5E7EB] shadow-2xl w-full max-w-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-[#4F46E5]" />
              <h2 className="text-[13px] font-black uppercase tracking-widest text-[#0F172A]">Search Customer</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors">
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-[#F1F5F9]">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Search by name or email address..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-[13px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all"
              />
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="px-5 py-2.5 bg-[#4F46E5] text-white rounded-xl text-[12px] font-bold uppercase tracking-wide hover:bg-indigo-600 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-3">
            {searched && results.length === 0 && (
              <div className="flex flex-col items-center py-10 text-center">
                <AlertCircle className="w-10 h-10 text-[#CBD5E1] mb-3" />
                <p className="text-[13px] font-bold text-[#0F172A]">No customer found</p>
                <p className="text-[11px] text-[#94A3B8] mt-1">Try a different name or email address.</p>
              </div>
            )}
            {results.map(customer => (
              <div key={customer.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F0F4FF] transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20 flex items-center justify-center text-[#4F46E5] font-black text-xs">
                    {customer.first_name?.[0]}{customer.last_name?.[0]}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#0F172A]">
                      {customer.first_name} {customer.last_name}
                    </p>
                    <p className="text-[11px] text-[#94A3B8]">{customer.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border tracking-wide ${customer.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-500 border-red-100'}`}>
                    {customer.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <p className="text-[9px] text-[#94A3B8] mt-1 font-mono">
                    Since {new Date(customer.created_at).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>
            ))}
            {!searched && (
              <div className="flex flex-col items-center py-10 text-center">
                <Search className="w-10 h-10 text-[#E5E7EB] mb-3" />
                <p className="text-[12px] font-bold text-[#94A3B8]">Enter a name or email to search</p>
              </div>
            )}
          </div>

          <div className="px-6 py-3 border-t border-[#F1F5F9] bg-[#F8FAFC]">
            <p className="text-[10px] text-[#94A3B8]">Searching across all customer accounts in the database.</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// ─── Settings / Account Info Modal ────────────────────────────
const SettingsModal = ({ user, onClose }) => {


  const InfoRow = ({ label, value, mono }) => (
    <div className="flex items-center justify-between py-3 border-b border-[#F1F5F9] last:border-0">
      <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide">{label}</span>
      <span className={`text-[13px] font-semibold text-[#0F172A] ${mono ? 'font-mono text-[#4F46E5]' : ''}`}>{value || '—'}</span>
    </div>
  );

  return (
    <>
      <Backdrop onClose={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="fixed inset-0 z-[101] flex items-center justify-center px-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal — max-height 85vh, flex column so sticky header never disappears */}
        <div
          className="bg-white rounded-[1.5rem] border border-[#E5E7EB] shadow-2xl w-full max-w-md flex flex-col"
          style={{ maxHeight: '85vh' }}
        >

          {/* ── Sticky Header ── */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFC] rounded-t-[1.5rem]">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-[#4F46E5]" />
              <h2 className="text-[13px] font-black uppercase tracking-widest text-[#0F172A]">Account Settings</h2>
            </div>
            {/* ✕ Close — always visible */}
            <button
              onClick={onClose}
              title="Close"
              className="w-8 h-8 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors shadow-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Scrollable Body ── */}
          <div className="overflow-y-auto flex-1 divide-y divide-[#F1F5F9]">
              <>
                {/* Section 1 — Avatar card */}
                <div className="px-6 py-5">
                  <div className="flex items-center space-x-4 p-4 bg-[#F0F4FF] rounded-2xl">
                    <div className="w-14 h-14 rounded-full bg-[#4F46E5] flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                      {(user?.first_name || user?.user_metadata?.first_name || 'S')?.[0]}
                      {(user?.last_name  || user?.user_metadata?.last_name || '')?.[0]}
                    </div>
                    <div>
                      <p className="text-[16px] font-black text-[#0F172A]">
                        {user?.first_name || user?.user_metadata?.first_name} {user?.last_name || user?.user_metadata?.last_name}
                      </p>
                      <p className="text-[11px] text-[#6B7280] mb-1.5">{user?.email}</p>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20 tracking-wide">
                        {user?.role || 'Employee'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 2 — Account Details */}
                <div className="px-6 py-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mb-3">Account Details</p>
                  <div className="bg-[#F8FAFC] rounded-xl px-4 border border-[#F1F5F9]">
                    <InfoRow label="Email"       value={user?.email} />
                    <InfoRow label="Staff ID"    value={user?.staffId     || 'Not assigned'} mono />
                    <InfoRow label="Department"  value={user?.department  || 'General'} />
                    <InfoRow label="Designation" value={user?.designation || 'Staff'} />
                    <InfoRow label="Status"      value={user?.is_active !== false ? 'Active ✓' : 'Inactive'} />
                    <InfoRow
                      label="Member Since"
                      value={
                        user?.created_at
                          ? new Date(user.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
                          : '—'
                      }
                    />
                  </div>
                </div>

                {/* Section 3 — Preferences */}
                <div className="px-6 py-5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] mb-3">Preferences</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Email Notifications', enabled: true  },
                      { label: 'Daily Summary Report', enabled: true  },
                      { label: 'Fraud Alert Emails',   enabled: true  },
                      { label: 'Two-Factor Auth',      enabled: false },
                    ].map(pref => (
                      <div key={pref.label} className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
                        <span className="text-[12px] font-semibold text-[#0F172A]">{pref.label}</span>
                        <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors ${pref.enabled ? 'bg-[#4F46E5]' : 'bg-[#CBD5E1]'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${pref.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 4 — Footer note */}
                <div className="px-6 py-4 bg-[#F8FAFC] rounded-b-[1.5rem]">
                  <p className="text-[10px] text-[#94A3B8] text-center">
                    To update your profile, contact your system administrator.
                  </p>
                </div>
              </>
          </div>

        </div>
      </motion.div>
    </>
  );
};


// ─── Reports Modal ─────────────────────────────────────────────
const ReportsModal = ({ onClose }) => {
  const stats = [
    { label: 'Total Assessments (This Month)', value: '1,284', change: '+12%', up: true },
    { label: 'Approvals',   value: '1,079', change: '+8%',  up: true  },
    { label: 'Rejections',  value: '142',   change: '-3%',  up: false },
    { label: 'Under Review', value: '63',   change: '+2%',  up: true  },
    { label: 'Fraud Flags',  value: '14',   change: '+5%',  up: false },
    { label: 'Avg. Risk Score', value: '42.8', change: '+4.2%', up: false },
  ];

  return (
    <>
      <Backdrop onClose={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="fixed inset-0 z-[101] flex items-center justify-center px-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-white rounded-[1.5rem] border border-[#E5E7EB] shadow-2xl w-full max-w-md overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-[#4F46E5]" />
              <h2 className="text-[13px] font-black uppercase tracking-widest text-[#0F172A]">Monthly Report</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors">
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>

          <div className="p-6 space-y-3">
            <p className="text-[11px] text-[#94A3B8] mb-4 font-semibold">
              Performance summary for <span className="text-[#0F172A] font-black">April 2025</span>
            </p>
            {stats.map((s) => (
              <div key={s.label} className="flex items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#F1F5F9]">
                <span className="text-[12px] font-semibold text-[#0F172A]">{s.label}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-[16px] font-black text-[#0F172A]">{s.value}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                    {s.change}
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-2 flex items-center space-x-2 text-[10px] text-[#94A3B8]">
              <AlertCircle className="w-3 h-3" />
              <span>Sample data — real reporting requires analytics integration.</span>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// ─── New Assessment Modal ──────────────────────────────────────
const NewAssessmentModal = ({ onClose }) => {
  const [form, setForm] = useState({ customerEmail: '', income: '', debt: '', creditScore: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Dynamic import or standard fetch since we just want to leverage the wired apiClient wrapper.
      // But we can also access token from sessionStorage directly.
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/risk/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          income: Number(form.income),
          debtAmount: Number(form.debt),
          creditScore: Number(form.creditScore)
        })
      });
      
      const resData = await response.json();
      
      if (!response.ok || !resData.success) {
        throw new Error(resData.error?.message || resData.error || 'Failed to calculate risk');
      }
      
      setResult(resData.data);
      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Backdrop onClose={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="fixed inset-0 z-[101] flex items-center justify-center px-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-white rounded-[1.5rem] border border-[#E5E7EB] shadow-2xl w-full max-w-md overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
            <div className="flex items-center space-x-2">
              <Plus className="w-4 h-4 text-[#4F46E5]" />
              <h2 className="text-[13px] font-black uppercase tracking-widest text-[#0F172A]">New Risk Assessment</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors">
              <X className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>

          <div className="p-6">
            {submitted ? (
              <div className="flex flex-col items-center py-6 text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                  result?.decision === 'APPROVE' ? 'bg-emerald-100 text-emerald-600' : 
                  result?.decision === 'REJECT' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {result?.decision === 'APPROVE' ? <CheckCircle2 className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
                </div>
                <h3 className="text-[18px] font-black tracking-tight text-[#0F172A] mb-1">
                  Result: {result?.decision}
                </h3>
                <p className="text-[13px] font-bold text-[#4F46E5] mb-4">Calculated Score: {result?.calculatedScore}</p>
                <div className="bg-[#F8FAFC] rounded-xl p-4 border border-[#F1F5F9] mb-6 text-left w-full text-[11px] text-[#6B7280] font-medium leading-relaxed">
                  {result?.explanation}
                </div>
                <button onClick={onClose} className="px-6 py-2.5 w-full bg-[#4F46E5] text-white rounded-xl text-[12px] font-black tracking-widest uppercase hover:bg-indigo-600 transition-colors">
                  Close Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                   <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 font-bold text-xs">
                     Error: {error}
                   </div>
                )}
                {[
                  { label: 'Customer Email', key: 'customerEmail', type: 'email', placeholder: 'customer@example.com' },
                  { label: 'Annual Income (₹)', key: 'income', type: 'number', placeholder: '500000' },
                  { label: 'Total Debt (₹)', key: 'debt', type: 'number', placeholder: '100000' },
                  { label: 'Credit Score', key: 'creditScore', type: 'number', placeholder: '650' },
                ].map(field => (
                  <div key={field.key}>
                    <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">{field.label}</label>
                    <input
                      type={field.type}
                      required
                      value={form[field.key]}
                      onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-2.5 rounded-[0.75rem] border border-[#E5E7EB] text-[13px] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition-all font-medium"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 bg-[#4F46E5] text-white rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors mt-2 disabled:opacity-50 shadow-xl shadow-[#4F46E5]/20"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Calculate Risk Engine'
                  )}
                </button>
                <p className="text-[10px] text-center text-[#94A3B8] font-semibold mt-2">
                  Uses deep Java Spring Boot Matrix Engine (Port 8080)
                </p>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────
const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [searchOpen,        setSearchOpen]        = useState(false);
  const [settingsOpen,      setSettingsOpen]      = useState(false);
  const [reportsOpen,       setReportsOpen]       = useState(false);
  const [newAssessmentOpen, setNewAssessmentOpen] = useState(false);

  const containerVariants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden:  { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF] font-sans pb-20 overflow-x-hidden">
      <HeroStatusBar user={user} />

      <main className="max-w-[1600px] mx-auto px-8 py-8 space-y-8">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">

          {/* Page Title */}
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-black text-[#0F172A] tracking-tight">Staff Dashboard</h1>
            <p className="text-[#6B7280] text-sm mt-1 font-medium">
              Welcome back,{' '}
              <span className="text-[#4F46E5] font-bold">
                {user?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Staff'}
              </span>
              . Here's what's happening today.
            </p>
          </motion.div>

          {/* KPI Cards */}
          <motion.div variants={itemVariants}>
            <KPITriptych />
          </motion.div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <motion.div variants={itemVariants} className="lg:col-span-8">
              <ApplicationQueue />
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-4 space-y-6">
              {/* Security Summary */}
              <div className="bg-white rounded-[1.5rem] border border-[#E5E7EB] p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[12px] font-black uppercase tracking-widest text-[#0F172A]">Security Summary</h3>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB]">
                    <span className="text-[11px] font-bold text-[#6B7280]">Total Active Users</span>
                    <span className="text-[13px] font-black text-[#0F172A]">4,281</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="text-[11px] font-bold text-amber-700">Flagged Accounts</span>
                    <span className="text-[13px] font-black text-amber-600">14</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#4F46E5]/5 border border-[#4F46E5]/10">
                    <span className="text-[11px] font-bold text-[#4F46E5]">AI Model Accuracy</span>
                    <span className="text-[13px] font-black text-[#4F46E5]">99.8%</span>
                  </div>
                </div>
                <button
                  onClick={() => setReportsOpen(true)}
                  className="w-full py-3 rounded-xl border border-[#E5E7EB] text-[11px] font-bold uppercase tracking-widest text-[#6B7280] hover:bg-[#4F46E5]/5 hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-all"
                >
                  View Monthly Report →
                </button>
              </div>

              {/* AI Engine Card */}
              <div className="bg-gradient-to-br from-[#4F46E5] to-[#3730A3] rounded-[1.5rem] p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center space-x-2 mb-3">
                    <Cpu className="w-4 h-4 text-indigo-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200">AI Risk Engine</span>
                  </div>
                  <h4 className="text-xl font-black tracking-tight mb-2">Running Optimally</h4>
                  <p className="text-[11px] text-indigo-200 leading-relaxed mb-5">
                    The AI model is auto-calibrated for the current loan portfolio. No manual intervention needed.
                  </p>
                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="px-5 py-2.5 bg-white text-[#4F46E5] font-black uppercase tracking-widest text-[10px] rounded-xl hover:shadow-lg hover:scale-105 transition-all"
                  >
                    View Account Settings
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <AnomalyFeed />

      {/* ActionDock — all buttons properly wired */}
      <ActionDock
        onNewAssessment={() => setNewAssessmentOpen(true)}
        onSearch={() => setSearchOpen(true)}
        onReports={() => setReportsOpen(true)}
        onSettings={() => setSettingsOpen(true)}
        onQuickRisk={() => setSearchOpen(true)}
      />

      {/* Modals */}
      <AnimatePresence>
        {searchOpen        && <SearchModal        onClose={() => setSearchOpen(false)}        />}
        {settingsOpen      && <SettingsModal      onClose={() => setSettingsOpen(false)} user={user} />}
        {reportsOpen       && <ReportsModal       onClose={() => setReportsOpen(false)}       />}
        {newAssessmentOpen && <NewAssessmentModal onClose={() => setNewAssessmentOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default EmployeeDashboard;
