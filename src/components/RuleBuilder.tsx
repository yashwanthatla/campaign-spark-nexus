
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Rule, RuleGroup } from '@/lib/supabase';
import { Plus, X } from 'lucide-react';

const FIELD_OPTIONS = [
  { label: 'Total Spend', value: 'total_spend' },
  { label: 'Visits', value: 'visits' },
  { label: 'Last Active', value: 'last_active_at' }
];

const OPERATOR_OPTIONS = [
  { label: 'Greater than', value: '>' },
  { label: 'Less than', value: '<' },
  { label: 'Equal to', value: '=' },
  { label: 'Not equal to', value: '!=' },
  { label: 'Greater than or equal', value: '>=' },
  { label: 'Less than or equal', value: '<=' }
];

type RuleBuilderProps = {
  onChange: (ruleGroup: RuleGroup) => void;
  initialRules?: RuleGroup;
};

export default function RuleBuilder({ onChange, initialRules }: RuleBuilderProps) {
  const [ruleGroup, setRuleGroup] = useState<RuleGroup>(initialRules || {
    rules: [{ id: '1', field: 'total_spend', operator: '>', value: '' }],
    operator: 'AND'
  });

  useEffect(() => {
    onChange(ruleGroup);
  }, [ruleGroup, onChange]);

  const addRule = () => {
    setRuleGroup({
      ...ruleGroup,
      rules: [...ruleGroup.rules, { 
        id: `${Date.now()}`, 
        field: 'total_spend',
        operator: '>',
        value: '' 
      }]
    });
  };

  const removeRule = (id: string) => {
    if (ruleGroup.rules.length <= 1) return;
    
    setRuleGroup({
      ...ruleGroup,
      rules: ruleGroup.rules.filter(rule => rule.id !== id)
    });
  };

  const updateRule = (id: string, field: keyof Rule, value: string) => {
    setRuleGroup({
      ...ruleGroup,
      rules: ruleGroup.rules.map(rule => 
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    });
  };

  const toggleOperator = () => {
    setRuleGroup({
      ...ruleGroup,
      operator: ruleGroup.operator === 'AND' ? 'OR' : 'AND'
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {ruleGroup.rules.map((rule, index) => (
            <div key={rule.id} className="flex items-center space-x-2">
              <Select
                value={rule.field}
                onValueChange={(value) => updateRule(rule.id, 'field', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Field" />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={rule.operator}
                onValueChange={(value) => updateRule(rule.id, 'operator', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Operator" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATOR_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input 
                type={rule.field === 'last_active_at' ? 'date' : 'number'}
                placeholder="Value"
                className="w-[180px]"
                value={String(rule.value)}
                onChange={(e) => updateRule(rule.id, 'value', e.target.value)}
              />
              
              {ruleGroup.rules.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRule(rule.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              
              {index === ruleGroup.rules.length - 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addRule}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          
          {ruleGroup.rules.length > 1 && (
            <Button
              variant="outline"
              onClick={toggleOperator}
              className="mt-2"
            >
              {ruleGroup.operator === 'AND' ? 'Match ALL conditions' : 'Match ANY condition'} (currently {ruleGroup.operator})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
