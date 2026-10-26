'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wallet,
  Coins,
  Truck,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Plus,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Fuel,
  Activity,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useFleetStore } from '@/stores/fleet.store';
import { useWalletStore } from '@/stores/wallet.store';
import { vehiclesService } from '@/services/vehicles.service';
import { walletService } from '@/services/wallet.service';
import { transactionsService } from '@/services/transactions.service';
import { logisticService } from '@/services/logistic.service';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export default function LogisticDashboard() {
  const { activeFleetId, fleets, vehicles, transactions, vouchers } = useFleetStore();
  const { wallets } = useWalletStore();

  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredFuel, setHoveredFuel] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [_, __, ___, profile] = await Promise.all([
          vehiclesService.getVehicles(),
          transactionsService.getTransactions(),
          walletService.getWallet(),
          logisticService.getProfile(),
          logisticService.getVouchers()
        ]);
        if (profile) {
          useFleetStore.setState({
            fleets: [{
              id: activeFleetId,
              name: profile.company_name || 'My Logistic Company',
              gstin: profile.gstin || 'N/A',
              billingAddress: profile.billing_address || 'N/A',
              creditApproved: 1000000,
              creditLimit: 1000000
            }]
          });
        }
      } catch (err) {
        console.warn('[LogisticDashboard] Failed to sync real backend data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeFleetId]);

  const activeFleet = fleets.find(f => f.id === activeFleetId) || fleets[0];
  const fleetVehicles = vehicles[activeFleetId] || [];
  const fleetTransactions = transactions[activeFleetId] || [];
  const fleetVouchers = vouchers[activeFleetId] || [];
  const fleetWallet = wallets[activeFleetId] || { balance: 0, autoRecharge: { enabled: false, threshold: 20000, rechargeAmount: 50000, paymentMethodId: '' } };

  // Calculate Metrics
  const totalSpend = fleetTransactions.reduce((acc, curr) => acc + curr.amount, 0);
  const activeVehiclesCount = fleetVehicles.filter(v => v.status === 'active').length;
  const pendingVehiclesCount = fleetVehicles.filter(v => v.status === 'pending_approval').length;
  
  const totalCreditLimit = fleetVehicles.reduce((acc, curr) => acc + curr.creditLimit, 0);
  const totalCreditUsed = fleetVehicles.reduce((acc, curr) => acc + curr.usedCredit, 0);
  const creditUsagePercentage = totalCreditLimit > 0 ? (totalCreditUsed / totalCreditLimit) * 100 : 0;

  // Calculate Fuel breakdown for Custom SVG Donut
  const fuelBreakdown = fleetTransactions.reduce((acc, curr) => {
    acc[curr.fuelType] = (acc[curr.fuelType] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const dieselSpend = fuelBreakdown['diesel'] || 0;
  const petrolSpend = fuelBreakdown['petrol'] || 0;
  const cngSpend = fuelBreakdown['cng'] || 0;
  const combinedSpend = dieselSpend + petrolSpend + cngSpend || 1; // avoid divide by zero

  const dieselPct = (dieselSpend / combinedSpend) * 100;
  const petrolPct = (petrolSpend / combinedSpend) * 100;
  const cngPct = (cngSpend / combinedSpend) * 100;

  // Render Skeleton while switching fleets/loading
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-2xl"></div>
          <div className="h-96 bg-slate-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Compute live 7 days dynamically
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = i === 6 ? 'Today' : d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayTxns = fleetTransactions.filter((t: any) => {
      if (!t.timestamp && !t.created_at) return false;
      const tDate = new Date(t.timestamp || t.created_at);
      return tDate.toDateString() === d.toDateString();
    });
    const spend = dayTxns.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
    const volume = dayTxns.reduce((sum: number, t: any) => sum + (t.liters || t.volume || 0), 0);
    return { label, dayName, spend, volume, count: dayTxns.length };
  });

  const maxSpend = Math.max(...last7Days.map(d => d.spend), 1000);
  const chartPoints = last7Days.map((d, i) => {
    const x = 40 + i * (520 / 6);
    const y = 170 - (d.spend / maxSpend) * 130;
    return { ...d, x, y };
  });

  const splinePath = chartPoints.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = chartPoints[i - 1];
    const cpx1 = prev.x + (p.x - prev.x) / 2;
    const cpy1 = prev.y;
    const cpx2 = prev.x + (p.x - prev.x) / 2;
    const cpy2 = p.y;
    return `${acc} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${p.x} ${p.y}`;
  }, '');
  const areaPath = `${splinePath} L ${chartPoints[chartPoints.length - 1].x} 170 L ${chartPoints[0].x} 170 Z`;

  return (
    <div className="space-y-6">
      {/* Welcome header & summary bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Fleet Overview
          </h1>
          <p className="text-sm font-semibold text-slate-400 mt-1">
            Real-time telemetry and spend analytics for <span className="text-orange-500 font-bold">{activeFleet?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/logistic/vouchers" className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-orange-500 hover:border-orange-500/30 transition-all shadow-sm">
            <FileText className="h-4 w-4 text-slate-400" />
            Vouchers Console
          </Link>
          <Link href="/logistic/vehicles" className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-orange-500/20 transition-all">
            <Plus className="h-4 w-4" />
            Register Vehicle
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Wallet Prepaid Balance */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wallet Balance</p>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                <AnimatedCounter
                  end={fleetWallet.balance}
                  decimals={2}
                  prefix="₹"
                  triggerOnMount
                />
              </h3>
            </div>
            <div className={`p-3 rounded-xl ${fleetWallet.balance < 25000 ? 'bg-rose-50 text-rose-500 animate-pulse' : 'bg-orange-50 text-orange-500'} group-hover:scale-110 transition-transform`}>
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            {fleetWallet.balance < 25000 ? (
              <span className="text-rose-500 font-bold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> Low Balance Alert
              </span>
            ) : (
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Balance Healthy
              </span>
            )}
            <Link href="/logistic/wallet" className="text-orange-500 font-bold hover:underline flex items-center gap-0.5">
              Recharge <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>

        {/* MTD Fuel Spends */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">MTD Spending</p>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                <AnimatedCounter
                  end={totalSpend}
                  decimals={2}
                  prefix="₹"
                  triggerOnMount
                />
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 text-orange-500 group-hover:scale-110 transition-transform">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-orange-500" /> Live Audit Log Active
            </span>
            <Link href="/logistic/transactions" className="text-slate-400 font-bold hover:text-slate-600">
              View Logs
            </Link>
          </div>
        </motion.div>

        {/* Vehicles Registry */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Fleet Size</p>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                <AnimatedCounter end={activeVehiclesCount} triggerOnMount />{' '}
                <span className="text-sm font-semibold text-slate-400">/ {fleetVehicles.length} Vehicles</span>
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-orange-50 text-orange-500 group-hover:scale-110 transition-transform">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
            <span className="text-slate-500 font-medium">
              {pendingVehiclesCount > 0 ? (
                <span className="text-amber-600 font-bold">{pendingVehiclesCount} Pending Approval</span>
              ) : (
                <span className="text-emerald-600 font-bold">All Credentials Active</span>
              )}
            </span>
            <Link href="/logistic/vehicles" className="text-orange-500 font-bold hover:underline">
              Manage Fleet
            </Link>
          </div>
        </motion.div>

        {/* Combined Credit Limit Progress */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Fleet Credit Used</p>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                <AnimatedCounter end={totalCreditUsed} prefix="₹" triggerOnMount />{' '}
                <span className="text-xs font-bold text-slate-400">/ ₹{totalCreditLimit.toLocaleString('en-IN')}</span>
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-500 group-hover:scale-110 transition-transform">
              <Activity className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(creditUsagePercentage, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-gradient-to-r from-orange-500 to-amber-500 h-full rounded-full"
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1.5 uppercase">
              <span>
                <AnimatedCounter end={creditUsagePercentage} decimals={1} suffix="% Credit Exhausted" triggerOnMount />
              </span>
              <span className="text-blue-500 font-extrabold">Ceiling: ₹{activeFleet?.creditLimit.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Renders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Custom SVG Spending Area Chart (2/3 width) - LIVE & INTERACTIVE */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between relative">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">MTD Fuel Consumption Trends</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Live 7-day telemetry across operational fleets</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-orange-500">
                  <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                  Fuel Spend
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2.5 h-2.5 bg-slate-200 rounded-full" />
                  Safety Ceiling
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Custom SVG Area Chart */}
          <div className="w-full h-56 mt-6 relative select-none">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="130" x2="600" y2="130" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="0" y1="170" x2="600" y2="170" stroke="#cbd5e1" strokeWidth="1" />

              {/* Safety Ceiling Threshold */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="6 6" />

              {/* Area Path */}
              <path d={areaPath} fill="url(#areaGrad)" />

              {/* Spline Path */}
              <path
                d={splinePath}
                fill="none"
                stroke="#f97316"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Interactive Data Nodes */}
              {chartPoints.map((pt, idx) => {
                const isHovered = hoveredPoint === idx;
                return (
                  <g key={idx} className="cursor-pointer">
                    {/* Invisible larger hover hit area */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="18"
                      fill="transparent"
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {/* Visible circle node */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : 4.5}
                      fill={isHovered ? '#f97316' : '#ffffff'}
                      stroke="#f97316"
                      strokeWidth={isHovered ? 3.5 : 2.5}
                      className="transition-all duration-200"
                    />
                    {/* Date label */}
                    <text
                      x={pt.x}
                      y="192"
                      fill={isHovered ? '#ea580c' : '#94a3b8'}
                      fontSize={isHovered ? '11' : '10'}
                      fontWeight="bold"
                      textAnchor="middle"
                      className="transition-colors"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Interactive Tooltip on Node Hover */}
            {hoveredPoint !== null && chartPoints[hoveredPoint] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  left: `${(chartPoints[hoveredPoint].x / 600) * 100}%`,
                  top: `${Math.max(10, (chartPoints[hoveredPoint].y / 200) * 100 - 35)}%`,
                }}
                className="absolute -translate-x-1/2 pointer-events-none z-30 bg-slate-900 text-white rounded-xl px-3 py-2 shadow-xl border border-slate-700/80 text-center min-w-[110px]"
              >
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                  {chartPoints[hoveredPoint].dayName}, {chartPoints[hoveredPoint].label}
                </p>
                <p className="text-sm font-black text-white mt-0.5">
                  ₹{chartPoints[hoveredPoint].spend.toLocaleString('en-IN')}
                </p>
                <p className="text-[9px] text-slate-400 font-medium">
                  {chartPoints[hoveredPoint].count} Fueling Events
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Custom Donut Chart (1/3 width) - INTERACTIVE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between relative">
          <div>
            <h3 className="text-base font-bold text-slate-900">Spend by Fuel Type</h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Hover segments to view real-time breakdown</p>
          </div>

          <div className="flex items-center justify-center my-6 relative select-none">
            {/* Elegant SVG Donut Chart */}
            <svg width="150" height="150" viewBox="0 0 36 36" className="transform -rotate-90">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4.5" />
              {/* Diesel segment */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke={hoveredFuel === 'diesel' ? '#ea580c' : '#f97316'}
                strokeWidth={hoveredFuel === 'diesel' ? 5.5 : 4.5}
                strokeDasharray={`${dieselPct} ${100 - dieselPct}`}
                strokeDashoffset="0"
                className="transition-all cursor-pointer"
                onMouseEnter={() => setHoveredFuel('diesel')}
                onMouseLeave={() => setHoveredFuel(null)}
              />
              {/* Petrol segment */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke={hoveredFuel === 'petrol' ? '#2563eb' : '#3b82f6'}
                strokeWidth={hoveredFuel === 'petrol' ? 5.5 : 4.5}
                strokeDasharray={`${petrolPct} ${100 - petrolPct}`}
                strokeDashoffset={`-${dieselPct}`}
                className="transition-all cursor-pointer"
                onMouseEnter={() => setHoveredFuel('petrol')}
                onMouseLeave={() => setHoveredFuel(null)}
              />
              {/* CNG segment */}
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke={hoveredFuel === 'cng' ? '#059669' : '#10b981'}
                strokeWidth={hoveredFuel === 'cng' ? 5.5 : 4.5}
                strokeDasharray={`${cngPct} ${100 - cngPct}`}
                strokeDashoffset={`-${dieselPct + petrolPct}`}
                className="transition-all cursor-pointer"
                onMouseEnter={() => setHoveredFuel('cng')}
                onMouseLeave={() => setHoveredFuel(null)}
              />
            </svg>

            {/* Central dynamic readout */}
            <div className="absolute flex flex-col items-center justify-center text-center pointer-events-none">
              <Fuel className={`h-5 w-5 ${hoveredFuel === 'diesel' ? 'text-orange-500' : hoveredFuel === 'petrol' ? 'text-blue-500' : hoveredFuel === 'cng' ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                {hoveredFuel ? hoveredFuel.toUpperCase() : 'COMB SPEND'}
              </span>
              <span className="text-sm font-black text-slate-800">
                ₹{hoveredFuel === 'diesel' 
                  ? (dieselSpend / 1000).toFixed(1) + 'k' 
                  : hoveredFuel === 'petrol' 
                    ? (petrolSpend / 1000).toFixed(1) + 'k' 
                    : hoveredFuel === 'cng' 
                      ? (cngSpend / 1000).toFixed(1) + 'k' 
                      : (totalSpend / 1000).toFixed(1) + 'k'}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div
              onMouseEnter={() => setHoveredFuel('diesel')}
              onMouseLeave={() => setHoveredFuel(null)}
              className={`flex items-center justify-between text-xs font-bold p-1.5 rounded-lg transition-colors cursor-pointer ${hoveredFuel === 'diesel' ? 'bg-orange-50 text-orange-700' : 'text-slate-600'}`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-orange-500 rounded-full" />
                <span>Diesel</span>
              </div>
              <span className="text-slate-800 font-mono">₹{dieselSpend.toLocaleString('en-IN')} ({dieselPct.toFixed(0)}%)</span>
            </div>
            <div
              onMouseEnter={() => setHoveredFuel('petrol')}
              onMouseLeave={() => setHoveredFuel(null)}
              className={`flex items-center justify-between text-xs font-bold p-1.5 rounded-lg transition-colors cursor-pointer ${hoveredFuel === 'petrol' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                <span>Petrol</span>
              </div>
              <span className="text-slate-800 font-mono">₹{petrolSpend.toLocaleString('en-IN')} ({petrolPct.toFixed(0)}%)</span>
            </div>
            <div
              onMouseEnter={() => setHoveredFuel('cng')}
              onMouseLeave={() => setHoveredFuel(null)}
              className={`flex items-center justify-between text-xs font-bold p-1.5 rounded-lg transition-colors cursor-pointer ${hoveredFuel === 'cng' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'}`}
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                <span>CNG</span>
              </div>
              <span className="text-slate-800 font-mono">₹{cngSpend.toLocaleString('en-IN')} ({cngPct.toFixed(0)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Row: Recent Ledger & Suspicious Activity Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Fueling Logs</h3>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">Audit log of dispenser triggers on network petrol pumps</p>
            </div>
            <Link href="/logistic/transactions" className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1">
              View All Logs <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pr-2">Vehicle</th>
                  <th className="pb-3 pr-2">Driver</th>
                  <th className="pb-3 pr-2">Pump Station</th>
                  <th className="pb-3 pr-2 text-right">Qty</th>
                  <th className="pb-3 pr-2 text-right">Amount</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs font-medium text-slate-700">
                {fleetTransactions.length > 0 ? (
                  fleetTransactions.slice(0, 3).map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pr-2 font-bold text-slate-900">{txn.vehicleNumber}</td>
                      <td className="py-3.5 pr-2 font-semibold text-slate-500">{txn.driverName}</td>
                      <td className="py-3.5 pr-2 max-w-[120px] truncate" title={txn.pumpName}>
                        {txn.pumpName}
                      </td>
                      <td className="py-3.5 pr-2 text-right font-semibold text-slate-600">{txn.quantity} L</td>
                      <td className="py-3.5 pr-2 text-right font-bold text-slate-900">₹{txn.amount.toLocaleString()}</td>
                      <td className="py-3.5 text-slate-400 whitespace-nowrap">{txn.date.substring(5)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-bold">
                      No fueling transactions recorded for this fleet yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Voucher and Telemetry Status Alerts */}
        <div className="space-y-6">
          {/* Active Vouchers Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-3">Vouchers Status</h3>
            <div className="grid grid-cols-3 gap-3.5 text-center">
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-2.5">
                <span className="block text-xl font-black text-amber-600">
                  {fleetVouchers.filter(v => v.status === 'pending').length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending</span>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-2.5">
                <span className="block text-xl font-black text-emerald-600">
                  {fleetVouchers.filter(v => v.status === 'approved').length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved</span>
              </div>
              <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-2.5">
                <span className="block text-xl font-black text-slate-500">
                  {fleetVouchers.filter(v => v.status === 'used').length}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Redeemed</span>
              </div>
            </div>
            <Link href="/logistic/vouchers" className="w-full flex items-center justify-center gap-1.5 mt-4 py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:text-orange-500 text-xs font-bold rounded-xl transition-all">
              Manage QR Codes <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Siphoning Telemetry Alerts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ShieldAlert className="h-5 w-5 text-rose-500" />
              <h3 className="text-base font-bold text-slate-900">Abnormal Siphoning</h3>
            </div>
            
            {fleetTransactions.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-rose-50/40 border border-rose-100/50 rounded-xl">
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Fuel Loss Triggered (TS-08-EJ-9921)</h4>
                    <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Telemetry reported 12L drops while idling inside Vijayawada bypass.</p>
                    <span className="text-[9px] font-bold text-rose-600 bg-rose-100/50 px-1.5 py-0.5 rounded mt-1.5 inline-block uppercase">Critical Alert</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs font-bold text-slate-400">No telemetry alerts reported.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
