import React from 'react';
import { SERVICE_ICONS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export const Services: React.FC = () => {
  const { t } = useLanguage();
  const serviceItems = t('services.items') as Array<{title: string, desc: string}>;

  return (
    <section id="services" className="py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('services.heading')}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            {t('services.subheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceItems.map((service, index) => {
            const Icon = SERVICE_ICONS[index] || SERVICE_ICONS[0];
            return (
              <div 
                key={index}
                className="group p-8 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-indigo-900/50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-indigo-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};