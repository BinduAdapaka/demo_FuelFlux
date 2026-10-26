'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  BarChart3,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Eye,
  RefreshCw,
  Save,
  Star,
  Building,
  Car,
  Receipt,
  Users,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  X,
  Sliders,
} from 'lucide-react';
import { toast } from '@/components/feedback/Toast';
import {
  platformContentService,
  PlatformStats,
  PlatformTestimonialItem,
  LiveDbCounts,
} from '@/services/platformContent.service';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AdminContentPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'stats' | 'testimonials'>('stats');
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingStats, setIsSavingStats] = useState(false);

  // Statistics State
  const [stats, setStats] = useState<PlatformStats>({
    fuel_stations: 450,
    active_vehicles: 2850,
    total_transactions: 84200,
    connected_users: 12500,
    liters_telemetered_millions: 15.4,
    uptime_percentage: 99.98,
    checkout_speed_sec: 1.8,
    hero_headline: '',
    hero_subheadline: '',
  });

  const [liveDbCounts, setLiveDbCounts] = useState<LiveDbCounts>({
    pumps: 0,
    vehicles: 0,
    transactions: 0,
    users: 0,
  });

  // Testimonials State
  const [testimonials, setTestimonials] = useState<PlatformTestimonialItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<PlatformTestimonialItem | null>(null);
  const [isSubmittingTestimonial, setIsSubmittingTestimonial] = useState(false);

  // Form State for Testimonials
  const [formAuthor, setFormAuthor] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formQuote, setFormQuote] = useState('');
  const [formHighlight, setFormHighlight] = useState('');
  const [formStars, setFormStars] = useState(5);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formDisplayOrder, setFormDisplayOrder] = useState(0);

  // Initial Load
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsData, testimonialsData] = await Promise.all([
        platformContentService.adminGetStats().catch(() => null),
        platformContentService.adminGetTestimonials().catch(() => []),
      ]);

      if (statsData) {
        setStats(statsData.stats);
        if (statsData.live_database_counts) {
          setLiveDbCounts(statsData.live_database_counts);
        }
      }

      if (testimonialsData) {
        setTestimonials(testimonialsData);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Could not load platform content');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Stats Handler
  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingStats(true);
    try {
      const updated = await platformContentService.adminUpdateStats({
        fuel_stations: Number(stats.fuel_stations),
        active_vehicles: Number(stats.active_vehicles),
        total_transactions: Number(stats.total_transactions),
        connected_users: Number(stats.connected_users),
        liters_telemetered_millions: Number(stats.liters_telemetered_millions),
        uptime_percentage: Number(stats.uptime_percentage),
        checkout_speed_sec: Number(stats.checkout_speed_sec),
        hero_headline: stats.hero_headline || undefined,
        hero_subheadline: stats.hero_subheadline || undefined,
      });
      setStats(updated);
      toast.success(t('adminStatsSaved'));
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update platform statistics');
    } finally {
      setIsSavingStats(false);
    }
  };

  // Open Testimonial Modal (New or Edit)
  const openTestimonialModal = (item?: PlatformTestimonialItem) => {
    if (item) {
      setEditingTestimonial(item);
      setFormAuthor(item.author);
      setFormRole(item.role);
      setFormCompany(item.company);
      setFormQuote(item.quote);
      setFormHighlight(item.highlight);
      setFormStars(item.stars);
      setFormIsActive(item.is_active);
      setFormDisplayOrder(item.display_order);
    } else {
      setEditingTestimonial(null);
      setFormAuthor('');
      setFormRole('');
      setFormCompany('');
      setFormQuote('');
      setFormHighlight('');
      setFormStars(5);
      setFormIsActive(true);
      setFormDisplayOrder(testimonials.length);
    }
    setIsModalOpen(true);
  };

  // Submit Testimonial (Create / Update)
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor || !formQuote || !formCompany || !formRole) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmittingTestimonial(true);
    try {
      if (editingTestimonial) {
        const updated = await platformContentService.adminUpdateTestimonial(
          editingTestimonial.id,
          {
            author: formAuthor,
            role: formRole,
            company: formCompany,
            quote: formQuote,
            highlight: formHighlight,
            stars: formStars,
            is_active: formIsActive,
            display_order: formDisplayOrder,
          }
        );
        setTestimonials((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
        toast.success(`Updated testimonial from ${updated.author}`);
      } else {
        const created = await platformContentService.adminCreateTestimonial({
          author: formAuthor,
          role: formRole,
          company: formCompany,
          quote: formQuote,
          highlight: formHighlight || 'Verified Customer',
          stars: formStars,
          is_active: formIsActive,
          display_order: formDisplayOrder,
        });
        setTestimonials((prev) => [created, ...prev]);
        toast.success(t('adminCreateSuccess'));
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || 'Could not save testimonial');
    } finally {
      setIsSubmittingTestimonial(false);
    }
  };

  // Toggle Testimonial Active status
  const handleToggleActive = async (item: PlatformTestimonialItem) => {
    try {
      const updated = await platformContentService.adminUpdateTestimonial(item.id, {
        is_active: !item.is_active,
      });
      setTestimonials((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      toast.success(
        `Testimonial marked ${updated.is_active ? 'Active' : 'Inactive'}`
      );
    } catch (err: any) {
      toast.error(err?.message || 'Failed to toggle status');
    }
  };

  // Delete Testimonial
  const handleDeleteTestimonial = async (id: string, author: string) => {
    if (!confirm(`${t('adminConfirmDelete')} (${author})`)) return;

    try {
      await platformContentService.adminDeleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast.success(t('adminDeleteSuccess'));
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete testimonial');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <Flame className="h-5 w-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('adminContentTitle')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('adminContentSubtitle')}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'stats'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            {t('adminTabStats')}
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'testimonials'
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            {t('adminTabTestimonials')} ({testimonials.length})
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <RefreshCw className="h-8 w-8 text-orange-500 animate-spin" />
          <span className="text-sm font-bold text-slate-500">
            {t('loading')}
          </span>
        </div>
      ) : activeTab === 'stats' ? (
        /* ========================================================================= */
        /* TAB 1: OPERATIONAL STATISTICS                                              */
        /* ========================================================================= */
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Edit Form */}
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleSaveStats} className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Public Landing Page Metrics
                    </h2>
                    <p className="text-xs text-slate-500">
                      These values are shown live to visitors on the landing page and marketing counters.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live Connected
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Fuel Stations */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('statStationsLabel')}
                    </label>
                    <input
                      type="number"
                      value={stats.fuel_stations}
                      onChange={(e) =>
                        setStats({ ...stats, fuel_stations: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Live in DB: <strong className="text-slate-600">{liveDbCounts.pumps} stations</strong>
                    </span>
                  </div>

                  {/* Connected Fleet Vehicles */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('statVehiclesLabel')}
                    </label>
                    <input
                      type="number"
                      value={stats.active_vehicles}
                      onChange={(e) =>
                        setStats({ ...stats, active_vehicles: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Live in DB: <strong className="text-slate-600">{liveDbCounts.vehicles} vehicles</strong>
                    </span>
                  </div>

                  {/* Daily Liters Dispensed (Millions) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('statVolumeLabel')} (Millions)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={stats.liters_telemetered_millions}
                      onChange={(e) =>
                        setStats({
                          ...stats,
                          liters_telemetered_millions: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Rendered as e.g. <strong className="text-slate-600">{stats.liters_telemetered_millions}M+ Liters</strong>
                    </span>
                  </div>

                  {/* Total Transactions Processed */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Total Processed Transactions
                    </label>
                    <input
                      type="number"
                      value={stats.total_transactions}
                      onChange={(e) =>
                        setStats({
                          ...stats,
                          total_transactions: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Live in DB: <strong className="text-slate-600">{liveDbCounts.transactions} transactions</strong>
                    </span>
                  </div>

                  {/* Connected Users */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('statUsersLabel')}
                    </label>
                    <input
                      type="number"
                      value={stats.connected_users}
                      onChange={(e) =>
                        setStats({ ...stats, connected_users: Number(e.target.value) })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Live in DB: <strong className="text-slate-600">{liveDbCounts.users} users</strong>
                    </span>
                  </div>

                  {/* ANPR Authorization Speed */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('statSpeedLabel')} (Seconds)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={stats.checkout_speed_sec}
                      onChange={(e) =>
                        setStats({
                          ...stats,
                          checkout_speed_sec: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Rendered as e.g. <strong className="text-slate-600">&lt; {stats.checkout_speed_sec}s</strong>
                    </span>
                  </div>

                  {/* Cloud Uptime % */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('statUptimeLabel')} (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={stats.uptime_percentage}
                      onChange={(e) =>
                        setStats({
                          ...stats,
                          uptime_percentage: Number(e.target.value),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      SLA guarantee displayed on trust badges: <strong className="text-slate-600">{stats.uptime_percentage}%</strong>
                    </span>
                  </div>
                </div>

                {/* Hero Override Headline & Subheadline */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Custom Landing Headline (Optional Override)
                    </label>
                    <input
                      type="text"
                      placeholder="Leave blank to use default multi-lingual translation"
                      value={stats.hero_headline || ''}
                      onChange={(e) =>
                        setStats({ ...stats, hero_headline: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Custom Landing Subheadline (Optional Override)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Leave blank to use default multi-lingual translation"
                      value={stats.hero_subheadline || ''}
                      onChange={(e) =>
                        setStats({ ...stats, hero_subheadline: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingStats}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {isSavingStats ? t('loading') : t('adminSaveStats')}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Sidebar: Live Preview Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-white via-orange-50/50 to-white rounded-3xl p-6 border-2 border-orange-200 shadow-md space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Live Public Preview
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Updated {stats.updated_at ? new Date(stats.updated_at).toLocaleTimeString() : 'now'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                Proven Metrics at Scale
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-orange-100 shadow-2xs">
                  <div className="text-2xl font-extrabold text-orange-500">
                    {stats.fuel_stations}+
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    Stations Networked
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-orange-100 shadow-2xs">
                  <div className="text-2xl font-extrabold text-slate-900">
                    {stats.liters_telemetered_millions}M+
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    Daily Fuel Liters
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-orange-100 shadow-2xs">
                  <div className="text-2xl font-extrabold text-slate-900">
                    {stats.uptime_percentage}%
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    Cloud SLA Uptime
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-orange-100 shadow-2xs">
                  <div className="text-2xl font-extrabold text-orange-500">
                    &lt; {stats.checkout_speed_sec}s
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">
                    ANPR Fleet Checkout
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-orange-50 rounded-xl border border-orange-200/80 text-xs text-slate-700 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-orange-700">
                  <Sparkles className="h-4 w-4" />
                  Instant Synchronized Sync
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Saving updates in this form saves directly into MongoDB. Landing page visitors will see these values without needing a server restart.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* TAB 2: TESTIMONIALS MANAGEMENT                                            */
        /* ========================================================================= */
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Landing Page Customer Testimonials
              </h2>
              <p className="text-xs text-slate-500">
                Manage owner and carrier reviews displayed in the public rotating carousel.
              </p>
            </div>
            <button
              onClick={() => openTestimonialModal()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {t('adminAddTestimonial')}
            </button>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between p-5 space-y-4 shadow-xs relative ${
                  item.is_active
                    ? 'border-slate-200 hover:border-orange-300'
                    : 'border-slate-200/60 opacity-60 bg-slate-50/50'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Highlight & Star Rating & Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-600 border border-orange-200">
                      {item.highlight}
                    </span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: item.stars }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed line-clamp-4">
                    "{item.quote}"
                  </p>
                </div>

                {/* Author Info & Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs">
                      {item.initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.author}
                      </h4>
                      <p className="text-[10px] text-slate-500 truncate">
                        {item.role} • <strong className="text-slate-700">{item.company}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                        item.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {item.is_active ? 'Active' : 'Inactive'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openTestimonialModal(item)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50/50 transition-colors cursor-pointer"
                        title={t('adminEditTestimonial')}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(item.id, item.author)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/50 transition-colors cursor-pointer"
                        title={t('adminDelete')}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT TESTIMONIAL                                              */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                    <MessageSquare className="h-4 w-4" />
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {editingTestimonial
                      ? t('adminEditTestimonial')
                      : t('adminAddTestimonial')}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleTestimonialSubmit} className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('adminAuthor')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('adminRole')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Managing Director"
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('adminCompany')} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gujarat Petroleum Hub"
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('adminHighlight')}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 4 Stations Synced"
                      value={formHighlight}
                      onChange={(e) => setFormHighlight(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {t('adminQuote')} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter customer feedback or endorsement..."
                    value={formQuote}
                    onChange={(e) => setFormQuote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('adminStars')}
                    </label>
                    <select
                      value={formStars}
                      onChange={(e) => setFormStars(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    >
                      <option value={5}>5 Stars (★★★★★)</option>
                      <option value={4}>4 Stars (★★★★☆)</option>
                      <option value={3}>3 Stars (★★★☆☆)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('adminDisplayOrder')}
                    </label>
                    <input
                      type="number"
                      value={formDisplayOrder}
                      onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      {t('adminStatus')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormIsActive(!formIsActive)}
                      className={`w-full py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-colors cursor-pointer text-center ${
                        formIsActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : 'bg-slate-100 text-slate-500 border-slate-300'
                      }`}
                    >
                      {formIsActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    {t('adminCancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingTestimonial}
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingTestimonial ? t('loading') : t('adminSave')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
