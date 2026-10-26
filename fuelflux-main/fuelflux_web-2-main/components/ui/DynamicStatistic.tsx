'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

export interface DynamicStatisticProps {
  label: string;
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  icon?: React.ReactNode;
  description?: string;
  trend?: string;
  isLoading?: boolean;
  className?: string;
  variant?: 'light-card' | 'dark-card' | 'glass' | 'subtle' | 'compact';
  duration?: number;
}

/**
 * DynamicStatistic
 * Reusable dynamic statistic component with smooth count-up from 0,
 * customizable variants, loading skeleton state, and optional badge/icon.
 */
export const DynamicStatistic: React.FC<DynamicStatisticProps> = ({
  label,
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  icon,
  description,
  trend,
  isLoading = false,
  className = '',
  variant = 'light-card',
  duration = 1800,
}) => {
  const isLight = variant === 'light-card' || variant === 'subtle';

  if (isLoading) {
    return (
      <div
        className={`p-4 rounded-xl border animate-pulse relative overflow-hidden ${
          isLight
            ? 'bg-orange-50/50 border-orange-100'
            : 'bg-slate-900/60 border-slate-800'
        } ${className}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className={`h-3 w-20 rounded ${isLight ? 'bg-orange-200/60' : 'bg-slate-700/60'}`} />
          <div className={`h-6 w-6 rounded-lg ${isLight ? 'bg-orange-200/60' : 'bg-slate-700/60'}`} />
        </div>
        <div className={`h-7 w-28 rounded mb-1.5 ${isLight ? 'bg-orange-300/60' : 'bg-slate-600/70'}`} />
        <div className={`h-2.5 w-24 rounded ${isLight ? 'bg-orange-200/50' : 'bg-slate-700/50'}`} />
      </div>
    );
  }

  // Variant styling
  const variantClasses = {
    'light-card':
      'bg-white hover:bg-orange-50/40 border-orange-100/90 hover:border-orange-300 text-slate-800 shadow-sm hover:shadow-md',
    'dark-card':
      'bg-slate-900/70 hover:bg-slate-900/90 border-slate-800/90 hover:border-primary/40 text-white shadow-lg backdrop-blur-sm',
    glass:
      'bg-white/5 hover:bg-white/10 border-white/10 hover:border-orange-500/30 text-white shadow-xl backdrop-blur-md',
    subtle:
      'bg-slate-50 hover:bg-orange-50/50 border-slate-200 hover:border-orange-200 text-slate-800 shadow-sm',
    compact:
      'bg-slate-950/40 border-slate-800 text-white p-3',
  }[variant];

  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`relative rounded-xl border p-4 transition-all duration-300 flex flex-col justify-between group ${variantClasses} ${className}`}
    >
      {/* Top row: Label & Icon */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`text-[11px] font-semibold tracking-wide line-clamp-1 transition-colors ${
            isLight
              ? 'text-slate-500 group-hover:text-slate-800'
              : 'text-slate-400 group-hover:text-slate-300'
          }`}
        >
          {label}
        </span>
        {icon && (
          <div
            className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${
              isLight
                ? 'bg-orange-50 border border-orange-200 text-primary group-hover:scale-105 group-hover:bg-orange-100'
                : 'bg-orange-500/10 border border-orange-500/20 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white'
            }`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Main value with Animated Counter */}
      <div className="flex items-baseline gap-1 my-0.5">
        <div
          className={`text-xl sm:text-2xl font-extrabold tracking-tight transition-colors ${
            isLight
              ? 'text-slate-900 group-hover:text-primary'
              : 'text-white group-hover:text-orange-400'
          }`}
        >
          <AnimatedCounter
            end={value}
            decimals={decimals}
            prefix={prefix}
            suffix={suffix}
            duration={duration}
            triggerOnMount
          />
        </div>
      </div>

      {/* Supporting details / trend */}
      {(description || trend) && (
        <div
          className={`flex items-center justify-between gap-2 mt-1.5 pt-1.5 border-t text-[10px] ${
            isLight ? 'border-orange-100' : 'border-white/5'
          }`}
        >
          {description && (
            <span
              className={`truncate font-normal ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {description}
            </span>
          )}
          {trend && (
            <span className="text-emerald-600 font-bold shrink-0 flex items-center gap-0.5">
              {trend}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};
