import React from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIAL_IMAGES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export const Testimonials: React.FC = () => {
  const { t } = useLanguage();
  const reviews = t('testimonials.reviews') as Array<{content: string, role: string}>;
  
  // Hardcoded names and companies to simulate static data, but roles and content are translated
  const names = ["Sarah Jenkins", "David Chen", "Elena Rodriguez", "Michael Ross"];
  const companies = ["TechFlow Inc.", "StartUp Grp", "Lifestyle Brand", "DataSync Solutions"];

  return (
    <section id="testimonials" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">{t('testimonials.heading')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review, index) => (
            <div key={index} className="bg-slate-800/30 p-8 rounded-2xl border border-slate-800 relative flex flex-col h-full">
              <Quote className="absolute top-8 right-8 w-8 h-8 text-indigo-900/50" />
              <p className="text-slate-300 mb-6 leading-relaxed relative z-10 flex-grow">
                "{review.content}"
              </p>
              <div className="flex items-center">
                <img 
                  src={TESTIMONIAL_IMAGES[index]} 
                  alt={names[index]} 
                  className="w-12 h-12 rounded-full mr-4 border-2 border-indigo-500"
                />
                <div>
                  <h4 className="text-white font-bold text-sm">{names[index]}</h4>
                  <p className="text-indigo-400 text-xs">{review.role}, {companies[index]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};