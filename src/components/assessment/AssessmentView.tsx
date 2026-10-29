'use client';

import React, { useState } from 'react';
import { PRAKRITI_QUESTIONS, calculatePrakritiScore } from '@/lib/ayurveda/prakriti-engine';
import { Patient, PrakritiScore } from '@/lib/types/ayurveda';
import { HeartPulse, Check, Sparkles, RefreshCw, Flame, ArrowRight } from 'lucide-react';

interface AssessmentViewProps {
  currentPatient: Patient;
  onUpdatePatientDosha: (patientId: string, score: PrakritiScore) => void;
  onNavigateToDietPlanner: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  currentPatient,
  onUpdatePatientDosha,
  onNavigateToDietPlanner,
}) => {
  // Pre-fill answers based on current patient primary dosha if available
  const [answers, setAnswers] = useState<Record<number, 'vata' | 'pitta' | 'kapha'>>({
    1: currentPatient.prakritiPrimary === 'vata' ? 'vata' : currentPatient.prakritiPrimary === 'pitta' ? 'pitta' : 'kapha',
    2: currentPatient.prakritiPrimary === 'vata' ? 'vata' : currentPatient.prakritiPrimary === 'pitta' ? 'pitta' : 'kapha',
    6: currentPatient.currentAgni === 'visham' ? 'vata' : currentPatient.currentAgni === 'tikshna' ? 'pitta' : 'kapha',
  });

  const [activeCategory, setActiveCategory] = useState<'All' | 'Physical' | 'Physiological' | 'Psychological'>('All');

  const filteredQuestions = activeCategory === 'All'
    ? PRAKRITI_QUESTIONS
    : PRAKRITI_QUESTIONS.filter((q) => q.category === activeCategory);

  const score = calculatePrakritiScore(answers);
  const totalAnswered = Object.keys(answers).length;

  const handleSelect = (questionId: number, dosha: 'vata' | 'pitta' | 'kapha') => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: dosha,
    }));
  };

  const handleApplyToPatient = () => {
    onUpdatePatientDosha(currentPatient.id, score);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <HeartPulse className="w-4 h-4" />
            <span>Prakriti & Agni Clinical Assessment Engine</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Constitutional Diagnosis: {currentPatient.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate physical attributes, metabolic fire (Agni), and neuro-psychological tendencies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAnswers({})}
            className="text-xs text-slate-600 hover:text-slate-900 border border-slate-300 px-3 py-1.5 rounded-lg flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Answers</span>
          </button>
          <button
            onClick={handleApplyToPatient}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs"
          >
            <Check className="w-4 h-4" />
            <span>Save to Patient Profile</span>
          </button>
        </div>
      </div>

      {/* Real-Time Scoring Gauge Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Vata Gauge */}
        <div className="bg-white p-4 rounded-xl border border-blue-200/80 shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-blue-700 uppercase">Vata (Ether + Air)</span>
            <span className="text-lg font-black text-blue-800">{score.vataPercentage}%</span>
          </div>
          <div className="w-full bg-blue-50 h-3 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${score.vataPercentage}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Catabolic / Movement / Nervous</span>
        </div>

        {/* Pitta Gauge */}
        <div className="bg-white p-4 rounded-xl border border-rose-200/80 shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-rose-700 uppercase">Pitta (Fire + Water)</span>
            <span className="text-lg font-black text-rose-800">{score.pittaPercentage}%</span>
          </div>
          <div className="w-full bg-rose-50 h-3 rounded-full overflow-hidden">
            <div className="bg-rose-600 h-3 rounded-full transition-all" style={{ width: `${score.pittaPercentage}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Metabolism / Digestion / Heat</span>
        </div>

        {/* Kapha Gauge */}
        <div className="bg-white p-4 rounded-xl border border-emerald-200/80 shadow-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase">Kapha (Water + Earth)</span>
            <span className="text-lg font-black text-emerald-800">{score.kaphaPercentage}%</span>
          </div>
          <div className="w-full bg-emerald-50 h-3 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-3 rounded-full transition-all" style={{ width: `${score.kaphaPercentage}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Anabolic / Structure / Immunity</span>
        </div>

        {/* Diagnosed Agni State */}
        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-amber-800 font-bold text-xs uppercase mb-1">
              <Flame className="w-4 h-4 text-amber-600" />
              <span>Diagnosed Agni</span>
            </div>
            <span className="text-base font-black text-amber-950 uppercase">
              {score.agniType} Agni
            </span>
          </div>
          <span className="text-[11px] text-amber-900 mt-1">
            {score.agniType === 'visham' && 'Irregular appetite prone to gas and bloating.'}
            {score.agniType === 'tikshna' && 'Hyperactive fire prone to acidity and ulcers.'}
            {score.agniType === 'manda' && 'Slow sluggish fire prone to heaviness.'}
            {score.agniType === 'sama' && 'Balanced and optimal digestive metabolism.'}
          </span>
        </div>
      </div>

      {/* Recommendations & Next Step Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 p-5 rounded-2xl border border-indigo-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Clinical Dietetic Guidance for {score.primaryDosha.toUpperCase()}</span>
          </span>
          <ul className="text-xs text-slate-700 mt-2 space-y-1 list-disc list-inside">
            {score.recommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
        <button
          onClick={onNavigateToDietPlanner}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl whitespace-nowrap flex items-center space-x-1.5 shadow-xs"
        >
          <span>Open Diet Planner</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        {(['All', 'Physical', 'Physiological', 'Psychological'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeCategory === cat
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat} {cat === 'All' ? `(${PRAKRITI_QUESTIONS.length})` : ''}
          </button>
        ))}
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((q) => {
          const selected = answers[q.id];
          return (
            <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800">
                  {q.id}. {q.question}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                  {q.category}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Vata Option */}
                <button
                  type="button"
                  onClick={() => handleSelect(q.id, 'vata')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    selected === 'vata'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-950 font-semibold ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-blue-700 block mb-1">Vata Trait</span>
                  {q.vataOption}
                </button>

                {/* Pitta Option */}
                <button
                  type="button"
                  onClick={() => handleSelect(q.id, 'pitta')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    selected === 'pitta'
                      ? 'border-rose-600 bg-rose-50/70 text-rose-950 font-semibold ring-1 ring-rose-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-rose-700 block mb-1">Pitta Trait</span>
                  {q.pittaOption}
                </button>

                {/* Kapha Option */}
                <button
                  type="button"
                  onClick={() => handleSelect(q.id, 'kapha')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    selected === 'kapha'
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-1">Kapha Trait</span>
                  {q.kaphaOption}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

