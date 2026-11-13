import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import TopHeader from './components/TopHeader.jsx';
import DashboardView from './components/DashboardView.jsx';
import FloorPlanView from './components/FloorPlanView.jsx';
import CustomerDirectory from './components/CustomerDirectory.jsx';
import SessionsView from './components/SessionsView.jsx';
import AnalyticsView from './components/AnalyticsView.jsx';
import AuditLogsView from './components/AuditLogsModal.jsx';
import AllocationModal from './components/AllocationModal.jsx';
import AddCustomerModal from './components/AddCustomerModal.jsx';
import AddTableModal from './components/AddTableModal.jsx';
import { INITIAL_TABLES, INITIAL_CUSTOMERS, INITIAL_SESSIONS, INITIAL_LOGS } from './data/sampleData.js';
import { tableApi } from './api/tableApi.js';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tables, setTables] = useState(INITIAL_TABLES);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Modals
  const [allocModalOpen, setAllocModalOpen] = useState(false);
  const [selectedTableForAlloc, setSelectedTableForAlloc] = useState(null);
  const [allocMode, setAllocMode] = useState('auto');

  const [customerModalOpen, setCustomerModalOpen] = useState(false);

  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [tableToEdit, setTableToEdit] = useState(null);

  useEffect(() => {
    syncWithBackend();
  }, []);

  const showNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const syncWithBackend = async () => {
    try {
      setLoading(true);
      const [backendTables, backendCustomers, backendSessions, backendLogs] = await Promise.all([
        tableApi.getTables().catch(() => null),
        tableApi.getCustomers().catch(() => null),
        tableApi.getAllSessions().catch(() => null),
        tableApi.getRecentLogs().catch(() => null)
      ]);

      if (backendTables && backendTables.length > 0) setTables(backendTables);
      if (backendCustomers && backendCustomers.length > 0) setCustomers(backendCustomers);
      if (backendSessions && backendSessions.length > 0) setSessions(backendSessions);
      if (backendLogs && backendLogs.length > 0) setLogs(backendLogs);
    } catch (err) {
      console.log('Running in rich sample data mode');
    } finally {
      setLoading(false);
    }
  };

  // Allocation Handlers
  const handleOpenAutoAlloc = () => {
    setSelectedTableForAlloc(null);
    setAllocMode('auto');
    setAllocModalOpen(true);
  };

  const handleOpenManualAlloc = (table) => {
    setSelectedTableForAlloc(table);
    setAllocMode('manual');
    setAllocModalOpen(true);
  };

  const handleSubmitAllocation = async (formData) => {
    try {
      // Attempt backend API first
      let result;
      if (formData.mode === 'auto') {
        result = await tableApi.allocateAuto({
          partySize: formData.partySize,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerNotes: formData.customerNotes
        }).catch(() => null);
      } else {
        result = await tableApi.allocateManual({
          tableId: formData.tableId,
          partySize: formData.partySize,
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerNotes: formData.customerNotes
        }).catch(() => null);
      }

      if (result) {
        showNotification('success', `Table ${result.tableNumber} allocated successfully!`);
        syncWithBackend();
      } else {
        // Fallback local state update with Best-Fit simulation
        let chosenTable;
        if (formData.mode === 'auto') {
          const candidates = tables
            .filter(t => t.status === 'AVAILABLE' && t.capacity >= formData.partySize)
            .sort((a, b) => a.capacity - b.capacity);

          if (candidates.length === 0) {
            throw new Error(`No available table found for party size of ${formData.partySize}.`);
          }
          chosenTable = candidates[0];
        } else {
          chosenTable = tables.find(t => t.id === formData.tableId);
          if (!chosenTable || chosenTable.status !== 'AVAILABLE') {
            throw new Error(`Table ${chosenTable?.tableNumber || ''} is not available.`);
          }
        }

        const newSession = {
          id: Date.now(),
          tableId: chosenTable.id,
          tableNumber: chosenTable.tableNumber,
          customerId: Date.now(),
          customerName: formData.customerName || 'Walk-in Guest',
          customerPhone: formData.customerPhone || '9000000000',
          partySize: formData.partySize,
          status: 'ACTIVE',
          allocationType: formData.mode.toUpperCase(),
          checkInTime: new Date().toISOString(),
          checkOutTime: null,
          diningDurationMinutes: null,
          staffName: 'John Waiter',
          notes: formData.customerNotes
        };

        setTables(prev => prev.map(t => t.id === chosenTable.id ? {
          ...t,
          status: 'OCCUPIED',
          activeSessionId: newSession.id,
          activeCustomerName: newSession.customerName,
          activePartySize: newSession.partySize,
          occupiedSince: newSession.checkInTime
        } : t));

        setSessions(prev => [newSession, ...prev]);

        setLogs(prev => [{
          id: Date.now(),
          table: { id: chosenTable.id, tableNumber: chosenTable.tableNumber },
          previousStatus: 'AVAILABLE',
          newStatus: 'OCCUPIED',
          reason: `Customer check-in (${formData.mode} allocation)`,
          changedAt: new Date().toISOString()
        }, ...prev]);

        showNotification('success', `Table ${chosenTable.tableNumber} allocated successfully for party of ${formData.partySize}!`);
      }
    } catch (err) {
      showNotification('error', err.message || 'Allocation failed');
      throw err;
    }
  };

  // Checkout Handler
  const handleCheckout = async (table) => {
    try {
      const res = await tableApi.checkoutByTable(table.id).catch(() => null);
      if (res) {
        showNotification('success', `Table ${table.tableNumber} checked out! Table now in CLEANING state.`);
        syncWithBackend();
      } else {
        // Fallback local update
        const tableObj = tables.find(t => t.id === table.id);
        const startTime = tableObj?.occupiedSince ? new Date(tableObj.occupiedSince).getTime() : Date.now() - 45 * 60000;
        const duration = Math.max(1, Math.floor((Date.now() - startTime) / 60000));

        setTables(prev => prev.map(t => t.id === table.id ? {
          ...t,
          status: 'CLEANING',
          activeSessionId: null,
          activeCustomerName: null,
          activePartySize: null,
          occupiedSince: null
        } : t));

        setSessions(prev => prev.map(s => (s.tableId === table.id && s.status === 'ACTIVE') ? {
          ...s,
          status: 'COMPLETED',
          checkOutTime: new Date().toISOString(),
          diningDurationMinutes: duration
        } : s));

        setLogs(prev => [{
          id: Date.now(),
          table: { id: table.id, tableNumber: table.tableNumber },
          previousStatus: 'OCCUPIED',
          newStatus: 'CLEANING',
          reason: `Customer checkout (${duration} mins)`,
          changedAt: new Date().toISOString()
        }, ...prev]);

        showNotification('success', `Table ${table.tableNumber} checked out! Dining duration: ${duration} mins. Table marked for CLEANING.`);
      }
    } catch (err) {
      showNotification('error', 'Checkout failed');
    }
  };

  // Mark Cleaned Handler
  const handleMarkCleaned = async (table) => {
    try {
      const res = await tableApi.updateStatus(table.id, 'AVAILABLE', 'Cleaning completed').catch(() => null);
      if (res) {
        showNotification('success', `Table ${table.tableNumber} sanitized and ready!`);
        syncWithBackend();
      } else {
        setTables(prev => prev.map(t => t.id === table.id ? { ...t, status: 'AVAILABLE' } : t));
        setLogs(prev => [{
          id: Date.now(),
          table: { id: table.id, tableNumber: table.tableNumber },
          previousStatus: 'CLEANING',
          newStatus: 'AVAILABLE',
          reason: 'Table sanitized and marked AVAILABLE',
          changedAt: new Date().toISOString()
        }, ...prev]);
        showNotification('success', `Table ${table.tableNumber} sanitized and marked AVAILABLE!`);
      }
    } catch (err) {
      showNotification('error', 'Failed to update table status');
    }
  };

  // Customer Management
  const handleAddCustomer = async (data) => {
    try {
      const res = await tableApi.createCustomer(data).catch(() => null);
      const newCust = res || {
        id: customers.length + 1,
        ...data,
        totalVisits: 1,
        createdAt: new Date().toISOString()
      };
      setCustomers(prev => [newCust, ...prev]);
      showNotification('success', `Customer ${data.fullName} registered!`);
    } catch (err) {
      showNotification('error', 'Failed to add customer');
    }
  };

  const handleDeleteCustomer = (customer) => {
    if (window.confirm(`Delete profile for ${customer.fullName}?`)) {
      setCustomers(prev => prev.filter(c => c.id !== customer.id));
      showNotification('success', `Customer ${customer.fullName} deleted.`);
    }
  };

  // Table Management
  const handleAddOrEditTable = async (data) => {
    try {
      if (tableToEdit) {
        await tableApi.updateTable(tableToEdit.id, data).catch(() => null);
        setTables(prev => prev.map(t => t.id === tableToEdit.id ? { ...t, ...data } : t));
        showNotification('success', `Table ${data.tableNumber} updated!`);
      } else {
        const res = await tableApi.createTable(data).catch(() => null);
        const newTable = res || {
          id: tables.length + 1,
          ...data,
          status: 'AVAILABLE',
          isActive: true
        };
        setTables(prev => [...prev, newTable]);
        showNotification('success', `Table ${data.tableNumber} added!`);
      }
    } catch (err) {
      showNotification('error', 'Failed to save table');
    }
  };

  const handleDeleteTable = async (table) => {
    if (window.confirm(`Delete Table ${table.tableNumber}?`)) {
      await tableApi.deleteTable(table.id).catch(() => null);
      setTables(prev => prev.filter(t => t.id !== table.id));
      showNotification('success', `Table ${table.tableNumber} removed.`);
    }
  };

  const availableTables = tables.filter(t => t.status === 'AVAILABLE');

  return (
    <div className="flex min-h-screen bg-[#F4F6F9] font-sans antialiased text-slate-800">
      {/* Dark Navy Sidebar matching screenshots */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader
          activeTab={activeTab}
          onRefresh={syncWithBackend}
          loading={loading}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              tables={tables}
              customers={customers}
              sessions={sessions}
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'floorplan' && (
            <FloorPlanView
              tables={tables}
              onAutoAllocate={handleOpenAutoAlloc}
              onManualAllocate={handleOpenManualAlloc}
              onCheckout={handleCheckout}
              onMarkCleaned={handleMarkCleaned}
              onAddTable={() => { setTableToEdit(null); setTableModalOpen(true); }}
              onEditTable={(t) => { setTableToEdit(t); setTableModalOpen(true); }}
              onDeleteTable={handleDeleteTable}
            />
          )}

          {activeTab === 'customers' && (
            <CustomerDirectory
              customers={customers}
              onAddCustomer={() => setCustomerModalOpen(true)}
              onEditCustomer={(c) => alert(`Editing ${c.fullName}`)}
              onDeleteCustomer={handleDeleteCustomer}
            />
          )}

          {activeTab === 'sessions' && (
            <SessionsView
              sessions={sessions}
              tables={tables}
              onCheckout={handleCheckout}
            />
          )}

          {activeTab === 'allocations' && (
            <FloorPlanView
              tables={tables}
              onAutoAllocate={handleOpenAutoAlloc}
              onManualAllocate={handleOpenManualAlloc}
              onCheckout={handleCheckout}
              onMarkCleaned={handleMarkCleaned}
              onAddTable={() => { setTableToEdit(null); setTableModalOpen(true); }}
              onEditTable={(t) => { setTableToEdit(t); setTableModalOpen(true); }}
              onDeleteTable={handleDeleteTable}
            />
          )}

          {activeTab === 'cleaning' && (
            <FloorPlanView
              tables={tables.filter(t => t.status === 'CLEANING' || t.status === 'OCCUPIED')}
              onAutoAllocate={handleOpenAutoAlloc}
              onManualAllocate={handleOpenManualAlloc}
              onCheckout={handleCheckout}
              onMarkCleaned={handleMarkCleaned}
              onAddTable={() => { setTableToEdit(null); setTableModalOpen(true); }}
              onEditTable={(t) => { setTableToEdit(t); setTableModalOpen(true); }}
              onDeleteTable={handleDeleteTable}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              tables={tables}
              sessions={sessions}
            />
          )}

          {activeTab === 'audit' && (
            <AuditLogsView
              logs={logs}
              onRefresh={syncWithBackend}
              loading={loading}
            />
          )}
        </main>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-2.5 text-xs font-semibold ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}>
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{notification.text}</span>
          </div>
        </div>
      )}

      {/* Modals */}
      <AllocationModal
        isOpen={allocModalOpen}
        onClose={() => setAllocModalOpen(false)}
        initialTable={selectedTableForAlloc}
        initialMode={allocMode}
        availableTables={availableTables}
        onSubmit={handleSubmitAllocation}
      />

      <AddCustomerModal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
        onSubmit={handleAddCustomer}
      />

      <AddTableModal
        isOpen={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
        tableToEdit={tableToEdit}
        onSubmit={handleAddOrEditTable}
      />
    </div>
  );
}
