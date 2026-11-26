import React, { useState } from 'react';
import { CalendarClock, CheckCircle, Clock, MapPin, Plus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BookingView = () => {
  const { data, addBooking, getStationConnectors } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [stationId, setStationId] = useState(data.charging_stations[0]?.station_id || 1);
  const connectors = getStationConnectors(Number(stationId));
  const [connectorId, setConnectorId] = useState(connectors[0]?.connector_id || 1);
  const [timeSlot, setTimeSlot] = useState('2026-12-01 16:00:00');

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    addBooking(connectorId, timeSlot);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-emerald-400" />
            <span>Slot Booking & Availability Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            AVAILABILITY table • Schedule future charging slots for high-demand connectors
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Reserve New Slot</span>
        </button>
      </div>

      {/* Availability Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white">Scheduled Slots (AVAILABILITY)</h2>
          <span className="text-xs font-mono text-slate-400">{data.availability.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[11px] uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Slot ID</th>
                <th className="py-2.5 px-3">Connector</th>
                <th className="py-2.5 px-3">Station</th>
                <th className="py-2.5 px-3">Time Slot</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data.availability.map((slot) => {
                const conn = data.connectors.find((c) => c.connector_id === slot.connector_id);
                const station = conn
                  ? data.charging_stations.find((s) => s.station_id === conn.station_id)
                  : null;

                const isAvailable = slot.status === 'Available';
                const isBooked = slot.status === 'Booked';

                return (
                  <tr key={slot.availability_id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-mono text-slate-400">
                      #{slot.availability_id}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-white">
                      Connector #{slot.connector_id} ({conn ? conn.connector_type : 'Plug'})
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {station ? station.station_name : 'Station'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-cyan-400 font-semibold">
                      {slot.time_slot}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          isAvailable
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isBooked
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {slot.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Reserve Charging Time Slot</h3>
                <p className="text-xs text-slate-400">Insert row into AVAILABILITY table</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Station</label>
                <select
                  value={stationId}
                  onChange={(e) => {
                    const sid = Number(e.target.value);
                    setStationId(sid);
                    const conns = getStationConnectors(sid);
                    if (conns.length > 0) setConnectorId(conns[0].connector_id);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  {data.charging_stations.map((st) => (
                    <option key={st.station_id} value={st.station_id}>
                      {st.station_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Connector</label>
                <select
                  value={connectorId}
                  onChange={(e) => setConnectorId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  {connectors.map((c) => (
                    <option key={c.connector_id} value={c.connector_id}>
                      Connector #{c.connector_id} ({c.connector_type} • {c.power_rating} kW •{' '}
                      {c.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Time Slot (YYYY-MM-DD HH:MM:SS)
                </label>
                <input
                  type="text"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  placeholder="2026-12-01 16:00:00"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                  required
                />
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
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
