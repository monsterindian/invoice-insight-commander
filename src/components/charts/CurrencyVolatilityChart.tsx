import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

interface CurrencyVolatilityChartProps {
  data: Array<{
    month: string;
    [currency: string]: number | string;
  }>;
  currencies: string[];
  height?: number;
}

export const CurrencyVolatilityChart = ({ data, currencies, height = 300 }: CurrencyVolatilityChartProps) => {
  const colors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

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
        
        {currencies.map((currency, index) => (
          <Line
            key={currency}
            type="monotone"
            dataKey={currency}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            name={currency}
            dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: colors[index % colors.length] }}
          />
        ))}
        
        {/* Add reference line for stability threshold */}
        <ReferenceLine y={50000} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  );
};