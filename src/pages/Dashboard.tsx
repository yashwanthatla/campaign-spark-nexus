
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCustomers, getCampaigns } from '@/lib/api';
import { Customer, Campaign } from '@/lib/supabase';

export default function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [customersData, campaignsData] = await Promise.all([
        getCustomers(),
        getCampaigns()
      ]);
      
      setCustomers(customersData);
      setCampaigns(campaignsData);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  // Calculate summary stats
  const totalCustomers = customers.length;
  const totalSpend = customers.reduce((sum, customer) => sum + customer.total_spend, 0);
  const totalCampaigns = campaigns.length;
  const avgSpendPerCustomer = totalCustomers > 0 ? totalSpend / totalCustomers : 0;

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <div className="h-[300px] flex items-center justify-center">
            <p>Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link to="/campaigns/create">
            <Button className="bg-crm-purple hover:bg-crm-purple-dark">
              Create Campaign
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalCustomers}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${totalSpend.toLocaleString()}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Avg. Customer Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">${avgSpendPerCustomer.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-500">Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalCampaigns}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Name</th>
                      <th className="pb-2">Email</th>
                      <th className="pb-2 text-right">Total Spend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.slice(0, 5).map(customer => (
                      <tr key={customer.id} className="border-b last:border-0">
                        <td className="py-3">{customer.name}</td>
                        <td className="py-3">{customer.email}</td>
                        <td className="py-3 text-right">${customer.total_spend.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/customers" className="text-crm-purple-dark hover:underline text-sm">
                View all customers
              </Link>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="pb-2">Campaign</th>
                      <th className="pb-2">Created</th>
                      <th className="pb-2 text-right">Audience</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.slice(0, 5).map(campaign => (
                      <tr key={campaign.id} className="border-b last:border-0">
                        <td className="py-3">{campaign.name}</td>
                        <td className="py-3">{new Date(campaign.created_at).toLocaleDateString()}</td>
                        <td className="py-3 text-right">{campaign.audience_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/campaigns/history" className="text-crm-purple-dark hover:underline text-sm">
                View all campaigns
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
