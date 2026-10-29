'use client';

import React from 'react';
import {
  LayoutDashboard,
  HeartPulse,
  Apple,
  CalendarDays,
  LineChart,
  Printer,
  MessageCircle,
  Sparkles,
} from 'lucide-react';

export type NavTab =
  | 'overview'
  | 'assessment'
  | 'foods'
  | 'diet-planner'
  | 'progress'
  | 'export'
  | 'whatsapp';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  viruddhaAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  viruddhaAlertCount,
}) => {
  const navItems = [
    {
      id: 'overview' as NavTab,
      label: 'Practice Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'assessment' as NavTab,
      label: 'Prakriti & Agni Assessment',
      icon: HeartPulse,
      badge: 'Diagnostics',
    },
    {
      id: 'foods' as NavTab,
      label: 'ICMR-NIN Food Database',
      icon: Apple,
      badge: '528 Foods',
    },
    {
      id: 'diet-planner' as NavTab,
      label: 'Ayurvedic Diet Planner',
      icon: CalendarDays,
      badge: viruddhaAlertCount > 0 ? `${viruddhaAlertCount} Alerts` : null,
      badgeColor: viruddhaAlertCount > 0 ? 'bg-amber-100 text-amber-800' : undefined,
    },
    {
      id: 'progress' as NavTab,
      label: 'Progress & Compliance',
      icon: LineChart,
      badge: null,
    },
    {
      id: 'export' as NavTab,
      label: 'Printable Diet Chart',
      icon: Printer,
      badge: 'PDF Ready',
    },
    {
      id: 'whatsapp' as NavTab,
      label: 'WhatsApp Dispatch',
      icon: MessageCircle,
      badge: 'Meta API',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-61px)] flex flex-col justify-between py-4 px-3">
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Clinical Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isActive
                      ? 'bg-indigo-700 text-white'
                      : item.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cloud & Edge Status Footer */}
      <div className="p-3 bg-gradient-to-br from-indigo-50 to-slate-50 rounded-xl border border-indigo-100/60 text-xs">
        <div className="flex items-center space-x-2 text-indigo-900 font-bold mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Cloudflare Edge Active</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Cloudflare D1 edge database synchronized with Better-Auth multi-tenant isolation.
        </p>
      </div>
    </aside>
  );
};

