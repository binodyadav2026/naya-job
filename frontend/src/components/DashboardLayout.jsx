import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import api from '../utils/api';
import BrandLogo from './BrandLogo';
import DashboardTopbar from './DashboardTopbar';

export default function DashboardLayout({ children, user, navigation }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedState = window.localStorage.getItem('naya-job-sidebar-collapsed');
    if (savedState === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed((current) => {
      const nextState = !current;
      window.localStorage.setItem('naya-job-sidebar-collapsed', String(nextState));
      return nextState;
    });
  };

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
    <div className="min-h-screen bg-surface-subtle">
      <DashboardTopbar user={user} navigation={navigation} isCollapsed={isCollapsed} />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/10 bg-surface-strong text-white shadow-[20px_0_60px_rgba(15,23,42,0.08)] transition-[width] duration-300 ease-out ${
          isCollapsed ? 'w-24' : 'w-72'
        }`}
        data-testid="dashboard-sidebar"
      >
        <div
          className={`border-b border-white/10 px-5 py-5 ${
            isCollapsed ? 'flex flex-col items-center gap-4' : 'flex items-center justify-between'
          }`}
        >
          <BrandLogo
            linked
            tone="dark"
            size={isCollapsed ? 'sm' : 'md'}
            className={isCollapsed ? 'justify-center' : ''}
            collapsed={isCollapsed}
          />
          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-white/90 transition-colors hover:bg-white/12 hover:text-white"
            data-testid="sidebar-toggle-btn"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        <div className={`border-b border-white/10 px-5 py-5 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="h-11 w-11 rounded-full ring-2 ring-white/10" />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white">
                <span className="text-lg font-bold">{user?.name?.[0]}</span>
              </div>
            )}
            {!isCollapsed ? (
              <div>
                <p className="font-semibold text-white">{user?.name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-white/50">{user?.role?.replace('_', ' ')}</p>
              </div>
            ) : null}
          </div>
        </div>

        <nav className="thin-scrollbar flex-1 space-y-2 overflow-y-auto px-4 py-5">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center rounded-2xl transition-[background-color,color,transform] duration-200 ${
                isCollapsed
                  ? 'justify-center px-0 py-2'
                  : 'px-4 py-3'
              } ${
                location.pathname === item.path
                  ? isCollapsed
                    ? 'bg-transparent text-white shadow-none'
                    : 'bg-white text-slate-950 shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              data-testid={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
              title={isCollapsed ? item.name : undefined}
            >
              <span
                className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                  location.pathname === item.path
                    ? isCollapsed
                      ? 'bg-white text-slate-950 shadow-sm'
                      : 'bg-slate-100 text-slate-950'
                    : 'bg-white/[0.06] text-white/80 group-hover:bg-white/10 group-hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
              </span>
              {!isCollapsed ? <span className="ml-3 font-medium">{item.name}</span> : null}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Button
            variant="ghost"
            className={`text-white/70 hover:bg-white/10 hover:text-white ${isCollapsed ? 'w-full justify-center px-0' : 'w-full justify-start'}`}
            onClick={handleLogout}
            data-testid="logout-btn"
            title={isCollapsed ? 'Logout' : undefined}
          >
            <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed ? 'Logout' : null}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`min-h-screen bg-surface-subtle pt-[84px] transition-[padding-left] duration-300 ease-out ${
          isCollapsed ? 'pl-24' : 'pl-72'
        }`}
      >
        <div className="p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
