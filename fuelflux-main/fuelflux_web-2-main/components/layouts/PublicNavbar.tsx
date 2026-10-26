'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, ChevronRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LanguageSelector } from '@/components/shared/LanguageSelector';

export const PublicNavbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('navFeatures', 'Features'), href: '/#features' },
    { name: t('navAbout', 'About Us'), href: '/about' },
    { name: t('navPricing', 'Pricing'), href: '/#pricing' },
    { name: t('navTestimonials', 'Testimonials'), href: '/#testimonials' },
    { name: t('navEnterprise', 'Enterprise'), href: '/#enterprise' },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-orange-100 shadow-sm py-3'
          : 'bg-white/85 backdrop-blur-md border-b border-orange-50/80 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center p-0.5 rounded-full bg-transparent group-hover:scale-105 transition-all duration-300">
            <img
              src="/logo.svg"
              alt="FuelFlux Logo"
              className="h-9 sm:h-10 w-9 sm:w-10 object-contain rounded-full shadow-xs"
            />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors">
            Fuel<span className="text-primary font-black">Flux</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-primary transition-colors duration-200 relative py-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageSelector variant="glass" />
          <Link
            href="/login"
            className="text-sm font-bold text-slate-700 hover:text-primary px-3 py-2 transition-colors duration-200"
          >
            {t('navLogin', 'Log In')}
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-300 gap-1.5"
          >
            {t('navGetStarted', 'Get Started')}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/register"
            className="sm:hidden inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-sm"
          >
            Get Started
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6 text-primary" /> : <Menu className="h-6 w-6 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-orange-100 shadow-xl px-6 py-6 space-y-4 overflow-hidden"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 text-base font-semibold text-slate-700 hover:text-primary border-b border-orange-50 transition-colors"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="h-4 w-4 text-orange-400" />
                </Link>
              ))}
            </div>

            <div className="pt-3 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 hover:bg-orange-50 hover:border-orange-200 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-primary hover:bg-primary-hover text-sm font-bold text-white shadow-md shadow-primary/25 transition-all"
              >
                Start Free Trial
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
