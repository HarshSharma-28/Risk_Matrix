import React from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

const WrongPortal = ({ currentRole, onSwitch }) => {
  // Determine user's ACTUAL correct portal based on their role
  const isStaff = currentRole === 'employee' || currentRole === 'admin';
  const correctPortalName  = isStaff ? 'Staff Command Center' : 'Customer Portal';
  const correctPortalRoute = isStaff ? '/command-center' : '/dashboard/customer';
  const incorrectPortalName = isStaff ? 'Customer Portal' : 'Staff Command Center';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F4FF] font-sans p-6 text-[#0F172A]">
      <div className="max-w-md w-full bg-white border border-[#E2E8F0] p-10 rounded-[12px] text-center shadow-sm">
        <div className="w-16 h-16 bg-[#EF4444]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#EF4444]/20">
          <ShieldAlert className="w-8 h-8 text-[#EF4444]" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Access Restricted
        </h2>

        <p className="text-[#64748B] mb-2 text-sm leading-relaxed">
          Your authenticated account does not have permission to access the <strong>{incorrectPortalName}</strong>.
        </p>
        <p className="text-[#64748B] mb-8 text-sm">
          You are registered as: <span className="font-bold text-[#0F172A] capitalize">{currentRole}</span>
        </p>

        <div className="space-y-3">
          {/* Go to MY correct portal */}
          <button
            onClick={() => window.location.href = correctPortalRoute}
            className="w-full py-4 bg-[#4F46E5] text-white rounded-[8px] font-bold text-xs uppercase tracking-widest hover:bg-[#4338CA] transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Go to {correctPortalName}</span>
          </button>

          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.href = '/login';
            }}
            className="w-full py-2 bg-transparent text-[#64748B] hover:text-[#0F172A] font-bold text-[11px] uppercase tracking-wider transition-colors"
          >
            Sign out & Return to Login
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
          <span className="text-[10px] font-mono text-[#94A3B8] tracking-widest uppercase">
            SECURITY_PROTOCOL_REV_4.2
          </span>
        </div>
      </div>
    </div>
  );
};

export default WrongPortal;
