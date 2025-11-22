import React, { useState } from 'react';
import { Menu, X, Rocket, Globe } from 'lucide-react';
import { NAV_LINKS_CONFIG } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';

interface HeaderProps {
  scrolled: boolean;
}

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'lo', label: 'ລາວ', flag: '🇱🇦' },
  { code: 'km', label: 'ខ្មែរ', flag: '🇰🇭' },
];

export const Header: React.FC<HeaderProps> = ({ scrolled }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const toggleLangMenu = () => setLangMenuOpen(!langMenuOpen);
  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-slate-800' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({top: 0, behavior: 'smooth'});
            }}
            className="flex-shrink-0 flex items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
            aria-label="ezAI Digital Marketing Home"
          >
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <Rocket className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">
              ezAI <span className="text-indigo-500">Digital Marketing</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8 items-center">
            {NAV_LINKS_CONFIG.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-slate-300 hover:text-white hover:text-indigo-400 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-2 py-1"
              >
                {t(`nav.${link.id}`)}
              </a>
            ))}
            
            {/* Language Selector (Desktop) */}
            <div className="relative">
              <button 
                onClick={toggleLangMenu}
                className="flex items-center space-x-1 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-2 py-1"
              >
                <span className="text-lg">{currentLang?.flag}</span>
                <span className="text-sm font-medium uppercase">{currentLang?.code}</span>
              </button>
              
              {langMenuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setLangMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-40 py-1 overflow-hidden">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => selectLanguage(lang.code)}
                        className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-slate-800 transition-colors ${
                          language === lang.code ? 'text-indigo-400 bg-slate-800' : 'text-slate-300'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex ml-4">
            <a 
              href="#contact"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)] hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              {t('nav.getAudit')}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 p-1 rounded-md"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS_CONFIG.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                 {t(`nav.${link.id}`)}
              </a>
            ))}
            
            {/* Mobile Language Selection */}
            <div className="border-t border-slate-800 my-2 pt-2">
               <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Language</div>
               <div className="grid grid-cols-2 gap-1 px-2">
                 {LANGUAGES.map((lang) => (
                   <button
                      key={lang.code}
                      onClick={() => selectLanguage(lang.code)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
                        language === lang.code ? 'bg-indigo-900/50 text-indigo-400' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                   >
                     <span>{lang.flag}</span>
                     <span>{lang.label}</span>
                   </button>
                 ))}
               </div>
            </div>

            <a 
              href="#contact"
              className="block w-full text-center mt-4 bg-indigo-600 text-white px-5 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onClick={() => setMobileMenuOpen(false)}
            >
               {t('nav.getAudit')}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};