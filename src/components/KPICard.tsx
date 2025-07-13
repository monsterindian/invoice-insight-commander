import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  icon?: React.ReactNode;
}

export const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  variant = 'default',
  icon 
}: KPICardProps) => {
  const getTrendIcon = () => {
    if (trend === undefined) return null;
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = () => {
    if (trend === undefined) return '';
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getCardStyle = () => {
    switch (variant) {
      case 'success':
        return 'bg-gradient-success border-success/20 shadow-elevated';
      case 'warning':
        return 'bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 shadow-elevated';
      case 'destructive':
        return 'bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 shadow-elevated';
      default:
        return 'bg-gradient-card border shadow-card hover:shadow-elevated transition-all duration-300';
    }
  };

  return (
    <Card className={`p-6 ${getCardStyle()}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {icon && <div className="text-primary">{icon}</div>}
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        {trend !== undefined && (
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {Math.abs(trend).toFixed(1)}%
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};