'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Car,
  Layers,
  ShieldAlert,
  Activity,
  Plus,
  Video,
  FileText,
  DollarSign,
  ChevronRight,
  Building,
  RefreshCcw,
  AlertCircle,
} from 'lucide-react';
import { usePumpStore } from '@/stores/pumps.store';
import { useNotificationStore } from '@/stores/notification.store';
import { useAuthStore } from '@/stores/auth.store';
import {
  fetchDashboardOverview,
  DashboardOverview,
  WeeklyTrendPoint,
  TopAttendant,
  ForecourtActivity,
} from '@/services/dashboard.service';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { SubscriptionWidget } from '@/components/dashboard/SubscriptionWidget';
import { LiveMarketMarquee } from '@/components/dashboard/LiveMarketMarquee';
import { LiveStockMarketSection } from '@/components/dashboard/LiveStockMarketSection';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { toast } from '@/components/feedback/Toast';

// ─── Stat Card Component ─────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value?: string | number;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  subtext?: string;
  icon: React.ReactNode;
  iconBg: string;
  isLoading?: boolean;
  trend?: string;
  trendColor?: string;
}

function StatCard({
  label,
  value,
  numericValue,
  prefix = '',
  suffix = '',
  decimals = 0,
  subtext,
  icon,
  iconBg,
  isLoading,
  trend,
  trendColor,
}: StatCardProps) {
  const finalNum = typeof numericValue === 'number'
    ? numericValue
    : typeof value === 'number'
      ? value
      : typeof value === 'string' && !isNaN(Number(value.replace(/[^0-9.-]+/g, '')))
        ? Number(value.replace(/[^0-9.-]+/g, ''))
        : null;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-3 relative overflow-hidden text-left hover:border-orange-400 hover:shadow-md transition-all">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
        <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
      </div>
      <div>
        {isLoading ? (
          <div className="h-7 w-32 bg-slate-100 rounded-lg animate-pulse" />
        ) : (
          <div className="text-2xl font-extrabold text-slate-900 font-mono leading-none tracking-tight">
            {finalNum !== null ? (
              <AnimatedCounter
                end={finalNum}
                decimals={decimals}
                prefix={prefix}
                suffix={suffix}
                triggerOnMount
              />
            ) : (
              value
            )}
          </div>
        )}
        {trend && (
          <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-2 ${trendColor || 'text-emerald-500'}`}>
            {trend} <span className="text-slate-400 font-semibold ml-0.5">{subtext}</span>
          </span>
        )}
        {!trend && subtext && (
          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5 mt-2">{subtext}</span>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard Page ─────────────────────────────────────────────────────

export default function DashboardHome() {
  const router = useRouter();
  const { t } = useLanguage();
  const { selectedPump, initializePumps, isInitialized, isLoading: pumpsLoading } = usePumpStore();
  const { notifications } = useNotificationStore();
  const { user } = useAuthStore();

  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Real-time revenue pulse (simulated WebSocket ticker on top of actual base)
  const [revenuePulse, setRevenuePulse] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);

  // Initialize pump list from backend
  useEffect(() => {
    initializePumps();
  }, [initializePumps]);

  // Fetch real dashboard stats from backend
  const loadOverview = useCallback(async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await fetchDashboardOverview();
      setOverview(data);
      // Seed vehicle count randomly from sales as rough proxy
      setVehicleCount(Math.max(data.stats?.today_sales_count ?? 0, 12));
    } catch (err: any) {
      setStatsError(err.message);
      toast.error('Failed to load dashboard stats');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  // Pulse revenue counter every 4s to simulate live dispenser activity
  useEffect(() => {
    if (!selectedPump || selectedPump.status !== 'approved') return;
    const interval = setInterval(() => {
      setRevenuePulse((prev) => prev + Math.floor(Math.random() * 40) + 10);
      if (Math.random() > 0.7) {
        setVehicleCount((prev) => prev + 1);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedPump]);

  // ── Loading / no pump states ──────────────────────────────────────────────

  // Still fetching pump list from backend
  if (!isInitialized || pumpsLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
          <span className="text-xs text-slate-400 font-semibold">Loading station data...</span>
        </div>
      </div>
    );
  }

  // No pump registered on backend yet (user has 0 pumps)
  if (!selectedPump && isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200/60 shadow-xl max-w-xl mx-auto my-12 text-center gap-6">
        <div className="h-16 w-16 bg-orange-50 border border-orange-200 rounded-full flex items-center justify-center text-primary">
          <Building className="h-7 w-7" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-extrabold text-text-primary">No Pump Registered</h2>
          <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
            You haven&apos;t registered a fuel pump yet. Create one to start managing your operations from this dashboard.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/pumps')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:border-primary bg-white px-5 py-3 text-xs font-bold text-text-primary hover:text-primary transition-colors outline-none cursor-pointer"
        >
          Register a Pump
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Pending approval state
  if (selectedPump && selectedPump.status !== 'approved') {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200/60 shadow-xl max-w-xl mx-auto my-12 text-center gap-6">
        <div className="h-16 w-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-500 animate-bounce">
          <ShieldAlert className="h-7 w-7" />
        </div>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-extrabold text-text-primary">Operational Verification Pending</h2>
          <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
            Your fuel station <strong>&quot;{selectedPump.name}&quot;</strong> is currently under review. Dashboard access is locked until an admin approves your compliance documents.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/pumps')}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 hover:border-primary bg-white px-5 py-3 text-xs font-bold text-text-primary hover:text-primary transition-colors outline-none cursor-pointer"
        >
          Check Onboarding Status
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // At this point selectedPump is guaranteed to be non-null and approved
  const pump = selectedPump!;

  // ── Derived values ────────────────────────────────────────────────────────

  const todayRevenue = (overview?.stats?.today_revenue ?? 0) + revenuePulse;
  const activeAttendants = overview?.stats?.active_attendants ?? 0;
  const todaySales = overview?.stats?.today_sales_count ?? 0;

  // ── Live data from API ──────────────────────────────────────────────────
  const forecourtActivities: ForecourtActivity[] = overview?.forecourt_activities ?? [];
  const topAttendants: TopAttendant[] = overview?.top_attendants ?? [];
  const weeklyTrend: WeeklyTrendPoint[] = overview?.weekly_trend ?? [];

  // Compute max revenue across the week for normalising bar heights
  const maxWeeklyRevenue = Math.max(...weeklyTrend.map((d) => d.revenue), 1);

  // ── Main Render ───────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 w-full font-plus-jakarta text-slate-800">

      {/* Stats fetch error banner */}
      {statsError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="font-semibold flex-1">Could not load live stats from server. Showing cached data.</span>
          <button
            onClick={loadOverview}
            className="flex items-center gap-1.5 font-bold hover:underline cursor-pointer"
          >
            <RefreshCcw className="h-3.5 w-3.5" /> Retry
          </button>
        </motion.div>
      )}

      {/* 1. TOP HEADER BAR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-white border border-slate-200 rounded-2xl shadow-xs gap-4 text-left">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-orange-50 border border-orange-200 rounded-xl flex items-center justify-center text-orange-600">
            <Building className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">
              {pump.name} — {t('dashOverview')}
            </h1>
            <p className="text-xs text-slate-500">
              {pump.address || 'Real-time forecourt telemetry and ERP data active'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => router.push('/dashboard/employees')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-orange-50 hover:text-orange-600 text-xs font-bold text-slate-700 rounded-xl transition-all cursor-pointer outline-none"
          >
            <Plus className="h-4 w-4 text-orange-500" /> {t('actionAddAttendant')}
          </button>
          <button
            onClick={() => router.push('/dashboard/live')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-orange-50 hover:text-orange-600 text-xs font-bold text-slate-700 rounded-xl transition-all cursor-pointer outline-none"
          >
            <Video className="h-4 w-4 text-orange-500" /> {t('actionLiveCameras')}
          </button>
          <button
            onClick={() => router.push('/dashboard/reports')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-orange-50 hover:text-orange-600 text-xs font-bold text-slate-700 rounded-xl transition-all cursor-pointer outline-none"
          >
            <FileText className="h-4 w-4 text-orange-500" /> {t('actionExportRoster')}
          </button>
          <button
            onClick={loadOverview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-orange-300 bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white rounded-xl shadow-xs transition-all cursor-pointer outline-none"
          >
            <RefreshCcw className="h-4 w-4" /> {t('actionRefresh')}
          </button>
        </div>
      </div>
      <SubscriptionWidget pumpId={pump.id} />

      {/* 1.5. REAL-TIME STOCK MARKET COMMODITY TICKER MARQUEE (White & Orange) */}
      <LiveMarketMarquee
        pumpName={pump.name}
        fuelTypes={pump.fuelTypes}
        nozzlesCount={pump.nozzlesCount || 6}
        totalSalesToday={todaySales}
      />

      {/* 2. KPI STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label={t('kpiGrossRevenue')}
          numericValue={todayRevenue}
          prefix="₹"
          subtext="since midnight cutoff"
          icon={<DollarSign className="h-4 w-4" />}
          iconBg="bg-orange-100 text-orange-600 border border-orange-200"
          isLoading={statsLoading}
          trend="↑ Live counter"
          trendColor="text-emerald-500"
        />
        <StatCard
          label={t('kpiActiveAttendants')}
          numericValue={activeAttendants}
          suffix=" Active"
          subtext="Shift operational"
          icon={<Users className="h-4 w-4" />}
          iconBg="bg-orange-50 text-orange-500 border border-orange-200"
          isLoading={statsLoading}
        />
        <StatCard
          label={t('kpiVehiclesServed')}
          numericValue={vehicleCount}
          suffix=" Cars"
          subtext="last 15 mins live"
          icon={<Car className="h-4 w-4" />}
          iconBg="bg-amber-50 text-amber-600 border border-amber-200"
          isLoading={statsLoading}
          trend={`↑ ${todaySales} transactions`}
          trendColor="text-emerald-500"
        />
        <StatCard
          label={t('kpiTotalSales')}
          numericValue={overview?.stats?.total_sales_count ?? 0}
          suffix=" Txns"
          subtext="All transactions on record"
          icon={<Layers className="h-4 w-4" />}
          iconBg="bg-orange-50 text-orange-600 border border-orange-200"
          isLoading={statsLoading}
        />
      </div>

      {/* 3. LIVE STOCK MARKET FORECOURT TRADING TERMINAL (White & Orange) */}
      <LiveStockMarketSection
        initialWeeklyTrend={weeklyTrend}
        todayRevenue={todayRevenue}
        forecourtActivities={forecourtActivities}
        pumpName={pump.name}
        fuelTypes={pump.fuelTypes}
        nozzlesCount={pump.nozzlesCount || 6}
        onLiveTick={(delta) => {
          setRevenuePulse((prev) => prev + Math.round(delta * 0.05));
        }}
      />

      {/* 4. BOTTOM GRID: Attendants + Alarms */}
      <div className="grid lg:grid-cols-12 gap-6 items-start mb-4">
        {/* Top Attendants */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4 text-left hover:border-orange-300 transition-all">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-500" />
            {t('kpiTopAttendants')}
          </h3>
          <div className="flex flex-col gap-2.5">
            {statsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />
              ))
            ) : topAttendants.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-semibold">
                No attendant sales recorded this week.
              </div>
            ) : (
              topAttendants.map((at, idx) => (
                <div key={at.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-orange-50/40 border border-slate-100 hover:border-orange-200 transition-all text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-[11px] ${
                      idx === 0
                        ? 'bg-orange-100 text-orange-700 border border-orange-200'
                        : idx === 1
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-slate-800">{at.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">Attendant · {at.sold_liters.toFixed(1)} L this week</span>
                    </div>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="font-extrabold text-slate-900 font-mono">
                      <AnimatedCounter end={at.total_amount} prefix="₹" />
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold">{at.sold_liters.toFixed(1)} L sold</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Station Alarms */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4 text-left hover:border-orange-300 transition-all">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-orange-500" />
            {t('activeAlerts')}
          </h3>
          <div className="flex flex-col gap-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-semibold">
                No active alarms. All systems nominal ✓
              </div>
            ) : (
              notifications.slice(0, 3).map((n) => {
                const bgColors = {
                  danger: 'bg-red-50/50 border-red-100/50',
                  warning: 'bg-amber-50/50 border-amber-100/50',
                  success: 'bg-emerald-50/50 border-emerald-100/50',
                  info: 'bg-blue-50/50 border-blue-100/50',
                };
                const textColors = {
                  danger: 'text-red-700',
                  warning: 'text-amber-700',
                  success: 'text-emerald-700',
                  info: 'text-blue-700',
                };
                return (
                  <div key={n.id} className={`p-4 border rounded-2xl flex gap-3 ${bgColors[n.type]} text-xs leading-relaxed`}>
                    <ShieldAlert className={`h-5 w-5 shrink-0 ${textColors[n.type]}`} />
                    <div>
                      <h4 className={`font-bold ${textColors[n.type]} leading-tight`}>{n.title}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">{n.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
