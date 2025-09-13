import { useState, useEffect } from 'react';
import { Settings, Droplet, CloudRain, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface SimulationResult {
  status: 'safe' | 'warning' | 'critical';
  predictedLevel: number;
  recommendation: string;
  impact: string;
}

export function ScenarioSimulation() {
  const [rainfall, setRainfall] = useState([50]);
  const [pumping, setPumping] = useState([30]);
  const [result, setResult] = useState<SimulationResult>({
    status: 'safe',
    predictedLevel: 8.2,
    recommendation: 'Maintain current practices',
    impact: 'Stable water levels expected'
  });

  // Generate comparison data based on slider values
  const generateComparisonData = () => {
    const baseLevel = 10;
    const rainfallEffect = (rainfall[0] - 50) * 0.05; // Rainfall increases level
    const pumpingEffect = (pumping[0] - 30) * -0.03; // Pumping decreases level
    
    return [
      {
        scenario: 'Current',
        level: baseLevel,
        fill: '#43A047'
      },
      {
        scenario: 'Simulated',
        level: Math.max(0, baseLevel + rainfallEffect + pumpingEffect),
        fill: result.status === 'safe' ? '#43A047' : result.status === 'warning' ? '#F9A825' : '#E53935'
      }
    ];
  };

  const generateTrendData = () => {
    const data = [];
    const baseLevel = 10;
    
    for (let i = 0; i < 12; i++) {
      const rainfallEffect = (rainfall[0] - 50) * 0.02 * Math.sin(i * 0.5);
      const pumpingEffect = (pumping[0] - 30) * -0.015 * (1 + i * 0.1);
      
      data.push({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        current: baseLevel + Math.sin(i * 0.3) * 1.5,
        simulated: Math.max(0, baseLevel + rainfallEffect + pumpingEffect + Math.sin(i * 0.3) * 1.5),
      });
    }
    return data;
  };

  // Update simulation results when sliders change
  useEffect(() => {
    const calculateResult = () => {
      const rainfallImpact = rainfall[0] / 100;
      const pumpingImpact = pumping[0] / 100;
      
      // Simplified simulation logic
      const waterStress = (pumpingImpact * 1.2) - (rainfallImpact * 0.8);
      const baseLevel = 10;
      const predictedLevel = Math.max(0, baseLevel - (waterStress * 5));

      let status: 'safe' | 'warning' | 'critical';
      let recommendation: string;
      let impact: string;

      if (predictedLevel > 7) {
        status = 'safe';
        recommendation = 'Continue current water management practices';
        impact = 'Sustainable water levels maintained';
      } else if (predictedLevel > 4) {
        status = 'warning';
        recommendation = 'Consider reducing pumping rates or increasing recharge';
        impact = 'Water levels approaching concerning thresholds';
      } else {
        status = 'critical';
        recommendation = 'Immediate action required: Reduce pumping, emergency recharge';
        impact = 'Critical water shortage risk detected';
      }

      setResult({
        status,
        predictedLevel: Math.round(predictedLevel * 10) / 10,
        recommendation,
        impact
      });
    };

    calculateResult();
  }, [rainfall, pumping]);

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

  const resetToDefaults = () => {
    setRainfall([50]);
    setPumping([30]);
  };

  return (
    <div className="pb-20 min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-4 pt-12">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="h-5 w-5" />
          <h1 className="text-white">Scenario Simulation</h1>
        </div>
        <p className="text-primary-foreground/80 text-sm">Predict water levels with different conditions</p>
      </div>

      <div className="p-4 -mt-4">
        {/* Parameter Controls */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-sm">Simulation Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rainfall Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CloudRain className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Rainfall</span>
                </div>
                <span className="text-sm text-primary">{rainfall[0]}%</span>
              </div>
              <Slider
                value={rainfall}
                onValueChange={setRainfall}
                max={200}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Drought (0%)</span>
                <span>Normal (100%)</span>
                <span>Flood (200%)</span>
              </div>
            </div>

            {/* Pumping Slider */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Pumping Rate</span>
                </div>
                <span className="text-sm text-primary">{pumping[0]}%</span>
              </div>
              <Slider
                value={pumping}
                onValueChange={setPumping}
                max={100}
                min={0}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Minimal (0%)</span>
                <span>Normal (50%)</span>
                <span>Maximum (100%)</span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="w-full text-sm"
            >
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>

        {/* Simulation Results */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-sm">Prediction Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between p-4 rounded-lg" 
                   style={{ backgroundColor: `${getStatusColor(result.status)}10` }}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" 
                       style={{ backgroundColor: getStatusColor(result.status) }} />
                  <div>
                    <p className="font-medium">Status: {result.status.toUpperCase()}</p>
                    <p className="text-sm text-gray-600">Predicted Level: {result.predictedLevel}m</p>
                  </div>
                </div>
                <Badge variant={getStatusBadgeVariant(result.status) as any}>
                  {result.status.toUpperCase()}
                </Badge>
              </div>

              {/* Impact & Recommendation */}
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm mb-1">Expected Impact</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {result.impact}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm mb-1">Recommendation</h4>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                    {result.recommendation}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Chart */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-sm">Level Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={generateComparisonData()}>
                  <XAxis dataKey="scenario" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Bar dataKey="level" fill="#0D47A1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Trend Projection */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-sm">12-Month Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={generateTrendData()}>
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="current" 
                    stroke="#43A047" 
                    strokeWidth={2}
                    name="Current Trend"
                    dot={{ fill: '#43A047', strokeWidth: 2, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="simulated" 
                    stroke="#0D47A1" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Simulated"
                    dot={{ fill: '#0D47A1', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Warning for critical scenarios */}
        {result.status === 'critical' && (
          <Card className="mt-6 bg-red-50 border-red-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-800 mb-1">Critical Water Shortage Risk</h4>
                  <p className="text-sm text-red-700">
                    The current simulation parameters indicate a high risk of water shortage. 
                    Consider implementing emergency conservation measures and alternative water sources.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}