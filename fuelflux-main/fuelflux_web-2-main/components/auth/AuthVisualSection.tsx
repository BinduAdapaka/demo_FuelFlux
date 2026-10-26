'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Fuel,
  TrendingUp,
  Truck,
  Zap,
  Activity,
  ShieldCheck,
  Gauge,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { DynamicStatistic } from '@/components/ui/DynamicStatistic';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  platformStatsService,
  PlatformStatsData,
} from '@/services/platformStats.service';

const INITIAL_STATS: PlatformStatsData = {
  fuel_stations: 450,
  active_vehicles: 2850,
  total_transactions: 84200,
  connected_users: 12500,
  liters_telemetered_millions: 15.4,
  uptime_percentage: 99.98,
  checkout_speed_sec: 1.8,
};

export const AuthVisualSection: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [stats, setStats] = useState<PlatformStatsData>(INITIAL_STATS);
  const [activePillar, setActivePillar] = useState<'forecourt' | 'fleet' | 'iot'>('forecourt');

  // Fetch dynamic platform stats on mount
  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      try {
        const data = await platformStatsService.getPlatformStats();
        if (isMounted && data) {
          setStats(data);
        }
      } catch (err) {
        console.warn('Could not load live stats, using baseline defaults', err);
      }
    };

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-cycling of preview pillars every 7s unless reduced motion
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setActivePillar((curr) => {
        if (curr === 'forecourt') return 'fleet';
        if (curr === 'fleet') return 'iot';
        return 'forecourt';
      });
    }, 7000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="relative flex flex-col justify-between min-h-full w-full p-8 lg:p-12 select-none z-10">
      {/* ── Background Dynamic Ambient Layer ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-100/30 via-transparent to-amber-100/20 pointer-events-none" />

      {/* Glowing warm ambient orbs */}
      <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-orange-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-200/30 rounded-full blur-[100px] pointer-events-none" />

      {/* ── Header: FuelFlux Brand & Live Cloud Telemetry Status ── */}
      <div className="z-10 flex items-center justify-between gap-4 w-full mb-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-transparent shrink-0 group-hover:scale-105 transition-transform">
            <img src="/logo.svg" alt="FuelFlux Logo" className="h-9 w-9 object-contain rounded-full shadow-xs" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              Fuel<span className="text-primary">Flux</span>
            </span>
            <span className="text-[9px] font-bold text-slate-500 tracking-widest uppercase mt-0.5">
              Energy & Fleet OS
            </span>
          </div>
        </Link>

        {/* Live Telemetry Ping Badge */}
        <div className="flex items-center gap-2 bg-white/90 border border-orange-200/80 rounded-full px-3 py-1 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-bold text-slate-700">Telemetry Active</span>
        </div>
      </div>

      {/* ── Centerpiece: Interactive Platform Ecosystem Preview ── */}
      <div className="z-10 flex flex-col justify-center items-center my-auto py-2 relative w-full max-w-xl mx-auto">
        {/* Interactive Pillar Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white/90 border border-orange-200/90 rounded-xl mb-4 self-center shadow-sm">
          <button
            type="button"
            onClick={() => setActivePillar('forecourt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activePillar === 'forecourt'
                ? 'bg-primary text-white shadow-md shadow-orange-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Forecourt AI</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePillar('fleet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activePillar === 'fleet'
                ? 'bg-primary text-white shadow-md shadow-orange-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
            }`}
          >
            <Truck className="h-3.5 w-3.5" />
            <span>Fleet ANPR</span>
          </button>
          <button
            type="button"
            onClick={() => setActivePillar('iot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              activePillar === 'iot'
                ? 'bg-primary text-white shadow-md shadow-orange-500/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-orange-50'
            }`}
          >
            <Gauge className="h-3.5 w-3.5" />
            <span>Wet-Stock IoT</span>
          </button>
        </div>

        {/* Visual Terminal Console Box */}
        <div className="w-full rounded-2xl bg-white/95 border border-orange-200/90 p-5 shadow-xl shadow-orange-500/5 relative overflow-hidden">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-orange-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-mono text-slate-500 ml-3 flex items-center gap-1.5 font-semibold">
                <Cpu className="h-3.5 w-3.5 text-primary" />
                fuelflux.cloud.node-01
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                SYNCED 100%
              </span>
            </div>
          </div>

          {/* Dynamic Content View based on Active Pillar */}
          <AnimatePresence mode="wait">
            {activePillar === 'forecourt' && (
              <motion.div
                key="forecourt"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Real-time Sales Graph Card */}
                <div className="bg-gradient-to-br from-orange-50/70 via-white to-amber-50/40 border border-orange-200/80 rounded-xl p-4 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-slate-700">Forecourt Real-Time Flow</span>
                      </div>
                      <div className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
                        <AnimatedCounter end={148250} prefix="₹ " duration={2000} />
                        <span className="text-xs font-semibold text-slate-500 font-normal">.00</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-block">
                        <AnimatedCounter end={28.4} decimals={1} prefix="↑ +" suffix="% peak" duration={1800} />
                      </span>
                      <div className="text-[10px] text-slate-500 font-medium mt-1">4 Nozzles Active</div>
                    </div>
                  </div>

                  {/* Dynamic Animated Sparkline SVG - draws from 0 */}
                  <svg className="w-full h-14 mt-3 overflow-visible" viewBox="0 0 100 28" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="flowGradLight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <motion.path
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      style={{ transformOrigin: 'bottom' }}
                      d="M0 22 Q 15 8, 30 18 T 60 10 T 85 4 L 100 2 L 100 28 L 0 28 Z"
                      fill="url(#flowGradLight)"
                    />
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.8, ease: 'easeOut' }}
                      d="M0 22 Q 15 8, 30 18 T 60 10 T 85 4 L 100 2"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Sub row: Nozzle & Dispenser status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-orange-100 rounded-xl p-3 shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-500">Dispenser 03 (Diesel)</span>
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="text-sm font-extrabold text-slate-900">
                      <AnimatedCounter end={42.5} decimals={1} suffix=" L/min" duration={1800} />
                    </div>
                    <div className="text-[10px] text-slate-500">Flow calibration optimal</div>
                  </div>

                  <div className="bg-white border border-orange-100 rounded-xl p-3 shadow-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-500">Dispenser 01 (Speed)</span>
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                    </div>
                    <div className="text-sm font-extrabold text-slate-900">Auto ANPR Link</div>
                    <div className="text-[10px] text-amber-600 font-bold">Nozzle engaged</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activePillar === 'fleet' && (
              <motion.div
                key="fleet"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Fleet ANPR Scanner Card */}
                <div className="bg-gradient-to-br from-blue-50/40 via-white to-orange-50/30 border border-orange-200/80 rounded-xl p-4 shadow-xs">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-800">ANPR Plate Auto-Identification</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      MATCHED &lt; <AnimatedCounter end={1.8} decimals={1} suffix="s" duration={1500} />
                    </span>
                  </div>

                  {/* Plate display */}
                  <div className="bg-white border border-orange-200/90 p-3 rounded-xl flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 rounded bg-amber-300 border border-amber-400 text-slate-950 font-mono font-black text-sm tracking-wider shadow-xs">
                        MH 12 RN 8842
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Express Logistics Carrier #42</div>
                        <div className="text-[10px] text-emerald-600 font-bold">Corporate Fleet Wallet Pre-Authorized</div>
                      </div>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-orange-100">
                    <span className="font-semibold text-slate-700">
                      Credit Quota: <AnimatedCounter end={250000} prefix="₹ " duration={2000} />
                    </span>
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Autonomous Ready</span>
                  </div>
                </div>

                {/* Logistics Carriers Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-orange-100 rounded-xl p-3 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500">Carrier Fleets Active</span>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">
                      <AnimatedCounter end={142} suffix=" Companies" duration={1800} />
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold">Zero manual invoices</div>
                  </div>
                  <div className="bg-white border border-orange-100 rounded-xl p-3 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500">Avg Refueling Time</span>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">
                      <AnimatedCounter end={2.4} decimals={1} suffix=" mins total" duration={1800} />
                    </div>
                    <div className="text-[10px] text-blue-600 font-bold">
                      <AnimatedCounter end={65} suffix="% faster turnaround" duration={1800} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activePillar === 'iot' && (
              <motion.div
                key="iot"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Underground Tank Telemetry Card */}
                <div className="bg-gradient-to-br from-emerald-50/40 via-white to-orange-50/30 border border-orange-200/80 rounded-xl p-4 shadow-xs">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">Wet-Stock Underground Telemetry</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      DIPSTICK-FREE
                    </span>
                  </div>

                  {/* Visual Tank Gauge - increases from 0 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-900">
                      <span>Tank #1 (HSD Diesel - 20,000L)</span>
                      <span className="text-emerald-600 font-bold">
                        <AnimatedCounter end={16450} suffix=" L" duration={2000} /> (<AnimatedCounter end={82.25} decimals={2} suffix="%" duration={2000} />)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '82.25%' }}
                        transition={{ duration: 2.0, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 pt-1 font-medium">
                      <span>Temp: 24.2°C • Density: 835 kg/m³</span>
                      <span className="text-emerald-600 font-bold">Zero Evaporation Loss</span>
                    </div>
                  </div>
                </div>

                {/* Sub Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-orange-100 rounded-xl p-3 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500">Leakage Detection</span>
                    <div className="text-sm font-extrabold text-emerald-600 mt-0.5">
                      <AnimatedCounter end={0.00} decimals={2} suffix="% Variance" duration={1500} />
                    </div>
                    <div className="text-[10px] text-slate-500">Continuous ultrasound</div>
                  </div>
                  <div className="bg-white border border-orange-100 rounded-xl p-3 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-500">Refill Delivery ETA</span>
                    <div className="text-sm font-extrabold text-slate-900 mt-0.5">Tomorrow, 08:30 AM</div>
                    <div className="text-[10px] text-primary font-bold">Auto-reorder active</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Dynamic Platform Statistics Grid: counts up from 0 ── */}
        <div className="grid grid-cols-2 gap-3 w-full mt-4">
          <DynamicStatistic
            label="Fuel Stations Networked"
            value={stats.fuel_stations}
            suffix="+"
            icon={<Fuel className="h-4 w-4" />}
            description="Smart forecourts"
            trend="+18% QoQ"
            variant="light-card"
            duration={2000}
          />
          <DynamicStatistic
            label="Telemetered Liters"
            value={stats.liters_telemetered_millions}
            decimals={1}
            suffix="M+"
            icon={<Activity className="h-4 w-4" />}
            description="Daily telemetered flow"
            trend="99.9% sensor audit"
            variant="light-card"
            duration={2000}
          />
          <DynamicStatistic
            label="Connected Fleet Vehicles"
            value={stats.active_vehicles}
            suffix="+"
            icon={<Truck className="h-4 w-4" />}
            description="ANPR registered"
            trend="Instant plate match"
            variant="light-card"
            duration={2000}
          />
          <DynamicStatistic
            label="Autonomous Checkout"
            value={stats.checkout_speed_sec}
            decimals={1}
            prefix="< "
            suffix="s"
            icon={<Zap className="h-4 w-4" />}
            description="Nozzle authorization"
            trend="Zero manual delay"
            variant="light-card"
            duration={1800}
          />
        </div>

        {/* Bottom Supporting Value Tagline */}
        <p className="text-xs text-slate-500 text-center mt-4 leading-relaxed max-w-md font-medium">
          Unified energy operating system connecting IoT dispenser nozzles, automated wet-stock sensors, and corporate fleet accounting into a zero-loss matrix.
        </p>
      </div>

      {/* ── Footer: Compliance & Links ── */}
      <div className="z-10 flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-orange-100/90 mt-4">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium text-slate-600">Enterprise 256-bit Encrypted Telemetry</span>
        </div>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-primary transition-colors font-medium">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors font-medium">
            Terms
          </Link>
          <Link href="/api-docs" className="hover:text-primary transition-colors font-medium">
            API Docs
          </Link>
        </div>
      </div>
    </div>
  );
};
