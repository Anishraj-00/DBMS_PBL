import React, { useState, useEffect } from 'react';
import { tableApi } from '../api/tableApi.js';
import { Users, UserPlus, Phone, Search, AlertCircle, CheckCircle } from 'lucide-react';

export default function CustomerView() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await tableApi.getCustomers();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      await tableApi.createCustomer({ fullName, phoneNumber, notes });
      setMsg({ type: 'success', text: 'Customer registered successfully!' });
      setFullName('');
      setPhoneNumber('');
      setNotes('');
      setShowAddForm(false);
      loadCustomers();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to register customer.' });
    }
  };

  const filtered = customers.filter(c =>
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phoneNumber.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 backdrop-blur flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer by name or phone..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          {showAddForm ? 'Close Form' : 'Register Customer'}
        </button>
      </div>

      {msg && (
        <div className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
          msg.type === 'success'
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
        }`}>
          {msg.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleCreateCustomer} className="bg-slate-800/80 border border-indigo-500/30 rounded-xl p-5 backdrop-blur space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-indigo-400" />
            New Customer Registration
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91 9876543210"
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Preferences / Dietary Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Prefers window table, vegetarian"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-lg bg-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md shadow-indigo-600/30"
            >
              Save Customer
            </button>
          </div>
        </form>
      )}

      {/* Customer Table */}
      <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-5 backdrop-blur">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          Registered Customers ({filtered.length})
        </h3>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Loading customer directory...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">No customers found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Customer Name</th>
                  <th className="py-2.5 px-3">Phone Number</th>
                  <th className="py-2.5 px-3">Notes & Preferences</th>
                  <th className="py-2.5 px-3">Registered On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-500">#{c.id}</td>
                    <td className="py-2.5 px-3 font-semibold text-white">{c.fullName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {c.phoneNumber}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">{c.notes || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

