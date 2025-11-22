import React, { useState } from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Rocket, Mail, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
        setEmailError('Please enter your email address to subscribe.');
        return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailError('Please enter a valid email format (e.g. you@domain.com).');
        return;
    }

    // Simulate API call
    setSubscribed(true);
    setEmail('');
    setEmailError('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      if (emailError) setEmailError('');
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-4">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                <Rocket className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-2xl text-white">
                ezAI <span className="text-indigo-500">Digital Marketing</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              {t('footer.desc')}
            </p>
            <div className="flex space-x-4">
                <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <Facebook className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
                <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
            </div>
          </div>
          
          {/* Links Section */}
          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white font-bold mb-6 text-lg">{t('footer.sections.company')}</h4>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center group"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>{t('footer.links.about')}</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center group"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>{t('footer.links.careers')}</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center group"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>{t('footer.links.caseStudies')}</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors flex items-center group"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>{t('footer.links.blog')}</a></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2">
            <h4 className="text-white font-bold mb-6 text-lg">{t('footer.sections.legal')}</h4>
            <ul className="space-y-3 text-slate-400">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t('footer.links.privacy')}</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t('footer.links.terms')}</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">{t('footer.links.cookie')}</a></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="col-span-1 md:col-span-4">
            <h4 className="text-white font-bold mb-6 text-lg">{t('footer.sections.newsletter')}</h4>
            <p className="text-slate-400 mb-4 text-sm leading-relaxed">
                {t('footer.newsletterDesc')}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${emailError ? 'text-red-500' : 'text-slate-500'}`} />
                    <input 
                        type="email" 
                        value={email}
                        onChange={handleEmailChange}
                        placeholder={t('footer.placeholder')} 
                        aria-label="Email address for newsletter"
                        className={`w-full bg-slate-900 border rounded-lg py-3 pl-10 pr-4 text-white outline-none transition-all placeholder:text-slate-600 ${
                            emailError 
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/50' 
                            : 'border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                        }`}
                    />
                </div>
                {emailError && (
                    <p className="text-red-500 text-xs flex items-center animate-fade-in">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {emailError}
                    </p>
                )}
                <button 
                    type="submit"
                    disabled={subscribed}
                    className={`w-full font-bold py-3 rounded-lg transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        subscribed 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/25'
                    }`}
                >
                    {subscribed ? (
                        <>
                            <Check className="w-5 h-5 mr-2" />
                            {t('footer.subscribed')}
                        </>
                    ) : (
                        <>
                            {t('footer.subscribe')}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                    )}
                </button>
                <p className="text-xs text-slate-600 text-center">
                    No spam ever. Unsubscribe anytime.
                </p>
            </form>
          </div>
        </div>
        
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} ezAI Digital Marketing. {t('footer.rights')}
          </p>
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span>{t('footer.designed')}</span>
            <span className="text-red-500">❤</span>
            <span>by ezAI Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};