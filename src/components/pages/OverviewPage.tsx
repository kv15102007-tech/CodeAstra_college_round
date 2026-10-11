import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  CreditCard,
  Send,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
  Globe,
  Clock,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { PageId } from '../../types';

interface OverviewPageProps {
  onNavigate: (page: PageId) => void;
  onOpenQuickAction: () => void;
  currencySymbol: string;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigate,
  onOpenQuickAction,
  currencySymbol,
}) => {
  const [period, setPeriod] = useState<'30' | '7' | '90'>('30');
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const revenueData = {
    '7': { value: `${currencySymbol}1,26,400`, change: '+4.2%', points: [30, 45, 60, 50, 75, 80, 95] },
    '30': { value: `${currencySymbol}4,82,650`, change: '+12.8%', points: [25, 40, 35, 55, 48, 70, 65, 85, 78, 100] },
    '90': { value: `${currencySymbol}14,20,800`, change: '+28.4%', points: [15, 30, 45, 40, 60, 55, 75, 80, 90, 100] },
  };

  const currentRevenue = revenueData[period];

  // SVG Chart points calculation
  const svgWidth = 620;
  const svgHeight = 180;
  const points = currentRevenue.points;
  const stepX = svgWidth / (points.length - 1);
  const pathD = points
    .map((p, i) => {
      const x = i * stepX;
      const y = svgHeight - (p / 100) * (svgHeight - 30) - 15;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  const areaD = `${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500 tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Good evening, Karthik <span className="text-indigo-400">✦</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here’s what’s happening across your business ecosystem today.
          </p>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          <span>＋ Quick action</span>
        </button>
      </div>

      {/* Hero Nexus AI Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 text-white overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 border border-white/15 text-[10px] font-semibold uppercase tracking-wider text-indigo-300">
            <Sparkles className="w-3 h-3 text-indigo-300" />
            <span>Nexus Unified Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            All moving parts, connected in one workspace.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Manage your website, CRM leads, recurring subscriptions, campaigns, and events without switching platforms.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('agent')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-300 hover:text-white transition-colors"
            >
              <span>Open Business AI Assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Section Heading & Period Filter */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Business Overview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Key operational metrics for this workspace
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          {(['7', '30', '90'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                period === p
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p === '7' ? '7 Days' : p === '30' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              {currencySymbol}
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white tabular-nums">
            {currentRevenue.value}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>{currentRevenue.change} vs prev period</span>
          </div>
          {/* Mini Sparkline */}
          <div className="mt-3 flex items-end gap-1 h-6">
            {currentRevenue.points.map((p, idx) => (
              <div
                key={idx}
                className="flex-1 bg-indigo-500/30 rounded-t hover:bg-indigo-500 transition-colors"
                style={{ height: `${p}%` }}
              />
            ))}
          </div>
        </div>

        {/* New Contacts */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>New Contacts</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white tabular-nums">
            1,284
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>↗ 8.4% growth</span>
          </div>
          <div className="mt-3 flex items-end gap-1 h-6">
            {[40, 55, 45, 65, 50, 75, 85, 90, 80, 100].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-cyan-500/30 rounded-t hover:bg-cyan-500 transition-colors"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Active Subscriptions</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white tabular-nums">
            846
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Monthly Target</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">72%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '72%' }} />
          </div>
        </div>

        {/* Campaign Engagement */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Campaign Engagement</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold font-sans tracking-tight text-slate-900 dark:text-white tabular-nums">
            24.6%
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Benchmark: 18.2%</span>
            <span className="text-emerald-500 font-semibold">+6.4%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '64%' }} />
          </div>
        </div>
      </div>

      {/* Grid: Revenue Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart (2 cols) */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Revenue Trajectory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive earnings trajectory over time
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400/40" />
                <span>Previous</span>
              </div>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative pt-2">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-48 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={svgHeight * pct}
                  x2={svgWidth}
                  y2={svgHeight * pct}
                  stroke="#334155"
                  strokeOpacity="0.2"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Area fill */}
              <path d={areaD} fill="url(#chartGradient)" />

              {/* Trajectory line */}
              <path
                d={pathD}
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {points.map((p, idx) => {
                const x = idx * stepX;
                const y = svgHeight - (p / 100) * (svgHeight - 30) - 15;
                const isHovered = hoveredPoint === idx;
                return (
                  <g key={idx} onMouseEnter={() => setHoveredPoint(idx)} onMouseLeave={() => setHoveredPoint(null)}>
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 6 : 3.5}
                      className="fill-indigo-500 stroke-white dark:stroke-slate-900 transition-all cursor-pointer"
                      strokeWidth={isHovered ? 2.5 : 1.5}
                    />
                    {isHovered && (
                      <text
                        x={x}
                        y={y - 10}
                        textAnchor="middle"
                        className="text-[10px] font-mono fill-indigo-400 font-bold"
                      >
                        {p}%
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
              <span>W5</span>
              <span>W6</span>
              <span>W7</span>
              <span>W8</span>
            </div>
          </div>
        </div>

        {/* Recent Activity (1 col) */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Live Activity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Real-time workspace events
              </p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-indigo-500 hover:text-indigo-400 font-medium"
            >
              View all →
            </button>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  New Pro Subscription
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Priya Sharma upgraded to Pro monthly
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">12 mins ago</span>
              </div>
              <span className="text-xs font-semibold text-emerald-500 tabular-nums">+₹1,499</span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Send className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Campaign Dispatched
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  October product update · 2,450 recipients
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">1 hr ago</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Sent
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  New Inbound Lead
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Rahul Mehta · Website contact form
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">3 hrs ago</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Lead
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Webinar Registration
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Designing with AI · 18 new sign-ups
                </p>
                <span className="text-[10px] text-slate-400 block mt-0.5">5 hrs ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Next Steps Actions */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Your Next Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate('website')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-indigo-500/50 hover:shadow-md transition-all text-left flex items-start gap-3.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Build your website
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Customize pages, test multi-device responsiveness & publish
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('crm')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-indigo-500/50 hover:shadow-md transition-all text-left flex items-start gap-3.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Manage your contacts
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Organize leads, follow up and export CSV customer ledgers
              </p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('marketing')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 hover:border-indigo-500/50 hover:shadow-md transition-all text-left flex items-start gap-3.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Send className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  Launch a campaign
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Reach targeted customer segments with automated emails
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
