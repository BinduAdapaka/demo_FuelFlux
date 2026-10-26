'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

interface EmployeeKpiCardProps {
  title: string;
  value: string | number;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export const EmployeeKpiCard: React.FC<EmployeeKpiCardProps> = ({
  title,
  value,
  numericValue,
  prefix,
  suffix,
  decimals = 0,
  description,
  icon,
  trend,
}) => {
  const finalNum = typeof numericValue === 'number'
    ? numericValue
    : typeof value === 'number'
      ? value
      : typeof value === 'string' && !isNaN(Number(value.replace(/[^0-9.-]+/g, '')))
        ? Number(value.replace(/[^0-9.-]+/g, ''))
        : null;

  const isCurrency = typeof value === 'string' && value.includes('₹');
  const isPercent = typeof value === 'string' && value.includes('%');
  const effPrefix = prefix || (isCurrency ? '₹' : undefined);
  const effSuffix = suffix || (isPercent ? '%' : undefined);

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-white border border-orange-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 relative overflow-hidden group text-left"
    >
      {/* Background soft glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/0 via-orange-500/0 to-orange-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</span>
          <div className="text-2xl font-extrabold text-slate-800 mt-1 tracking-tight font-mono">
            {finalNum !== null ? (
              <AnimatedCounter
                value={finalNum}
                prefix={effPrefix}
                suffix={effSuffix}
                decimals={decimals}
              />
            ) : (
              value
            )}
          </div>
        </div>
        <div className="h-11 w-11 rounded-xl bg-orange-50/50 border border-orange-100/50 text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
          {icon}
        </div>
      </div>

      {(description || trend) && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-50 text-xs font-medium text-slate-500">
          {trend && (
            <span
              className={`font-bold px-1.5 py-0.5 rounded-md ${
                trend.isPositive
                  ? 'text-green-600 bg-green-50'
                  : 'text-rose-600 bg-rose-50'
              }`}
            >
              {trend.value}
            </span>
          )}
          {description && <span className="truncate">{description}</span>}
        </div>
      )}
    </motion.div>
  );
};
export default EmployeeKpiCard;
