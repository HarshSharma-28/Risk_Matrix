import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Cpu, Bot, Send, Activity, ChevronRight, Clock } from 'lucide-react';
import { BANKS } from '../../data/loanData.jsx';
import { Logo } from '../../components/Logo';
import { UserProfilePanel } from '../../components/UserProfilePanel';
import { evaluateRisk } from '../../api/risk.api';
import { AuthContext } from '../../context/AuthContext';

const LiquidMeter = ({ score }) => {
  return (
    <div className="relative w-64 h-64 rounded-full overflow-hidden border border-blue-200 flex items-center justify-center bg-white shadow-[0_20px_50px_rgba(37,99,235,0.1)]">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-blue-50/30" />
      
      {/* Liquid Wave Layer 1 */}
      <motion.div
        initial={{ top: '100%', rotate: 0 }}
        animate={{ top: `${100 - score}%`, rotate: 360 }}
        transition={{ top: { duration: 2, ease: "easeOut" }, rotate: { repeat: Infinity, duration: 10, ease: "linear" } }}
        className="absolute left-[-50%] w-[200%] h-[200%] bg-blue-200/40 rounded-[40%]"
      />
      {/* Liquid Wave Layer 2 */}
      <motion.div
        initial={{ top: '100%', rotate: 0 }}
        animate={{ top: `${103 - score}%`, rotate: -360 }}
        transition={{ top: { duration: 2, ease: "easeOut" }, rotate: { repeat: Infinity, duration: 7, ease: "linear" } }}
        className="absolute left-[-50%] w-[200%] h-[200%] bg-blue-600/80 rounded-[35%]"
      />
      
      {/* Central Score Text Overlay */}
      <div className="relative z-10 flex flex-col items-center pointer-events-none">
        <span className="text-6xl font-sans font-bold text-[#0f172a] drop-shadow-sm">
          {score.toFixed(0)}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600/80 mt-1">Trust Score</span>
      </div>
    </div>
  );
};

