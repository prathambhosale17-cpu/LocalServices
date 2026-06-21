'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, dictionaries } from './dictionaries';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, variables?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && ['en', 'hi', 'mr'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (path: string, variables?: Record<string, any>): string => {
    const keys = path.split('.');
    let result: any = dictionaries[language];
    for (const key of keys) {
      if (result[key] === undefined) return path;
      result = result[key];
    }
    
    if (typeof result === 'string' && variables) {
      Object.entries(variables).forEach(([key, value]) => {
        result = result.replace(`{{${key}}}`, String(value));
      });
    }
    
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
