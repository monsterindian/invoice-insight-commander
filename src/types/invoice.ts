export interface InvoiceData {
  id: string;
  totalCosts: number;
  currency: string;
  billDate: string;
  serviceCodeDescription: string;
  eventDesc: string;
  qtyAmt: number;
  rate: number;
  charge: number;
  taxCharge: number;
  totalCharge: number;
  invoiceICA: string;
  collectionMethod: 'AUTO' | 'MANUAL';
  inputFileName: string;
  invNo: string;
  uom: string;
  region?: string;
  country?: string;
  isReversal?: boolean;
  processingTime?: number;
  agentId?: string;
}

export interface KPIData {
  totalFeesPaid: number;
  averageRate: number;
  numberOfInvoices: number;
  monthlyGrowth: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
  category?: string;
  growth?: number;
  region?: string;
  country?: string;
}

export interface ServiceAnalytics {
  serviceCode: string;
  totalCharge: number;
  transactionCount: number;
  averageRate: number;
  negativeRateCount: number;
}

export interface SchemeAnalytics {
  schemeId: string;
  totalFees: number;
  transactionCount: number;
  growthRate: number;
  marketShare: number;
}

export interface GeoAnalytics {
  region: string;
  country: string;
  totalFees: number;
  transactionCount: number;
  riskScore: number;
  negativeRateFrequency: number;
}

export interface CurrencyVolatility {
  currency: string;
  totalFees: number;
  volatilityScore: number;
  monthlyVariance: number;
  recommendedAction: string;
}

export interface VolumeAnalytics {
  month: string;
  fileCount: number;
  invoiceCount: number;
  isAnomaly: boolean;
  anomalyScore: number;
}

export interface LifecycleStage {
  stage: string;
  count: number;
  percentage: number;
  dropOffRate: number;
}

export interface AlertRule {
  id: string;
  title: string;
  condition: string;
  threshold: number;
  isTriggered: boolean;
  severity: 'low' | 'medium' | 'high';
  value?: number;
}