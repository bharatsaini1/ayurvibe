'use client';

import React from 'react';
import {
  Users,
  Clock,
  HeartPulse,
  Flame,
  ArrowRight,
  TrendingUp,
  FileText,
  Activity,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { Patient, DietPlan } from '@/lib/types/ayurveda';
import { NavTab } from '../layout/Sidebar';

interface OverviewDashboardProps {
  currentPatient: Patient;
  patients: Patient[];
  activeDietPlan: DietPlan;
  onNavigate: (tab: NavTab) => void;
  onSelectPatient: (patient: Patient) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  currentPatient,
  patients,
  activeDietPlan,
  onNavigate,
  onSelectPatient,
}) => {
  // Compute Dosha counts
  const vataCount = patients.filter((p) => p.prakritiPrimary === 'vata').length;
  const pittaCount = patients.filter((p) => p.prakritiPrimary === 'pitta').length;
  const kaphaCount = patients.filter((p) => p.prakritiPrimary === 'kapha').length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Clinical Practice Suite &bull; Poornima Engineering Research Project</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            Ayurvedic Practice & Nutrient Intelligence Dashboard
          </h1>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Streamlining constitutional dietetics by uniting ICMR-NIN IFCT 2017 nutritional precision with classical Dosha & Agni diagnostics.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('assessment')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5"
          >
            <HeartPulse className="w-4 h-4" />
            <span>New Assessment</span>
          </button>
          <button
            onClick={() => onNavigate('diet-planner')}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Build Diet Chart</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Active Patients</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{patients.length} Registered</div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> 100% cloud encrypted
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Avg. Chart Prep Time</span>
            <div className="text-2xl font-extrabold text-indigo-600 mt-1">7.5 mins</div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center mt-1">
              <CheckCircle2 className="w-3 h-3 mr-1" /> 78% faster than manual
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Agni Normalization</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">84.2%</div>
            <span className="text-[11px] text-indigo-600 font-medium flex items-center mt-1">
              Based on follow-up logs
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">IFCT Foods Indexed</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">528 Foods</div>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center mt-1">
              ICMR-NIN 2017 Dataset
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Active Patient Focus & Dosha Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Patient Focus */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Patient Case Study</span>
              <h2 className="text-lg font-bold text-slate-900 mt-0.5">{currentPatient.name}</h2>
              <p className="text-xs text-slate-500">
                {currentPatient.age} yrs &bull; {currentPatient.gender} &bull; Phone: {currentPatient.phone}
              </p>
            </div>
            <button
              onClick={() => onNavigate('diet-planner')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>View Diet Plan</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Primary Dosha</span>
              <span className="text-sm font-bold uppercase text-indigo-700">
                {currentPatient.prakritiPrimary}
              </span>
              {currentPatient.prakritiSecondary && (
                <span className="text-[10px] text-slate-500 block">
                  Secondary: {currentPatient.prakritiSecondary.toUpperCase()}
                </span>
              )}
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Digestive Fire (Agni)</span>
              <span className="text-sm font-bold uppercase text-amber-700">
                {currentPatient.currentAgni} Agni
              </span>
              <span className="text-[10px] text-slate-500 block">Metabolic State</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Bowel Motility</span>
              <span className="text-sm font-bold uppercase text-emerald-700">
                {currentPatient.koshtha}
              </span>
              <span className="text-[10px] text-slate-500 block">Koshtha</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] text-slate-500 block">BMI & Weight</span>
              <span className="text-sm font-bold text-slate-900">
                {currentPatient.bmi} BMI
              </span>
              <span className="text-[10px] text-slate-500 block">{currentPatient.weightKg} kg / {currentPatient.heightCm} cm</span>
            </div>
          </div>

          {/* Active Health Concerns */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-2">Clinical Assessment Notes:</span>
            <div className="flex flex-wrap gap-2">
              {currentPatient.healthConcerns.map((concern, idx) => (
                <span
                  key={idx}
                  className="bg-amber-50 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-lg text-xs font-medium"
                >
                  &bull; {concern}
                </span>
              ))}
            </div>
          </div>

          {/* Active Assigned Diet Plan Snippet */}
          <div className="bg-gradient-to-r from-emerald-50/60 to-indigo-50/60 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-emerald-800">Current Assigned Protocol</span>
              <h3 className="text-sm font-bold text-slate-900">{activeDietPlan.planTitle}</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Target: {activeDietPlan.targetCalories} kcal &bull; Season: {activeDietPlan.season}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onNavigate('export')}
                className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              >
                Print PDF
              </button>
              <button
                onClick={() => onNavigate('whatsapp')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1"
              >
                <span>Send WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Patient Dosha Distribution & Queue */}
        <div className="space-y-6">
          {/* Practice Dosha Distribution */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Clinic Prakriti Distribution</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-blue-600">Vata Predominant</span>
                  <span className="text-slate-700">{vataCount} patients ({Math.round((vataCount / patients.length) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-500 h-2.5 rounded-full"
                    style={{ width: `${(vataCount / patients.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-600">Pitta Predominant</span>
                  <span className="text-slate-700">{pittaCount} patients ({Math.round((pittaCount / patients.length) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-2.5 rounded-full"
                    style={{ width: `${(pittaCount / patients.length) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-600">Kapha Predominant</span>
                  <span className="text-slate-700">{kaphaCount} patients ({Math.round((kaphaCount / patients.length) * 100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full"
                    style={{ width: `${(kaphaCount / patients.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Patient Directory Quick Switcher */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Registered Patients</h3>
              <span className="text-xs text-indigo-600 font-semibold">{patients.length} Total</span>
            </div>
            <div className="space-y-2">
              {patients.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPatient(p)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-center justify-between ${
                    p.id === currentPatient.id
                      ? 'border-indigo-600 bg-indigo-50/50 font-bold text-indigo-950'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-semibold block">{p.name}</span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {p.gender}, {p.age}y &bull; {p.phone}
                    </span>
                  </div>
                  <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200">
                    {p.prakritiPrimary}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

