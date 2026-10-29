import { PrakritiQuestion, PrakritiScore, DoshaType, AgniType } from '../types/ayurveda';

export const PRAKRITI_QUESTIONS: PrakritiQuestion[] = [
  // --- Physical Assessment ---
  {
    id: 1,
    category: 'Physical',
    question: 'Body Frame & Physical Build',
    vataOption: 'Slender, thin, tall or short, difficulty gaining weight',
    pittaOption: 'Medium build, athletic, symmetrical muscle tone',
    kaphaOption: 'Broad, heavy, sturdy frame, easily gains weight',
  },
  {
    id: 2,
    category: 'Physical',
    question: 'Skin Texture & Temperature',
    vataOption: 'Dry, rough, thin, cool to touch, tends to crack',
    pittaOption: 'Warm, soft, oily T-zone, prone to redness or freckles',
    kaphaOption: 'Thick, cool, moist, smooth, glowing, rarely dries',
  },
  {
    id: 3,
    category: 'Physical',
    question: 'Hair Type & Scalp',
    vataOption: 'Dry, brittle, frizzy, dull, split ends',
    pittaOption: 'Fine, silky, prone to premature graying or thinning',
    kaphaOption: 'Thick, wavy, oily scalp, strong, lustrous',
  },
  {
    id: 4,
    category: 'Physical',
    question: 'Joint Structure & Mobility',
    vataOption: 'Prominent joints, tends to crack or pop, stiffness',
    pittaOption: 'Moderate, flexible, prone to inflammation or heat',
    kaphaOption: 'Large, well-lubricated, well-covered with muscle',
  },
  {
    id: 5,
    category: 'Physical',
    question: 'Eyes & Gaze',
    vataOption: 'Small, restless, dry, quick shifting gaze',
    pittaOption: 'Medium, sharp, penetrating, sensitive to bright sunlight',
    kaphaOption: 'Large, wide, attractive, calm, white sclera',
  },

  // --- Physiological Assessment ---
  {
    id: 6,
    category: 'Physiological',
    question: 'Appetite & Digestive Fire (Agni)',
    vataOption: 'Irregular (Visham Agni) - sometimes hungry, sometimes skips',
    pittaOption: 'Intense/Sharp (Tikshna Agni) - must eat on time, gets irritable when hungry',
    kaphaOption: 'Slow/Steady (Manda Agni) - can easily skip meals without distress',
  },
  {
    id: 7,
    category: 'Physiological',
    question: 'Bowel Habits & Elimination (Koshtha)',
    vataOption: 'Irregular, dry, hard stools, prone to gas and constipation (Krura)',
    pittaOption: 'Regular, loose or soft stools, 2-3 times daily (Mrudu)',
    kaphaOption: 'Regular, heavy, sluggish elimination, rarely urgent (Madhyama)',
  },
  {
    id: 8,
    category: 'Physiological',
    question: 'Sleep Quality & Dreams',
    vataOption: 'Light, interrupted, trouble falling asleep, dreams of flying or wind',
    pittaOption: 'Moderate, 6-7 hours, can awaken warm, dreams of fire or conflict',
    kaphaOption: 'Deep, heavy, difficulty waking in morning, dreams of water or clouds',
  },
  {
    id: 9,
    category: 'Physiological',
    question: 'Weather Preference & Thermal Sensitivity',
    vataOption: 'Dislikes cold, dry, and windy days; loves warm sunshine',
    pittaOption: 'Dislikes intense heat, humidity, sun; loves cool breezes and AC',
    kaphaOption: 'Dislikes cold, wet, damp, foggy winter days; prefers dry warmth',
  },
  {
    id: 10,
    category: 'Physiological',
    question: 'Physical Stamina & Energy Levels',
    vataOption: 'Short energetic bursts, exhausts quickly, erratic stamina',
    pittaOption: 'Moderate endurance, driven, pushes past fatigue',
    kaphaOption: 'High natural stamina, slow to start but can endure long periods',
  },

  // --- Psychological Assessment ---
  {
    id: 11,
    category: 'Psychological',
    question: 'Mental Pace & Thought Process',
    vataOption: 'Quick thinker, creative, mind jumps between many thoughts',
    pittaOption: 'Sharp, logical, analytical, goal-oriented, decisive',
    kaphaOption: 'Methodical, calm, deliberate, takes time to absorb new concepts',
  },
  {
    id: 12,
    category: 'Psychological',
    question: 'Response to Stress & Pressure',
    vataOption: 'Anxiety, nervousness, overthinking, feeling overwhelmed',
    pittaOption: 'Frustration, irritation, anger, impatience, perfectionism',
    kaphaOption: 'Withdrawal, stubbornness, procrastination, emotional eating',
  },
  {
    id: 13,
    category: 'Psychological',
    question: 'Memory & Recall Capability',
    vataOption: 'Learns quickly, forgets quickly, short-term memory stronger',
    pittaOption: 'Quick comprehension, retains facts well, sharp recall',
    kaphaOption: 'Slow to memorize, but once learned, remembers forever',
  },
  {
    id: 14,
    category: 'Psychological',
    question: 'Speech Pattern & Communication',
    vataOption: 'Fast-talking, talkative, wanders off topic easily',
    pittaOption: 'Precise, articulate, convincing, authoritative',
    kaphaOption: 'Slow, melodious, quiet, speaks only when necessary',
  },
  {
    id: 15,
    category: 'Psychological',
    question: 'Financial & Spending Tendencies',
    vataOption: 'Spontaneous spender, spends on impulse, saves erratically',
    pittaOption: 'Calculated spender, buys quality luxury items, budgets well',
    kaphaOption: 'Careful accumulator, saves consistently, dislikes unnecessary spending',
  },
];

