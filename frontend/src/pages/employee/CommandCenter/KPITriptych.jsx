import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { TrendingUp, CheckCircle2, Zap } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip);

const KPITriptych = () => {
  const sparklineData = {
    labels: ['', '', '', '', '', '', ''],
    datasets: [{
      data: [12, 19, 15, 22, 18, 25, 32],
      borderColor: '#4F46E5',
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(79,70,229,0.08)',
    }]
  };

  const meterData = {
    datasets: [{
      data: [84, 16],
      backgroundColor: ['#4F46E5', '#E5E7EB'],
      borderWidth: 0,
      circumference: 240,
      rotation: 240,
      cutout: '85%',
    }]
  };

  const cardClass = "bg-white p-8 rounded-[1.5rem] border border-[#E5E7EB] shadow-sm";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Assessments */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cardClass}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">Assessments Today</span>
          <TrendingUp className="w-4 h-4 text-[#4F46E5]" />
        </div>
        <h4 className="text-4xl font-black text-[#0F172A] tracking-tight mb-1">1,284</h4>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#4F46E5]">Risk Profiles Reviewed</p>
        <div className="h-14 w-full mt-6">
          <Line
            data={sparklineData}
            options={{
              maintainAspectRatio: false,
              scales: { x: { display: false }, y: { display: false } },
              plugins: { legend: { display: false } }
            }}
          />
        </div>
      </motion.div>

      {/* Approval Rate */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${cardClass} flex flex-col items-center justify-center`}
      >
        <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] self-start mb-4">Approval Rate</span>
        <div className="w-28 h-28 relative mb-2">
          <Doughnut
            data={meterData}
            options={{ maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-4">
            <span className="text-3xl font-black text-[#4F46E5]">84%</span>
            <span className="text-[8px] font-bold uppercase text-[#6B7280] tracking-widest">Rate</span>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 mt-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Approval Target Met</p>
        </div>
      </motion.div>

      {/* Avg Risk Score */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cardClass}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">Avg. Risk Score</span>
          <span className="px-2 py-1 rounded-md bg-red-50 border border-red-100 text-[9px] font-bold text-red-500 uppercase tracking-wide">
            +4.2% vs yesterday
          </span>
        </div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h4 className="text-5xl font-black text-[#0F172A] tracking-tight">42.8</h4>
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#4F46E5] mt-1">Portfolio Average</p>
          </div>
          <Zap className="w-8 h-8 text-[#4F46E5] opacity-20" />
        </div>
        <div className="w-full h-1.5 bg-[#F0F4FF] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '42.8%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-[#4F46E5] rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default KPITriptych;
