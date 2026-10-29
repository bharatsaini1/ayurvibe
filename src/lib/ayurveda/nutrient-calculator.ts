import { FoodItem, MealSlot } from '../types/ayurveda';
import { IFCT_FOOD_DATABASE } from '../data/ifct-database';

export interface ScaledNutrients {
  energyKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  calciumMg: number;
  ironMg: number;
}

export function scaleNutrients(food: FoodItem, portionGrams: number): ScaledNutrients {
  const factor = portionGrams / 100;
  return {
    energyKcal: Math.round(food.energyKcal * factor * 10) / 10,
    proteinG: Math.round(food.proteinG * factor * 10) / 10,
    carbsG: Math.round(food.carbsG * factor * 10) / 10,
    fatG: Math.round(food.fatG * factor * 10) / 10,
    fiberG: Math.round(food.fiberG * factor * 10) / 10,
    calciumMg: Math.round(food.calciumMg * factor * 10) / 10,
    ironMg: Math.round(food.ironMg * factor * 10) / 10,
  };
}

export function calculateMealTotals(meals: MealSlot[]): ScaledNutrients {
  const totals: ScaledNutrients = {
    energyKcal: 0,
    proteinG: 0,
    carbsG: 0,
    fatG: 0,
    fiberG: 0,
    calciumMg: 0,
    ironMg: 0,
  };

  meals.forEach((slot) => {
    slot.items.forEach((item) => {
      const food = IFCT_FOOD_DATABASE.find((f) => f.id === item.foodId);
      if (food) {
        const scaled = scaleNutrients(food, item.portionGrams);
        totals.energyKcal += scaled.energyKcal;
        totals.proteinG += scaled.proteinG;
        totals.carbsG += scaled.carbsG;
        totals.fatG += scaled.fatG;
        totals.fiberG += scaled.fiberG;
        totals.calciumMg += scaled.calciumMg;
        totals.ironMg += scaled.ironMg;
      }
    });
  });

  return {
    energyKcal: Math.round(totals.energyKcal),
    proteinG: Math.round(totals.proteinG * 10) / 10,
    carbsG: Math.round(totals.carbsG * 10) / 10,
    fatG: Math.round(totals.fatG * 10) / 10,
    fiberG: Math.round(totals.fiberG * 10) / 10,
    calciumMg: Math.round(totals.calciumMg),
    ironMg: Math.round(totals.ironMg * 10) / 10,
  };
}

export interface ICMRReferenceRDA {
  caloriesKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
}

export function getICMRReferenceRDA(gender: 'Male' | 'Female' | 'Other', weightKg: number): ICMRReferenceRDA {
  const isFemale = gender === 'Female';
  return {
    caloriesKcal: isFemale ? 1900 : 2300,
    proteinG: Math.round(weightKg * 0.83 * 10) / 10, // ICMR 2020 standard 0.83g/kg
    carbsG: isFemale ? 250 : 300,
    fatG: isFemale ? 25 : 30,
    fiberG: 30,
  };
}

