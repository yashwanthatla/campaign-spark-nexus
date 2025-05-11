
import Navbar from '@/components/Navbar';
import CampaignForm from '@/components/CampaignForm';

export default function CampaignCreate() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Create Campaign</h1>
        <CampaignForm />
      </div>
    </div>
  );
}
