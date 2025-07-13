import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  height?: number;
  color?: string;
  calculation?: ChartCalculation;
  title?: string;
}

export const BarChart = ({ data, height = 300, color = 'hsl(var(--chart-1))', calculation, title = "Chart" }: BarChartProps) => {
  const chartContent = (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="name" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            boxShadow: 'var(--shadow-elevated)'
          }}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
        />
        <Bar 
          dataKey="value" 
          fill={color}
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );

  return (
    <ChartContainer calculation={calculation} title={title}>
      {chartContent}
    </ChartContainer>
  );
};