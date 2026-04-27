import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, CheckCircle, ShieldCheck, CreditCard, Plus, 
  Activity, AlertTriangle, Bell, Lock, FileText, 
  Link2, Shield, HelpCircle, ChevronRight, Check
} from 'lucide-react';

const AnimatedCounter = ({ value }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    let totalMilSecDur = parseInt(2);
    let incrementTime = (totalMilSecDur / end) * 1000;
    let timer = setInterval(() => {
      start += 15;
      if (start > end) start = end;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{count}</span>;
};

export const UserProfilePanel = ({ isOpen, onClose, user, logout }) => {
  const getInitials = () => {
    if (user?.first_name && user?.last_name) return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    if (user?.name) return user.name.substring(0, 2).toUpperCase();
    return 'US';
  };

  const fullName = user?.first_name ? `${user.first_name} ${user.last_name}` : (user?.name || 'User Profile');
  const dtiRatio = 37.5; // Mock value derived from previous dashboard state

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0f172a]/40 backdrop-blur-sm z-[100]"
          />
          
          {/* Slide-in Panel */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[480px] h-full bg-white z-[110] shadow-2xl flex flex-col overflow-hidden border-l border-gray-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-20">
              <h2 className="text-xl font-bold tracking-tight text-[#0f172a]">Profile & Settings</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar bg-[#F8FAFC]">
              
              {/* Identity Layer */}
              <div className="p-8 bg-white border-b border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/30 blur-[60px] rounded-full pointer-events-none" />
                
                <div className="flex items-center space-x-6 relative z-10">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <span className="text-2xl font-black text-white">{getInitials()}</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#0f172a]">{fullName}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-1">ID: MID-{user?.id?.substring(0, 8).toUpperCase() || '74028X'}</p>
                    <div className="flex items-center space-x-2 mt-3">
                      <span className="flex items-center space-x-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-green-200">
                        <CheckCircle className="w-3 h-3" />
                        <span>KYC Verified</span>
                      </span>
                      <span className="flex items-center space-x-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md border border-blue-200">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Low Risk</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Widget inside Identity Layer */}
                <div className="mt-8 bg-gradient-to-r from-gray-900 to-[#0f172a] rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-2xl">
                    <div className="absolute right-0 top-0 w-full h-full bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent opacity-60" />
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-4 flex items-center space-x-2">
                        <Activity className="w-4 h-4" />
                        <span>CIBIL Score</span>
                    </span>
                    <div className="flex items-end justify-between relative z-10">
                        <div>
                            <span className="text-5xl font-black text-white leading-none">
                                <AnimatedCounter value={780} />
                            </span>
                            <span className="text-gray-400 ml-2 text-sm font-medium">/ 900</span>
                        </div>
                        {/* Circular Progress Ring */}
                        <div className="relative w-16 h-16">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#334155" strokeWidth="3" />
                                <motion.path 
                                    initial={{ strokeDasharray: "0, 100" }}
                                    animate={{ strokeDasharray: "86.6, 100" }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#34d399" strokeWidth="3" strokeDasharray="86.6, 100" 
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">Top 5%</span>
                        </div>
                    </div>
                </div>
              </div>

              {/* Financial Snapshot */}
              <div className="p-8 pb-4">
                 <h4 className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest mb-4">Financial Snapshot</h4>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="bg-white p-5 rounded-2xl border border-gray-200">
                         <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block mb-2">Available Credit</span>
                         <span className="text-xl font-bold text-[#0f172a]">₹4.2L</span>
                     </div>
                     <div className="bg-white p-5 rounded-2xl border border-gray-200">
                         <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block mb-1">Active EMI</span>
                         <span className="text-xl font-bold text-indigo-600">₹14k/mo</span>
                         <span className="block mt-1 text-[9px] text-gray-400">across 2 accounts</span>
                     </div>
                     <div className="bg-white p-5 rounded-2xl border border-gray-200">
                         <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block mb-2">Missed Payments</span>
                         <div className="flex items-center space-x-2">
                             <span className="text-xl font-bold text-green-600">0</span>
                             <span className="bg-green-50 text-green-700 text-[9px] px-1.5 py-0.5 rounded font-bold">12M CLEAN</span>
                         </div>
                     </div>
                     <div className={`p-5 rounded-2xl border ${dtiRatio > 40 ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-200'}`}>
                         <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest block mb-1">DTI Ratio</span>
                         <span className={`text-xl font-bold ${dtiRatio > 40 ? 'text-orange-600' : 'text-[#0f172a]'}`}>{dtiRatio}%</span>
                         {dtiRatio > 35 && <span className="block mt-1 text-[9px] text-orange-600 font-bold italic flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> Caution limit</span>}
                     </div>
                 </div>
              </div>

              {/* Saved Cards */}
              <div className="p-8 pt-4">
                 <div className="flex items-center justify-between mb-4">
                     <h4 className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest">Saved Cards</h4>
                     <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors flex items-center space-x-1">
                         <Plus className="w-4 h-4" />
                         <span className="text-[10px] font-bold uppercase tracking-wider">Add</span>
                     </button>
                 </div>
                 
                 <div className="space-y-4">
                     {/* Primary Card */}
                     <div className="bg-white border border-gray-200 rounded-[1.5rem] p-5 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
                         <div className="flex justify-between items-start mb-6">
                            <div className="flex space-x-2 items-center">
                                <div className="bg-indigo-600 p-1.5 rounded border border-indigo-500 flex flex-col items-center justify-center">
                                    <div className="w-4 h-2.5 bg-indigo-200 rounded-[1px] mb-0.5"></div>
                                    <div className="w-4 h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-[1px]"></div>
                                </div>
                                <span className="text-sm font-bold text-[#0f172a] tracking-widest">•••• <span className="text-lg">8492</span></span>
                            </div>
                            <span className="text-[9px] font-bold uppercase tracking-widest bg-blue-50 text-blue-700 px-2 py-1 rounded">Primary</span>
                         </div>
                         <div className="flex justify-between items-end">
                            <div>
                                <span className="block text-[9px] text-gray-400 font-mono uppercase tracking-widest mb-1">Exp 12/28</span>
                                <span className="text-xs font-bold text-gray-700">MASTERCARD</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Limit Used</span>
                                <span className="text-sm font-bold text-[#0f172a]">22% <span className="text-[10px] text-gray-400 font-normal">of 5L</span></span>
                                <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                                     <div className="w-[22%] h-full bg-blue-600 rounded-full" />
                                </div>
                            </div>
                         </div>
                     </div>

                     {/* High Usage Card */}
                     <div className="bg-white border border-gray-200 rounded-[1.5rem] p-5 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
                         <div className="flex justify-between items-start mb-6">
                            <div className="flex space-x-2 items-center">
                                <div className="bg-gray-800 p-1.5 rounded border border-gray-700 flex flex-col items-center justify-center">
                                    <span className="text-white text-[8px] font-black italic">VISA</span>
                                </div>
                                <span className="text-sm font-bold text-[#0f172a] tracking-widest">•••• <span className="text-lg">1104</span></span>
                            </div>
                         </div>
                         <div className="flex justify-between items-end">
                            <div>
                                <span className="block text-[9px] text-gray-400 font-mono uppercase tracking-widest mb-1">Exp 04/26</span>
                                <span className="text-xs font-bold text-gray-700">VISA SIGNATURE</span>
                            </div>
                            <div className="text-right">
                                <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Limit Used</span>
                                <span className="text-sm font-bold text-orange-600">85% <span className="text-[10px] text-gray-400 font-normal">of 1L</span></span>
                                <div className="w-24 h-1.5 bg-orange-100 rounded-full mt-1.5 overflow-hidden">
                                     <div className="w-[85%] h-full bg-orange-500 rounded-full" />
                                </div>
                            </div>
                         </div>
                     </div>
                 </div>
              </div>

              {/* Activity Feed */}
              <div className="p-8 pt-0 border-b border-gray-100">
                  <h4 className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest mb-6 border-t border-gray-200 pt-8 mt-4">Recent Activity</h4>
                  <div className="relative border-l border-gray-200 ml-3 space-y-6">
                      <div className="relative pl-6">
                          <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-green-50" />
                          <h5 className="text-sm font-bold text-[#0f172a]">Payment Received</h5>
                          <p className="text-xs text-gray-500 mt-1">₹14,000 paid towards Home Loan</p>
                          <span className="text-[10px] text-gray-400 font-mono mt-2 block">Today, 10:42 AM</span>
                      </div>
                      <div className="relative pl-6">
                          <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50" />
                          <h5 className="text-sm font-bold text-[#0f172a]">Credit Report Updated</h5>
                          <p className="text-xs text-gray-500 mt-1">CIBIL score increased by +5 points.</p>
                          <span className="text-[10px] text-gray-400 font-mono mt-2 block">Yesterday</span>
                      </div>
                      <div className="relative pl-6">
                          <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-gray-400 ring-4 ring-gray-100" />
                          <h5 className="text-sm font-bold text-[#0f172a]">New Login Detected</h5>
                          <p className="text-xs text-gray-500 mt-1">Delhi, IN • Chrome / Windows</p>
                          <span className="text-[10px] text-gray-400 font-mono mt-2 block">3 days ago</span>
                      </div>
                  </div>
              </div>

              {/* Account Menu */}
              <div className="p-6">
                 <div className="space-y-1">
                    {[
                        { icon: React.createElement(Lock, {className:"w-4 h-4 text-gray-500"}), label: 'Security & 2FA' },
                        { icon: React.createElement(FileText, {className:"w-4 h-4 text-gray-500"}), label: 'Document Vault' },
                        { icon: React.createElement(Link2, {className:"w-4 h-4 text-gray-500"}), label: 'Linked Accounts' },
                        { icon: React.createElement(Bell, {className:"w-4 h-4 text-gray-500"}), label: 'Notification Preferences' },
                        { icon: React.createElement(Shield, {className:"w-4 h-4 text-gray-500"}), label: 'Privacy Settings' },
                        { icon: React.createElement(HelpCircle, {className:"w-4 h-4 text-gray-500"}), label: 'Help & Support' },
                    ].map((item, i) => (
                        <button key={i} className="w-full flex items-center justify-between p-3 hover:bg-gray-100 rounded-xl transition-colors group">
                           <div className="flex items-center space-x-3">
                               <div className="bg-white p-2 border border-gray-200 rounded-lg group-hover:border-blue-300 transition-colors">
                                   {item.icon}
                               </div>
                               <span className="text-sm font-semibold text-gray-700 group-hover:text-[#0f172a]">{item.label}</span>
                           </div>
                           <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                        </button>
                    ))}
                 </div>

                 <button 
                    onClick={logout}
                    className="w-full mt-6 flex items-center justify-center space-x-2 py-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-100 transition-colors font-bold text-sm border border-red-100"
                 >
                     <span>Sign Out Securely</span>
                 </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
