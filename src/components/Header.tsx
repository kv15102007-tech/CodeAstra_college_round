import React from 'react';
import {
  Menu,
  Search,
  Bell,
  Laptop,
  Tablet,
  Smartphone,
  Maximize2,
  Columns,
  Palette,
  Plus,
  Download,
} from 'lucide-react';
import { PageId, DeviceMode, ThemeMode } from '../types';

interface HeaderProps {
  currentPage: PageId;
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  themeMode: ThemeMode;
  isDarkThemeColumnOpen: boolean;
  setIsDarkThemeColumnOpen: (open: boolean) => void;
  onOpenSearch: () => void;
  onOpenQuickAction: () => void;
  onOpenNotifications: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  deviceMode,
  setDeviceMode,
  themeMode,
  isDarkThemeColumnOpen,
  setIsDarkThemeColumnOpen,
  onOpenSearch,
  onOpenQuickAction,
  onOpenNotifications,
  onToggleMobileMenu,
}) => {
  const isDark = themeMode === 'dark';

  const handleDownloadZip = async () => {
    try {
      const res = await fetch('/nexus-workspace.zip');
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'nexus-workspace.zip';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    } catch (err) {
      console.error('Download error:', err);
      // Direct fallback
      const link = document.createElement('a');
      link.href = '/nexus-workspace.zip';
      link.download = 'nexus-workspace.zip';
      link.click();
    }
  };

  const pageNames: Record<PageId, string> = {
    overview: 'Overview',
    website: 'Website builder',
    crm: 'CRM & contacts',
    billing: 'Subscriptions & billing',
    marketing: 'Marketing',
    webinars: 'Webinars & events',
    agent: 'AI business agent',
    analytics: 'Analytics',
    settings: 'Settings',
  };

  return (
    <header
      className={`h-16 px-4 sm:px-6 border-b flex items-center justify-between sticky top-0 z-30 transition-colors duration-200 ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-100 backdrop-blur-md'
          : 'bg-white/90 border-slate-200 text-slate-900 backdrop-blur-md'
      }`}
    >
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="hidden sm:inline">Workspace</span>
          <span className="hidden sm:inline">/</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {pageNames[currentPage]}
          </span>
        </div>
      </div>

      {/* Middle: Device Responsive Testing Bar */}
      <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <button
          onClick={() => setDeviceMode('laptop')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            deviceMode === 'laptop'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Laptop / Desktop view (1440px)"
        >
          <Laptop className="w-3.5 h-3.5" />
          <span>Laptop</span>
        </button>

        <button
          onClick={() => setDeviceMode('tablet')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            deviceMode === 'tablet'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Tablet view (768px)"
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablet</span>
        </button>

        <button
          onClick={() => setDeviceMode('mobile')}
          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            deviceMode === 'mobile'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Mobile iPhone view (390px)"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile</span>
        </button>

        <button
          onClick={() => setDeviceMode('comparison')}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
            deviceMode === 'comparison'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Compare Mobile, Tablet & Desktop side by side"
        >
          <Columns className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Multi-Device</span>
        </button>

        <button
          onClick={() => setDeviceMode('full')}
          className={`px-2 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
            deviceMode === 'full'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title="Native Fluid Responsive View"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Fluid</span>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search Modal Trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-xs"
          title="Search workspace (⌘K)"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline text-[11px]">Search...</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-mono text-slate-500 dark:text-slate-300">
            ⌘K
          </kbd>
        </button>

        {/* Dark Theme Column Toggle */}
        <button
          onClick={() => setIsDarkThemeColumnOpen(!isDarkThemeColumnOpen)}
          className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 text-xs font-medium ${
            isDarkThemeColumnOpen
              ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400'
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title="Toggle dedicated Dark Theme Studio column"
        >
          <Palette className="w-4 h-4 text-indigo-500" />
          <span className="hidden xl:inline">Theme Studio</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-indigo-500 absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Download Project ZIP */}
        <button
          onClick={handleDownloadZip}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          title="Download complete project ZIP"
        >
          <Download className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden lg:inline">Download ZIP</span>
        </button>

        {/* Quick Action Button */}
        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Quick action</span>
        </button>
      </div>
    </header>
  );
};
