import { InvoiceData, KPIData, ChartDataPoint, ServiceAnalytics, SchemeAnalytics } from '../types/invoice';

export const calculateKPIs = (data: InvoiceData[]): KPIData => {
  const totalFeesPaid = data.reduce((sum, item) => sum + item.totalCharge, 0);
  const averageRate = data.reduce((sum, item) => sum + item.rate, 0) / data.length;
  const numberOfInvoices = data.length;
  
  // Calculate month-over-month growth
  const currentMonth = new Date().getMonth();
  const currentMonthData = data.filter(item => new Date(item.billDate).getMonth() === currentMonth);
  const previousMonthData = data.filter(item => new Date(item.billDate).getMonth() === currentMonth - 1);
  
  const currentMonthTotal = currentMonthData.reduce((sum, item) => sum + item.totalCharge, 0);
  const previousMonthTotal = previousMonthData.reduce((sum, item) => sum + item.totalCharge, 0);
  
  const monthlyGrowth = previousMonthTotal > 0 
    ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 
    : 0;

  return {
    totalFeesPaid,
    averageRate,
    numberOfInvoices,
    monthlyGrowth
  };
};

export const getMonthlyTrends = (data: InvoiceData[]): ChartDataPoint[] => {
  const monthlyData = data.reduce((acc, item) => {
    const month = new Date(item.billDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += item.totalCharge;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(monthlyData)
    .map(([month, totalCharge]) => ({ name: month, value: totalCharge }))
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
};

export const getTopServiceCodes = (data: InvoiceData[], limit: number = 10): ChartDataPoint[] => {
  const serviceData = data.reduce((acc, item) => {
    if (!acc[item.serviceCodeDescription]) {
      acc[item.serviceCodeDescription] = 0;
    }
    acc[item.serviceCodeDescription] += item.totalCharge;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(serviceData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};

export const getTopEventDescriptions = (data: InvoiceData[], limit: number = 10): ChartDataPoint[] => {
  const eventData = data.reduce((acc, item) => {
    if (!acc[item.eventDesc]) {
      acc[item.eventDesc] = 0;
    }
    acc[item.eventDesc] += item.totalCharge;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(eventData)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
};

export const getCurrencyDistribution = (data: InvoiceData[]): ChartDataPoint[] => {
  const currencyData = data.reduce((acc, item) => {
    if (!acc[item.currency]) {
      acc[item.currency] = 0;
    }
    acc[item.currency] += item.totalCharge;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(currencyData)
    .map(([name, value]) => ({ name, value }));
};

export const getSchemeAnalytics = (data: InvoiceData[]): SchemeAnalytics[] => {
  const schemeData = data.reduce((acc, item) => {
    // Extract scheme from first 3 characters of service code
    const scheme = item.serviceCodeDescription.substring(0, 3).toUpperCase();
    if (!acc[scheme]) {
      acc[scheme] = {
        totalFees: 0,
        transactionCount: 0,
        charges: []
      };
    }
    acc[scheme].totalFees += item.totalCharge;
    acc[scheme].transactionCount += item.qtyAmt;
    acc[scheme].charges.push(item.totalCharge);
    return acc;
  }, {} as Record<string, { totalFees: number; transactionCount: number; charges: number[] }>);

  return Object.entries(schemeData).map(([schemeId, data]) => ({
    schemeId,
    totalFees: data.totalFees,
    transactionCount: data.transactionCount,
    growthRate: Math.random() * 20 - 10, // Mock growth rate
    marketShare: (data.totalFees / Object.values(schemeData).reduce((sum, s) => sum + s.totalFees, 0)) * 100
  }));
};

export const getNegativeRateAnalysis = (data: InvoiceData[]) => {
  const negativeRateData = data.filter(item => item.rate < 0);
  const totalNegativeCharges = negativeRateData.reduce((sum, item) => sum + Math.abs(item.totalCharge), 0);
  const totalCharges = data.reduce((sum, item) => sum + Math.abs(item.totalCharge), 0);
  
  const percentageOfNegativeRates = (totalNegativeCharges / totalCharges) * 100;
  
  const serviceAnalysis = negativeRateData.reduce((acc, item) => {
    if (!acc[item.serviceCodeDescription]) {
      acc[item.serviceCodeDescription] = 0;
    }
    acc[item.serviceCodeDescription] += Math.abs(item.totalCharge);
    return acc;
  }, {} as Record<string, number>);

  return {
    percentageOfNegativeRates,
    totalNegativeCharges,
    topNegativeServices: Object.entries(serviceAnalysis)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
  };
};