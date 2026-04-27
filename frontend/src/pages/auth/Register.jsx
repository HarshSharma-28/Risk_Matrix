import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Activity, ArrowRight, ShieldCheck, Briefcase, Copy, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '../../components/Logo';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'customer' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationResult, setRegistrationResult] = useState(null); // { staffId, isEmployee }
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await register(formData);
      // apiClient unwraps axios: res = { success, message, data: { user, staffId } }
      const staffId = res?.data?.staffId || null;

      if (formData.role === 'employee' && staffId) {
        // Show Staff ID banner before redirecting
        setRegistrationResult({ staffId, isEmployee: true });
      } else {
        // Customer: redirect immediately
        setTimeout(() => navigate('/login'), 1500);
        setRegistrationResult({ staffId: null, isEmployee: false });
      }
    } catch (err) {
      if (err.fields && err.fields.length > 0) {
        const firstError = err.fields[0];
        const fieldName = firstError.field.split('.').pop();
        setError(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}: ${firstError.message}`);
      } else {
        setError(err.message || 'There was an issue creating your account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationResult.staffId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── SUCCESS STATE for employee: show Staff ID prominently ──
  if (registrationResult?.isEmployee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-gray-100 shadow-2xl rounded-[2.5rem] p-12 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-[#4F46E5]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#4F46E5]" />
          </div>

          <h1 className="text-[26px] font-black text-[#0F172A] tracking-tight mb-2">Account Created!</h1>
          <p className="text-[#64748B] text-sm mb-10">
            Your staff account has been registered. Save your Staff ID — you'll need it every time you log in.
          </p>

          {/* Staff ID Box */}
          <div className="bg-[#F0F4FF] border-2 border-[#4F46E5]/20 rounded-[1.5rem] p-6 mb-8">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4F46E5]/70 mb-3">
              YOUR STAFF ID
            </p>
            <div className="flex items-center justify-center space-x-4">
              <span className="text-[2.5rem] font-black tracking-tight text-[#0F172A]">
                {registrationResult.staffId}
              </span>
              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#4F46E5] transition-colors"
                title="Copy Staff ID"
              >
                {copied
                  ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                  : <Copy className="w-5 h-5 text-[#64748B]" />
                }
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-8 text-left">
            <p className="text-[12px] font-bold text-amber-700">
              ⚠️ Note this down — it won't be shown again. You'll enter it in the STAFF ID field when logging in with "Staff Access".
            </p>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#4F46E5] text-white py-4 rounded-[1rem] font-black text-sm uppercase tracking-widest hover:bg-[#4338CA] transition-colors"
          >
            Continue to Login →
          </button>
        </motion.div>
      </div>
    );
  }

  // ── SUCCESS STATE for customer ──
  if (registrationResult?.isEmployee === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-black text-[#0F172A] mb-2">Account Created!</h2>
          <p className="text-[#64748B] text-sm">Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  // ── REGISTRATION FORM ──
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-sans selection:bg-blue-500/20 relative overflow-hidden px-6 py-12">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-5%] w-[45rem] h-[45rem] bg-indigo-100/40 rounded-full blur-[130px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[35rem] h-[35rem] bg-blue-100/30 rounded-full blur-[110px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-12 rounded-[3rem] border border-gray-100 shadow-2xl max-w-lg w-full relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
            <div className="mb-6">
                <Logo height="60" showText={false} />
            </div>
            <h1 className="text-4xl font-black text-center text-[#0F172A] tracking-tighter">Create Account</h1>
            <p className="text-[#64748B] text-sm mt-2 font-medium tracking-tight">Set up your account to start analyzing risk</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-xs font-bold border border-red-100 flex items-center space-x-3 shadow-sm"
            >
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></div>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-[#64748B] ml-1">First Name</label>
              <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})}
                    placeholder="John"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/30 focus:bg-white text-[#0F172A] font-medium transition-all"
                  />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-[#64748B] ml-1">Last Name</label>
              <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-blue-600 transition-colors" />
                  <input 
                    type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Doe"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/30 focus:bg-white text-[#0F172A] font-medium transition-all"
                  />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-[#64748B] ml-1">Email Address</label>
            <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  placeholder="name@example.com"
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/30 focus:bg-white text-[#0F172A] font-medium transition-all"
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-[#64748B] ml-1">Password</label>
            <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-blue-600 transition-colors" />
                <input 
                  type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/30 focus:bg-white text-[#0F172A] font-medium transition-all"
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-[#64748B] ml-1">I am a...</label>
            <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                <select 
                  value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-gray-50/50 border border-gray-100 rounded-[1.25rem] py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/30 focus:bg-white text-[#0F172A] font-medium transition-all appearance-none cursor-pointer"
                >
                    <option value="customer">Customer</option>
                    <option value="employee">Employee (Staff)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B]">
                    <Activity className="w-3 h-3" />
                </div>
            </div>
            {/* Warning for employee selection */}
            {formData.role === 'employee' && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[11px] font-bold text-amber-600 ml-1 mt-1"
              >
                ⚠️ A unique Staff ID will be generated for you after registration. Save it — you'll need it to log in.
              </motion.p>
            )}
          </div>

          <button 
            type="submit" disabled={isLoading}
            className="w-full bg-[#0F172A] text-white py-5 rounded-[1.5rem] font-bold text-sm uppercase tracking-widest hover:bg-blue-600 shadow-xl shadow-blue-500/10 transition-all flex items-center justify-center space-x-3 group disabled:opacity-50"
          >
            {isLoading ? (
                <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating Account...</span>
                </>
            ) : (
                <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </button>
        </form>

        <div className="mt-10 flex flex-col items-center space-y-6">
            <p className="text-sm font-medium text-[#64748B]">
              Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
            </p>
            
            <div className="pt-6 border-t border-gray-100 w-full flex justify-center items-center space-x-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default text-[#64748B]">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-black uppercase tracking-widest">Securely Encrypted</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
