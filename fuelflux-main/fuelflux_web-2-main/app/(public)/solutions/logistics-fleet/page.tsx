'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Shield,
  Layers,
  Fuel,
  TrendingUp,
} from 'lucide-react';

export default function LogisticsFleetPage() {
  const activeShipments = [
    {
      id: 'DISP-8921',
      tanker: 'MH 14 BG 7710 (20KL Capacity)',
      product: '12,000L HSD Diesel + 8,000L MS Petrol',
      origin: 'IOCL Panvel Terminal',
      destination: 'FuelFlux Station #04 – Highway 48',
      eta: '45 mins (ETA 08:30 PM)',
      status: 'In Transit',
      driver: 'Mahesh Patil (+91 98231 XXXXX)',
    },
    {
      id: 'DISP-8922',
      tanker: 'MH 04 ER 3320 (12KL Capacity)',
      product: '12,000L High-Speed Diesel',
      origin: 'BPCL JNPT Terminal',
      destination: 'FuelFlux Express #09 – Industrial Zone',
      eta: 'Decanting at Station Bay #2',
      status: 'Decanting',
      driver: 'Kiran Shinde (+91 97654 XXXXX)',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-primary/20 selection:text-primary">
      <PublicNavbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-orange-50/70 via-white to-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span>Solutions</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-primary font-bold">Logistics & Tanker Fleet Board</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-primary">
                <Truck className="h-3.5 w-3.5" />
                End-to-End Fuel Supply Chain Telemetry
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Tanker Dispatch, Route GPS & &nbsp;
                <span className="text-primary bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Automated Tank Refills
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Unify refinery supply depot indents, tanker truck GPS dispatch schedules, and automatic low-stock purchase orders. When station tanks fall below your custom 20% safety threshold, FuelFlux triggers optimized carrier replenishment indents without stock-outs.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/25 hover:shadow-lg transition-all"
                >
                  Streamline Your Fleet Indents
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-orange-300 px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-orange-50/50 transition-all"
                >
                  Fleet Carrier Portal
                </Link>
              </div>
            </div>

            {/* Interactive Logistics Board Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border-2 border-orange-200/90 p-6 sm:p-7 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-slate-900">Live Supply Tanker Radar</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                    2 TANKERS ACTIVE
                  </span>
                </div>

                <div className="space-y-3">
                  {activeShipments.map((s) => (
                    <div key={s.id} className="p-4 rounded-2xl border border-orange-100 bg-orange-50/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{s.tanker}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          s.status === 'In Transit'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {s.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 space-y-0.5">
                        <div><strong className="text-slate-700">Load:</strong> {s.product}</div>
                        <div><strong className="text-slate-700">Route:</strong> {s.origin} → {s.destination}</div>
                        <div><strong className="text-slate-700">ETA:</strong> {s.eta}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-white border border-orange-200 rounded-xl flex items-center justify-between text-xs text-slate-800">
                  <span className="font-semibold text-slate-600">Refill Reorder Status:</span>
                  <span className="font-bold text-primary">Automated Indents Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase bg-orange-100 px-3 py-1 rounded-full">
              AUTOMATED LOGISTICS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Zero Dry Runs, Zero Delivery Shortages
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Synchronized directly with Indian Oil, Bharat Petroleum, Hindustan Petroleum, Shell, and Nayara terminal loading slips.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              {
                step: '01',
                title: 'Predictive Order Triggers',
                desc: 'AI forecasts daily consumption based on day-of-week traffic and local highway freight trends, creating refinery indents automatically.',
              },
              {
                step: '02',
                title: 'Tanker Geo-Fencing & Seal Check',
                desc: 'Tracks driver location, geo-fenced bay arrivals, and digital OTP tank compartment valve unlocking for maximum anti-theft security.',
              },
              {
                step: '03',
                title: 'Decantation Reconciliation',
                desc: 'Direct ATG sensor verification ensures every single liter delivered from Panvel/JNPT terminals is accurately logged into your station inventory.',
              },
            ].map((c, idx) => (
              <div key={idx} className="bg-orange-50/40 p-8 rounded-3xl border border-orange-100 shadow-xs space-y-4">
                <span className="text-2xl font-black text-primary/40">{c.step}</span>
                <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
