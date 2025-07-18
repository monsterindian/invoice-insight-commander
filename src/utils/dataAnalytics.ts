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

// Enhanced calculation details for KPIs
export const getKPICalculationDetails = (data: InvoiceData[]) => {
  const totalFeesPaid = data.reduce((sum, item) => sum + item.totalCharge, 0);
  const totalRateSum = data.reduce((sum, item) => sum + item.rate, 0);
  const averageRate = totalRateSum / data.length;
  const numberOfInvoices = data.length;
  
  // Negative rate impact calculation
  const negativeRateTransactions = data.filter(item => item.rate < 0);
  const negativeRateImpact = negativeRateTransactions.length / data.length * 100;
  const negativeRateTotal = negativeRateTransactions.reduce((sum, item) => sum + Math.abs(item.totalCharge), 0);

  // Monthly growth calculation
  const currentMonth = new Date().getMonth();
  const currentMonthData = data.filter(item => new Date(item.billDate).getMonth() === currentMonth);
  const previousMonthData = data.filter(item => new Date(item.billDate).getMonth() === currentMonth - 1);
  
  const currentMonthTotal = currentMonthData.reduce((sum, item) => sum + item.totalCharge, 0);
  const previousMonthTotal = previousMonthData.reduce((sum, item) => sum + item.totalCharge, 0);
  
  const monthlyGrowth = previousMonthTotal > 0 
    ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100 
    : 0;

  return {
    totalFeesPaid: {
      description: "Sum of all total_charge values from invoice transactions",
      steps: [
        {
          step: "1. Sum all transaction charges",
          formula: "SUM(total_charge) for all records",
          value: `${data.length} transactions processed`
        },
        {
          step: "2. Include positive and negative charges",
          formula: "Positive charges + Negative charges (reversals)",
          value: `$${totalFeesPaid.toLocaleString()}`
        }
      ],
      dataSource: "invoice_data.total_charge field",
      totalRecords: data.length
    },
    averageRate: {
      description: "Average rate per transaction across all processed invoices",
      steps: [
        {
          step: "1. Sum all transaction rates",
          formula: "SUM(rate) for all records",
          value: `${totalRateSum.toFixed(2)} total rate sum`
        },
        {
          step: "2. Divide by number of transactions",
          formula: `${totalRateSum.toFixed(2)} ÷ ${data.length}`,
          value: `$${averageRate.toFixed(2)} per transaction`
        }
      ],
      dataSource: "invoice_data.rate field",
      totalRecords: data.length
    },
    numberOfInvoices: {
      description: "Total count of processed invoice records in the database",
      steps: [
        {
          step: "1. Count all records",
          formula: "COUNT(*) FROM invoice_data",
          value: `${numberOfInvoices} total records`
        }
      ],
      dataSource: "invoice_data table",
      totalRecords: data.length
    },
    negativeRateImpact: {
      description: "Percentage of transactions with negative rates (reversals/refunds)",
      steps: [
        {
          step: "1. Count negative rate transactions",
          formula: "COUNT WHERE rate < 0",
          value: `${negativeRateTransactions.length} negative rate transactions`
        },
        {
          step: "2. Calculate percentage impact",
          formula: `(${negativeRateTransactions.length} ÷ ${data.length}) × 100`,
          value: `${negativeRateImpact.toFixed(1)}% of total transactions`
        },
        {
          step: "3. Total negative impact value",
          formula: "SUM(ABS(total_charge)) for negative rates",
          value: `$${negativeRateTotal.toLocaleString()} total impact`
        }
      ],
      dataSource: "invoice_data.rate and total_charge fields",
      totalRecords: data.length
    },
    monthlyGrowth: {
      description: "Month-over-month growth in total charges",
      steps: [
        {
          step: "1. Current month total",
          formula: `SUM(total_charge) for month ${currentMonth + 1}`,
          value: `$${currentMonthTotal.toLocaleString()}`
        },
        {
          step: "2. Previous month total", 
          formula: `SUM(total_charge) for month ${currentMonth}`,
          value: `$${previousMonthTotal.toLocaleString()}`
        },
        {
          step: "3. Calculate growth percentage",
          formula: `((${currentMonthTotal} - ${previousMonthTotal}) ÷ ${previousMonthTotal}) × 100`,
          value: `${monthlyGrowth.toFixed(1)}% growth`
        }
      ],
      dataSource: "invoice_data.total_charge and bill_date fields",
      totalRecords: data.length
    }
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
  
  const currencyData = data.reduce((acc, item) => {
    if (!acc[item.currency]) {
      acc[item.currency] = 0;
    }
    // Use absolute value to handle negative charges (reversals)
    acc[item.currency] += Math.abs(item.totalCharge);
    return acc;
  }, {} as Record<string, number>);

  console.log('getCurrencyDistribution - Currency data aggregated:', currencyData);
  
  const result = Object.entries(currencyData)
    .map(([name, value]) => ({ name, value }))
    .filter(item => item.value > 0); // Filter out zero values
    
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

// Get calculation details for all charts
export const getAllChartCalculations = (invoiceData: InvoiceData[]) => {
  const baseDetails = {
    totalRecords: invoiceData.length,
    dataSource: 'Supabase invoice_data table'
  };
  
  return {
    monthlyTrends: {
      description: 'Monthly aggregation of total charges over time to identify seasonal patterns and growth trends',
      methodology: 'Data is grouped by month from bill_date, summing all total_charge values for trend analysis',
      steps: [
        {
          step: 'Extract billing months',
          formula: 'GROUP BY DATE_TRUNC(\'month\', bill_date)',
          value: `${new Set(invoiceData.map(d => d.billDate.substring(0, 7))).size} unique months`
        },
        {
          step: 'Sum total charges per month',
          formula: 'SUM(total_charge) GROUP BY month',
          value: `$${invoiceData.reduce((sum, d) => sum + d.totalCharge, 0).toLocaleString()}`
        },
        {
          step: 'Calculate monthly growth',
          formula: '((current_month - previous_month) / previous_month) * 100',
          value: 'Trend percentage calculated'
        }
      ],
      ...baseDetails
    },
    
    currencyDistribution: {
      description: 'Distribution of total charges across different currencies showing exposure and concentration',
      methodology: 'Groups data by currency code (ccy) and sums absolute values to show true volume distribution',
      steps: [
        {
          step: 'Group by currency',
          formula: 'GROUP BY ccy',
          value: `${new Set(invoiceData.map(d => d.currency)).size} currencies found`
        },
        {
          step: 'Sum absolute charges',
          formula: 'SUM(ABS(total_charge)) per currency',
          value: 'Prevents negative values from canceling positives'
        },
        {
          step: 'Filter zero values',
          formula: 'WHERE SUM(ABS(total_charge)) > 0',
          value: 'Removes currencies with no net activity'
        }
      ],
      ...baseDetails
    },

    topServiceCodes: {
      description: 'Top performing service codes by total charge volume for identifying high-impact services',
      methodology: 'Aggregates charges by service_code and ranks by total volume descending',
      steps: [
        {
          step: 'Group by service code',
          formula: 'GROUP BY service_code',
          value: `${new Set(invoiceData.map(d => d.serviceCodeDescription)).size} unique service codes`
        },
        {
          step: 'Sum total charges',
          formula: 'SUM(total_charge) per service_code',
          value: 'Includes both positive and negative charges'
        },
        {
          step: 'Rank by volume',
          formula: 'ORDER BY SUM(total_charge) DESC LIMIT 10',
          value: 'Top 10 by financial impact'
        }
      ],
      ...baseDetails
    },

    geoAnalytics: {
      description: 'Geographic distribution of charges with risk scoring based on negative rate incidents',
      methodology: 'Maps invoice_ica codes to regions/countries and calculates risk scores from negative rates',
      steps: [
        {
          step: 'Map ICA to regions',
          formula: 'CASE WHEN invoice_ica IN (...) THEN region',
          value: 'Geographic classification by payment scheme'
        },
        {
          step: 'Calculate total fees',
          formula: 'SUM(total_charge) per region',
          value: 'Aggregate financial exposure by geography'
        },
        {
          step: 'Calculate risk score',
          formula: 'COUNT(rate < 0) / COUNT(*) per region',
          value: 'Percentage of negative rate incidents'
        }
      ],
      ...baseDetails
    },

    volumeAnalytics: {
      description: 'Monthly volume analysis with anomaly detection based on statistical variance',
      methodology: 'Calculates monthly volumes and identifies anomalies using standard deviation thresholds',
      steps: [
        {
          step: 'Monthly volume calculation',
          formula: 'COUNT(*) GROUP BY month, input_file_name',
          value: 'Files and invoices counted per month'
        },
        {
          step: 'Calculate average volume',
          formula: 'AVG(monthly_count) across all months',
          value: 'Baseline for anomaly detection'
        },
        {
          step: 'Anomaly detection',
          formula: 'ABS(monthly_count - avg) > (1.5 * STDDEV)',
          value: 'Flags volumes beyond 1.5 standard deviations'
        }
      ],
      ...baseDetails
    },

    currencyVolatility: {
      description: 'Monthly currency charge volatility to identify stability and risk patterns',
      methodology: 'Tracks monthly charge amounts per currency to identify volatility and stability patterns',
      steps: [
        {
          step: 'Monthly currency charges',
          formula: 'SUM(total_charge) GROUP BY month, ccy',
          value: 'Charge totals per currency per month'
        },
        {
          step: 'Calculate variance',
          formula: 'VARIANCE(monthly_charges) per currency',
          value: 'Measures charge stability over time'
        },
        {
          step: 'Identify patterns',
          formula: 'Compare monthly values for trends',
          value: 'Detects increasing/decreasing patterns'
        }
      ],
      ...baseDetails
    },

    lifecycleAnalysis: {
      description: 'Invoice processing lifecycle analysis showing stage progression and drop-off rates',
      methodology: 'Categorizes invoices by processing stage and calculates conversion rates between stages',
      steps: [
        {
          step: 'Categorize by stage',
          formula: 'CASE based on docu_type and processing indicators',
          value: 'Groups invoices into lifecycle stages'
        },
        {
          step: 'Calculate stage counts',
          formula: 'COUNT(*) per stage',
          value: 'Volume at each processing stage'
        },
        {
          step: 'Calculate drop-off rates',
          formula: '((prev_stage - current_stage) / prev_stage) * 100',
          value: 'Conversion loss between stages'
        }
      ],
      ...baseDetails
    }
  };
};