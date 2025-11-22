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

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-indigo-500 selection:text-white">
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
      <a 
        href="#contact"
        className={`fixed bottom-28 right-8 z-40 flex items-center bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3.5 rounded-full font-bold shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(99,102,241,0.7)] transition-all duration-300 transform ${
          showFloatingCTA ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        aria-label="Get a free quote"
      >
        <MessageSquare className="w-5 h-5 mr-2" />
        {t('floatingCTA')}
      </a>
    </div>
  );
};

export default App;