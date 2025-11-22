import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

export const Hero: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-900/10 border border-indigo-500/30 text-indigo-500 mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
            <span className="text-sm font-medium">{t('hero.badge')}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-theme-text-primary tracking-tight leading-tight mb-8">
            {t('hero.titleStart')} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-gradient-x bg-[length:200%_auto]">
              {t('hero.titleEnd')}
            </span>
          </h1>
          
          <p className="mt-4 text-xl text-theme-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#contact" 
              className={`group px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center ${
                  theme === 'dark' 
                    ? 'bg-white text-slate-900 hover:bg-indigo-50 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-[0_0_20px_rgba(15,23,42,0.3)]'
              }`}
            >
              {t('hero.ctaPrimary')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#services" 
              className="px-8 py-4 rounded-lg font-bold text-lg text-theme-text-primary border border-theme-border hover:bg-theme-surface hover:border-theme-text-muted transition-all flex items-center justify-center"
            >
              {t('hero.ctaSecondary')}
            </a>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-theme-border pt-10">
            <div>
              <div className="text-3xl font-bold text-theme-text-primary mb-1">98%</div>
              <div className="text-sm text-theme-text-muted">{t('hero.stats.retention')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-theme-text-primary mb-1">500+</div>
              <div className="text-sm text-theme-text-muted">{t('hero.stats.projects')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-theme-text-primary mb-1">10x</div>
              <div className="text-sm text-theme-text-muted">{t('hero.stats.roi')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-theme-text-primary mb-1">24/7</div>
              <div className="text-sm text-theme-text-muted">{t('hero.stats.support')}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};