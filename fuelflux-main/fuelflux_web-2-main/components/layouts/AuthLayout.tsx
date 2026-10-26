'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/auth.store';
import { AuthVisualSection } from '@/components/auth/AuthVisualSection';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  customLeftVisual?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  customLeftVisual,
}) => {
  const { initializeSession } = useAuthStore();

  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-plus-jakarta relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* LEFT SIDE: Immersive Visual & Dynamic Statistics Experience */}
      <div className="hidden lg:flex lg:w-[54%] xl:w-[58%] min-h-screen flex-col relative border-r border-orange-100 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/40 overflow-y-auto">
        {customLeftVisual || <AuthVisualSection />}
      </div>

      {/* RIGHT SIDE: Dedicated Auth Card Shell */}
      <div className="w-full lg:w-[46%] xl:w-[42%] flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 relative z-10 overflow-y-auto">
        {/* Mobile-only Branding header */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8 self-start">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-transparent shrink-0">
            <img src="/logo.svg" alt="FuelFlux Logo" className="h-8 w-8 object-contain rounded-full shadow-xs" />
          </div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            Fuel<span className="text-primary">Flux</span>
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl border border-orange-100 p-6 sm:p-8 shadow-xl shadow-orange-500/5 flex flex-col gap-6"
        >
          {/* Header Texts */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>

          {/* Form injection */}
          {children}
        </motion.div>
      </div>
    </div>
  );
};
