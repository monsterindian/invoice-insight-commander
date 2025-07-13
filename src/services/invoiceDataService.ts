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
    // Add default values for optional fields that might not be in the database
    region: 'Unknown',
    country: 'Unknown',
    isReversal: row.total_charge < 0,
    processingTime: Math.random() * 24, // Mock data for now
    agentId: `AGENT-${Math.floor(Math.random() * 50) + 1}` // Mock data for now
  };
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