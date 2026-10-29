'use client';

import React, { useState } from 'react';
import { Patient, DietPlan } from '@/lib/types/ayurveda';
import { MessageCircle, CheckCircle2, Clock, Send, ShieldCheck, ArrowLeft } from 'lucide-react';

interface WhatsAppPreviewModalProps {
  currentPatient: Patient;
  dietPlan: DietPlan;
  onBack: () => void;
}

export const WhatsAppPreviewModal: React.FC<WhatsAppPreviewModalProps> = ({
  currentPatient,
  dietPlan,
  onBack,
}) => {
  const [sendStatus, setSendStatus] = useState<'idle' | 'queued' | 'delivered'>('idle');

  const messageText = `Namaste ${currentPatient.name}! 🙏

Your personalized Ayurvedic Diet Plan from *AyurVibe* is ready for the ${dietPlan.season} season.

📋 *Plan Title:* ${dietPlan.planTitle}
🔥 *Digestive Fire Status:* ${currentPatient.currentAgni.toUpperCase()} AGNI
🌿 *Constitutional Focus:* ${currentPatient.prakritiPrimary.toUpperCase()} Dosha Balance
⚡ *Daily Calorie Target:* ${dietPlan.targetCalories} kcal

📥 *Download Printable PDF Chart:*
https://cdn.ayurvibe.app/charts/patient_${currentPatient.id}_autumn.pdf

💡 *Key Guideline:*
Always take meals warm and freshly cooked. Avoid chilled drinks or raw salads at night.

For any queries, reply directly to this message. Wishing you vitality and balance!`;

  const handleSend = () => {
    setSendStatus('queued');
    setTimeout(() => {
      setSendStatus('delivered');
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Planner</span>
        </button>

        <div className="flex items-center space-x-1 text-emerald-700 text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Meta Cloud API &bull; Verified Business Account</span>
        </div>
      </div>

      {/* WhatsApp Chat Simulator Screen */}
      <div className="bg-[#EFEAE2] rounded-3xl p-6 border border-slate-300 shadow-md">
        {/* Top Chat Bar */}
        <div className="bg-[#075E54] text-white px-4 py-3 rounded-2xl flex items-center space-x-3 mb-4 shadow-xs">
          <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white text-xs">
            AV
          </div>
          <div>
            <span className="font-bold text-sm block">AyurVibe Clinical Health</span>
            <span className="text-[10px] text-emerald-200 flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-300" /> WhatsApp Official Business
            </span>
          </div>
        </div>

        {/* Message Bubble */}
        <div className="flex justify-end">
          <div className="bg-[#DCF8C6] text-slate-900 text-xs rounded-2xl rounded-tr-xs p-4 max-w-md shadow-xs space-y-2 leading-relaxed">
            <p className="whitespace-pre-line">{messageText}</p>
            <div className="flex items-center justify-end space-x-1 text-[10px] text-slate-500 pt-1">
              <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {sendStatus === 'delivered' ? (
                <span className="text-blue-600 font-bold">&check;&check;</span>
              ) : sendStatus === 'queued' ? (
                <Clock className="w-3 h-3 text-slate-400" />
              ) : (
                <span className="text-slate-400">&check;</span>
              )}
            </div>
          </div>
        </div>

        {/* Dispatch Controls */}
        <div className="mt-6 pt-4 border-t border-slate-300/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            Recipient: <strong className="text-slate-900">{currentPatient.name}</strong> ({currentPatient.phone})
          </div>

          <button
            onClick={handleSend}
            disabled={sendStatus !== 'idle'}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-xs ${
              sendStatus === 'delivered'
                ? 'bg-emerald-600 text-white cursor-default'
                : sendStatus === 'queued'
                ? 'bg-amber-500 text-white cursor-wait'
                : 'bg-[#25D366] hover:bg-[#20BA5A] text-white'
            }`}
          >
            {sendStatus === 'delivered' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Delivered to Patient's WhatsApp</span>
              </>
            ) : sendStatus === 'queued' ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Queued in Cloudflare Outbox...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send via WhatsApp API</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

