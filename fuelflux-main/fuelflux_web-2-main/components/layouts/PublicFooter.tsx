'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowUpRight, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

export const PublicFooter: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="bg-gradient-to-b from-white via-orange-50/50 to-orange-100/40 text-slate-700 pt-16 pb-12 border-t border-orange-200/60 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-orange-200/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-orange-200/70">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="p-0.5 rounded-full bg-transparent group-hover:scale-105 transition-all duration-300">
                <img
                  src="/logo.svg"
                  alt="FuelFlux Logo"
                  className="h-8 w-8 object-contain rounded-full shadow-xs"
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Fuel<span className="text-primary font-black">Flux</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm">
              The unified cloud SaaS ecosystem powering modern gas station networks, autonomous ANPR fleet refueling, wet-stock telemetry, and AI price forecasting.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-white border border-emerald-200 px-3.5 py-1.5 rounded-full w-fit shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational — 99.99% Uptime
            </div>
          </div>

          {/* Column 1: Platform */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span>Platform</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/#features" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  System Features
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  About FuelFlux
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  Pricing Tiers
                </Link>
              </li>
              <li>
                <Link href="/#enterprise" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  Enterprise Automation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Solutions */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Solutions</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/solutions/anpr-camera-sync" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  ANPR Camera Sync
                </Link>
              </li>
              <li>
                <Link href="/solutions/dispenser-crm" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  Dispenser CRM & Billing
                </Link>
              </li>
              <li>
                <Link href="/solutions/wet-stock-telemetry" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  Wet-Stock Audit Alerts
                </Link>
              </li>
              <li>
                <Link href="/solutions/logistics-fleet" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  Logistics & Fleet Board
                </Link>
              </li>
              <li>
                <Link href="/solutions/shift-attendance" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  Shift Attendance & Payroll
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources & Legal */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Resources & Legal</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/support" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/employee/login" className="text-slate-600 hover:text-primary font-semibold transition-colors duration-200">
                  Employee Self-Service
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-600 hover:text-primary font-semibold transition-colors duration-200">
                  Admin Control Center
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-600 hover:text-primary font-medium transition-colors duration-200">
                  Company Story
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} FuelFlux Inc. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Unified Forecourt Telemetry & Enterprise Energy Cloud</span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};
