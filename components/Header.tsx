import React, { useState } from 'react';
import { Menu, X, Rocket, Sun, Moon, User, LogOut, Settings, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { NAV_LINKS_CONFIG } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');

  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const toggleLangMenu = () => setLangMenuOpen(!langMenuOpen);
  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const openAuth = (view: 'signin' | 'signup') => {
    setAuthView(view);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-theme-primary/95 backdrop-blur-md shadow-lg border-b border-theme-border' 
            : 'bg-transparent'
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
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/30">
                <Rocket className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-theme-text-primary">
                ezAI <span className="text-indigo-500">Digital Marketing</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8 items-center">
              {NAV_LINKS_CONFIG.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="text-theme-text-secondary hover:text-theme-text-primary hover:text-indigo-400 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-2 py-1"
                >
                  {t(`nav.${link.id}`)}
                </a>
              ))}
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="text-theme-text-secondary hover:text-theme-text-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Language Selector (Desktop) */}
              <div className="relative">
                <button 
                  onClick={toggleLangMenu}
                  className="flex items-center space-x-1 text-theme-text-secondary hover:text-theme-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-2 py-1"
                >
                  <span className="text-lg">{currentLang?.flag}</span>
                  <span className="text-sm font-medium uppercase">{currentLang?.code}</span>
                </button>
                
                {langMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setLangMenuOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-40 bg-theme-surface border border-theme-border rounded-xl shadow-xl z-40 py-1 overflow-hidden animate-fade-in">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => selectLanguage(lang.code)}
                          className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-3 hover:bg-theme-secondary transition-colors ${
                            language === lang.code ? 'text-indigo-500 bg-theme-secondary font-bold' : 'text-theme-text-secondary'
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

            {/* Auth Button / User Menu Selector */}
            <div className="hidden md:flex ml-4 items-center space-x-4">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full pl-1 pr-3 py-1 hover:bg-theme-secondary transition-all border border-transparent hover:border-theme-border"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full border-2 border-indigo-500"
                    />
                    <span className="text-sm font-medium text-theme-text-primary max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className={`w-4 h-4 text-theme-text-secondary transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setUserMenuOpen(false)}></div>
                      <div className="absolute right-0 mt-3 w-64 bg-theme-surface border border-theme-border rounded-xl shadow-2xl z-40 py-2 overflow-hidden animate-fade-in origin-top-right ring-1 ring-black/5">
                        <div className="px-4 py-3 border-b border-theme-border bg-theme-secondary/30">
                          <p className="text-sm font-bold text-theme-text-primary truncate">{user.name}</p>
                          <p className="text-xs text-theme-text-muted truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          <button className="w-full px-4 py-2.5 text-left text-sm text-theme-text-secondary hover:bg-theme-secondary hover:text-indigo-500 flex items-center transition-colors">
                            <User className="w-4 h-4 mr-3 text-indigo-500" />
                            {t('auth.menu.profile')}
                          </button>
                          <button className="w-full px-4 py-2.5 text-left text-sm text-theme-text-secondary hover:bg-theme-secondary hover:text-indigo-500 flex items-center transition-colors">
                            <Settings className="w-4 h-4 mr-3 text-slate-500" />
                            {t('auth.menu.settings')}
                          </button>
                        </div>
                        <div className="border-t border-theme-border my-1"></div>
                        <button 
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-500/5 flex items-center transition-colors group"
                        >
                          <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                          {t('auth.menu.logout')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => openAuth('signin')}
                    className="text-theme-text-secondary hover:text-indigo-500 font-semibold text-sm px-4 py-2 transition-colors flex items-center"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {t('auth.signIn.action')}
                  </button>
                  <button 
                    onClick={() => openAuth('signup')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-theme-primary"
                  >
                    {t('nav.getAudit')}
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
               <button
                onClick={toggleTheme}
                className="text-theme-text-secondary hover:text-theme-text-primary p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-theme-text-secondary hover:text-theme-text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 p-1 rounded-md"
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
          <div className="md:hidden bg-theme-surface border-b border-theme-border absolute w-full shadow-xl animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {NAV_LINKS_CONFIG.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-secondary focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                   {t(`nav.${link.id}`)}
                </a>
              ))}
              
              {/* Mobile Language Selection */}
              <div className="border-t border-theme-border my-2 pt-2">
                 <div className="px-3 py-2 text-xs font-semibold text-theme-text-muted uppercase tracking-wider">Language</div>
                 <div className="grid grid-cols-2 gap-1 px-2">
                   {LANGUAGES.map((lang) => (
                     <button
                        key={lang.code}
                        onClick={() => selectLanguage(lang.code)}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm ${
                          language === lang.code ? 'bg-indigo-600/10 text-indigo-500' : 'text-theme-text-secondary hover:bg-theme-secondary'
                        }`}
                     >
                       <span>{lang.flag}</span>
                       <span>{lang.label}</span>
                     </button>
                   ))}
                 </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="border-t border-theme-border pt-4 px-2 space-y-2 pb-4">
                {user ? (
                  <>
                     <div className="flex items-center px-3 py-2 space-x-3 bg-theme-secondary rounded-lg mb-2">
                       <img 
                          src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full border border-indigo-500"
                        />
                        <div>
                          <p className="text-sm font-bold text-theme-text-primary">{user.name}</p>
                          <p className="text-xs text-theme-text-muted">{user.email}</p>
                        </div>
                     </div>
                     <button className="w-full text-left px-3 py-2 text-theme-text-secondary hover:text-theme-text-primary flex items-center">
                        <User className="w-4 h-4 mr-3" /> {t('auth.menu.profile')}
                     </button>
                     <button className="w-full text-left px-3 py-2 text-theme-text-secondary hover:text-theme-text-primary flex items-center">
                        <Settings className="w-4 h-4 mr-3" /> {t('auth.menu.settings')}
                     </button>
                     <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors font-medium flex items-center"
                     >
                        <LogOut className="w-4 h-4 mr-3" /> {t('auth.menu.logout')}
                     </button>
                  </>
                ) : (
                  <div className="space-y-3 mt-2">
                    <button 
                      onClick={() => openAuth('signin')}
                      className="w-full flex justify-center items-center bg-theme-secondary text-theme-text-primary border border-theme-border px-5 py-3 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                       <LogIn className="w-4 h-4 mr-2" />
                       {t('auth.signIn.action')}
                    </button>
                    <button 
                      onClick={() => openAuth('signup')}
                      className="w-full flex justify-center items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-3 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/20"
                    >
                       <UserPlus className="w-4 h-4 mr-2" />
                       {t('nav.getAudit')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        initialView={authView}
      />
    </>
  );
};