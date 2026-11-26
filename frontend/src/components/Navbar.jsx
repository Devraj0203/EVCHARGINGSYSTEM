import React from 'react';
import { Zap, ShieldCheck, Activity, Bell, Fuel } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar = ({ onQuickAction }) => {
  const { stats, activeCharging } = useApp();

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
      {/* Left: Quick Status Indicators */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-300">
            Network Status: <span className="text-emerald-400 font-semibold">Online & Synchronized</span>
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-4 text-xs text-slate-400 border-l border-slate-800 pl-6">
          <div>
            <span className="text-slate-500">Hubs Active: </span>
            <span className="font-semibold text-white">{stats.activeStations} / {stats.totalStations}</span>
          </div>
          <div>
            <span className="text-slate-500">Available Ports: </span>
            <span className="font-semibold text-emerald-400">{stats.availableConnectors}</span>
          </div>
          <div>
            <span className="text-slate-500">Total Revenue: </span>
            <span className="font-semibold text-cyan-400">₹{stats.totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Action & Live Simulator Indicator */}
      <div className="flex items-center space-x-3">
        {activeCharging ? (
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
            <Zap className="w-3.5 h-3.5 animate-bounce text-emerald-400 fill-emerald-400" />
            <span>Dispensing: {activeCharging.currentKwh} kWh</span>
            <span className="text-slate-500">|</span>
            <span className="font-bold text-white">₹{activeCharging.currentCost}</span>
          </div>
        ) : (
          <button
            onClick={() => onQuickAction('charger')}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition-all shadow-md shadow-emerald-500/20"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            <span>Simulate Charging</span>
          </button>
        )}

        <button
          onClick={() => onQuickAction('slots')}
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
        >
          <span>Book Slot</span>
        </button>

        <div className="h-6 w-[1px] bg-slate-800 mx-1"></div>

        <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Admin Operator</span>
        </div>
      </div>
    </header>
  );
};
