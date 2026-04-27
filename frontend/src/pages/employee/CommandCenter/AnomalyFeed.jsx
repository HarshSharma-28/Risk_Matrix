import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

const ActivityFeed = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();

    const channel = supabase
      .channel('activity_feed')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'audit_logs'
      }, (payload) => {
        setLogs(prev => [payload.new, ...prev].slice(0, 10));
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchLogs = async () => {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(10);
    if (data) setLogs(data);
  };

  const formatAction = (type) => {
    if (!type) return 'System Event';
    return type
      .replace(/_/g, ' ')
      .replace('FRAUD', '⚠️ Fraud Flag')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-white border-t border-[#E5E7EB] flex items-center overflow-hidden z-40 shadow-sm">
      {/* Label */}
      <div className="flex items-center space-x-2 bg-[#4F46E5]/5 h-full px-4 border-r border-[#E5E7EB] shrink-0">
        <Activity className="w-3.5 h-3.5 text-[#4F46E5]" />
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4F46E5] whitespace-nowrap">Live Activity</span>
      </div>

      {/* Scrolling log */}
      <div className="flex-1 overflow-hidden relative">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex items-center space-x-12 whitespace-nowrap pl-8"
        >
          {logs.length > 0 ? logs.map((log) => (
            <div key={log.id} className="flex items-center space-x-3">
              <span className="text-[10px] font-mono text-[#94A3B8]">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className={`text-[10px] font-semibold ${log.action_type?.includes('FRAUD') ? 'text-red-500' : 'text-[#4F46E5]'}`}>
                {formatAction(log.action_type)}
              </span>
            </div>
          )) : (
            <div className="flex items-center space-x-3">
              <span className="text-[10px] font-mono text-[#CBD5E1]">No recent activity — system running normally.</span>
              <span className="text-[10px] font-semibold text-emerald-500">All Systems Normal</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Live dot */}
      <div className="h-full px-5 flex items-center border-l border-[#E5E7EB] shrink-0">
        <div className="flex items-center space-x-1.5">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest">Live</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
