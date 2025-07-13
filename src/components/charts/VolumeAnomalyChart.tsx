import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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

interface VolumeAnomalyChartProps {
  data: Array<{
    month: string;
    fileCount: number;
    invoiceCount: number;
    isAnomaly: boolean;
    anomalyScore: number;
  }>;
  height?: number;
  calculation?: ChartCalculation;
  title?: string;
}

export const VolumeAnomalyChart = ({ data, height = 300, calculation, title = "Chart" }: VolumeAnomalyChartProps) => {
  const chartContent = (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="month" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          yAxisId="volume"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          orientation="left"
        />
        <YAxis 
          yAxisId="anomaly"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          orientation="right"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            boxShadow: 'var(--shadow-elevated)'
          }}
          formatter={(value: number, name: string) => {
            if (name === 'Anomaly Score') return [`${value.toFixed(2)}`, name];
            return [value.toLocaleString(), name];
          }}
        />
        <Legend />
        
        <Bar 
          yAxisId="volume"
          dataKey="fileCount" 
          fill="hsl(var(--chart-1))"
          name="File Count"
          radius={[4, 4, 0, 0]}
        />
        <Bar 
          yAxisId="volume"
          dataKey="invoiceCount" 
          fill="hsl(var(--chart-2))"
          name="Invoice Count"
          radius={[4, 4, 0, 0]}
        />
        <Line
          yAxisId="anomaly"
          type="monotone"
          dataKey="anomalyScore"
          stroke="hsl(var(--destructive))"
          strokeWidth={3}
          name="Anomaly Score"
          dot={(props) => {
            const { cx, cy, payload } = props;
            if (payload?.isAnomaly) {
              return (
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={6} 
                  fill="hsl(var(--destructive))" 
                  stroke="white" 
                  strokeWidth={2}
                />
              );
            }
            return <circle cx={cx} cy={cy} r={3} fill="hsl(var(--destructive))" />;
          }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );

  return (
    <ChartContainer calculation={calculation} title={title}>
      {chartContent}
    </ChartContainer>
  );
};