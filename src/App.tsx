import { useState } from 'react';
import { Navigation } from './components/navigation';
import { Dashboard } from './components/dashboard';
import { StationDetail } from './components/station-detail';
import { Alerts } from './components/alerts';
import { ScenarioSimulation } from './components/scenario-simulation';
import { Reports } from './components/reports';
import { Profile } from './components/profile';
import { Toaster } from './components/ui/sonner';

interface Station {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  groundwater_level: number;
  recharge_index: number;
  last_updated: string;
  status: 'safe' | 'warning' | 'critical';
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setActiveScreen('station-detail');
  };

  const handleBackToDashboard = () => {
    setSelectedStation(null);
    setActiveScreen('dashboard');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard onStationSelect={handleStationSelect} />;
      case 'station-detail':
        return selectedStation ? (
          <StationDetail station={selectedStation} onBack={handleBackToDashboard} />
        ) : (
          <Dashboard onStationSelect={handleStationSelect} />
        );
      case 'alerts':
        return <Alerts />;
      case 'simulation':
        return <ScenarioSimulation />;
      case 'reports':
        return <Reports />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard onStationSelect={handleStationSelect} />;
    }
  };

  return (
    <div className="size-full min-h-screen bg-background">
      {/* Main Content */}
      <main className="relative">
        {renderScreen()}
      </main>

      {/* Bottom Navigation - Hidden on station detail screen */}
      {activeScreen !== 'station-detail' && (
        <Navigation activeScreen={activeScreen} onScreenChange={setActiveScreen} />
      )}

      {/* Toast Notifications */}
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: '14px',
          }
        }}
      />
    </div>
  );
}