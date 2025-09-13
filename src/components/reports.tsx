import { useState } from 'react';
import { FileText, Download, Calendar, MapPin, BarChart3, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from "sonner@2.0.3";

export function Reports() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [isGenerating, setIsGenerating] = useState(false);

  const regionStats = {
    all: {
      totalStations: 3,
      safeStations: 1,
      warningStations: 1,
      criticalStations: 1,
      avgLevel: 8.33,
      avgRecharge: 61.67
    },
    jaipur: {
      totalStations: 1,
      safeStations: 0,
      warningStations: 0,
      criticalStations: 1,
      avgLevel: 12.3,
      avgRecharge: 45
    },
    bikaner: {
      totalStations: 1,
      safeStations: 0,
      warningStations: 1,
      criticalStations: 0,
      avgLevel: 8.5,
      avgRecharge: 60
    },
    udaipur: {
      totalStations: 1,
      safeStations: 1,
      warningStations: 0,
      criticalStations: 0,
      avgLevel: 4.2,
      avgRecharge: 80
    }
  };

  const currentStats = regionStats[selectedRegion as keyof typeof regionStats];

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    toast.success("Report generated successfully!", {
      description: "Your groundwater monitoring report is ready for download."
    });
  };

  const getStatusPercentage = (safe: number, warning: number, critical: number, total: number) => {
    return {
      safe: Math.round((safe / total) * 100),
      warning: Math.round((warning / total) * 100),
      critical: Math.round((critical / total) * 100)
    };
  };

  const statusPercentages = getStatusPercentage(
    currentStats.safeStations,
    currentStats.warningStations,
    currentStats.criticalStations,
    currentStats.totalStations
  );

  return (
    <div className="pb-20 min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-4 pt-12">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5" />
          <h1 className="text-white">Reports & Analysis</h1>
        </div>
        <p className="text-primary-foreground/80 text-sm">Generate comprehensive groundwater reports</p>
      </div>

      <div className="p-4 -mt-4">
        {/* Filter Controls */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-sm">Report Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600 mb-2 block">Region</label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="jaipur">Jaipur</SelectItem>
                    <SelectItem value="bikaner">Bikaner</SelectItem>
                    <SelectItem value="udaipur">Udaipur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-gray-600 mb-2 block">Time Period</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button
              onClick={generateReport}
              disabled={isGenerating}
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate PDF Report'}
            </Button>
          </CardContent>
        </Card>

        {/* Regional Overview */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {selectedRegion === 'all' ? 'All Regions' : selectedRegion.charAt(0).toUpperCase() + selectedRegion.slice(1)} Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl text-primary">{currentStats.totalStations}</div>
                <div className="text-xs text-gray-600">Total Stations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-blue-600">{currentStats.avgLevel}m</div>
                <div className="text-xs text-gray-600">Avg Water Level</div>
              </div>
            </div>

            {/* Status Distribution */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm">Safe</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{currentStats.safeStations}</span>
                  <Badge variant="outline" className="text-xs">
                    {statusPercentages.safe}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-sm">Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{currentStats.warningStations}</span>
                  <Badge variant="outline" className="text-xs">
                    {statusPercentages.warning}%
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm">Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{currentStats.criticalStations}</span>
                  <Badge variant="outline" className="text-xs">
                    {statusPercentages.critical}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Avg Recharge</span>
              </div>
              <div className="text-xl">{currentStats.avgRecharge}%</div>
              <div className="text-xs text-gray-500">
                {currentStats.avgRecharge > 60 ? 'Above average' : 'Below average'}
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-gray-600">Risk Level</span>
              </div>
              <div className="text-xl text-orange-600">
                {currentStats.criticalStations > 0 ? 'High' : 
                 currentStats.warningStations > 0 ? 'Medium' : 'Low'}
              </div>
              <div className="text-xs text-gray-500">
                Based on critical stations
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policy Recommendations */}
        <Card className="mb-6 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-sm">Policy Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentStats.criticalStations > 0 && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm text-red-800">Emergency Action Required</h4>
                      <p className="text-xs text-red-700 mt-1">
                        Implement immediate water conservation measures and alternative sourcing for critical stations.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStats.warningStations > 0 && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm text-yellow-800">Monitoring Required</h4>
                      <p className="text-xs text-yellow-700 mt-1">
                        Increase monitoring frequency and prepare contingency plans for warning stations.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm text-blue-800">Long-term Strategy</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Develop sustainable groundwater management policies based on regional recharge patterns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports History */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-sm">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: '2025-09-10', type: 'Monthly Report', region: 'All Regions', status: 'Generated' },
                { date: '2025-09-03', type: 'Weekly Summary', region: 'Jaipur', status: 'Generated' },
                { date: '2025-09-01', type: 'Quarterly Analysis', region: 'All Regions', status: 'Generated' },
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-3 w-3 text-gray-500" />
                      <span className="text-sm">{report.type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{report.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{report.region}</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}