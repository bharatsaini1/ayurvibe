'use client';

import React, { useState } from 'react';
import { DietPlan, Patient, FoodItem, MealSlot, MealItem } from '@/lib/types/ayurveda';
import { IFCT_FOOD_DATABASE } from '@/lib/data/ifct-database';
import { calculateMealTotals, getICMRReferenceRDA, scaleNutrients } from '@/lib/ayurveda/nutrient-calculator';
import { validateMealCompatibility } from '@/lib/ayurveda/compatibility-rules';
import {
  CalendarDays,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Printer,
  MessageCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

interface DietPlannerViewProps {
  currentPatient: Patient;
  dietPlan: DietPlan;
  onUpdateDietPlan: (updated: DietPlan) => void;
  onNavigateToPrint: () => void;
  onNavigateToWhatsApp: () => void;
}

export const DietPlannerView: React.FC<DietPlannerViewProps> = ({
  currentPatient,
  dietPlan,
  onUpdateDietPlan,
  onNavigateToPrint,
  onNavigateToWhatsApp,
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [selectedFoodId, setSelectedFoodId] = useState<string>(IFCT_FOOD_DATABASE[0].id);
  const [portionInput, setPortionInput] = useState<number>(100);

  // Compute live totals
  const totals = calculateMealTotals(dietPlan.meals);
  const rda = getICMRReferenceRDA(currentPatient.gender, currentPatient.weightKg);

  // Run real-time Ayurvedic compatibility validation
  const alerts = validateMealCompatibility(
    dietPlan.meals,
    currentPatient.prakritiPrimary,
    dietPlan.season
  );

  const handleAddItemToSlot = (slotIdx: number) => {
    const food = IFCT_FOOD_DATABASE.find((f) => f.id === selectedFoodId);
    if (!food) return;

    const newItem: MealItem = {
      id: 'item_' + Date.now(),
      foodId: food.id,
      portionGrams: portionInput,
      customNotes: 'Cooked fresh',
    };

    const updatedMeals = [...dietPlan.meals];
    updatedMeals[slotIdx].items.push(newItem);

    onUpdateDietPlan({
      ...dietPlan,
      meals: updatedMeals,
    });

    setSelectedSlotIndex(null);
  };

  const handleRemoveItem = (slotIdx: number, itemId: string) => {
    const updatedMeals = [...dietPlan.meals];
    updatedMeals[slotIdx].items = updatedMeals[slotIdx].items.filter((item) => item.id !== itemId);
    onUpdateDietPlan({
      ...dietPlan,
      meals: updatedMeals,
    });
  };

  const handleUpdatePortion = (slotIdx: number, itemId: string, newGrams: number) => {
    const updatedMeals = [...dietPlan.meals];
    const item = updatedMeals[slotIdx].items.find((i) => i.id === itemId);
    if (item) {
      item.portionGrams = Math.max(5, newGrams);
      onUpdateDietPlan({
        ...dietPlan,
        meals: updatedMeals,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Ayurveda-Focused Diet Chart Builder</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {dietPlan.planTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Calibrated for {currentPatient.name} &bull; Primary Dosha: {currentPatient.prakritiPrimary.toUpperCase()} &bull; Agni: {currentPatient.currentAgni.toUpperCase()}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onNavigateToPrint}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Printable View</span>
          </button>
          <button
            onClick={onNavigateToWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send to Patient</span>
          </button>
        </div>
      </div>

      {/* Ayurvedic Compatibility Alert Banners */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-xs flex items-start space-x-3 ${
                alert.severity === 'critical'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
                alert.severity === 'critical' ? 'text-rose-600' : 'text-amber-600'
              }`} />
              <div>
                <div className="font-bold flex items-center space-x-2">
                  <span className="uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-white/70">
                    {alert.type.replace('_', ' ')}
                  </span>
                  <span>{alert.message}</span>
                </div>
                <p className="mt-1 text-slate-600 font-medium">
                  {alert.ayurvedicExplanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nutrient Dashboard & RDA Benchmark Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Total Nutrient Rollup vs ICMR-NIN RDA</h3>
          </div>
          <span className="text-xs text-slate-500">
            Target Calorie Budget: <strong className="text-indigo-700">{dietPlan.targetCalories} kcal</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Energy */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block font-semibold uppercase">Energy (Calories)</span>
            <span className="text-base font-black text-indigo-700">{totals.energyKcal}</span>
            <span className="text-[10px] text-slate-400 block">Target: {dietPlan.targetCalories} kcal</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, (totals.energyKcal / dietPlan.targetCalories) * 100)}%` }}
              />
            </div>
          </div>

          {/* Protein */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block font-semibold uppercase">Protein</span>
            <span className="text-base font-black text-emerald-700">{totals.proteinG} g</span>
            <span className="text-[10px] text-slate-400 block">RDA: {rda.proteinG} g</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, (totals.proteinG / rda.proteinG) * 100)}%` }}
              />
            </div>
          </div>

          {/* Carbohydrates */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block font-semibold uppercase">Carbohydrates</span>
            <span className="text-base font-black text-blue-700">{totals.carbsG} g</span>
            <span className="text-[10px] text-slate-400 block">RDA: {rda.carbsG} g</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, (totals.carbsG / rda.carbsG) * 100)}%` }}
              />
            </div>
          </div>

          {/* Fats */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block font-semibold uppercase">Total Fats</span>
            <span className="text-base font-black text-amber-700">{totals.fatG} g</span>
            <span className="text-[10px] text-slate-400 block">RDA: {rda.fatG} g</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-amber-600 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, (totals.fatG / rda.fatG) * 100)}%` }}
              />
            </div>
          </div>

          {/* Dietary Fiber */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-500 block font-semibold uppercase">Dietary Fiber</span>
            <span className="text-base font-black text-slate-800">{totals.fiberG} g</span>
            <span className="text-[10px] text-slate-400 block">RDA: {rda.fiberG} g</span>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-slate-700 h-1.5 rounded-full"
                style={{ width: `${Math.min(100, (totals.fiberG / rda.fiberG) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Meal Slots */}
      <div className="space-y-4">
        {dietPlan.meals.map((slot, slotIdx) => (
          <div key={slot.slotName} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-bold text-slate-900">{slot.slotName}</h4>
                <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md">
                  {slot.time}
                </span>
              </div>
              <button
                onClick={() => setSelectedSlotIndex(slotIdx)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Food Item</span>
              </button>
            </div>

            {/* Food items in this slot */}
            {slot.items.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No foods assigned to this meal slot.</p>
            ) : (
              <div className="space-y-2">
                {slot.items.map((item) => {
                  const food = IFCT_FOOD_DATABASE.find((f) => f.id === item.foodId);
                  if (!food) return null;
                  const itemNutri = scaleNutrients(food, item.portionGrams);
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 gap-2 text-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-[11px]">
                          {item.portionGrams}g
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{food.name}</span>
                          <span className="text-[11px] text-slate-500">
                            {food.category} &bull; {food.virya === 'ushna' ? 'Hot' : 'Cooling'} Virya &bull; {food.rasa.join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Nutrient Tally for this item */}
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="font-bold text-indigo-700 block">{itemNutri.energyKcal} kcal</span>
                          <span className="text-[10px] text-slate-500">
                            P: {itemNutri.proteinG}g &bull; C: {itemNutri.carbsG}g &bull; F: {itemNutri.fatG}g
                          </span>
                        </div>

                        {/* Portion editor */}
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            min="5"
                            max="500"
                            step="5"
                            className="w-16 px-1.5 py-1 bg-white border border-slate-200 rounded text-center text-xs font-bold"
                            value={item.portionGrams}
                            onChange={(e) => handleUpdatePortion(slotIdx, item.id, Number(e.target.value))}
                          />
                          <span className="text-[10px] text-slate-400">g</span>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleRemoveItem(slotIdx, item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Food Modal */}
      {selectedSlotIndex !== null && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Add Food to {dietPlan.meals[selectedSlotIndex].slotName}
              </h3>
              <button
                onClick={() => setSelectedSlotIndex(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                &times;
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Select Food (from ICMR-NIN IFCT 2017):
              </label>
              <select
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none"
                value={selectedFoodId}
                onChange={(e) => setSelectedFoodId(e.target.value)}
              >
                {IFCT_FOOD_DATABASE.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.category}) - {f.energyKcal} kcal / 100g
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Portion Weight (grams):
              </label>
              <input
                type="number"
                min="5"
                max="800"
                step="5"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none"
                value={portionInput}
                onChange={(e) => setPortionInput(Number(e.target.value) || 0)}
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setSelectedSlotIndex(null)}
                className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddItemToSlot(selectedSlotIndex)}
                className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-xs"
              >
                Add Item to Meal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

