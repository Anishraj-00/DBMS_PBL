import React from 'react';
import {
  LayoutGrid,
  Users,
  Grid,
  Clock,
  Sparkles,
  Zap,
  History,
  TrendingUp,
  Settings,
  Utensils
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'floorplan', label: 'Tables & Floor Plan', icon: Grid },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'sessions', label: 'Occupancy Sessions', icon: Clock },
    { id: 'allocations', label: 'Table Allocation', icon: Zap },
    { id: 'cleaning', label: 'Cleaning & Status', icon: Sparkles },
    { id: 'analytics', label: 'Reports & Analytics', icon: TrendingUp },
    { id: 'audit', label: 'Audit Trail', icon: History },
  ];

  return (
    <aside className="w-64 bg-[#0B1727] text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-[#152338]">
      {/* Brand Header */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-[#152338]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-blue-500/20">
            S
          </div>
          <div className="flex items-baseline">
            <span className="text-xl font-bold tracking-tight text-white font-sans">serviqo</span>
            <span className="text-blue-500 font-bold text-xl">.</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-5">
          <div className="px-3 mb-2 text-[11px] font-bold text-slate-400/80 tracking-wider uppercase">
            WORKSPACE
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#182844] text-white shadow-sm font-semibold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-[#122036]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Settings (Soon) */}
            <div className="pt-2">
              <button
                disabled
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Settings</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                  SOON
                </span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Bottom Live Workspace Indicator */}
      <div className="p-4 border-t border-[#152338]">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse"></span>
          <span className="text-[11px] font-medium text-slate-300">Dashboard workspace</span>
        </div>
      </div>
    </aside>
  );
}

