
-- Drop all existing permissive policies
DROP POLICY IF EXISTS "Public access" ON public.companies;
DROP POLICY IF EXISTS "Public access" ON public.destinations;
DROP POLICY IF EXISTS "Public access" ON public.contracts;
DROP POLICY IF EXISTS "Public access" ON public.pricing_standard;
DROP POLICY IF EXISTS "Public access" ON public.pricing_special;
DROP POLICY IF EXISTS "Public access" ON public.contract_baggage;
DROP POLICY IF EXISTS "Public access" ON public.contract_booking;
DROP POLICY IF EXISTS "Public access" ON public.contract_age;
DROP POLICY IF EXISTS "Public access" ON public.contract_addons;
DROP POLICY IF EXISTS "Public access" ON public.contract_insurance;
DROP POLICY IF EXISTS "Public access" ON public.contract_government_charges;
DROP POLICY IF EXISTS "Public access" ON public.contract_fuel;
DROP POLICY IF EXISTS "Public access" ON public.contract_payment_plan;
DROP POLICY IF EXISTS "Public access" ON public.contract_service_commitment;
DROP POLICY IF EXISTS "Public access" ON public.contract_termination;
DROP POLICY IF EXISTS "Public access" ON public.contract_notes;

-- Create authenticated-only policies for all tables
CREATE POLICY "Authenticated access" ON public.companies FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.destinations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.contracts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.pricing_standard FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.pricing_special FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.contract_baggage FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.contract_booking FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.contract_age FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.contract_addons FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.contract_insurance FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.contract_government_charges FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.contract_fuel FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.contract_payment_plan FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.contract_service_commitment FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.contract_termination FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated access" ON public.contract_notes FOR ALL TO authenticated USING (true) WITH CHECK (true);
