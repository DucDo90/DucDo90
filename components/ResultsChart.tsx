import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_DATA } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

export const ResultsChart: React.FC = () => {
  const { t } = useLanguage();
  const listItems = t('results.list') as string[];

  return (
    <section id="results" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          
          <div className="mb-12 lg:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('results.heading')} <br />
              <span className="text-indigo-400">{t('results.headingHighlight')}</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              {t('results.description')}
            </p>
            
            <ul className="space-y-4">
              {listItems.map((item, idx) => (
                <li key={idx} className="flex items-center text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-2xl">
             <div className="mb-6 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">{t('results.chartTitle')}</h3>
                <div className="flex space-x-4 text-xs font-medium">
                    <div className="flex items-center"><span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>Traffic</div>
                    <div className="flex items-center"><span className="w-3 h-3 bg-teal-400 rounded-full mr-2"></span>Conversions</div>
                </div>
             </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={CHART_DATA}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
                    itemStyle={{ color: '#f1f5f9' }}
                  />
                  <Area type="monotone" dataKey="traffic" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                  <Area type="monotone" dataKey="conversions" stroke="#2dd4bf" strokeWidth={3} fillOpacity={1} fill="url(#colorConv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};