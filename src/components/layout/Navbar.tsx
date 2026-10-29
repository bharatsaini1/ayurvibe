'use client';

import React from 'react';
import { Sparkles, Calendar, UserCheck, ShieldCheck } from 'lucide-react';
import { Patient } from '@/lib/types/ayurveda';

interface NavbarProps {
  currentPatient: Patient;
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  activeSeason: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPatient,
  patients,
  onSelectPatient,
  activeSeason,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white font-bold shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg bg-gradient-to-r from-emerald-600 via-indigo-600 to-rose-500 bg-clip-text text-transparent tracking-tight">AyurVibe</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-semibold">
                Gen-Z Dietetics
              </span>
            </div>
            <p className="text-xs text-slate-500">Bio-Individual Ayurveda &bull; ICMR-NIN IFCT 2017</p>
          </div>
        </div>

        {/* Center: Season & Clinical Info */}
        <div className="hidden md:flex items-center space-x-4 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-lg text-xs">
          <div className="flex items-center space-x-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span className="font-medium">Active Ritucharya:</span>
            <span className="font-semibold text-slate-900">{activeSeason}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center space-x-1 text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-medium">Tenant Verified (Dr. Solanki Clinic)</span>
          </div>
        </div>

        {/* Right: Active Patient Selector */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5">
            <UserCheck className="w-4 h-4 text-indigo-700" />
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider block">Active Patient</span>
              <select
                aria-label="Select Active Patient"
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer"
                value={currentPatient.id}
                onChange={(e) => {
                  const p = patients.find((item) => item.id === e.target.value);
                  if (p) onSelectPatient(p);
                }}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.prakritiPrimary.toUpperCase()} &bull; {p.currentAgni.toUpperCase()} AGNI)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