const FlipCard = ({ metrics, explanation, income, debt, credit, setShowXAI }) => {
  const [flipped, setFlipped] = useState(false);
  const calculatedDti = income > 0 ? ((debt / income) * 100).toFixed(1) : 0;
  
  return (
    <div 
      className="group perspective-1000 w-full h-48 cursor-pointer relative" 
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
       <div className="absolute -top-3 right-4 bg-blue-100 text-blue-600 text-[9px] uppercase font-bold tracking-widest px-2 py-1 rounded shadow-sm z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-all">Live Insight</div>
       <div className={`relative w-full h-full duration-700 preserve-3d ${flipped ? 'rotate-x-180' : ''}`}>
        
        {/* Front */}
        <div className="absolute w-full h-full backface-hidden glass-card rounded-[2rem] p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <h3 className="text-lg text-[#0f172a] font-bold tracking-tight">Financial Health</h3>
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end border-b border-gray-100 pb-2">
              <span className="text-sm text-[#64748b]">Debt to Income Ratio</span>
              <span className="font-bold text-blue-600">{calculatedDti}%</span>
            </div>
            <div className="flex justify-between items-end border-b border-gray-100 pb-2">
               <span className="text-sm text-[#64748b]">Credit Health</span>
               <span className="font-bold text-indigo-600">{credit}</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="absolute w-full h-full backface-hidden rotate-x-180 glass-card rounded-[2rem] p-5 flex flex-col overflow-hidden">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">AI Analysis</span>
          </div>
          <div className="text-[11px] leading-relaxed text-[#64748b] flex-1 overflow-y-auto pr-2 custom-scrollbar font-medium">
            {!metrics ? (
               <div className="mt-4 opacity-50">Please calculate your score to see the full analysis.</div>
            ) : (
               <div className="space-y-2 mt-1">
                 <p className="text-blue-700 text-[9px] uppercase border-b border-gray-100 pb-1 mb-2">Analysis Level: Active</p>
                 <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded-xl">
                    <span>Debt Analysis:</span> 
                    <span className={calculatedDti > 40 ? "text-red-600 font-bold" : "text-green-600 font-bold"}>{calculatedDti}%</span>
                 </div>
                 <div className="flex justify-between items-center bg-blue-50/50 p-2 rounded-xl">
                     <span>Credit Rating:</span> 
                    <span className={credit >= 700 ? "text-green-600 font-bold" : "text-yellow-600 font-bold"}>{credit}</span>
                 </div>
                 <p className="text-[10px] text-[#64748b] mt-2 italic">
                     {explanation || `Profile analyzed against current risk metrics.`}
                 </p>
               </div>
            )}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100/50 text-right">
             <span className="text-[10px] uppercase tracking-widest font-bold text-blue-600">Status: <span className={metrics?.decision === "APPROVED" ? "text-green-600" : (metrics?.decision ? "text-red-600" : "text-gray-400")}>{metrics?.decision || "READY"}</span></span>
          </div>
        </div>

      </div>
    </div>
  );
};

const OrbitalRings = ({ score }) => {
  return (
    <div className="relative w-80 h-80 flex items-center justify-center perspective-1000">
      <motion.div animate={{ rotateX: 360, rotateY: 180 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute w-full h-full border-2 border-blue-400/30 rounded-full border-t-blue-600" />
      <motion.div animate={{ rotateY: 360, rotateZ: 180 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} className="absolute w-64 h-64 border-2 border-indigo-400/30 rounded-full border-r-indigo-600" />
      <motion.div animate={{ rotateZ: 360, rotateX: 180 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute w-56 h-56 border border-gray-200 rounded-full border-b-blue-700/60 shadow-[inset_0_0_15px_rgba(37,99,235,0.1)]" />
      
      <div className="backdrop-blur-xl bg-white/60 border border-blue-100 rounded-full w-28 h-28 flex items-center justify-center flex-col z-10 shadow-2xl">
         <span className="text-4xl font-bold text-[#0f172a]">{score}</span>
         <span className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold">Trust Score</span>
      </div>
    </div>
  );
};

const RiskTimelineGraph = ({ score }) => {
   const [points, setPoints] = useState([150,130,80,110,90,50,10,20]);
   

   useEffect(() => {
       if (score > 0) {
           const finalY = 150 - (score / 100) * 130; 
           setPoints(prev => {
               const newPoints = [...prev.slice(1), finalY];
               return newPoints.map((y, i) => i === 7 ? finalY : Math.max(20, Math.min(140, y + (Math.random() * 20 - 10))));
           });
       }
   }, [score]);

   const pathD = `M 0,150 ` + points.map((cy, i) => `L ${i * 50},${cy}`).join(' ') + ` L 350,150 Z`;
   const lineD = `M 0,${points[0]} ` + points.map((cy, i) => `L ${i * 50},${cy}`).join(' ');

  return (
    <div className="w-full h-64 relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden shadow-xl glass-card">
        <span className="text-xs uppercase tracking-widest text-cyan-400 mb-4 block font-bold">Score History</span>
       <div className="absolute inset-0 top-16 px-6">
           <svg viewBox="0 0 350 150" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                 <linearGradient id="neonGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5"/>
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0"/>
                 </linearGradient>
              </defs>
              <motion.path animate={{ d: pathD }} transition={{ duration: 1.5, ease: "easeInOut" }} fill="url(#neonGlow)" />
              <motion.path animate={{ d: lineD }} transition={{ duration: 1.5, ease: "easeInOut" }} fill="none" stroke="#22d3ee" strokeWidth="3" className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              {points.map((cy, i) => (
                 <motion.circle key={i} animate={{ cy: cy }} transition={{ duration: 1.5, ease: "easeInOut" }} cx={i*50} r="4" fill="#8b5cf6" className="drop-shadow-[0_0_5px_rgba(139,92,246,1)]" />
              ))}
           </svg>
       </div>
    </div>
  );
};

const XAIImprovementProtocol = ({ score, income, debtAmount, creditScore }) => {
  const dti = (debtAmount / (income || 1)) * 100;
  
  const suggestions = [
    {
      id: 'DTI',
      condition: dti > 35,
      title: "Debt-to-Income Optimization",
      impact: `Critical Limit Reached: Your current DTI ratio is ${dti.toFixed(1)}%. Lenders categorize anything above 35% as high risk, which restricts you from premium interest rates and lowers your Trust Score by up to 15 points.`,
      action: `Target a debt reduction of ₹${Math.max(0, debtAmount - (income * 0.3)).toLocaleString('en-IN')}. Focus on clearing high-interest revolving debt (like credit cards) first, which will immediately rapidly recover your baseline score.`,
      icon: <Activity className="w-5 h-5 text-orange-600" />
    },
    {
      id: 'CREDIT',
      condition: creditScore < 740,
      title: "Credit Health Rehabilitation",
      impact: `Your credit health is currently ${creditScore}, sitting below the 740 Prime threshold. This signals inconsistent payment history or extremely high credit utilization to our underwriting engine.`,
      action: `Never utilize more than 30% of your total credit limit. Ensure 100% on-time payment velocity for the next 3 billing cycles to dynamically bump your Trust Score. Reaching 780+ unlocks Tier-1 enterprise borrowing rates.`,
      icon: <Shield className="w-5 h-5 text-blue-600" />
    },
    {
      id: 'VELOCITY',
      condition: score < 85,
      title: "Risk Matrix Acceleration",
      impact: `Your Trust Score reflects solid foundational behavior but lacks "financial velocity." You are missing out on pre-approved loan status and instant collateral-free liquidity.`,
      action: `Keep your accounts highly active but maintain zero defaults. Our AI recommends consolidating minor loans into a single line of credit to prove stable repayment behavior. Expect score acceleration within 45 days of consistent behavior.`,
      icon: <Bot className="w-5 h-5 text-indigo-600" />
    }
  ].filter(s => s.condition);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {suggestions.map((s, i) => (
        <motion.div 
          key={s.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-6 rounded-[2rem] relative overflow-hidden group hover:border-blue-400/50 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-500/5"
        >
          <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-100/60">
            <div className="p-3 bg-white rounded-xl border border-gray-100 group-hover:border-blue-200 group-hover:bg-blue-50 transition-colors shadow-sm">
              {s.icon}
            </div>
            <h4 className="text-sm font-bold tracking-tight text-[#0f172a]">{s.title}</h4>
          </div>
          
          <div className="space-y-4">
              <div className="bg-red-50/50 rounded-xl p-3 border border-red-100/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1 block">Diagnosis Impact</span>
                <p className="text-xs text-[#64748b] leading-relaxed font-medium">
                  {s.impact}
                </p>
              </div>

              <div className="bg-green-50/50 rounded-xl p-3 border border-green-100/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-1 block">Prescribed Action</span>
                <p className="text-xs text-[#0f172a] leading-relaxed font-semibold">
                  {s.action}
                </p>
              </div>
          </div>

          <div className="absolute -top-4 -right-4 p-2 opacity-[0.03] pointer-events-none transform rotate-12">
            <Cpu className="w-32 h-32 text-[#0f172a]" />
          </div>
        </motion.div>
      ))}
      {suggestions.length === 0 && (
        <div className="col-span-full bg-green-50/50 border border-green-200 p-8 rounded-[2rem] text-center glass-card">
            <p className="text-sm text-green-700 font-bold uppercase tracking-widest">You're all set! No major improvements needed.</p>
        </div>
      )}
    </div>
  );
};

const AryaAI = ({ score, creditScore, income, debtAmount }) => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = React.useRef(null);

    const dti = income > 0 ? ((debtAmount / income) * 100).toFixed(1) : 0;

    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([{
                id: 1,
                sender: 'arya',
                text: `Hello! I'm Arya. I've securely loaded your financial profile. I see your Trust Score is currently ${score.toFixed(0)} and your DTI is ${dti}%. How can I help you optimize your portfolio today?`
            }]);
        }
    }, [open]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if(!input.trim()) return;
        
        const userMsg = input.trim();
        const newMessages = [...messages, { id: Date.now(), sender: 'user', text: userMsg }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            const token = sessionStorage.getItem('auth_token');
            const response = await fetch("http://localhost:3001/ai/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: `You are Arya, a elite financial AI underwriting assistant for RiskMatrix. 
                            The user has these LIVE metrics: 
                            - Trust Score: ${score.toFixed(0)}/100
                            - Credit Score: ${creditScore}/850
                            - Yearly Income: ₹${income}
                            - Outstanding Debt: ₹${debtAmount}
                            - DTI: ${dti}%. 
                            
                            Give extremely concise, brutal, and technical financial advice. No fluff. Max 2-3 sentences.`
                        },
                        ...newMessages.slice(-5).map(m => ({
                            role: m.sender === 'user' ? 'user' : 'assistant',
                            content: m.text
                        }))
                    ]
                })
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.message || "Backend error");
            const reply = data.data;

            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'arya', text: reply }]);
        } catch (error) {
            console.error("Grok Proxy Error:", error);
            setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'arya', text: "Grok is currently offline. Please check your API key or connection." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
         <AnimatePresence>
         {open && (
           <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="mb-4 w-96 h-[32rem] backdrop-blur-[40px] bg-white/90 border border-blue-100 rounded-[2.5rem] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="flex items-center space-x-4 border-b border-gray-100 pb-4 mb-4 relative z-10">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Bot className="w-6 h-6 text-white" />
                 </div>
                 <div>
                    <span className="font-black tracking-tight text-lg text-[#0f172a] block">Arya Intelligence</span>
                    <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest flex items-center mt-0.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse mr-1.5" /> Synchronized
                    </span>
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto font-sans text-sm space-y-4 pr-3 custom-scrollbar relative z-10 pb-4">
                 {messages.map(msg => (
                    <motion.div 
                       initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                       key={msg.id} 
                       className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                       <div className={`p-4 rounded-2xl max-w-[85%] leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-blue-50/50 text-[#0f172a] rounded-bl-sm border border-blue-100/50'}`}>
                           {msg.text}
                       </div>
                    </motion.div>
                 ))}
                 {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                       <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl rounded-bl-sm flex space-x-1.5">
                           <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                           <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                           <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                       </div>
                    </motion.div>
                 )}
                 <div ref={messagesEndRef} />
              </div>
              
              <form onSubmit={handleSend} className="mt-2 relative z-10">
                 <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    type="text" 
                    placeholder="Ask Arya anything..." 
                    className="w-full bg-gray-50 border border-gray-200 text-[#0f172a] placeholder-gray-400 p-4 pr-14 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium" 
                 />
                 <button 
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 transition-all shadow-md"
                 >
                    <Send className="w-4 h-4 text-white" />
                 </button>
              </form>
           </motion.div>
         )}
         </AnimatePresence>
         
         <button onClick={() => setOpen(!open)} className="w-16 h-16 bg-blue-600 border border-blue-500 rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(37,99,235,0.4)] hover:scale-105 active:scale-95 transition-all group z-50">
            {open ? <ChevronRight className="w-6 h-6 text-white rotate-90" /> : <Bot className="w-7 h-7 text-white group-hover:scale-110 transition-transform" />}
         </button>
      </div>
    );
};

