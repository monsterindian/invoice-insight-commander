import { InvoiceData } from '../types/invoice';

// Generate sample invoice data for demonstration
export const generateSampleData = (): InvoiceData[] => {
  const serviceDescriptions = [
    'Card Payment Processing',
    'International Transfer',
    'ACH Processing',
    'Wire Transfer',
    'Foreign Exchange',
    'Merchant Services',
    'ATM Transaction',
    'Overdraft Fee',
    'Account Maintenance',
    'Regulatory Compliance'
  ];

  const eventDescriptions = [
    'Transaction Processing',
    'Currency Conversion',
    'Risk Assessment',
    'Compliance Check',
    'Settlement',
    'Authorization',
    'Clearing',
    'Reconciliation',
    'Reporting',
    'Investigation'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD'];
  const icaCodes = ['VISA', 'MAST', 'AMEX', 'DISC', 'DINE'];

  const data: InvoiceData[] = [];

  // Generate 500 sample records
  for (let i = 0; i < 500; i++) {
    const billDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const qtyAmt = Math.floor(Math.random() * 1000) + 1;
    let rate = (Math.random() * 5) + 0.1; // Some negative rates for penalties
    if (Math.random() < 0.15) rate = -rate; // 15% chance of negative rate
    
    const charge = qtyAmt * rate;
    const taxCharge = charge * 0.08; // 8% tax
    const totalCharge = charge + taxCharge;

    data.push({
      id: `INV-${(i + 1).toString().padStart(5, '0')}`,
      totalCosts: totalCharge,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      billDate: billDate.toISOString().split('T')[0],
      serviceCodeDescription: serviceDescriptions[Math.floor(Math.random() * serviceDescriptions.length)],
      eventDesc: eventDescriptions[Math.floor(Math.random() * eventDescriptions.length)],
      qtyAmt,
      rate,
      charge,
      taxCharge,
      totalCharge,
      invoiceICA: icaCodes[Math.floor(Math.random() * icaCodes.length)],
      collectionMethod: Math.random() > 0.3 ? 'AUTO' : 'MANUAL'
    });
  }

  return data.sort((a, b) => new Date(b.billDate).getTime() - new Date(a.billDate).getTime());
};

export const sampleInvoiceData = generateSampleData();