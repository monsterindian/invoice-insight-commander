import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface AlertRule {
  id: string;
  title: string;
  condition: string;
  threshold: number;
  isTriggered: boolean;
  severity: 'low' | 'medium' | 'high';
  value?: number;
}

interface AlertDashboardProps {
  alerts: AlertRule[];
}

export const AlertDashboard = ({ alerts }: AlertDashboardProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string, isTriggered: boolean) => {
    if (!isTriggered) return <CheckCircle className="h-4 w-4 text-success" />;
    
    switch (severity) {
      case 'high': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'low': return <Clock className="h-4 w-4 text-muted-foreground" />;
      default: return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const triggeredAlerts = alerts.filter(alert => alert.isTriggered);
  const activeAlerts = alerts.filter(alert => !alert.isTriggered);

  return (
    <div className="space-y-6">
      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-destructive">High Priority</p>
                <p className="text-2xl font-bold">{triggeredAlerts.filter(a => a.severity === 'high').length}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-warning">Medium Priority</p>
                <p className="text-2xl font-bold">{triggeredAlerts.filter(a => a.severity === 'medium').length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-success">All Clear</p>
                <p className="text-2xl font-bold">{activeAlerts.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Rules</p>
                <p className="text-2xl font-bold">{alerts.length}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      {triggeredAlerts.length > 0 && (
        <Card className="bg-gradient-card shadow-elevated border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {triggeredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-destructive/5 to-transparent border border-destructive/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(alert.severity, alert.isTriggered)}
                    <div>
                      <h4 className="font-semibold">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getSeverityColor(alert.severity) as any}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                    {alert.value && (
                      <p className="text-sm mt-1 font-mono">
                        {alert.value.toLocaleString()} / {alert.threshold.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Alert Rules */}
      <Card className="bg-gradient-card shadow-card">
        <CardHeader>
          <CardTitle>Alert Rules Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getSeverityIcon(alert.severity, alert.isTriggered)}
                  <div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">{alert.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={alert.isTriggered ? getSeverityColor(alert.severity) as any : 'outline'}
                  >
                    {alert.isTriggered ? 'TRIGGERED' : 'MONITORING'}
                  </Badge>
                  <p className="text-xs mt-1 text-muted-foreground">
                    Threshold: {alert.threshold.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};