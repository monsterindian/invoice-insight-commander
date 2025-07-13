import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPICard } from '@/components/KPICard';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { GeoHeatmap } from '@/components/charts/GeoHeatmap';
import { VolumeAnomalyChart } from '@/components/charts/VolumeAnomalyChart';
import { CurrencyVolatilityChart } from '@/components/charts/CurrencyVolatilityChart';
import { LifecycleFunnel } from '@/components/charts/LifecycleFunnel';
import { AlertDashboard } from '@/components/charts/AlertDashboard';
import { sampleInvoiceData } from '@/data/sampleInvoiceData';
import { 
  calculateKPIs, 
  getMonthlyTrends, 
  getTopServiceCodes, 
  getTopEventDescriptions,
  getCurrencyDistribution,
  getSchemeAnalytics,
  getNegativeRateAnalysis,
  getGeoAnalytics,
  getVolumeAnalytics,
  getCurrencyVolatility,
  getCollectionMethodAnalysis,
  getUOMAnalysis,
  getLifecycleAnalysis,
  getAgentRecommendations,
  getDynamicBenchmarks,
  generateAlertRules
} from '@/utils/dataAnalytics';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  AlertTriangle,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Globe,
  Zap,
  Shield,
  Target,
  Brain,
  Bell
} from 'lucide-react';

