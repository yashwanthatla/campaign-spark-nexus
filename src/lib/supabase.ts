import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with environment variables
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type Customer = {
  id: string;
  name: string;
  email: string;
  total_spend: number;
  visits: number;
  last_active_at: string;
};

export type Order = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
};

export type Campaign = {
  id: string;
  created_by: string;
  name: string;
  rules_json: string;
  audience_count: number;
  created_at: string;
};

export type CommunicationLog = {
  id: string;
  campaign_id: string;
  customer_id: string;
  status: 'SENT' | 'FAILED';
  message: string;
  sent_at: string;
};

export type Rule = {
  id: string;
  field: string;
  operator: string;
  value: string | number;
};

export type RuleGroup = {
  rules: Rule[];
  operator: 'AND' | 'OR';
};