import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Settings, Zap } from 'lucide-react';

const ActionDock = ({ onNewAssessment, onSearch, onReports, onSettings, onQuickRisk }) => {
  const actions = [
    { icon: <Plus className="w-5 h-5" />,     label: 'New Assessment',  primary: true,  onClick: onNewAssessment },
    { icon: <Search className="w-5 h-5" />,   label: 'Search Customer', primary: false, onClick: onSearch       },
    { icon: <FileText className="w-5 h-5" />, label: 'View Reports',    primary: false, onClick: onReports      },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings',        primary: false, onClick: onSettings     },
  ];

  return (
    <div className="fixed bottom-10 right-8 z-50">
      <div className="bg-white/90 backdrop-blur-xl border border-[#E5E7EB] p-2 rounded-2xl flex items-center space-x-2 shadow-lg shadow-indigo-100/60">
        {actions.map((action, idx) => (
          <motion.button
            key={idx}
            onClick={action.onClick}
            whileHover={{ y: -3, scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            title={action.label}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all group relative
              ${action.primary
                ? 'bg-[#4F46E5] text-white shadow-md shadow-indigo-200'
                : 'bg-[#F0F4FF] text-[#6B7280] hover:bg-[#4F46E5]/10 hover:text-[#4F46E5]'
              }`}
          >
            {action.icon}
            {/* Tooltip */}
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <div className="bg-[#0F172A] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                {action.label}
              </div>
              <div className="w-2 h-2 bg-[#0F172A] rotate-45 mx-auto -mt-1" />
            </div>
          </motion.button>
        ))}

        <div className="w-[1px] h-7 bg-[#E5E7EB] mx-1" />

        <motion.button
          whileHover={{ y: -3, scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          title="Quick Risk Check"
          onClick={onQuickRisk}
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#4F46E5] to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-200 hover:shadow-indigo-300 transition-all group relative"
        >
          <Zap className="w-5 h-5" />
          <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            <div className="bg-[#0F172A] text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
              Quick Risk Check
            </div>
            <div className="w-2 h-2 bg-[#0F172A] rotate-45 mx-auto -mt-1" />
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default ActionDock;
