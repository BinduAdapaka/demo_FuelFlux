'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PublicNavbar } from '@/components/layouts/PublicNavbar';
import { PublicFooter } from '@/components/layouts/PublicFooter';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import {
  Fuel,
  ArrowRight,
  Shield,
  Activity,
  Users,
  Layers,
  TrendingUp,
  Truck,
  Check,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Globe,
  Clock,
  Cpu,
  BarChart3,
  Building2,
  Lock,
  Workflow,
  ArrowUpRight,
  Radio,
  Server,
  Layers3,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  platformContentService,
  PlatformStats,
  PlatformTestimonialItem,
} from '@/services/platformContent.service';

const DEFAULT_TESTIMONIALS: PlatformTestimonialItem[] = [
  {
    id: '1',
    quote:
      'FuelFlux completely streamlined our operations. We sync inventory refills across 4 stations, audit employee check-ins effortlessly, and manage client credit tabs in one console. Incredible architecture!',
    author: 'Arun Mehta',
    role: 'Owner & Managing Director',
    company: 'Bharat Petroleum Cluster',
    initials: 'AM',
    stars: 5,
    highlight: 'Synced 4 Stations',
    is_active: true,
    display_order: 1,
  },
  {
    id: '2',
    quote:
      'As a Logistics Director, coordinating driver rosters and tanker dispatch routes was chaotic. With the unified dashboard operations, fuel supply schedules became predictive. A master-class in SaaS UI.',
    author: 'Sandra Collins',
    role: 'VP of Logistics',
    company: 'Apex Fuel Carriers',
    initials: 'SC',
    stars: 5,
    highlight: 'Predictive Tanker Dispatch',
    is_active: true,
    display_order: 2,
  },
  {
    id: '3',
    quote:
      'The ANPR loyalty dashboard increased return-rates by 18% in the first three months. Our business clients love the automatic plate recognition and credit invoices. Clean interface and responsive support.',
    author: 'Gautam Krishnan',
    role: 'Managing Director',
    company: 'GK Gas Networks',
    initials: 'GK',
    stars: 5,
    highlight: '+18% Loyalty Retention',
    is_active: true,
    display_order: 3,
  },
  {
    id: '4',
    quote:
      'The wet-stock audit alerts alone saved us over ₹4.5 Lakhs in prevented tank leakage within 60 days. The continuous telemetry and automatic shut-off triggers give our team 100% peace of mind.',
    author: 'Rajesh Patel',
    role: 'Operations Lead',
    company: 'Reliance Logistics Network',
    initials: 'RP',
    stars: 5,
    highlight: 'Saved ₹4.5L Leak Loss',
    is_active: true,
    display_order: 4,
  },
  {
    id: '5',
    quote:
      'Managing employee shift check-ins, cash reconciliation, and dispenser CRM on a single dashboard has reduced our end-of-day audit time from 3 hours to less than 15 minutes per site.',
    author: 'Elena Rostova',
    role: 'Fleet & Retail Operations Head',
    company: 'TransGlobal Energy',
    initials: 'ER',
    stars: 5,
    highlight: 'Audit Time: 3h → 15m',
    is_active: true,
    display_order: 5,
  },
];

