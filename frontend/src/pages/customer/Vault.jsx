import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShieldAlert, ArrowLeft, DownloadCloud, Lock, FileText, Activity } from 'lucide-react';
import axios from 'axios';
import { Logo } from '../../components/Logo';
import { AuthContext } from '../../context/AuthContext';
import { UserProfilePanel } from '../../components/UserProfilePanel';
import { useToast } from '../../context/ToastContext';

export default function Vault() {
    const navigate = useNavigate();
    const { logout, user } = useContext(AuthContext);
    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        try {
            const token = sessionStorage.getItem('auth_token');
            const res = await axios.get('http://localhost:3001/customer/saved-quotes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.data.success) {
                setQuotes(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch vault items:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = sessionStorage.getItem('auth_token');
            await axios.delete(`http://localhost:3001/customer/delete-quote/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setQuotes(prev => prev.filter(q => q.id !== id));
            showToast("Document successfully revoked from ledger.", "success");
        } catch (err) {
            console.error("Failed to revoke quote:", err);
            showToast("Error revoking smart contract. Please try again.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0D17] text-white selection:bg-indigo-500/30 font-sans pb-20 relative overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[150px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-900/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Premium Dark Navbar */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-[#0B0D17]/70 border-b border-gray-800/50 px-8 py-4 flex justify-between items-center shadow-2xl">
                <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard/customer')}>
                    <span className="text-xl font-black tracking-tight flex items-center space-x-2">
                        <Lock className="w-6 h-6 text-indigo-500" />
                        <span>RiskMatrix <span className="font-light text-gray-400">Vault</span></span>
                    </span>
                </div>
                <div className="flex items-center space-x-4 sm:space-x-8 text-sm font-semibold text-gray-400">
                    <button onClick={() => navigate('/dashboard/customer/loans')} className="text-xs uppercase tracking-widest font-bold hover:text-white transition-colors flex items-center space-x-2">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Marketplace</span>
                    </button>
                    <div className="h-6 w-px bg-gray-800 hidden sm:block" />
                    
                    {/* User Profile Section - Dark Variant */}
                    <div 
                       onClick={() => setIsProfileOpen(true)}
                       className="flex items-center space-x-3 cursor-pointer group hover:bg-white/5 p-1.5 rounded-xl transition-all"
                    >
                       <div className="w-8 h-8 rounded-full bg-indigo-900/50 flex items-center justify-center border border-indigo-700/50 group-hover:bg-indigo-600 transition-colors shadow-inner">
                          <span className="text-indigo-300 font-bold text-xs uppercase group-hover:text-white">
                              {user?.name ? user.name.charAt(0) : 'U'}
                          </span>
                       </div>
                       <div className="hidden md:flex flex-col mr-2">
                          <span className="text-xs font-bold text-gray-200 leading-tight">{user?.name || 'User Profile'}</span>
                          <span className="text-[9px] uppercase tracking-widest text-indigo-400 font-bold">SECURE SESS</span>
                       </div>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto pt-40 px-6">
                
                <div className="flex justify-between items-end mb-16 border-b border-gray-800/50 pb-10">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <ShieldAlert className="w-6 h-6 text-red-500" />
                            </div>
                            <span className="text-xs font-mono uppercase tracking-widest text-red-500">Tier-3 Encryption</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-white mb-4">
                            Document Vault
                        </h1>
                        <p className="text-gray-400 text-lg font-medium max-w-xl">
                            All your pre-qualified loan contracts and saved liquidity quotes are securely stored here.
                        </p>
                    </motion.div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center pt-20">
                         <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
                         <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Decrypting...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {quotes.map((quote, i) => (
                                <motion.div 
                                    key={quote.id}
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                    transition={{ duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
                                    className="bg-[#15192B]/80 backdrop-blur-lg border border-gray-800 p-8 rounded-[2rem] flex flex-col justify-between group hover:border-indigo-500/50 transition-colors shadow-2xl relative overflow-hidden"
                                >
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-[40px] group-hover:bg-indigo-500/20 transition-colors pointer-events-none" />

                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white">{quote.bank_name}</h3>
                                                <span className="text-[9px] uppercase tracking-widest font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">{quote.loan_type}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(quote.id)}
                                            className="p-2 bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/10 hover:border-red-500"
                                            title="Revoke Contract"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-4 relative z-10 border-t border-gray-800/50 pt-6">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Locked Interest Rate</span>
                                            <span className="text-2xl font-bold text-white tracking-tight">{quote.interest_rate}%</span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Maximum Funding</span>
                                            <span className="text-xl font-bold text-emerald-400 tracking-tight">₹{Number(quote.max_amount).toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-between items-center relative z-10">
                                        <span className="text-[9px] text-gray-600 font-mono">ID: {quote.id.substring(0, 8)}...</span>
                                        <button className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                                            <DownloadCloud className="w-4 h-4" />
                                            <span>Export Print</span>
                                        </button>
                                    </div>
                                </motion.div>
                            ))}

                            {quotes.length === 0 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-[3rem] bg-[#15192B]/30">
                                    <Lock className="w-12 h-12 text-gray-700 mb-4" />
                                    <h3 className="text-xl font-bold text-gray-400">Vault is Empty</h3>
                                    <p className="text-sm text-gray-600 mt-2">Any quotes you save from the marketplace will appear securely here.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
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
