'use client';

import React, { useState } from 'react';
import { IFCT_FOOD_DATABASE } from '@/lib/data/ifct-database';
import { FoodItem, FoodCategory, DoshaType } from '@/lib/types/ayurveda';
import { scaleNutrients } from '@/lib/ayurveda/nutrient-calculator';
import { Search, Filter, Apple, Sparkles, Scale, AlertTriangle } from 'lucide-react';

export const FoodDatabaseView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [doshaFilter, setDoshaFilter] = useState<string>('all');
  const [calculatorFood, setCalculatorFood] = useState<FoodItem | null>(null);
  const [customGrams, setCustomGrams] = useState<number>(100);

  const categories: string[] = [
    'All',
    'Cereals & Millets',
    'Pulses & Legumes',
    'Vegetables',
    'Dairy Products',
    'Spices & Herbs',
    'Fruits',
    'Nuts & Oilseeds',
  ];

  const filteredFoods = IFCT_FOOD_DATABASE.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (food.regionalName && food.regionalName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      food.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;

    let matchesDosha = true;
    if (doshaFilter === 'vata_pacifies') matchesDosha = food.doshaKarma.vata === 'pacifies';
    else if (doshaFilter === 'pitta_pacifies') matchesDosha = food.doshaKarma.pitta === 'pacifies';
    else if (doshaFilter === 'kapha_pacifies') matchesDosha = food.doshaKarma.kapha === 'pacifies';

    return matchesSearch && matchesCategory && matchesDosha;
  });

  const scaled = calculatorFood ? scaleNutrients(calculatorFood, customGrams) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Apple className="w-4 h-4" />
            <span>ICMR-NIN Indian Food Composition Tables (IFCT 2017)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Nutrient & Ayurvedic Food Composition Database
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Biochemical composition scaled per gram paired with classical Ayurvedic energetics (Rasa, Virya, Vipaka, Guna).
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>528 Indian Foods Standardized</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search food by English or Ayurvedic/Hindi name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            aria-label="Filter by Category"
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Dosha Filter */}
          <select
            aria-label="Filter by Dosha Action"
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none"
            value={doshaFilter}
            onChange={(e) => setDoshaFilter(e.target.value)}
          >
            <option value="all">All Dosha Actions</option>
            <option value="vata_pacifies">Pacifies Vata</option>
            <option value="pitta_pacifies">Pacifies Pitta</option>
            <option value="kapha_pacifies">Pacifies Kapha</option>
          </select>
        </div>
      </div>

      {/* Main Foods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map((food) => (
          <div
            key={food.id}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {food.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mt-1.5">{food.name}</h3>
                  {food.regionalName && (
                    <span className="text-xs text-slate-500 italic block">{food.regionalName}</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setCalculatorFood(food);
                    setCustomGrams(100);
                  }}
                  className="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-all"
                  title="Scale Portion Nutrients"
                >
                  <Scale className="w-4 h-4" />
                </button>
              </div>

              {/* Nutritional Breakdown per 100g */}
              <div className="grid grid-cols-4 gap-1.5 bg-slate-50 p-2.5 rounded-lg my-3 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Calories</span>
                  <span className="text-xs font-black text-slate-900">{food.energyKcal}</span>
                  <span className="text-[9px] text-slate-400 block">kcal</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Protein</span>
                  <span className="text-xs font-bold text-emerald-700">{food.proteinG}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Carbs</span>
                  <span className="text-xs font-bold text-indigo-700">{food.carbsG}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Fat</span>
                  <span className="text-xs font-bold text-amber-700">{food.fatG}g</span>
                </div>
              </div>

              {/* Ayurvedic Properties */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Virya (Potency):</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                      food.virya === 'ushna'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {food.virya === 'ushna' ? 'Ushna (Heating)' : 'Sheeta (Cooling)'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Rasa (Taste):</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {food.rasa.join(', ')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="text-slate-400 font-medium">Vipaka:</span>
                  <span className="font-semibold text-slate-800 capitalize">{food.vipaka}</span>
                </div>

                {/* Dosha Karma Badges */}
                <div className="flex items-center space-x-1.5 pt-1">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      food.doshaKarma.vata === 'pacifies'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : food.doshaKarma.vata === 'aggravates'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    V: {food.doshaKarma.vata}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      food.doshaKarma.pitta === 'pacifies'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : food.doshaKarma.pitta === 'aggravates'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    P: {food.doshaKarma.pitta}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      food.doshaKarma.kapha === 'pacifies'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : food.doshaKarma.kapha === 'aggravates'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    K: {food.doshaKarma.kapha}
                  </span>
                </div>

                {food.incompatibilities && food.incompatibilities.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200/80 rounded p-1.5 text-[11px] text-amber-900 mt-2 flex items-start space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>Incompatible with: {food.incompatibilities.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Portion Calculator Modal */}
      {calculatorFood && scaled && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-600">Nutrient Scaler</span>
                <h3 className="font-bold text-base text-slate-900">{calculatorFood.name}</h3>
              </div>
              <button
                onClick={() => setCalculatorFood(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                &times;
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Portion Quantity (in grams):
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="5"
                  max="1000"
                  step="5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none"
                  value={customGrams}
                  onChange={(e) => setCustomGrams(Number(e.target.value) || 0)}
                />
                <span className="text-xs font-bold text-slate-500">grams</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
              <div className="flex justify-between text-xs font-bold text-slate-900 border-b pb-1">
                <span>Total Energy (Calories)</span>
                <span className="text-indigo-600 font-black">{scaled.energyKcal} kcal</span>
              </div>
              <div className="flex justify-between text-xs text-slate-700">
                <span>Protein</span>
                <span className="font-semibold text-emerald-700">{scaled.proteinG} g</span>
              </div>
              <div className="flex justify-between text-xs text-slate-700">
                <span>Carbohydrates</span>
                <span className="font-semibold text-indigo-700">{scaled.carbsG} g</span>
              </div>
              <div className="flex justify-between text-xs text-slate-700">
                <span>Fat</span>
                <span className="font-semibold text-amber-700">{scaled.fatG} g</span>
              </div>
              <div className="flex justify-between text-xs text-slate-700">
                <span>Dietary Fiber</span>
                <span className="font-semibold text-slate-800">{scaled.fiberG} g</span>
              </div>
              <div className="flex justify-between text-xs text-slate-700">
                <span>Calcium</span>
                <span className="font-semibold text-slate-800">{scaled.calciumMg} mg</span>
              </div>
              <div className="flex justify-between text-xs text-slate-700">
                <span>Iron</span>
                <span className="font-semibold text-slate-800">{scaled.ironMg} mg</span>
              </div>
            </div>

            <button
              onClick={() => setCalculatorFood(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
            >
              Close Scaler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

