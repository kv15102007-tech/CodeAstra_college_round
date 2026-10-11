import React, { useState } from 'react';
import {
  Send,
  Plus,
  Mail,
  TrendingUp,
  Clock,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { Campaign } from '../../types';

interface MarketingPageProps {
  campaigns: Campaign[];
  onAddCampaign: (campaign: Campaign) => void;
  onOpenCreateModal: () => void;
  onShowToast: (msg: string) => void;
}

export const MarketingPage: React.FC<MarketingPageProps> = ({
  campaigns,
  onAddCampaign,
  onOpenCreateModal,
  onShowToast,
}) => {
  const [filter, setFilter] = useState<'All' | 'Sent' | 'Scheduled' | 'Draft'>('All');
  const [quickSubject, setQuickSubject] = useState('');
  const [quickMessage, setQuickMessage] = useState('');

  const filteredCampaigns = campaigns.filter(
    (c) => filter === 'All' || c.status === filter
  );

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSubject.trim()) {
      onShowToast('Please enter a campaign subject line');
      return;
    }

    const newCmp: Campaign = {
      id: `cmp-${Date.now()}`,
      title: quickSubject.trim(),
      description: quickMessage.trim() || 'New campaign draft',
      channel: 'Email',
      status: 'Draft',
      recipients: null,
      openRate: '—',
      clickRate: '—',
      date: 'Not scheduled',
    };

    onAddCampaign(newCmp);
    setQuickSubject('');
    setQuickMessage('');
    onShowToast(`Draft "${newCmp.title}" saved to campaign ledger`);
  };

  const getStatusBadge = (status: Campaign['status']) => {
    switch (status) {
      case 'Sent':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Sent
          </span>
        );
      case 'Scheduled':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Scheduled
          </span>
        );
      case 'Draft':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Draft
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500 tracking-wider uppercase mb-1">
            <span>Reach Your Audience</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Marketing Automation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Draft personalized email broadcasts, review open rates, and engage segments.
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Campaigns Sent</span>
            <Mail className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            18
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active this month</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Average Open Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            24.6%
          </div>
          <span className="text-[11px] text-emerald-500 font-medium mt-1 block">↗ 3.1% vs last month</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Click-Through Rate</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            6.8%
          </div>
          <span className="text-[11px] text-emerald-500 font-medium mt-1 block">↗ 1.2% industry avg</span>
        </div>
      </div>

      {/* Campaigns Table Panel */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              All Campaigns
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Measure delivery, engagement and conversions
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            {(['All', 'Sent', 'Scheduled', 'Draft'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filter === st
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Recipients</th>
                <th className="py-3 px-4 text-right">Open Rate</th>
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {filteredCampaigns.map((cmp) => (
                <tr key={cmp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {cmp.title}
                    </span>
                    <span className="text-[11px] text-slate-400 block truncate max-w-xs">
                      {cmp.description}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-300">
                    {cmp.channel}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(cmp.status)}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">
                    {cmp.recipients ? cmp.recipients.toLocaleString() : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                    {cmp.openRate}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400">{cmp.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Campaign Draft Composer */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs max-w-2xl space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Quick Campaign Composer
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Draft a quick broadcast message directly into your queue
          </p>
        </div>

        <form onSubmit={handleSaveDraft} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Subject Line
            </label>
            <input
              type="text"
              placeholder="e.g. Special Announcement: Q4 Masterclass..."
              value={quickSubject}
              onChange={(e) => setQuickSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1">
              Body Message
            </label>
            <textarea
              rows={3}
              placeholder="Write a warm note for your subscribed audience..."
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Save Draft to Queue
          </button>
        </form>
      </div>
    </div>
  );
};