export const Dashboard = () => {
  const kpis = useMemo(() => calculateKPIs(sampleInvoiceData), []);
  const monthlyTrends = useMemo(() => getMonthlyTrends(sampleInvoiceData), []);
  const topServiceCodes = useMemo(() => getTopServiceCodes(sampleInvoiceData), []);
  const topEventDescriptions = useMemo(() => getTopEventDescriptions(sampleInvoiceData), []);
  const currencyDistribution = useMemo(() => getCurrencyDistribution(sampleInvoiceData), []);
  const schemeAnalytics = useMemo(() => getSchemeAnalytics(sampleInvoiceData), []);
  const negativeRateAnalysis = useMemo(() => getNegativeRateAnalysis(sampleInvoiceData), []);
  
  // New analytics
  const geoAnalytics = useMemo(() => getGeoAnalytics(sampleInvoiceData), []);
  const volumeAnalytics = useMemo(() => getVolumeAnalytics(sampleInvoiceData), []);
  const currencyVolatility = useMemo(() => getCurrencyVolatility(sampleInvoiceData), []);
  const collectionMethodAnalysis = useMemo(() => getCollectionMethodAnalysis(sampleInvoiceData), []);
  const uomAnalysis = useMemo(() => getUOMAnalysis(sampleInvoiceData), []);
  const lifecycleAnalysis = useMemo(() => getLifecycleAnalysis(sampleInvoiceData), []);
  const agentRecommendations = useMemo(() => getAgentRecommendations(sampleInvoiceData), []);
  const dynamicBenchmarks = useMemo(() => getDynamicBenchmarks(sampleInvoiceData), []);
  const alertRules = useMemo(() => generateAlertRules(sampleInvoiceData), []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Senior Management Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive invoice analytics and insights</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            title="Total Fees Paid"
            value={`$${kpis.totalFeesPaid.toLocaleString()}`}
            trend={kpis.monthlyGrowth}
            variant="success"
            icon={<DollarSign className="h-5 w-5" />}
          />
          <KPICard
            title="Average Rate"
            value={`$${kpis.averageRate.toFixed(2)}`}
            subtitle="Per transaction"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <KPICard
            title="Number of Invoices"
            value={kpis.numberOfInvoices.toLocaleString()}
            subtitle="Total processed"
            icon={<FileText className="h-5 w-5" />}
          />
          <KPICard
            title="Negative Rate Impact"
            value={`${negativeRateAnalysis.percentageOfNegativeRates.toFixed(1)}%`}
            subtitle="Of total charges"
            variant="warning"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="geo">Geography</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="currency">Currency</TabsTrigger>
            <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
            <TabsTrigger value="agent">AI Insights</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Total Fees Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TimeSeriesChart 
                    data={monthlyTrends.map(item => ({ month: item.name, totalCharge: item.value }))} 
                    height={250}
                  />
                </CardContent>
              </Card>

              {/* Currency Distribution */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-primary" />
                    Currency Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart data={currencyDistribution} height={250} />
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Service Codes */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Top Service Codes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    data={topServiceCodes.slice(0, 5)} 
                    height={250}
                    color="hsl(var(--chart-2))"
                  />
                </CardContent>
              </Card>

              {/* Top Event Descriptions */}
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Top Event Descriptions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    data={topEventDescriptions.slice(0, 5)} 
                    height={250}
                    color="hsl(var(--chart-3))"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Geography Tab */}
          <TabsContent value="geo" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KPICard
                title="Top Region"
                value={geoAnalytics.sort((a, b) => b.totalFees - a.totalFees)[0]?.region || 'N/A'}
                subtitle={`$${geoAnalytics.sort((a, b) => b.totalFees - a.totalFees)[0]?.totalFees.toLocaleString() || 0}`}
                icon={<Globe className="h-5 w-5" />}
              />
              <KPICard
                title="Highest Risk Region"
                value={geoAnalytics.sort((a, b) => b.riskScore - a.riskScore)[0]?.region || 'N/A'}
                subtitle={`${((geoAnalytics.sort((a, b) => b.riskScore - a.riskScore)[0]?.riskScore || 0) * 100).toFixed(1)}% risk score`}
                variant="warning"
                icon={<AlertTriangle className="h-5 w-5" />}
              />
              <KPICard
                title="Countries"
                value={new Set(geoAnalytics.map(g => g.country)).size}
                subtitle="Active regions"
                icon={<Activity className="h-5 w-5" />}
              />
            </div>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Regional Fee Heatmap & Risk Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GeoHeatmap 
                  data={geoAnalytics.map(item => ({
                    region: item.region,
                    country: item.country,
                    value: item.totalFees,
                    riskScore: item.riskScore
                  }))} 
                  height={400} 
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Volume Tab */}
          <TabsContent value="volume" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <KPICard
                title="Avg Files/Month"
                value={Math.round(volumeAnalytics.reduce((sum, v) => sum + v.fileCount, 0) / volumeAnalytics.length)}
                icon={<FileText className="h-5 w-5" />}
              />
              <KPICard
                title="Avg Invoices/Month"
                value={Math.round(volumeAnalytics.reduce((sum, v) => sum + v.invoiceCount, 0) / volumeAnalytics.length)}
                icon={<Activity className="h-5 w-5" />}
              />
              <KPICard
                title="Volume Anomalies"
                value={volumeAnalytics.filter(v => v.isAnomaly).length}
                variant="warning"
                icon={<AlertTriangle className="h-5 w-5" />}
              />
              <KPICard
                title="Peak Month"
                value={volumeAnalytics.sort((a, b) => b.invoiceCount - a.invoiceCount)[0]?.month || 'N/A'}
                subtitle={`${volumeAnalytics.sort((a, b) => b.invoiceCount - a.invoiceCount)[0]?.invoiceCount || 0} invoices`}
                icon={<TrendingUp className="h-5 w-5" />}
              />
            </div>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Invoice Volume Analysis & Anomaly Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VolumeAnomalyChart data={volumeAnalytics} height={400} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Currency Tab */}
          <TabsContent value="currency" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {currencyVolatility.slice(0, 4).map((currency) => (
                <KPICard
                  key={currency.currency}
                  title={currency.currency}
                  value={`$${currency.totalFees.toLocaleString()}`}
                  subtitle={currency.recommendedAction}
                  variant={currency.volatilityScore > 0.5 ? 'warning' : 'default'}
                />
              ))}
            </div>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Currency Volatility Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CurrencyVolatilityChart 
                  data={monthlyTrends.map(item => {
                    const monthData: any = { month: item.name };
                    currencyDistribution.forEach(curr => {
                      monthData[curr.name] = Math.random() * 50000; // Mock monthly data
                    });
                    return monthData;
                  })}
                  currencies={currencyDistribution.map(c => c.name)}
                  height={400}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle>Collection Method Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    data={collectionMethodAnalysis.map(item => ({ 
                      name: item.method, 
                      value: item.averageFee 
                    }))} 
                    height={300}
                    color="hsl(var(--chart-4))"
                  />
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle>UOM Impact Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    data={uomAnalysis.map(item => ({ 
                      name: item.uom, 
                      value: item.averageChargePerUnit 
                    }))} 
                    height={300}
                    color="hsl(var(--chart-5))"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Lifecycle Tab */}
          <TabsContent value="lifecycle" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <KPICard
                title="Conversion Rate"
                value={`${((lifecycleAnalysis.find(s => s.stage === 'Final Paid Fees')?.percentage || 0)).toFixed(1)}%`}
                subtitle="Total to final paid"
                variant="success"
                icon={<Target className="h-5 w-5" />}
              />
              <KPICard
                title="Reversal Rate"
                value={`${((lifecycleAnalysis.find(s => s.stage === 'Reversed Transactions')?.percentage || 0)).toFixed(1)}%`}
                subtitle="Of charged transactions"
                variant="destructive"
                icon={<AlertTriangle className="h-5 w-5" />}
              />
            </div>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Fee Lifecycle Funnel Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LifecycleFunnel data={lifecycleAnalysis} height={400} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="agent" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agentRecommendations.map((rec, index) => (
                <KPICard
                  key={rec.category}
                  title={rec.category}
                  value={`$${rec.potentialSavings.toLocaleString()}`}
                  subtitle="Potential savings"
                  variant={rec.priority === 'High' ? 'success' : 'default'}
                  icon={<Brain className="h-5 w-5" />}
                />
              ))}
            </div>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI-Powered Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agentRecommendations.map((rec, index) => (
                  <div
                    key={rec.category}
                    className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-primary">{rec.category}</h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.priority === 'High' ? 'bg-destructive text-destructive-foreground' :
                        rec.priority === 'Medium' ? 'bg-warning text-warning-foreground' :
                        'bg-secondary text-secondary-foreground'
                      }`}>
                        {rec.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rec.recommendation}</p>
                    <p className="text-sm font-semibold text-success">
                      Potential Savings: ${rec.potentialSavings.toLocaleString()}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Dynamic Benchmarks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">75th Percentile</h4>
                    <p className="text-2xl font-bold">${dynamicBenchmarks.percentile75.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">90th Percentile</h4>
                    <p className="text-2xl font-bold">${dynamicBenchmarks.percentile90.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">95th Percentile</h4>
                    <p className="text-2xl font-bold">${dynamicBenchmarks.percentile95.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="text-sm font-medium text-muted-foreground">YoY Growth</h4>
                    <p className="text-2xl font-bold text-success">{dynamicBenchmarks.yearOverYearGrowth.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <AlertDashboard alerts={alertRules} />
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle>Service Code Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart data={topServiceCodes} height={300} />
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle>Scheme Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart 
                    data={schemeAnalytics.map(item => ({ 
                      name: item.schemeId, 
                      value: item.totalFees 
                    }))} 
                    height={300} 
                  />
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Preventive Fee Insights - Top Penalty Services</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={negativeRateAnalysis.topNegativeServices} 
                  height={300}
                  color="hsl(var(--destructive))"
                />
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Strategic Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-r from-success/10 to-success/5 border border-success/20 rounded-lg">
                    <h4 className="font-semibold text-success mb-2">Optimize Collection Methods</h4>
                    <p className="text-sm text-muted-foreground">
                      Focus on AUTO collection for high-volume service codes to reduce manual processing fees.
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20 rounded-lg">
                    <h4 className="font-semibold text-warning mb-2">Reduce Penalty Fees</h4>
                    <p className="text-sm text-muted-foreground">
                      Target services with consistently negative rates for process optimization.
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">Currency Hedging</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider hedging strategies for high-volatility currencies to minimize exposure.
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 rounded-lg">
                    <h4 className="font-semibold text-accent mb-2">Volume Optimization</h4>
                    <p className="text-sm text-muted-foreground">
                      Implement proactive monitoring for volume anomalies to prevent processing delays.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};