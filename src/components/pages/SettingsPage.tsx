import React from 'react';
import {
  Settings,
  Shield,
  Layers,
  Save,
  CheckCircle2,
  Globe,
  Users,
  Send,
  CreditCard,
  Sparkles,
  Download,
  FileCode,
} from 'lucide-react';
import { WorkspaceSettings } from '../../types';

interface SettingsPageProps {
  settings: WorkspaceSettings;
  onUpdateSettings: (newSettings: Partial<WorkspaceSettings>) => void;
  onSave: () => void;
  onShowToast: (msg: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onSave,
  onShowToast,
}) => {
  const handleDownloadZip = async () => {
    try {
      onShowToast('Preparing ZIP download...');
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
      onShowToast('ZIP downloaded successfully!');
    } catch (err) {
      console.error('Download error:', err);
      const link = document.createElement('a');
      link.href = '/nexus-workspace.zip';
      link.download = 'nexus-workspace.zip';
      link.click();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title & Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500 tracking-wider uppercase mb-1">
            <span>Workspace Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Settings & Security
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure branding, defaults, multi-factor security, and integrated modules.
          </p>
        </div>

        <button
          onClick={onSave}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Workspace Profile */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Workspace Identity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Basic brand details displayed across your organization
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Workspace Brand Name
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => onUpdateSettings({ name: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Primary Business Email
            </label>
            <input
              type="email"
              value={settings.businessEmail}
              onChange={(e) => onUpdateSettings({ businessEmail: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Default Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => onUpdateSettings({ timezone: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option>Asia/Kolkata (IST - UTC+5:30)</option>
              <option>America/New_York (EST - UTC-5:00)</option>
              <option>Europe/London (GMT - UTC+0:00)</option>
              <option>America/Los_Angeles (PST - UTC-8:00)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Default Currency Symbol
            </label>
            <select
              value={settings.currency}
              onChange={(e) => onUpdateSettings({ currency: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="INR">INR — Indian Rupee (₹)</option>
              <option value="USD">USD — US Dollar ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
            </select>
          </div>
        </div>

        {/* Security & Approvals */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Security & Guardrails
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Protection for sensitive operational changes
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="pr-3">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Require Human Approval
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Publishing, campaign broadcast, and plan edits
                </span>
              </div>
              <button
                onClick={() => onUpdateSettings({ requireApproval: !settings.requireApproval })}
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                  settings.requireApproval ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.requireApproval ? 'left-4.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="pr-3">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Two-Step Verification (2FA)
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Require authentication app code on administrator logins
                </span>
              </div>
              <button
                onClick={() => onUpdateSettings({ twoFactorAuth: !settings.twoFactorAuth })}
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                  settings.twoFactorAuth ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.twoFactorAuth ? 'left-4.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="pr-3">
                <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                  Weekly Executive Digest
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Receive Monday morning performance summaries
                </span>
              </div>
              <button
                onClick={() => onUpdateSettings({ weeklySummary: !settings.weeklySummary })}
                className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                  settings.weeklySummary ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                    settings.weeklySummary ? 'left-4.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Project Source Code Download */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <div className="flex items-center gap-2.5">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                    Source Code Archive
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    Full React + TypeScript + Express project
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadZip}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ZIP</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Connected Modules Section */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Connected Platform Modules
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Nexus ecosystem applications enabled for this workspace
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                Website Builder
              </span>
              <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                CRM & Contacts
              </span>
              <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                Marketing
              </span>
              <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-semibold text-slate-900 dark:text-white block truncate">
                Subscriptions
              </span>
              <span className="text-[10px] text-emerald-500 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
