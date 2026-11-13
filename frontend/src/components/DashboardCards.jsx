import React from 'react';
import { CheckCircle2, Clock, Sparkles, Users2, Activity, PieChart, Bookmark } from 'lucide-react';

export default function DashboardCards({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: 'Available Tables',
      value: stats.availableTables,
      subtitle: `${Math.round((stats.availableTables / (stats.totalTables || 1)) * 100)}% of total`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      badge: 'Ready to seat'
    },
    {
      title: 'Occupied Tables',
      value: stats.occupiedTables,
      subtitle: `${stats.activeDiners || 0} active diners`,
      icon: Activity,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      badge: `${stats.occupancyPercentage}% occupied`
    },
    {
      title: 'Cleaning Required',
      value: stats.cleaningTables,
      subtitle: 'Awaiting sanitization',
      icon: Sparkles,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      badge: 'Action needed'
    },
    {
      title: 'Reserved',
      value: stats.reservedTables,
      subtitle: 'Booked tables',
      icon: Bookmark,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20',
      badge: 'Upcoming'
    },
    {
      title: 'Avg Dining Time',
      value: `${stats.averageDiningMinutes}m`,
      subtitle: 'Calculated from sessions',
      icon: Clock,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      badge: 'Turnover'
    },
    {
      title: 'Total Tables',
      value: stats.totalTables,
      subtitle: 'All restaurant zones',
      icon: Users2,
      color: 'text-slate-300',
      bg: 'bg-slate-800/60 border-slate-700/60',
      badge: 'Capacity'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border backdrop-blur-sm transition-all hover:scale-[1.02] ${card.bg}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400 truncate">{card.title}</span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">{card.value}</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">{card.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}

