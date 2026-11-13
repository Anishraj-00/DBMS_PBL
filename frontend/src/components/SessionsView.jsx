import React from 'react';
import { Clock, Users, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SessionsView({
  sessions = [],
  tables = [],
  onCheckout
}) {
  const activeSessions = sessions.filter(s => s.status === 'ACTIVE');
  const completedSessions = sessions.filter(s => s.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
          SESSION MANAGEMENT
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          Occupancy Sessions
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time dining duration calculation and table session records.
        </p>
      </div>

      {/* Active Sessions Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Dining Sessions</h2>
            <p className="text-xs text-slate-400 mt-0.5">Parties currently dining at tables</p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">
            {activeSessions.length} Active Diners
          </span>
        </div>

        {activeSessions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No active dining sessions at this moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeSessions.map(session => (
              <div
                key={session.id}
                className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-blue-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                      <h3 className="font-bold text-sm text-slate-900">
                        {session.tableNumber} &bull; {session.customerName}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      #{session.id}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-lg p-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        PARTY SIZE
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        {session.partySize} Guests
                      </span>
                    </div>

                    <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-lg p-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                        ALLOCATION TYPE
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        {session.allocationType}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-lg p-2.5 mb-3 text-xs text-slate-600">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                      CHECK-IN TIME
                    </span>
                    <span className="font-mono text-slate-700">
                      {new Date(session.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Host: <strong className="text-slate-700">{session.staffName || 'Server'}</strong>
                  </span>
                  <button
                    onClick={() => {
                      const tableObj = tables.find(t => t.id === session.tableId) || { id: session.tableId, tableNumber: session.tableNumber };
                      onCheckout(tableObj);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Checkout & Clean
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Sessions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <h2 className="text-base font-bold text-slate-900 mb-4">Completed Dining History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Session</th>
                <th className="py-2.5 px-3">Table</th>
                <th className="py-2.5 px-3">Guest Name</th>
                <th className="py-2.5 px-3">Party</th>
                <th className="py-2.5 px-3">Check-In</th>
                <th className="py-2.5 px-3">Checkout</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {completedSessions.map(session => (
                <tr key={session.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono text-slate-400">#{session.id}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{session.tableNumber}</td>
                  <td className="py-2.5 px-3 font-medium">{session.customerName}</td>
                  <td className="py-2.5 px-3">{session.partySize} guests</td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {new Date(session.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">
                    {session.checkOutTime ? new Date(session.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-emerald-600">
                    {session.diningDurationMinutes} mins
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

