import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Edit3, AlertCircle } from 'lucide-react';

const ZONES = ['MAIN_HALL', 'PATIO', 'BALCONY', 'VIP'];

export default function AddTableModal({
  isOpen,
  onClose,
  tableToEdit,
  onSubmit
}) {
  if (!isOpen) return null;

  const [tableNumber, setTableNumber] = useState('');
  const [capacity, setCapacity] = useState(4);
  const [locationZone, setLocationZone] = useState('MAIN_HALL');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (tableToEdit) {
      setTableNumber(tableToEdit.tableNumber);
      setCapacity(tableToEdit.capacity);
      setLocationZone(tableToEdit.locationZone);
    } else {
      setTableNumber('');
      setCapacity(4);
      setLocationZone('MAIN_HALL');
    }
    setErrorMsg('');
  }, [tableToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableNumber.trim()) {
      setErrorMsg('Table number cannot be blank.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        tableNumber: tableNumber.trim().toUpperCase(),
        capacity: Number(capacity),
        locationZone
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save table.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            {tableToEdit ? (
              <Edit3 className="w-5 h-5 text-blue-600" />
            ) : (
              <PlusCircle className="w-5 h-5 text-emerald-600" />
            )}
            <h2 className="text-base font-bold text-slate-900">
              {tableToEdit ? `Edit Table: ${tableToEdit.tableNumber}` : 'Add Restaurant Table'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Table Number *
            </label>
            <input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g. T-07, VIP-03"
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 uppercase focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Capacity (Seats) *
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Zone *
            </label>
            <select
              value={locationZone}
              onChange={(e) => setLocationZone(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              {ZONES.map(z => (
                <option key={z} value={z}>
                  {z.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm"
            >
              {submitting ? 'Saving...' : (tableToEdit ? 'Save Changes' : 'Create Table')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
