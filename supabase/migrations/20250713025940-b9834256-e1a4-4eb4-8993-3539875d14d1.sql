-- Create RLS policies to allow reading invoice data
-- Since this is an analytics dashboard, we'll allow public read access

CREATE POLICY "Enable read access for all users" ON public.invoice_data
FOR SELECT USING (true);

-- If you want to make it completely public (no RLS), alternatively you could disable RLS:
-- ALTER TABLE public.invoice_data DISABLE ROW LEVEL SECURITY;