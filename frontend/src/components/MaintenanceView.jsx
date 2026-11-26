import React, { useState } from 'react';
import { Wrench, AlertTriangle, CheckCircle2, Clock, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MaintenanceView = () => {
  const { data, addMaintenance, updateMaintenanceStatus } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [connectorId, setConnectorId] = useState(data.connectors[0]?.connector_id || 1);
  const [issue, setIssue] = useState('');
  const [maintenanceDate, setMaintenanceDate] = useState('2026-12-01');
  const [status, setStatus] = useState('Pending');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!issue) return;
    addMaintenance(connectorId, issue, maintenanceDate, status);
    setIssue('');
    setShowModal(false);
  };

  const pendingCount = data.maintenance.filter((m) => m.status === 'Pending').length;
  const inProgressCount = data.maintenance.filter((m) => m.status === 'In Progress').length;
  const completedCount = data.maintenance.filter((m) => m.status === 'Completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <span>Hardware Maintenance & Health Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            MAINTENANCE & CONNECTOR tables • Hardware diagnostics, fault tracking, and technician dispatch
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report Maintenance Fault</span>
        </button>
      </div>

      {/* Status Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pending Tickets</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 mt-2">{pendingCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting field technician inspection</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>In Progress</span>
            <AlertTriangle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-2">{inProgressCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Connector currently under repair</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Resolved / Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-2">{completedCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">Returned to available network state</div>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white">Maintenance Work Orders (MAINTENANCE)</h2>
          <span className="text-xs font-mono text-slate-400">{data.maintenance.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Connector</th>
                <th className="py-2.5 px-3">Station</th>
                <th className="py-2.5 px-3">Reported Issue</th>
                <th className="py-2.5 px-3">Scheduled Date</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.maintenance.map((m) => {
                const conn = data.connectors.find((c) => c.connector_id === m.connector_id);
                const station = conn
                  ? data.charging_stations.find((s) => s.station_id === conn.station_id)
                  : null;

                const isCompleted = m.status === 'Completed';
                const isInProgress = m.status === 'In Progress';
                const isPending = m.status === 'Pending';

                return (
                  <tr key={m.maintenance_id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono text-slate-400">#{m.maintenance_id}</td>
                    <td className="py-2.5 px-3 font-medium text-white">
                      Port #{m.connector_id} ({conn ? conn.connector_type : 'Plug'})
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {station ? station.station_name : 'Station'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-200 font-medium">{m.issue}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                      {m.maintenance_date}
                    </td>
                    <td className="py-2.5 px-3">
                      <select
                        value={m.status}
                        onChange={(e) => updateMaintenanceStatus(m.maintenance_id, e.target.value)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-slate-950 cursor-pointer focus:outline-none ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : isInProgress
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Maintenance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Log Hardware Maintenance Ticket</h3>
                <p className="text-xs text-slate-400">Inserts row into MAINTENANCE table</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Target Connector</label>
                <select
                  value={connectorId}
                  onChange={(e) => setConnectorId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  {data.connectors.map((c) => {
                    const st = data.charging_stations.find((s) => s.station_id === c.station_id);
                    return (
                      <option key={c.connector_id} value={c.connector_id}>
                        Port #{c.connector_id} ({c.connector_type} • {st?.station_name})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Issue Description</label>
                <textarea
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  rows={3}
                  placeholder="e.g. Connector overheating, Cable wear, Display unresponsive"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={maintenanceDate}
                    onChange={(e) => setMaintenanceDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg"
                >
                  Dispatch Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
