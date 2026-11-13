import React, { useState, useEffect } from 'react';
import { Plus, Zap, Filter, Layers, Clock, Users, Sparkles, CheckCircle2 } from 'lucide-react';

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

export default function FloorPlanView({
  tables = [],
  onAutoAllocate,
  onManualAllocate,
  onCheckout,
  onMarkCleaned,
  onAddTable,
  onEditTable,
  onDeleteTable
}) {
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const filteredTables = tables.filter(t => {
    const matchesZone = selectedZone === 'ALL' || t.locationZone === selectedZone;
    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    return matchesZone && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'OCCUPIED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'CLEANING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'RESERVED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
            TABLE MANAGEMENT
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Tables & Floor Plan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual table map, seating allocations, and live occupancy status.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={onAutoAllocate}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Auto Best-Fit Allocation</span>
          </button>

          <button
            onClick={onAddTable}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-slate-500" />
            <span>Add Table</span>
          </button>
        </div>
      </div>

      {/* Main Container Card: Table Directory & Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        {/* Filter Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Zone Selector */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <Layers className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
              {ZONES.map(z => (
                <button
                  key={z.id}
                  onClick={() => setSelectedZone(z.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    selectedZone === z.id
                      ? 'bg-blue-600 text-white shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
              {STATUSES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    selectedStatus === s.id
                      ? 'bg-slate-800 text-white shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {s.dot && <span className={`w-2 h-2 rounded-full ${s.dot}`}></span>}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs font-medium text-slate-400">
            Showing {filteredTables.length} of {tables.length} tables
          </span>
        </div>

        {/* 2-Column or 3-Column Grid of Table Cards */}
        {filteredTables.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No tables match the selected zone or status filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredTables.map(table => {
              const elapsedMins = table.occupiedSince
                ? Math.max(1, Math.floor((now - new Date(table.occupiedSince).getTime()) / 60000))
                : 0;

              return (
                <div
                  key={table.id}
                  className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Card Top: Table Number & Status Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-800 text-sm border border-slate-200">
                          {table.tableNumber}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Table {table.tableNumber}
                          </h3>
                          <span className="text-[11px] text-slate-400">
                            {table.locationZone.replace('_', ' ')}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(table.status)}`}>
                        {table.status}
                      </span>
                    </div>

                    {/* Field Boxes Grid */}
                    <div className="grid grid-cols-2 gap-2.5 mb-3">
                      <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-lg p-2.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          CAPACITY
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {table.capacity} Guests
                        </span>
                      </div>

                      <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-lg p-2.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                          ZONE
                        </span>
                        <span className="text-xs font-semibold text-slate-800">
                          {table.locationZone.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Occupancy or Status Details Box */}
                    {table.status === 'OCCUPIED' && (
                      <div className="bg-[#F8FAFC] border border-rose-200/80 rounded-lg p-2.5 mb-4 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Active Guest:</span>
                          <span className="font-bold text-rose-700 truncate max-w-[150px]">
                            {table.activeCustomerName || 'Walk-in'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400">Party Size:</span>
                          <span className="font-semibold text-slate-800">{table.activePartySize} guests</span>
                        </div>
                        <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-200/60">
                          <span className="text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-rose-500" /> Dining Time:
                          </span>
                          <span className="font-mono font-bold text-rose-600">{elapsedMins} mins</span>
                        </div>
                      </div>
                    )}

                    {table.status === 'CLEANING' && (
                      <div className="bg-[#F8FAFC] border border-amber-200/80 rounded-lg p-2.5 mb-4 text-xs text-amber-800 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Table vacated. Wipe-down & sanitization needed.</span>
                      </div>
                    )}

                    {table.status === 'AVAILABLE' && (
                      <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-lg p-2.5 mb-4 text-xs text-slate-500">
                        Ready to seat a party of up to {table.capacity} guests.
                      </div>
                    )}

                    {table.status === 'RESERVED' && (
                      <div className="bg-[#F8FAFC] border border-blue-200/80 rounded-lg p-2.5 mb-4 text-xs text-blue-700">
                        Reserved for {table.activeCustomerName || 'Patron'}. Ready for arrival.
                      </div>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {table.status === 'AVAILABLE' && (
                        <button
                          onClick={() => onManualAllocate(table)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          Seat Party
                        </button>
                      )}

                      {table.status === 'OCCUPIED' && (
                        <button
                          onClick={() => onCheckout(table)}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          Checkout & Clean
                        </button>
                      )}

                      {table.status === 'CLEANING' && (
                        <button
                          onClick={() => onMarkCleaned(table)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          Mark Cleaned
                        </button>
                      )}

                      {table.status === 'RESERVED' && (
                        <button
                          onClick={() => onManualAllocate(table)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                        >
                          Check-in Guest
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEditTable(table)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-50"
                        title="Edit Table"
                      >
                        <span className="text-xs font-medium">Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteTable(table)}
                        disabled={table.status === 'OCCUPIED'}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete Table"
                      >
                        <span className="text-xs font-medium">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Container Footer */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100 text-[11px] text-slate-400">
          <span>{tables.length} total restaurant tables</span>
          <span>Automatic best-fit capacity optimization active</span>
        </div>
      </div>
    </div>
  );
}

