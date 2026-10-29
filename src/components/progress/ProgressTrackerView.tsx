'use client';

import React, { useState } from 'react';
import { Patient, ProgressRecord } from '@/lib/types/ayurveda';
import { SAMPLE_PROGRESS_RECORDS } from '@/lib/data/sample-patients';
import { LineChart, Plus, CheckCircle2, TrendingDown, Flame, Calendar, Activity } from 'lucide-react';

interface ProgressTrackerViewProps {
  currentPatient: Patient;
}

export const ProgressTrackerView: React.FC<ProgressTrackerViewProps> = ({ currentPatient }) => {
  const [records, setRecords] = useState<ProgressRecord[]>(SAMPLE_PROGRESS_RECORDS);
  const [isAdding, setIsAdding] = useState(false);
  const [newWeight, setNewWeight] = useState(67.5);
  const [newAgni, setNewAgni] = useState<'sama' | 'visham' | 'tikshna' | 'manda'>('sama');
  const [newSymptomScore, setNewSymptomScore] = useState(2);
  const [newAdherence, setNewAdherence] = useState(90);
  const [newNotes, setNewNotes] = useState('Patient reports high energy and no abdominal distress.');

  const handleAddRecord = () => {
    const heightM = currentPatient.heightCm / 100;
    const newBmi = Math.round((newWeight / (heightM * heightM)) * 10) / 10;
    const newRecord: ProgressRecord = {
      id: 'pr_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      weightKg: newWeight,
      bmi: newBmi,
      agniState: newAgni,
      symptomSeverityScore: newSymptomScore,
      adherencePercentage: newAdherence,
      notes: newNotes,
    };

    setRecords([...records, newRecord]);
    setIsAdding(false);
  };

  const initialRecord = records[0];
  const latestRecord = records[records.length - 1];
  const totalWeightLoss = Math.round((initialRecord.weightKg - latestRecord.weightKg) * 10) / 10;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <LineChart className="w-4 h-4" />
            <span>Longitudinal Progress & Consultation Monitoring</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Clinical Health Trajectory: {currentPatient.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring anthropometric changes, symptom alleviation, and digestive fire (*Agni*) normalization.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Log Follow-up Visit</span>
        </button>
      </div>

      {/* Trajectory Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Weight Trajectory</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {latestRecord.weightKg} kg
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center mt-0.5">
              <TrendingDown className="w-3.5 h-3.5 mr-1" /> -{totalWeightLoss} kg total change
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            BMI {latestRecord.bmi}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Digestive State (Agni)</span>
            <div className="text-xl font-black text-amber-700 uppercase mt-1">
              {latestRecord.agniState} Agni
            </div>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">
              Shifted from {initialRecord.agniState.toUpperCase()}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500">Diet Adherence</span>
            <div className="text-2xl font-black text-indigo-700 mt-1">
              {latestRecord.adherencePercentage}%
            </div>
            <span className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> High patient compliance
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SVG Trajectory Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Weight & Symptom Severity Trend</h3>
        <div className="relative h-48 w-full bg-slate-50 rounded-xl p-4 flex items-end justify-between border border-slate-100">
          {records.map((r, idx) => (
            <div key={r.id} className="flex flex-col items-center flex-1">
              <span className="text-[10px] font-bold text-indigo-700 mb-1">{r.weightKg}kg</span>
              <div
                className="w-8 bg-indigo-600 rounded-t-lg transition-all"
                style={{ height: `${(r.weightKg / 80) * 120}px` }}
              />
              <span className="text-[10px] font-semibold text-slate-500 mt-2">{r.date.slice(5)}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-6 mt-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-indigo-600 rounded" />
            <span>Body Weight (kg)</span>
          </div>
        </div>
      </div>

      {/* New Record Modal / Inline Form */}
      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-indigo-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Record New Consultation Visit</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                className="w-full p-2 bg-slate-50 border rounded-lg font-bold"
                value={newWeight}
                onChange={(e) => setNewWeight(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Agni Status</label>
              <select
                className="w-full p-2 bg-slate-50 border rounded-lg font-bold uppercase"
                value={newAgni}
                onChange={(e) => setNewAgni(e.target.value as any)}
              >
                <option value="sama">Sama Agni</option>
                <option value="visham">Visham Agni</option>
                <option value="tikshna">Tikshna Agni</option>
                <option value="manda">Manda Agni</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Symptom Score (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full p-2 bg-slate-50 border rounded-lg font-bold"
                value={newSymptomScore}
                onChange={(e) => setNewSymptomScore(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Adherence (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                className="w-full p-2 bg-slate-50 border rounded-lg font-bold"
                value={newAdherence}
                onChange={(e) => setNewAdherence(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Dietitian Notes</label>
            <input
              type="text"
              className="w-full p-2 bg-slate-50 border rounded-lg text-xs"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRecord}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold"
            >
              Save Follow-up Entry
            </button>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs overflow-x-auto">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Visit History Log</h3>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-2.5">Date</th>
              <th>Weight</th>
              <th>BMI</th>
              <th>Agni Status</th>
              <th>Symptom Score</th>
              <th>Adherence</th>
              <th>Clinical Observation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {records.map((r) => (
              <tr key={r.id}>
                <td className="py-3 font-bold text-slate-900">{r.date}</td>
                <td>{r.weightKg} kg</td>
                <td>{r.bmi}</td>
                <td className="uppercase font-bold text-amber-800">{r.agniState}</td>
                <td>{r.symptomSeverityScore} / 10</td>
                <td>
                  <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    {r.adherencePercentage}%
                  </span>
                </td>
                <td className="text-slate-500 max-w-xs">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

