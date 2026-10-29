# BrightLoom - Ayurvedic Dietitian Cloud Practice Management & Nutrient Analysis Software

> **Academic & Engineering Reference:** Poornima College of Engineering, Department of Computer Engineering (Session 2026-27)  
> **Under Guidance of:** Dr. Brijraj Singh Solanki  
> **Project Authors:** Nihir Jain, Onik Jain, Prerna Jangid, Palak  

---

## 🌟 Overview of the Implemented Application

BrightLoom is an edge-native, multi-tenant clinical software built for Ayurvedic Dietitians. It unites traditional Ayurvedic diagnostics (*Prakriti*, *Agni*, *Guna*, *Rasa*, and *Ritucharya*) with precise biochemical nutrient quantification based on the **ICMR-NIN Indian Food Composition Tables (IFCT 2017)**.

All code, components, and data structures are self-contained inside `D:\BrightLoom\project`.

---

## 🧩 Core Implemented Modules

### 1. Practice Overview Dashboard (`src/components/dashboard/OverviewDashboard.tsx`)
- **Clinical KPIs:** Active Patients enrolled, average diet chart preparation time reduction (down from 35 mins to 7.5 mins — **78% efficiency gain**), Agni normalization rate, and IFCT food count.
- **Prakriti Distribution:** Visual real-time breakdown of clinic patient pool across Vata, Pitta, and Kapha dominance.
- **Active Case Study:** Instant view of the active patient's clinical markers, primary/secondary Dosha, metabolic fire (*Agni*), bowel motility (*Koshtha*), and BMI.

### 2. Prakriti & Agni Assessment Engine (`src/lib/ayurveda/prakriti-engine.ts` & `src/components/assessment/AssessmentView.tsx`)
- Standardized 15-factor multi-domain clinical questionnaire covering **Physical**, **Physiological**, and **Psychological** traits.
- Real-time scoring calculation outputting exact percentage ratios for Vata, Pitta, and Kapha.
- Automated classification of *Agni* (*Visham*, *Tikshna*, *Manda*, or *Sama*) with actionable clinical dietetic guidelines.

### 3. ICMR-NIN IFCT 2017 Food Database Explorer (`src/lib/data/ifct-database.ts` & `src/components/foods/FoodDatabaseView.tsx`)
- Standardized dataset of authentic Indian foods across Cereals, Pulses, Vegetables, Dairy, Spices, Fruits, and Nuts.
- Biochemical values per 100g: Calories (kcal), Protein (g), Carbohydrates (g), Fats (g), Fiber (g), Calcium (mg), Iron (mg).
- Ayurvedic attributes: *Rasa* (6 tastes), *Virya* (Ushna/Sheeta), *Vipaka*, *Guna*, and *Dosha Karma* (pacifies/aggravates).
- **Interactive Gram Scaler:** Live calculator scaling nutrients to any portion weight (e.g. 80g, 150g).

### 4. Smart Diet Chart Builder & Incompatibility Checker (`src/components/diet-planner/DietPlannerView.tsx` & `src/lib/ayurveda/compatibility-rules.ts`)
- 4-slot daily meal regimen: *Pratah* (Breakfast / 8:00 AM), *Madhyahna* (Lunch / 1:00 PM), *Sandhya* (Snack / 5:00 PM), and *Ratri* (Dinner / 8:00 PM).
- Real-time nutritional rollups compared live against patient-specific **ICMR-NIN Recommended Dietary Allowances (RDA)**.
- **Viruddha Ahara Conflict Alerts:** Real-time detection of incompatible combinations (e.g., Milk + Citrus/Fish, Curd at night, or foods aggravating the patient's diagnosed Dosha).

### 5. Longitudinal Progress Monitoring (`src/components/progress/ProgressTrackerView.tsx`)
- Multi-visit clinical history tracking weight, BMI, symptom reduction scores (1–10), and Agni normalization.
- Interactive SVG trajectory charts visualizing patient improvement over time.

### 6. Printable Clinical Diet Chart (`src/components/export/PrintableDietChart.tsx`)
- Formatted, print-ready Ayurvedic prescription chart featuring clinic branding, doctor signature block, meal schedule, and classical *Pathya* (do's) & *Apathya* (don'ts).
- One-click PDF generation via native browser print dialogue.

### 7. WhatsApp Business Dispatch (`src/components/whatsapp/WhatsAppPreviewModal.tsx`)
- Direct simulation of automated WhatsApp message dispatching with verified Meta Cloud API business badge, consultation recap, and secure PDF chart download link.

---

## 🚀 How to Run the Application Locally

```bash
# Navigate to the project directory
cd D:\BrightLoom\project

# Start the Next.js local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view and interact with the complete application.

---

## 🏗️ Architecture & Technical Stack

- **Framework:** Next.js 16.4.2 (App Router, React 19)
- **Language:** TypeScript 5 (Strict typing, zero errors)
- **Styling:** Tailwind CSS v4 with custom clinical palette
- **Icons:** Lucide React
- **Verification:** Tested with `npm run build` (Turbopack static pre-rendering, 100% green compilation).

