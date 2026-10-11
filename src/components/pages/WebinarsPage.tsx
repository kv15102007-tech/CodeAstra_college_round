import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Users,
  Clock,
  CheckCircle2,
  Share2,
  Video,
} from 'lucide-react';
import { WebinarEvent } from '../../types';

interface WebinarsPageProps {
  events: WebinarEvent[];
  onToggleRegister: (id: string) => void;
  onOpenCreateModal: () => void;
  onShowToast: (msg: string) => void;
}

export const WebinarsPage: React.FC<WebinarsPageProps> = ({
  events,
  onToggleRegister,
  onOpenCreateModal,
  onShowToast,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const getTypeBadge = (type: WebinarEvent['type'], color: WebinarEvent['typeColor']) => {
    const colorClasses = {
      indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    };

    return (
      <span
        className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full border uppercase ${colorClasses[color]}`}
      >
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500 tracking-wider uppercase mb-1">
            <span>Live Experiences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Webinars & Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Schedule workshops, manage RSVPs, host livestreams, and follow up with attendees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Calendar
            </button>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Registrations</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            1,642
          </div>
          <span className="text-[11px] text-emerald-500 font-medium mt-1 block">↗ 18.6% this month</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Average Show-Up Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            72.4%
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Across past 10 sessions</span>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Upcoming Scheduled</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums">
            {events.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Next 30 days</span>
        </div>
      </div>

      {/* List / Calendar View */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Upcoming Events Schedule
          </h2>

          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/40 transition-colors"
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Date badge */}
                  <div className="w-14 h-14 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl font-bold font-sans leading-none">{ev.day}</span>
                    <span className="text-[10px] font-bold tracking-wider uppercase mt-0.5">{ev.month}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getTypeBadge(ev.type, ev.typeColor)}
                      <span className="text-xs text-slate-400">· {ev.time} ({ev.duration})</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {ev.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-slate-900 bg-indigo-500 text-[9px] text-white font-bold text-center leading-5">PS</div>
                        <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-slate-900 bg-emerald-500 text-[9px] text-white font-bold text-center leading-5">RM</div>
                        <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-slate-900 bg-amber-500 text-[9px] text-white font-bold text-center leading-5">AK</div>
                      </div>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {ev.registeredCount} / {ev.maxCapacity} registered
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://nexus.events/${ev.id}`);
                      onShowToast('Invite link copied to clipboard!');
                    }}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Share event link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onToggleRegister(ev.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      ev.userRegistered
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                    }`}
                  >
                    {ev.userRegistered ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Registered</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-3.5 h-3.5" />
                        <span>RSVP / Register</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Calendar month view */
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              October 2026 Schedule
            </h3>
            <span className="text-xs text-slate-400">IST (UTC+5:30)</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
              <div key={d} className="p-2 font-bold text-slate-400 uppercase text-[10px]">
                {d}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const hasEvent = events.some((e) => parseInt(e.day) === day);
              return (
                <div
                  key={day}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    hasEvent
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 font-bold ring-1 ring-indigo-500/20'
                      : 'border-slate-100 dark:border-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <span>{day}</span>
                  {hasEvent && (
                    <span className="block text-[9px] font-normal truncate mt-1 text-indigo-300">
                      Live
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
