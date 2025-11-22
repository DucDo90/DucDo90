import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { ResultsChart } from './components/ResultsChart';
import { AiTools } from './components/AiTools';
import { Testimonials } from './components/Testimonials';
import { Clients } from './components/Clients';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ChatBot } from './components/ChatBot';
import { useLanguage } from './contexts/LanguageContext';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);
      setShowFloatingCTA(scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetQuote = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = t('contact.form.quotePrefill') || "I'm interested in getting a quote for your services.";
    const event = new CustomEvent('prefill-contact-form', { detail: { message } });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-theme-primary text-theme-text-primary selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      <Header scrolled={scrolled} />
      <main>
        <Hero />
        <Services />
        <ResultsChart />
        <AiTools />
        <Testimonials />
        <Clients />
        <Contact />
      </main>
      <Footer />

      <ChatBot />

      {/* Floating CTA Button - Positioned above ChatBot */}
      <button 
        onClick={handleGetQuote}
        className={`fixed bottom-28 right-8 z-40 flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)] transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-theme-primary ${
          showFloatingCTA ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        aria-label="Get a free quote"
      >
        <MessageSquare className="w-5 h-5 mr-2" />
        {t('floatingCTA')}
      </button>
    </div>
  );
};

export default App;