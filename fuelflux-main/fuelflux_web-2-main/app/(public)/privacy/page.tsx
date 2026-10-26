'use client';

import React from 'react';
import Link from 'next/link';
import { PublicNavbar } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-primary/20 selection:text-primary">
      <PublicNavbar />

      {/* Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-orange-50/50 via-white to-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-2 bg-orange-100/70 border border-orange-200/50 px-3.5 py-1.5 rounded-full text-xs font-bold text-primary">
            <Lock className="h-3.5 w-3.5" />
            Security & Trust
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Last Updated: January 15, 2026 • FuelFlux Governance & Compliance
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 leading-relaxed text-slate-700">
          <div className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200/80 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Our Privacy Commitment
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              FuelFlux Inc. ("FuelFlux", "we", "our") is dedicated to protecting the confidentiality, security, and integrity of telemetry data, ANPR camera feeds, financial records, and employee shift logs processed across our station management software.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">1. Information We Collect</h2>
            <p className="text-sm">
              We collect data necessary to provide decentralized station management, telemetry monitoring, and automated dispenser billing:
            </p>
            <ul className="space-y-2 text-sm pl-4 list-disc text-slate-600">
              <li>
                <strong>Station Telemetry Data:</strong> Real-time fuel tank levels, flow rates, wet-stock dip levels, water bottom warnings, and dispenser status.
              </li>
              <li>
                <strong>ANPR Camera Logs:</strong> Vehicle license plate alphanumeric strings, camera confidence scores, and timestamped nozzle authorization records.
              </li>
              <li>
                <strong>Account & User Data:</strong> Contact information, station ownership credentials, employee shift logs, and role-based permissions.
              </li>
              <li>
                <strong>Financial & Credit Records:</strong> Corporate fleet credit balances, nozzle transaction totals, and payment reconciliation logs.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">2. How We Use Information</h2>
            <p className="text-sm">
              Collected information is strictly utilized to operate and improve your station network:
            </p>
            <ul className="space-y-2 text-sm pl-4 list-disc text-slate-600">
              <li>Authorizing nozzle dispensation based on corporate credit limits and ANPR matches.</li>
              <li>Detecting wet-stock leakage, tank anomalies, and sending real-time safety alerts.</li>
              <li>Synchronizing attendant shift check-ins and calculating automated payroll modules.</li>
              <li>Generating predictive AI market price analytics for fuel replenishment.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">3. ANPR Camera Feed & License Plate Storage</h2>
            <p className="text-sm">
              License plate data recognized by edge cameras is processed instantly for corporate fleet authorization. Alphanumeric plate records associated with corporate tabs are encrypted with AES-256 and retained solely for audit logging. Unregistered vehicle plates are purged within 30 days unless required for law enforcement compliance.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">4. Data Encryption & Security Standards</h2>
            <p className="text-sm">
              FuelFlux implements enterprise-grade security architecture:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="text-xs font-bold text-slate-900">Encryption in Transit</div>
                <div className="text-xs text-slate-600">TLS 1.3 encryption for all telemetry signals and web console sessions.</div>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                <div className="text-xs font-bold text-slate-900">Encryption at Rest</div>
                <div className="text-xs text-slate-600">AES-256 bit storage encryption for all database clusters.</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">5. Contact Information</h2>
            <p className="text-sm">
              If you have questions regarding this Privacy Policy or wish to request a data audit, please contact our Data Protection Officer at:
            </p>
            <div className="p-4 rounded-xl bg-slate-100 font-mono text-xs text-slate-800">
              Email: privacy@fuelflux.io • Data Officer, FuelFlux Inc., San Francisco CA & Mumbai India.
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
