import React, { useState } from 'react';
import {
  X,
  Search,
  Plus,
  Mail,
  Users,
  Globe,
  Calendar,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import { Contact, Campaign, WebinarEvent, Plan, PageId } from '../../types';

// 1. Search Modal (Command Palette)
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
  onShowToast: (msg: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onShowToast,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const items = [
    { label: 'Website Builder & Live Preview', page: 'website' as PageId, icon: <Globe className="w-4 h-4" /> },
    { label: 'CRM & Contacts Directory', page: 'crm' as PageId, icon: <Users className="w-4 h-4" /> },
    { label: 'Subscriptions, Pricing & MRR', page: 'billing' as PageId, icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Marketing Email Campaigns', page: 'marketing' as PageId, icon: <Mail className="w-4 h-4" /> },
    { label: 'Webinars & Community Events', page: 'webinars' as PageId, icon: <Calendar className="w-4 h-4" /> },
    { label: 'AI Business Agent Copilot', page: 'agent' as PageId, icon: <Sparkles className="w-4 h-4" /> },
    { label: 'Workspace Preferences & Security', page: 'settings' as PageId, icon: <Search className="w-4 h-4" /> },
  ];

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-24 p-4 z-50">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-3 border-b border-slate-800 flex items-center gap-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or jump to page..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
          >
            ESC
          </button>
        </div>

        <div className="p-2 max-h-72 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No matching pages found for "{query}".
            </div>
          ) : (
            filtered.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigate(item.page);
                  onClose();
                  onShowToast(`Navigated to ${item.label}`);
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800 text-left text-xs text-slate-300 hover:text-white transition-colors"
              >
                <div className="text-indigo-400">{item.icon}</div>
                <span className="flex-1 font-medium">{item.label}</span>
                <span className="text-[10px] text-slate-500 font-mono">Jump ↵</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// 2. Quick Action Modal
interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'contact' | 'campaign' | 'event' | 'website') => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const actions = [
    { id: 'contact' as const, title: 'Add a new contact', desc: 'Capture lead or customer profile in CRM', icon: <Users className="w-5 h-5 text-indigo-400" /> },
    { id: 'campaign' as const, title: 'Launch marketing campaign', desc: 'Draft and schedule automated message broadcast', icon: <Mail className="w-5 h-5 text-amber-400" /> },
    { id: 'event' as const, title: 'Schedule a webinar or workshop', desc: 'Set up live session and open public registrations', icon: <Calendar className="w-5 h-5 text-emerald-400" /> },
    { id: 'website' as const, title: 'Edit website pages', desc: 'Update headlines and test multi-device responsiveness', icon: <Globe className="w-5 h-5 text-cyan-400" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Quick Action</h3>
            <p className="text-xs text-slate-400">Choose what you want to create.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 pt-1">
          {actions.map((act) => (
            <button
              key={act.id}
              onClick={() => {
                onSelectAction(act.id);
                onClose();
              }}
              className="w-full flex items-center gap-3.5 p-3 rounded-xl border border-slate-800 bg-slate-800/40 hover:bg-slate-800 hover:border-slate-700 text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {act.icon}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white block">
                  {act.title}
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {act.desc}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// 3. Add Contact Modal
interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (contact: Contact) => void;
}

export const AddContactModal: React.FC<AddContactModalProps> = ({
  isOpen,
  onClose,
  onAddContact,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState<Contact['status']>('New lead');
  const [value, setValue] = useState('₹12,000');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors = [
      'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20',
      'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
      'bg-amber-500/15 text-amber-400 border border-amber-500/20',
      'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20',
      'bg-rose-500/15 text-rose-400 border border-rose-500/20',
    ];

    const newContact: Contact = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      company: company.trim() || 'Independent',
      status,
      lastContact: 'Just now',
      value: value.trim() || '₹0',
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    };

    onAddContact(newContact);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Add Contact to CRM</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Aditi Rao"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <input
              type="email"
              placeholder="aditi@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Company</label>
            <input
              type="text"
              placeholder="e.g. Rao Creative"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="New lead">New lead</option>
                <option value="Prospect">Prospect</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Expected Value</label>
              <input
                type="text"
                placeholder="₹12,000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            >
              Save Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 4. Create Campaign Modal
interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCampaign: (campaign: Campaign) => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onAddCampaign,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [channel, setChannel] = useState<Campaign['channel']>('Email');
  const [status, setStatus] = useState<Campaign['status']>('Scheduled');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCampaign: Campaign = {
      id: `cmp-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || 'Marketing broadcast',
      channel,
      status,
      recipients: 1500,
      openRate: '—',
      clickRate: '—',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    onAddCampaign(newCampaign);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Create Marketing Campaign</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Campaign Title</label>
            <input
              required
              type="text"
              placeholder="e.g. Q4 Executive Product Digest"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Target Description / Copy</label>
            <textarea
              rows={3}
              placeholder="Summary of promotional offer or announcement..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Channel</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none"
              >
                <option value="Email">Email Broadcast</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="SMS">SMS Text</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Schedule Mode</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none"
              >
                <option value="Scheduled">Scheduled for later</option>
                <option value="Sent">Send immediately</option>
                <option value="Draft">Save draft</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            >
              Launch Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 5. Create Event Modal
interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEvent: (event: WebinarEvent) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onAddEvent,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<WebinarEvent['type']>('LIVE WEBINAR');
  const [date, setDate] = useState('2026-10-30');
  const [time, setTime] = useState('5:00 PM IST');
  const [duration, setDuration] = useState('60 mins');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedDate = new Date(date);
    const day = String(parsedDate.getDate() || 30).padStart(2, '0');
    const month = parsedDate.toLocaleString('en', { month: 'short' }).toUpperCase() || 'OCT';

    const newEvent: WebinarEvent = {
      id: `ev-${Date.now()}`,
      title: title.trim(),
      date,
      day,
      month,
      time,
      duration,
      type,
      typeColor: type === 'LIVE WEBINAR' ? 'indigo' : type === 'WORKSHOP' ? 'emerald' : 'amber',
      registeredCount: 1,
      maxCapacity: 150,
      userRegistered: true,
      speakers: ['Karthik V.'],
    };

    onAddEvent(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Create Webinar or Event</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Event Title</label>
            <input
              required
              type="text"
              placeholder="e.g. Masterclass: Scaling with AI Agents"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Event Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none"
              >
                <option value="LIVE WEBINAR">Live Webinar</option>
                <option value="WORKSHOP">Hands-on Workshop</option>
                <option value="COMMUNITY">Community Roundtable</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Event Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            >
              Publish Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 6. Create / Edit Plan Modal
interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlan: (plan: Plan) => void;
  editingPlan?: Plan | null;
}

export const PlanModal: React.FC<PlanModalProps> = ({
  isOpen,
  onClose,
  onSavePlan,
  editingPlan,
}) => {
  const [name, setName] = useState(editingPlan ? editingPlan.name : '');
  const [price, setPrice] = useState(editingPlan ? String(editingPlan.price) : '1999');
  const [description, setDescription] = useState(editingPlan ? editingPlan.description : '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const planToSave: Plan = {
      id: editingPlan ? editingPlan.id : `plan-${Date.now()}`,
      name: name.trim(),
      badge: editingPlan ? editingPlan.badge : 'TIER',
      price: Number(price) || 1999,
      cadence: '/ month',
      description: description.trim() || 'Tailored subscription plan',
      features: editingPlan ? editingPlan.features : [
        'Website and lead management',
        'Automated workflows & billing',
        'Standard customer support',
      ],
      isPopular: editingPlan ? editingPlan.isPopular : false,
    };

    onSavePlan(planToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            {editingPlan ? `Edit ${editingPlan.name} Plan` : 'Create New Plan'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Plan Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Enterprise Plus"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Monthly Price (INR ₹)</label>
            <input
              required
              type="number"
              placeholder="1999"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Short Description</label>
            <textarea
              rows={2}
              placeholder="Target audience and primary benefits..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-700 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
            >
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
