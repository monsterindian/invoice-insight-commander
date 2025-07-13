import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface CalculationStep {
  step: string;
  formula: string;
  value: string;
}

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  icon?: React.ReactNode;
  calculation?: {
    description: string;
    steps: CalculationStep[];
    dataSource: string;
    totalRecords: number;
  };
}

export const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  variant = 'default',
  icon,
  calculation
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={`p-6 cursor-help ${getCardStyle()}`}>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {icon && <div className="text-primary">{icon}</div>}
                  <p className="text-sm font-medium text-muted-foreground">{title}</p>
                  {calculation && <Info className="h-3 w-3 text-muted-foreground" />}
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
        </TooltipTrigger>
        {calculation && (
          <TooltipContent side="bottom" className="max-w-md p-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">{title} Calculation</h4>
                <p className="text-xs text-muted-foreground mt-1">{calculation.description}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-medium">Calculation Steps:</p>
                {calculation.steps.map((step, index) => (
                  <div key={index} className="text-xs space-y-1">
                    <p className="font-medium">{step.step}</p>
                    <p className="font-mono text-muted-foreground">{step.formula}</p>
                    <p className="text-primary">{step.value}</p>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-2 text-xs text-muted-foreground">
                <p><strong>Data Source:</strong> {calculation.dataSource}</p>
                <p><strong>Records Processed:</strong> {calculation.totalRecords.toLocaleString()}</p>
              </div>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};