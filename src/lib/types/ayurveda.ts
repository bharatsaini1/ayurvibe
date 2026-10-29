export type DoshaType = 'vata' | 'pitta' | 'kapha';

export type AgniType = 'sama' | 'visham' | 'tikshna' | 'manda';

export type KoshthaType = 'krura' | 'madhyama' | 'mrudu';

export type RasaType = 'madhura' | 'amla' | 'lavana' | 'katu' | 'tikta' | 'kashaya';

export type ViryaType = 'ushna' | 'sheeta';

export type VipakaType = 'madhura' | 'amla' | 'katu';

export type FoodCategory =
  | 'Cereals & Millets'
  | 'Pulses & Legumes'
  | 'Vegetables'
  | 'Fruits'
  | 'Dairy Products'
  | 'Nuts & Oilseeds'
  | 'Spices & Herbs'
  | 'Fats & Oils';

export interface FoodItem {
  id: string;
  name: string;
  regionalName?: string;
  category: FoodCategory;
  servingUnit: string; // e.g. "100g", "1 cup (150g)"
  // Biochemical Nutrients per 100g (ICMR-NIN IFCT 2017)
  energyKcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  calciumMg: number;
  ironMg: number;
  // Ayurvedic Categorization
  rasa: RasaType[];
  virya: ViryaType;
  vipaka: VipakaType;
  guna: string[]; // e.g. ["Laghu (Light)", "Ruksha (Dry)"]
  doshaKarma: {
    vata: 'pacifies' | 'aggravates' | 'neutral';
    pitta: 'pacifies' | 'aggravates' | 'neutral';
    kapha: 'pacifies' | 'aggravates' | 'neutral';
  };
  incompatibilities?: string[]; // E.g., ["Milk", "Fish", "Honey"]
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  heightCm: number;
  weightKg: number;
  bmi: number;
  prakritiPrimary: DoshaType;
  prakritiSecondary?: DoshaType;
  currentAgni: AgniType;
  koshtha: KoshthaType;
  healthConcerns: string[];
  activeDietPlanId?: string;
  lastConsultationDate: string;
}

export interface PrakritiQuestion {
  id: number;
  category: 'Physical' | 'Physiological' | 'Psychological';
  question: string;
  vataOption: string;
  pittaOption: string;
  kaphaOption: string;
}

export interface PrakritiScore {
  vataPercentage: number;
  pittaPercentage: number;
  kaphaPercentage: number;
  primaryDosha: DoshaType;
  secondaryDosha?: DoshaType;
  agniType: AgniType;
  recommendations: string[];
}

export interface MealItem {
  id: string;
  foodId: string;
  portionGrams: number;
  customNotes?: string;
}

export interface MealSlot {
  slotName: 'Pratah (Breakfast)' | 'Madhyahna (Lunch)' | 'Sandhya (Evening Snack)' | 'Ratri (Dinner)';
  time: string;
  items: MealItem[];
}

export interface DietPlan {
  id: string;
  patientId: string;
  patientName: string;
  planTitle: string;
  targetCalories: number;
  season: 'Shishira (Late Winter)' | 'Vasanta (Spring)' | 'Grishma (Summer)' | 'Varsha (Monsoon)' | 'Sharad (Autumn)' | 'Hemanta (Early Winter)';
  meals: MealSlot[];
  pathya: string[]; // Recommended do's
  apathya: string[]; // Restricted don'ts
  consultantNotes: string;
  createdAt: string;
}

export interface ViruddhaAlert {
  type: 'viruddha_ahara' | 'dosha_aggravation' | 'seasonal_conflict';
  severity: 'critical' | 'warning' | 'info';
  foodA?: string;
  foodB?: string;
  message: string;
  ayurvedicExplanation: string;
}

export interface ProgressRecord {
  id: string;
  date: string;
  weightKg: number;
  bmi: number;
  agniState: AgniType;
  symptomSeverityScore: number; // 1 to 10
  adherencePercentage: number;
  notes: string;
}

