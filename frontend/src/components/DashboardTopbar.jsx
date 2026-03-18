import { Bell, ChevronRight, Search, Sparkles } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';

function formatRole(role) {
  return (role || 'workspace').replace('_', ' ');
}

function getCurrentItem(pathname, navigation) {
  const exactMatch = navigation.find((item) => item.path === pathname);
  if (exactMatch) return exactMatch;

  const nestedMatch = [...navigation]
    .sort((a, b) => b.path.length - a.path.length)
    .find((item) => pathname.startsWith(`${item.path}/`));

  return nestedMatch || navigation[0];
}

export default function DashboardTopbar({ user, navigation, isCollapsed = false }) {
  const location = useLocation();
  const currentItem = getCurrentItem(location.pathname, navigation);
  const currentLabel = currentItem?.name || 'Workspace';
  const roleLabel = formatRole(user?.role);
  const shellControlClass =
    'inline-flex h-11 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm';
  const sidebarOffset = isCollapsed ? 'left-24 w-[calc(100%-6rem)]' : 'left-72 w-[calc(100%-18rem)]';

  return (
    <header className={`fixed top-0 z-50 border-b border-slate-200/80 bg-[rgba(255,255,255,0.94)] backdrop-blur-xl ${sidebarOffset}`}>
      <div className="flex h-[84px] items-center justify-between gap-4 px-5 sm:px-8">
        <div className="flex min-w-0 items-center gap-5">
          <BrandLogo
            linked
            tone="light"
            size="sm"
            imageOnly
            collapsed
            className="justify-center"
          />

          <div className="hidden min-w-0 items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 lg:flex">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-500">
              {roleLabel}
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>{currentLabel}</span>
          </div>
        </div>

        <div className="hidden min-w-[280px] max-w-[520px] flex-1 items-center xl:flex">
          <div className="flex h-11 w-full items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500">
            <Search className="h-4 w-4 text-slate-400" />
            <span>Search candidates, jobs, messages, or workflows</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`${shellControlClass} hidden lg:inline-flex`}>
            {currentLabel}
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
          </button>

          <div className="hidden h-11 items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 text-sm font-semibold text-violet-700 md:inline-flex">
            <Sparkles className="h-4 w-4" />
            AI workspace
          </div>

          <div className="inline-flex h-11 items-center gap-3 rounded-full border border-slate-200 bg-white pl-2 pr-4 shadow-sm">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user?.name}
                className="h-8 w-8 rounded-full ring-2 ring-slate-100"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                {user?.name?.[0]}
              </div>
            )}
            <div className="hidden min-w-0 sm:block">
              <div className="truncate text-sm font-semibold text-slate-950">{user?.name}</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                {roleLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
