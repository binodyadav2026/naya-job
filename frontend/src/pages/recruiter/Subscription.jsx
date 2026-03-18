import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Briefcase,
  Check,
  CreditCard,
  FileText,
  Home,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import DashboardSectionHeader from '../../components/dashboard/DashboardSectionHeader';
import StatPanel from '../../components/dashboard/StatPanel';
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
      'Job expires in 30 days',
    ],
    plan_id: 'free',
    popular: false,
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
      'Jobs active for 60 days',
    ],
    plan_id: 'basic',
    popular: true,
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
      'Advanced analytics and insights',
      'Jobs active for 90 days',
      'Featured company profile',
    ],
    plan_id: 'premium',
    popular: false,
  },
  {
    name: 'Enterprise',
    price: 4999,
    period: 'month',
    jobLimit: 'Unlimited',
    features: [
      'Unlimited job postings',
      'Top placement and visibility',
      'Dedicated account manager',
      'Custom analytics dashboard',
      'Jobs never expire',
      'Premium company branding',
      'API access',
    ],
    plan_id: 'enterprise',
    popular: false,
  },
];

export default function Subscription() {
  const { user } = useOutletContext();
  const [profile, setProfile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

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

  const currentPlan = useMemo(() => {
    if (!profile) return null;
    return plans.find((plan) => plan.plan_id === profile.subscription_plan) || plans[0];
  }, [profile]);

  const monthlyLimit =
    profile?.custom_job_limit !== undefined && profile?.custom_job_limit !== null
      ? profile.custom_job_limit
      : currentPlan?.jobLimit ?? 1;

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
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please try again.');
        setProcessing(false);
        return;
      }

      const orderResponse = await api.post('/subscriptions/create-order', null, {
        params: { plan: plan.plan_id },
      });

      const { order_id, amount, currency, key_id, demo_mode } = orderResponse.data;

      if (demo_mode) {
        toast.info('Running in demo mode. Simulating payment...');

        setTimeout(async () => {
          try {
            await api.post('/subscriptions/verify-payment', null, {
              params: {
                razorpay_order_id: order_id,
                razorpay_payment_id: `pay_demo_${Date.now()}`,
                razorpay_signature: 'demo_signature',
              },
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

      const options = {
        key: key_id,
        amount,
        currency,
        name: 'Naya Job',
        description: `${plan.name} Subscription`,
        order_id,
        handler: async function (response) {
          try {
            await api.post('/subscriptions/verify-payment', null, {
              params: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
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
          email: user.email,
        },
        theme: {
          color: '#7C3AED',
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            setSelectedPlan(null);
          },
        },
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
      <div className="space-y-8" data-testid="subscription-page">
        <section className="hero-grid relative overflow-hidden rounded-[2rem] px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="ambient-orb left-[-3rem] top-8 h-40 w-40 bg-fuchsia-500/35" />
          <div className="ambient-orb bottom-0 right-8 h-44 w-44 bg-cyan-400/18" />

          <div className="relative grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-start">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/80">
                Recruiter plan management
              </div>
              <h1 className="mt-6 max-w-3xl text-4xl font-heading font-extrabold tracking-[-0.05em] text-white sm:text-5xl">
                Choose the plan that fits your hiring volume.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                Upgrade capacity, monitor posting limits, and keep hiring operations aligned with how fast your team needs to scale.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-start gap-3 xl:justify-end">
              <div className="inline-flex min-w-[125px] items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2.5 backdrop-blur-md">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Current</span>
                <span className="text-base font-heading font-extrabold capitalize text-white">
                  {profile?.subscription_plan || 'free'}
                </span>
              </div>
              <div className="inline-flex min-w-[125px] items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2.5 backdrop-blur-md">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Status</span>
                <span className="text-base font-heading font-extrabold text-white">
                  {profile?.subscription_status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="inline-flex min-w-[125px] items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.08] px-4 py-2.5 backdrop-blur-md">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">Limit</span>
                <span className="text-base font-heading font-extrabold text-white">{monthlyLimit}</span>
              </div>
            </div>
          </div>
        </section>

        {profile ? (
          <section className="grid gap-5 xl:grid-cols-4">
            <StatPanel
              icon={CreditCard}
              label="Current plan"
              value={profile.subscription_plan}
              detail={profile.custom_job_limit ? 'This limit is synced from Placfy for your recruiter account.' : 'Your active plan determines posting capacity and feature access.'}
              valueClassName="capitalize text-violet-600"
            />
            <StatPanel
              icon={ShieldCheck}
              label="Plan status"
              value={profile.subscription_status === 'active' ? 'Active' : 'Inactive'}
              detail={
                profile.subscription_end && profile.subscription_status === 'active'
                  ? `Valid until ${new Date(profile.subscription_end).toLocaleDateString()}`
                  : 'Activate or upgrade your plan to unlock more hiring capacity.'
              }
              valueClassName={profile.subscription_status === 'active' ? 'text-emerald-500' : 'text-amber-500'}
            />
            <StatPanel
              icon={Briefcase}
              label="Jobs this month"
              value={`${profile.jobs_posted_this_month}/${monthlyLimit}`}
              detail="Posted this month relative to your plan limit."
            />
            <StatPanel
              icon={TrendingUp}
              label="Hiring mode"
              value={profile.subscription_status === 'active' ? 'Scaling' : 'Paused'}
              detail="Recruiter billing and hiring operations stay connected from one workspace."
            />
          </section>
        ) : null}

        <section className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-start">
          <div className="space-y-6">
            <DashboardSectionHeader
              eyebrow="Plans"
              title="Premium billing, clear limits, no clutter"
              description="Choose the plan tier that gives your hiring team the right posting volume, support level, and visibility."
              className="sm:px-1"
            />

            <div className="grid gap-5 lg:grid-cols-2">
              {plans.map((plan) => {
                const isCurrent = profile?.subscription_plan === plan.plan_id;
                const isProcessing = processing && selectedPlan?.plan_id === plan.plan_id;

                return (
                  <div
                    key={plan.plan_id}
                    className={`premium-panel relative p-6 sm:p-7 ${
                      plan.popular ? 'border-accent/25 shadow-[0_24px_60px_-36px_rgba(124,58,237,0.45)]' : ''
                    }`}
                  >
                    {plan.popular ? (
                      <div className="absolute right-5 top-5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-700">
                        Most popular
                      </div>
                    ) : null}

                    <div className="pr-24">
                      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {plan.name} plan
                      </div>
                      <div className="mt-4 flex items-end gap-2">
                        <span className="text-4xl font-heading font-extrabold tracking-[-0.05em] text-slate-950">
                          Rs {plan.price}
                        </span>
                        {plan.price > 0 ? (
                          <span className="pb-1 text-sm font-medium text-slate-500">/ {plan.period}</span>
                        ) : (
                          <span className="pb-1 text-sm font-medium text-slate-500">/ {plan.period}</span>
                        )}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {typeof plan.jobLimit === 'number' ? `${plan.jobLimit} job postings per month` : `${plan.jobLimit} job postings`}
                      </p>
                    </div>

                    <div className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <div key={`${plan.plan_id}-${feature}`} className="flex items-start gap-3 text-sm text-slate-600">
                          <div className="mt-0.5 rounded-full bg-emerald-50 p-1 text-emerald-600">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                          <span className="leading-6">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7">
                      <Button
                        onClick={() => handleSubscribe(plan)}
                        variant={plan.popular && !isCurrent ? 'accent' : 'outline'}
                        className="w-full"
                        disabled={isProcessing || isCurrent}
                      >
                        {isProcessing
                          ? 'Processing...'
                          : isCurrent
                          ? 'Current plan'
                          : plan.plan_id === 'free'
                          ? 'Stay on free'
                          : `Choose ${plan.name}`}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <DashboardSectionHeader
              eyebrow="Plan guidance"
              title="How subscriptions work"
              description="Billing should stay simple, predictable, and aligned with your recruiter workflow."
            />

            <div className="grid gap-5">
              <div className="premium-panel p-6">
                <div className="feature-icon">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-heading font-bold text-slate-950">Straightforward capacity</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Choose a plan based on your monthly hiring needs. Posting limits reset every month, so your workflow stays predictable.
                </p>
              </div>

              <div className="premium-panel p-6">
                <div className="feature-icon">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-heading font-bold text-slate-950">Flexible upgrades</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Upgrade or downgrade when hiring volume changes. Payments are processed securely through Razorpay with no long-term lock-in.
                </p>
              </div>

              <div className="premium-panel p-6">
                <div className="feature-icon">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-heading font-bold text-slate-950">Operational clarity</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Subscription status, limits, and posting activity stay visible in one place so recruiters do not need to guess what is available.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
