
import { supabase, Customer, Campaign, Rule, RuleGroup } from './supabase';
import { toast } from '@/components/ui/use-toast';

// Mock data for development before Supabase integration
const mockCustomers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', total_spend: 5000, visits: 10, last_active_at: '2023-05-01T10:30:00Z' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', total_spend: 12000, visits: 5, last_active_at: '2023-05-10T14:20:00Z' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', total_spend: 1000, visits: 2, last_active_at: '2023-04-15T09:45:00Z' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', total_spend: 8500, visits: 8, last_active_at: '2023-05-12T16:10:00Z' },
  { id: '5', name: 'Sam Wilson', email: 'sam@example.com', total_spend: 25000, visits: 15, last_active_at: '2023-05-14T11:05:00Z' },
];

const mockCampaigns: Campaign[] = [
  {
    id: '1',
    created_by: 'user1',
    name: 'High Spenders',
    rules_json: JSON.stringify({
      rules: [{ id: '1', field: 'total_spend', operator: '>', value: 10000 }],
      operator: 'AND'
    }),
    audience_count: 2,
    created_at: '2023-05-10T14:20:00Z',
  },
  {
    id: '2',
    created_by: 'user1',
    name: 'New Visitors',
    rules_json: JSON.stringify({
      rules: [{ id: '2', field: 'visits', operator: '<', value: 3 }],
      operator: 'AND'
    }),
    audience_count: 1,
    created_at: '2023-05-12T10:15:00Z',
  },
];

// API functions
export async function getCustomers(): Promise<Customer[]> {
  try {
    // This will be replaced with actual Supabase query after integration
    // const { data, error } = await supabase.from('customers').select('*');
    // if (error) throw error;
    // return data;
    return mockCustomers;
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
    // This will be replaced with actual Supabase query after integration
    // const { data, error } = await supabase.from('campaigns').select('*');
    // if (error) throw error;
    // return data;
    return mockCampaigns;
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
    // This will be replaced with actual Supabase query after integration
    // const { data, error } = await supabase.from('campaigns').insert(campaign).select();
    // if (error) throw error;
    // return data[0];
    
    const newCampaign = {
      ...campaign,
      id: `${mockCampaigns.length + 1}`,
      created_at: new Date().toISOString(),
    };
    mockCampaigns.push(newCampaign);
    return newCampaign;
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
    // This will be replaced with actual audience calculation after Supabase integration
    // For now, estimate based on our mock data
    if (!ruleGroup.rules.length) return 0;
    
    return mockCustomers.filter(customer => {
      const evaluatedRules = ruleGroup.rules.map(rule => {
        const { field, operator, value } = rule;
        
        // Type assertion for TypeScript
        const customerValue = customer[field as keyof Customer];
        
        switch (operator) {
          case '>':
            return Number(customerValue) > Number(value);
          case '<':
            return Number(customerValue) < Number(value);
          case '>=':
            return Number(customerValue) >= Number(value);
          case '<=':
            return Number(customerValue) <= Number(value);
          case '=':
            return customerValue == value;
          case '!=':
            return customerValue != value;
          default:
            return false;
        }
      });
      
      if (ruleGroup.operator === 'AND') {
        return evaluatedRules.every(result => result);
      } else {
        return evaluatedRules.some(result => result);
      }
    }).length;
  } catch (error) {
    console.error('Error estimating audience:', error);
    return 0;
  }
}

export async function simulateDelivery(campaignId: string, message: string): Promise<{sent: number, failed: number, total: number}> {
  // Find the campaign
  const campaign = mockCampaigns.find(c => c.id === campaignId);
  if (!campaign) return { sent: 0, failed: 0, total: 0 };
  
  // Get matching customers
  const ruleGroup = JSON.parse(campaign.rules_json) as RuleGroup;
  const matchingCustomers = mockCustomers.filter(customer => {
    const evaluatedRules = ruleGroup.rules.map(rule => {
      const { field, operator, value } = rule;
      const customerValue = customer[field as keyof Customer];
      
      switch (operator) {
        case '>':
          return Number(customerValue) > Number(value);
        case '<':
          return Number(customerValue) < Number(value);
        case '>=':
          return Number(customerValue) >= Number(value);
        case '<=':
          return Number(customerValue) <= Number(value);
        case '=':
          return customerValue == value;
        case '!=':
          return customerValue != value;
        default:
          return false;
      }
    });
    
    if (ruleGroup.operator === 'AND') {
      return evaluatedRules.every(result => result);
    } else {
      return evaluatedRules.some(result => result);
    }
  });
  
  // Simulate 90% success, 10% failure
  let sent = 0;
  let failed = 0;
  
  matchingCustomers.forEach(() => {
    if (Math.random() < 0.9) {
      sent++;
    } else {
      failed++;
    }
  });
  
  // In a real app, we'd insert records into communication_logs
  // await supabase.from('communication_logs').insert(communicationLogs);
  
  return {
    sent,
    failed,
    total: matchingCustomers.length
  };
}

export async function generateAIMessages(campaignIntent: string): Promise<string[]> {
  // This would be an actual OpenAI API call in production
  // For development, return mock messages
  return [
    `Hey there! We noticed you've been shopping with us and we'd love to offer you a special 15% discount on your next purchase. Use code THANKS15 at checkout. ${campaignIntent}`,
    `We value your loyalty! As one of our valued customers, we're excited to share an exclusive offer with you: 15% off your next order with code THANKS15. ${campaignIntent}`
  ];
}
