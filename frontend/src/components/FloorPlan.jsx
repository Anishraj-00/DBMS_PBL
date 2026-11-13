import React, { useState } from 'react';
import TableCard from './TableCard.jsx';
import { Filter, Plus, Zap, Layers } from 'lucide-react';

const ZONES = [
  { id: 'ALL', label: 'All Zones' },
  { id: 'MAIN_HALL', label: 'Main Hall' },
  { id: 'PATIO', label: 'Patio' },
  { id: 'BALCONY', label: 'Balcony' },
  { id: 'VIP', label: 'VIP Lounge' }
];

const STATUSES = [
  { id: 'ALL', label: 'All States' },
  { id: 'AVAILABLE', label: 'Available', dot: 'bg-emerald-500' },
  { id: 'OCCUPIED', label: 'Occupied', dot: 'bg-rose-500' },
  { id: 'CLEANING', label: 'Cleaning', dot: 'bg-amber-500' },
  { id: 'RESERVED', label: 'Reserved', dot: 'bg-blue-500' }
];

export default function FloorPlan({
  tables,
  currentRole,
  onAutoAllocateClick,
  onManualAllocateClick,
  onCheckout,
  onMarkCleaned,
  onAddTableClick,
  onEditTableClick,
  onDeleteTableClick
}) {
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filteredTables = tables.filter(table => {
    const matchesZone = selectedZone === 'ALL' || table.locationZone === selectedZone;
    const matchesStatus = selectedStatus === 'ALL' || table.status === selectedStatus;
    return matchesZone && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls: Filter by Zone & Status + Quick Actions */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 backdrop-blur-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Zone & Status Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Zone Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-700/80">
            <Layers className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {ZONES.map(zone => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedZone === zone.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {zone.label}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-lg border border-slate-700/80">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {STATUSES.map(st => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedStatus === st.id
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.dot && <span className={`w-2 h-2 rounded-full ${st.dot}`}></span>}
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onAutoAllocateClick}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            Auto Best-Fit Allocation
          </button>

          {currentRole === 'ADMIN' && (
            <button
              onClick={onAddTableClick}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm font-semibold border border-slate-600 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Table
            </button>
          )}
        </div>
      </div>

      {/* Tables Grid */}
      {filteredTables.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
          <Layers className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-300 font-medium">No tables match the selected filters.</p>
          <p className="text-xs text-slate-500 mt-1">Try switching zone or status filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTables.map(table => (
            <TableCard
              key={table.id}
              table={table}
              currentRole={currentRole}
              onAllocate={onManualAllocateClick}
              onCheckout={onCheckout}
              onMarkCleaned={onMarkCleaned}
              onEdit={onEditTableClick}
              onDelete={onDeleteTableClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

