'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PublicNavbar } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Activity,
  CreditCard,
  ChevronDown,
  Mail,
  Send,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    {
      icon: <Activity className="h-6 w-6" />,
      title: 'Wet-Stock & Telemetry',
      desc: 'Guide on tank sensor setup, calibration, alert thresholds, and leak detection protocols.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: 'ANPR & Camera Sync',
      desc: 'Troubleshooting plate recognition cameras, nozzle trigger delays, and corporate fleet matching.',
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Billing & Subscriptions',
      desc: 'Managing station licensing tiers, invoices, corporate credit tabs, and payment gateway setup.',
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: 'Multi-Role User Access',
      desc: 'Setting permissions for Station Managers, Attendants, Logistics Operators, and Auditors.',
    },
  ];

  const faqs = [
    {
      q: 'How does FuelFlux integrate with existing dispenser pumps?',
      a: 'FuelFlux interfaces with standard dispenser protocols (PTS, Gilbarco, Wayne, Tokheim) via edge IoT gateway hardware or direct IP network connections. Setup typically takes under 2 hours per station.',
    },
    {
      q: 'What happens if the station loses internet connectivity?',
      a: 'The local FuelFlux Edge gateway continues recording dispenser transactions, tank sensor dips, and ANPR matches locally. As soon as connectivity is restored, all logs automatically synchronize with the cloud console without data loss.',
    },
    {
      q: 'How fast is the ANPR license plate recognition?',
      a: 'Our optimized computer-vision pipeline recognizes license plates in under 200 milliseconds. When a fleet truck pulls up to a nozzle, credit verification and authorization finish before the driver inserts the nozzle.',
    },
    {
      q: 'Can I set up custom alert thresholds for wet-stock losses?',
      a: 'Yes! You can set precise variance thresholds (% per hour or total liters). If a tank experiences abnormal variance indicating potential leakage or theft, immediate SMS, email, and dashboard alerts trigger automatic nozzle safety lockouts if configured.',
    },
    {
      q: 'Is my station telemetry data secure and private?',
      a: 'All data in transit is encrypted via TLS 1.3, and all tank logs & financial records at rest are encrypted with AES-256. Each enterprise customer operates on an isolated data environment with strict role-based access control.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-primary/20 selection:text-primary">
      <PublicNavbar />

      {/* Hero Search Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-orange-50/60 via-white to-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="inline-flex items-center gap-2 bg-orange-100/70 border border-orange-200/50 px-3.5 py-1.5 rounded-full text-xs font-bold text-primary">
            <HelpCircle className="h-3.5 w-3.5" />
            FuelFlux Support Center
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            How Can We Help You Today?
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto">
            Search our knowledge base or browse setup guides for tank telemetry, ANPR integration, and billing console.
          </p>

          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto pt-4">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, ANPR guides, tank calibration..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-100 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Knowledge Base Topics</h2>
            <p className="text-slate-600 text-sm">Select a category to explore detailed step-by-step documentation.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:border-orange-300 transition-all cursor-pointer space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-primary flex items-center justify-center border border-orange-200 group-hover:bg-orange-100 group-hover:border-orange-300 group-hover:scale-105 transition-all duration-300">
                  {cat.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Got Questions? We Have Answers.</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left font-bold text-slate-900 text-base flex justify-between items-center gap-4 hover:text-primary transition-colors focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-primary flex items-center justify-center mx-auto mb-2 border border-orange-100">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Still Need Help? Contact Support</h2>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                Submit a ticket below and our 24/7 technical engineering team will reply within 30 minutes.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3 animate-fade-in">
                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
                <h4 className="text-base font-bold text-emerald-900">Support Ticket Received!</h4>
                <p className="text-xs text-emerald-700">
                  Thank you. Reference ID #FF-TICKET-8492 has been dispatched to our engineering desk.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arun Mehta"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Work Email</label>
                    <input
                      type="email"
                      required
                      placeholder="arun@fuelstation.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Issue Category</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-slate-700">
                    <option>Tank Telemetry & Sensor Calibration</option>
                    <option>ANPR Camera Hardware Sync</option>
                    <option>Billing & Subscription Licensing</option>
                    <option>Shift Attendance & Payroll</option>
                    <option>General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message Details</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your question or station configuration..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm shadow-md shadow-primary/25 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Submit Support Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
