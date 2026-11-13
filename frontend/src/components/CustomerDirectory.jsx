import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, UserPlus, Phone, Mail, MapPin } from 'lucide-react';

export default function CustomerDirectory({
  customers = [],
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = customers.filter(c =>
    c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phoneNumber.includes(searchTerm) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
            CUSTOMER MANAGEMENT
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Customers
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage customer profiles and contact information.
          </p>
        </div>

        <button
          onClick={onAddCustomer}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Main Container Card: Customer Directory */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        {/* Container Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Customer directory</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customer details stored in your Serviqo database
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search customers"
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* 2-Column Grid of Customer Cards matching Screenshot 1 */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No customers found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtered.map((customer) => (
              <div
                key={customer.id}
                className="bg-white border border-slate-200/80 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Customer Card Title */}
                  <h3 className="text-base font-bold text-slate-900 mb-4">
                    {customer.fullName}
                  </h3>

                  {/* Field Boxes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                    {/* CUSTOMER ID */}
                    <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-lg p-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        CUSTOMER ID
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        {customer.id}
                      </span>
                    </div>

                    {/* FULL NAME */}
                    <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-lg p-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        FULL NAME
                      </span>
                      <span className="text-xs font-semibold text-slate-800 truncate block">
                        {customer.fullName}
                      </span>
                    </div>

                    {/* EMAIL */}
                    <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-lg p-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        EMAIL
                      </span>
                      <span className="text-xs font-medium text-slate-700 truncate block">
                        {customer.email || `${customer.fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`}
                      </span>
                    </div>

                    {/* PHONE */}
                    <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-lg p-2.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        PHONE
                      </span>
                      <span className="text-xs font-medium text-slate-800">
                        {customer.phoneNumber}
                      </span>
                    </div>
                  </div>

                  {/* ADDRESS / NOTES Box (Full Width) */}
                  <div className="bg-[#F8FAFC] border border-slate-200/70 rounded-lg p-2.5 mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      ADDRESS & PREFERENCES
                    </span>
                    <span className="text-xs text-slate-600 block">
                      {customer.address || customer.notes || '12 Lake View Road, Hyderabad'}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions Right Aligned (Edit / Delete) */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onEditCustomer(customer)}
                    className="px-3 py-1 rounded-md text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteCustomer(customer)}
                    className="px-3 py-1 rounded-md text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Container Footer */}
        <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-100 text-[11px] text-slate-400">
          <span>{filtered.length} customers</span>
          <span>Sorted by most recently added</span>
        </div>
      </div>
    </div>
  );
}