export function calculatePrakritiScore(answers: Record<number, 'vata' | 'pitta' | 'kapha'>): PrakritiScore {
  let vataCount = 0;
  let pittaCount = 0;
  let kaphaCount = 0;

  const totalAnswered = Object.keys(answers).length;
  if (totalAnswered === 0) {
    return {
      vataPercentage: 33,
      pittaPercentage: 33,
      kaphaPercentage: 34,
      primaryDosha: 'vata',
      agniType: 'sama',
      recommendations: ['Complete the assessment to receive tailored recommendations.'],
    };
  }

  Object.values(answers).forEach((choice) => {
    if (choice === 'vata') vataCount++;
    if (choice === 'pitta') pittaCount++;
    if (choice === 'kapha') kaphaCount++;
  });

  const vataPercentage = Math.round((vataCount / totalAnswered) * 100);
  const pittaPercentage = Math.round((pittaCount / totalAnswered) * 100);
  const kaphaPercentage = 100 - vataPercentage - pittaPercentage;

  // Determine Primary & Secondary Dosha
  const sorted: { dosha: DoshaType; pct: number }[] = [
    { dosha: 'vata' as DoshaType, pct: vataPercentage },
    { dosha: 'pitta' as DoshaType, pct: pittaPercentage },
    { dosha: 'kapha' as DoshaType, pct: kaphaPercentage },
  ].sort((a, b) => b.pct - a.pct);

  const primaryDosha = sorted[0].dosha;
  const secondaryDosha = sorted[1].pct >= 30 ? sorted[1].dosha : undefined;

  // Derive Agni status based on question #6 or primary dosha
  let agniType: AgniType = 'sama';
  if (answers[6] === 'vata') agniType = 'visham';
  else if (answers[6] === 'pitta') agniType = 'tikshna';
  else if (answers[6] === 'kapha') agniType = 'manda';
  else {
    if (primaryDosha === 'vata') agniType = 'visham';
    else if (primaryDosha === 'pitta') agniType = 'tikshna';
    else if (primaryDosha === 'kapha') agniType = 'manda';
  }

  // Generate Clinical Recommendations
  const recommendations: string[] = [];
  if (primaryDosha === 'vata') {
    recommendations.push(
      'Favor warm, moist, unctuous foods cooked with healthy fats (cow ghee, sesame oil).',
      'Prioritize sweet, sour, and salty tastes (Madhura, Amla, Lavana).',
      'Avoid dry, cold, raw foods, and iced beverages; avoid excessive fasting.',
      'Maintain regular, predictable meal timings to steady Visham Agni.'
    );
  } else if (primaryDosha === 'pitta') {
    recommendations.push(
      'Favor cooling, moderately heavy foods with sweet, bitter, and astringent tastes (Madhura, Tikta, Kashaya).',
      'Avoid excessively spicy, pungent, fermented, and salty preparations.',
      'Incorporate cooling herbs like coriander, fennel, and coconut water.',
      'Never skip meals to prevent Tikshna Agni from causing hyperacidity.'
    );
  } else {
    recommendations.push(
      'Favor light, warm, dry, and stimulating foods with pungent, bitter, and astringent tastes (Katu, Tikta, Kashaya).',
      'Strictly avoid cold dairy (especially night curd), deep-fried snacks, and excessive sweets.',
      'Incorporate warming spices like fresh ginger, black pepper, and cumin to kindle Manda Agni.',
      'Encourage light fasting (Langhana) or skipping heavy breakfasts in favor of herbal teas.'
    );
  }

  return {
    vataPercentage,
    pittaPercentage,
    kaphaPercentage,
    primaryDosha,
    secondaryDosha,
    agniType,
    recommendations,
  };
}
