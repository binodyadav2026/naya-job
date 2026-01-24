import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Home, User, Briefcase, FileText, MessageSquare, CreditCard } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import api from '../../utils/api';

const navigation = [
  { name: 'Dashboard', path: '/recruiter', icon: Home },
  { name: 'Profile', path: '/recruiter/profile', icon: User },
  { name: 'Post Job', path: '/recruiter/post-job', icon: Briefcase },
  { name: 'My Jobs', path: '/recruiter/my-jobs', icon: FileText },
  { name: 'Messages', path: '/recruiter/messages', icon: MessageSquare },
  { name: 'Subscription', path: '/recruiter/subscription', icon: CreditCard },
];

export default function PurchaseCredits() {
  const { user } = useOutletContext();
  const [credits, setCredits] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [processing, setProcessing] = useState(false);

  const packages = [
    { credits: 1, price: 10, popular: false },
    { credits: 5, price: 45, popular: true },
    { credits: 10, price: 80, popular: false },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/profile/recruiter/${user.user_id}`);
      setCredits(response.data.credits);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handlePurchase = async (pkg) => {
    setProcessing(true);
    setSelectedPackage(pkg);

    try {
      const response = await api.post('/payments/create-intent', null, {
        params: { credits: pkg.credits },
      });

      // In a real app, you would integrate Stripe Elements here
      // For demo purposes, we'll simulate a successful payment
      toast.success('Payment processing... (Demo mode)');

      // Simulate payment confirmation
      setTimeout(async () => {
        try {
          // In production, this would be called after actual Stripe payment
          await api.post('/payments/confirm', null, {
            params: { payment_intent_id: 'demo_' + Date.now() },
          });
          toast.success(`${pkg.credits} credits added to your account!`);
          fetchProfile();
        } catch (error) {
          toast.info('Note: In demo mode, credits are not actually added. Stripe integration required.');
        } finally {
          setProcessing(false);
          setSelectedPackage(null);
        }
      }, 2000);
    } catch (error) {
      toast.error('Payment failed');
      setProcessing(false);
      setSelectedPackage(null);
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="purchase-credits">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Purchase Credits</h1>
        <p className="text-slate-600 mb-8">Each credit allows you to post one job listing</p>

        <div className="bg-white p-6 rounded-lg border-2 border-[#4F46E5] mb-8">
          <p className="text-sm text-slate-600 mb-1">Current Balance</p>
          <p className="text-4xl font-bold text-[#4F46E5]">{credits} Credits</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.credits}
              className={`bg-white p-8 rounded-lg border-2 ${
                pkg.popular ? 'border-[#4F46E5]' : 'border-slate-200'
              } relative`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-[#4F46E5] text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                  Popular
                </div>
              )}
              <div className="text-center mb-6">
                <p className="text-4xl font-bold text-[#0F172A] mb-2">{pkg.credits}</p>
                <p className="text-slate-600">Credit{pkg.credits > 1 ? 's' : ''}</p>
              </div>
              <div className="text-center mb-6">
                <p className="text-3xl font-bold text-[#0F172A]">${pkg.price}</p>
                <p className="text-sm text-slate-600 mt-1">${(pkg.price / pkg.credits).toFixed(2)} per credit</p>
              </div>
              <Button
                onClick={() => handlePurchase(pkg)}
                className={`w-full rounded-full py-6 font-semibold ${
                  pkg.popular
                    ? 'bg-[#4F46E5] hover:bg-[#4338CA] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#0F172A]'
                }`}
                disabled={processing && selectedPackage?.credits === pkg.credits}
              >
                {processing && selectedPackage?.credits === pkg.credits ? 'Processing...' : 'Purchase'}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-slate-50 p-6 rounded-lg">
          <h3 className="font-bold text-[#0F172A] mb-4">How Credits Work</h3>
          <ul className="space-y-2 text-slate-600">
            <li>• Each job posting requires 1 credit</li>
            <li>• Credits never expire</li>
            <li>• Secure payment processing via Stripe</li>
            <li>• Your jobs will be reviewed by our admin team before going live</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
