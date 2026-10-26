'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import {
  Code,
  Terminal,
  Key,
  Database,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Zap,
} from 'lucide-react';

export default function ApiDocsPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'tanks' | 'anpr' | 'dispensers'>('tanks');

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/tanks/levels',
      title: 'Get Real-Time Tank Telemetry',
      desc: 'Retrieves active fuel volume, water bottom level, temperature, and leak flags for all configured tanks across stations.',
    },
    {
      method: 'POST',
      path: '/api/v1/anpr/authorize',
      title: 'ANPR Plate Match & Authorization',
      desc: 'Validates license plate against registered corporate fleet accounts and approves nozzle dispense limit in real time.',
    },
    {
      method: 'GET',
      path: '/api/v1/dispensers/speed',
      title: 'Dispenser Flow & Nozzle Telemetry',
      desc: 'Monitors instantaneous flow rates (liters/min), nozzle status (active/idle), and total cumulative counter dip.',
    },
    {
      method: 'POST',
      path: '/api/v1/shifts/reconcile',
      title: 'Shift Audit & Attendant Sync',
      desc: 'Automates shift closing audit by comparing cash collected vs digital POS meter readings for each attendant.',
    },
  ];

  const codeSnippets = {
    tanks: `// GET /api/v1/tanks/levels
const response = await fetch('https://api.fuelflux.io/v1/tanks/levels', {
  headers: {
    'Authorization': 'Bearer ff_live_9f82d7a12b4e',
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data);

/* Response Output:
{
  "status": "success",
  "stationId": "STN-MH-4001",
  "tanks": [
    { "id": "TANK-01", "fuelType": "MS Diesel", "volumeLiters": 18450, "capacity": 20000, "status": "OPTIMAL" },
    { "id": "TANK-02", "fuelType": "XP95 Petrol", "volumeLiters": 14200, "capacity": 15000, "status": "OPTIMAL" }
  ]
}
*/`,
    anpr: `// POST /api/v1/anpr/authorize
const response = await fetch('https://api.fuelflux.io/v1/anpr/authorize', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ff_live_9f82d7a12b4e',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    plateNumber: "MH02CB4920",
    pumpId: "PUMP-04",
    cameraConfidence: 0.98
  })
});
const result = await response.json();

/* Response Output:
{
  "authorized": true,
  "fleetCompany": "Apex Freight Logistics",
  "creditBalance": 150000,
  "maxDispenseLiters": 200,
  "authCode": "AUTH-99201"
}
*/`,
    dispensers: `// GET /api/v1/dispensers/speed
const response = await fetch('https://api.fuelflux.io/v1/dispensers/speed?pumpId=PUMP-04', {
  headers: { 'Authorization': 'Bearer ff_live_9f82d7a12b4e' }
});
const telemetry = await response.json();

/* Response Output:
{
  "pumpId": "PUMP-04",
  "nozzleStatus": "DISPENSING",
  "currentFlowRate": "42.5 L/min",
  "totalSessionLiters": 85.2,
  "healthStatus": "EXCELLENT"
}
*/`,
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-primary/20 selection:text-primary">
      <PublicNavbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-orange-50/70 via-white to-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-primary shadow-xs">
            <Terminal className="h-3.5 w-3.5" />
            FuelFlux REST & Telemetry API v2.4
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
            Developer API Documentation
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Integrate FuelFlux IoT tank telemetry, ANPR plate recognition, and dispenser CRMs directly into your custom ERP systems.
          </p>
        </div>
      </section>

      {/* Auth & Rate Limits Section */}
      <section className="py-16 bg-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-6">
          <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 space-y-3 hover:border-orange-300 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-primary flex items-center justify-center">
              <Key className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Bearer Token Auth</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pass your API token in the <code className="bg-orange-100/80 text-orange-900 px-1.5 py-0.5 rounded text-[11px] font-semibold">Authorization</code> header with every request: <code className="bg-orange-100/80 text-orange-900 px-1.5 py-0.5 rounded text-[11px] font-semibold">Bearer ff_live_...</code>
            </p>
          </div>

          <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 space-y-3 hover:border-orange-300 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-primary flex items-center justify-center">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Sub-Second Latency</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ANPR camera verification endpoints respond in under 50ms over global edge locations for smooth nozzle authorization.
            </p>
          </div>

          <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 space-y-3 hover:border-orange-300 transition-colors shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-primary flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Rate Limiting</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard tier allows up to 10,000 requests/minute. Enterprise tier offers unlimited throughput with dedicated instances.
            </p>
          </div>
        </div>
      </section>

      {/* Code Playground Section */}
      <section className="py-20 bg-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase bg-orange-100 px-3 py-1 rounded-full">LIVE CODE EXAMPLES</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Explore API Code Snippets</h2>
          </div>

          <div className="bg-slate-900 rounded-3xl border-2 border-orange-200/80 shadow-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/80 px-6 pt-4 gap-4">
              {[
                { id: 'tanks', label: 'Tank Telemetry' },
                { id: 'anpr', label: 'ANPR Authorization' },
                { id: 'dispensers', label: 'Dispenser Speed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 text-xs font-bold transition-all relative ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Code view */}
            <div className="p-6 relative">
              <button
                type="button"
                onClick={() => copyCode(codeSnippets[activeTab], 99)}
                className="absolute top-8 right-8 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                {copiedIndex === 99 ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedIndex === 99 ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <pre className="font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto p-4 bg-slate-950 rounded-xl leading-relaxed">
                <code>{codeSnippets[activeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Endpoints List */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Core REST Endpoints</h2>
            <p className="text-slate-600 text-sm">Comprehensive list of available JSON API endpoints.</p>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            {endpoints.map((ep, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-orange-100 bg-white shadow-xs hover:shadow-md hover:border-orange-300 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-black tracking-wider ${
                        ep.method === 'GET'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-orange-100 text-orange-800 border border-orange-200'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <code className="font-mono text-xs sm:text-sm font-bold text-slate-900">{ep.path}</code>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCode(ep.path, idx)}
                    className="text-slate-400 hover:text-primary transition-colors p-1"
                    title="Copy endpoint path"
                  >
                    {copiedIndex === idx ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{ep.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{ep.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
