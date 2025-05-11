/*
  # Initial Schema Setup

  1. New Tables
    - customers
      - id (uuid, primary key)
      - name (text)
      - email (text, unique)
      - total_spend (numeric)
      - visits (integer)
      - last_active_at (timestamptz)
    
    - campaigns
      - id (uuid, primary key)
      - created_by (uuid, references auth.users)
      - name (text)
      - rules_json (jsonb)
      - audience_count (integer)
      - created_at (timestamptz)
    
    - communication_logs
      - id (uuid, primary key)
      - campaign_id (uuid, references campaigns)
      - customer_id (uuid, references customers)
      - status (text)
      - message (text)
      - sent_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  total_spend numeric DEFAULT 0,
  visits integer DEFAULT 0,
  last_active_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  rules_json jsonb NOT NULL,
  audience_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create communication_logs table
CREATE TABLE IF NOT EXISTS communication_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns NOT NULL,
  customer_id uuid REFERENCES customers,
  status text NOT NULL,
  message text NOT NULL,
  sent_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all customers"
  ON customers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their campaigns"
  ON campaigns
  FOR ALL
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Users can view their communication logs"
  ON communication_logs
  FOR ALL
  TO authenticated
  USING (
    campaign_id IN (
      SELECT id FROM campaigns WHERE created_by = auth.uid()
    )
  );

-- Create function for estimating audience
CREATE OR REPLACE FUNCTION estimate_audience(query_string text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result integer;
BEGIN
  EXECUTE query_string INTO result;
  RETURN result;
END;
$$;