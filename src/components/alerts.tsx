import { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, X, Eye, Trash2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface Alert {
  id: number;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  expanded: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: 101,
    severity: "critical",
    title: "Critical: Jaipur water level 12.3m",
    description: "Water level has dropped dangerously below safe threshold. Immediate action required to prevent water scarcity. Consider emergency water sourcing and restrict usage.",
    timestamp: "2025-09-10T14:00:00Z",
    read: false,
    expanded: false
  },
  {
    id: 102,
    severity: "warning",
    title: "Warning: Bikaner water level 8.5m",
    description: "Water level decreasing steadily over the past 48 hours. Monitor carefully and prepare contingency measures if trend continues.",
    timestamp: "2025-09-10T13:30:00Z",
    read: false,
    expanded: false
  },
  {
    id: 103,
    severity: "info",
    title: "Info: Udaipur stable at 4.2m",
    description: "Water levels remain stable within safe operating parameters. No immediate action required but continue regular monitoring.",
    timestamp: "2025-09-10T12:45:00Z",
    read: true,
    expanded: false
  },
  {
    id: 104,
    severity: "warning",
    title: "Rainfall deficit detected",
    description: "Regional rainfall 30% below seasonal average. Consider implementing water conservation measures.",
    timestamp: "2025-09-09T16:20:00Z",
    read: true,
    expanded: false
  },
  {
    id: 105,
    severity: "info",
    title: "System maintenance completed",
    description: "Scheduled maintenance of DWLR sensors completed successfully. All systems operational.",
    timestamp: "2025-09-08T09:15:00Z",
    read: true,
    expanded: false
  }
];

export function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#E53935';
      case 'warning': return '#F9A825';
      case 'info': return '#0D47A1';
      default: return '#CFD8DC';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'default';
      default: return 'outline';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const markAsRead = (id: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const toggleExpanded = (id: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, expanded: !alert.expanded } : alert
    ));
  };

  const filteredAlerts = alerts.filter(alert => {
    switch (filter) {
      case 'unread': return !alert.read;
      case 'critical': return alert.severity === 'critical';
      default: return true;
    }
  });

  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="pb-20 min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white p-4 pt-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-white">Alerts</h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-white text-primary">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <p className="text-primary-foreground/80 text-sm">System notifications and warnings</p>
      </div>

      <div className="p-4 -mt-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'All', count: alerts.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'critical', label: 'Critical', count: alerts.filter(a => a.severity === 'critical').length }
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              variant={filter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(key as any)}
              className={`text-xs ${filter === key ? 'bg-primary text-white' : ''}`}
            >
              {label} ({count})
            </Button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.length === 0 ? (
            <Card className="shadow-sm border-0">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600">No alerts to show</p>
                <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`shadow-sm border-0 transition-all duration-200 ${
                  !alert.read ? 'bg-blue-50 border-l-4 border-l-primary' : 'bg-white'
                }`}
              >
                <Collapsible 
                  open={alert.expanded} 
                  onOpenChange={() => toggleExpanded(alert.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardContent className="p-4 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getSeverityIcon(alert.severity)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-sm ${!alert.read ? 'text-black' : 'text-gray-900'}`}>
                                  {alert.title}
                                </span>
                                {!alert.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={getSeverityBadge(alert.severity) as any} className="text-xs">
                                  {alert.severity.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {formatTimestamp(alert.timestamp)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="px-4 pb-4">
                      <div className="ml-7">
                        <p className="text-sm text-gray-700 mb-4">
                          {alert.description}
                        </p>
                        <div className="flex gap-2">
                          {!alert.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(alert.id);
                              }}
                              className="text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Mark as Read
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              dismissAlert(alert.id);
                            }}
                            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        {unreadCount > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {unreadCount} unread alert{unreadCount > 1 ? 's' : ''}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
                }}
                className="text-xs text-blue-600 border-blue-200 hover:bg-blue-100"
              >
                Mark All as Read
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}