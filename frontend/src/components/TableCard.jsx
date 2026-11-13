import React, { useState, useEffect } from 'react';
import { Users, Clock, Sparkles, CheckCircle, Trash2, Edit3, ArrowRightCircle, AlertCircle } from 'lucide-react';

export default function TableCard({
  table,
  currentRole,
  onAllocate,
  onCheckout,
  onMarkCleaned,
  onEdit,
  onDelete
}) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Live timer for occupied tables
  useEffect(() => {
    if (table.status === 'OCCUPIED' && table.occupiedSince) {
      const updateElapsed = () => {
        const start = new Date(table.occupiedSince).getTime();
        const now = Date.now();
        const diffMins = Math.max(0, Math.floor((now - start) / 60000));
        setElapsedMinutes(diffMins);
      };
      updateElapsed();
      const interval = setInterval(updateElapsed, 30000); // Update every 30s
      return () => clearInterval(interval);
    }
  }, [table.status, table.occupiedSince]);

  const getStatusStyles = () => {
    switch (table.status) {
      case 'AVAILABLE':
        return {
          border: 'border-emerald-500/30 hover:border-emerald-500/60',
          bg: 'bg-emerald-950/20',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          iconColor: 'text-emerald-400',
          indicator: 'bg-emerald-500 shadow-emerald-500/50'
        };
      case 'OCCUPIED':
        return {
          border: 'border-rose-500/40 hover:border-rose-500/70',
          bg: 'bg-rose-950/25',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          iconColor: 'text-rose-400',
          indicator: 'bg-rose-500 shadow-rose-500/50 animate-pulse'
        };
      case 'CLEANING':
        return {
          border: 'border-amber-500/40 hover:border-amber-500/70',
          bg: 'bg-amber-950/20',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          iconColor: 'text-amber-400',
          indicator: 'bg-amber-500 shadow-amber-500/50'
        };
      case 'RESERVED':
        return {
          border: 'border-blue-500/40 hover:border-blue-500/70',
          bg: 'bg-blue-950/20',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          iconColor: 'text-blue-400',
          indicator: 'bg-blue-500 shadow-blue-500/50'
        };
      default:
        return {
          border: 'border-slate-700',
          bg: 'bg-slate-800/50',
          badge: 'bg-slate-700 text-slate-300',
          iconColor: 'text-slate-400',
          indicator: 'bg-slate-500'
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div
      className={`relative rounded-xl border backdrop-blur-sm p-4 transition-all duration-200 flex flex-col justify-between shadow-lg ${styles.bg} ${styles.border}`}
    >
      {/* Top Header: Table Number & Status Indicator */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full shadow-sm ${styles.indicator}`}></span>
            <h3 className="font-bold text-lg text-white tracking-wide">{table.tableNumber}</h3>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${styles.badge}`}>
            {table.status}
          </span>
        </div>

        {/* Capacity & Zone */}
        <div className="flex items-center gap-3 text-xs text-slate-300 mb-3">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Capacity: <strong className="text-white">{table.capacity}</strong></span>
          </div>
          <span className="text-slate-600">•</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-800/80 text-[10px] uppercase tracking-wider text-slate-300 border border-slate-700">
            {table.locationZone.replace('_', ' ')}
          </span>
        </div>

        {/* Occupied State Info */}
        {table.status === 'OCCUPIED' && (
          <div className="bg-slate-900/60 rounded-lg p-2.5 border border-rose-500/20 mb-3 space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Guest:</span>
              <span className="font-semibold text-rose-200 truncate max-w-[130px]">
                {table.activeCustomerName || 'Walk-in'}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Party Size:</span>
              <span className="text-slate-200 font-medium">{table.activePartySize} guests</span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-rose-400" /> Dining Time:
              </span>
              <span className="font-mono font-bold text-rose-400">{elapsedMinutes} mins</span>
            </div>
          </div>
        )}

        {/* Cleaning State Info */}
        {table.status === 'CLEANING' && (
          <div className="bg-slate-900/60 rounded-lg p-2.5 border border-amber-500/20 mb-3 text-xs text-amber-300/90 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Table vacated. Needs wipe down & sanitization.</span>
          </div>
        )}

        {/* Available State Info */}
        {table.status === 'AVAILABLE' && (
          <p className="text-xs text-slate-400 mb-3">
            Ready to seat up to {table.capacity} guests immediately.
          </p>
        )}
      </div>

      {/* Action Buttons based on Status */}
      <div className="pt-2 border-t border-slate-700/50 flex flex-col gap-2">
        {table.status === 'AVAILABLE' && (
          <button
            onClick={() => onAllocate(table)}
            className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
          >
            <ArrowRightCircle className="w-3.5 h-3.5" />
            Assign Party / Check-in
          </button>
        )}

        {table.status === 'OCCUPIED' && (
          <button
            onClick={() => onCheckout(table)}
            className="w-full py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
          >
            <Clock className="w-3.5 h-3.5" />
            Checkout & Clean
          </button>
        )}

        {table.status === 'CLEANING' && (
          <button
            onClick={() => onMarkCleaned(table)}
            className="w-full py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Mark Cleaned & Available
          </button>
        )}

        {table.status === 'RESERVED' && (
          <button
            onClick={() => onAllocate(table)}
            className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
          >
            Check-in Reserved Guest
          </button>
        )}

        {/* Admin Tools: Edit & Delete */}
        {currentRole === 'ADMIN' && (
          <div className="flex items-center justify-end gap-1 pt-1">
            <button
              onClick={() => onEdit(table)}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded"
              title="Edit Table"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(table)}
              disabled={table.status === 'OCCUPIED'}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
              title={table.status === 'OCCUPIED' ? 'Cannot delete occupied table' : 'Delete Table'}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

