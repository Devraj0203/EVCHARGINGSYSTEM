import React, { useState } from 'react';
import {
  MapPin,
  Zap,
  Clock,
  Plus,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  Star,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StationsView = ({ setActiveTab, onSelectStationForCharging }) => {
  const {
    data,
    getLocation,
    getOperator,
    getStationConnectors,
    getStationTariffs,
    getStationReviews,
    getStationAvgRating,
    updateStationStatus,
    updateConnectorStatus,
    addStation,
    addReview
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [selectedStation, setSelectedStation] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Form states for Add Station
  const [newStationForm, setNewStationForm] = useState({
    station_name: '',
    operator_id: 1,
    charger_type: 'CCS2',
    number_of_ports: 4,
    power_rating_kw: 60,
    operating_hours: '24 Hours',
    station_status: 'Active',
    price_per_kwh: 18.0,
    // Location
    address: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    postal_code: '560001',
    latitude: 12.9716,
    longitude: 77.5946
  });

  // Review Form
  const [reviewForm, setReviewForm] = useState({
    user_id: 1,
    rating: 5,
    comment: ''
  });

  // Unique cities from locations
  const cities = ['All', ...new Set(data.locations.map((l) => l.city))];
  const chargerTypes = ['All', 'CCS2', 'Type 2', 'CHAdeMO'];
  const statuses = ['All', 'Active', 'Maintenance', 'Inactive'];

  const filteredStations = data.charging_stations.filter((st) => {
    const loc = getLocation(st.location_id);
    const matchesSearch =
      st.station_name.toLowerCase().includes(search.toLowerCase()) ||
      (loc && loc.address.toLowerCase().includes(search.toLowerCase())) ||
      (loc && loc.city.toLowerCase().includes(search.toLowerCase()));

    const matchesCity = selectedCity === 'All' || (loc && loc.city === selectedCity);
    const matchesType = selectedType === 'All' || st.charger_type === selectedType;
    const matchesStatus = selectedStatus === 'All' || st.station_status === selectedStatus;

    return matchesSearch && matchesCity && matchesType && matchesStatus;
  });

  const handleAddStationSubmit = (e) => {
    e.preventDefault();
    if (!newStationForm.station_name || !newStationForm.address) {
      alert('Please fill in station name and address');
      return;
    }

    addStation(
      {
        operator_id: Number(newStationForm.operator_id),
        station_name: newStationForm.station_name,
        operating_hours: newStationForm.operating_hours,
        charger_type: newStationForm.charger_type,
        number_of_ports: Number(newStationForm.number_of_ports),
        power_rating_kw: Number(newStationForm.power_rating_kw),
        station_status: newStationForm.station_status,
        price_per_kwh: Number(newStationForm.price_per_kwh)
      },
      {
        address: newStationForm.address,
        city: newStationForm.city,
        state: newStationForm.state,
        postal_code: newStationForm.postal_code,
        latitude: Number(newStationForm.latitude),
        longitude: Number(newStationForm.longitude)
      }
    );

    setShowAddModal(false);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!selectedStation) return;
    addReview(
      reviewForm.user_id,
      selectedStation.station_id,
      reviewForm.rating,
      reviewForm.comment
    );
    setReviewForm({ user_id: 1, rating: 5, comment: '' });
    setShowReviewModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Charging Stations Directory</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {filteredStations.length} of {data.charging_stations.length}
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            CHARGING_STATION, LOCATION & CONNECTOR relational tables
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-all shadow-md shadow-emerald-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Station</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by station name, city, address..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* City Filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                City: {city}
              </option>
            ))}
          </select>

          {/* Charger Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            {chargerTypes.map((t) => (
              <option key={t} value={t}>
                Plug: {t}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStations.map((station) => {
          const loc = getLocation(station.location_id);
          const op = getOperator(station.operator_id);
          const connectors = getStationConnectors(station.station_id);
          const tariffs = getStationTariffs(station.station_id);
          const avgRating = getStationAvgRating(station.station_id);
          const reviews = getStationReviews(station.station_id);

          const availableCount = connectors.filter((c) => c.status === 'Available').length;
          const occupiedCount = connectors.filter((c) => c.status === 'Occupied').length;
          const maintenanceCount = connectors.filter((c) => c.status === 'Maintenance').length;

          const basePrice = tariffs[0]?.price_per_kwh || 18.0;

          return (
            <div
              key={station.station_id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-5 flex flex-col justify-between transition-all shadow-sm group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-slate-400">ID #{station.station_id}</span>
                      <span className="text-[11px] text-slate-500">•</span>
                      <span className="text-xs font-medium text-emerald-400 truncate max-w-[150px]">
                        {op ? op.operator_name : 'CPO'}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1 group-hover:text-emerald-300 transition-colors">
                      {station.station_name}
                    </h3>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={station.station_status}
                    onChange={(e) => updateStationStatus(station.station_id, e.target.value)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-slate-950 cursor-pointer focus:outline-none ${
                      station.station_status === 'Active'
                        ? 'border-emerald-500/40 text-emerald-400'
                        : station.station_status === 'Maintenance'
                        ? 'border-amber-500/40 text-amber-400'
                        : 'border-rose-500/40 text-rose-400'
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Location */}
                <div className="mt-2.5 text-xs text-slate-400 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>
                    {loc ? `${loc.address}, ${loc.city}, ${loc.state} (${loc.postal_code})` : 'Location not found'}
                  </span>
                </div>

                {/* Specs Box */}
                <div className="mt-4 grid grid-cols-3 gap-2 bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 text-center">
                  <div>
                    <div className="text-[10px] uppercase text-slate-500">Power</div>
                    <div className="text-xs font-mono font-bold text-cyan-400 mt-0.5">
                      {station.power_rating_kw} kW
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-500">Plug</div>
                    <div className="text-xs font-mono font-bold text-white mt-0.5">
                      {station.charger_type}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-slate-500">Tariff</div>
                    <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                      ₹{basePrice}/kWh
                    </div>
                  </div>
                </div>

                {/* Connectors status mini-pills */}
                <div className="mt-3.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span>Ports ({connectors.length}):</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {availableCount} Available
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {connectors.map((c) => (
                      <span
                        key={c.connector_id}
                        title={`Connector #${c.connector_id}: ${c.status}`}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          c.status === 'Available'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : c.status === 'Occupied'
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            : c.status === 'Maintenance'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-slate-800 text-slate-500 border-slate-700'
                        }`}
                      >
                        P{c.connector_id}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Operating hours & Rating */}
                <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{station.operating_hours}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{avgRating > 0 ? avgRating : 'New'}</span>
                    <span className="text-[10px] text-slate-500 font-normal">({reviews.length})</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedStation(station);
                  }}
                  className="flex-1 py-2 px-3 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                >
                  Details & Reviews
                </button>
                <button
                  onClick={() => {
                    if (onSelectStationForCharging) {
                      onSelectStationForCharging(station.station_id);
                    }
                    setActiveTab('charger');
                  }}
                  disabled={availableCount === 0 || station.station_status !== 'Active'}
                  className="py-2 px-3 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:pointer-events-none text-slate-950 transition-all flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Charge</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Station Detail Drawer / Modal */}
      {selectedStation && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-emerald-400">Station ID #{selectedStation.station_id}</span>
                <h2 className="text-xl font-bold text-white mt-1">{selectedStation.station_name}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  {getLocation(selectedStation.location_id)?.address},{' '}
                  {getLocation(selectedStation.location_id)?.city}
                </p>
              </div>
              <button
                onClick={() => setSelectedStation(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Operator Information */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">
                  {getOperator(selectedStation.operator_id)?.operator_name}
                </div>
                <div className="text-[11px] text-slate-400">
                  Contact: {getOperator(selectedStation.operator_id)?.contact_person} • Phone:{' '}
                  {getOperator(selectedStation.operator_id)?.phone}
                </div>
              </div>
              <a
                href={getOperator(selectedStation.operator_id)?.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Connectors Management */}
            <div className="mt-5">
              <h3 className="text-sm font-bold text-white mb-2">Connectors (CONNECTOR table)</h3>
              <div className="space-y-2">
                {getStationConnectors(selectedStation.station_id).map((c) => (
                  <div
                    key={c.connector_id}
                    className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">
                        Connector #{c.connector_id} • {c.connector_type}
                      </div>
                      <div className="text-[11px] text-slate-400">Power Rating: {c.power_rating} kW</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={c.status}
                        onChange={(e) => updateConnectorStatus(c.connector_id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-md border bg-slate-900 cursor-pointer focus:outline-none ${
                          c.status === 'Available'
                            ? 'text-emerald-400 border-emerald-500/40'
                            : c.status === 'Occupied'
                            ? 'text-cyan-400 border-cyan-500/40'
                            : c.status === 'Maintenance'
                            ? 'text-amber-400 border-amber-500/40'
                            : 'text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="Available">Available</option>
                        <option value="Occupied">Occupied</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white">Customer Reviews (REVIEW table)</h3>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  + Add Review
                </button>
              </div>

              {getStationReviews(selectedStation.station_id).length === 0 ? (
                <div className="text-xs text-slate-500 py-3 text-center">No reviews submitted yet.</div>
              ) : (
                <div className="space-y-2.5">
                  {getStationReviews(selectedStation.station_id).map((r) => {
                    const user = data.users.find((u) => u.user_id === r.user_id);
                    return (
                      <div
                        key={r.review_id}
                        className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-200">
                            {user ? user.name : `User #${r.user_id}`}
                          </span>
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: r.rating }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 italic">"{r.comment}"</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedStation(null)}
                className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Write Review Modal */}
      {showReviewModal && selectedStation && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Add Review for {selectedStation.station_name}
            </h3>
            <p className="text-xs text-slate-400 mb-4">Inserts a new row into REVIEW table</p>

            <form onSubmit={handleReviewSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Select User</label>
                <select
                  value={reviewForm.user_id}
                  onChange={(e) => setReviewForm({ ...reviewForm, user_id: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                >
                  {data.users.map((u) => (
                    <option key={u.user_id} value={u.user_id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Rating (1 to 5 Stars)</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Below Average</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Review Comment</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  rows={3}
                  placeholder="Share details of the charging speed, parking access, amenities..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-3.5 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Station Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Add New Charging Station</h2>
                <p className="text-xs text-slate-400">
                  Creates CHARGING_STATION, LOCATION, CONNECTOR, and TARIFF records
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStationSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Station Name</label>
                  <input
                    type="text"
                    value={newStationForm.station_name}
                    onChange={(e) =>
                      setNewStationForm({ ...newStationForm, station_name: e.target.value })
                    }
                    placeholder="e.g. ChargeGrid Whitefield"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Operator</label>
                  <select
                    value={newStationForm.operator_id}
                    onChange={(e) =>
                      setNewStationForm({ ...newStationForm, operator_id: Number(e.target.value) })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    {data.operators.map((op) => (
                      <option key={op.operator_id} value={op.operator_id}>
                        {op.operator_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Charger Type</label>
                  <select
                    value={newStationForm.charger_type}
                    onChange={(e) =>
                      setNewStationForm({ ...newStationForm, charger_type: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="CCS2">CCS2 (DC Fast)</option>
                    <option value="Type 2">Type 2 (AC Slow/Medium)</option>
                    <option value="CHAdeMO">CHAdeMO (DC Fast)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Power Rating (kW)</label>
                  <input
                    type="number"
                    value={newStationForm.power_rating_kw}
                    onChange={(e) =>
                      setNewStationForm({ ...newStationForm, power_rating_kw: Number(e.target.value) })
                    }
                    min={1}
                    max={350}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Number of Ports</label>
                  <input
                    type="number"
                    value={newStationForm.number_of_ports}
                    onChange={(e) =>
                      setNewStationForm({ ...newStationForm, number_of_ports: Number(e.target.value) })
                    }
                    min={1}
                    max={20}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Tariff (₹ / kWh)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newStationForm.price_per_kwh}
                    onChange={(e) =>
                      setNewStationForm({ ...newStationForm, price_per_kwh: Number(e.target.value) })
                    }
                    min={1}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={newStationForm.operating_hours}
                    onChange={(e) =>
                      setNewStationForm({ ...newStationForm, operating_hours: e.target.value })
                    }
                    placeholder="24 Hours or 07:00-23:00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={newStationForm.station_status}
                    onChange={(e) =>
                      setNewStationForm({ ...newStationForm, station_status: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Location details */}
              <div className="pt-3 border-t border-slate-800">
                <div className="font-semibold text-slate-300 mb-2">Location Information</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-300 mb-1">Street Address</label>
                    <input
                      type="text"
                      value={newStationForm.address}
                      onChange={(e) =>
                        setNewStationForm({ ...newStationForm, address: e.target.value })
                      }
                      placeholder="e.g. ITPL Main Rd, Whitefield"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">City</label>
                    <input
                      type="text"
                      value={newStationForm.city}
                      onChange={(e) => setNewStationForm({ ...newStationForm, city: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">State</label>
                    <input
                      type="text"
                      value={newStationForm.state}
                      onChange={(e) =>
                        setNewStationForm({ ...newStationForm, state: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg shadow-md"
                >
                  Save Station to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
