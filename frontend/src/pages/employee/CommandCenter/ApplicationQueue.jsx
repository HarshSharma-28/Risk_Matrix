import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ShieldAlert, ChevronRight, Activity, RefreshCw } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';

// Dummy data shown when DB has nothing yet
const DUMMY_APPLICATIONS = [
  {
    id: 'dummy-0001-0001-0001-000000000001',
    users: { first_name: 'Amit', last_name: 'Sharma', email: 'amit.sharma@email.com' },
    assessment_date: new Date(Date.now() - 15 * 60000).toISOString(),
    decision: null,
    fraud_flag: false,
    risk_score: 62,
    _isDummy: true,
  },
  {
    id: 'dummy-0002-0002-0002-000000000002',
    users: { first_name: 'Priya', last_name: 'Mehta', email: 'priya.mehta@email.com' },
    assessment_date: new Date(Date.now() - 45 * 60000).toISOString(),
    decision: 'APPROVE',
    fraud_flag: false,
    risk_score: 78,
    _isDummy: true,
  },
  {
    id: 'dummy-0003-0003-0003-000000000003',
    users: { first_name: 'Rahul', last_name: 'Gupta', email: 'rahul.g@email.com' },
    assessment_date: new Date(Date.now() - 120 * 60000).toISOString(),
    decision: null,
    fraud_flag: true,
    risk_score: 31,
    _isDummy: true,
  },
  {
    id: 'dummy-0004-0004-0004-000000000004',
    users: { first_name: 'Sneha', last_name: 'Patel', email: 'sneha.p@email.com' },
    assessment_date: new Date(Date.now() - 5 * 60000).toISOString(),
    decision: 'REVIEW',
    fraud_flag: false,
    risk_score: 55,
    _isDummy: true,
  },
  {
    id: 'dummy-0005-0005-0005-000000000005',
    users: { first_name: 'Vikram', last_name: 'Singh', email: 'vikram.s@email.com' },
    assessment_date: new Date(Date.now() - 200 * 60000).toISOString(),
    decision: 'REJECT',
    fraud_flag: false,
    risk_score: 22,
    _isDummy: true,
  },
];

const ApplicationQueue = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDummy, setIsDummy] = useState(false);

  useEffect(() => {
    fetchApplications();

    const channel = supabase
      .channel('risk_queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'risk_assessments' }, () => {
        fetchApplications();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('risk_assessments')
        .select(`*, users:customer_id (id, first_name, last_name, email)`)
        .order('assessment_date', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (data && data.length > 0) {
        setApplications(data);
        setIsDummy(false);
      } else {
        // No real data — show dummy applications
        setApplications(DUMMY_APPLICATIONS);
        setIsDummy(true);
      }
    } catch (err) {
      console.error('Application queue error:', err);
      setApplications(DUMMY_APPLICATIONS);
      setIsDummy(true);
    } finally {
      setLoading(false);
    }
  };

  const getWaitTime = (timestamp) => {
    const diff = new Date() - new Date(timestamp);
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  const getDecisionLabel = (d) => {
    if (d === 'APPROVE') return 'Approved';
    if (d === 'REJECT') return 'Rejected';
    if (d === 'REVIEW') return 'Under Review';
    return 'Pending';
  };

  const getDecisionStyle = (d) => {
    if (d === 'APPROVE') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (d === 'REJECT') return 'bg-red-50 text-red-500 border-red-100';
    if (d === 'REVIEW') return 'bg-blue-50 text-blue-500 border-blue-100';
    return 'bg-amber-50 text-amber-600 border-amber-100';
  };

  const pendingCount = applications.filter(a => !a.decision).length;

  return (
    <div className="bg-white rounded-[1.5rem] border border-[#E5E7EB] overflow-hidden flex flex-col h-[500px] shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#4F46E5]" />
          <h3 className="text-[12px] font-black uppercase tracking-widest text-[#0F172A]">Pending Applications</h3>
          {isDummy && (
            <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
              Sample Data
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-[11px] font-bold text-[#6B7280]">
            <span className="text-[#4F46E5] font-black">{pendingCount}</span> pending · {applications.length} total
          </span>
          <button
            onClick={fetchApplications}
            title="Refresh"
            className="w-7 h-7 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:bg-[#4F46E5]/10 hover:text-[#4F46E5] hover:border-[#4F46E5]/30 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Column Labels */}
      <div className="px-6 py-2 flex items-center justify-between border-b border-[#F1F5F9]">
        <span className="text-[9px] font-black uppercase tracking-widest text-[#94A3B8]">Applicant</span>
        <div className="flex items-center space-x-12 pr-8">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#94A3B8]">Submitted</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#94A3B8]">Status</span>
        </div>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="h-full flex items-center justify-center flex-col space-y-3">
            <div className="w-7 h-7 border-2 border-[#4F46E5]/20 border-t-[#4F46E5] rounded-full animate-spin" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">Loading Applications...</span>
          </div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence mode="popLayout">
              {applications.map((app) => (
                <motion.div
                  key={app.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="group p-4 rounded-xl flex items-center justify-between transition-all hover:bg-[#F0F4FF] border border-transparent hover:border-[#E0E7FF] cursor-pointer"
                >
                  {/* Avatar + name */}
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-[#4F46E5]/10 border border-[#4F46E5]/20 flex items-center justify-center text-[#4F46E5] font-black text-xs">
                      {app.users?.first_name?.[0]}{app.users?.last_name?.[0] || '?'}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[13px] font-semibold text-[#0F172A]">
                          {app.users?.first_name} {app.users?.last_name}
                        </span>
                        {app.fraud_flag && (
                          <span className="flex items-center space-x-1 text-red-500 text-[9px] font-bold bg-red-50 px-1.5 py-0.5 rounded">
                            <ShieldAlert className="w-2.5 h-2.5" />
                            <span>Fraud Flag</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#94A3B8] font-mono">
                        ID: {app.id.substring(0, 8).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Time + Status */}
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="flex items-center justify-end space-x-1.5 mb-1">
                        <Clock className="w-3 h-3 text-[#94A3B8]" />
                        <span className="text-[10px] font-semibold text-[#6B7280]">
                          {getWaitTime(app.assessment_date)}
                        </span>
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border tracking-wide ${getDecisionStyle(app.decision)}`}>
                        {getDecisionLabel(app.decision)}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#CBD5E1] group-hover:text-[#4F46E5] transition-colors" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationQueue;
