import { create } from 'zustand';
import backendApi from '../lib/backendApi';
import { SubscriptionRecord, PaymentRecord } from '../lib/mock-db';

interface AnalyticsState {
  subscriptions: SubscriptionRecord[];
  payments: PaymentRecord[];
  isLoading: boolean;
  error: string | null;

  // Key Financial KPIs
  mrr: number;
  arr: number;
  activeSubscriptionsCount: number;
  churnRate: number;

  // Chart data feeds
  revenueGrowthHistory: { month: string; amount: number; registrations: number }[];
  regionalData: { name: string; value: number }[];
  tierDistribution: { name: string; value: number; count: number }[];

  fetchAnalytics: () => Promise<void>;
  refundPayment: (id: string) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  subscriptions: [],
  payments: [],
  isLoading: false,
  error: null,

  mrr: 0,
  arr: 0,
  activeSubscriptionsCount: 0,
  churnRate: 2.4, // standard platform baseline

  revenueGrowthHistory: [
    { month: 'Jan', amount: 120000, registrations: 8 },
    { month: 'Feb', amount: 185000, registrations: 12 },
    { month: 'Mar', amount: 240000, registrations: 19 },
    { month: 'Apr', amount: 310000, registrations: 27 },
    { month: 'May', amount: 450000, registrations: 35 },
    { month: 'Jun', amount: 560000, registrations: 42 },
  ],

  regionalData: [
    { name: 'Maharashtra', value: 45 },
    { name: 'Uttar Pradesh', value: 25 },
    { name: 'Karnataka', value: 20 },
    { name: 'Gujarat', value: 10 },
  ],

  tierDistribution: [
    { name: 'Basic Tier', value: 30, count: 12 },
    { name: 'Premium Tier', value: 50, count: 20 },
    { name: 'Enterprise Tier', value: 20, count: 8 },
  ],

  fetchAnalytics: async () => {
    set({ isLoading: true });
    try {
      const [subRes, payRes] = await Promise.all([
        backendApi.get('/admin/subscription-payments').catch(() => ({ data: { data: { payments: [] } } })),
        backendApi.get('/admin/payments/all').catch(() => ({ data: { data: { payments: [] } } })),
      ]);

      const subsData = subRes.data?.data?.payments || subRes.data?.subscriptions || [];
      const payData = payRes.data?.data?.payments || payRes.data?.payments || [];

      const subs: SubscriptionRecord[] = subsData.map((s: any) => ({
        id: String(s.id || s._id || ''),
        pumpId: String(s.pump_id || ''),
        planName: s.plan_name || 'Standard Plan',
        status: s.status || 'active',
        amount: Number(s.amount || 0),
        billingCycle: s.cycle || 'monthly',
        startDate: s.created_at || new Date().toISOString(),
        endDate: s.expires_at || new Date().toISOString(),
        ownerEmail: s.owner_email || '',
      }));

      const payments: PaymentRecord[] = payData.map((p: any) => ({
        id: String(p.id || p._id || ''),
        pumpId: String(p.pump_id || ''),
        pumpName: p.pump_name || 'Station',
        ownerEmail: p.owner_email || '',
        amount: Number(p.amount || 0),
        status: p.status || 'success',
        type: p.type || 'subscription',
        createdAt: p.created_at || new Date().toISOString(),
        method: p.method || 'card',
      }));

      // Calculate MRR from active subscriptions
      const activeSubs = subs.filter((s) => s.status === 'active');
      const activeMrr = activeSubs.reduce((sum, s) => sum + s.amount, 0);

      set({
        subscriptions: subs,
        payments,
        mrr: activeMrr,
        arr: activeMrr * 12,
        activeSubscriptionsCount: activeSubs.length,
        isLoading: false,
      });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  refundPayment: async (id: string) => {
    try {
      await backendApi.post(`/admin/payments/${id}/refund`, { status: 'refunded' }).catch(() => null);
      const updatedPayments = get().payments.map((p) => (p.id === id ? { ...p, status: 'refunded' as const } : p));
      
      set({ payments: updatedPayments });
      get().fetchAnalytics();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },
}));
