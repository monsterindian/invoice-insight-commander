import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TimeSeriesChartProps {
  data: Array<{
    month: string;
    totalCharge: number;
    [key: string]: any;
  }>;
  height?: number;
  lines?: Array<{
    dataKey: string;
    color: string;
    name: string;
  }>;
}

export const TimeSeriesChart = ({ data, height = 300, lines }: TimeSeriesChartProps) => {
  const defaultLines = [
    { dataKey: 'totalCharge', color: 'hsl(var(--chart-1))', name: 'Total Charges' }
  ];

  const chartLines = lines || defaultLines;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="month" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
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
          formatter={(value: number, name: string) => [
            `$${value.toLocaleString()}`,
            name
          ]}
        />
        <Legend />
        {chartLines.map((line, index) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            name={line.name}
            dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: line.color }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};