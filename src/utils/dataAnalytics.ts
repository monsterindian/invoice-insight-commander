import { InvoiceData, KPIData, ChartDataPoint, ServiceAnalytics, SchemeAnalytics, GeoAnalytics, CurrencyVolatility, VolumeAnalytics, LifecycleStage, AlertRule } from '../types/invoice';

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
  console.log('getCurrencyDistribution - Input data length:', data.length);
  console.log('getCurrencyDistribution - Sample data:', data.slice(0, 3));
  
  const currencyData = data.reduce((acc, item) => {
    console.log('Processing item currency:', item.currency, 'totalCharge:', item.totalCharge);
    if (!acc[item.currency]) {
      acc[item.currency] = 0;
    }
    acc[item.currency] += item.totalCharge;
    return acc;
  }, {} as Record<string, number>);

  console.log('getCurrencyDistribution - Currency data:', currencyData);
  
  const result = Object.entries(currencyData)
    .map(([name, value]) => ({ name, value }));
    
  console.log('getCurrencyDistribution - Final result:', result);
  return result;
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

// Geo-Based Analytics
export const getGeoAnalytics = (data: InvoiceData[]): GeoAnalytics[] => {
  const geoData = data.reduce((acc, item) => {
    if (!item.region || !item.country) return acc;
    
    const key = `${item.region}-${item.country}`;
    if (!acc[key]) {
      acc[key] = {
        region: item.region,
        country: item.country,
        totalFees: 0,
        transactionCount: 0,
        negativeRateCount: 0,
        totalTransactions: 0
      };
    }
    
    acc[key].totalFees += item.totalCharge;
    acc[key].transactionCount += item.qtyAmt;
    acc[key].totalTransactions++;
    if (item.rate < 0) acc[key].negativeRateCount++;
    
    return acc;
  }, {} as Record<string, any>);

  return Object.values(geoData).map((geo: any) => ({
    region: geo.region,
    country: geo.country,
    totalFees: geo.totalFees,
    transactionCount: geo.transactionCount,
    riskScore: geo.negativeRateCount / geo.totalTransactions,
    negativeRateFrequency: geo.negativeRateCount
  }));
};

// Volume Analysis
export const getVolumeAnalytics = (data: InvoiceData[]): VolumeAnalytics[] => {
  const monthlyVolume = data.reduce((acc, item) => {
    const month = new Date(item.billDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = {
        fileNames: new Set(),
        invoiceNumbers: new Set(),
        count: 0
      };
    }
    
    acc[month].fileNames.add(item.inputFileName);
    acc[month].invoiceNumbers.add(item.invNo);
    acc[month].count++;
    
    return acc;
  }, {} as Record<string, any>);

  const volumes = Object.entries(monthlyVolume).map(([month, data]) => ({
    month,
    fileCount: data.fileNames.size,
    invoiceCount: data.invoiceNumbers.size,
    isAnomaly: false,
    anomalyScore: 0
  }));

  // Calculate anomaly scores
  const avgFileCount = volumes.reduce((sum, v) => sum + v.fileCount, 0) / volumes.length;
  const avgInvoiceCount = volumes.reduce((sum, v) => sum + v.invoiceCount, 0) / volumes.length;

  return volumes.map(volume => {
    const fileDeviation = Math.abs(volume.fileCount - avgFileCount) / avgFileCount;
    const invoiceDeviation = Math.abs(volume.invoiceCount - avgInvoiceCount) / avgInvoiceCount;
    const anomalyScore = (fileDeviation + invoiceDeviation) / 2;
    
    return {
      ...volume,
      isAnomaly: anomalyScore > 0.3,
      anomalyScore
    };
  });
};

