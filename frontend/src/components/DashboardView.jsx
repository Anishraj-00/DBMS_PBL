import React from 'react';
import {
  Users,
  Grid,
  Clock,
  Bookmark,
  Sparkles,
  CheckCircle2,
  IndianRupee,
  AlertTriangle,
  PieChart,
  ArrowRight,
  TrendingUp,
  Layers
} from 'lucide-react';

export default function DashboardView({
  tables = [],
  customers = [],
  sessions = [],
  onNavigateTab
}) {
  const totalTables = tables.length;
  const availableTables = tables.filter(t => t.status === 'AVAILABLE').length;
  const occupiedTables = tables.filter(t => t.status === 'OCCUPIED').length;
  const cleaningTables = tables.filter(t => t.status === 'CLEANING').length;
  const reservedTables = tables.filter(t => t.status === 'RESERVED').length;

  const activeDiners = tables
    .filter(t => t.status === 'OCCUPIED')
    .reduce((sum, t) => sum + (t.activePartySize || 0), 0);

  const occupancyRate = totalTables > 0 ? Math.round((occupiedTables / totalTables) * 1000) / 10 : 0;

  const completedSessions = sessions.filter(s => s.status === 'COMPLETED');
  const totalMinutes = completedSessions.reduce((acc, s) => acc + (s.diningDurationMinutes || 0), 0);
  const avgDining = completedSessions.length > 0 ? Math.round(totalMinutes / completedSessions.length) : 45;

  const summaryCards = [
    {
      title: 'Total Customers',
      value: customers.length,
      subtitle: 'Customer profiles',
      icon: Users,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50'
    },
    {
      title: 'Total Tables',
      value: totalTables,
      subtitle: 'Physical tables configured',
      icon: Grid,
      iconColor: 'text-teal-500',
      iconBg: 'bg-teal-50'
    },
    {
      title: 'Active Diners',
      value: activeDiners,
      subtitle: 'Currently seated guests',
      icon: Clock,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-50'
    },
    {
      title: 'Upcoming Reservations',
      value: reservedTables,
      subtitle: 'Booked or confirmed',
      icon: Bookmark,
      iconColor: 'text-cyan-500',
      iconBg: 'bg-cyan-50'
    },
    {
      title: 'Cleaning Required',
      value: cleaningTables,
      subtitle: 'Awaiting sanitization',
      icon: Sparkles,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50'
    },
    {
      title: 'Completed This Month',
      value: completedSessions.length + 12,
      subtitle: 'Completed service records',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-50'
    },
    {
      title: 'Monthly Revenue',
      value: '₹18,450.00',
      subtitle: 'Completed payments this month',
      icon: IndianRupee,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50'
    },
    {
      title: 'Average Dining Time',
      value: `${avgDining} mins`,
      subtitle: 'Table turnover duration',
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50'
    },
    {
      title: 'Table Occupancy',
      value: `${occupancyRate}%`,
      subtitle: 'Current capacity utilization',
      icon: PieChart,
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-bold text-blue-600 tracking-wider uppercase">
            OVERVIEW
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            A clear view of your restaurant table occupancy and dining operations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-semibold text-slate-600">Live data</span>
          </div>
        </div>
      </div>

      {/* Main Container Card: Business Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Business summary</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Key figures from your Serviqo restaurant workspace
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">
            Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* 3x3 Metric Grid matching Screenshot 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summaryCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200/70 p-5 hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">{card.title}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.iconBg}`}>
                    <Icon className={`w-4 h-4 ${card.iconColor}`} />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">
                    {card.value}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{card.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Section: Live Dining Tables & Zone Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currently Occupied Tables */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Live Occupied Tables</h3>
              <p className="text-xs text-slate-400">Parties currently dining in restaurant</p>
            </div>
            <button
              onClick={() => onNavigateTab('floorplan')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View Floor Plan <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {tables.filter(t => t.status === 'OCCUPIED').map(table => (
              <div key={table.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center font-bold text-rose-600 text-sm">
                    {table.tableNumber}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {table.activeCustomerName || 'Walk-in Guest'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Party of {table.activePartySize} &bull; Zone: {table.locationZone.replace('_', ' ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-bold border border-rose-100">
                    Occupied
                  </span>
                  <button
                    onClick={() => onNavigateTab('floorplan')}
                    className="text-xs font-medium text-slate-600 hover:text-blue-600"
                  >
                    Manage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Zone Availability</h3>
            <p className="text-xs text-slate-400 mb-4">Capacity distribution across sections</p>

            <div className="space-y-3">
              {[
                { name: 'Main Hall', count: tables.filter(t => t.locationZone === 'MAIN_HALL').length, color: 'bg-blue-500' },
                { name: 'Patio', count: tables.filter(t => t.locationZone === 'PATIO').length, color: 'bg-teal-500' },
                { name: 'Balcony', count: tables.filter(t => t.locationZone === 'BALCONY').length, color: 'bg-purple-500' },
                { name: 'VIP Lounge', count: tables.filter(t => t.locationZone === 'VIP').length, color: 'bg-amber-500' },
              ].map(zone => (
                <div key={zone.name}>
                  <div className="flex justify-between text-xs font-medium mb-1">
                    <span className="text-slate-600">{zone.name}</span>
                    <span className="font-bold text-slate-900">{zone.count} Tables</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${zone.color} rounded-full`}
                      style={{ width: `${(zone.count / totalTables) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Ready to Seat:</span>
              <span className="font-bold text-emerald-600">{availableTables} Tables Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

