'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  Camera,
  Truck,
  Zap,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Clock,
  FileText,
  CreditCard,
  AlertCircle,
  Cpu,
  ChevronRight,
} from 'lucide-react';

export default function AnprCameraSyncPage() {
  const [activePlate, setActivePlate] = useState('MH 12 RN 8842');
  const [simulatedStatus, setSimulatedStatus] = useState<'idle' | 'scanning' | 'authorized'>('authorized');

  const sampleFleets: Record<string, { company: string; quota: string; status: string; fuel: string }> = {
    'MH 12 RN 8842': { company: 'Express Logistics Corp', quota: '₹ 2,50,000', status: 'Pre-Approved', fuel: 'HSD Diesel' },
    'DL 01 AB 9021': { company: 'North Star Transport', quota: '₹ 1,75,000', status: 'Pre-Approved', fuel: 'HSD Diesel' },
    'KA 05 MM 4410': { company: 'Apex Cold Chain Logistics', quota: '₹ 3,00,000', status: 'Pre-Approved', fuel: 'Speed Diesel' },
  };

  const handleSimulate = (plate: string) => {
    setActivePlate(plate);
    setSimulatedStatus('scanning');
    setTimeout(() => {
      setSimulatedStatus('authorized');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-primary/20 selection:text-primary">
      <PublicNavbar />

      {/* Breadcrumb & Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-orange-50/70 via-white to-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span>Solutions</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-primary font-bold">ANPR Camera Sync</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">


              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                ANPR Camera Recognition &nbsp;
                <span className="text-primary bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                  for Commercial Fleets
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Replace manual credit chits and driver OTP verification with automatic license plate recognition at pump islands. When an enrolled logistics truck pulls up, FuelFlux matches the plate in 200ms and pre-authorizes the dispenser up to the carrier's corporate credit limit.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/25 hover:shadow-lg transition-all"
                >
                  Deploy ANPR at Your Station
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/support"
                  className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-orange-300 px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-orange-50/50 transition-all"
                >
                  Camera Compatibility List
                </Link>
              </div>
            </div>

            {/* Interactive Live Demo Scanner */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl border-2 border-orange-200/90 p-6 sm:p-7 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-900">Dispenser Camera Feed (Nozzle #4)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    LIVE RECOGNITION
                  </span>
                </div>

                {/* Plate selector buttons */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Select Test Commercial Vehicle:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(sampleFleets).map((plate) => (
                      <button
                        key={plate}
                        onClick={() => handleSimulate(plate)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer ${
                          activePlate === plate
                            ? 'bg-amber-300 border-amber-400 text-slate-950 shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-orange-50'
                        }`}
                      >
                        {plate}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Camera Scanner Box */}
                <div className="bg-slate-900 rounded-2xl p-4 text-white space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono">OCR Confidence: 99.8%</span>
                    <span className="text-emerald-400 font-mono">Latency: 180ms</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-800/90 border border-slate-700 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-mono font-black text-sm">
                        {activePlate}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{sampleFleets[activePlate].company}</div>
                        <div className="text-[10px] text-slate-400">Fuel Grade: {sampleFleets[activePlate].fuel}</div>
                      </div>
                    </div>
                    {simulatedStatus === 'authorized' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    ) : (
                      <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                    <span className="text-slate-400">Transporter Credit Balance:</span>
                    <span className="font-mono font-bold text-amber-300">{sampleFleets[activePlate].quota}</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                  <span className="font-semibold">Dispenser Status:</span>
                  <span className="font-bold">UNLOCKED (Auto-Stops at Quota)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="py-12 bg-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
              <div className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter end={1.8} decimals={1} prefix="< " suffix="s" />
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Average Plate Recognition Speed</div>
            </div>
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
              <div className="text-3xl font-extrabold text-primary">
                <AnimatedCounter end={0} suffix=" Manual Chits" />
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Zero Paperwork For Drivers</div>
            </div>
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
              <div className="text-3xl font-extrabold text-slate-900">
                <AnimatedCounter end={65} suffix="% Turnaround" />
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Faster Forecourt Lane Clearance</div>
            </div>
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100">
              <div className="text-3xl font-extrabold text-primary">
                <AnimatedCounter end={100} suffix="% Reconciled" />
              </div>
              <div className="text-xs font-semibold text-slate-600 mt-1">Automatic B2B GST Invoicing</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Operational Workflow */}
      <section className="py-20 bg-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold text-orange-600 tracking-wider uppercase">
              Island Automation Workflow
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              From Island Pull-Up to Automated Invoice
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Designed for high-traffic highway fuel stations servicing hundreds of commercial trucks every hour.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'High-Speed Plate Capture',
                desc: 'IP cameras mounted on dispenser canopies capture front and rear plates under all lighting and dust conditions in under 200 milliseconds.',
              },
              {
                step: '02',
                title: 'Credit Limit Verification',
                desc: 'FuelFlux verifies the vehicle registration number against the fleet transporter’s active credit wallet, authorized fuel grades, and daily volume cap.',
              },
              {
                step: '03',
                title: 'Instant Dispense & Digital Challan',
                desc: 'Nozzle unlocks automatically. Once the nozzle clicks off, the exact volume and meter reading are billed directly to the transporter with an instant WhatsApp & SMS challan.',
              },
            ].map((card, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-orange-100 shadow-sm space-y-4 text-left">
                <span className="text-2xl font-black text-primary/40">{card.step}</span>
                <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gradient-to-r from-orange-500 via-primary to-amber-500 rounded-3xl p-10 sm:p-14 text-white space-y-6 shadow-xl shadow-orange-500/20">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Ready to Speed Up Your Fleet Fueling Lanes?</h2>
            <p className="text-orange-100 text-sm sm:text-base max-w-xl mx-auto">
              FuelFlux works with existing RTSP IP cameras and forecourt controllers. Schedule a live station pilot today.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/register"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all"
              >
                Get Started Free
              </Link>
              <Link
                href="/support"
                className="px-6 py-3.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-md transition-all"
              >
                Talk to Forecourt Engineers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
