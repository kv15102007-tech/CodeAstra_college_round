import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  TrendingUp,
  CheckCircle2,
  Download,
  Check,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { Plan, Transaction } from '../../types';

interface BillingPageProps {
  plans: Plan[];
  transactions: Transaction[];
  onOpenCreatePlan: () => void;
  onEditPlan: (plan: Plan) => void;
  onShowToast: (msg: string) => void;
  currency: 'INR' | 'USD' | 'EUR';
  setCurrency: (c: 'INR' | 'USD' | 'EUR') => void;
}

export const BillingPage: React.FC<BillingPageProps> = ({
  plans,
  transactions,
  onOpenCreatePlan,
  onEditPlan,
  onShowToast,
  currency,
  setCurrency,
}) => {
  const currencySymbols = { INR: '₹', USD: '$', EUR: '€' };
  const currencyMultiplier = { INR: 1, USD: 0.012, EUR: 0.011 };

  const sym = currencySymbols[currency];
  const mult = currencyMultiplier[currency];

  const formatPrice = (amountINR: number) => {
    const converted = Math.round(amountINR * mult);
    return `${sym}${converted.toLocaleString()}`;
  };

  const exportPaymentsCSV = () => {
    const rows = [
      ['Customer', 'Date', 'Plan', 'Status', 'Amount'],
      ...transactions.map((tx) => [tx.customer, tx.date, tx.plan, tx.status, formatPrice(tx.amount)]),
    ];
    const csvContent = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nexus-transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    onShowToast(`Exported ${transactions.length} transactions to CSV`);
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500 tracking-wider uppercase mb-1">
            <span>Recurring Revenue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Subscriptions & Billing
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure subscription tiers, monitor MRR, and review transaction ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            {(['INR', 'USD', 'EUR'] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  currency === c
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenCreatePlan}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Plan</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Monthly Recurring Revenue</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
              {sym}
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {formatPrice(846500)}
          </div>
          <span className="text-[11px] text-emerald-500 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>↗ 9.3% month over month</span>
          </span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Active Subscriptions</span>
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            846
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Across {plans.length} active plans</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Payment Success Rate</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            97.8%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Past 30 days processing</span>
        </div>
      </div>

      {/* Plans Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Available Plans
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configured customer tiers and entitlements
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            return (
              <div
                key={plan.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  plan.isPopular
                    ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/30 shadow-lg'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-500 dark:text-indigo-400">
                      {plan.badge}
                    </span>
                    {plan.isPopular && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500 text-white font-semibold">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {plan.description}
                  </p>

                  <div className="my-5 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans tabular-nums">
                      {formatPrice(plan.price)}
                    </span>
                    <span className="text-xs text-slate-400">{plan.cadence}</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => onEditPlan(plan)}
                    className={`w-full py-2 rounded-xl text-xs font-semibold transition-all ${
                      plan.isPopular
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    Edit Plan Settings
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Transactions
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest payment activity and receipts
            </p>
          </div>
          <button
            onClick={exportPaymentsCSV}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {tx.customer}
                  </td>
                  <td className="py-3 px-4 text-slate-400">{tx.date}</td>
                  <td className="py-3 px-4">{tx.plan}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        tx.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          tx.status === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                    {formatPrice(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
