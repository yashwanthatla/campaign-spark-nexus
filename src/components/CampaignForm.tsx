
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import RuleBuilder from './RuleBuilder';
import MessageGenerator from './MessageGenerator';
import { RuleGroup } from '@/lib/supabase';
import { createCampaign, estimateAudience, simulateDelivery } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

export default function CampaignForm() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [ruleGroup, setRuleGroup] = useState<RuleGroup>({
    rules: [{ id: '1', field: 'total_spend', operator: '>', value: 0 }],
    operator: 'AND'
  });
  const [audienceCount, setAudienceCount] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateAudienceEstimate = async () => {
      if (ruleGroup.rules.some(rule => String(rule.value) === '')) return;
      
      const count = await estimateAudience(ruleGroup);
      setAudienceCount(count);
    };
    
    updateAudienceEstimate();
  }, [ruleGroup]);

  const handleRuleChange = (newRuleGroup: RuleGroup) => {
    setRuleGroup(newRuleGroup);
  };

  const handleMessageSelect = (selectedMessage: string) => {
    setMessage(selectedMessage);
  };

  const handleSubmit = async () => {
    if (!name || !message || ruleGroup.rules.some(rule => String(rule.value) === '')) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Create campaign
      const campaign = await createCampaign({
        name,
        rules_json: JSON.stringify(ruleGroup),
        audience_count: audienceCount,
        created_by: 'current-user', // This would be the actual user ID in production
      });
      
      if (campaign) {
        // Simulate delivery
        const result = await simulateDelivery(campaign.id, message);
        
        toast({
          title: "Campaign created",
          description: `Successfully sent to ${result.sent} out of ${result.total} recipients`,
        });
        
        // Navigate to history page
        navigate('/campaigns/history');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Campaign</CardTitle>
        <CardDescription>
          Define your audience and create a targeted campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Campaign Name</Label>
          <Input 
            id="name" 
            placeholder="Enter campaign name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Audience Criteria</Label>
          <RuleBuilder onChange={handleRuleChange} />
          <div className="mt-4 text-sm">
            <span className="font-medium">Estimated audience:</span>{' '}
            <span className="bg-crm-purple-light px-2 py-1 rounded-md font-medium">
              {audienceCount} {audienceCount === 1 ? 'customer' : 'customers'}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Message</Label>
          <MessageGenerator onSelect={handleMessageSelect} />
          
          {message && (
            <div className="mt-2 p-3 border rounded-md bg-gray-50">
              <p className="text-sm text-gray-800">{message}</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button 
          className="bg-crm-purple hover:bg-crm-purple-dark"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Campaign'}
        </Button>
      </CardFooter>
    </Card>
  );
}
