'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language, LANGUAGES, translations, TranslationKey, LanguageOption } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, fallback?: string) => string;
  languages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
  languages: LANGUAGES,
});

const STORAGE_KEY = 'fuelflux_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Language;
      if (stored && (stored in translations)) {
        setLanguageState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      // localStorage may fail in restricted iframes
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const t = useMemo(() => {
    return (key: TranslationKey, fallback?: string): string => {
      const langDict = translations[language] || translations.en;
      if (key in langDict) {
        return (langDict as any)[key] || fallback || (translations.en as any)[key] || key;
      }
      return (translations.en as any)[key] || fallback || key;
    };
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      languages: LANGUAGES,
    }),
    [language, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  return useContext(LanguageContext);
};
