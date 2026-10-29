'use client';

import React from 'react';
import { DietPlan, Patient } from '@/lib/types/ayurveda';
import { IFCT_FOOD_DATABASE } from '@/lib/data/ifct-database';
import { calculateMealTotals, scaleNutrients } from '@/lib/ayurveda/nutrient-calculator';
import { Printer, ArrowLeft, ShieldCheck, Heart } from 'lucide-react';

interface PrintableDietChartProps {
  currentPatient: Patient;
  dietPlan: DietPlan;
  onBack: () => void;
}

export const PrintableDietChart: React.FC<PrintableDietChartProps> = ({
  currentPatient,
  dietPlan,
  onBack,
}) => {
  const totals = calculateMealTotals(dietPlan.meals);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Action Toolbar (Hidden in Print) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Planner</span>
        </button>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-500">Ready for high-res PDF generation & printing</span>
          <button
            onClick={handlePrint}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* The Printable Clinical Document */}
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-200 shadow-sm text-slate-800 space-y-6">
        {/* Clinic Header */}
        <div className="border-b-2 border-indigo-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black text-indigo-950 tracking-tight">AyurVibe</span>
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded">
                Holistic Dietetics
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Gen-Z Ayurvedic Practice & Nutrient Analysis Platform &bull; Dr. B. S. Solanki Clinic
            </p>
          </div>

          <div className="text-right text-xs text-slate-600">
            <span className="font-bold text-slate-900 block">Prescription Chart #{dietPlan.id}</span>
            <span>Date: {dietPlan.createdAt}</span>
          </div>
        </div>

        {/* Patient Profile & Ayurvedic Baseline */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">Patient Name:</span>
            <strong className="text-slate-900">{currentPatient.name}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Age / Gender:</span>
            <strong className="text-slate-900">{currentPatient.age} yrs / {currentPatient.gender}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Prakriti (Dosha):</span>
            <strong className="text-indigo-800 uppercase">{currentPatient.prakritiPrimary} Dominant</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Agni (Digestion):</span>
            <strong className="text-amber-800 uppercase">{currentPatient.currentAgni} Agni</strong>
          </div>
        </div>

        {/* Plan Title & Season */}
        <div className="text-center py-2 bg-indigo-50/50 rounded-xl border border-indigo-100">
          <h2 className="text-base font-bold text-indigo-950 uppercase tracking-wide">
            {dietPlan.planTitle}
          </h2>
          <span className="text-xs text-indigo-700 font-medium">
            Season: {dietPlan.season} &bull; Caloric Budget: {dietPlan.targetCalories} kcal
          </span>
        </div>

        {/* Meal Schedule Table */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Prescribed Daily Meal Regimen (Aahar Kram)
          </h3>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            {dietPlan.meals.map((slot) => (
              <div key={slot.slotName} className="border-b last:border-b-0">
                <div className="bg-slate-100/70 px-4 py-2 font-bold text-slate-800 flex justify-between">
                  <span>{slot.slotName}</span>
                  <span className="text-indigo-700 font-semibold">{slot.time}</span>
                </div>
                <div className="p-4 space-y-2">
                  {slot.items.length === 0 ? (
                    <span className="text-slate-400 italic">Rest / Warm water only</span>
                  ) : (
                    slot.items.map((item) => {
                      const food = IFCT_FOOD_DATABASE.find((f) => f.id === item.foodId);
                      if (!food) return null;
                      const itemNutri = scaleNutrients(food, item.portionGrams);
                      return (
                        <div key={item.id} className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-semibold text-slate-900">{food.name}</span>
                            <span className="text-slate-500 ml-2">({item.portionGrams}g)</span>
                            {item.customNotes && (
                              <span className="text-slate-400 italic ml-2">- {item.customNotes}</span>
                            )}
                          </div>
                          <span className="text-slate-500 font-mono text-[11px]">
                            {itemNutri.energyKcal} kcal | P: {itemNutri.proteinG}g
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nutritional Summary Rollup */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
          <span className="font-bold text-slate-700 block">Total Daily Nutritional Summary (ICMR-NIN Scaled):</span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
            <div className="bg-white p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Total Calories</span>
              <strong className="text-indigo-800">{totals.energyKcal} kcal</strong>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Total Protein</span>
              <strong className="text-emerald-800">{totals.proteinG} g</strong>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Carbohydrates</span>
              <strong className="text-blue-800">{totals.carbsG} g</strong>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Healthy Fats</span>
              <strong className="text-amber-800">{totals.fatG} g</strong>
            </div>
            <div className="bg-white p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 block">Dietary Fiber</span>
              <strong className="text-slate-800">{totals.fiberG} g</strong>
            </div>
          </div>
        </div>

        {/* Pathya & Apathya (Do's & Don'ts) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-900 uppercase block tracking-wider text-[11px]">
              &check; Pathya (Recommended Guidelines)
            </span>
            <ul className="space-y-1 list-disc list-inside text-emerald-950">
              {dietPlan.pathya.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 space-y-2">
            <span className="font-bold text-rose-900 uppercase block tracking-wider text-[11px]">
              &cross; Apathya (Strict Restrictions & Viruddha Ahara)
            </span>
            <ul className="space-y-1 list-disc list-inside text-rose-950">
              {dietPlan.apathya.map((a, idx) => (
                <li key={idx}>{a}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dietitian Signature Block */}
        <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
          <div>
            <span className="text-slate-400 block">Consultation Notes:</span>
            <p className="text-slate-600 italic max-w-md">{dietPlan.consultantNotes}</p>
          </div>
          <div className="text-right">
            <div className="w-36 border-b border-slate-400 mb-1" />
            <strong className="text-slate-900 block">Dr. Brijraj Singh Solanki</strong>
            <span className="text-slate-500">Senior Ayurvedic Dietitian</span>
          </div>
        </div>
      </div>
    </div>
  );
};

