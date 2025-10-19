/*
  # Revenue Optimization & Drug Safety System

  ## New Tables
  
  1. `prescriptions`
    - `id` (uuid, primary key)
    - `patient_name` (text)
    - `medications` (jsonb) - Array of medication objects
    - `tests` (jsonb) - Array of test objects
    - `symptoms` (text array)
    - `diagnosis` (text)
    - `total_amount` (decimal)
    - `claim_success_rate` (integer) - Predicted approval %
    - `revenue_optimized` (boolean)
    - `drug_interactions_checked` (boolean)
    - `interaction_alerts` (jsonb)
    - `created_at` (timestamptz)
    
  2. `revenue_analytics`
    - `id` (uuid, primary key)
    - `date` (date)
    - `total_prescriptions` (integer)
    - `optimized_prescriptions` (integer)
    - `revenue_recovered` (decimal)
    - `claim_rejections_prevented` (integer)
    - `created_at` (timestamptz)
    
  3. `drug_interactions`
    - `id` (uuid, primary key)
    - `drug_a` (text)
    - `drug_b` (text)
    - `severity` (text) - critical/major/moderate/minor
    - `description` (text)
    - `recommendation` (text)
    
  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated access
*/

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  medications jsonb DEFAULT '[]'::jsonb,
  tests jsonb DEFAULT '[]'::jsonb,
  symptoms text[] DEFAULT ARRAY[]::text[],
  diagnosis text,
  total_amount decimal(10,2) DEFAULT 0,
  claim_success_rate integer DEFAULT 0,
  revenue_optimized boolean DEFAULT false,
  drug_interactions_checked boolean DEFAULT false,
  interaction_alerts jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on prescriptions for authenticated users"
  ON prescriptions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create revenue_analytics table
CREATE TABLE IF NOT EXISTS revenue_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL DEFAULT CURRENT_DATE,
  total_prescriptions integer DEFAULT 0,
  optimized_prescriptions integer DEFAULT 0,
  revenue_recovered decimal(10,2) DEFAULT 0,
  claim_rejections_prevented integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE revenue_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on revenue_analytics for authenticated users"
  ON revenue_analytics
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create drug_interactions table with pre-populated data
CREATE TABLE IF NOT EXISTS drug_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  drug_a text NOT NULL,
  drug_b text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('critical', 'major', 'moderate', 'minor')),
  description text NOT NULL,
  recommendation text NOT NULL
);

ALTER TABLE drug_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to drug_interactions for authenticated users"
  ON drug_interactions
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert common drug interactions
INSERT INTO drug_interactions (drug_a, drug_b, severity, description, recommendation) VALUES
  ('Aspirin', 'Warfarin', 'critical', 'Increased risk of bleeding and hemorrhage', 'Avoid combination. Consider alternative anticoagulant or gastroprotection'),
  ('Azithromycin', 'Amiodarone', 'critical', 'Risk of QT prolongation and cardiac arrhythmia', 'Contraindicated. Use alternative antibiotic'),
  ('Metformin', 'Iodinated Contrast', 'major', 'Risk of lactic acidosis and acute kidney injury', 'Hold metformin 48hrs before and after contrast'),
  ('Paracetamol', 'Warfarin', 'moderate', 'May enhance anticoagulant effect with prolonged use', 'Monitor INR closely if used >1 week'),
  ('Ibuprofen', 'Aspirin', 'moderate', 'Reduced cardioprotective effect of aspirin', 'Take ibuprofen at least 8 hours after aspirin'),
  ('Ciprofloxacin', 'Tizanidine', 'critical', 'Severe hypotension and increased sedation', 'Contraindicated. Use alternative antibiotic'),
  ('Amoxicillin', 'Methotrexate', 'major', 'Increased methotrexate toxicity', 'Monitor for bone marrow suppression'),
  ('Cough Suppressant', 'MAO Inhibitors', 'major', 'Serotonin syndrome risk with dextromethorphan', 'Avoid within 14 days of MAO inhibitor use')
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_prescriptions_created_at ON prescriptions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_date ON revenue_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_drug_interactions_lookup ON drug_interactions(drug_a, drug_b);
