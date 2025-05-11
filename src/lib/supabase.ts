
import { createClient } from '@supabase/supabase-js';

// Your Supabase configuration will be provided once integrated
// For now, we'll create a mock client for development
const createSupabaseClient = () => {
  if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
    return createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
  }
  
  // Mock client for development before Supabase integration
  return {
    auth: {
      signInWithOAuth: () => Promise.resolve({ error: null }),
      signOut: () => Promise.resolve({ error: null }),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: [], error: null }),
      update: () => ({ data: [], error: null }),
    }),
  } as any;
};

export const supabase = createSupabaseClient();

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
