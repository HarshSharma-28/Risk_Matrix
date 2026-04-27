import React from 'react';

export const SBILogo = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full rounded-xl overflow-hidden shadow-md">
    <rect width="100%" height="100%" fill="white"/>
    <circle cx="50" cy="50" r="43" fill="#0064b2" />
    <circle cx="50" cy="45" r="14" fill="white" />
    <rect x="44" y="47" width="12" height="60" fill="white" />
  </svg>
);

export const HDFCLogo = () => (
  <div className="w-full h-full bg-[#00416D] rounded-xl flex items-center justify-center font-bold text-[10px] text-white tracking-wider relative overflow-hidden shadow-md">
     <div className="absolute inset-1.5 border-4 border-[#ED232A]"></div>
     HDFC
  </div>
);

export const ICICILogo = () => (
   <div className="w-full h-full bg-white rounded-xl flex items-center justify-center font-black italic text-[#F26522] tracking-tighter text-sm border-2 border-[#F26522] shadow-md shadow-[#F26522]/10">
      ICICI
   </div>
);

export const AxisLogo = () => (
   <div className="w-full h-full bg-white rounded-xl flex items-center pl-4 font-bold text-[#861F41] uppercase tracking-tighter text-xs relative border border-gray-200 shadow-md">
      <div className="absolute left-1.5 top-3 bottom-3 w-1.5 bg-[#861F41] rotate-12"></div>
      AXIS
   </div>
);

export const BajajLogo = () => (
   <div className="w-full h-full bg-[#005CB0] rounded-xl flex items-center justify-center font-extrabold text-white text-[10px] italic shadow-md border border-white/10">
      BAJAJ
   </div>
);

export const BANKS = [
    { 
        id: 'hdfc',
        name: "HDFC Bank", 
        type: "Private Sector", 
        Logo: HDFCLogo,
        products: {
            personal: { baseRate: 8.7, threshold: 50, multiplier: 0.08, url: 'https://www.hdfcbank.com/personal/borrow/popular-loans/personal-loan' },
            home: { baseRate: 6.9, threshold: 65, multiplier: 0.04, url: 'https://www.hdfcbank.com/personal/borrow/popular-loans/home-loan' },
            auto: { baseRate: 7.8, threshold: 55, multiplier: 0.06, url: 'https://www.hdfcbank.com/personal/borrow/popular-loans/new-car-loan' },
            education: { baseRate: 9.5, threshold: 45, multiplier: 0.09, url: 'https://www.hdfcbank.com/personal/borrow/popular-loans/educational-loan' }
        }
    },
    { 
        id: 'sbi',
        name: "State Bank of India", 
        type: "Public Sector", 
        Logo: SBILogo,
        products: {
            personal: { baseRate: 8.4, threshold: 60, multiplier: 0.05, url: 'https://sbi.co.in/web/personal-banking/loans/personal-loans' },
            home: { baseRate: 6.7, threshold: 70, multiplier: 0.03, url: 'https://sbi.co.in/web/personal-banking/loans/home-loans' },
            auto: { baseRate: 7.7, threshold: 60, multiplier: 0.05, url: 'https://sbi.co.in/web/personal-banking/loans/auto-loans' },
            education: { baseRate: 9.2, threshold: 50, multiplier: 0.07, url: 'https://sbi.co.in/web/personal-banking/loans/education-loans' }
        }
    },
    { 
        id: 'icici',
        name: "ICICI Bank", 
        type: "Private Sector", 
        Logo: ICICILogo,
        products: {
            personal: { baseRate: 8.9, threshold: 45, multiplier: 0.09, url: 'https://www.icicibank.com/personal-banking/loans/personal-loan' },
            home: { baseRate: 7.0, threshold: 60, multiplier: 0.05, url: 'https://www.icicibank.com/personal-banking/loans/home-loan' },
            auto: { baseRate: 8.0, threshold: 55, multiplier: 0.07, url: 'https://www.icicibank.com/personal-banking/loans/car-loan' },
            education: { baseRate: 9.8, threshold: 40, multiplier: 0.10, url: 'https://www.icicibank.com/personal-banking/loans/education-loan' }
        }
    },
    { 
        id: 'axis',
        name: "Axis Bank", 
        type: "Private Sector", 
        Logo: AxisLogo,
        products: {
            personal: { baseRate: 9.1, threshold: 30, multiplier: 0.11, url: 'https://www.axisbank.com/retail/loans/personal-loan' },
            home: { baseRate: 7.2, threshold: 55, multiplier: 0.06, url: 'https://www.axisbank.com/retail/loans/home-loan' },
            auto: { baseRate: 8.2, threshold: 50, multiplier: 0.08, url: 'https://www.axisbank.com/retail/loans/car-loan' },
            education: { baseRate: 10.1, threshold: 35, multiplier: 0.12, url: 'https://www.axisbank.com/retail/loans/education-loan' }
        }
    },
    { 
        id: 'bajaj',
        name: "Bajaj Finserv", 
        type: "NBFC", 
        Logo: BajajLogo,
        products: {
            personal: { baseRate: 11.5, threshold: 0, multiplier: 0.20, url: 'https://www.bajajfinserv.in/personal-loan' },
            home: { baseRate: 8.5, threshold: 40, multiplier: 0.10, url: 'https://www.bajajfinserv.in/home-loan' },
            auto: { baseRate: 9.5, threshold: 30, multiplier: 0.15, url: 'https://www.bajajfinserv.in/two-three-wheeler-loan' },
            education: { baseRate: 12.0, threshold: 0, multiplier: 0.25, url: 'https://www.bajajfinserv.in/education-loan' }
        }
    }
];
