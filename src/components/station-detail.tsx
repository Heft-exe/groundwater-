import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Droplet, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

interface StationDetailProps {
  station: Station;
  onBack: () => void;
}

// Mock data for charts
const generateTimeSeriesData = (days: number) => {
  const data = [];
  const baseLevel = 10;
  for (let i = 0; i < days; i++) {
    data.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      level: baseLevel + Math.sin(i * 0.1) * 2 + Math.random() * 1,
      prediction: baseLevel + Math.sin((i + 5) * 0.1) * 2,
    });
  }
  return data;
};

const hourlyData = generateTimeSeriesData(24);
const dailyData = generateTimeSeriesData(30);
const monthlyData = generateTimeSeriesData(12);

export function StationDetail({ station, onBack }: StationDetailProps) {
  const [timeframe, setTimeframe] = useState<'hourly' | 'daily' | 'monthly'>('daily');
  const [animatedLevel, setAnimatedLevel] = useState(0);

  useEffect(() => {
    // Animate the gauge on load
    const timer = setTimeout(() => {
      setAnimatedLevel(station.recharge_index);
    }, 500);
    return () => clearTimeout(timer);
  }, [station.recharge_index]);

  const getChartData = () => {
    switch (timeframe) {
      case 'hourly': return hourlyData;
      case 'monthly': return monthlyData;
      default: return dailyData;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return '#43A047';
      case 'warning': return '#F9A825';
      case 'critical': return '#E53935';
      default: return '#CFD8DC';
    }
  };

  const gaugeData = [
    { name: 'Used', value: animatedLevel, fill: getStatusColor(station.status) },
    { name: 'Available', value: 100 - animatedLevel, fill: '#f0f0f0' }
  ];

  const alerts = [
    {
      id: 1,
      type: station.status,
      message: station.status === 'critical' 
        ? 'Water level critically low - immediate action required'
        : station.status === 'warning'
        ? 'Water level decreasing - monitoring recommended' 
        : 'Water level stable - no action required',
      time: '2 hours ago'
    }
  ];

  return (
    <div className="pb-20 min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-4 pt-12">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/10 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-white">{station.name}</h1>
            <div className="flex items-center gap-1 text-sm text-white/80">
              <MapPin className="h-3 w-3" />
              <span>{station.latitude.toFixed(4)}, {station.longitude.toFixed(4)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 -mt-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Droplet className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">Water Level</span>
              </div>
              <div className="text-2xl">{station.groundwater_level}m</div>
              <div className="text-xs text-gray-500">Below surface</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Last Update</span>
              </div>
              <div className="text-sm">Just now</div>
              <div className="text-xs text-gray-500">Real-time data</div>
            </CardContent>
          </Card>
        </div>

        {/* Recharge Gauge */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4" />
              Recharge Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {gaugeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl" style={{ color: getStatusColor(station.status) }}>
                    {animatedLevel}%
                  </div>
                  <div className="text-xs text-gray-500">Recharge</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trend Chart */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-sm">Water Level Trends</CardTitle>
            <Tabs value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="hourly" className="text-xs">Hourly</TabsTrigger>
                <TabsTrigger value="daily" className="text-xs">Daily</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Line 
                    type="monotone" 
                    dataKey="level" 
                    stroke="#0D47A1" 
                    strokeWidth={2}
                    dot={{ fill: '#0D47A1', strokeWidth: 2, r: 3 }}
                    animationDuration={1000}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="prediction" 
                    stroke="#F9A825" 
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-primary"></div>
                <span>Actual</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-0.5 border-t-2 border-dashed" style={{ borderColor: '#F9A825' }}></div>
                <span>Predicted</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts for this station */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-sm">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div
                    className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: getStatusColor(alert.type as any) }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}