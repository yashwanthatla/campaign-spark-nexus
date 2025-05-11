import { supabase, Customer, Campaign, Rule, RuleGroup } from './supabase';
import { toast } from '@/components/ui/use-toast';

export async function getCustomers(): Promise<Customer[]> {
  try {
    const { data, error } = await supabase.from('customers').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching customers:', error);
    toast({
      variant: "destructive",
      title: "Error fetching customers",
      description: "There was a problem with your request."
    });
    return [];
  }
}

export async function getCampaigns(): Promise<Campaign[]> {
  try {
    const { data, error } = await supabase.from('campaigns').select('*');
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    toast({
      variant: "destructive",
      title: "Error fetching campaigns",
      description: "There was a problem with your request."
    });
    return [];
  }
}

export async function createCampaign(campaign: Omit<Campaign, 'id' | 'created_at'>): Promise<Campaign | null> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([{ ...campaign, created_at: new Date().toISOString() }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    toast({
      variant: "destructive",
      title: "Error creating campaign",
      description: "There was a problem with your request."
    });
    return null;
  }
}

export async function estimateAudience(ruleGroup: RuleGroup): Promise<number> {
  try {
    // Convert the rule group to a PostgreSQL query
    const { rules, operator } = ruleGroup;
    const conditions = rules.map(rule => {
      const { field, operator: op, value } = rule;
      return `${field} ${op} ${typeof value === 'string' ? `'${value}'` : value}`;
    }).join(` ${operator} `);

    const query = `
      SELECT COUNT(*) 
      FROM customers 
      WHERE ${conditions}
    `;

    const { count, error } = await supabase.rpc('estimate_audience', { query_string: query });
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error estimating audience:', error);
    return 0;
  }
}

export async function simulateDelivery(campaignId: string, message: string): Promise<{sent: number, failed: number, total: number}> {
  try {
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();
    
    if (campaignError) throw campaignError;

    // Insert communication logs
    const { data: logs, error: logsError } = await supabase
      .from('communication_logs')
      .insert([
        {
          campaign_id: campaignId,
          message,
          status: 'SENT',
          sent_at: new Date().toISOString()
        }
      ])
      .select();

    if (logsError) throw logsError;

    // Get statistics
    const { data: stats, error: statsError } = await supabase
      .from('communication_logs')
      .select('status', { count: 'exact' })
      .eq('campaign_id', campaignId)
      .group_by('status');

    if (statsError) throw statsError;

    const sent = stats?.find(s => s.status === 'SENT')?.count || 0;
    const failed = stats?.find(s => s.status === 'FAILED')?.count || 0;
    
    return {
      sent,
      failed,
      total: sent + failed
    };
  } catch (error) {
    console.error('Error simulating delivery:', error);
    return { sent: 0, failed: 0, total: 0 };
  }
}

// Modified to provide default messages when Edge Function fails
export async function generateAIMessages(campaignIntent: string): Promise<string[]> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-messages', {
      body: { intent: campaignIntent }
    });
    
    if (error) throw error;
    return data.messages;
  } catch (error) {
    console.error('Error generating messages:', error);
    // Return a more comprehensive set of fallback messages
    return [
      `We noticed you've been shopping with us and we'd love to offer you a special discount on your next purchase.`,
      `As a valued customer, we're excited to share an exclusive offer with you.`,
      `Thank you for being a loyal customer! We have a special offer just for you.`,
      `We appreciate your business and want to reward you with an exclusive deal.`,
      `Don't miss out on this special offer we've prepared just for you!`
    ];
  }
}