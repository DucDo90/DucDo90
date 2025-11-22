import React, { useState } from 'react';
import { SERVICE_ICONS } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { X, ArrowRight, Check, Loader2, AlertCircle, Calculator, Mail, CheckCircle, ArrowLeft } from 'lucide-react';

export const Services: React.FC = () => {
  const { t } = useLanguage();
  const serviceItems = t('services.items') as Array<{title: string, desc: string}>;
  
  // Assign icon to capitalized variable for JSX usage
  const SeoIcon = SERVICE_ICONS[0];
  
  const [activeModal, setActiveModal] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  
  // Modal Flow State
  const [modalStep, setModalStep] = useState<'analysis' | 'capture' | 'success'>('analysis');
  const [captureEmail, setCaptureEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  
  // SEO Audit Form State
  const [seoUrl, setSeoUrl] = useState('');
  
  // PPC Calc Form State
  const [ppcBudget, setPpcBudget] = useState('1000');
  const [ppcCpc, setPpcCpc] = useState('2.50');

  const handleServiceClick = (index: number) => {
    setAnalysisResult(null);
    setAnalyzing(false);
    setModalStep('analysis');
    setCaptureEmail('');
    setSendingEmail(false);
    
    if (index === 0) { // SEO Optimization
      setActiveModal(0);
    } else if (index === 1) { // PPC Campaigns
      setActiveModal(1);
    } else if (index === 2) { // Social Media Marketing
      // Navigate to AI Tools -> Social Ideas
      const event = new CustomEvent('switch-ai-tab', { detail: { tab: 'social-ideas' } });
      window.dispatchEvent(event);
      document.getElementById('ai-tools')?.scrollIntoView({ behavior: 'smooth' });
    } else if (index === 3) { // Content Strategy
      // Navigate to AI Tools -> Ad Copy
      const event = new CustomEvent('switch-ai-tab', { detail: { tab: 'ad-copy' } });
      window.dispatchEvent(event);
      document.getElementById('ai-tools')?.scrollIntoView({ behavior: 'smooth' });
    } else if (index === 4) { // Data Analytics
      // Navigate to Results
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    } else if (index === 5) { // Conversion Optimization
      // Navigate to Contact for Audit
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setSeoUrl('');
    setModalStep('analysis');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captureEmail) return;
    
    setSendingEmail(true);
    setTimeout(() => {
      setSendingEmail(false);
      setModalStep('success');
    }, 1500);
  };

  const runSeoAudit = () => {
    if (!seoUrl) return;
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult({
        score: 72,
        issues: [
            "Missing Meta Description",
            "Mobile Load Speed: Low",
            "H1 Tag Not Optimized"
        ],
        wins: [
            "SSL Certificate Valid",
            "Robots.txt Found",
            "Mobile Friendly Design"
        ]
      });
    }, 1500);
  };

  const calculatePpc = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const budget = parseFloat(ppcBudget) || 0;
      const cpc = parseFloat(ppcCpc) || 0;
      const clicks = cpc > 0 ? Math.floor(budget / cpc) : 0;
      const conversions = Math.floor(clicks * 0.03); // Assume 3% conversion

      setAnalyzing(false);
      setAnalysisResult({
        clicks: clicks,
        leads: conversions,
        cpa: conversions > 0 ? (budget / conversions).toFixed(2) : 0
      });
    }, 800);
  };

  return (
    <section id="services" className="py-24 bg-theme-primary relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-theme-text-primary mb-4">{t('services.heading')}</h2>
          <p className="text-theme-text-muted max-w-2xl mx-auto text-lg">
            {t('services.subheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceItems.map((service, index) => {
            const Icon = SERVICE_ICONS[index] || SERVICE_ICONS[0];
            return (
              <div 
                key={index}
                onClick={() => handleServiceClick(index)}
                className="group p-8 rounded-2xl bg-theme-surface border border-theme-border hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer relative overflow-hidden"
              >
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors duration-300"></div>

                <div className="w-14 h-14 bg-indigo-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300 relative z-10">
                  <Icon className="w-7 h-7 text-indigo-500 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-theme-text-primary mb-3 relative z-10 flex items-center justify-between">
                    {service.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-500" />
                </h3>
                <p className="text-theme-text-muted leading-relaxed relative z-10">
                  {service.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Modals */}
      {activeModal !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={closeModal}></div>
            <div className="bg-theme-surface border border-theme-border w-full max-w-lg rounded-2xl shadow-2xl relative z-10 animate-fade-in-up overflow-hidden">
                <button 
                    onClick={closeModal} 
                    className="absolute top-4 right-4 text-theme-text-muted hover:text-theme-text-primary p-1 z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* SEO Modal Content */}
                {activeModal === 0 && (
                    <div className="p-6 md:p-8">
                        {/* Header */}
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mr-4 text-indigo-500">
                                <SeoIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-theme-text-primary">Free SEO Audit</h3>
                        </div>
                        
                        {/* Modal View Logic */}
                        {modalStep === 'analysis' && (
                          <>
                            {!analysisResult ? (
                                <>
                                    <p className="text-theme-text-muted mb-6">Enter your website URL to get a quick instant analysis of your current SEO performance.</p>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-theme-text-secondary mb-2">Website URL</label>
                                        <input 
                                            type="text" 
                                            value={seoUrl}
                                            onChange={(e) => setSeoUrl(e.target.value)}
                                            placeholder="https://example.com"
                                            className="w-full bg-theme-input border border-theme-border rounded-lg px-4 py-3 text-theme-text-primary focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                    </div>
                                    <button 
                                        onClick={runSeoAudit}
                                        disabled={!seoUrl || analyzing}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center disabled:opacity-70"
                                    >
                                        {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze Website"}
                                    </button>
                                </>
                            ) : (
                                <div className="animate-fade-in">
                                    <div className="flex items-center justify-between mb-6 p-4 bg-theme-secondary rounded-xl border border-theme-border">
                                        <span className="font-bold text-theme-text-secondary">SEO Score</span>
                                        <span className={`text-3xl font-bold ${analysisResult.score > 70 ? 'text-green-500' : 'text-amber-500'}`}>{analysisResult.score}/100</span>
                                    </div>
                                    <div className="mb-6">
                                        <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">Issues Found</h4>
                                        <ul className="space-y-2">
                                            {analysisResult.issues.map((issue: string, i: number) => (
                                                <li key={i} className="flex items-center text-sm text-theme-text-secondary">
                                                    <AlertCircle className="w-4 h-4 mr-2 text-red-400" />
                                                    {issue}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mb-8">
                                        <h4 className="text-sm font-bold text-green-500 uppercase tracking-wider mb-3">Passed Checks</h4>
                                        <ul className="space-y-2">
                                            {analysisResult.wins.map((win: string, i: number) => (
                                                <li key={i} className="flex items-center text-sm text-theme-text-secondary">
                                                    <Check className="w-4 h-4 mr-2 text-green-500" />
                                                    {win}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button 
                                        onClick={() => setModalStep('capture')}
                                        className="w-full bg-theme-surface border border-indigo-500 text-indigo-500 hover:bg-indigo-500 hover:text-white font-bold py-3 rounded-lg transition-all"
                                    >
                                        {t('services.modal.seo.getReport') || 'Get Full Report'}
                                    </button>
                                </div>
                            )}
                          </>
                        )}

                        {modalStep === 'capture' && (
                           <div className="animate-fade-in">
                              <button 
                                onClick={() => setModalStep('analysis')}
                                className="text-sm text-theme-text-muted hover:text-indigo-500 flex items-center mb-4"
                              >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                {t('services.modal.seo.back') || 'Back to Analysis'}
                              </button>
                              <h3 className="text-xl font-bold text-theme-text-primary mb-2">
                                {t('services.modal.seo.reportTitle') || 'Email Your Full Report'}
                              </h3>
                              <p className="text-theme-text-muted mb-6 text-sm">
                                {t('services.modal.seo.reportDesc') || 'Enter your email to receive the detailed PDF.'}
                              </p>
                              <form onSubmit={handleReportSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                                      {t('services.modal.seo.emailLabel') || 'Business Email'}
                                    </label>
                                    <div className="relative">
                                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-text-muted" />
                                      <input 
                                          type="email" 
                                          required
                                          value={captureEmail}
                                          onChange={(e) => setCaptureEmail(e.target.value)}
                                          placeholder="name@company.com"
                                          className="w-full bg-theme-input border border-theme-border rounded-lg py-3 pl-10 pr-4 text-theme-text-primary focus:ring-2 focus:ring-indigo-500 outline-none"
                                      />
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={!captureEmail || sendingEmail}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center disabled:opacity-70"
                                >
                                    {sendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : (t('services.modal.seo.sendBtn') || 'Send Report PDF')}
                                </button>
                              </form>
                           </div>
                        )}

                        {modalStep === 'success' && (
                           <div className="animate-fade-in text-center py-8">
                              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <CheckCircle className="w-10 h-10 text-green-500" />
                              </div>
                              <h3 className="text-2xl font-bold text-theme-text-primary mb-2">
                                {t('services.modal.seo.successTitle') || 'Report Sent!'}
                              </h3>
                              <p className="text-theme-text-muted mb-8">
                                {t('services.modal.seo.successDesc') || 'Check your inbox for the PDF report.'}
                              </p>
                              <button 
                                onClick={closeModal}
                                className="bg-theme-secondary hover:bg-theme-border text-theme-text-primary font-medium py-2 px-6 rounded-lg transition-colors border border-theme-border"
                              >
                                Close
                              </button>
                           </div>
                        )}
                    </div>
                )}

                {/* PPC Calculator Modal Content */}
                {activeModal === 1 && (
                    <div className="p-6 md:p-8">
                        <div className="flex items-center mb-6">
                            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center mr-4 text-indigo-500">
                                <Calculator className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-theme-text-primary">PPC ROI Estimator</h3>
                        </div>

                        {modalStep === 'analysis' && (
                          <>
                            {!analysisResult ? (
                                <>
                                    <p className="text-theme-text-muted mb-6">Estimate your potential campaign results based on budget and average market CPC.</p>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-theme-text-secondary mb-2">Monthly Budget ($)</label>
                                            <input 
                                                type="number" 
                                                value={ppcBudget}
                                                onChange={(e) => setPpcBudget(e.target.value)}
                                                className="w-full bg-theme-input border border-theme-border rounded-lg px-4 py-3 text-theme-text-primary focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-theme-text-secondary mb-2">Avg CPC ($)</label>
                                            <input 
                                                type="number" 
                                                value={ppcCpc}
                                                onChange={(e) => setPpcCpc(e.target.value)}
                                                step="0.1"
                                                className="w-full bg-theme-input border border-theme-border rounded-lg px-4 py-3 text-theme-text-primary focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={calculatePpc}
                                        disabled={analyzing}
                                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center disabled:opacity-70"
                                    >
                                        {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Calculate Potential"}
                                    </button>
                                </>
                            ) : (
                                <div className="animate-fade-in text-center">
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-theme-secondary p-4 rounded-xl border border-theme-border">
                                            <div className="text-sm text-theme-text-muted mb-1">Est. Clicks</div>
                                            <div className="text-2xl font-bold text-theme-text-primary">{analysisResult.clicks}</div>
                                        </div>
                                        <div className="bg-theme-secondary p-4 rounded-xl border border-theme-border">
                                            <div className="text-sm text-theme-text-muted mb-1">Est. Leads</div>
                                            <div className="text-2xl font-bold text-indigo-500">{analysisResult.leads}</div>
                                        </div>
                                    </div>
                                    <div className="bg-indigo-600/10 p-4 rounded-xl border border-indigo-500/20 mb-8">
                                        <div className="text-sm text-indigo-400 mb-1">Estimated Cost Per Lead</div>
                                        <div className="text-3xl font-bold text-indigo-500">${analysisResult.cpa}</div>
                                    </div>
                                    <div className="flex space-x-3">
                                        <button 
                                            onClick={() => setAnalysisResult(null)}
                                            className="flex-1 bg-transparent border border-theme-border text-theme-text-secondary hover:text-theme-text-primary font-bold py-3 rounded-lg transition-all"
                                        >
                                            {t('services.modal.ppc.recalcBtn') || 'Recalculate'}
                                        </button>
                                        <button 
                                            onClick={() => setModalStep('capture')}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-all"
                                        >
                                            {t('services.modal.ppc.startBtn') || 'Start Campaign'}
                                        </button>
                                    </div>
                                </div>
                            )}
                          </>
                        )}

                        {modalStep === 'capture' && (
                           <div className="animate-fade-in">
                              <button 
                                onClick={() => setModalStep('analysis')}
                                className="text-sm text-theme-text-muted hover:text-indigo-500 flex items-center mb-4"
                              >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back
                              </button>
                              <h3 className="text-xl font-bold text-theme-text-primary mb-2">
                                {t('services.modal.ppc.startTitle') || 'Ready to Scale?'}
                              </h3>
                              <p className="text-theme-text-muted mb-6 text-sm">
                                {t('services.modal.ppc.startDesc') || 'Our team can setup this campaign structure for you.'}
                              </p>
                              <form onSubmit={handleReportSubmit}>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-theme-text-secondary mb-2">
                                      Business Email
                                    </label>
                                    <div className="relative">
                                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-text-muted" />
                                      <input 
                                          type="email" 
                                          required
                                          value={captureEmail}
                                          onChange={(e) => setCaptureEmail(e.target.value)}
                                          placeholder="name@company.com"
                                          className="w-full bg-theme-input border border-theme-border rounded-lg py-3 pl-10 pr-4 text-theme-text-primary focus:ring-2 focus:ring-indigo-500 outline-none"
                                      />
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={!captureEmail || sendingEmail}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center disabled:opacity-70"
                                >
                                    {sendingEmail ? <Loader2 className="w-5 h-5 animate-spin" /> : (t('services.modal.ppc.reqBtn') || 'Request Campaign Setup')}
                                </button>
                              </form>
                           </div>
                        )}

                        {modalStep === 'success' && (
                           <div className="animate-fade-in text-center py-8">
                              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <CheckCircle className="w-10 h-10 text-green-500" />
                              </div>
                              <h3 className="text-2xl font-bold text-theme-text-primary mb-2">
                                {t('services.modal.ppc.successTitle') || 'Request Received'}
                              </h3>
                              <p className="text-theme-text-muted mb-8">
                                {t('services.modal.ppc.successDesc') || 'Our ad specialists will review and contact you.'}
                              </p>
                              <button 
                                onClick={closeModal}
                                className="bg-theme-secondary hover:bg-theme-border text-theme-text-primary font-medium py-2 px-6 rounded-lg transition-colors border border-theme-border"
                              >
                                Close
                              </button>
                           </div>
                        )}
                    </div>
                )}
            </div>
        </div>
      )}
    </section>
  );
};