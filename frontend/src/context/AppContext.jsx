import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../data/initialData';

const AppContext = createContext();

const STORAGE_KEY = 'ev_charging_network_data_v1';

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse localStorage data', e);
    }
    return initialData;
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [data]);

  // Live charging session state
  const [activeCharging, setActiveCharging] = useState(null);
  // e.g., { user_id, vehicle_id, station_id, connector_id, tariff_id, startTime, currentKwh, currentCost, targetCapacity }

  // Timer for live charging simulation
  useEffect(() => {
    let interval = null;
    if (activeCharging) {
      interval = setInterval(() => {
        setActiveCharging((prev) => {
          if (!prev) return null;
          const connector = data.connectors.find((c) => c.connector_id === prev.connector_id);
          const power = connector ? connector.power_rating : 50; // kW
          // Simulation speed: 1 second in UI = 0.5 kWh
          const addedKwh = Number((power / 100).toFixed(2));
          const newKwh = Number((prev.currentKwh + addedKwh).toFixed(2));
          const tariff = data.tariffs.find((t) => t.tariff_id === prev.tariff_id);
          const rate = tariff ? tariff.price_per_kwh : 15;
          const newCost = Number((newKwh * rate).toFixed(2));
          const elapsedSecs = prev.elapsedSeconds + 1;

          return {
            ...prev,
            currentKwh: newKwh,
            currentCost: newCost,
            elapsedSeconds: elapsedSecs
          };
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCharging, data.connectors, data.tariffs]);

  // Reset to default sample data
  const resetToDefaults = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(initialData);
    setActiveCharging(null);
  };

  // Helper getters
  const getLocation = (id) => data.locations.find((l) => l.location_id === id);
  const getOperator = (id) => data.operators.find((o) => o.operator_id === id);
  const getStation = (id) => data.charging_stations.find((s) => s.station_id === id);
  const getUser = (id) => data.users.find((u) => u.user_id === id);
  const getVehicle = (id) => data.vehicles.find((v) => v.vehicle_id === id);

  const getStationConnectors = (stationId) =>
    data.connectors.filter((c) => c.station_id === stationId);

  const getStationTariffs = (stationId) =>
    data.tariffs.filter((t) => t.station_id === stationId);

  const getStationReviews = (stationId) =>
    data.reviews.filter((r) => r.station_id === stationId);

  const getStationAvgRating = (stationId) => {
    const revs = getStationReviews(stationId);
    if (!revs.length) return 0;
    const sum = revs.reduce((acc, r) => acc + r.rating, 0);
    return Number((sum / revs.length).toFixed(1));
  };

  // Actions
  const addStation = (stationData, locationData) => {
    const newLocationId = Math.max(...data.locations.map((l) => l.location_id), 0) + 1;
    const newStationId = Math.max(...data.charging_stations.map((s) => s.station_id), 0) + 1;

    const newLoc = {
      location_id: newLocationId,
      ...locationData
    };

    const newStation = {
      station_id: newStationId,
      location_id: newLocationId,
      ...stationData
    };

    // Auto-generate connectors and tariff for the new station
    const newConnectors = [];
    const baseConnId = Math.max(...data.connectors.map((c) => c.connector_id), 0);
    for (let i = 1; i <= Number(stationData.number_of_ports); i++) {
      newConnectors.push({
        connector_id: baseConnId + i,
        station_id: newStationId,
        connector_type: stationData.charger_type,
        power_rating: Number(stationData.power_rating_kw),
        status: 'Available'
      });
    }

    const newTariffId = Math.max(...data.tariffs.map((t) => t.tariff_id), 0) + 1;
    const newTariff = {
      tariff_id: newTariffId,
      station_id: newStationId,
      connector_type: stationData.charger_type,
      price_per_kwh: Number(stationData.price_per_kwh || 18.0)
    };

    setData((prev) => ({
      ...prev,
      locations: [...prev.locations, newLoc],
      charging_stations: [...prev.charging_stations, newStation],
      connectors: [...prev.connectors, ...newConnectors],
      tariffs: [...prev.tariffs, newTariff]
    }));

    return newStationId;
  };

  const updateStationStatus = (stationId, status) => {
    setData((prev) => ({
      ...prev,
      charging_stations: prev.charging_stations.map((s) =>
        s.station_id === stationId ? { ...s, station_status: status } : s
      )
    }));
  };

  const updateConnectorStatus = (connectorId, status) => {
    setData((prev) => ({
      ...prev,
      connectors: prev.connectors.map((c) =>
        c.connector_id === connectorId ? { ...c, status } : c
      )
    }));
  };

  const addBooking = (connectorId, timeSlot) => {
    const newId = Math.max(...data.availability.map((a) => a.availability_id), 0) + 1;
    const newBooking = {
      availability_id: newId,
      connector_id: Number(connectorId),
      time_slot: timeSlot,
      status: 'Booked'
    };

    setData((prev) => ({
      ...prev,
      availability: [...prev.availability, newBooking]
    }));
    return newBooking;
  };

  const addMaintenance = (connectorId, issue, date, status = 'Pending') => {
    const newId = Math.max(...data.maintenance.map((m) => m.maintenance_id), 0) + 1;
    const newEntry = {
      maintenance_id: newId,
      connector_id: Number(connectorId),
      issue,
      maintenance_date: date,
      status
    };

    setData((prev) => ({
      ...prev,
      maintenance: [newEntry, ...prev.maintenance],
      connectors: prev.connectors.map((c) =>
        c.connector_id === Number(connectorId) ? { ...c, status: 'Maintenance' } : c
      )
    }));
  };

  const updateMaintenanceStatus = (maintenanceId, newStatus) => {
    setData((prev) => {
      const target = prev.maintenance.find((m) => m.maintenance_id === maintenanceId);
      const updatedList = prev.maintenance.map((m) =>
        m.maintenance_id === maintenanceId ? { ...m, status: newStatus } : m
      );

      let updatedConnectors = prev.connectors;
      if (newStatus === 'Completed' && target) {
        updatedConnectors = prev.connectors.map((c) =>
          c.connector_id === target.connector_id ? { ...c, status: 'Available' } : c
        );
      }

      return {
        ...prev,
        maintenance: updatedList,
        connectors: updatedConnectors
      };
    });
  };

  const addReview = (userId, stationId, rating, comment) => {
    const newId = Math.max(...data.reviews.map((r) => r.review_id), 0) + 1;
    const newRev = {
      review_id: newId,
      user_id: Number(userId),
      station_id: Number(stationId),
      rating: Number(rating),
      comment
    };

    setData((prev) => ({
      ...prev,
      reviews: [newRev, ...prev.reviews]
    }));
  };

  const addUser = (name, email, phone) => {
    const newId = Math.max(...data.users.map((u) => u.user_id), 0) + 1;
    const newUser = { user_id: newId, name, email, phone };
    setData((prev) => ({
      ...prev,
      users: [...prev.users, newUser]
    }));
    return newUser;
  };

  const addVehicle = (userId, vehicleNumber, model, batteryCapacity) => {
    const newId = Math.max(...data.vehicles.map((v) => v.vehicle_id), 0) + 1;
    const newVeh = {
      vehicle_id: newId,
      user_id: Number(userId),
      vehicle_number: vehicleNumber.toUpperCase(),
      model,
      battery_capacity: Number(batteryCapacity)
    };
    setData((prev) => ({
      ...prev,
      vehicles: [...prev.vehicles, newVeh]
    }));
    return newVeh;
  };

  // Start Live Simulation
  const startChargingSession = (userId, vehicleId, stationId, connectorId) => {
    const stationTariff = data.tariffs.find(
      (t) => t.station_id === Number(stationId)
    ) || data.tariffs[0];

    // Mark connector occupied
    updateConnectorStatus(Number(connectorId), 'Occupied');

    const newActive = {
      user_id: Number(userId),
      vehicle_id: Number(vehicleId),
      station_id: Number(stationId),
      connector_id: Number(connectorId),
      tariff_id: stationTariff.tariff_id,
      startTime: new Date().toISOString(),
      currentKwh: 2.0,
      currentCost: Number((2.0 * stationTariff.price_per_kwh).toFixed(2)),
      elapsedSeconds: 10
    };

    setActiveCharging(newActive);
  };

  // Stop Live Simulation & Record Session + Payment
  const completeChargingSession = (paymentMethod = 'UPI') => {
    if (!activeCharging) return null;

    const newSessionId = Math.max(...data.charging_sessions.map((s) => s.session_id), 0) + 1;
    const now = new Date();
    const durationMinutes = Math.max(1, Math.round(activeCharging.elapsedSeconds / 60) || 25);

    const nowStr = now.toISOString().replace('T', ' ').substring(0, 19);

    const newSession = {
      session_id: newSessionId,
      user_id: activeCharging.user_id,
      vehicle_id: activeCharging.vehicle_id,
      station_id: activeCharging.station_id,
      connector_id: activeCharging.connector_id,
      tariff_id: activeCharging.tariff_id,
      start_time: activeCharging.startTime.replace('T', ' ').substring(0, 19),
      end_time: nowStr,
      energy_delivered_kwh: Number(activeCharging.currentKwh.toFixed(2)),
      charging_duration_minutes: durationMinutes,
      total_cost: Number(activeCharging.currentCost.toFixed(2)),
      session_status: 'Completed'
    };

    const newPaymentId = Math.max(...data.payments.map((p) => p.payment_id), 0) + 1;
    const newPayment = {
      payment_id: newPaymentId,
      session_id: newSessionId,
      amount: newSession.total_cost,
      payment_method: paymentMethod,
      payment_status: 'Successful',
      transaction_reference: `EVPAY-TXN-${1000 + newPaymentId}`,
      payment_date: nowStr
    };

    // Free connector
    updateConnectorStatus(activeCharging.connector_id, 'Available');

    setData((prev) => ({
      ...prev,
      charging_sessions: [newSession, ...prev.charging_sessions],
      payments: [newPayment, ...prev.payments]
    }));

    setActiveCharging(null);
    return { session: newSession, payment: newPayment };
  };

  const cancelChargingSession = () => {
    if (activeCharging) {
      updateConnectorStatus(activeCharging.connector_id, 'Available');
      setActiveCharging(null);
    }
  };

  const updatePaymentStatus = (paymentId, status) => {
    setData((prev) => ({
      ...prev,
      payments: prev.payments.map((p) =>
        p.payment_id === paymentId ? { ...p, payment_status: status } : p
      )
    }));
  };

  // Aggregated Stats
  const totalRevenue = data.payments
    .filter((p) => p.payment_status === 'Successful')
    .reduce((acc, p) => acc + Number(p.amount), 0);

  const totalEnergy = data.charging_sessions
    .filter((s) => s.session_status === 'Completed')
    .reduce((acc, s) => acc + Number(s.energy_delivered_kwh), 0);

  const totalStations = data.charging_stations.length;
  const activeStations = data.charging_stations.filter((s) => s.station_status === 'Active').length;
  const totalConnectors = data.connectors.length;
  const availableConnectors = data.connectors.filter((c) => c.status === 'Available').length;

  return (
    <AppContext.Provider
      value={{
        data,
        resetToDefaults,
        // Entity helpers
        getLocation,
        getOperator,
        getStation,
        getUser,
        getVehicle,
        getStationConnectors,
        getStationTariffs,
        getStationReviews,
        getStationAvgRating,
        // Actions
        addStation,
        updateStationStatus,
        updateConnectorStatus,
        addBooking,
        addMaintenance,
        updateMaintenanceStatus,
        addReview,
        addUser,
        addVehicle,
        updatePaymentStatus,
        // Simulation
        activeCharging,
        startChargingSession,
        completeChargingSession,
        cancelChargingSession,
        // Aggregates
        stats: {
          totalRevenue,
          totalEnergy: Number(totalEnergy.toFixed(1)),
          totalStations,
          activeStations,
          totalConnectors,
          availableConnectors,
          totalUsers: data.users.length,
          totalVehicles: data.vehicles.length
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
