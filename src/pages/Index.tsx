
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="text-center max-w-3xl">
          <div className="h-16 w-16 rounded-md bg-crm-purple flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6">X</div>
          <h1 className="text-4xl font-bold mb-6">Xeno Mini CRM</h1>
          <p className="text-xl text-gray-600 mb-8">
            Create targeted campaigns, segment your customers, and drive engagement with our powerful CRM platform.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/dashboard">
              <Button className="bg-crm-purple hover:bg-crm-purple-dark">
                Get Started
              </Button>
            </Link>
            <Link to="/campaigns/create">
              <Button variant="outline">
                Create Campaign
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Customer Segmentation</h2>
            <p className="text-gray-600">
              Create targeted segments using our flexible rule builder to reach the right audience.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">Campaign Management</h2>
            <p className="text-gray-600">
              Create, send and track campaigns with detailed analytics and performance metrics.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-3">AI-Powered Messages</h2>
            <p className="text-gray-600">
              Generate personalized campaign messages with our AI assistant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
