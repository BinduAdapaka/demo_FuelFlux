'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { FileCheck, ShieldAlert, Award, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-primary/20 selection:text-primary">
      <PublicNavbar />

      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-orange-50/50 via-white to-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-2 bg-orange-100/70 border border-orange-200/50 px-3.5 py-1.5 rounded-full text-xs font-bold text-primary">
            <Scale className="h-3.5 w-3.5" />
            Legal Agreement
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Effective Date: January 1, 2026 • FuelFlux Customer Master Services Agreement
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 leading-relaxed text-slate-700">
          <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Agreement Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              By accessing, subscribing to, or integrating your gas station hardware with the FuelFlux SaaS platform, you agree to comply with and be bound by these Master Terms & Conditions.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">1. SaaS License Grant & Station Access</h2>
            <p className="text-sm">
              FuelFlux grants you a non-exclusive, non-transferable, worldwide license to access and use our web platform, mobile applications, and edge telemetry APIs according to your selected subscription tier (Standard, Professional, or Enterprise).
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">2. Telemetry SLA & 99.9% Uptime Guarantee</h2>
            <p className="text-sm">
              We guarantee a 99.9% uptime Service Level Agreement for cloud console availability. In the event of network disruption, local edge gateways store pump dips and ANPR logs, automatically resynchronizing upon connection restoration.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">3. Customer Responsibilities & Hardware Maintenance</h2>
            <p className="text-sm">
              Customers are responsible for maintaining hardware connections (sensor cabling, ANPR camera lenses, dispenser interface units) in good working order. FuelFlux provides remote diagnostic tools but is not liable for physical sensor damage or power outages at station sites.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">4. Subscription Billing & Payment Terms</h2>
            <p className="text-sm">
              Subscription fees are billed monthly or annually in advance. Tier upgrades take effect immediately with pro-rated billing. Accounts with overdue balances exceeding 30 days may experience restricted telemetry access until reconciled.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">5. Limitation of Liability</h2>
            <p className="text-sm">
              FuelFlux provides predictive analytics, automated audits, and pricing suggestions as operational aids. To the maximum extent permitted by law, FuelFlux shall not be liable for indirect, incidental, or consequential damages arising from physical fuel spills or local pump hardware failures.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">6. Governing Law & Dispute Resolution</h2>
            <p className="text-sm">
              This Agreement is governed by the laws of the jurisdiction in which your enterprise account is registered. Any disputes shall be resolved through binding arbitration.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