export default function LandingPage() {
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState<PlatformTestimonialItem[]>(DEFAULT_TESTIMONIALS);
  const [platformStats, setPlatformStats] = useState<PlatformStats>({
    fuel_stations: 450,
    active_vehicles: 2850,
    total_transactions: 84200,
    connected_users: 12500,
    liters_telemetered_millions: 15.4,
    uptime_percentage: 99.98,
    checkout_speed_sec: 1.8,
  });

  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('professional');

  // Fetch live stats & testimonials from backend
  useEffect(() => {
    let isMounted = true;
    platformContentService
      .getPublicStats()
      .then((data) => {
        if (isMounted && data) {
          setPlatformStats(data);
        }
      })
      .catch((err) => console.log('Stats fetch note:', err));

    platformContentService
      .getPublicTestimonials()
      .then((items) => {
        if (isMounted && items && items.length > 0) {
          setTestimonials(items);
        }
      })
      .catch((err) => console.log('Testimonials fetch note:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const pricingTiers = [
    {
      id: 'standard',
      name: t('planStandardName', 'Standard'),
      description: t('planStandardDesc', 'For single-site station operators.'),
      price: t('planStandardPrice', '₹89'),
      unit: t('planStandardUnit', '/month'),
      badge: t('planStandardBadge', 'STARTER'),
      cta: t('planStandardCta', 'Choose Plan'),
      features: [
        t('planStandardFeat1', '1 Active Fuel Station'),
        t('planStandardFeat2', 'Standard Dispenser CRM'),
        t('planStandardFeat3', 'Wet-stock Inventory Tracking'),
        t('planStandardFeat4', 'Email & SMS Support'),
      ],
    },
    {
      id: 'professional',
      name: t('planProfessionalName', 'Professional'),
      description: t('planProfessionalDesc', 'Best for expanding station groups.'),
      price: t('planProfessionalPrice', '₹249'),
      unit: t('planProfessionalUnit', '/month'),
      badge: t('planProfessionalBadge', 'POPULAR'),
      cta: t('planProfessionalCta', 'Get Started'),
      features: [
        t('planProfessionalFeat1', 'Up to 5 Fuel Stations'),
        t('planProfessionalFeat2', 'Full Logistic & Fleet tracking'),
        t('planProfessionalFeat3', 'ANPR Matches and Analytics'),
        t('planProfessionalFeat4', 'Priority 24/7 Service Calls'),
      ],
    },
    {
      id: 'enterprise',
      name: t('planEnterpriseName', 'Enterprise'),
      description: t('planEnterpriseDesc', 'For multi-region fuel enterprises.'),
      price: t('planEnterprisePrice', 'Custom'),
      unit: '',
      badge: t('planEnterpriseBadge', 'ENTERPRISE'),
      cta: t('planEnterpriseCta', 'Contact Sales'),
      features: [
        t('planEnterpriseFeat1', 'Unlimited Fuel Stations'),
        t('planEnterpriseFeat2', 'Dedicated Database Instance'),
        t('planEnterpriseFeat3', 'Custom IoT Pump Integrations'),
        t('planEnterpriseFeat4', 'Assigned Success Managers'),
      ],
    },
  ];

  useEffect(() => {
    if (isTestimonialPaused) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isTestimonialPaused, testimonials.length]);

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  // --- SYSTEM FEATURES ---
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: t('featShiftTitle', 'Shift Attendance & Payroll'),
      desc: t('featShiftDesc', 'Real-time shift scheduling, attendant mobile punch-ins, and nozzle totalizer reconciliation.'),
      href: '/solutions/shift-attendance',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: t('featAnprTitle', 'ANPR Camera Fleet Sync'),
      desc: t('featAnprDesc', 'Sub-2s automated number plate recognition at fuel nozzles linked to transporter credit wallets.'),
      href: '/solutions/anpr-camera-sync',
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: t('featCrmTitle', 'Dispenser CRM & Credit Ledger'),
      desc: t('featCrmDesc', 'Connects PTS & 2-wire forecourt controllers for automated Udhaar Khata and digital challans.'),
      href: '/solutions/dispenser-crm',
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: t('featLogisticsTitle', 'Logistics & Tanker Fleet Board'),
      desc: t('featLogisticsDesc', 'Oversee supply depot indents, tanker GPS dispatch schedules, and automatic tank refills.'),
      href: '/solutions/logistics-fleet',
    },
    {
      icon: <Activity className="h-6 w-6" />,
      title: t('featWetStockTitle', 'Wet-Stock ATG Telemetry'),
      desc: t('featWetStockDesc', 'Continuous underground tank level tracking, temperature compensation at 15°C, and leak alarms.'),
      href: '/solutions/wet-stock-telemetry',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: t('featAnalyticsTitle', 'Fuel Price & Margin Analytics'),
      desc: t('featAnalyticsDesc', 'Daily city fuel rates, predictive purchase orders, and multi-station profit margin tracking.'),
      href: '/solutions/anpr-camera-sync',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-primary/20 selection:text-primary">
      {/* Reusable Scalable Navbar */}
      <PublicNavbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-white">
        {/* Ambient background blur blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-200/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-200/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-6 flex flex-col items-start gap-6 text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600"
            >
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              {t('heroBadge')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08]"
            >
              {platformStats.hero_headline ? (
                platformStats.hero_headline
              ) : (
                <>
                  {t('heroHeadline')}
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl"
            >
              {platformStats.hero_subheadline || t('heroSubheadline')}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2"
            >
              <Link
                href="/register"
                className="group inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-300 gap-2"
              >
                {t('heroGetStarted')}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl bg-white hover:bg-orange-50/50 border border-orange-200/80 hover:border-primary px-6 py-3.5 text-sm font-bold text-slate-900 shadow-xs hover:-translate-y-0.5 transition-all duration-300"
              >
                {t('navDashboard')}
              </Link>
            </motion.div>

            {/* Micro proof badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-semibold border-t border-orange-100 w-full"
            >
              <div className="flex items-center gap-1.5 hover:text-slate-800 transition-colors">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                {t('heroSla', '99.99% Cloud SLA')}
              </div>
              <div className="flex items-center gap-1.5 hover:text-slate-800 transition-colors">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                {t('heroAnprSpeed', 'ANPR Sub-2s Authorization')}
              </div>
              <div className="flex items-center gap-1.5 hover:text-slate-800 transition-colors">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                {t('heroZeroLeak', 'Zero Wet-Stock Leakage')}
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Dashboard Graphic Mockup with 3D Float Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="lg:col-span-6 w-full flex justify-center relative"
          >
            <div className="w-full max-w-lg rounded-2xl border border-orange-200 bg-white p-5 sm:p-6 shadow-2xl relative overflow-hidden transition-all duration-500 hover:shadow-orange-500/15">
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-orange-100">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  STATION MH-4001 • TELEMETRY LIVE
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-orange-50/80 border border-orange-200/80 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white text-primary border border-orange-200 flex items-center justify-center font-bold shadow-xs">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {t('heroFlowSpeed', 'DISPENSER FLOW SPEED')}
                      </div>
                      <div className="text-sm sm:text-base font-extrabold text-slate-900">
                        <AnimatedCounter end={820} suffix={` ${t('heroFlowSpeedUnit', 'Liters / min')}`} />
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200">
                    OPTIMAL
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-orange-100 rounded-xl p-4 flex flex-col justify-between space-y-2 shadow-xs hover:border-orange-300 transition-colors">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{t('heroActiveTanks', 'ACTIVE TANKS')}</span>
                    <span className="text-base font-extrabold text-slate-900">{t('heroTanksOnline', '4 / 4 Online')}</span>
                    <div className="w-full bg-orange-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                    <span className="text-[9px] text-slate-500 font-semibold">{t('heroCapacityDesc', '18,450L Diesel Capacity')}</span>
                  </div>

                  <div className="bg-white border border-orange-100 rounded-xl p-4 flex flex-col justify-between space-y-2 shadow-xs hover:border-orange-300 transition-colors">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{t('heroAnprMatches', 'ANPR MATCHES')}</span>
                    <span className="text-base font-extrabold text-slate-900">
                      <AnimatedCounter end={112} suffix={` ${t('heroVehiclesSuffix', 'Vehicles')}`} />
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                      <AnimatedCounter end={18} prefix="↑ +" suffix={t('heroFleetRetention', '% Fleet Retention')} />
                    </span>
                    <span className="text-[9px] text-slate-500">{t('heroAutoBilled', 'Auto-Billed to Corporate Tab')}</span>
                  </div>
                </div>

                <div className="p-3 bg-white border border-orange-200 text-slate-800 rounded-xl flex items-center justify-between text-xs shadow-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold text-slate-600">{t('heroLeakSensor', 'Wet-Stock Leak Sensor:')}</span>
                  </div>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">{t('heroNormalStatus', 'NORMAL (0.00% Variance)')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. ABOUT FUELFLUX SECTION WITH ANIMATED COUNTERS                          */}
      {/* ========================================================================= */}
      <section id="about" className="py-24 bg-white border-t border-orange-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Header & Explanation */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6 text-left"
            >
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                {t('aboutBadge', 'Forecourt Management Reimagined')}
              </p>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {t('aboutTitle', 'Pioneering Intelligent Fuel Network Automation')}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {t('aboutDesc', 'FuelFlux is an end-to-end cloud platform built for fuel retailers, logistics fleets, and energy distributors. We eliminate manual dipstick inaccuracies, wet-stock loss, fragmented point-of-sale systems, and slow driver checkouts by unifying dispensers, camera ANPR, inventory telemetry, and shift analytics in real time.')}
              </p>

              {/* Key Highlights list with hover animations */}
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {[
                  {
                    title: t('aboutFeat1Title', 'Zero Leak Tolerance'),
                    desc: t('aboutFeat1Desc', 'Continuous tank dips with automated leak alerts.'),
                  },
                  {
                    title: t('aboutFeat2Title', 'ANPR Sub-2s Refueling'),
                    desc: t('aboutFeat2Desc', 'Instant camera recognition for corporate fleets.'),
                  },
                  {
                    title: t('aboutFeat3Title', 'Shift & Payroll Sync'),
                    desc: t('aboutFeat3Desc', 'Attendant cash collections auto-reconciled.'),
                  },
                  {
                    title: t('aboutFeat4Title', 'AI Price Forecasting'),
                    desc: t('aboutFeat4Desc', 'Predictive purchase orders for maximum margin.'),
                  },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -3 }}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-orange-50/70 border border-orange-100 hover:border-orange-300 transition-all duration-200 shadow-2xs"
                  >
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Learn More CTA */}
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <span>{t('aboutLearnMore', 'Learn More About FuelFlux')}</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Right Statistics & Visual Highlights Card with animated count-up from 0 */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-6"
            >
              <div className="bg-gradient-to-br from-white via-orange-50/40 to-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden space-y-8 border-2 border-orange-200">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-2 relative z-10">
                  <span className="text-xs font-extrabold text-primary tracking-widest uppercase bg-orange-100/90 border border-orange-200 px-3 py-1 rounded-full">
                    {t('statsTitle')}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 pt-2">{t('statsSubtitle')}</h3>
                </div>

                {/* Animated Stats from 0 */}
                <div className="grid grid-cols-2 gap-6 pt-2 border-t border-orange-100 relative z-10">
                  <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-xs">
                    <div className="text-3xl sm:text-4xl font-extrabold text-primary">
                      <AnimatedCounter end={Number(platformStats.fuel_stations) || 450} suffix="+" />
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mt-1">{t('statStationsLabel')}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-xs">
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      <AnimatedCounter end={Number(platformStats.liters_telemetered_millions) || 15.4} decimals={1} suffix="M+" />
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mt-1">{t('statVolumeLabel')}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-xs">
                    <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                      <AnimatedCounter end={Number(platformStats.uptime_percentage) || 99.9} decimals={1} suffix="%" />
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mt-1">{t('statUptimeLabel')}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-orange-100 shadow-xs">
                    <div className="text-3xl sm:text-4xl font-extrabold text-primary">
                      <AnimatedCounter end={Number(platformStats.checkout_speed_sec) || 1.8} decimals={1} prefix="< " suffix="s" />
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mt-1">{t('statSpeedLabel')}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-orange-200/80 flex items-center justify-between relative z-10 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-primary flex items-center justify-center font-bold">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{t('aboutEncryptedTitle', 'Encrypted SaaS Ecosystem')}</div>
                      <div className="text-[11px] text-slate-600">{t('aboutEncryptedSubtitle', 'SOC-2 & ISO 27001 Compliant Architecture')}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SYSTEM FEATURES GRID                                                   */}
      {/* ========================================================================= */}
      <section id="features" className="py-24 bg-gradient-to-b from-orange-50/40 via-white to-orange-50/30 border-y border-orange-100/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto flex flex-col items-center gap-3 mb-16"
          >
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              {t('featuresBadge', 'Platform Capabilities')}
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{t('featuresGridTitle', 'Unified System Features')}</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t('featuresGridSubtitle', 'Unlock modular features explicitly tailored to modern multi-role gasoline networks, fuel transport logistics, and asset auditing.')}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className="h-full"
              >
                <Link
                  href={f.href}
                  className="bg-white rounded-2xl border border-orange-100 p-6 text-left shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between h-full gap-4 group cursor-pointer"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200/80 text-primary flex items-center justify-center group-hover:bg-orange-100 group-hover:border-orange-300 group-hover:scale-105 group-hover:shadow-xs transition-all duration-300 shrink-0">
                      {f.icon}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-primary transition-colors flex items-center justify-between">
                      <span>{f.title}</span>
                      <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary shrink-0" />
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                  <div className="text-xs font-bold text-primary flex items-center gap-1 pt-2 border-t border-orange-50 group-hover:underline">
                    {t('featExploreCta', 'Explore Solution Workflow →')}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRICING SECTION                                                        */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto flex flex-col items-center gap-3 mb-16"
          >
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">{t('pricingBadge', 'Pricing Plans')}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{t('pricingTitle', 'Engineered for Any Size')}</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t('pricingSubtitle', 'Transparent enterprise licensing tiers that scale seamlessly with your station count.')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {pricingTiers.map((tier, idx) => {
              const isSelected = selectedPlan === tier.id;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  onClick={() => setSelectedPlan(tier.id)}
                  className={`
                    relative rounded-3xl p-8 flex flex-col justify-between text-left cursor-pointer transition-all duration-300
                    ${isSelected
                      ? 'bg-gradient-to-b from-white via-orange-50/40 to-white shadow-xl shadow-orange-500/15 z-10'
                      : 'bg-white hover:bg-orange-50/20 shadow-sm hover:shadow-md z-0'
                    }
                  `}
                >
                  {/* Moving Animated Orange Border Highlight */}
                  {isSelected && (
                    <motion.div
                      layoutId="activePlanHighlight"
                      className="absolute -inset-[2px] rounded-3xl border-2 border-primary pointer-events-none"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  {/* Top Badge: Floating / Moving between cards */}
                  {isSelected && (
                    <motion.span
                      layoutId="activePlanBadge"
                      className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-white text-[9px] font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow-md shadow-primary/30 z-20"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    >
                      {tier.badge}
                    </motion.span>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-900">{tier.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{tier.description}</p>
                    
                    <div className={`text-4xl font-extrabold mt-6 transition-colors duration-200 ${isSelected ? 'text-primary' : 'text-slate-900'}`}>
                      {tier.price}
                      {tier.unit && (
                        <span className="text-xs text-slate-500 font-semibold ml-0.5">{tier.unit}</span>
                      )}
                    </div>

                    <ul className="space-y-3 mt-8">
                      {tier.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <div className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-orange-100 text-primary' : 'bg-emerald-50 text-emerald-600'}`}>
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="relative z-10 mt-8">
                    <Link
                      href="/register"
                      className={`
                        block text-center rounded-xl font-bold text-xs py-3 transition-all duration-300
                        ${isSelected
                          ? 'bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35'
                          : 'border border-orange-200 hover:border-primary text-slate-900 hover:text-primary'
                        }
                      `}
                    >
                      {tier.cta}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE TESTIMONIALS CAROUSEL                                      */}
      {/* ========================================================================= */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-orange-50/40 via-white to-orange-50/30 border-t border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto flex flex-col items-center gap-3 mb-16"
          >
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">{t('navTestimonials')}</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{t('testimonialsTitle')}</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t('testimonialsSubtitle')}
            </p>
          </motion.div>

          {/* Interactive Carousel Container */}
          <div
            className="max-w-4xl mx-auto relative px-2 sm:px-12"
            onMouseEnter={() => setIsTestimonialPaused(true)}
            onMouseLeave={() => setIsTestimonialPaused(false)}
          >
            {/* Carousel Navigation Buttons */}
            <button
              type="button"
              onClick={handlePrevTestimonial}
              aria-label="Previous testimonial"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-orange-200 text-slate-700 shadow-md hover:border-primary hover:text-primary hover:scale-105 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={handleNextTestimonial}
              aria-label="Next testimonial"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-orange-200 text-slate-700 shadow-md hover:border-primary hover:text-primary hover:scale-105 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Testimonial Card Display */}
            <div className="overflow-hidden py-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-orange-200 shadow-xl shadow-orange-500/5 text-left flex flex-col justify-between space-y-6 relative"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(testimonials[currentTestimonial]?.stars || 5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-primary bg-orange-100 border border-orange-200 px-3 py-1 rounded-full">
                      {testimonials[currentTestimonial]?.highlight || t('testimonialVerified')}
                    </span>
                  </div>

                  <p className="text-base sm:text-lg text-slate-700 italic leading-relaxed font-medium">
                    "{testimonials[currentTestimonial]?.quote}"
                  </p>

                  <div className="flex items-center gap-4 pt-4 border-t border-orange-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md">
                      {testimonials[currentTestimonial]?.initials || testimonials[currentTestimonial]?.author?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {testimonials[currentTestimonial]?.author}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {testimonials[currentTestimonial]?.role} •{' '}
                        <span className="font-semibold text-slate-700">
                          {testimonials[currentTestimonial]?.company}
                        </span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Indicators */}
            <div className="flex justify-center items-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentTestimonial(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                    currentTestimonial === idx ? 'w-8 bg-primary' : 'w-2.5 bg-orange-200 hover:bg-orange-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHITE & ORANGE ENTERPRISE AUTOMATION SECTION                           */}
      {/* ========================================================================= */}
      <section
        id="enterprise"
        className="py-28 bg-gradient-to-b from-white via-orange-50/60 to-white text-slate-900 relative overflow-hidden border-t border-orange-200/60"
      >
        {/* Ambient background glow effects */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-orange-200/40 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-20 space-y-4"
          >
            <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Enterprise Multi-Station Architecture
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              Enterprise Fuel Automation & Control
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Connect pump hardware, camera ANPR, shift logs, and supplier logistics into an autonomous decision engine.
            </p>
          </motion.div>

          {/* 4 Interactive Enterprise Telemetry Nodes */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -6, borderColor: 'rgba(249, 115, 22, 0.6)' }}
              className="bg-white border-2 border-orange-100 p-6 rounded-2xl space-y-4 shadow-sm hover:shadow-xl relative group transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-primary flex items-center justify-center font-bold border border-orange-200 group-hover:bg-orange-100 group-hover:border-orange-300 group-hover:scale-105 transition-all duration-300">
                <Workflow className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">NODE 01</span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">Tank Dip & Refill Trigger</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                When wet-stock falls below 15%, FuelFlux automatically dispatches a supply order to your logistics tanker fleet.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -6, borderColor: 'rgba(52, 211, 153, 0.6)' }}
              className="bg-white border-2 border-orange-100 p-6 rounded-2xl space-y-4 shadow-sm hover:shadow-xl relative group transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-200 group-hover:bg-emerald-100 group-hover:border-emerald-300 group-hover:scale-105 transition-all duration-300">
                <Cpu className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">NODE 02</span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">ANPR Plate Authorization</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Camera recognizes registered fleet plate in &lt;200ms and unlocks nozzle dispense up to assigned corporate limit.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -6, borderColor: 'rgba(251, 191, 36, 0.6)' }}
              className="bg-white border-2 border-orange-100 p-6 rounded-2xl space-y-4 shadow-sm hover:shadow-xl relative group transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-200 group-hover:bg-amber-100 group-hover:border-amber-300 group-hover:scale-105 transition-all duration-300">
                <Lock className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">NODE 03</span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors">Automatic Reconciliation</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Shift end cash collected is auto-checked against nozzle meter outputs, detecting attendant discrepancies instantly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -6, borderColor: 'rgba(249, 115, 22, 0.6)' }}
              className="bg-white border-2 border-orange-100 p-6 rounded-2xl space-y-4 shadow-sm hover:shadow-xl relative group transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-primary flex items-center justify-center font-bold border border-orange-200 group-hover:bg-orange-100 group-hover:border-orange-300 group-hover:scale-105 transition-all duration-300">
                <Server className="h-6 w-6" />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">NODE 04</span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors">Edge Offline Fail-Safe</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nozzles continue fueling during internet outages with local edge storage, auto-syncing when connection restores.
              </p>
            </motion.div>
          </div>

          {/* High-Converting Enterprise CTA Box with Orange Gradient */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-orange-500 via-primary to-amber-500 rounded-3xl p-10 sm:p-14 text-center text-white shadow-2xl shadow-orange-500/25 relative overflow-hidden flex flex-col items-center gap-6"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold max-w-xl leading-tight">
              Ready to Consolidate Your Fuel Assets?
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 max-w-lg leading-relaxed">
              Sign up today and get 14 days of unrestricted access to our unified multi-role console. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
              <Link
                href="/register"
                className="inline-flex justify-center items-center rounded-xl bg-white hover:bg-orange-50 text-slate-900 px-7 py-3.5 font-bold text-xs shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Register Free Trial
              </Link>
              <Link
                href="/login"
                className="inline-flex justify-center items-center rounded-xl bg-orange-700/60 hover:bg-orange-700/80 border border-white/40 px-7 py-3.5 font-bold text-xs text-white transition-all hover:-translate-y-0.5 duration-300"
              >
                Access Demo Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reusable Scalable Footer with clean white and orange theme */}
      <PublicFooter />
    </div>
  );
}
