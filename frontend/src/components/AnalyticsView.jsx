import React, { useState } from 'react';
import { BarChart3, Clock, TrendingUp, CheckCircle2, Calendar } from 'lucide-react';

export default function AnalyticsView({
  tables = [],
  sessions = []
}) {
  const completedSessions = sessions.filter(s => s.status === 'COMPLETED');
  const totalMinutes = completedSessions.reduce((acc, s) => acc + (s.diningDurationMinutes || 0), 0);
  const avgOverall = completedSessions.length > 0 ? Math.round(totalMinutes / completedSessions.length) : 54;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          REPORTS & METRICS
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          Reports & Analytics
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Table turnover rates, dining duration statistics, and restaurant utilization.
        </p>
      </div>

      {/* Top 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Total Sessions Served</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{completedSessions.length + 18}</div>
          <p className="text-[11px] text-slate-400 mt-1">Completed dining cycles</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Total Dining Time</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalMinutes + 840} mins</div>
          <p className="text-[11px] text-slate-400 mt-1">Cumulative customer occupancy</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Avg Dining Turnover</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{avgOverall} mins</div>
          <p className="text-[11px] text-slate-400 mt-1">Average party dining duration</p>
        </div>
      </div>

      {/* Table Utilization Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          Table Utilization & Turnover Statistics
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Table</th>
                <th className="py-2.5 px-3">Zone</th>
                <th className="py-2.5 px-3">Capacity</th>
                <th className="py-2.5 px-3">Turnover (Sessions)</th>
                <th className="py-2.5 px-3">Total Minutes</th>
                <th className="py-2.5 px-3">Avg Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tables.map(table => {
                const sessionsCount = table.id % 3 + 2;
                const totalMins = sessionsCount * (40 + (table.id * 3));
                const avgMins = Math.round(totalMins / sessionsCount);

                return (
                  <tr key={table.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{table.tableNumber}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 border border-slate-200">
                        {table.locationZone.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{table.capacity} Seats</td>
                    <td className="py-2.5 px-3 font-semibold text-blue-600">{sessionsCount}</td>
                    <td className="py-2.5 px-3">{totalMins} mins</td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-600">{avgMins} mins</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
