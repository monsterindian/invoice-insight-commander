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

interface HeatmapProps {
  data: Array<{
    region: string;
    country: string;
    value: number;
    riskScore?: number;
  }>;
  height?: number;
  calculation?: ChartCalculation;
  title?: string;
}

export const GeoHeatmap = ({ data, height = 300, calculation, title = "Chart" }: HeatmapProps) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  const getIntensity = (value: number) => {
    const intensity = value / maxValue;
    return `hsl(var(--chart-1) / ${Math.max(0.2, intensity)})`;
  };

  const getRiskColor = (riskScore: number = 0) => {
    if (riskScore > 0.7) return 'hsl(var(--destructive))';
    if (riskScore > 0.4) return 'hsl(var(--warning))';
    return 'hsl(var(--success))';
  };

  const chartContent = (
    <div className="space-y-4" style={{ height }}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div
            key={`${item.region}-${item.country}`}
            className="p-4 rounded-lg border transition-all duration-200 hover:shadow-lg"
            style={{
              backgroundColor: getIntensity(item.value),
              borderColor: item.riskScore ? getRiskColor(item.riskScore) : 'hsl(var(--border))'
            }}
          >
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">{item.country}</h4>
              <p className="text-xs text-muted-foreground">{item.region}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${item.value.toLocaleString()}</span>
                {item.riskScore && (
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ backgroundColor: getRiskColor(item.riskScore), color: 'white' }}
                  >
                    Risk: {(item.riskScore * 100).toFixed(0)}%
                  </span>
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