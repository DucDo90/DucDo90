import React from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIAL_IMAGES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export const Testimonials: React.FC = () => {
  const { t } = useLanguage();
  const reviews = t('testimonials.reviews') as Array<{content: string, role: string}>;
  
  const names = ["Sarah Jenkins", "David Chen", "Elena Rodriguez", "Michael Ross"];
  const companies = ["TechFlow Inc.", "StartUp Grp", "Lifestyle Brand", "DataSync Solutions"];

  return (
    <section id="testimonials" className="py-24 bg-theme-primary transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-theme-text-primary mb-16">{t('testimonials.heading')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review, index) => (
            <div 
              key={index} 
              className="bg-theme-surface p-8 rounded-2xl border border-theme-border relative flex flex-col h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] hover:border-indigo-500/30"
            >
              <Quote className="absolute top-8 right-8 w-8 h-8 text-indigo-500/20" />
              <p className="text-theme-text-secondary mb-6 leading-relaxed relative z-10 flex-grow">
                "{review.content}"
              </p>
              <div className="flex items-center">
                <img 
                  src={TESTIMONIAL_IMAGES[index]} 
                  alt={names[index]} 
                  className="w-12 h-12 rounded-full mr-4 border-2 border-indigo-500"
                />
                <div>
                  <h4 className="text-theme-text-primary font-bold text-sm">{names[index]}</h4>
                  <p className="text-indigo-500 text-xs">{review.role}, {companies[index]}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};