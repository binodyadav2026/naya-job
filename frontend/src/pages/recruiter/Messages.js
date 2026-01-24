import { useOutletContext } from 'react-router-dom';
import { Home, User, Briefcase, FileText, MessageSquare, CreditCard } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const navigation = [
  { name: 'Dashboard', path: '/recruiter', icon: Home },
  { name: 'Profile', path: '/recruiter/profile', icon: User },
  { name: 'Post Job', path: '/recruiter/post-job', icon: Briefcase },
  { name: 'My Jobs', path: '/recruiter/my-jobs', icon: FileText },
  { name: 'Messages', path: '/recruiter/messages', icon: MessageSquare },
  { name: 'Buy Credits', path: '/recruiter/credits', icon: CreditCard },
];

export default function RecruiterMessages() {
  const { user } = useOutletContext();

  return (
    <DashboardLayout user={user} navigation={navigation}>
      <div data-testid="recruiter-messages">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-8">Messages</h1>
        <div className="bg-white p-12 rounded-lg border border-slate-200 text-center">
          <p className="text-slate-600">Messaging feature - Same as job seeker messages</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
