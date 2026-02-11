import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Home, User, Briefcase, FileText, MessageSquare, CreditCard, Check } from 'lucide-react';
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

export default function Subscription() {
  const { user } = useOutletContext();
  const [profile, setProfile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      jobLimit: 1,
      features: [
        '1 job posting per month',
        'Basic job listing',
        'Email support',
        'Job expires in 30 days'
      ],
      plan_id: 'free',
      popular: false
    },
    {
      name: 'Basic',
      price: 999,
      period: 'month',
      jobLimit: 10,
      features: [
        '10 job postings per month',
        'Featured job listings',
        'Priority support',
        'Advanced analytics',
        'Jobs active for 60 days'
      ],
      plan_id: 'basic',
      popular: true
    },
    {
      name: 'Premium',
      price: 2499,
      period: 'month',
      jobLimit: 50,
      features: [
        '50 job postings per month',
        'Premium job placement',
        '24/7 priority support',
        'Advanced analytics & insights',
        'Jobs active for 90 days',
        'Featured company profile'
      ],
      plan_id: 'premium',
      popular: false
    },
    {
      name: 'Enterprise',
      price: 4999,
      period: 'month',
      jobLimit: 'Unlimited',
      features: [
        'Unlimited job postings',
        'Top placement & visibility',
        'Dedicated account manager',
        'Custom analytics dashboard',
        'Jobs never expire',
        'Premium company branding',
        'API access'
      ],
      plan_id: 'enterprise',
      popular: false
    }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/profile/recruiter/${user.user_id}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan) => {
    if (plan.plan_id === 'free') {
      toast.info('You are already on the free plan');
      return;
    }

    setProcessing(true);
    setSelectedPlan(plan);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setProcessing(false);
        return;
      }

      // Create order
      const orderResponse = await api.post('/subscriptions/create-order', null, {
        params: { plan: plan.plan_id }
      });

      const { order_id, amount, currency, key_id, demo_mode } = orderResponse.data;

      if (demo_mode) {
        toast.info('Running in demo mode - Simulating payment...');
        
        // Simulate payment success after 2 seconds
        setTimeout(async () => {
          try {
            await api.post('/subscriptions/verify-payment', null, {
              params: {
                razorpay_order_id: order_id,
                razorpay_payment_id: `pay_demo_${Date.now()}`,
                razorpay_signature: 'demo_signature'
              }
            });
            toast.success(`${plan.name} plan activated successfully!`);
            fetchProfile();
          } catch (error) {
            toast.error('Subscription activation failed');
          } finally {
            setProcessing(false);
            setSelectedPlan(null);
          }
        }, 2000);
        return;
      }

      // Initialize Razorpay payment
      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: 'JobConnect',
        description: `${plan.name} Subscription`,
        order_id: order_id,
        handler: async function (response) {
          try {
            // Verify payment
            await api.post('/subscriptions/verify-payment', null, {
              params: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }
            });
            toast.success(`${plan.name} plan activated successfully!`);
            fetchProfile();
          } catch (error) {
            toast.error('Payment verification failed');
          } finally {
            setProcessing(false);
            setSelectedPlan(null);
          }
        },
        prefill: {
          name: user.name,
          email: user.email
        },
        theme: {
          color: '#4F46E5'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            setSelectedPlan(null);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to initiate subscription');
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="subscription-page">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">Subscription Plans</h1>
        <p className="text-slate-600 mb-8">Choose the plan that best fits your hiring needs</p>

        {profile && (
          <div className="bg-white p-6 rounded-lg border-2 border-[#4F46E5] mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-slate-600 mb-1">Current Plan</p>
                <p className="text-2xl font-bold text-[#4F46E5] capitalize">{profile.subscription_plan}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 mb-1">Status</p>
                <p className={`text-lg font-semibold ${profile.subscription_status === 'active' ? 'text-green-600' : 'text-orange-600'}`}>
                  {profile.subscription_status === 'active' ? 'Active' : 'Inactive'}
                </p>
                {profile.subscription_end && profile.subscription_status === 'active' && (
                  <p className="text-xs text-slate-500 mt-1">
                    Valid until: {new Date(profile.subscription_end).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 mb-1">Jobs Posted</p>
                <p className="text-2xl font-bold text-[#0F172A]">{profile.jobs_posted_this_month}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan) => (
            <div
              key={plan.plan_id}
              className={`bg-white p-8 rounded-lg border-2 relative ${
                plan.popular ? 'border-[#4F46E5] shadow-lg' : 'border-slate-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-[#4F46E5] text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                  Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-[#0F172A] mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-[#0F172A]">₹{plan.price}</span>
                  {plan.price > 0 && <span className="text-slate-600">/{plan.period}</span>}
                </div>
                <p className="text-sm text-slate-600">
                  {typeof plan.jobLimit === 'number' ? `${plan.jobLimit} jobs` : plan.jobLimit} per month
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-600">
                    <Check className="h-5 w-5 text-[#10B981] mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan)}
                className={`w-full rounded-full py-6 font-semibold ${
                  plan.popular
                    ? 'bg-[#4F46E5] hover:bg-[#4338CA] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-[#0F172A]'
                }`}
                disabled={processing && selectedPlan?.plan_id === plan.plan_id}
              >
                {processing && selectedPlan?.plan_id === plan.plan_id
                  ? 'Processing...'
                  : profile?.subscription_plan === plan.plan_id
                  ? 'Current Plan'
                  : plan.plan_id === 'free'
                  ? 'Free'
                  : 'Subscribe'}
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-6 rounded-lg">
          <h3 className="font-bold text-[#0F172A] mb-4">How Subscriptions Work</h3>
          <ul className="space-y-2 text-slate-600">
            <li>• Choose a plan based on your monthly hiring needs</li>
            <li>• Job posting limits reset every month</li>
            <li>• Upgrade or downgrade anytime</li>
            <li>• All payments processed securely through Razorpay</li>
            <li>• Cancel anytime - no long-term commitments</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
