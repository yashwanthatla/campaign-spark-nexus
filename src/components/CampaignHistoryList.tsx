
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import CampaignCard from './CampaignCard';
import { getCampaigns } from '@/lib/api';
import { Campaign } from '@/lib/supabase';

export default function CampaignHistoryList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const data = await getCampaigns();
      setCampaigns(data);
      setLoading(false);
    };
    
    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center">
        <p>Loading campaigns...</p>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-gray-500">No campaigns found</p>
          <a href="/campaigns/create" className="text-crm-purple hover:underline mt-2">
            Create your first campaign
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {campaigns.map(campaign => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
