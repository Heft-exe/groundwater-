import { useState } from 'react';
import { MapPin, Droplet, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

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

interface DashboardProps {
  onStationSelect: (station: Station) => void;
}

const mockStations: Station[] = [
  {
    id: 1,
    name: "Jaipur Station",
    latitude: 26.9124,
    longitude: 75.7873,
    groundwater_level: 12.3,
    recharge_index: 45,
    last_updated: "2025-09-10T14:00:00Z",
    status: "critical"
  },
  {
    id: 2,
    name: "Bikaner Station",
    latitude: 28.0229,
    longitude: 73.3119,
    groundwater_level: 8.5,
    recharge_index: 60,
    last_updated: "2025-09-10T13:30:00Z",
    status: "warning"
  },
  {
    id: 3,
    name: "Udaipur Station",
    latitude: 24.5854,
    longitude: 73.7125,
    groundwater_level: 4.2,
    recharge_index: 80,
    last_updated: "2025-09-10T12:45:00Z",
    status: "safe"
  }
];

export function Dashboard({ onStationSelect }: DashboardProps) {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return '#43A047';
      case 'warning': return '#F9A825';
      case 'critical': return '#E53935';
      default: return '#CFD8DC';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'safe': return 'default';
      case 'warning': return 'secondary';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
    setShowModal(true);
  };

  const viewDetails = () => {
    if (selectedStation) {
      onStationSelect(selectedStation);
      setShowModal(false);
    }
  };

  return (
    <div className="pb-20 min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-4 pt-12">
        <h1 className="mb-2 text-white">WGT Monitoring</h1>
        <p className="text-primary-foreground/80 text-sm">Real-time groundwater management</p>
      </div>

      {/* Stats Cards */}
      <div className="p-4 -mt-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-1" style={{ color: '#43A047' }}>1</div>
              <div className="text-xs text-gray-600">Safe</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-1" style={{ color: '#F9A825' }}>1</div>
              <div className="text-xs text-gray-600">Warning</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-1" style={{ color: '#E53935' }}>1</div>
              <div className="text-xs text-gray-600">Critical</div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Map Placeholder */}
        <Card className="mb-6 overflow-hidden shadow-lg border-0">
          <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                <p className="text-gray-600">Interactive Heatmap</p>
                <p className="text-xs text-gray-500">Tap stations below to explore</p>
              </div>
            </div>
            
            {/* Station markers overlay */}
            <div className="absolute inset-0">
              {mockStations.map((station, index) => (
                <div
                  key={station.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${30 + index * 25}%`,
                    top: `${40 + index * 15}%`,
                  }}
                  onClick={() => handleStationClick(station)}
                >
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-lg animate-pulse"
                    style={{ backgroundColor: getStatusColor(station.status) }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Station List */}
        <div className="space-y-3">
          <h3 className="text-primary">DWLR Stations</h3>
          {mockStations.map((station) => (
            <Card
              key={station.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 shadow-sm"
              onClick={() => handleStationClick(station)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{station.name}</span>
                  </div>
                  <Badge variant={getStatusBadgeVariant(station.status)} className="text-xs">
                    {station.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Droplet className="h-3 w-3" />
                    <span>{station.groundwater_level}m</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{station.recharge_index}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Station Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm mx-auto">
          {selectedStation && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {selectedStation.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <Badge variant={getStatusBadgeVariant(selectedStation.status)}>
                    {selectedStation.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Water Level</span>
                  <div className="flex items-center gap-1">
                    <Droplet className="h-4 w-4 text-blue-500" />
                    <span>{selectedStation.groundwater_level}m</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Recharge Index</span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>{selectedStation.recharge_index}%</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Button 
                    onClick={viewDetails}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    View Detailed Analytics
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}