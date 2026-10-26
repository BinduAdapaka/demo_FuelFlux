'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  Users,
  Clock,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Shield,
  FileCheck,
  Smartphone,
} from 'lucide-react';

export default function ShiftAttendancePage() {
  const [shiftTotalizer, setShiftTotalizer] = useState({
    litersSold: 2450,
    rate: 89.62,
    expectedRevenue: 219569,
    cashCollected: 145000,
    digitalUPI: 54569,
    creditTab: 20000,
    variance: 0,
  });

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
            <span className="text-primary font-bold">Shift Attendance & Cash Reconciliation</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">


              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Attendant Shift Roster, &nbsp;
                <span className="text-primary bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  Nozzle Meter Settlement
                </span>
                &nbsp; & Payroll
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                End attendant short-cash arguments and shift handover delays. FuelFlux calculates expected sales automatically from pump electronic totalizers, balances cash against UPI/card receipts and fleet credit tabs, and syncs attendant working hours directly with monthly payroll.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/25 hover:shadow-lg transition-all"
                >
                  Automate Shift Settlement
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-orange-300 px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-orange-50/50 transition-all"
                >
                  Attendant App Guide
                </Link>
              </div>
            </div>

            {/* Interactive Shift Handover Settlement Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border-2 border-orange-200/90 p-6 sm:p-7 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold text-slate-900">Shift Handover Audit (Shift A: 06:00 - 14:00)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    BALANCED (0 ₹ DIFF)
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between">
                    <span className="text-slate-500">Nozzle Volume Dispensed:</span>
                    <span className="font-mono font-bold text-slate-900">2,450.00 L (@ ₹89.62/L)</span>
                  </div>

                  <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-200 text-xs flex justify-between items-center">
                    <span className="font-bold text-slate-700">Total Expected Sales:</span>
                    <span className="font-mono font-extrabold text-primary text-sm">₹ 2,19,569.00</span>
                  </div>

                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-100">
                      <span className="text-slate-600">💵 Cash Handover in Bag:</span>
                      <span className="font-mono font-bold text-slate-900">₹ 1,45,000.00</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-100">
                      <span className="text-slate-600">📱 UPI QR & POS Machine:</span>
                      <span className="font-mono font-bold text-slate-900">₹ 54,569.00</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-white border border-slate-100">
                      <span className="text-slate-600">📋 Transporter Credit Tabs (Udhaar):</span>
                      <span className="font-mono font-bold text-slate-900">₹ 20,000.00</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                    <span className="font-semibold">Attendant Shortage Status:</span>
                    <span className="font-bold">₹ 0.00 (Zero Discrepancy)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key capabilities */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold text-orange-600 tracking-wider uppercase">
              Forecourt Cash & Shift Handover
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Complete Forecourt Cash Control
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Built specifically for 24x7 multi-attendant petrol pump operations with automated salary advances and shortage adjustments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Smartphone className="h-6 w-6 text-primary" />,
                title: 'Mobile Geofenced Punch-In',
                desc: 'Attendants clock into their assigned dispenser islands using selfie/biometrics only when within the physical pump perimeter.',
              },
              {
                icon: <FileCheck className="h-6 w-6 text-primary" />,
                title: 'Instant Short-Cash Tagging',
                desc: 'If cash collected is short by even ₹50, the variance is logged automatically to the attendant’s shift ledger for transparent reconciliation.',
              },
              {
                icon: <DollarSign className="h-6 w-6 text-primary" />,
                title: 'One-Click Payroll Run',
                desc: 'Automatically compiles monthly shift counts, overtime hours, incentives for lubricant sales, and shortage deductions into pay slips.',
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
