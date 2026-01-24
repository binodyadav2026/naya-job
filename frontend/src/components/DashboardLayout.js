import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Briefcase, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import api from '../utils/api';

export default function DashboardLayout({ children, user, navigation }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0F172A] text-white flex flex-col" data-testid="dashboard-sidebar">
        <div className="p-6 border-b border-slate-700">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-[#4F46E5]" />
            <span className="text-xl font-bold">JobConnect</span>
          </Link>
        </div>

        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-[#4F46E5] flex items-center justify-center">
                <span className="text-lg font-bold">{user?.name?.[0]}</span>
              </div>
            )}
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg sidebar-nav ${
                location.pathname === item.path
                  ? 'bg-[#4F46E5] text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
              data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={handleLogout}
            data-testid="logout-btn"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-slate-50">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