// Modular Flip Card for individual Banks
const BankCard = ({ bank, score, maxLoanPrincipal, index, setShowXAI }) => {
   const [flipped, setFlipped] = useState(false);
   
   const product = bank.products.personal;
   const isEligible = score >= product.threshold;
   const riskPremium = (100 - score) * product.multiplier;
   const finalRate = (product.baseRate + (isEligible ? riskPremium : 0)).toFixed(2);
   const offer = (maxLoanPrincipal * (score / 100)).toFixed(0);

   return (
     <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: index * 0.1 }} 
        className="group relative h-80 md:h-72 cursor-pointer" 
        onClick={() => setFlipped(!flipped)}
        style={{ perspective: "2000px" }}
     >
        <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
           {/* Front */}
           <div className={`absolute inset-0 w-full h-full backface-hidden glass-card rounded-[2.5rem] p-8 flex flex-col md:flex-row justify-between items-center transition-all ${!isEligible ? 'opacity-50 grayscale' : 'hover:border-blue-400/50'}`}>
              {!isEligible && (
                  <div className="absolute inset-0 bg-white/40 z-10 flex items-center justify-center rounded-[2.5rem] backdrop-blur-[2px]">
                      <span className="text-red-600 font-bold tracking-widest uppercase border-2 border-red-600 px-6 py-2 rounded-xl bg-white rotate-[-2deg] shadow-lg">Not Eligible</span>
                  </div>
              )}

              <div className="flex items-center space-x-6 w-full md:w-1/3">
                 <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-white transition-colors">
                                <bank.Logo className="w-7 h-7 text-[#2563EB]" />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-[#0f172a]">{bank.name}</h4>
                    <span className="text-[10px] uppercase font-bold text-[#64748b] tracking-widest">{bank.type}</span>
                 </div>
              </div>

              <div className="flex flex-col md:w-1/3 text-center md:text-left my-4 md:my-0">
                 <span className="text-[10px] uppercase tracking-widest font-bold text-[#64748b] block mb-1">Interest Rate</span>
                 <span className="text-3xl font-sans font-bold text-[#0f172a]">{isEligible ? `${finalRate}%` : '--'} <span className="text-sm font-normal text-gray-400">p.a.</span></span>
              </div>

              <div className="flex flex-col items-center md:items-end md:w-1/3 space-y-4">
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#64748b] block mb-1">Max Potential Offer</span>
                    <span className="text-2xl font-bold text-blue-600">₹{isEligible ? Number(offer).toLocaleString('en-IN') : '0'}</span>
                  </div>
                  <button 
                    disabled={!isEligible} 
                    onClick={(e) => { e.stopPropagation(); window.open(product.url, '_blank') }} 
                    className={`px-8 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all ${isEligible ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >
                    {isEligible ? "Apply Now" : "Ineligible"}
                  </button>
              </div>
           </div>

           <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 absolute bottom-6 left-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center space-x-2 text-[10px] font-bold text-blue-600 cursor-pointer hover:underline">
                 <span>View Details</span>
                 <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
              </div>
              <span className="text-[9px] text-gray-400 font-mono">Secure Connection</span>
           </div>

           {/* Back */}
           <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 glass-card rounded-[2.5rem] p-6 flex flex-col justify-center overflow-hidden">
              <div className="space-y-4">
                 <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Eligibility Analysis</span>
                    <div className="flex items-center space-x-1">
                       <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                       <span className="text-[9px] text-gray-400 font-mono">Active</span>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                       <span className="block text-[9px] text-[#64748b] uppercase font-bold mb-0.5 tracking-tight">Base Rate</span>
                       <span className="text-sm font-bold text-[#0f172a]">{product.baseRate}%</span>
                    </div>
                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                       <span className="block text-[9px] text-[#64748b] uppercase font-bold mb-0.5 tracking-tight">Risk Premium Weight</span>
                       <span className={`text-sm font-bold ${riskPremium > 0 ? "text-red-500" : "text-green-600"}`}>
                          {riskPremium > 0 ? `+${riskPremium.toFixed(2)}%` : "PRIME STATUS (0%)"}
                       </span>
                    </div>
                 </div>
                 <div className={`${isEligible ? 'bg-blue-50/30 border-blue-100/50' : 'bg-red-50/30 border-red-100/50'} p-4 rounded-xl border`}>
                    <span className={`text-[10px] uppercase font-bold tracking-widest block mb-1 ${isEligible ? 'text-blue-600' : 'text-red-600'}`}>Underwriting Logic</span>
                    <p className="text-[10px] text-[#64748b] leading-relaxed">
                       {isEligible 
                         ? `Based on your Trust Score of ${score.toFixed(0)}, you comfortably meet ${bank.name}'s threshold (${product.threshold}). Your final interest rate of ${finalRate}% is derived algebraically: taking the bank's base pool rate (${product.baseRate}%) and applying your personalized risk premium (+${riskPremium.toFixed(2)}%).` 
                         : `Risk Override: Your current Trust Score (${score.toFixed(0)}) falls strictly below the institutional threshold of ${product.threshold} for ${bank.name}. The algorithm restricts approval until your credit utilization and risk velocity improve.`}
                    </p>
                 </div>
                 <div className="text-center">
                    <span className="text-[9px] text-blue-600 font-bold uppercase tracking-widest">Click to Return</span>
                 </div>
              </div>
           </div>
        </div>
     </motion.div>
   );
};

const BankMarketplace = ({ score, income, debtAmount, setShowXAI }) => {
   const safeEMI = (income / 12) * 0.45; 
   const currentEMI = debtAmount * 0.02; 
   const availableEMI = Math.max(0, safeEMI - currentEMI);
   const r = 0.10 / 12;
   const maxLoanPrincipal = availableEMI > 0 ? (availableEMI * (1 - Math.pow(1 + r, -60)) / r) : 0;

   return (
      <div className="mt-24 w-full scroll-mt-32 border-t border-gray-100 pt-16 pb-10" id="offers">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 space-y-4 md:space-y-0 text-white">
            <div>
               <h2 className="text-4xl font-bold tracking-tight mb-3 text-[#0f172a]">Loan Offers</h2>
               <p className="text-[#64748b] text-base">Personalized offers based on your score of <span className="font-bold text-blue-600">{score.toFixed(1)}</span></p>
            </div>
            <div className="text-left md:text-right">
               <span className="text-[10px] text-[#64748b] uppercase tracking-widest font-bold block mb-2">Maximum Potential Funding</span>
               <div className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-xl shadow-xl shadow-blue-500/30">
                 ₹ {maxLoanPrincipal.toLocaleString('en-IN', {maximumFractionDigits:0})}
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-6">
            {BANKS.map((bank, i) => (
               <BankCard key={i} index={i} bank={bank} score={score} maxLoanPrincipal={maxLoanPrincipal} setShowXAI={setShowXAI} />
            ))}
         </div>
      </div>
   );
};

export default function EnhancedDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const [mounted, setMounted] = useState(false);
  const [score, setScore] = useState(0);
  const [showXAI, setShowXAI] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  
  
  // Connect variables to our Java strategy pattern API (Values scaled for Indian Rupees)
  const [income, setIncome] = useState(1200000);
  const [debtAmount, setDebtAmount] = useState(450000);
  const [creditScore, setCreditScore] = useState(720);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [riskData, setRiskData] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExecuteLogic = async () => {
    setIsProcessing(true);
    setScore(0); // Reset liquid animation
    setShowXAI(false); // Reset AI panel
    
    try {
        const payload = {
            income: Number(income),
            debtAmount: Number(debtAmount),
            creditScore: Number(creditScore),
            strategyType: "WEIGHTED_AVG"
        };
        
        // Push payload to Node API Bridge -> Java Runtime
        const response = await evaluateRisk(payload);
        
        if (response.success) {
            const resultData = response.data;
            setRiskData(resultData);
            
            // Execute the spectacular physics animation after a tiny delay
            setTimeout(() => {
                setScore(resultData.calculatedScore);
                setShowXAI(true);
            }, 300);
        }
    } catch (err) {
        console.error("Transmission failed to Node/Java Core", err);
        alert(err.message || "Unable to connect to service. Please ensure the backend is running.");
    } finally {
        setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] overflow-x-hidden selection:bg-blue-500/20 font-sans pb-20">
      
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .rotate-x-180 { transform: rotateX(180deg); }
      `}} />

      {/* Subtle Background Accents */}
      <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/40 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/50 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/dashboard/customer')}>
          <Logo height="32" />
        </div>
        <div className="flex items-center space-x-4 sm:space-x-8 text-sm font-semibold text-[#64748b]">
          <button onClick={() => document.getElementById('overview').scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-600 transition-colors cursor-pointer hidden sm:block">Overview</button>
          <button onClick={() => document.getElementById('offers').scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-600 transition-colors cursor-pointer hidden sm:block">Marketplace</button>
          <button onClick={() => navigate('/dashboard/customer/loans')} className="bg-blue-50 text-blue-600 px-5 py-2 rounded-xl hover:bg-blue-100 transition-all cursor-pointer border border-blue-100 font-bold">
            Compare Loans
          </button>
          <div className="hidden sm:flex items-center space-x-2 mr-4">
            <Clock className="w-4 h-4 text-[#64748b]" />
            <span className="text-xs font-black text-[#0f172a] tracking-widest font-mono">
              {formattedTime} <span className="text-[9px] font-bold text-[#64748b]">IST</span>
            </span>
          </div>

          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
          
          {/* User Profile Section */}
          <div 
             onClick={() => setIsProfileOpen(true)}
             className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-1.5 px-3 rounded-xl transition-all"
          >
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200 group-hover:bg-blue-600 transition-colors shadow-inner">
                <span className="text-blue-600 font-bold text-xs uppercase group-hover:text-white">
                    {user?.first_name ? user.first_name.charAt(0) : (user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U')}
                </span>
             </div>
             <div className="hidden md:flex flex-col mr-2 text-left">
                <span className="text-[13px] font-black text-[#0f172a] leading-tight">
                    {user?.first_name || user?.user_metadata?.first_name || 'Customer'} {user?.last_name || user?.user_metadata?.last_name || ''}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-blue-600 font-bold">{user?.role || 'CUSTOMER'}</span>
             </div>
          </div>

          <button onClick={logout} className="text-[#64748b] hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all cursor-pointer font-bold flex items-center" title="Sign Out">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto pt-40 px-6">
        
        <style dangerouslySetInnerHTML={{__html: `
           .no-scrollbar::-webkit-scrollbar { display: none; }
           .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
           .custom-scrollbar::-webkit-scrollbar { width: 4px; }
           .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        `}} />

        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 text-center md:text-left flex flex-col justify-center">
          <h1 className="text-6xl font-black tracking-tighter text-[#0f172a] mb-4">
            Financial Dashboard.
          </h1>
          <p className="text-xl text-[#64748b] font-medium max-w-xl">
            A complete overview of your assets and liabilities, synchronized with our real-time matching system.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 scroll-mt-32" id="overview">
          
          {/* LEFT PANEL: Inputs */}
          <div className="lg:col-span-4 space-y-10">
            <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.2 }}
            >
              <FlipCard metrics={riskData} explanation={riskData?.explanation} income={income} debt={debtAmount} credit={creditScore} setShowXAI={setShowXAI} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
               <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden">
                   {isProcessing && (
                       <motion.div initial={{ opacity:0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-white/60 z-30 flex items-center justify-center backdrop-blur-sm">
                           <div className="flex flex-col items-center space-y-3">
                              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Analyzing...</span>
                           </div>
                       </motion.div>
                   )}
                   <div className="flex items-center space-x-2 mb-8">
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                      <span className="text-xs uppercase tracking-widest font-black text-[#0f172a]">Analysis Tool</span>
                   </div>
                   <div className="space-y-8">
                       <div>
                          <div className="flex justify-between text-[11px] font-bold mb-3"><span className="text-[#64748b] uppercase tracking-wider">Yearly Income</span><span className="text-blue-600">₹{Number(income).toLocaleString('en-IN')}</span></div>
                          <input type="range" min="300000" max="5000000" step="50000" value={income} onChange={e => setIncome(e.target.value)} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                       </div>
                       <div>
                          <div className="flex justify-between text-[11px] font-bold mb-3"><span className="text-[#64748b] uppercase tracking-wider">Outstanding Debt</span><span className="text-indigo-600">₹{Number(debtAmount).toLocaleString('en-IN')}</span></div>
                          <input type="range" min="0" max="2500000" step="10000" value={debtAmount} onChange={e => setDebtAmount(e.target.value)} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                       </div>
                       <div>
                          <div className="flex justify-between text-[11px] font-bold mb-3"><span className="text-[#64748b] uppercase tracking-wider">Credit Score</span><span className="text-blue-900">{creditScore}</span></div>
                          <input type="range" min="300" max="850" step="10" value={creditScore} onChange={e => setCreditScore(e.target.value)} className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-900" />
                       </div>
                       
                       <button onClick={handleExecuteLogic} disabled={isProcessing} className="w-full mt-4 py-5 bg-blue-600 text-white rounded-[1.5rem] font-bold uppercase tracking-widest text-[11px] hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center space-x-2">
                           <Activity className="w-4 h-4" />
                           <span>Update Analysis</span>
                       </button>
                   </div>
               </div>
            </motion.div>
          </div>

          {/* CENTER PANEL: Mirror/Meter */}
          <div className="lg:col-span-4 flex items-start justify-center pt-8">
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }} 
                transition={{ delay: 0.4 }} 
                className="relative"
            >
              <div className="absolute inset-0 bg-blue-400/5 blur-[100px] rounded-full" />
              <LiquidMeter score={score} />
            </motion.div>
          </div>

          {/* RIGHT PANEL: Stats */}
          <div className="lg:col-span-4 flex flex-col space-y-10">
            <div className="glass-card rounded-[2.5rem] p-8 flex flex-col items-center justify-center min-h-[400px] overflow-hidden relative group">
               <span className="text-[10px] uppercase tracking-widest text-[#64748b] font-bold mb-8 text-center w-full block">Live Interaction Rings</span>
               <div className="relative w-full flex items-center justify-center scale-90 md:scale-100 transition-transform duration-500 group-hover:scale-[1.05]">
                  <OrbitalRings score={score} />
               </div>
            </div>
            
            <RiskTimelineGraph score={score} />
          </div>
          
        </div>

        {/* Full Width AI Improvements Protocol */}
        <AnimatePresence>
            {showXAI && (
                <motion.div 
                    initial={{ opacity: 0, height: 0, y: 20 }} 
                    animate={{ opacity: 1, height: 'auto', y: 0 }} 
                    exit={{ opacity: 0, height: 0, y: 20 }}
                    className="overflow-hidden mt-10"
                >
                    <div className="glass-card p-10 rounded-[3rem] border border-blue-100 shadow-xl shadow-blue-500/5 relative">
                        <div className="absolute top-0 right-10 w-64 h-64 bg-blue-400/5 blur-[50px] pointer-events-none" />
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-2xl border border-blue-100 relative shadow-[inset_0_2px_10px_rgba(37,99,235,0.1)]">
                               <Activity className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                               <h3 className="text-2xl font-bold tracking-tight text-[#0f172a]">AI Improvement Protocol</h3>
                               <span className="text-[10px] font-black text-[#64748b] uppercase tracking-widest block mt-1">Real-time Live Diagnostic</span>
                            </div>
                        </div>
                        <XAIImprovementProtocol score={score} income={income} debtAmount={debtAmount} creditScore={creditScore} />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

         {/* Methodology Section */}
         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-24 border-t border-gray-100 pt-20">
            <div className="flex justify-between items-end mb-10">
               <div>
                  <h2 className="text-3xl font-bold tracking-tight text-[#0f172a]">How your score is calculated</h2>
                   <p className="text-[#64748b] mt-1">A simple breakdown of your core financial metrics.</p>
               </div>
               <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                  <Activity className="w-3.5 h-3.5" />
                  <span>AI Analysis Active</span>
               </div>
            </div>

            <div className="glass-card rounded-[3rem] p-10 flex flex-col items-stretch relative mb-16 overflow-hidden">
               {/* Visual Bar Grid */}
               <div className="h-64 flex items-end justify-around relative mb-4">
                  <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-40">
                     <div className="border-b border-gray-100 w-full" />
                     <div className="border-b border-gray-100 w-full" />
                     <div className="border-b border-gray-100 w-full" />
                  </div>

                  {[ 
                     {h: `${Math.min(100, (debtAmount/(income||1))*100*2.5)}%`, c:'bg-blue-600', val: `${(debtAmount/(income||1)*100).toFixed(0)}%`, lbl: "Debt Ratio"}, 
                     {h: `${Math.min(100, ((creditScore-300)/550)*100)}%`, c:'bg-indigo-600', val: creditScore, lbl: "Credit Health"}, 
                     {h: `${Math.min(100, score > 0 ? score : 20)}%`, c:'bg-blue-400', val: score.toFixed(0), lbl: "Overall Rating" } 
                  ].map((bar, i) => (
                    <div key={i} className="flex flex-col items-center group relative z-10 w-24 h-full justify-end">
                       <motion.div 
                         initial={{ height: 0 }} 
                         animate={{ height: bar.h }} 
                         transition={{ duration: 1, ease: "circOut" }}
                         className={`w-16 ${bar.c} rounded-2xl shadow-2xl relative origin-bottom group-hover:scale-x-105 transition-transform`}
                       >
                         <div className="absolute top-[-30px] w-full text-center font-bold text-[#0f172a] opacity-0 group-hover:opacity-100 transition-opacity">{bar.val}</div>
                       </motion.div>
                       <span className="mt-6 font-bold text-[10px] uppercase tracking-widest text-[#64748b]">{bar.lbl}</span>
                    </div>
                  ))}
               </div>
            </div>
         </motion.div>

         {/* Bank Marketplace Section */}
         <BankMarketplace score={score} income={income} debtAmount={debtAmount} setShowXAI={setShowXAI} />

      </main>

      {/* Floating AI Assistant */}
      <AryaAI score={score} creditScore={creditScore} income={income} debtAmount={debtAmount} />

      {/* User Profile Slide-in Panel */}
      <UserProfilePanel 
         isOpen={isProfileOpen} 
         onClose={() => setIsProfileOpen(false)} 
         user={user} 
         logout={logout} 
      />
    </div>
  );
}
