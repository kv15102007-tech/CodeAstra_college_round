import React from 'react';
import {
  LayoutDashboard,
  Globe,
  Users,
  CreditCard,
  Send,
  Calendar,
  Sparkles,
  BarChart3,
  Settings,
  Moon,
  Sun,
  ChevronDown,
  HelpCircle,
  Palette,
} from 'lucide-react';
import { PageId, ThemeMode } from '../types';

interface SidebarProps {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  workspaceName: string;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDarkThemeColumnOpen: boolean;
  setIsDarkThemeColumnOpen: (open: boolean) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  setCurrentPage,
  workspaceName,
  themeMode,
  setThemeMode,
  isDarkThemeColumnOpen,
  setIsDarkThemeColumnOpen,
  isOpenMobile,
  setIsOpenMobile,
}) => {
  const isDark = themeMode === 'dark';

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'website', label: 'Website builder', icon: <Globe className="w-4 h-4" /> },
    { id: 'crm', label: 'CRM & contacts', icon: <Users className="w-4 h-4" /> },
    { id: 'billing', label: 'Subscriptions & billing', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'marketing', label: 'Marketing', icon: <Send className="w-4 h-4" /> },
    { id: 'webinars', label: 'Webinars & events', icon: <Calendar className="w-4 h-4" /> },
  ];

  const intelligenceItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'agent', label: 'AI business agent', icon: <Sparkles className="w-4 h-4 text-indigo-400" />, badge: 'AI' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: PageId) => {
    setCurrentPage(id);
    setIsOpenMobile(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside
        className={`w-64 shrink-0 flex flex-col border-r transition-all duration-200 z-40 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        } ${
          isOpenMobile
            ? 'fixed inset-y-0 left-0 shadow-2xl'
            : 'hidden lg:flex'
        }`}
      >
        {/* Brand Lockup */}
        <div className="p-4 pt-5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-base flex items-center justify-center shadow-md shadow-indigo-500/20">
              N
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-wider font-sans leading-none text-slate-900 dark:text-white">
                NEXUS
              </div>
              <div className="text-[10px] font-semibold text-slate-400 tracking-wider mt-1 uppercase">
                Business Workspace
              </div>
            </div>
          </div>

          {/* Workspace Switcher */}
          <div className="mt-4 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0">
                {workspaceName.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold block truncate text-slate-900 dark:text-slate-100">
                  {workspaceName}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  Free workspace
                </span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </div>
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-indigo-500/20 text-indigo-400">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Intelligence
            </div>
            <nav className="space-y-0.5">
              {intelligenceItems.map((item) => {
                const active = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      active
                        ? 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-indigo-500/20 text-indigo-400">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Actions & Profile */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {/* Dedicated Dark Theme Column Trigger */}
          <button
            onClick={() => setIsDarkThemeColumnOpen(!isDarkThemeColumnOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
              isDarkThemeColumnOpen
                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-semibold'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <Palette className="w-3.5 h-3.5 text-indigo-400" />
              <span>Dark Theme Studio</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
              {isDarkThemeColumnOpen ? 'OPEN' : 'VIEW'}
            </span>
          </button>

          {/* Quick Settings */}
          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              currentPage === 'settings'
                ? 'bg-indigo-500/15 text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          {/* User profile row */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
                KV
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold block truncate text-slate-900 dark:text-slate-100">
                  Karthik V.
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  Administrator
                </span>
              </div>
            </div>

            {/* Quick theme toggle */}
            <button
              onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
