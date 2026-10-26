'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  Activity,
  Gauge,
  ShieldCheck,
  AlertTriangle,
  Droplets,
  ArrowRight,
  ChevronRight,
  Thermometer,
  Layers,
  CheckCircle,
} from 'lucide-react';

export default function WetStockTelemetryPage() {
  const [selectedTank, setSelectedTank] = useState<'tank1' | 'tank2'>('tank1');

  const tankDetails = {
    tank1: {
      name: 'Tank 01 – High-Speed Diesel (HSD)',
      capacity: '20,000 Liters',
      currentVolume: 16450,
      percentage: 82.25,
      temp: '24.2°C (Density: 835 kg/m³)',
      waterBottom: '0.0 mm (Normal)',
      variance: '0.00% (No leak detected)',
      status: 'Optimal Inventory',
    },
    tank2: {
      name: 'Tank 02 – Motor Spirit (MS Petrol)',
      capacity: '15,000 Liters',
      currentVolume: 4200,
      percentage: 28.0,
      temp: '25.8°C (Density: 742 kg/m³)',
      waterBottom: '1.2 mm (Trace Normal)',
      variance: '+0.02% (Within Tolerance)',
      status: 'Refill Reorder Triggered',
    },
  };

  const current = tankDetails[selectedTank];

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-primary/20 selection:text-primary">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-orange-50/70 via-white to-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span>Solutions</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-primary font-bold">Wet-Stock Telemetry & Audits</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">


              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Continuous Wet-Stock Audits & &nbsp;
                <span className="text-primary bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Zero Leak Tolerance
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Eliminate manual dipstick measurement inaccuracies, evaporation losses, and underground tank theft. FuelFlux connects to ATG magnetostrictive probes (Veeder-Root, OPW, Franklin Fueling) to provide continuous temperature-compensated volume tracking and automatic decantation delivery verification.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/25 hover:shadow-lg transition-all"
                >
                  Connect Tank Telemetry
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-orange-300 px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-orange-50/50 transition-all"
                >
                  ATG Probe Setup Guide
                </Link>
              </div>
            </div>

            {/* Interactive Underground Tank Gauge Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border-2 border-orange-200/90 p-6 sm:p-7 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">Underground Tank Sensor Array</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    ATG PROBES ACTIVE
                  </span>
                </div>

                {/* Tank Selector */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedTank('tank1')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedTank === 'tank1'
                        ? 'bg-orange-50 border-orange-300 text-primary shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Tank 01 (HSD Diesel)
                  </button>
                  <button
                    onClick={() => setSelectedTank('tank2')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      selectedTank === 'tank2'
                        ? 'bg-orange-50 border-orange-300 text-primary shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Tank 02 (MS Petrol)
                  </button>
                </div>

                {/* Tank Level Gauge */}
                <div className="space-y-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                    <span>{current.name}</span>
                    <span className="text-emerald-700 font-mono">
                      <AnimatedCounter end={current.currentVolume} suffix=" L" /> ({current.percentage}%)
                    </span>
                  </div>

                  {/* Level Bar */}
                  <div className="w-full h-3.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
                    <motion.div
                      key={selectedTank}
                      initial={{ width: 0 }}
                      animate={{ width: `${current.percentage}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        current.percentage > 35
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                          : 'bg-gradient-to-r from-amber-500 to-orange-500'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600">
                    <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                      <span className="text-slate-400 block text-[10px]">Temperature & Density:</span>
                      <span className="font-semibold text-slate-800">{current.temp}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white border border-slate-200/80">
                      <span className="text-slate-400 block text-[10px]">Water Bottom Dip:</span>
                      <span className="font-semibold text-slate-800">{current.waterBottom}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <span className="font-semibold">Leak Variance Audit:</span>
                  <span className="font-bold">{current.variance}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features breakdown */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold text-orange-600 tracking-wider uppercase">
              Underground Wet-Stock Telemetry
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Eliminate Tank Losses with Real-Time Telemetry
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Automatic volume correction adjusted to standard 15°C reference temperature prevents apparent loss discrepancies during day/night temperature swings.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Droplets className="h-6 w-6 text-primary" />,
                title: 'Decantation Delivery Audits',
                desc: 'When a supply tanker unloads, FuelFlux compares the invoice challan volume against actual ATG rise, catching transporter shortages under 0.10% threshold.',
              },
              {
                icon: <AlertTriangle className="h-6 w-6 text-primary" />,
                title: 'Instant Water Ingress Alarm',
                desc: 'Detects underground groundwater seepage or condensation water bottom in real time, triggering immediate nozzle lockout before water reaches vehicle fuel tanks.',
              },
              {
                icon: <Thermometer className="h-6 w-6 text-primary" />,
                title: 'Density & Temp Correction',
                desc: 'Applies standard petroleum industry volume correction factors (ASTM tables) to separate thermal expansion from physical volume leakage.',
              },
            ].map((card, idx) => (
              <div key={idx} className="bg-orange-50/40 p-8 rounded-3xl border border-orange-100 shadow-xs space-y-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-white border border-orange-200 flex items-center justify-center shadow-xs">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
