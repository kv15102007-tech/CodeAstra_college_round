import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  Compass,
  ArrowRight,
  Sparkles,
  Sliders,
  DollarSign,
} from 'lucide-react';

interface AnalyticsPageProps {
  onShowToast: (msg: string) => void;
  currencySymbol: string;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  onShowToast,
  currencySymbol,
}) => {
  // Forecaster Simulator State
  const [leadVolume, setLeadVolume] = useState<number>(1500);
  const [conversionRate, setConversionRate] = useState<number>(8.5);
  const [averageOrderValue, setAverageOrderValue] = useState<number>(1499);

  const projectedNewCustomers = Math.round((leadVolume * (conversionRate / 100)));
  const projectedMRR = projectedNewCustomers * averageOrderValue;
  const projectedARR = projectedMRR * 12;

  const downloadReport = () => {
    const rows = [
      ['Metric', 'Value', 'Growth'],
      ['Gross Revenue', '₹4,82,650', '+12.8%'],
      ['Website Visitors', '18,420', '+6.5%'],
      ['Lead Conversion', '8.7%', '+1.4%'],
      ['Active Subscriptions', '846', '+5.2%'],
      ['Projected Annual ARR', `₹${projectedARR.toLocaleString()}`, 'Simulated'],
    ];
    const csvContent = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus-analytics-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast('Analytics report CSV downloaded');
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500 tracking-wider uppercase mb-1">
            <span>Measure What Matters</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Analytics & Growth
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Understand visitor acquisition, conversion funnel dynamics, and simulate revenue.
          </p>
        </div>

        <button
          onClick={downloadReport}
          className="self-start sm:self-auto px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Report</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Gross Revenue</span>
            <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold flex items-center justify-center">
              {currencySymbol}
            </span>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {currencySymbol}4,82,650
          </div>
          <span className="text-[11px] text-emerald-500 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>↗ 12.8% vs last month</span>
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Website Visitors</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            18,420
          </div>
          <span className="text-[11px] text-emerald-500 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>↗ 6.5% inbound traffic</span>
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Overall Conversion Rate</span>
            <Compass className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            8.7%
          </div>
          <span className="text-[11px] text-emerald-500 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>↗ 1.4% milestone reached</span>
          </span>
        </div>
      </div>

      {/* Grid: Traffic Sources Donut & Conversion Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Traffic Acquisition Channels
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Where your audience discovers your website
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
            {/* Donut graphic */}
            <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Organic Search: 42% (dasharray 42 58) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="14"
                  strokeDasharray="42 58"
                  strokeDashoffset="0"
                />
                {/* Direct: 28% (dasharray 28 72) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="14"
                  strokeDasharray="28 72"
                  strokeDashoffset="-42"
                />
                {/* Social: 18% (dasharray 18 82) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="14"
                  strokeDasharray="18 82"
                  strokeDashoffset="-70"
                />
                {/* Referral: 12% (dasharray 12 88) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="14"
                  strokeDasharray="12 88"
                  strokeDashoffset="-88"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-slate-900 dark:text-white font-sans tabular-nums">
                  18.4k
                </span>
                <span className="text-[10px] text-slate-400">Visitors</span>
              </div>
            </div>

            {/* Legend list */}
            <div className="space-y-2.5 w-full sm:w-auto">
              <div className="flex items-center justify-between gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="text-slate-600 dark:text-slate-300">Organic Search</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white font-mono">42%</span>
              </div>

              <div className="flex items-center justify-between gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">Direct Traffic</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white font-mono">28%</span>
              </div>

              <div className="flex items-center justify-between gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-slate-600 dark:text-slate-300">Social Media</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white font-mono">18%</span>
              </div>

              <div className="flex items-center justify-between gap-6 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <span className="text-slate-600 dark:text-slate-300">Partner Referral</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white font-mono">12%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Conversion Funnel Velocity
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Stage-by-stage progression from visitor to paying customer
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-600 dark:text-slate-300 font-medium">1. Website Visitors</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">18,420 (100%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-600 dark:text-slate-300 font-medium">2. Inbound Leads Captured</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">1,284 (7.0%)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '70%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-600 dark:text-slate-300 font-medium">3. Sales Qualified Prospects</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">326 (25.3% of leads)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-600 dark:text-slate-300 font-medium">4. Paid Subscriptions Started</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">112 (34.3% of qualified)</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '28%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unique Feature: Interactive Revenue Forecaster & Simulator */}
      <div className="p-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
              Unique Feature
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Interactive Growth & Revenue Simulator
            </h3>
            <p className="text-xs text-slate-300">
              Drag the assumptions to instantly model your upcoming Monthly MRR and Annual Run Rate (ARR).
            </p>
          </div>

          <div className="text-right bg-slate-950/60 p-3 rounded-xl border border-slate-800 shrink-0">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">Projected Annual ARR</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-sans tabular-nums">
              {currencySymbol}{projectedARR.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Slider 1: Lead Volume */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Monthly Inbound Leads</span>
              <span className="font-mono font-bold text-indigo-400 tabular-nums">{leadVolume.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="200"
              max="5000"
              step="50"
              value={leadVolume}
              onChange={(e) => setLeadVolume(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Range: 200 to 5,000 leads/mo</span>
          </div>

          {/* Slider 2: Conversion Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Lead Conversion Rate</span>
              <span className="font-mono font-bold text-cyan-400 tabular-nums">{conversionRate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              step="0.5"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">New customers: ~{projectedNewCustomers}</span>
          </div>

          {/* Slider 3: Average Order / Plan Price */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Average Plan ARPU</span>
              <span className="font-mono font-bold text-emerald-400 tabular-nums">{currencySymbol}{averageOrderValue}</span>
            </div>
            <input
              type="range"
              min="499"
              max="4999"
              step="100"
              value={averageOrderValue}
              onChange={(e) => setAverageOrderValue(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block">Projected MRR: {currencySymbol}{projectedMRR.toLocaleString()}/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
