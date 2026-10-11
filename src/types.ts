export type PageId =
  | 'overview'
  | 'website'
  | 'crm'
  | 'billing'
  | 'marketing'
  | 'webinars'
  | 'agent'
  | 'analytics'
  | 'settings';

export type DeviceMode = 'full' | 'laptop' | 'tablet' | 'mobile' | 'comparison';
export type DeviceOrientation = 'portrait' | 'landscape';

export type ThemeMode = 'dark' | 'light' | 'dual';
export type DarkFlavor = 'obsidian' | 'midnight' | 'emerald' | 'sunset';

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'Customer' | 'New lead' | 'Prospect';
  lastContact: string;
  value: string;
  avatarColor: string;
}

export interface Plan {
  id: string;
  name: string;
  badge: string;
  price: number;
  cadence: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface Transaction {
  id: string;
  customer: string;
  date: string;
  plan: string;
  status: 'Paid' | 'Pending' | 'Failed';
  amount: number;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  channel: 'Email' | 'WhatsApp' | 'SMS' | 'In-App';
  status: 'Sent' | 'Scheduled' | 'Draft';
  recipients: number | null;
  openRate: string;
  clickRate: string;
  date: string;
}

export interface WebinarEvent {
  id: string;
  title: string;
  date: string; // ISO or formatted
  day: string;
  month: string;
  time: string;
  duration: string;
  type: 'LIVE WEBINAR' | 'WORKSHOP' | 'COMMUNITY';
  typeColor: 'indigo' | 'emerald' | 'amber';
  registeredCount: number;
  maxCapacity: number;
  userRegistered: boolean;
  speakers: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  actionStaged?: string;
}

export interface WorkflowPermission {
  id: string;
  title: string;
  description: string;
  icon: string;
  enabled: boolean;
}

export interface WorkflowItem {
  id: string;
  code: string;
  title: string;
  action: string;
  status: 'Review' | 'Done' | 'Draft' | 'Approved';
  date: string;
}

export interface WorkspaceSettings {
  name: string;
  businessEmail: string;
  timezone: string;
  currency: 'INR' | 'USD' | 'EUR';
  requireApproval: boolean;
  twoFactorAuth: boolean;
  weeklySummary: boolean;
}
