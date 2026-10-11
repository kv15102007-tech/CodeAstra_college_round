import React, { useState, useEffect } from 'react';
import {
  PageId,
  DeviceMode,
  DeviceOrientation,
  ThemeMode,
  DarkFlavor,
  Contact,
  Plan,
  Transaction,
  Campaign,
  WebinarEvent,
  WorkflowPermission,
  WorkflowItem,
  WorkspaceSettings,
} from './types';
import {
  initialWorkspaceSettings,
  initialContacts,
  initialPlans,
  initialTransactions,
  initialCampaigns,
  initialEvents,
  initialPermissions,
  initialWorkflows,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DarkThemeColumn } from './components/DarkThemeColumn';
import { DeviceSimulator } from './components/DeviceSimulator';
import { OverviewPage } from './components/pages/OverviewPage';
import { WebsiteBuilderPage } from './components/pages/WebsiteBuilderPage';
import { CrmPage } from './components/pages/CrmPage';
import { BillingPage } from './components/pages/BillingPage';
import { MarketingPage } from './components/pages/MarketingPage';
import { WebinarsPage } from './components/pages/WebinarsPage';
import { AgentPage } from './components/pages/AgentPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { SettingsPage } from './components/pages/SettingsPage';
import {
  SearchModal,
  QuickActionModal,
  AddContactModal,
  CreateCampaignModal,
  CreateEventModal,
  PlanModal,
} from './components/modals/Modals';

