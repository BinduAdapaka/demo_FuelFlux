import { create } from 'zustand';
import backendApi from '../lib/backendApi';
import { AuditLog, FraudAlert } from '../lib/mock-db';

interface AuditState {
  auditLogs: AuditLog[];
  fraudAlerts: FraudAlert[];
  isLoading: boolean;
  error: string | null;

  fetchAuditLogs: () => Promise<void>;
  fetchFraudAlerts: () => Promise<void>;
  resolveFraudAlert: (id: string, status: FraudAlert['status']) => Promise<void>;
}

export const useAuditStore = create<AuditState>((set, get) => ({
  auditLogs: [],
  fraudAlerts: [],
  isLoading: false,
  error: null,

  fetchAuditLogs: async () => {
    set({ isLoading: true });
    try {
      const res = await backendApi.get('/admin/audit-log');
      const rawLogs = res.data?.data?.logs || [];
      const logs: AuditLog[] = rawLogs.map((l: any) => ({
        id: String(l.id),
        action: l.action,
        admin_email: l.admin_email,
        admin_name: l.admin_email?.split('@')[0] || 'Admin',
        entity: l.target_type || 'System',
        entityId: l.target_id || '',
        timestamp: l.timestamp || new Date().toISOString(),
      }));
      set({ auditLogs: logs, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  fetchFraudAlerts: async () => {
    set({ isLoading: true });
    try {
      const res = await backendApi.get('/admin/fraud-alerts');
      set({ fraudAlerts: res.data.fraudAlerts, isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
    }
  },

  resolveFraudAlert: async (id, status) => {
    try {
      const res = await backendApi.patch(`/admin/fraud-alerts/${id}`, { status });
      const updatedAlerts = get().fraudAlerts.map((a) => (a.id === id ? res.data.alert : a));
      set({ fraudAlerts: updatedAlerts });
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },
}));
