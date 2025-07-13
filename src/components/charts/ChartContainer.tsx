import { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface CalculationStep {
  step: string;
  formula: string;
  value: string;
}

interface ChartCalculation {
  description: string;
  steps: CalculationStep[];
  dataSource: string;
  totalRecords: number;
  methodology?: string;
}

interface ChartContainerProps {
  children: ReactNode;
  calculation?: ChartCalculation;
  title: string;
}

export const ChartContainer = ({ children, calculation, title }: ChartContainerProps) => {
  if (!calculation) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative cursor-help">
            {children}
            <div className="absolute top-2 right-2 p-1 bg-background/80 rounded-full border">
              <Info className="h-3 w-3 text-muted-foreground" />
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-md p-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm">{title} Calculation</h4>
              <p className="text-xs text-muted-foreground mt-1">{calculation.description}</p>
            </div>
            
            {calculation.methodology && (
              <div>
                <p className="text-xs font-medium">Methodology:</p>
                <p className="text-xs text-muted-foreground">{calculation.methodology}</p>
              </div>
            )}
            
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
      </Tooltip>
    </TooltipProvider>
  );
};