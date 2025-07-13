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