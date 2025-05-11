
import Navbar from '@/components/Navbar';
import CampaignHistoryList from '@/components/CampaignHistoryList';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export default function CampaignHistory() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Campaign History</h1>
          <Link to="/campaigns/create">
            <Button className="bg-crm-purple hover:bg-crm-purple-dark">
              Create Campaign
            </Button>
          </Link>
        </div>
        
        <CampaignHistoryList />
      </div>
    </div>
  );
}
