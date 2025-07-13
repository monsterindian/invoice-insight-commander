import { supabase } from '@/integrations/supabase/client';
import { InvoiceData } from '@/types/invoice';
import type { Tables } from '@/integrations/supabase/types';

// Transform Supabase row to our InvoiceData interface
const transformInvoiceData = (row: Tables<'invoice_data'>): InvoiceData => {
  return {
    id: row.event_id,
    totalCosts: Number(row.total_costs),
    currency: row.ccy,
    billDate: row.bill_date,
    serviceCodeDescription: row.service_code_description,
    eventDesc: row.event_desc,
    qtyAmt: Number(row.qty_amt),
    rate: Number(row.rate),
    charge: Number(row.charge),
    taxCharge: Number(row.tax_charge),
    totalCharge: Number(row.total_charge),
    invoiceICA: row.invoice_ica,
    collectionMethod: row.collection_method as 'AUTO' | 'MANUAL',
    inputFileName: row.input_file_name,
    invNo: row.inv_no,
    uom: row.uom,
    // Geographic data - derive from ICA codes or other available data
    region: deriveRegionFromICA(row.invoice_ica),
    country: deriveCountryFromICA(row.invoice_ica),
    isReversal: row.total_charge < 0,
    processingTime: Math.abs(row.total_charge) / 1000, // Derive from transaction size
    agentId: `AGENT-${row.service_code.slice(-2)}` // Derive from service code
  };
};

// Helper functions to derive geographic data from available fields
const deriveRegionFromICA = (ica: string): string => {
  const icaRegionMap: Record<string, string> = {
    'VISA': 'North America',
    'MAST': 'North America', 
    'AMEX': 'North America',
    'DISC': 'North America',
    'DINE': 'North America',
    'JCB': 'Asia Pacific',
    'UNIO': 'Europe',
    'MAES': 'Europe'
  };
  return icaRegionMap[ica] || 'Global';
};

const deriveCountryFromICA = (ica: string): string => {
  const icaCountryMap: Record<string, string> = {
    'VISA': 'USA',
    'MAST': 'USA',
    'AMEX': 'USA', 
    'DISC': 'USA',
    'DINE': 'USA',
    'JCB': 'Japan',
    'UNIO': 'Germany',
    'MAES': 'Belgium'
  };
  return icaCountryMap[ica] || 'International';
};

export const fetchInvoiceData = async (): Promise<InvoiceData[]> => {
  try {
    const { data, error } = await supabase
      .from('invoice_data')
      .select('*')
      .order('bill_date', { ascending: false });

    if (error) {
      console.error('Error fetching invoice data:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('No invoice data found in database');
      return [];
    }

    return data.map(transformInvoiceData);
  } catch (error) {
    console.error('Failed to fetch invoice data:', error);
    throw error;
  }
};

export const getInvoiceDataStats = async () => {
  try {
    const { count, error } = await supabase
      .from('invoice_data')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching stats:', error);
      return { totalCount: 0 };
    }

    return { totalCount: count || 0 };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return { totalCount: 0 };
  }
};