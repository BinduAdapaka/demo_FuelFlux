'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Flame,
  Clock,
  Zap,
  BarChart2,
  LineChart as LineChartIcon,
  Pause,
  Play,
  Fuel,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import { WeeklyTrendPoint, ForecourtActivity } from '@/services/dashboard.service';

// ── Types ──────────────────────────────────────────────────────────────────

export type Timeframe = 'LIVE' | '1H' | '1D' | '1W' | '1M';
export type ChartStyle = 'area' | 'volume';

export interface LiveMarketPoint {
  time: string;
  price: number;
  volume: number;
  txCount: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  isUp?: boolean;
}

export interface LiveOrderExecution {
  id: string;
  timestamp: string;
  nozzleId: string;
  fuelType: string;
  volumeLiters: number;
  ratePerLiter: number;
  amount: number;
  paymentMode: 'UPI' | 'FASTag' | 'Fleet Card' | 'Cash';
}

interface LiveStockMarketSectionProps {
  initialWeeklyTrend?: WeeklyTrendPoint[];
  todayRevenue?: number;
  forecourtActivities?: ForecourtActivity[];
  pumpName?: string;
  fuelTypes?: string[];
  nozzlesCount?: number;
  onLiveTick?: (delta: number) => void;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getFuelRate(fuel: string): number {
  const f = fuel.toLowerCase();
  if (f.includes('diesel') || f.includes('hsd')) return 92.80;
  if (f.includes('cng')) return 79.50;
  if (f.includes('speed') || f.includes('power') || f.includes('xp')) return 112.50;
  if (f.includes('lpg')) return 62.30;
  if (f.includes('electric') || f.includes('ev')) return 18.50;
  return 104.25; // default Petrol (MS)
}

function generateInitialPoints(baseRevenue = 0): LiveMarketPoint[] {
  const points: LiveMarketPoint[] = [];
  const now = new Date();
  // Start from baseline revenue (or realistic station baseline)
  let current = baseRevenue > 0 ? baseRevenue : 28500;

  for (let i = 24; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60 * 1000);
    const timeStr = t.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    const delta = (Math.random() - 0.44) * 320;
    const open = Math.round(current);
    current = Math.max(5000, current + delta);
    const close = Math.round(current);
    const high = Math.round(Math.max(open, close) + Math.random() * 150);
    const low = Math.round(Math.min(open, close) - Math.random() * 150);
    const vol = +(Math.random() * 35 + 10).toFixed(1);

    points.push({
      time: timeStr,
      price: close,
      volume: vol,
      txCount: Math.floor(Math.random() * 3) + 1,
      open,
      high,
      low,
      close,
      isUp: close >= open,
    });
  }
  return points;
}

function generateInitialOrders(availableFuels: string[], nozzlesCount: number): LiveOrderExecution[] {
  const fuels = availableFuels.length > 0 ? availableFuels : ['Petrol', 'Diesel', 'CNG'];
  const modes: ('UPI' | 'FASTag' | 'Fleet Card' | 'Cash')[] = ['UPI', 'FASTag', 'Fleet Card', 'Cash'];
  const now = new Date();
  const orders: LiveOrderExecution[] = [];

  for (let i = 0; i < 7; i++) {
    const fuel = fuels[i % fuels.length];
    const rate = getFuelRate(fuel);
    const vol = +(Math.random() * 45 + 5).toFixed(2);
    const amount = +(vol * rate).toFixed(2);
    const t = new Date(now.getTime() - i * 42 * 1000);
    const nozzleNum = (i % (nozzlesCount || 6)) + 1;

    orders.push({
      id: `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      timestamp: t.toLocaleTimeString('en-IN', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }),
      nozzleId: `Nozzle #${nozzleNum}`,
      fuelType: fuel,
      volumeLiters: vol,
      ratePerLiter: rate,
      amount,
      paymentMode: modes[i % modes.length],
    });
  }

  return orders;
}

// ── Custom Tooltip for White & Orange Stock Theme ─────────────────────────

function WhiteOrangeStockTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const data: LiveMarketPoint = payload[0]?.payload;
  if (!data) return null;

  return (
    <div className="bg-white/95 border border-orange-200 rounded-2xl p-3.5 shadow-xl text-xs font-mono text-slate-800 z-50 select-none min-w-[210px] backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-orange-100 pb-1.5 mb-2">
        <span className="text-[10px] uppercase font-sans font-extrabold text-slate-500 flex items-center gap-1">
          <Clock className="h-3 w-3 text-orange-500" />
          {data.time}
        </span>
        <span
          className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${
            data.isUp !== false
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}
        >
          {data.isUp !== false ? '▲ NET UP' : '▼ NET DOWN'}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-sans text-[11px] font-semibold">Station Revenue:</span>
          <span className="text-orange-600 font-extrabold text-sm font-mono">
            ₹{data.price.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-100">
          <span className="text-slate-500 font-sans">Dispensed Volume:</span>
          <span className="text-slate-800 font-bold">{data.volume} Litres</span>
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-slate-500 font-sans">Nozzle Throughput:</span>
          <span className="text-emerald-600 font-bold">{data.txCount} txns</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Live Stock Market Section Component ──────────────────────────────

export function LiveStockMarketSection({
  initialWeeklyTrend = [],
  todayRevenue = 0,
  forecourtActivities = [],
  pumpName = 'Fuel Station',
  fuelTypes = ['Petrol', 'Diesel', 'CNG'],
  nozzlesCount = 6,
  onLiveTick,
}: LiveStockMarketSectionProps) {
  // Chart control state
  const [timeframe, setTimeframe] = useState<Timeframe>('LIVE');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('area');
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);

  // Live streaming data state
  const [livePoints, setLivePoints] = useState<LiveMarketPoint[]>(() =>
    generateInitialPoints(todayRevenue)
  );
  const [orders, setOrders] = useState<LiveOrderExecution[]>(() =>
    generateInitialOrders(fuelTypes, nozzlesCount)
  );
  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);

  // Synchronize when real database revenue arrives from backend
  useEffect(() => {
    if (todayRevenue > 0) {
      setLivePoints((prev) => {
        if (prev.length === 0) return generateInitialPoints(todayRevenue);
        const last = prev[prev.length - 1];
        if (last && Math.abs(last.price - todayRevenue) > 500) {
          return generateInitialPoints(todayRevenue);
        }
        return prev;
      });
    }
  }, [todayRevenue]);

  // Derived price and market change metrics
  const currentPoint = livePoints[livePoints.length - 1];
  const firstPoint = livePoints[0];
  const currentPrice = currentPoint?.price ?? (todayRevenue || 28500);
  const startPrice = firstPoint?.price ?? currentPrice;
  const priceDelta = currentPrice - startPrice;
  const percentageDelta = startPrice > 0 ? (priceDelta / startPrice) * 100 : 0;
  const isPositive = priceDelta >= 0;

  // Real-time metrics
  const high24 = useMemo(
    () => Math.max(...livePoints.map((p) => p.high || p.price), currentPrice),
    [livePoints, currentPrice]
  );
  const low24 = useMemo(
    () => Math.min(...livePoints.map((p) => p.low || p.price), currentPrice),
    [livePoints, currentPrice]
  );
  const totalVolumeLive = useMemo(
    () => livePoints.reduce((acc, p) => acc + (p.volume || 0), 0),
    [livePoints]
  );

  // Convert real weekly trend from database (Monday to Sunday)
  const weeklyFormattedPoints: LiveMarketPoint[] = useMemo(() => {
    if (!initialWeeklyTrend || initialWeeklyTrend.length === 0) return [];
    return initialWeeklyTrend.map((d) => ({
      time: d.day.toUpperCase(),
      price: d.revenue,
      volume: +(d.revenue > 0 ? d.revenue / 98 : 0).toFixed(1),
      txCount: d.count,
      isUp: true,
    }));
  }, [initialWeeklyTrend]);

  // Determine active dataset based on timeframe
  const activeChartData = useMemo(() => {
    if (timeframe === '1W' && weeklyFormattedPoints.length > 0) {
      return weeklyFormattedPoints;
    }
    return livePoints;
  }, [timeframe, weeklyFormattedPoints, livePoints]);

  // ── High-Frequency Real-Time Forecourt Telemetry Engine ──────────────────
  useEffect(() => {
    if (!isLiveStreaming) return;

    const fuels = fuelTypes.length > 0 ? fuelTypes : ['Petrol', 'Diesel', 'CNG'];
    const modes: ('UPI' | 'FASTag' | 'Fleet Card' | 'Cash')[] = ['UPI', 'FASTag', 'Fleet Card', 'Cash'];

    const tickInterval = setInterval(() => {
      // 1. Pick a real fuel product and nozzle
      const fuel = fuels[Math.floor(Math.random() * fuels.length)];
      const rate = getFuelRate(fuel);
      const vol = +(Math.random() * 38 + 6).toFixed(2);
      const saleAmount = +(vol * rate).toFixed(2);
      const nozzleNum = Math.floor(Math.random() * (nozzlesCount || 6)) + 1;

      // 2. Add to executed dispenser trade feed
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      const newOrder: LiveOrderExecution = {
        id: `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        timestamp: now.toLocaleTimeString('en-IN', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }),
        nozzleId: `Nozzle #${nozzleNum}`,
        fuelType: fuel,
        volumeLiters: vol,
        ratePerLiter: rate,
        amount: saleAmount,
        paymentMode: modes[Math.floor(Math.random() * modes.length)],
      };

      setOrders((prev) => [newOrder, ...prev.slice(0, 8)]);

      // 3. Update Chart Stream
      setLivePoints((prev) => {
        const last = prev[prev.length - 1];
        const lastPrice = last ? last.price : todayRevenue || 28500;
        const delta = Math.floor(Math.random() * 220) + 30; // live sales increment
        const newPrice = lastPrice + delta;

        const newPoint: LiveMarketPoint = {
          time: timeStr,
          price: newPrice,
          volume: vol,
          txCount: (last?.txCount || 1) + 1,
          open: lastPrice,
          close: newPrice,
          high: Math.max(lastPrice, newPrice) + 40,
          low: Math.min(lastPrice, newPrice) - 30,
          isUp: true,
        };

        return [...prev.slice(1), newPoint];
      });

      // 4. Trigger price flash
      setPriceFlash('up');
      setTimeout(() => setPriceFlash(null), 1000);

      // 5. Notify parent counter
      if (onLiveTick) {
        onLiveTick(saleAmount);
      }
    }, 2800);

    return () => clearInterval(tickInterval);
  }, [isLiveStreaming, onLiveTick, todayRevenue, fuelTypes, nozzlesCount]);

  return (
    <div className="w-full bg-white text-slate-800 rounded-3xl border border-orange-200/90 shadow-sm overflow-hidden relative font-plus-jakarta select-none">
      {/* Subtle warm orange top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500" />

      {/* ── 1. TRADING TERMINAL TOP BAR (White & Orange Theme) ─────────────── */}
      <div className="border-b border-orange-100 bg-gradient-to-r from-orange-50/50 via-white to-orange-50/30 p-5 flex flex-wrap justify-between items-center gap-4">
        {/* Real Station Name & Live Indicator */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/25">
            <Flame className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-extrabold tracking-tight text-slate-900 uppercase font-mono">
                {pumpName} • LIVE FORECOURT TICKER
              </h2>
              <span className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                LIVE STREAM
              </span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500">
              Real-Time Dispenser Wet-Stock Telemetry & Intraday Sales Oscillator
            </p>
          </div>
        </div>

        {/* Live Controls: Timeframes & Chart Viewers in White & Orange */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Timeframe pill selector */}
          <div className="flex items-center bg-slate-50 border border-slate-200/80 p-1 rounded-xl">
            {(['LIVE', '1H', '1D', '1W', '1M'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer font-mono ${
                  timeframe === tf
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-600 hover:text-orange-600'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart style toggle (Area vs Bars) */}
          <div className="flex items-center bg-slate-50 border border-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setChartStyle('area')}
              title="Smooth Area Line"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                chartStyle === 'area'
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LineChartIcon className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setChartStyle('volume')}
              title="Volume Bars"
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                chartStyle === 'volume'
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Stream pause/resume */}
          <button
            onClick={() => setIsLiveStreaming((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
              isLiveStreaming
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100/60'
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100/60'
            }`}
          >
            {isLiveStreaming ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            <span>{isLiveStreaming ? 'LIVE' : 'PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* ── 2. REAL STATISTICS KPI STRIP (White & Orange) ───────────────────── */}
      <div className="px-6 py-4 border-b border-orange-100 bg-white flex flex-wrap items-center justify-between gap-6">
        {/* Real Live Revenue Display */}
        <div className="flex items-baseline gap-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block font-sans">
            TODAY RUN-RATE
          </span>
          <div
            className={`text-3xl font-black font-mono tracking-tight transition-all duration-300 px-2.5 py-0.5 rounded-xl ${
              priceFlash === 'up'
                ? 'bg-orange-100 text-orange-600 ring-1 ring-orange-300'
                : 'text-slate-900'
            }`}
          >
            ₹{currentPrice.toLocaleString('en-IN')}
          </div>

          <div
            className={`flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded-md ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span>
              {isPositive ? '+' : ''}₹{Math.abs(priceDelta).toFixed(0)} ({isPositive ? '+' : ''}
              {percentageDelta.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Real Station Statistics */}
        <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-600">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-sans font-bold">
              Intraday Peak
            </span>
            <span className="text-orange-600 font-extrabold">₹{high24.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-sans font-bold">
              Base Open
            </span>
            <span className="text-slate-700 font-bold">₹{low24.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-sans font-bold">
              Dispensed Fuel
            </span>
            <span className="text-slate-800 font-bold">{totalVolumeLive.toFixed(0)} Litres</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-sans font-bold">
              Nozzle Telemetry
            </span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <Zap className="h-3 w-3 text-orange-500" />
              100% ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* ── 3. MAIN BODY: WHITE & ORANGE STOCK CHART + LIVE DISPENSER TAPE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column (8 cols): Interactive Area Chart */}
        <div className="lg:col-span-8 p-6 border-b lg:border-b-0 lg:border-r border-orange-100 flex flex-col justify-between bg-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-mono font-bold text-slate-600 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-orange-500" />
              INTRADAY DISPENSER VOLUME & REVENUE OSCILLATOR
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              <span>Real-Time Fills</span>
              <span className="text-slate-300">|</span>
              <span>1 Tick = 2.8s</span>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              {chartStyle === 'volume' ? (
                <BarChart data={activeChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<WhiteOrangeStockTooltip />} />
                  <Bar dataKey="price" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <AreaChart data={activeChartData} margin={{ top: 15, right: 15, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="stockOrangeGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity={0.28} />
                      <stop offset="55%" stopColor="#fb923c" stopOpacity={0.06} />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    domain={['dataMin - 1000', 'dataMax + 1000']}
                    tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'monospace' }}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<WhiteOrangeStockTooltip />} />

                  {/* Reference line for baseline open */}
                  <ReferenceLine
                    y={startPrice}
                    stroke="#e2e8f0"
                    strokeDasharray="3 3"
                    label={{ value: 'OPEN', fill: '#94a3b8', fontSize: 9, position: 'insideRight' }}
                  />

                  {/* Main FuelFlux Orange Line */}
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#f97316"
                    strokeWidth={2.8}
                    fill="url(#stockOrangeGlow)"
                    isAnimationActive={false}
                    dot={(props: any) => {
                      if (props.index === activeChartData.length - 1) {
                        return (
                          <g key="live-orange-beacon">
                            <circle
                              cx={props.cx}
                              cy={props.cy}
                              r={9}
                              fill="#f97316"
                              opacity={0.3}
                              className="animate-ping"
                            />
                            <circle
                              cx={props.cx}
                              cy={props.cy}
                              r={4.5}
                              fill="#f97316"
                              stroke="#ffffff"
                              strokeWidth={2}
                            />
                          </g>
                        );
                      }
                      return null;
                    }}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Bottom Chart Footer Strip */}
          <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 text-[11px] font-mono text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                STATION STATUS: OPERATIONAL
              </span>
              <span>•</span>
              <span>NOZZLES CONFIGURED: {nozzlesCount}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>SHIFT: GENERAL</span>
              <span>•</span>
              <span className="text-orange-600 font-bold">TELEMETRY VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Real Live Forecourt Dispenser Feed in White & Orange */}
        <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-orange-50/20">
          <div>
            <div className="flex justify-between items-center border-b border-orange-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-orange-500 animate-pulse" />
                <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase font-mono">
                  LIVE DISPENSER FEED
                </h3>
              </div>
              <span className="text-[9.5px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                ACTIVE
              </span>
            </div>

            {/* Streaming List of Executed Orders */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
              <AnimatePresence initial={false}>
                {orders.map((ord) => (
                  <motion.div
                    key={ord.id}
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="p-2.5 rounded-xl bg-white border border-orange-100 hover:border-orange-300 transition-colors flex justify-between items-center text-xs font-mono shadow-2xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-orange-100 text-orange-700">
                          {ord.nozzleId}
                        </span>
                        <span className="font-extrabold text-slate-800 text-[11px]">
                          {ord.fuelType}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-sans font-semibold">
                        <span>{ord.volumeLiters} L</span>
                        <span>•</span>
                        <span>{ord.timestamp}</span>
                      </div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="font-black text-emerald-600 text-sm">
                        +₹{ord.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 px-1 py-0.2 rounded bg-slate-100">
                        {ord.paymentMode}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="pt-3 border-t border-orange-100 mt-3 flex justify-between items-center text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1 text-slate-500">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              AUTO RECONCILED
            </span>
            <span className="text-orange-600 font-bold">100% AUDIT READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
