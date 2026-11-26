import React from 'react';
import {
  Zap,
  TrendingUp,
  MapPin,
  Clock,
  BatteryCharging,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Car,
  Star,
  Database
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardView = ({ setActiveTab }) => {
  const { data, stats, getLocation, getOperator, activeCharging } = useApp();

  // Top 4 stations by revenue
  const stationRevenueMap = {};
  data.charging_sessions.forEach((cs) => {
    const payment = data.payments.find((p) => p.session_id === cs.session_id);
    if (payment && payment.payment_status === 'Successful') {
      stationRevenueMap[cs.station_id] = (stationRevenueMap[cs.station_id] || 0) + Number(cs.total_cost);
    }
  });

  const cityDistribution = {};
  data.charging_stations.forEach((st) => {
    const loc = getLocation(st.location_id);
    if (loc) {
      cityDistribution[loc.city] = (cityDistribution[loc.city] || 0) + 1;
    }
  });

  const recentSessions = data.charging_sessions.slice(0, 5);
  const recentPayments = data.payments.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                Live Operations
              </span>
              <span className="text-xs text-slate-400">EV_CHARGING_NETWORK Database</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              EV Charging Network Command Center
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Real-time monitoring of charging stations, active power delivery, booking slots, and transaction analytics across 6 major Indian metropolitan cities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveTab('charger')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Simulate Charge</span>
            </button>
            <button
              onClick={() => setActiveTab('slots')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-all"
            >
              <span>Book Slot</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 font-medium text-sm transition-all"
            >
              <span>SQL Queries Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Charging Alert if running */}
      {activeCharging && (
        <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/40 p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-6 h-6 fill-emerald-400 animate-spin" />
            </div>
            <div>
              <div className="text-sm font-bold text-emerald-300">
                Active Vehicle Charging In Progress
              </div>
              <div className="text-xs text-slate-400">
                Station #{activeCharging.station_id} • Connector #{activeCharging.connector_id} • Dispensing power
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-xs text-slate-400">Energy Delivered</div>
              <div className="text-lg font-bold font-mono text-emerald-400">{activeCharging.currentKwh} kWh</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Running Cost</div>
              <div className="text-lg font-bold font-mono text-white">₹{activeCharging.currentCost}</div>
            </div>
            <button
              onClick={() => setActiveTab('charger')}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              View & Complete
            </button>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">
              ₹{stats.totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Successful
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            Across {data.payments.length} transactions
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Energy Delivered</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <BatteryCharging className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">
              {stats.totalEnergy}
            </span>
            <span className="text-xs text-cyan-400">kWh dispensed</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {data.charging_sessions.length} recorded charging sessions
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Active Charging Hubs</span>
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white font-mono">
              {stats.activeStations}
            </span>
            <span className="text-xs text-slate-400">/ {stats.totalStations} Hubs</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {data.charging_stations.filter(s => s.station_status === 'Maintenance').length} in maintenance, 1 inactive
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Ports Available</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">
              {stats.availableConnectors}
            </span>
            <span className="text-xs text-slate-400">/ {stats.totalConnectors} Connectors</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            CCS2, Type 2, and CHAdeMO supported
          </div>
        </div>
      </div>

      {/* Network Distribution & Active Hubs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Station Overview Cards */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Featured Charging Stations</h2>
              <p className="text-xs text-slate-400">High-capacity rapid charging locations</p>
            </div>
            <button
              onClick={() => setActiveTab('stations')}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View all ({stats.totalStations})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.charging_stations.slice(0, 4).map((station) => {
              const loc = getLocation(station.location_id);
              const op = getOperator(station.operator_id);
              const isMaintenance = station.station_status === 'Maintenance';
              const isInactive = station.station_status === 'Inactive';

              return (
                <div
                  key={station.station_id}
                  className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400">#{station.station_id}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isMaintenance
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : isInactive
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {station.station_status}
                      </span>
                    </div>
                    <div className="mt-2 text-sm font-bold text-white">{station.station_name}</div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{loc ? `${loc.city}, ${loc.state}` : 'Location'}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500">Power: </span>
                      <span className="font-mono font-semibold text-cyan-400">{station.power_rating_kw} kW</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Ports: </span>
                      <span className="font-mono text-white">{station.number_of_ports}</span>
                    </div>
                    <div className="text-emerald-400 font-mono text-[11px]">
                      {station.charger_type}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* City Distribution Badges */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="text-xs font-medium text-slate-400 mb-2">Network Presence by City:</div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(cityDistribution).map(([city, count]) => (
                <span
                  key={city}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{city}</span>
                  <span className="font-mono text-[10px] text-slate-400 font-bold">({count})</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Network Quick Stats & Operators */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white mb-1">CPO Operators</h2>
            <p className="text-xs text-slate-400 mb-4">Charge Point Operators managing the network</p>

            <div className="space-y-3">
              {data.operators.map((op) => {
                const count = data.charging_stations.filter((s) => s.operator_id === op.operator_id).length;
                return (
                  <div
                    key={op.operator_id}
                    className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{op.operator_name}</div>
                      <div className="text-[11px] text-slate-400">{op.contact_person} • {op.phone}</div>
                    </div>
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {count} {count === 1 ? 'Hub' : 'Hubs'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-500/30 p-3.5">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                <Database className="w-4 h-4" />
                <span>DBMS Relational Integrity</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Foreign keys enforce cascade updates and restrict deletions across 12 normalized SQL tables.
              </p>
              <button
                onClick={() => setActiveTab('analytics')}
                className="mt-3 text-xs font-medium text-cyan-300 hover:text-cyan-200 underline underline-offset-2 flex items-center gap-1"
              >
                Inspect SQL Queries & Analytics →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tables: Recent Sessions & Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Charging Sessions */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Charging Sessions</h2>
              <p className="text-xs text-slate-400">CHARGING_SESSION table</p>
            </div>
            <button
              onClick={() => setActiveTab('charger')}
              className="text-xs text-emerald-400 hover:underline"
            >
              Session Manager
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Session</th>
                  <th className="py-2.5 px-3">Energy</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Cost</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentSessions.map((session) => (
                  <tr key={session.session_id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono text-slate-300">
                      #{session.session_id}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-emerald-400">
                      {session.energy_delivered_kwh} kWh
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {session.charging_duration_minutes} mins
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-white">
                      ₹{session.total_cost}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {session.session_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments Ledger */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Payments</h2>
              <p className="text-xs text-slate-400">PAYMENT table transactions</p>
            </div>
            <button
              onClick={() => setActiveTab('payments')}
              className="text-xs text-emerald-400 hover:underline"
            >
              All Transactions
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Ref</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentPayments.map((pmt) => {
                  const isSuccess = pmt.payment_status === 'Successful';
                  const isPending = pmt.payment_status === 'Pending';
                  const isFailed = pmt.payment_status === 'Failed';

                  return (
                    <tr key={pmt.payment_id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-mono text-slate-300">
                        {pmt.transaction_reference}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-white">
                        ₹{pmt.amount}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400">
                        {pmt.payment_method}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            isSuccess
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : isPending
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {pmt.payment_status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
