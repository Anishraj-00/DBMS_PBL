import React, { useState } from 'react';
import { X, Zap, Users, Phone, User, FileText, AlertCircle } from 'lucide-react';

export default function AllocationModal({
  isOpen,
  onClose,
  initialTable,
  initialMode = 'auto',
  availableTables = [],
  onSubmit
}) {
  if (!isOpen) return null;

  const [mode, setMode] = useState(initialTable ? 'manual' : initialMode);
  const [selectedTableId, setSelectedTableId] = useState(initialTable ? initialTable.id : (availableTables[0]?.id || ''));
  const [partySize, setPartySize] = useState(initialTable ? Math.min(2, initialTable.capacity) : 2);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedTable = availableTables.find(t => t.id === Number(selectedTableId)) || initialTable;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!partySize || partySize < 1) {
      setErrorMsg('Please specify a valid party size (at least 1).');
      return;
    }

    if (mode === 'manual' && selectedTable && partySize > selectedTable.capacity) {
      setErrorMsg(`Party size (${partySize}) exceeds table ${selectedTable.tableNumber} capacity (${selectedTable.capacity}).`);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        mode,
        tableId: mode === 'manual' ? Number(selectedTableId) : null,
        partySize: Number(partySize),
        customerName: customerName.trim() || 'Walk-in Guest',
        customerPhone: customerPhone.trim(),
        customerNotes: notes.trim()
      });
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to allocate table.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Table Check-in & Allocation</h2>
              <p className="text-xs text-slate-400">DBMS Transaction-Guarded Seat Assignment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        {!initialTable && (
          <div className="grid grid-cols-2 p-2 bg-slate-50 border-b border-slate-100 gap-2">
            <button
              type="button"
              onClick={() => setMode('auto')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                mode === 'auto'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              ⚡ Automatic Best-Fit
            </button>
            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                mode === 'manual'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Manual Table Selection
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Mode Description Banner */}
          {mode === 'auto' ? (
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-xs text-blue-800">
              💡 <strong>Best-Fit Logic:</strong> System selects the smallest available table where capacity $\ge$ party size to eliminate wasted seats.
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Table
              </label>
              {initialTable ? (
                <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-slate-200 text-xs font-semibold text-slate-800 flex justify-between items-center">
                  <span>{initialTable.tableNumber} ({initialTable.locationZone})</span>
                  <span className="text-slate-500">Max {initialTable.capacity} Seats</span>
                </div>
              ) : (
                <select
                  value={selectedTableId}
                  onChange={(e) => setSelectedTableId(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  required
                >
                  {availableTables.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.tableNumber} - Capacity {t.capacity} ({t.locationZone})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Party Size Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Party Size (Number of Guests) *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 4, 6, 8, 10].map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setPartySize(size)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    partySize === size
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-[#F8FAFC] text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {size}
                </button>
              ))}
              <input
                type="number"
                min="1"
                max="20"
                value={partySize}
                onChange={(e) => setPartySize(Number(e.target.value))}
                className="w-20 bg-[#F8FAFC] border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-center text-slate-800 focus:outline-none focus:border-blue-500"
                placeholder="Custom"
              />
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Guest Name (Optional)
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Session Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Special Requests / Notes
            </label>
            <div className="relative">
              <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. High chair needed, window table"
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {submitting ? 'Allocating...' : 'Confirm Allocation & Check-in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
