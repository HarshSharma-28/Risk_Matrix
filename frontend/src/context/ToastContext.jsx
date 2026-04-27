import React, { createContext, useState, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used within a ToastProvider");
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-24 right-10 z-[100] flex flex-col items-end space-y-4 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            className="pointer-events-auto"
                        >
                            <div className={`
                                min-w-[320px] p-5 rounded-3xl backdrop-blur-2xl shadow-2xl border
                                flex items-center justify-between space-x-4 transition-all
                                ${toast.type === 'success' ? 'bg-white/70 border-emerald-200/50 shadow-emerald-500/10' : 
                                  toast.type === 'error' ? 'bg-white/70 border-red-200/50 shadow-red-500/10' : 
                                  'bg-white/70 border-blue-200/50 shadow-blue-500/10'}
                            `}>
                                <div className="flex items-center space-x-4">
                                    <div className={`
                                        p-2.5 rounded-2xl
                                        ${toast.type === 'success' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                                          toast.type === 'error' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 
                                          'bg-blue-500 text-white shadow-lg shadow-blue-500/20'}
                                    `}>
                                        {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : 
                                         toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : 
                                         <Info className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#64748B] mb-0.5 opacity-60">System Message</p>
                                        <p className="text-sm font-bold text-[#0F172A] tracking-tight">{toast.message}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeToast(toast.id)}
                                    className="p-1.5 hover:bg-black/5 rounded-xl transition-colors text-gray-400"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                
                                {/* Progress Bar */}
                                <motion.div 
                                    className={`absolute bottom-0 left-0 h-0.5 rounded-full ${
                                        toast.type === 'success' ? 'bg-emerald-500/50' : 
                                        toast.type === 'error' ? 'bg-red-500/50' : 'bg-blue-500/50'
                                    }`}
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 4, ease: "linear" }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
