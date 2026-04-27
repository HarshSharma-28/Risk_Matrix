import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Filter, Save, ChevronRight, CheckCircle, Info, Landmark, Car, Home, GraduationCap, Coins } from 'lucide-react';
import axios from 'axios';
import { BANKS } from '../../data/loanData.jsx';
import { Logo } from '../../components/Logo';
import { AuthContext } from '../../context/AuthContext';
import { UserProfilePanel } from '../../components/UserProfilePanel';
import { useToast } from '../../context/ToastContext';

export default function Loans() {
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);
    const [loanType, setLoanType] = useState('personal');
    const [score, setScore] = useState(70);
    const [savedCount, setSavedCount] = useState(0);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [applyingTo, setApplyingTo] = useState(null);
    const { showToast } = useToast();

    const types = [
        { id: 'personal', name: 'Personal', icon: Coins },
        { id: 'home', name: 'Home', icon: Home },
        { id: 'auto', name: 'Auto', icon: Car },
        { id: 'education', name: 'Education', icon: GraduationCap }
    ];

    const handleSaveQuote = async (quote) => {
        try {
            const token = sessionStorage.getItem('auth_token');
            await axios.post('http://localhost:3001/customer/save-quote', {
                bank_name: quote.bank.name,
                loan_type: quote.type,
                interest_rate: parseFloat(quote.finalRate),
                max_amount: parseFloat(quote.maxOffer)
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setSavedCount(prev => prev + 1);
            showToast("Quote securely saved to your vault.", "success");
        } catch (err) {
            console.error(err);
            showToast("Failed to save quote. System offline.", "error");
        }
    };

    const handleApply = (url) => {
        setApplyingTo(url);
        setTimeout(() => {
            window.open(url, '_blank');
            setApplyingTo(null);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-blue-500/20 font-sans pb-20">
            <style dangerouslySetInnerHTML={{__html: `
                .perspective-1000 { perspective: 1000px; }
                .preserve-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
            `}} />

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50 px-8 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard/customer')}>
                    <Logo height="32" />
                </div>
                <div className="flex items-center space-x-4 sm:space-x-8 text-sm font-semibold text-[#64748b]">
                    <div onClick={() => navigate('/dashboard/customer/vault')} className="text-[10px] uppercase tracking-widest text-[#64748b] bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl flex items-center space-x-2 font-bold shadow-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                        <span>Vault Items: {savedCount}</span>
                    </div>
                    <button onClick={() => navigate('/dashboard/customer')} className="text-xs uppercase tracking-widest font-bold text-[#64748b] hover:text-blue-600 transition-colors flex items-center space-x-2 group">
                        <span>Dashboard</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                    {/* User Profile Section */}
                    <div 
                       onClick={() => setIsProfileOpen(true)}
                       className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-xl transition-all"
                    >
                       <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 group-hover:bg-blue-600 transition-colors shadow-inner">
                          <span className="text-blue-600 font-bold text-xs uppercase group-hover:text-white">
                              {user?.name ? user.name.charAt(0) : 'U'}
                          </span>
                       </div>
                       <div className="hidden md:flex flex-col mr-2">
                          <span className="text-xs font-bold text-[#0f172a] leading-tight">{user?.name || 'User Profile'}</span>
                          <span className="text-[9px] uppercase tracking-widest text-blue-600 font-bold">{user?.role || 'CUSTOMER'}</span>
                       </div>
                    </div>
                    <button onClick={logout} className="text-[#64748b] hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all cursor-pointer font-bold flex items-center" title="Sign Out">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </button>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto pt-44 px-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-7xl font-black tracking-tighter text-[#0f172a] mb-4">
                             Capital <br className="hidden md:block" /> Intelligence
                        </h1>
                        <p className="text-[#64748b] text-xl font-medium max-w-lg">Advanced comparison engine for pre-qualified credit portfolios.</p>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex bg-white/50 p-2 rounded-[1.5rem] border border-gray-100 shadow-xl backdrop-blur-xl">
                        {types.map(t => (
                            <button key={t.id} onClick={() => setLoanType(t.id)} className={`flex items-center space-x-3 px-8 py-4 rounded-xl text-xs uppercase tracking-widest font-black transition-all ${loanType === t.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'text-[#64748b] hover:text-blue-600'}`}>
                                <t.icon className="w-4 h-4" />
                                <span className="hidden md:block">{t.name}</span>
                            </button>
                        ))}
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <AnimatePresence mode="wait">
                        {BANKS.map((bank, i) => (
                            <motion.div key={`${loanType}-${bank.id}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <LoanProductCard 
                                    bank={bank} 
                                    product={bank.products[loanType]} 
                                    score={score} 
                                    type={loanType}
                                    onSave={handleSaveQuote}
                                    onApply={handleApply}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="mt-32 p-16 rounded-[4rem] glass-card relative overflow-hidden">
                     <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100/50 rounded-full blur-[100px] pointer-events-none"></div>
                     <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-16">
                         <div className="space-y-6">
                             <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                                <Shield className="w-7 h-7 text-blue-600" />
                             </div>
                             <h3 className="text-2xl font-bold text-[#0f172a]">Protocol Secure</h3>
                             <p className="text-[#64748b] leading-relaxed text-sm font-medium">Bank-grade encryption ensures your financial profile remains decentralized and private during the application.</p>
                         </div>
                         <div className="space-y-6">
                             <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100">
                                <Landmark className="w-7 h-7 text-indigo-600" />
                             </div>
                             <h3 className="text-2xl font-bold text-[#0f172a]">Elite Partners</h3>
                             <p className="text-[#64748b] leading-relaxed text-sm font-medium">Direct synchronization with tier-1 institutions to bypass middleman friction and secure prime yields.</p>
                         </div>
                         <div className="space-y-6">
                             <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100">
                                <Activity className="w-7 h-7 text-green-600" />
                             </div>
                             <h3 className="text-2xl font-bold text-[#0f172a]">Live Indexing</h3>
                             <p className="text-[#64748b] leading-relaxed text-sm font-medium">All parameter adjustments reflect in real-time, matching you with the most favorable liquidity options instantly.</p>
                         </div>
                     </div>
                </div>

                {/* Application Interstitial Modal */}
                <AnimatePresence>
                    {applyingTo && (
                        <motion.div 
                           initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                           className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0f172a]/60 backdrop-blur-md"
                        >
                            <motion.div 
                               initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} 
                               className="bg-white/90 backdrop-blur-xl border border-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center max-w-sm text-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-blue-400/5 blur-[50px] rounded-full" />
                                <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full border-t-blue-600 animate-spin" />
                                    <Shield className="w-8 h-8 text-blue-600 relative z-10" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0f172a] mb-2">Establishing Secure Link</h3>
                                <div className="h-6 flex items-center justify-center overflow-hidden">
                                     <motion.span 
                                         animate={{ y: [20, 0, 0, -20] }} 
                                         transition={{ times: [0, 0.2, 0.8, 1], duration: 2.5, ease: "easeInOut" }}
                                         className="text-xs text-[#64748b] font-mono tracking-widest font-bold block"
                                     >
                                         HANDSHAKING WITH SERVERS...
                                     </motion.span>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </main>

            {/* Profile Sidebar */}
            <UserProfilePanel 
               isOpen={isProfileOpen} 
               onClose={() => setIsProfileOpen(false)} 
               user={user} 
               logout={logout} 
            />
        </div>
    );
}

const LoanProductCard = ({ bank, product, score, type, onSave, onApply }) => {
    const [flipped, setFlipped] = useState(false);
    const isEligible = score >= product.threshold;
    const riskPremium = (100 - score) * product.multiplier;
    const finalRate = (product.baseRate + (isEligible ? riskPremium : 0)).toFixed(2);
    
    const baseAmounts = { home: 5000000, auto: 1500000, personal: 500000, education: 2500000 };
    const maxOffer = (baseAmounts[type] * (score / 100) * (isEligible ? 1 : 0)).toFixed(0);

    return (
        <div className="group relative h-80 md:h-72 cursor-pointer" onClick={() => setFlipped(!flipped)} style={{ perspective: "2000px" }}>
            <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
                
                {/* FRONT */}
                <div className={`backface-hidden absolute inset-0 w-full h-full glass-card rounded-[3rem] p-10 flex flex-col justify-between transition-all ${isEligible ? 'hover:border-blue-400/50' : 'opacity-50 grayscale bg-gray-50'}`}>
                    <div className="absolute top-6 right-6 z-20 flex space-x-2">
                        <button onClick={(e) => { e.stopPropagation(); onSave({ bank, product, finalRate, maxOffer, type }); }} className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 hover:bg-white hover:text-red-500 transition-all text-[#64748b] shadow-sm">
                            <Save className="w-4 h-4" />
                        </button>
                    </div>

                    {!isEligible && (
                        <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center rounded-[3rem] backdrop-blur-[2px]">
                            <span className="text-red-600 font-bold tracking-widest uppercase border-2 border-red-600 px-6 py-2 rounded-xl bg-white rotate-[-2deg] shadow-lg">Not Eligible</span>
                        </div>
                    )}

                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-5">
                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                                <bank.Logo className="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight text-[#0f172a]">{bank.name}</h3>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{type}</span>
                                    <span className="text-[10px] uppercase font-bold text-[#64748b]">{bank.type}</span>
                                </div>
                            </div>
                        </div>
                        {isEligible && (
                             <div className="bg-green-50 text-green-600 text-[10px] px-4 py-1.5 rounded-xl font-black border border-green-100 uppercase tracking-widest">Pre-Qualified</div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between items-stretch gap-6 mt-4">
                         <div className="flex flex-col">
                             <span className="text-[10px] text-[#64748b] uppercase tracking-widest mb-1 font-bold">Interest Rate</span>
                             <span className="text-3xl font-bold text-[#0f172a] tracking-tighter italic">
                                 {isEligible ? `${finalRate}%` : '--'} <span className="text-sm font-normal text-gray-400 not-italic">p.a.</span>
                             </span>
                         </div>
                         <button 
                            onClick={(e) => { e.stopPropagation(); onApply(product.url) }} 
                            disabled={!isEligible} 
                            className={`px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${isEligible ? 'bg-[#0f172a] text-white hover:bg-blue-600 shadow-xl shadow-blue-500/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                         >
                             {isEligible ? "Apply Now" : "Ineligible"}
                         </button>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                             <span>Analyze Matrix</span>
                             <ChevronRight className="w-3.5 h-3.5 ml-1" />
                        </div>
                        <div className="flex flex-col text-right">
                             <span className="text-[10px] text-[#64748b] uppercase tracking-widest font-bold">Max Funding</span>
                             <span className="text-sm font-bold text-blue-600">
                                 {isEligible ? `₹${Number(maxOffer).toLocaleString('en-IN')}` : 'DECLINED'}
                             </span>
                        </div>
                    </div>
                </div>

                {/* BACK */}
                <div className="absolute top-0 left-0 w-full h-full backface-hidden rotate-y-180 glass-card rounded-[3rem] p-10 flex flex-col justify-center overflow-hidden">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <span className="text-sm font-black text-blue-600 uppercase tracking-widest">Institution Math Matrix</span>
                            <div className="flex items-center space-x-1">
                               <div className="w-1 h-1 rounded-full bg-blue-600 animate-pulse" />
                               <span className="text-[9px] text-gray-400 font-mono">Proprietary Flow</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex justify-between items-center bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                <span className="text-sm font-bold text-[#64748b]">Lending Floor</span>
                                <span className="text-lg font-bold text-[#0f172a]">{product.baseRate}%</span>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-5 rounded-2xl border border-gray-100">
                                <span className="text-sm font-bold text-[#64748b]">Risk Adjusted Premium</span>
                                <span className={`text-lg font-bold ${riskPremium > 0 ? "text-red-500" : "text-green-600"}`}>
                                    {riskPremium > 0 ? `+${riskPremium.toFixed(2)}%` : "PLATINUM"}
                                </span>
                            </div>
                        </div>
                        
                        <div className="bg-blue-50/30 p-6 rounded-3xl border border-blue-100/50">
                            <p className="text-xs text-[#64748b] leading-relaxed italic">
                                {isEligible 
                                  ? `Your Risk Index suggests a highly optimized profile. Benefit from institutional-grade floor rates with minimal premium adjustment.`
                                  : `Protocol Alert: Risk score is below the ${product.threshold} baseline. High-velocity improvement protocol required.`}
                            </p>
                        </div>
                        <div className="text-center">
                             <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">Click to Flip back</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
