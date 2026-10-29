'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar, NavTab } from '@/components/layout/Sidebar';
import { OverviewDashboard } from '@/components/dashboard/OverviewDashboard';
import { AssessmentView } from '@/components/assessment/AssessmentView';
import { FoodDatabaseView } from '@/components/foods/FoodDatabaseView';
import { DietPlannerView } from '@/components/diet-planner/DietPlannerView';
import { ProgressTrackerView } from '@/components/progress/ProgressTrackerView';
import { PrintableDietChart } from '@/components/export/PrintableDietChart';
import { WhatsAppPreviewModal } from '@/components/whatsapp/WhatsAppPreviewModal';

import { SAMPLE_PATIENTS, INITIAL_DIET_PLAN } from '@/lib/data/sample-patients';
import { Patient, DietPlan, PrakritiScore } from '@/lib/types/ayurveda';
import { validateMealCompatibility } from '@/lib/ayurveda/compatibility-rules';

export default function AyurVibeApp() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [patients, setPatients] = useState<Patient[]>(SAMPLE_PATIENTS);
  const [currentPatient, setCurrentPatient] = useState<Patient>(SAMPLE_PATIENTS[0]);
  const [dietPlan, setDietPlan] = useState<DietPlan>(INITIAL_DIET_PLAN);
  const activeSeason = 'Sharad (Autumn)';

  // Calculate live alerts count for the sidebar badge
  const liveAlerts = validateMealCompatibility(
    dietPlan.meals,
    currentPatient.prakritiPrimary,
    dietPlan.season
  );

  const handleUpdatePatientDosha = (patientId: string, score: PrakritiScore) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            prakritiPrimary: score.primaryDosha,
            prakritiSecondary: score.secondaryDosha,
            currentAgni: score.agniType,
          };
        }
        return p;
      })
    );

    if (currentPatient.id === patientId) {
      setCurrentPatient((prev) => ({
        ...prev,
        prakritiPrimary: score.primaryDosha,
        prakritiSecondary: score.secondaryDosha,
        currentAgni: score.agniType,
      }));
    }

    alert(`Successfully saved ${score.primaryDosha.toUpperCase()} diagnosis and ${score.agniType.toUpperCase()} Agni to ${currentPatient.name}'s clinical profile.`);
  };

  const handleUpdateDietPlan = (updated: DietPlan) => {
    setDietPlan(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentPatient={currentPatient}
        patients={patients}
        onSelectPatient={(p) => {
          setCurrentPatient(p);
          setDietPlan((prev) => ({
            ...prev,
            patientId: p.id,
            patientName: p.name,
          }));
        }}
        activeSeason={activeSeason}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <div className="no-print">
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
            viruddhaAlertCount={liveAlerts.length}
          />
        </div>

        {/* Center Content View Area */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <OverviewDashboard
              currentPatient={currentPatient}
              patients={patients}
              activeDietPlan={dietPlan}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectPatient={(p) => {
                setCurrentPatient(p);
                setDietPlan((prev) => ({
                  ...prev,
                  patientId: p.id,
                  patientName: p.name,
                }));
              }}
            />
          )}

          {activeTab === 'assessment' && (
            <AssessmentView
              currentPatient={currentPatient}
              onUpdatePatientDosha={handleUpdatePatientDosha}
              onNavigateToDietPlanner={() => setActiveTab('diet-planner')}
            />
          )}

          {activeTab === 'foods' && <FoodDatabaseView />}

          {activeTab === 'diet-planner' && (
            <DietPlannerView
              currentPatient={currentPatient}
              dietPlan={dietPlan}
              onUpdateDietPlan={handleUpdateDietPlan}
              onNavigateToPrint={() => setActiveTab('export')}
              onNavigateToWhatsApp={() => setActiveTab('whatsapp')}
            />
          )}

          {activeTab === 'progress' && (
            <ProgressTrackerView currentPatient={currentPatient} />
          )}

          {activeTab === 'export' && (
            <PrintableDietChart
              currentPatient={currentPatient}
              dietPlan={dietPlan}
              onBack={() => setActiveTab('diet-planner')}
            />
          )}

          {activeTab === 'whatsapp' && (
            <WhatsAppPreviewModal
              currentPatient={currentPatient}
              dietPlan={dietPlan}
              onBack={() => setActiveTab('diet-planner')}
            />
          )}
        </main>
      </div>
    </div>
  );
}

