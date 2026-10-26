'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  Layers,
  Fuel,
  CreditCard,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Cpu,
  Shield,
  Clock,
} from 'lucide-react';

export default function DispenserCrmPage() {
  const [selectedDispenser, setSelectedDispenser] = useState<number>(1);

  const dispensersData = [
    {
      id: 1,
      name: 'Dispenser MPD-01',
      nozzles: [
        { grade: 'HSD Diesel', rate: '₹ 89.62/L', totalizer: '1,84,920.40 L', flow: '41.2 L/min', status: 'Dispensing' },
        { grade: 'MS Petrol', rate: '₹ 96.72/L', totalizer: '92,410.15 L', flow: '0.0 L/min', status: 'Idle' },
      ],
      operator: 'Rajesh Sharma (Shift A)',
      creditTab: 'M/s Sharma Transport (Khata: Active)',
    },
    {
      id: 2,
      name: 'Dispenser MPD-02',
      nozzles: [
        { grade: 'Speed Diesel', rate: '₹ 94.20/L', totalizer: '68,140.80 L', flow: '38.6 L/min', status: 'Dispensing' },
        { grade: 'Power 95 Petrol', rate: '₹ 102.50/L', totalizer: '44,220.00 L', flow: '0.0 L/min', status: 'Idle' },
      ],
      operator: 'Sunil Verma (Shift A)',
      creditTab: 'City Bus Fleet Depot',
    },
  ];

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
            <span className="text-primary font-bold">Dispenser CRM & Billing</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">


              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Direct Pump Integration & &nbsp;
                <span className="text-primary bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Corporate Credit Ledger
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Connect electronic multi-product dispensers (MPDs) directly to cloud billing. Capture nozzle totalizers in real time, automate transporter credit tabs (Udhaar Khata) with custom monthly payment cycles, and generate instant GST invoices without manual ledger reconciliation.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/25 hover:shadow-lg transition-all"
                >
                  Connect Your Pumps
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-orange-300 px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-orange-50/50 transition-all"
                >
                  Protocol Integration Guide
                </Link>
              </div>
            </div>

            {/* Interactive Dispenser Monitor Widget */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border-2 border-orange-200/90 p-6 sm:p-7 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-slate-900">Forecourt Controller Monitor</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    PTS / 2-WIRE CONNECTED
                  </span>
                </div>

                {/* Switcher */}
                <div className="flex gap-2">
                  {dispensersData.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDispenser(d.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedDispenser === d.id
                          ? 'bg-orange-50 border-orange-300 text-primary shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>

                {/* Selected Dispenser Details */}
                {(() => {
                  const current = dispensersData.find((d) => d.id === selectedDispenser) || dispensersData[0];
                  return (
                    <div className="space-y-3">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between">
                        <span className="text-slate-500">Attendant Assigned:</span>
                        <span className="font-bold text-slate-900">{current.operator}</span>
                      </div>

                      <div className="space-y-2">
                        {current.nozzles.map((nz, idx) => (
                          <div key={idx} className="p-3.5 rounded-2xl border border-orange-100 bg-white shadow-2xs flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">{nz.grade}</span>
                                <span className="text-[10px] text-slate-500">({nz.rate})</span>
                              </div>
                              <div className="text-[11px] font-mono text-slate-600 mt-0.5">
                                Electronic Totalizer: {nz.totalizer}
                              </div>
                            </div>
                            <div className="text-right">
                              {nz.status === 'Dispensing' ? (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                                  {nz.flow}
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                                  Nozzle Holstered
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-3 bg-orange-50/70 border border-orange-200/80 rounded-xl flex items-center justify-between text-xs text-slate-800">
                        <span className="font-medium text-slate-600">Active Fleet Credit Tab:</span>
                        <span className="font-bold text-primary">{current.creditTab}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold text-orange-600 tracking-wider uppercase">
              Forecourt Protocols & Ledgers
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Complete Control Over Fuel Dispensing
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Engineered to support Gilbarco, Wayne, Tokheim, Midco, and Bennett forecourt dispensers without changing your pump electronics.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FileSpreadsheet className="h-6 w-6 text-primary" />,
                title: 'Automated Udhaar Ledger',
                desc: 'Eliminate paper signature chits. Every liter poured for corporate fleets automatically updates their credit ledger balance with WhatsApp invoices.',
              },
              {
                icon: <Cpu className="h-6 w-6 text-primary" />,
                title: 'Electronic Totalizer Audits',
                desc: 'Records nozzle start and end meter counts automatically at shift changes, preventing fuel siphoning and untracked volume discrepancies.',
              },
              {
                icon: <CreditCard className="h-6 w-6 text-primary" />,
                title: 'Direct POS & Card Sync',
                desc: 'Syncs pump meter outputs with POS machines, UPI QR codes, and FASTag fleet tags so attendant collections balance 100% at shift end.',
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
