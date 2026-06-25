'use client';

import Link from "next/link";
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useEffect, useState } from 'react';
import { Youtube, Instagram } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <footer className="bg-card text-muted-foreground mt-auto border-t">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 py-16 md:px-6">
        <div>
          <h3 className="font-bold text-foreground text-xl mb-2 font-headline">{t('common.appName')}</h3>
          <p className="text-sm max-w-xs">{t('common.footerDesc')}</p>
          <div className="flex gap-4 mt-6">
            <a 
              href="https://youtube.com/@matrutechnology_1?si=l-2FL6LMG3BXBZIb" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors p-2 rounded-full bg-muted/50 hover:bg-muted"
              title="YouTube"
            >
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </a>
            <a 
              href="https://www.instagram.com/technologymatru?igsh=cTVxZDV0azB1anQ0" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-primary transition-colors p-2 rounded-full bg-muted/50 hover:bg-muted"
              title="Instagram"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-4">{t('common.forUsers')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/search" className="hover:text-primary">{t('common.browse')}</Link></li>
            <li><Link href="/search" className="hover:text-primary">{t('common.search')}</Link></li>
            <li><Link href="/list-your-business" className="hover:text-primary">{t('common.listBusiness')}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-4">{t('common.company')}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/contact" className="hover:text-primary">{t('common.contact')}</Link></li>
            <li><Link href="/about" className="hover:text-primary">{t('common.about')}</Link></li>
            <li><Link href="/privacy" className="hover:text-primary">{t('common.privacyPolicy')}</Link></li>
          </ul>
        </div>
      </div>
      <div className="bg-muted/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm space-y-2">
          {isMounted ? (
            <p>&copy; 2026 {t('common.appName')}. {t('common.rights')} {t('common.developedBy')}</p>
          ) : (
            <p>&copy; 2026 LocalFind. All rights reserved Matru Technology</p>
          )}
        </div>
      </div>
    </footer>
  );
}