// Currency Volatility Analysis
export const getCurrencyVolatility = (data: InvoiceData[]): CurrencyVolatility[] => {
  const currencyMonthly = data.reduce((acc, item) => {
    const month = new Date(item.billDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (!acc[item.currency]) {
      acc[item.currency] = {};
    }
    if (!acc[item.currency][month]) {
      acc[item.currency][month] = 0;
    }
    acc[item.currency][month] += item.totalCharge;
    return acc;
  }, {} as Record<string, Record<string, number>>);

  return Object.entries(currencyMonthly).map(([currency, monthlyData]) => {
    const values = Object.values(monthlyData);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const volatilityScore = Math.sqrt(variance) / mean;
    
    let recommendedAction = 'Monitor';
    if (volatilityScore > 0.5) recommendedAction = 'Consider hedging strategies';
    if (volatilityScore > 0.8) recommendedAction = 'High risk - review exposure';

    return {
      currency,
      totalFees: values.reduce((sum, val) => sum + val, 0),
      volatilityScore,
      monthlyVariance: variance,
      recommendedAction
    };
  });
};

// Collection Method Analysis
export const getCollectionMethodAnalysis = (data: InvoiceData[]) => {
  const methodData = data.reduce((acc, item) => {
    if (!acc[item.collectionMethod]) {
      acc[item.collectionMethod] = {
        totalFees: 0,
        transactionCount: 0,
        processingTimes: []
      };
    }
    
    acc[item.collectionMethod].totalFees += item.totalCharge;
    acc[item.collectionMethod].transactionCount++;
    if (item.processingTime) {
      acc[item.collectionMethod].processingTimes.push(item.processingTime);
    }
    
    return acc;
  }, {} as Record<string, any>);

  return Object.entries(methodData).map(([method, data]) => ({
    method,
    totalFees: data.totalFees,
    transactionCount: data.transactionCount,
    averageFee: data.totalFees / data.transactionCount,
    averageProcessingTime: data.processingTimes.length > 0 
      ? data.processingTimes.reduce((sum: number, time: number) => sum + time, 0) / data.processingTimes.length 
      : 0
  }));
};

// UOM Impact Analysis
export const getUOMAnalysis = (data: InvoiceData[]) => {
  const uomData = data.reduce((acc, item) => {
    if (!acc[item.uom]) {
      acc[item.uom] = {
        totalCharge: 0,
        totalQty: 0,
        transactionCount: 0
      };
    }
    
    acc[item.uom].totalCharge += item.totalCharge;
    acc[item.uom].totalQty += item.qtyAmt;
    acc[item.uom].transactionCount++;
    
    return acc;
  }, {} as Record<string, any>);

  return Object.entries(uomData).map(([uom, data]) => ({
    uom,
    totalCharge: data.totalCharge,
    averageChargePerUnit: data.totalCharge / data.totalQty,
    transactionCount: data.transactionCount,
    marketShare: (data.totalCharge / Object.values(uomData).reduce((sum: number, d: any) => sum + d.totalCharge, 0)) * 100
  }));
};

// Lifecycle Analysis
export const getLifecycleAnalysis = (data: InvoiceData[]): LifecycleStage[] => {
  const totalTransactions = data.length;
  const chargedTransactions = data.filter(item => item.totalCharge > 0).length;
  const reversalTransactions = data.filter(item => item.isReversal).length;
  const finalPaidTransactions = chargedTransactions - reversalTransactions;

  const stages = [
    {
      stage: 'Total Transactions',
      count: totalTransactions,
      percentage: 100,
      dropOffRate: 0
    },
    {
      stage: 'Charged Transactions',
      count: chargedTransactions,
      percentage: (chargedTransactions / totalTransactions) * 100,
      dropOffRate: ((totalTransactions - chargedTransactions) / totalTransactions) * 100
    },
    {
      stage: 'Reversed Transactions',
      count: reversalTransactions,
      percentage: (reversalTransactions / totalTransactions) * 100,
      dropOffRate: (reversalTransactions / chargedTransactions) * 100
    },
    {
      stage: 'Final Paid Fees',
      count: finalPaidTransactions,
      percentage: (finalPaidTransactions / totalTransactions) * 100,
      dropOffRate: (reversalTransactions / chargedTransactions) * 100
    }
  ];

  return stages;
};

// Agent Behavior Analytics
export const getAgentRecommendations = (data: InvoiceData[]) => {
  const serviceAnalysis = getTopServiceCodes(data, 10);
  const negativeRateAnalysis = getNegativeRateAnalysis(data);
  const collectionAnalysis = getCollectionMethodAnalysis(data);

  const recommendations = [
    {
      category: 'Service Optimization',
      recommendation: `Review ${serviceAnalysis[0]?.name} - highest fee contributor ($${serviceAnalysis[0]?.value.toLocaleString()})`,
      priority: 'High',
      potentialSavings: serviceAnalysis[0]?.value * 0.1 || 0
    },
    {
      category: 'Collection Method',
      recommendation: collectionAnalysis.find(c => c.method === 'AUTO')?.averageFee < collectionAnalysis.find(c => c.method === 'MANUAL')?.averageFee
        ? 'Increase AUTO collection usage to reduce processing costs'
        : 'Review MANUAL collection efficiency',
      priority: 'Medium',
      potentialSavings: Math.abs((collectionAnalysis.find(c => c.method === 'AUTO')?.averageFee || 0) - (collectionAnalysis.find(c => c.method === 'MANUAL')?.averageFee || 0)) * 100
    },
    {
      category: 'Risk Mitigation',
      recommendation: `Focus on ${negativeRateAnalysis.topNegativeServices[0]?.name} to reduce penalty fees`,
      priority: 'High',
      potentialSavings: negativeRateAnalysis.totalNegativeCharges * 0.5
    }
  ];

  return recommendations;
};

// Dynamic Benchmarks
export const getDynamicBenchmarks = (data: InvoiceData[]) => {
  const serviceCharges = data.map(item => item.totalCharge).sort((a, b) => a - b);
  const percentile75 = serviceCharges[Math.floor(serviceCharges.length * 0.75)];
  const percentile90 = serviceCharges[Math.floor(serviceCharges.length * 0.90)];
  const percentile95 = serviceCharges[Math.floor(serviceCharges.length * 0.95)];

  const monthlyTotals = getMonthlyTrends(data);
  const currentYear = new Date().getFullYear();
  const lastYearSameMonth = monthlyTotals.find(month => 
    month.name.includes((currentYear - 1).toString())
  );

  return {
    percentile75,
    percentile90,
    percentile95,
    yearOverYearGrowth: lastYearSameMonth ? 
      ((monthlyTotals[monthlyTotals.length - 1]?.value || 0) - lastYearSameMonth.value) / lastYearSameMonth.value * 100 : 0,
    exceedingBenchmark: data.filter(item => item.totalCharge > percentile75).length
  };
};

// Alert Rules
export const generateAlertRules = (data: InvoiceData[]): AlertRule[] => {
  const benchmarks = getDynamicBenchmarks(data);
  const currentMonthTotal = getMonthlyTrends(data)[getMonthlyTrends(data).length - 1]?.value || 0;
  const negativeRateAnalysis = getNegativeRateAnalysis(data);
  
  return [
    {
      id: 'monthly-threshold',
      title: 'Monthly Fees Exceed Threshold',
      condition: 'Monthly total > 120% of 75th percentile',
      threshold: benchmarks.percentile75 * 1.2,
      isTriggered: currentMonthTotal > benchmarks.percentile75 * 1.2,
      severity: 'high',
      value: currentMonthTotal
    },
    {
      id: 'negative-rate-spike',
      title: 'High Penalty Fee Percentage',
      condition: 'Negative rate fees > 15% of total',
      threshold: 15,
      isTriggered: negativeRateAnalysis.percentageOfNegativeRates > 15,
      severity: 'medium',
      value: negativeRateAnalysis.percentageOfNegativeRates
    },
    {
      id: 'volume-anomaly',
      title: 'Transaction Volume Anomaly',
      condition: 'Volume spike > 200% of average',
      threshold: data.length * 2,
      isTriggered: false, // Would need more sophisticated detection
      severity: 'low'
    },
    {
      id: 'currency-volatility',
      title: 'High Currency Volatility',
      condition: 'Currency volatility > 0.8',
      threshold: 0.8,
      isTriggered: getCurrencyVolatility(data).some(c => c.volatilityScore > 0.8),
      severity: 'medium'
    }
  ];
};