export default function App() {
  // Navigation & Workspace State
  const [currentPage, setCurrentPage] = useState<PageId>('overview');
  const [settings, setSettings] = useState<WorkspaceSettings>(initialWorkspaceSettings);

  // Responsive Device Viewport Testing State
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('full');
  const [orientation, setOrientation] = useState<DeviceOrientation>('portrait');
  const [zoom, setZoom] = useState<number>(100);

  // Dedicated Dark Theme Column & Appearance State
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [darkFlavor, setDarkFlavor] = useState<DarkFlavor>('obsidian');
  const [accentColor, setAccentColor] = useState<string>('#6366f1');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [oledMode, setOledMode] = useState<boolean>(false);
  const [isDarkThemeColumnOpen, setIsDarkThemeColumnOpen] = useState<boolean>(false);

  // Mobile Drawer
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState<boolean>(false);

  // Data Collections
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [events, setEvents] = useState<WebinarEvent[]>(initialEvents);
  const [permissions, setPermissions] = useState<WorkflowPermission[]>(initialPermissions);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(initialWorkflows);

  // Modals State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  // Toast Notification System
  const [toastText, setToastText] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastText(msg);
  };

  useEffect(() => {
    if (!toastText) return;
    const timer = setTimeout(() => setToastText(null), 3000);
    return () => clearTimeout(timer);
  }, [toastText]);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsQuickActionOpen(false);
        setIsAddContactOpen(false);
        setIsCreateCampaignOpen(false);
        setIsCreateEventOpen(false);
        setIsPlanModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync document root classes for themes
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark' || themeMode === 'dual') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      document.body.style.backgroundColor = oledMode
        ? '#000000'
        : darkFlavor === 'midnight'
        ? '#0b1329'
        : darkFlavor === 'emerald'
        ? '#06130d'
        : darkFlavor === 'sunset'
        ? '#120c18'
        : '#030712';
      document.body.style.color = '#f8fafc';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [themeMode, darkFlavor, oledMode]);

  // Handlers
  const handleQuickActionSelect = (action: 'contact' | 'campaign' | 'event' | 'website') => {
    switch (action) {
      case 'contact':
        setCurrentPage('crm');
        setIsAddContactOpen(true);
        break;
      case 'campaign':
        setCurrentPage('marketing');
        setIsCreateCampaignOpen(true);
        break;
      case 'event':
        setCurrentPage('webinars');
        setIsCreateEventOpen(true);
        break;
      case 'website':
        setCurrentPage('website');
        break;
    }
  };

  const handleAddContact = (contact: Contact) => {
    setContacts((prev) => [contact, ...prev]);
    showToast(`Added ${contact.name} to CRM`);
  };

  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddCampaign = (campaign: Campaign) => {
    setCampaigns((prev) => [campaign, ...prev]);
  };

  const handleToggleEventRegistration = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const willBeRegistered = !ev.userRegistered;
          showToast(
            willBeRegistered
              ? `You are now registered for "${ev.title}"`
              : `Registration cancelled for "${ev.title}"`
          );
          return {
            ...ev,
            userRegistered: willBeRegistered,
            registeredCount: willBeRegistered ? ev.registeredCount + 1 : ev.registeredCount - 1,
          };
        }
        return ev;
      })
    );
  };

  const handleAddEvent = (ev: WebinarEvent) => {
    setEvents((prev) => [ev, ...prev]);
    showToast(`Created event: ${ev.title}`);
  };

  const handleSavePlan = (savedPlan: Plan) => {
    setPlans((prev) => {
      const exists = prev.some((p) => p.id === savedPlan.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPlan.id ? savedPlan : p));
      }
      return [...prev, savedPlan];
    });
    showToast(`Saved plan settings for ${savedPlan.name}`);
  };

  const handleTogglePermission = (permId: string) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === permId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleApproveWorkflow = (wfId: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === wfId ? { ...w, status: 'Done' } : w))
    );
  };

  // Currency symbol
  const currencySymbols = { INR: '₹', USD: '$', EUR: '€' };
  const currencySymbol = currencySymbols[settings.currency];

  // Background style based on dark flavors & OLED
  const getThemeBackground = () => {
    if (themeMode === 'light') return 'bg-slate-50 text-slate-900';
    if (oledMode) return 'bg-black text-slate-100';
    switch (darkFlavor) {
      case 'midnight':
        return 'bg-[#0b1329] text-slate-100';
      case 'emerald':
        return 'bg-[#06130d] text-slate-100';
      case 'sunset':
        return 'bg-[#120c18] text-slate-100';
      default:
        return 'bg-[#030712] text-slate-100';
    }
  };

  // Active page renderer
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'overview':
        return (
          <OverviewPage
            onNavigate={(p) => setCurrentPage(p)}
            onOpenQuickAction={() => setIsQuickActionOpen(true)}
            currencySymbol={currencySymbol}
          />
        );
      case 'website':
        return <WebsiteBuilderPage onShowToast={showToast} />;
      case 'crm':
        return (
          <CrmPage
            contacts={contacts}
            onAddContact={() => setIsAddContactOpen(true)}
            onDeleteContact={handleDeleteContact}
            onShowToast={showToast}
          />
        );
      case 'billing':
        return (
          <BillingPage
            plans={plans}
            transactions={transactions}
            onOpenCreatePlan={() => {
              setEditingPlan(null);
              setIsPlanModalOpen(true);
            }}
            onEditPlan={(plan) => {
              setEditingPlan(plan);
              setIsPlanModalOpen(true);
            }}
            onShowToast={showToast}
            currency={settings.currency}
            setCurrency={(c) => setSettings((s) => ({ ...s, currency: c }))}
          />
        );
      case 'marketing':
        return (
          <MarketingPage
            campaigns={campaigns}
            onAddCampaign={handleAddCampaign}
            onOpenCreateModal={() => setIsCreateCampaignOpen(true)}
            onShowToast={showToast}
          />
        );
      case 'webinars':
        return (
          <WebinarsPage
            events={events}
            onToggleRegister={handleToggleEventRegistration}
            onOpenCreateModal={() => setIsCreateEventOpen(true)}
            onShowToast={showToast}
          />
        );
      case 'agent':
        return (
          <AgentPage
            permissions={permissions}
            onTogglePermission={handleTogglePermission}
            workflows={workflows}
            onApproveWorkflow={handleApproveWorkflow}
            onShowToast={showToast}
          />
        );
      case 'analytics':
        return <AnalyticsPage onShowToast={showToast} currencySymbol={currencySymbol} />;
      case 'settings':
        return (
          <SettingsPage
            settings={settings}
            onUpdateSettings={(up) => setSettings((s) => ({ ...s, ...up }))}
            onSave={() => showToast('Workspace settings saved successfully!')}
            onShowToast={showToast}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${getThemeBackground()} ${
        highContrast ? 'contrast-125' : ''
      }`}
    >
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          workspaceName={settings.name}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
          isDarkThemeColumnOpen={isDarkThemeColumnOpen}
          setIsDarkThemeColumnOpen={setIsDarkThemeColumnOpen}
          isOpenMobile={isOpenMobileMenu}
          setIsOpenMobile={setIsOpenMobileMenu}
        />

        {/* Main Work Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Topbar */}
          <Header
            currentPage={currentPage}
            deviceMode={deviceMode}
            setDeviceMode={setDeviceMode}
            themeMode={themeMode}
            isDarkThemeColumnOpen={isDarkThemeColumnOpen}
            setIsDarkThemeColumnOpen={setIsDarkThemeColumnOpen}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenQuickAction={() => setIsQuickActionOpen(true)}
            onOpenNotifications={() => showToast('All workspace notifications caught up')}
            onToggleMobileMenu={() => setIsOpenMobileMenu(true)}
          />

          {/* Main Content / Responsive Simulator */}
          <main className="flex-1 overflow-y-auto">
            {themeMode === 'dual' ? (
              /* DUAL THEME SPLIT VIEW: Light Column on Left, Dark Column on Right! */
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 min-h-full">
                {/* Left Side: Light Theme */}
                <div className="p-6 bg-slate-50 text-slate-900 overflow-y-auto">
                  <div className="mb-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-700 text-xs font-bold uppercase tracking-wider">
                    <span>☀ Light Theme View</span>
                  </div>
                  {renderCurrentPage()}
                </div>

                {/* Right Side: Dark Theme */}
                <div className="p-6 bg-slate-950 text-slate-100 overflow-y-auto">
                  <div className="mb-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-500/15 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                    <span>☾ Dark Theme View ({darkFlavor})</span>
                  </div>
                  {renderCurrentPage()}
                </div>
              </div>
            ) : (
              <DeviceSimulator
                deviceMode={deviceMode}
                setDeviceMode={setDeviceMode}
                orientation={orientation}
                setOrientation={setOrientation}
                zoom={zoom}
                setZoom={setZoom}
                themeMode={themeMode}
              >
                <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                  {renderCurrentPage()}
                </div>
              </DeviceSimulator>
            )}
          </main>
        </div>

        {/* Dedicated Separate Column for Dark Theme */}
        <DarkThemeColumn
          isOpen={isDarkThemeColumnOpen}
          onClose={() => setIsDarkThemeColumnOpen(false)}
          themeMode={themeMode}
          setThemeMode={setThemeMode}
          darkFlavor={darkFlavor}
          setDarkFlavor={setDarkFlavor}
          accentColor={accentColor}
          setAccentColor={setAccentColor}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
          oledMode={oledMode}
          setOledMode={setOledMode}
        />
      </div>

      {/* Floating Dark Theme Studio Pill Button (when column is closed) */}
      {!isDarkThemeColumnOpen && (
        <button
          onClick={() => setIsDarkThemeColumnOpen(true)}
          className="fixed bottom-5 right-5 z-40 px-3.5 py-2 rounded-full bg-slate-900 border border-indigo-500/40 text-slate-200 text-xs font-medium shadow-2xl hover:scale-105 transition-all flex items-center gap-2 backdrop-blur group"
          title="Open Dedicated Dark Theme Column"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span>Dark Theme Column</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono">
            STUDIO
          </span>
        </button>
      )}

      {/* Toast Notification Alert */}
      {toastText && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white border border-slate-700 shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(p) => setCurrentPage(p)}
        onShowToast={showToast}
      />

      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onSelectAction={handleQuickActionSelect}
      />

      <AddContactModal
        isOpen={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        onAddContact={handleAddContact}
      />

      <CreateCampaignModal
        isOpen={isCreateCampaignOpen}
        onClose={() => setIsCreateCampaignOpen(false)}
        onAddCampaign={handleAddCampaign}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onAddEvent={handleAddEvent}
      />

      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        onSavePlan={handleSavePlan}
        editingPlan={editingPlan}
      />
    </div>
  );
}
