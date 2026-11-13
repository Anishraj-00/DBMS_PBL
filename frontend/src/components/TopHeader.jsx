import React from 'react';
import { RefreshCw, Sun, Moon } from 'lucide-react';

export default function TopHeader({ activeTab, onRefresh, loading }) {
  const getTabLabel = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'floorplan': return 'Tables & Floor Plan';
      case 'customers': return 'Customers';
      case 'sessions': return 'Occupancy Sessions';
      case 'allocations': return 'Table Allocation';
      case 'cleaning': return 'Cleaning & Sanitization';
      case 'analytics': return 'Reports & Analytics';
      case 'audit': return 'Audit Trail';
      default: return 'Dashboard';
    }
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="h-14 border-b border-slate-200/90 bg-white/80 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <span className="hover:text-slate-800 cursor-pointer">Workspace</span>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{getTabLabel()}</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          {currentDate}
        </span>

        {/* Theme Toggle icon */}
        <button
          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          title="Light Theme Active"
        >
          <Sun className="w-4 h-4 text-slate-600" />
        </button>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}

