'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Language } from '@/lib/i18n/translations';

interface LanguageSelectorProps {
  variant?: 'light' | 'dark' | 'glass';
  compact?: boolean;
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'light',
  compact = false,
  className = '',
}) => {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const currentOption = languages.find((l) => l.code === language) || languages[0];

  const buttonStyle =
    variant === 'dark'
      ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
      : variant === 'glass'
      ? 'bg-white/70 hover:bg-white/90 text-slate-800 border-slate-200/80 backdrop-blur-md'
      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer ${buttonStyle}`}
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <Globe className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="flex items-center gap-1.5">
          <span>{currentOption.flag}</span>
          {!compact && <span className="font-semibold">{currentOption.nativeName}</span>}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-50 overflow-hidden"
          >
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
              Select Language / भाषा
            </div>
            <div className="py-1">
              {languages.map((option) => {
                const isSelected = option.code === language;
                return (
                  <button
                    key={option.code}
                    type="button"
                    onClick={() => {
                      setLanguage(option.code);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-orange-50/80 text-primary font-bold'
                        : 'text-slate-700 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{option.flag}</span>
                      <span>{option.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({option.name})</span>
                    </span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
