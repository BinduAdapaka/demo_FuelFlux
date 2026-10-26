'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  Fuel,
  ShieldCheck,
  TrendingUp,
  Users,
  Activity,
  Award,
  Globe,
  Zap,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function AboutPage() {
  const pillars = [
    {
      icon: <Activity className="h-6 w-6" />,
      title: 'Wet-Stock Telemetry',
      desc: 'Eliminating wet-stock losses and dipstick inaccuracies with continuous high-precision tank sensor tracking and instant alerts.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: 'ANPR Autonomous Checkout',
      desc: 'Smart plate recognition cameras integrated at fuel nozzles to speed up fleet refueling checkouts down to under 2 seconds.',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Predictive Price Analytics',
      desc: 'Machine-learning models analyzing local pricing trends to help station owners optimize purchase orders and margins.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Multi-Role Governance',
      desc: 'Tailored consoles for station owners, logistics carriers, attendants, and investors with role-based access control.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-primary/20 selection:text-primary">
      <PublicNavbar />

      {/* Hero Header */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-orange-50/70 via-white to-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-4"
          >
            Engineering Forecourt Intelligence
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight"
          >
            Reinventing How Gasoline Networks & Logistics &nbsp;
            <span className="text-primary bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Operate.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed"
          >
            FuelFlux was engineered to replace fragmented legacy point-of-sale systems with a unified cloud ecosystem. From IoT tank sensors to ANPR dispenser checkouts, we bring complete transparency to energy distribution.
          </motion.p>
        </div>
      </section>

      {/* Stats Bar with animated numbers from zero */}
      <section className="py-12 bg-gradient-to-r from-orange-500 via-primary to-amber-500 text-white shadow-lg shadow-orange-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/20">
            <div className="pt-2">
              <div className="text-3xl sm:text-4xl font-black text-white">
                <AnimatedCounter end={450} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-orange-100 mt-1">Fuel Stations Networked</div>
            </div>
            <div className="pt-6 lg:pt-2">
              <div className="text-3xl sm:text-4xl font-black text-white">
                <AnimatedCounter end={15} suffix="M+" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-orange-100 mt-1">Daily Fuel Liters Telemetered</div>
            </div>
            <div className="pt-6 lg:pt-2">
              <div className="text-3xl sm:text-4xl font-black text-white">
                <AnimatedCounter end={99.9} decimals={1} suffix="%" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-orange-100 mt-1">Audit Accuracy Rate</div>
            </div>
            <div className="pt-6 lg:pt-2">
              <div className="text-3xl sm:text-4xl font-black text-white">
                <AnimatedCounter end={2.0} decimals={1} prefix="< " suffix="s" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-orange-100 mt-1">ANPR Checkout Speed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-primary tracking-widest uppercase bg-orange-100 px-3 py-1 rounded-full">OUR MISSION</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Eliminating Fuel Losses & Manual Errors with Cloud Automation
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Traditional fuel retail faces wet-stock leakage, slow manual reconciliation, dipstick measurement errors, and fraud at dispenser nozzles. FuelFlux connects pump hardware directly to cloud telemetry, enabling automated audits and instantaneous corporate fleet checkouts.
            </p>
            <div className="space-y-3 pt-2">
              {[
                'Automated wet-stock loss alerts prevent environmental hazards and financial leaks.',
                'AI-driven ANPR camera matching accelerates corporate fleet checkouts.',
                'Real-time shift management and payroll integration for attendants.',
                'End-to-end encrypted API interfaces for custom ERP & pump hardware.',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-8 sm:p-10 rounded-3xl border border-orange-200 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
                <Fuel className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Built for Scale & Reliability</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                "Our platform is engineered with fail-safe edge caching, ensuring your station nozzles never stop dispensing even during internet interruptions. When connection restores, telemetry syncs seamlessly."
              </p>
              <div className="pt-4 border-t border-orange-200/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                  FF
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">FuelFlux Core Engineering</div>
                  <div className="text-[11px] text-slate-500">Enterprise Systems Division</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-20 bg-orange-50/40 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-bold text-orange-600 tracking-wider uppercase">Platform Pillars</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Designed for Modern Energy Operations</h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Explore how FuelFlux transforms every node of the gasoline and logistics value chain.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 space-y-4 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-primary flex items-center justify-center border border-orange-200 group-hover:bg-orange-100 group-hover:border-orange-300 group-hover:scale-105 transition-all duration-300">
                  {p.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">{p.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gradient-to-r from-orange-500 via-primary to-amber-500 rounded-3xl p-10 sm:p-14 text-white relative overflow-hidden shadow-2xl shadow-orange-500/25 space-y-6">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-3xl sm:text-4xl font-extrabold max-w-xl mx-auto leading-tight">
              Ready to Upgrade Your Station Operations?
            </h2>
            <p className="text-orange-100 text-sm max-w-md mx-auto leading-relaxed">
              Start your 14-day unrestricted trial today and experience unified telemetry, ANPR fleet checkout, and multi-role dashboards.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-xl bg-white hover:bg-orange-50 px-6 py-3.5 font-bold text-sm text-slate-900 shadow-lg hover:-translate-y-0.5 transition-all gap-2"
              >
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-orange-700/60 hover:bg-orange-700/80 border border-white/40 px-6 py-3.5 font-bold text-sm text-white transition-all hover:-translate-y-0.5"
              >
                Access Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
