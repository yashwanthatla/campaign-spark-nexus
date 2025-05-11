
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Campaign, RuleGroup } from '@/lib/supabase';
import { format } from 'date-fns';

type CampaignCardProps = {
  campaign: Campaign;
};

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const [ruleText, setRuleText] = useState('');
  
  // Generate a random success/failure count for demo purposes
  // In a real app, this would come from the communication_logs table
  const audienceCount = campaign.audience_count;
  const sent = Math.floor(audienceCount * 0.9);
  const failed = audienceCount - sent;

  useEffect(() => {
    // Parse the rules and create a human-readable string
    try {
      const ruleGroup: RuleGroup = JSON.parse(campaign.rules_json);
      
      if (ruleGroup.rules.length === 0) {
        setRuleText('No rules defined');
        return;
      }
      
      const ruleStrings = ruleGroup.rules.map(rule => {
        const fieldMap: {[key: string]: string} = {
          'total_spend': 'Total Spend',
          'visits': 'Visits',
          'last_active_at': 'Last Active Date'
        };
        
        const operatorMap: {[key: string]: string} = {
          '>': 'greater than',
          '<': 'less than',
          '=': 'equals',
          '!=': 'not equals',
          '>=': 'greater than or equal to',
          '<=': 'less than or equal to'
        };
        
        const field = fieldMap[rule.field] || rule.field;
        const operator = operatorMap[rule.operator] || rule.operator;
        
        return `${field} ${operator} ${rule.value}`;
      });
      
      setRuleText(ruleStrings.join(` ${ruleGroup.operator} `));
    } catch (error) {
      console.error('Error parsing rules:', error);
      setRuleText('Invalid rules');
    }
  }, [campaign.rules_json]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{campaign.name}</CardTitle>
          <Badge variant="outline" className="bg-crm-purple-light text-crm-purple-dark">
            {audienceCount} recipients
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-gray-500 text-sm truncate max-w-full">
                {ruleText}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-[300px] text-sm">{ruleText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            Created: {format(new Date(campaign.created_at), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-green-600">{sent} sent</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-red-500">{failed} failed</span>
        </div>
      </CardFooter>
    </Card>
  );
}
