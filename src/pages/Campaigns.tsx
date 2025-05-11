
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export default function Campaigns() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Campaigns</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/campaigns/create">
            <div className="border rounded-lg p-6 hover:border-crm-purple transition-colors">
              <h2 className="text-xl font-semibold mb-2">Create Campaign</h2>
              <p className="text-gray-600 mb-4">
                Build a new campaign with targeted audience segmentation.
              </p>
              <Button className="bg-crm-purple hover:bg-crm-purple-dark">
                Get Started
              </Button>
            </div>
          </Link>
          
          <Link to="/campaigns/history">
            <div className="border rounded-lg p-6 hover:border-crm-purple transition-colors">
              <h2 className="text-xl font-semibold mb-2">Campaign History</h2>
              <p className="text-gray-600 mb-4">
                View and manage your existing campaigns.
              </p>
              <Button variant="outline">
                View History
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
