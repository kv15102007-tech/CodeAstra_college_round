import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  RotateCcw,
  Shield,
  CheckCircle2,
  Clock,
  ArrowRight,
  Bot,
  User,
  Layers,
  FileCheck,
} from 'lucide-react';
import { ChatMessage, WorkflowPermission, WorkflowItem } from '../../types';

interface AgentPageProps {
  permissions: WorkflowPermission[];
  onTogglePermission: (id: string) => void;
  workflows: WorkflowItem[];
  onApproveWorkflow: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const AgentPage: React.FC<AgentPageProps> = ({
  permissions,
  onTogglePermission,
  workflows,
  onApproveWorkflow,
  onShowToast,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: "Hi Karthik — I'm your Nexus Business Copilot. I analyze performance across your website, CRM leads, marketing campaigns, subscriptions, and events. What goal would you like to plan or execute today?",
      timestamp: '12:00 PM',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const suggestions = [
    'Prepare a product launch',
    'Follow up with new leads',
    'Summarize business performance',
    'Optimize website hero copy',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: `Workspace: Acme Studio. Active permissions: ${permissions
            .filter((p) => p.enabled)
            .map((p) => p.title)
            .join(', ')}.`,
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I've reviewed your request and staged the action.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      // Deterministic fallback response if offline or backend route error
      let fallback = "I've synthesized your action plan. Next steps:\n\n1. Review qualified leads in CRM table.\n2. Dispatch personalized follow-up sequences.\n3. Track conversion updates in Analytics.";
      const lower = text.toLowerCase();
      if (lower.includes('launch') || lower.includes('product')) {
        fallback = "🚀 Product Launch Orchestration:\n\n1. Website Builder: Update the hero headline and activate launch accent theme.\n2. CRM: Filter 326 qualified prospects for VIP invitations.\n3. Marketing: Schedule the 3-part automated email broadcast.\n4. Webinars: Schedule a live demo for launch day.\n5. Analytics: Track conversion funnel to ensure ARR growth.";
      } else if (lower.includes('lead') || lower.includes('follow up')) {
        fallback = "📋 Lead Follow-up Protocol:\n\n1. Filter Rahul Mehta and Neha Gupta in CRM.\n2. Send introductory demo scheduling links.\n3. Flag in CRM as In-Review with automated reminder for day 3.";
      } else if (lower.includes('performance') || lower.includes('revenue') || lower.includes('summary')) {
        fallback = "📊 Business Snapshot:\n\n• Revenue: ₹4,82,650 (+12.8%)\n• Active Subscriptions: 846 accounts\n• Campaign Open Rate: 24.6% (above industry benchmark)\n• Recommendation: Scale qualified lead conversion to accelerate Pro tier signups.";
      } else if (lower.includes('copy') || lower.includes('hero')) {
        fallback = "✨ Recommended Website Copy Options:\n\nOption A: \"Transform Bold Visions into Enterprise Results.\"\nOption B: \"The Unified Operating System for Modern Creators.\"\nOption C: \"Automate Growth Across Your Entire Business Stack.\"\n\nYou can apply any of these inside the Website Builder tab!";
      }

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'm-init',
        sender: 'assistant',
        text: 'Chat cleared. How can I assist with your workspace today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    onShowToast('Assistant history cleared');
  };

  return (
    <div className="space-y-6">
      {/* Title & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500 tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Autonomous Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI Business Agent
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Delegate cross-module tasks, generate strategic copy, and orchestrate approval pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 3.8 Copilot Engine</span>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Chat Console (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs flex flex-col h-[600px] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-indigo-500/20">
                ✧
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Nexus Assistant</h3>
                <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Ready to assist
                </span>
              </div>
            </div>

            <button
              onClick={handleClear}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                      isAssistant
                        ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold'
                    }`}
                  >
                    {isAssistant ? <Sparkles className="w-3.5 h-3.5" /> : 'KV'}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed space-y-1.5 ${
                      isAssistant
                        ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60'
                        : 'bg-indigo-600 text-white shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                    <span
                      className={`text-[9px] block ${
                        isAssistant ? 'text-slate-400' : 'text-indigo-200 text-right'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xs animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <span>Synthesizing workspace actions...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="p-2 px-4 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/20 flex gap-2 overflow-x-auto">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(s)}
                className="px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900"
          >
            <input
              type="text"
              placeholder="Ask Nexus to automate, summarize, or draft copy..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputVal.trim() || loading}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right: Permissions & Approvals (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Permissions Panel */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Workflow Guardrails
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Control autonomous actions allowed by the assistant
                </p>
              </div>
              <Shield className="w-4 h-4 text-indigo-400" />
            </div>

            <div className="space-y-3">
              {permissions.map((perm) => (
                <div
                  key={perm.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                      {perm.title}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                      {perm.description}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      onTogglePermission(perm.id);
                      onShowToast(`Updated permission for ${perm.title}`);
                    }}
                    className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${
                      perm.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                        perm.enabled ? 'left-4.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Planned Workflows Queue */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Human-in-the-Loop Approvals
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Staged drafts requiring explicit admin approval
              </p>
            </div>

            <div className="space-y-3">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {wf.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {wf.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {wf.action}
                    </p>
                    <span className="text-[10px] text-slate-400 block">{wf.date}</span>
                  </div>

                  {wf.status === 'Review' ? (
                    <button
                      onClick={() => {
                        onApproveWorkflow(wf.id);
                        onShowToast(`Approved and dispatched ${wf.title}`);
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shrink-0"
                    >
                      Approve
                    </button>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                      Completed
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
