import React, { useState } from 'react';
import { Car, User, Plus, BatteryCharging, Phone, Mail, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FleetView = () => {
  const { data, addUser, addVehicle } = useApp();

  const [showUserModal, setShowUserModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  // New User Form
  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '' });

  // New Vehicle Form
  const [vehicleForm, setVehicleForm] = useState({
    user_id: data.users[0]?.user_id || 1,
    vehicle_number: '',
    model: 'Tata Nexon EV',
    battery_capacity: 40.5
  });

  const handleUserSubmit = (e) => {
    e.preventDefault();
    if (!userForm.name || !userForm.email) return;
    addUser(userForm.name, userForm.email, userForm.phone);
    setUserForm({ name: '', email: '', phone: '' });
    setShowUserModal(false);
  };

  const handleVehicleSubmit = (e) => {
    e.preventDefault();
    if (!vehicleForm.vehicle_number || !vehicleForm.model) return;
    addVehicle(
      vehicleForm.user_id,
      vehicleForm.vehicle_number,
      vehicleForm.model,
      vehicleForm.battery_capacity
    );
    setVehicleForm({
      user_id: data.users[0]?.user_id || 1,
      vehicle_number: '',
      model: 'Tata Nexon EV',
      battery_capacity: 40.5
    });
    setShowVehicleModal(false);
  };

  const totalBattery = data.vehicles.reduce((sum, v) => sum + Number(v.battery_capacity), 0);
  const avgBattery = (totalBattery / data.vehicles.length).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Car className="w-5 h-5 text-emerald-400" />
            <span>EV Drivers & Registered Fleet</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            USER & VEHICLE relational tables • 1:N relationship mapping drivers to multiple electric vehicles
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUserModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition-all"
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Driver</span>
          </button>
          <button
            onClick={() => setShowVehicleModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register EV</span>
          </button>
        </div>
      </div>

      {/* Fleet Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Registered EVs</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">
            {data.vehicles.length} Vehicles
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across {data.users.length} registered owners</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Total Fleet Battery Capacity</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {totalBattery.toFixed(1)} kWh
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Combined onboard energy storage</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Average Battery Size</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{avgBattery} kWh</div>
          <div className="text-[11px] text-slate-500 mt-1">From 24.0 kWh (Tiago) to 60.5 kWh (BYD)</div>
        </div>
      </div>

      {/* Users and their vehicles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.users.map((user) => {
          const userVehicles = data.vehicles.filter((v) => v.user_id === user.user_id);
          const sessionsCount = data.charging_sessions.filter((s) => s.user_id === user.user_id).length;

          return (
            <div
              key={user.user_id}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                {/* User card header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{user.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">ID #{user.user_id}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {sessionsCount} Sessions
                  </span>
                </div>

                {/* Contact info */}
                <div className="mt-3 space-y-1 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{user.phone}</span>
                  </div>
                </div>

                {/* Vehicles List */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-300 mb-2 flex items-center justify-between">
                    <span>Assigned EVs ({userVehicles.length}):</span>
                    {userVehicles.length > 1 && (
                      <span className="text-[10px] text-cyan-400 font-mono">Multi-EV Owner</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {userVehicles.map((v) => (
                      <div
                        key={v.vehicle_id}
                        className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">{v.model}</div>
                          <div className="text-[10px] font-mono text-slate-500">
                            {v.vehicle_number}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {v.battery_capacity} kWh
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Add New EV Driver (USER table)</h3>
              <button onClick={() => setShowUserModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUserSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="e.g. Vikram Seth"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="vikram@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  placeholder="9876543299"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">Register Electric Vehicle (VEHICLE)</h3>
              <button
                onClick={() => setShowVehicleModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVehicleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Owner</label>
                <select
                  value={vehicleForm.user_id}
                  onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, user_id: Number(e.target.value) })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  {data.users.map((u) => (
                    <option key={u.user_id} value={u.user_id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Registration / Number</label>
                <input
                  type="text"
                  value={vehicleForm.vehicle_number}
                  onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, vehicle_number: e.target.value })
                  }
                  placeholder="e.g. MH02EV9999"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Vehicle Model</label>
                <input
                  type="text"
                  value={vehicleForm.model}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                  placeholder="e.g. Tata Nexon EV, MG ZS EV"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Battery Capacity (kWh)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vehicleForm.battery_capacity}
                  onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, battery_capacity: Number(e.target.value) })
                  }
                  min={5}
                  max={200}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowVehicleModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg"
                >
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
