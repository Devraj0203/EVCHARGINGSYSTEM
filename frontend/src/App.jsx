import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { StationsView } from './components/StationsView';
import { ChargingSimulatorView } from './components/ChargingSimulatorView';
import { BookingView } from './components/BookingView';
import { PaymentsView } from './components/PaymentsView';
import { MaintenanceView } from './components/MaintenanceView';
import { FleetView } from './components/FleetView';
import { ReviewsView } from './components/ReviewsView';
import { AnalyticsView } from './components/AnalyticsView';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [preselectedStationId, setPreselectedStationId] = useState(null);

  const handleSelectStationForCharging = (stationId) => {
    setPreselectedStationId(stationId);
    setActiveTab('charger');
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar onQuickAction={(tab) => setActiveTab(tab)} />

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0b0f19]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
            {activeTab === 'stations' && (
              <StationsView
                setActiveTab={setActiveTab}
                onSelectStationForCharging={handleSelectStationForCharging}
              />
            )}
            {activeTab === 'charger' && (
              <ChargingSimulatorView preselectedStationId={preselectedStationId} />
            )}
            {activeTab === 'slots' && <BookingView />}
            {activeTab === 'payments' && <PaymentsView />}
            {activeTab === 'maintenance' && <MaintenanceView />}
            {activeTab === 'fleet' && <FleetView />}
            {activeTab === 'reviews' && <ReviewsView />}
            {activeTab === 'analytics' && <AnalyticsView />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}