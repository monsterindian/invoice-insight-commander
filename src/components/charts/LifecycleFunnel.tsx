import { FunnelChart, Funnel, Cell, ResponsiveContainer, Tooltip, LabelList } from 'recharts';
import { ChartContainer } from './ChartContainer';

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

interface LifecycleFunnelProps {
  data: Array<{
    stage: string;
    count: number;
    percentage: number;
    dropOffRate: number;
  }>;
  height?: number;
  calculation?: ChartCalculation;
  title?: string;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

export const LifecycleFunnel = ({ data, height = 400, calculation, title = "Chart" }: LifecycleFunnelProps) => {
  const chartContent = (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={height}>
        <FunnelChart>
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
              boxShadow: 'var(--shadow-elevated)'
            }}
            formatter={(value: number, name: string) => [
              value.toLocaleString(),
              name
            ]}
          />
          <Funnel
            dataKey="count"
            data={data}
            isAnimationActive
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            <LabelList position="center" fill="#fff" stroke="none" />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
      
      {/* Stage Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((stage, index) => (
          <div
            key={stage.stage}
            className="p-4 rounded-lg border bg-gradient-card shadow-card"
          >
            <div className="space-y-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <h4 className="font-semibold text-sm">{stage.stage}</h4>
              <div className="space-y-1">
                <p className="text-lg font-bold">{stage.count.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {stage.percentage.toFixed(1)}% of total
                </p>
                {stage.dropOffRate > 0 && (
                  <p className="text-xs text-destructive">
                    -{stage.dropOffRate.toFixed(1)}% drop-off
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <ChartContainer calculation={calculation} title={title}>
      {chartContent}
    </ChartContainer>
  );
};