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
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East & Africa'];
  const countries = ['USA', 'UK', 'Germany', 'Japan', 'Canada', 'Australia', 'France', 'Singapore', 'Brazil', 'UAE'];
  const uomTypes = ['TRANSACTION', 'VOLUME', 'AMOUNT', 'COUNT', 'PERCENTAGE'];
  const fileNames = ['batch_001.csv', 'daily_summary.xlsx', 'monthly_report.json', 'annual_data.xml', 'quarterly_fees.csv'];

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
      collectionMethod: Math.random() > 0.3 ? 'AUTO' : 'MANUAL',
      inputFileName: fileNames[Math.floor(Math.random() * fileNames.length)],
      invNo: `INV-${billDate.getFullYear()}-${(i + 1).toString().padStart(6, '0')}`,
      uom: uomTypes[Math.floor(Math.random() * uomTypes.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      isReversal: Math.random() < 0.05, // 5% chance of reversal
      processingTime: Math.floor(Math.random() * 24) + 1, // 1-24 hours
      agentId: `AGENT-${Math.floor(Math.random() * 50) + 1}`
    });
  }

  return data.sort((a, b) => new Date(b.billDate).getTime() - new Date(a.billDate).getTime());
};

export const sampleInvoiceData = generateSampleData();