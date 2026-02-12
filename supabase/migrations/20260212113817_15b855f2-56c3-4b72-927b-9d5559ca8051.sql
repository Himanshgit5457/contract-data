
-- Core Tables
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text,
  type text NOT NULL CHECK (type IN ('Group', 'Resort')),
  registration_no text,
  coordinates text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE,
  coordinates text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id text UNIQUE NOT NULL,
  contract_code text NOT NULL,
  carrier_id text DEFAULT 'TMA101',
  group_id uuid REFERENCES public.companies(id),
  resort_id uuid REFERENCES public.companies(id),
  sub_contract_id text UNIQUE,
  sub_contract_type text CHECK (sub_contract_type IN ('Transfer', 'Charter', 'Signed Charter')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  agreement_type text DEFAULT 'Exclusive Seaplane (Day time)',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Pricing Tables
CREATE TABLE public.pricing_standard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_contract_id text REFERENCES public.contracts(sub_contract_id),
  weekdays text[] NOT NULL,
  point_a_id uuid REFERENCES public.destinations(id),
  point_b_id uuid REFERENCES public.destinations(id),
  transfer_type text,
  pax_condition text,
  passenger_type text CHECK (passenger_type IN ('Adult', 'Child')),
  return_fare_usd numeric(10,2),
  one_way_fare_usd numeric(10,2),
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.pricing_special (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_contract_id text REFERENCES public.contracts(sub_contract_id),
  request_type text CHECK (request_type IN ('Management', 'Staff', 'Service providers', 'FAM trips', 'Tour Operators', 'Tour Guides', 'Journalists', 'Advertisers', 'Others')),
  discount_type text CHECK (discount_type IN ('Absolute', 'Percentage')),
  return_fare_usd numeric(10,2),
  one_way_fare_usd numeric(10,2),
  pax_condition text,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);

-- Parameter Tables
CREATE TABLE public.contract_baggage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_contract_id text REFERENCES public.contracts(sub_contract_id),
  parameter text NOT NULL,
  value text NOT NULL,
  remark text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.contract_booking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_contract_id text REFERENCES public.contracts(sub_contract_id),
  parameter text NOT NULL,
  value text NOT NULL,
  remark text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.contract_age (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_contract_id text REFERENCES public.contracts(sub_contract_id),
  type text NOT NULL CHECK (type IN ('Infant', 'Child', 'Adult')),
  min_age integer NOT NULL,
  max_age integer,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.contract_addons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_contract_id text REFERENCES public.contracts(sub_contract_id),
  sub_category text NOT NULL,
  type text NOT NULL,
  value numeric(10,2) NOT NULL,
  remark text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.contract_insurance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_contract_id text REFERENCES public.contracts(sub_contract_id),
  parameter text NOT NULL,
  value text NOT NULL CHECK (value IN ('Yes', 'No')),
  remark text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.contract_government_charges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_contract_id text REFERENCES public.contracts(sub_contract_id),
  parameter text NOT NULL,
  value numeric(10,2) NOT NULL,
  remark text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.contract_fuel (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_contract_id text REFERENCES public.contracts(sub_contract_id),
  type text NOT NULL,
  value numeric(10,2) NOT NULL,
  remark text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.contract_payment_plan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_contract_id text REFERENCES public.contracts(sub_contract_id),
  parameter text NOT NULL,
  value text NOT NULL,
  remark text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.contract_service_commitment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_contract_id text REFERENCES public.contracts(sub_contract_id),
  parameter text NOT NULL,
  value text NOT NULL,
  remark text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.contract_termination (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_contract_id text REFERENCES public.contracts(sub_contract_id),
  parameter text NOT NULL,
  value text NOT NULL,
  remark text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.contract_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES public.contracts(id) ON DELETE CASCADE,
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables (permissive for public access)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_standard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_special ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_baggage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_booking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_age ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_government_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_fuel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_payment_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_service_commitment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_termination ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_notes ENABLE ROW LEVEL SECURITY;

-- Public access policies for all tables
CREATE POLICY "Public access" ON public.companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.destinations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.contracts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.pricing_standard FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.pricing_special FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.contract_baggage FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.contract_booking FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.contract_age FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.contract_addons FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.contract_insurance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.contract_government_charges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.contract_fuel FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.contract_payment_plan FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.contract_service_commitment FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.contract_termination FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access" ON public.contract_notes FOR ALL USING (true) WITH CHECK (true);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contract_notes_updated_at BEFORE UPDATE ON public.contract_notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed destinations
INSERT INTO public.destinations (name, code, coordinates) VALUES
  ('Velana International Airport', 'MLE', '4.1918, 73.5290'),
  ('Hanimaadhoo Airport', 'HAQ', '6.7442, 73.1705'),
  ('Kadhdhoo Airport', 'KDO', '1.8592, 73.5219'),
  ('Gan International Airport', 'GAN', '-0.6933, 73.1556'),
  ('Dhaalu Airport', 'DDD', '2.6681, 72.8878'),
  ('Ifuru Airport', 'IFU', '5.7083, 73.0250'),
  ('Maafaru Airport', 'NMF', '5.8183, 73.4700'),
  ('Soneva Fushi', 'SVF', '5.1100, 73.0700'),
  ('One&Only Reethi Rah', 'ORR', '4.3900, 73.3600'),
  ('Waldorf Astoria Ithaafushi', 'WAI', '4.1500, 73.4200'),
  ('St. Regis Vommuli', 'SRV', '2.8200, 73.3900'),
  ('Patina Maldives', 'PTM', '3.9100, 73.4800'),
  ('COMO Cocoa Island', 'CCI', '3.9600, 73.3700'),
  ('Cheval Blanc Randheli', 'CBR', '5.7200, 73.0100'),
  ('Four Seasons Landaa Giraavaru', 'FSL', '5.2900, 73.0700');

-- Seed companies
INSERT INTO public.companies (name, type, address, registration_no, coordinates) VALUES
  ('Marriott International', 'Group', 'Bethesda, Maryland, USA', 'MI-2024-001', '38.9807, -77.0962'),
  ('Hilton Hotels Corporation', 'Group', 'McLean, Virginia, USA', 'HH-2024-002', '38.9339, -77.1773'),
  ('Minor International', 'Group', 'Bangkok, Thailand', 'MN-2024-003', '13.7563, 100.5018'),
  ('Soneva Group', 'Group', 'Bangkok, Thailand', 'SG-2024-004', '13.7563, 100.5018'),
  ('Waldorf Astoria Maldives', 'Resort', 'Ithaafushi Island, Maldives', 'WA-2024-R01', '4.1500, 73.4200'),
  ('St. Regis Maldives Vommuli', 'Resort', 'Dhaalu Atoll, Maldives', 'SR-2024-R02', '2.8200, 73.3900'),
  ('Soneva Fushi', 'Resort', 'Baa Atoll, Maldives', 'SF-2024-R03', '5.1100, 73.0700'),
  ('Four Seasons Landaa Giraavaru', 'Resort', 'Baa Atoll, Maldives', 'FS-2024-R04', '5.2900, 73.0700'),
  ('Patina Maldives Fari Islands', 'Resort', 'North Malé Atoll, Maldives', 'PM-2024-R05', '3.9100, 73.4800'),
  ('Cheval Blanc Randheli', 'Resort', 'Noonu Atoll, Maldives', 'CB-2024-R06', '5.7200, 73.0100');
