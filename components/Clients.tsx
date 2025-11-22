import React from 'react';
import { CLIENT_LOGOS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export const Clients: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-slate-900 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-indigo-400 uppercase tracking-widest">
            {t('clients.label')}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {CLIENT_LOGOS.map((client, index) => (
            <div 
              key={index} 
              className="w-full flex justify-center opacity-50 hover:opacity-100 transition-all duration-300 hover:scale-105"
            >
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                className="h-8 md:h-10 object-contain pointer-events-none select-none"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};