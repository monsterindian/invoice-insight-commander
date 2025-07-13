import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPICard } from '@/components/KPICard';
import { TimeSeriesChart } from '@/components/charts/TimeSeriesChart';
import { BarChart } from '@/components/charts/BarChart';
import { PieChart } from '@/components/charts/PieChart';
import { sampleInvoiceData } from '@/data/sampleInvoiceData';
import { 
  calculateKPIs, 
  getMonthlyTrends, 
  getTopServiceCodes, 
  getTopEventDescriptions,
  getCurrencyDistribution,
  getSchemeAnalytics,
  getNegativeRateAnalysis
} from '@/utils/dataAnalytics';
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  AlertTriangle,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';

export const Dashboard = () => {
  const kpis = useMemo(() => calculateKPIs(sampleInvoiceData), []);
  const monthlyTrends = useMemo(() => getMonthlyTrends(sampleInvoiceData), []);
  const topServiceCodes = useMemo(() => getTopServiceCodes(sampleInvoiceData), []);
  const topEventDescriptions = useMemo(() => getTopEventDescriptions(sampleInvoiceData), []);
  const currencyDistribution = useMemo(() => getCurrencyDistribution(sampleInvoiceData), []);
  const schemeAnalytics = useMemo(() => getSchemeAnalytics(sampleInvoiceData), []);
  const negativeRateAnalysis = useMemo(() => getNegativeRateAnalysis(sampleInvoiceData), []);

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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="schemes">Schemes</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
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

          <TabsContent value="trends" className="space-y-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>Historical Pattern Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <TimeSeriesChart 
                  data={monthlyTrends.map(item => ({ month: item.name, totalCharge: item.value }))} 
                  height={400}
                />
              </CardContent>
            </Card>

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
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {topServiceCodes.slice(0, 3).map((service, index) => (
                <KPICard
                  key={service.name}
                  title={service.name}
                  value={`$${service.value.toLocaleString()}`}
                  variant={index === 0 ? 'success' : 'default'}
                />
              ))}
            </div>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader>
                <CardTitle>All Service Codes Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart data={topServiceCodes} height={400} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schemes" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {schemeAnalytics.slice(0, 4).map((scheme) => (
                <KPICard
                  key={scheme.schemeId}
                  title={scheme.schemeId}
                  value={`$${scheme.totalFees.toLocaleString()}`}
                  subtitle={`${scheme.marketShare.toFixed(1)}% market share`}
                  trend={scheme.growthRate}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle>Scheme Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <BarChart 
                    data={schemeAnalytics.map(item => ({ 
                      name: item.schemeId, 
                      value: item.totalFees 
                    }))} 
                    height={300}
                  />
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle>Market Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <PieChart 
                    data={schemeAnalytics.map(item => ({ 
                      name: item.schemeId, 
                      value: item.marketShare 
                    }))} 
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <KPICard
                title="Negative Rate Charges"
                value={`$${negativeRateAnalysis.totalNegativeCharges.toLocaleString()}`}
                subtitle="Total penalty fees"
                variant="destructive"
                icon={<AlertTriangle className="h-5 w-5" />}
              />
              <KPICard
                title="Fee Impact"
                value={`${negativeRateAnalysis.percentageOfNegativeRates.toFixed(1)}%`}
                subtitle="Of total charges"
                variant="warning"
                icon={<TrendingUp className="h-5 w-5" />}
              />
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
                <CardTitle>Recommendations</CardTitle>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};