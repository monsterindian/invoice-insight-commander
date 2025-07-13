-- Create invoice_data table
CREATE TABLE public.invoice_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_costs DECIMAL(15,2) NOT NULL DEFAULT 0,
  input_file_name TEXT NOT NULL,
  input_file_date DATE NOT NULL,
  docu_type TEXT NOT NULL DEFAULT 'Invoice',
  inv_no TEXT NOT NULL,
  ccy TEXT NOT NULL DEFAULT 'USD',
  bill_date DATE NOT NULL,
  invoice_ica TEXT NOT NULL,
  collection_method TEXT NOT NULL CHECK (collection_method IN ('AUTO', 'MANUAL')),
  service_code TEXT NOT NULL,
  service_code_description TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_desc TEXT NOT NULL,
  uom TEXT NOT NULL,
  qty_amt DECIMAL(15,2) NOT NULL DEFAULT 0,
  rate DECIMAL(15,4) NOT NULL DEFAULT 0,
  charge DECIMAL(15,2) NOT NULL DEFAULT 0,
  tax_charge DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_charge DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.invoice_data ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own invoice data" 
ON public.invoice_data 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own invoice data" 
ON public.invoice_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoice data" 
ON public.invoice_data 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoice data" 
ON public.invoice_data 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_invoice_data_updated_at
BEFORE UPDATE ON public.invoice_data
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_invoice_data_user_id ON public.invoice_data(user_id);
CREATE INDEX idx_invoice_data_bill_date ON public.invoice_data(bill_date);
CREATE INDEX idx_invoice_data_inv_no ON public.invoice_data(inv_no);
CREATE INDEX idx_invoice_data_service_code ON public.invoice_data(service_code);