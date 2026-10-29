import { FoodItem, ViruddhaAlert, DoshaType, MealSlot } from '../types/ayurveda';
import { IFCT_FOOD_DATABASE } from '../data/ifct-database';

interface IncompatibilityRule {
  foodA: string;
  foodB: string;
  explanation: string;
}

const CLASSICAL_INCOMPATIBILITIES: IncompatibilityRule[] = [
  {
    foodA: 'Cow Milk',
    foodB: 'Fish',
    explanation: 'Milk has Sheeta (cold) virya while Fish has Ushna (hot) virya. Their combination causes blood vitiation and channel obstruction (Abhishyandi).',
  },
  {
    foodA: 'Cow Milk',
    foodB: 'Citrus / Sour',
    explanation: 'Sour substances curdle milk in the gut, forming heavy toxins (Ama) that impair Agni.',
  },
  {
    foodA: 'Curd / Yogurt',
    foodB: 'Night Meals',
    explanation: 'Charaka Samhita strictly advises against taking curd at night because its Abhishyandi nature blocks micro-channels (Srotas), aggravating Kapha and Pitta.',
  },
  {
    foodA: 'Banana',
    foodB: 'Cow Milk',
    explanation: 'Banana and milk together produce a heavy post-digestive state (Vipaka conflict), dulling Agni and producing excess mucous.',
  },
  {
    foodA: 'Banana',
    foodB: 'Curd / Yogurt',
    explanation: 'Combining curd with banana severely dampens Agni and leads to cold, congestion, and allergies.',
  },
  {
    foodA: 'Honey',
    foodB: 'Hot water / Heating',
    explanation: 'Heated honey becomes toxic (Ama-visha) according to classical texts because its subtle qualities are altered irreversibly by heat.',
  },
];

export function validateMealCompatibility(
  meals: MealSlot[],
  patientDosha: DoshaType,
  season: string
): ViruddhaAlert[] {
  const alerts: ViruddhaAlert[] = [];

  // Extract all food items in the day's meals
  const allMealFoods: { slotName: string; food: FoodItem }[] = [];
  meals.forEach((slot) => {
    slot.items.forEach((item) => {
      const food = IFCT_FOOD_DATABASE.find((f) => f.id === item.foodId);
      if (food) {
        allMealFoods.push({ slotName: slot.slotName, food });
      }
    });
  });

  // 1. Check Combination Incompatibilities within the same meal slot
  meals.forEach((slot) => {
    const slotFoods = slot.items
      .map((item) => IFCT_FOOD_DATABASE.find((f) => f.id === item.foodId))
      .filter((f): f is FoodItem => !!f);

    for (let i = 0; i < slotFoods.length; i++) {
      for (let j = i + 1; j < slotFoods.length; j++) {
        const foodA = slotFoods[i];
        const foodB = slotFoods[j];

        // Check Milk + Sour/Banana
        if (
          (foodA.name.includes('Milk') && (foodB.name.includes('Banana') || foodB.name.includes('Gooseberry') || foodB.rasa.includes('amla'))) ||
          (foodB.name.includes('Milk') && (foodA.name.includes('Banana') || foodA.name.includes('Gooseberry') || foodA.rasa.includes('amla')))
        ) {
          alerts.push({
            type: 'viruddha_ahara',
            severity: 'critical',
            foodA: foodA.name,
            foodB: foodB.name,
            message: `Viruddha Ahara in ${slot.slotName}: ${foodA.name} combined with ${foodB.name}`,
            ayurvedicExplanation: 'Sour/fruit combinations with milk curdle in the gut, dampening Agni and producing toxic residues (Ama).',
          });
        }

        // Check Curd + Banana
        if (
          (foodA.name.includes('Curd') && foodB.name.includes('Banana')) ||
          (foodB.name.includes('Curd') && foodA.name.includes('Banana'))
        ) {
          alerts.push({
            type: 'viruddha_ahara',
            severity: 'critical',
            foodA: foodA.name,
            foodB: foodB.name,
            message: `Viruddha Ahara in ${slot.slotName}: Curd combined with Banana`,
            ayurvedicExplanation: 'Combines two heavy, channel-clogging (Abhishyandi) substances that induce metabolic slowdown and congestion.',
          });
        }
      }
    }

    // Check Curd at Night (Kala Viruddha)
    if (slot.slotName.includes('Ratri') || slot.slotName.includes('Dinner')) {
      const hasCurd = slotFoods.some((f) => f.name.includes('Curd') || f.name.includes('Dadhi'));
      if (hasCurd) {
        alerts.push({
          type: 'viruddha_ahara',
          severity: 'warning',
          foodA: 'Curd / Yogurt',
          message: 'Kala Viruddha: Curd assigned in Dinner (Ratri Bhojana)',
          ayurvedicExplanation: 'Ayurveda strongly proscribes curd at night as it obstructs subtle channels (Srotorodha) and worsens respiratory disorders.',
        });
      }
    }
  });

  // 2. Check Dosha Aggravation (Dosha Viruddha)
  allMealFoods.forEach(({ slotName, food }) => {
    if (patientDosha === 'vata' && food.doshaKarma.vata === 'aggravates') {
      alerts.push({
        type: 'dosha_aggravation',
        severity: 'warning',
        foodA: food.name,
        message: `Dosha Conflict: ${food.name} aggravates Vata in a Vata-dominant patient.`,
        ayurvedicExplanation: `${food.name} possesses dry/rough (Ruksha) or cold (Sheeta) gunas that irritate erratic Vata dosha.`,
      });
    } else if (patientDosha === 'pitta' && food.doshaKarma.pitta === 'aggravates') {
      alerts.push({
        type: 'dosha_aggravation',
        severity: 'warning',
        foodA: food.name,
        message: `Dosha Conflict: ${food.name} aggravates Pitta in a Pitta-dominant patient.`,
        ayurvedicExplanation: `${food.name} has sharp (Teekshna) or hot (Ushna) virya that overheats blood and stimulates hyperacidity.`,
      });
    } else if (patientDosha === 'kapha' && food.doshaKarma.kapha === 'aggravates') {
      alerts.push({
        type: 'dosha_aggravation',
        severity: 'warning',
        foodA: food.name,
        message: `Dosha Conflict: ${food.name} aggravates Kapha in a Kapha-dominant patient.`,
        ayurvedicExplanation: `${food.name} has heavy (Guru) and unctuous (Snigdha) gunas that increase lethargy, fluid retention, and mucus.`,
      });
    }
  });

  return alerts;
}

