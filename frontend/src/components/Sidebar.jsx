import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Zap,
  CalendarClock,
  CreditCard,
  Wrench,
  Car,
  Star,
  Database,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { stats, activeCharging, resetToDefaults } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'stations', label: 'Charging Stations', icon: MapPin, count: stats.totalStations },
    {
      id: 'charger',
      label: 'Live EV Charger',
      icon: Zap,
      badge: activeCharging ? 'CHARGING' : null
    },
    { id: 'slots', label: 'Slot Booking', icon: CalendarClock },
    { id: 'payments', label: 'Billing & Payments', icon: CreditCard },
    { id: 'maintenance', label: 'Maintenance Hub', icon: Wrench },
    { id: 'fleet', label: 'Users & EV Fleet', icon: Car, count: stats.totalVehicles },
    { id: 'reviews', label: 'Reviews & Feedback', icon: Star },
    { id: 'analytics', label: 'DBMS Analytics Lab', icon: Database, highlight: true }
  ];

  const handleReset = () => {
    if (window.confirm('Reset all data to the original SQL sample dataset? Any unsaved edits will be cleared.')) {
      resetToDefaults();
    }
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 text-slate-950 font-bold fill-slate-950" />
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
              <span>VoltPulse</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                EV Net
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium">DBMS Group Project</div>
          </div>
        </div>

        {/* Live Active Charging Banner in Sidebar */}
        {activeCharging && (
          <div
            onClick={() => setActiveTab('charger')}
            className="mx-3 mt-3 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 cursor-pointer hover:bg-emerald-900/50 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div className="text-xs font-semibold text-emerald-300">Session in Progress</div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {activeCharging.currentKwh} kWh
            </span>
          </div>
        )}

        {/* Nav Links */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                    : item.highlight
                    ? 'text-cyan-400 hover:bg-cyan-950/40 hover:text-cyan-300 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive
                        ? 'text-slate-950'
                        : item.highlight
                        ? 'text-cyan-400'
                        : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-400 text-slate-950 animate-pulse">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-slate-900/40 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg border border-slate-800 hover:border-rose-900/50 transition-colors"
          title="Restore original SQL sample seed data"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to SQL Seed Data</span>
        </button>
        <div className="mt-2 text-center text-[11px] text-slate-500">
          MySQL 8.0 • Relational Schema
        </div>
      </div>
    </aside>
  );
};
