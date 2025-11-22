import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Megaphone, Share2, ArrowRight, Trash2, Facebook, Twitter, Linkedin, Lightbulb, Calendar, Clock, Search } from 'lucide-react';
import { generateMarketingCopy, generateSocialMediaIdeas, generateSeoContentIdeas } from '../services/geminiService';
import { LoadingState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export const AiTools: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ad-copy' | 'social-ideas' | 'seo-ideas'>('ad-copy');

  // Ad Copy State
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('Professional');
  const [adCopyResult, setAdCopyResult] = useState('');

  // Social Ideas State
  const [socialTopic, setSocialTopic] = useState('');
  const [socialAudience, setSocialAudience] = useState('');
  const [socialResult, setSocialResult] = useState('');

  // SEO Content State
  const [seoKeywords, setSeoKeywords] = useState('');
  const [seoAudience, setSeoAudience] = useState('');
  const [seoResult, setSeoResult] = useState('');

  // Common State
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Scheduling State
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleConfirmation, setScheduleConfirmation] = useState('');

  // Reset status when switching tabs
  useEffect(() => {
    setStatus(LoadingState.IDLE);
    setCopied(false);
    setShowShareMenu(false);
    setShowScheduleMenu(false);
    setScheduleConfirmation('');
    setScheduleDate('');
    setScheduleTime('');
  }, [activeTab]);

  const handleGenerate = async () => {
    setStatus(LoadingState.LOADING);
    setScheduleConfirmation('');
    
    if (activeTab === 'ad-copy') {
        if (!productName || !description) return;
        const generatedText = await generateMarketingCopy(productName, description, tone);
        setAdCopyResult(generatedText);
    } else if (activeTab === 'social-ideas') {
        if (!socialTopic || !socialAudience) return;
        const generatedText = await generateSocialMediaIdeas(socialTopic, socialAudience);
        setSocialResult(generatedText);
    } else {
        if (!seoKeywords || !seoAudience) return;
        const generatedText = await generateSeoContentIdeas(seoKeywords, seoAudience);
        setSeoResult(generatedText);
    }
    
    setStatus(LoadingState.SUCCESS);
  };

  const handleClear = () => {
    if (activeTab === 'ad-copy') {
      setProductName('');
      setDescription('');
      setTone('Professional');
      setAdCopyResult('');
    } else if (activeTab === 'social-ideas') {
      setSocialTopic('');
      setSocialAudience('');
      setSocialResult('');
    } else {
      setSeoKeywords('');
      setSeoAudience('');
      setSeoResult('');
    }
    setStatus(LoadingState.IDLE);
    setCopied(false);
    setShowShareMenu(false);
    setShowScheduleMenu(false);
    setScheduleConfirmation('');
  };

  const handleFillExample = () => {
    if (activeTab === 'ad-copy') {
      setProductName('Zenith 360 Noise-Cancelling Headphones');
      setDescription('Premium wireless over-ear headphones with adaptive noise cancellation, 40-hour battery life, and studio-quality sound. Designed for travelers and audiophiles who demand focus and comfort.');
      setTone('Luxury');
    } else if (activeTab === 'social-ideas') {
      setSocialTopic('5 Ways AI is Changing Digital Marketing in 2025');
      setSocialAudience('Marketing Professionals, Agencies, and Small Business Owners');
    } else {
      setSeoKeywords('digital marketing trends 2025, ai marketing tools, marketing automation');
      setSeoAudience('Small Business Owners, Marketing Directors');
    }
  };

  const handleCopy = () => {
    const text = activeTab === 'ad-copy' ? adCopyResult : activeTab === 'social-ideas' ? socialResult : seoResult;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const text = activeTab === 'ad-copy' ? adCopyResult : activeTab === 'social-ideas' ? socialResult : seoResult;
    const url = window.location.href;
    let shareUrl = '';

    switch (platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`; 
            break;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  const handleSchedule = () => {
    if (!scheduleDate || !scheduleTime) return;
    
    const dateObj = new Date(`${scheduleDate}T${scheduleTime}`);
    const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const formattedTime = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    
    setScheduleConfirmation(`Success! Post scheduled for ${formattedDate} at ${formattedTime}.`);
    setShowScheduleMenu(false);
    
    setTimeout(() => setScheduleConfirmation(''), 5000);
  };

  const renderFormattedText = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      if (line.trim().startsWith('###')) {
        const headerText = line.replace(/^#+\s*/, '');
        return (
          <h3 key={lineIndex} className="text-xl font-bold text-indigo-200 mt-6 mb-3 block border-b border-indigo-500/30 pb-2">
            {headerText}
          </h3>
        );
      }

      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={lineIndex} className={`${line.trim() === '' ? 'h-4' : 'mb-1'}`}>
          {parts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={partIndex} className="text-indigo-400 font-bold">{part.slice(2, -2)}</strong>;
            }
            return <span key={partIndex}>{part}</span>;
          })}
        </div>
      );
    });
  };

  const isFormValid = activeTab === 'ad-copy' 
    ? (productName && description) 
    : activeTab === 'social-ideas'
    ? (socialTopic && socialAudience)
    : (seoKeywords && seoAudience);

  const currentResult = activeTab === 'ad-copy' ? adCopyResult : activeTab === 'social-ideas' ? socialResult : seoResult;

  return (
    <section id="ai-tools" className="py-24 bg-gradient-to-b from-indigo-900/20 to-slate-900 relative overflow-hidden">
       {/* Decorative blob */}
       <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 mb-4">
                <Sparkles className="w-4 h-4 mr-2 text-indigo-400" />
                <span className="text-xs font-bold tracking-wider uppercase">{t('aiTools.badge')}</span>
            </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('aiTools.heading')}</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            {t('aiTools.subheading')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
            <div className="bg-slate-800/50 p-1 rounded-xl inline-flex border border-slate-700 flex-wrap justify-center gap-1 sm:gap-0">
                <button 
                    onClick={() => setActiveTab('ad-copy')}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        activeTab === 'ad-copy' 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                    <Megaphone className="w-4 h-4 mr-2" />
                    {t('aiTools.tabs.copy')}
                </button>
                <button 
                    onClick={() => setActiveTab('social-ideas')}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        activeTab === 'social-ideas' 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    {t('aiTools.tabs.ideas')}
                </button>
                <button 
                    onClick={() => setActiveTab('seo-ideas')}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        activeTab === 'seo-ideas' 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                >
                    <Search className="w-4 h-4 mr-2" />
                    {t('aiTools.tabs.seo')}
                </button>
            </div>
        </div>

        <div className="lg:grid lg:grid-cols-5 gap-8 items-start">
            {/* Input Form */}
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 h-full flex flex-col">
                
                {/* Form Header with Example Button */}
                <div className="flex justify-between items-center mb-6 border-b border-slate-700/50 pb-4">
                    <h3 className="text-white font-semibold">
                        {activeTab === 'ad-copy' ? 'Input Details' : activeTab === 'social-ideas' ? 'Campaign Settings' : 'SEO Parameters'}
                    </h3>
                    <button
                        onClick={handleFillExample}
                        className="text-xs flex items-center text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        title="Auto-fill with an example to see how it works"
                    >
                        <Lightbulb className="w-3 h-3 mr-1.5" />
                        {t('aiTools.form.tryExample')}
                    </button>
                </div>

                {activeTab === 'ad-copy' ? (
                    <div className="space-y-4 flex-grow animate-fade-in">
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-slate-300 mb-1">{t('aiTools.form.productName')}</label>
                            <input 
                                id="productName"
                                type="text" 
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="e.g. ezAI CRM"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">{t('aiTools.form.desc')}</label>
                            <textarea 
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                placeholder="..."
                            />
                        </div>
                        <div>
                            <label htmlFor="tone" className="block text-sm font-medium text-slate-300 mb-1">{t('aiTools.form.tone')}</label>
                            <select 
                                id="tone"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            >
                                <option>Professional</option>
                                <option>Exciting</option>
                                <option>Humorous</option>
                                <option>Urgent</option>
                                <option>Luxury</option>
                            </select>
                        </div>
                    </div>
                ) : activeTab === 'social-ideas' ? (
                    <div className="space-y-4 flex-grow animate-fade-in">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="socialTopic" className="block text-sm font-medium text-slate-300">{t('aiTools.form.topic')}</label>
                                <span className={`text-xs ${socialTopic.length >= 180 ? 'text-amber-400' : 'text-slate-500'}`}>
                                    {socialTopic.length}/200
                                </span>
                            </div>
                            <input 
                                id="socialTopic"
                                type="text" 
                                value={socialTopic}
                                maxLength={200}
                                onChange={(e) => setSocialTopic(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="..."
                            />
                        </div>
                        <div>
                            <label htmlFor="socialAudience" className="block text-sm font-medium text-slate-300 mb-1">{t('aiTools.form.audience')}</label>
                            <input 
                                id="socialAudience"
                                type="text" 
                                value={socialAudience}
                                onChange={(e) => setSocialAudience(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="..."
                            />
                        </div>
                        <div className="p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
                            <p className="text-sm text-indigo-300 flex items-start">
                                <Sparkles className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                We'll generate 3 unique post concepts with visuals and captions for you.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 flex-grow animate-fade-in">
                        <div>
                            <label htmlFor="seoKeywords" className="block text-sm font-medium text-slate-300 mb-1">{t('aiTools.form.keywords')}</label>
                            <textarea 
                                id="seoKeywords"
                                value={seoKeywords}
                                onChange={(e) => setSeoKeywords(e.target.value)}
                                rows={3}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                placeholder="e.g. digital marketing, seo tips, growth hacking"
                            />
                        </div>
                        <div>
                            <label htmlFor="seoAudience" className="block text-sm font-medium text-slate-300 mb-1">{t('aiTools.form.audience')}</label>
                            <input 
                                id="seoAudience"
                                type="text" 
                                value={seoAudience}
                                onChange={(e) => setSeoAudience(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                placeholder="..."
                            />
                        </div>
                         <div className="p-4 bg-indigo-900/20 rounded-lg border border-indigo-500/20">
                            <p className="text-sm text-indigo-300 flex items-start">
                                <Search className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                We'll generate blog titles, outlines, and meta descriptions optimized for search engines.
                            </p>
                        </div>
                    </div>
                )}

                <div className="mt-6 flex gap-3">
                    <button 
                        onClick={handleClear}
                        className="px-5 py-3 rounded-lg font-medium text-slate-400 border border-slate-700 hover:text-white hover:border-slate-500 hover:bg-slate-800/50 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        title={t('aiTools.form.clear')}
                        aria-label="Clear all fields"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>

                    <button 
                        onClick={handleGenerate}
                        disabled={status === LoadingState.LOADING || !isFormValid}
                        className={`flex-1 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                            status === LoadingState.LOADING 
                            ? 'bg-indigo-600/50 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-500 shadow-lg hover:shadow-indigo-500/25'
                        }`}
                    >
                        {status === LoadingState.LOADING ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                {t('aiTools.form.generating')}
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                {activeTab === 'ad-copy' 
                                    ? t('aiTools.form.generateCopy') 
                                    : activeTab === 'social-ideas' 
                                    ? t('aiTools.form.generateIdeas')
                                    : t('aiTools.form.generateSeo')}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Output Display */}
            <div className="lg:col-span-3 mt-8 lg:mt-0 h-full">
                <div className={`h-full min-h-[300px] bg-slate-950 rounded-2xl border border-slate-800 p-8 relative transition-all ${status === LoadingState.SUCCESS ? 'ring-2 ring-indigo-500/50' : ''}`}>
                    
                    {status === LoadingState.IDLE && !currentResult && (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            {activeTab === 'ad-copy' && <Megaphone className="w-12 h-12 mb-4 opacity-20" />}
                            {activeTab === 'social-ideas' && <Share2 className="w-12 h-12 mb-4 opacity-20" />}
                            {activeTab === 'seo-ideas' && <Search className="w-12 h-12 mb-4 opacity-20" />}
                            <p>Fill out the form to generate {activeTab === 'ad-copy' ? 'ad copy' : activeTab === 'social-ideas' ? 'social media ideas' : 'SEO content ideas'}.</p>
                        </div>
                    )}

                    {status === LoadingState.LOADING && (
                         <div className="h-full flex flex-col items-center justify-center text-indigo-400 animate-pulse">
                            <div className="w-3/4 h-4 bg-slate-800 rounded mb-4"></div>
                            <div className="w-full h-4 bg-slate-800 rounded mb-4"></div>
                            <div className="w-5/6 h-4 bg-slate-800 rounded"></div>
                        </div>
                    )}

                    {(status === LoadingState.SUCCESS || (status === LoadingState.IDLE && currentResult)) && (
                        <>
                             {/* Confirmation Banner */}
                             {scheduleConfirmation && (
                                <div className="absolute top-0 left-0 w-full bg-green-500/20 border-b border-green-500/30 text-green-400 px-6 py-3 flex items-center justify-center z-20 animate-fade-in-down">
                                    <Check className="w-4 h-4 mr-2" />
                                    <span className="text-sm font-semibold">{scheduleConfirmation}</span>
                                </div>
                            )}

                            <div className="absolute top-4 right-4 flex gap-2 z-20">
                                {/* Schedule Button */}
                                {activeTab === 'social-ideas' && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowScheduleMenu(!showScheduleMenu)}
                                            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            title="Schedule Post"
                                        >
                                            <Calendar className="w-5 h-5" />
                                        </button>

                                        {showScheduleMenu && (
                                            <>
                                                <div className="fixed inset-0 z-30" onClick={() => setShowScheduleMenu(false)}></div>
                                                <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-40 p-4 animate-fade-in ring-1 ring-white/10">
                                                    <div className="flex items-center gap-2 mb-4 text-indigo-400 border-b border-slate-800 pb-3">
                                                        <Clock className="w-4 h-4" />
                                                        <h4 className="font-bold text-sm">Schedule Campaign</h4>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Date</label>
                                                            <input 
                                                                type="date" 
                                                                value={scheduleDate} 
                                                                onChange={e => setScheduleDate(e.target.value)} 
                                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none [color-scheme:dark]" 
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Time</label>
                                                            <input 
                                                                type="time" 
                                                                value={scheduleTime} 
                                                                onChange={e => setScheduleTime(e.target.value)} 
                                                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-indigo-500 outline-none [color-scheme:dark]" 
                                                            />
                                                        </div>
                                                        <button 
                                                            onClick={handleSchedule}
                                                            disabled={!scheduleDate || !scheduleTime}
                                                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-lg transition-all mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                        >
                                                            Confirm Schedule
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Share Button & Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowShareMenu(!showShareMenu)}
                                        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        title="Share Content"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    
                                    {showShareMenu && (
                                        <>
                                            <div className="fixed inset-0 z-30" onClick={() => setShowShareMenu(false)}></div>
                                            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-40 overflow-hidden animate-fade-in">
                                                <button onClick={() => handleShare('twitter')} className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center transition-colors border-b border-slate-800/50">
                                                    <Twitter className="w-4 h-4 mr-3 text-sky-500" /> Twitter
                                                </button>
                                                <button onClick={() => handleShare('facebook')} className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center transition-colors border-b border-slate-800/50">
                                                    <Facebook className="w-4 h-4 mr-3 text-blue-500" /> Facebook
                                                </button>
                                                <button onClick={() => handleShare('linkedin')} className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white flex items-center transition-colors">
                                                    <Linkedin className="w-4 h-4 mr-3 text-blue-600" /> LinkedIn
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Copy Button */}
                                <button 
                                    onClick={handleCopy}
                                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            <div className="prose prose-invert max-w-none overflow-y-auto max-h-[600px] pr-2 custom-scrollbar pt-8">
                                <h3 className="text-indigo-300 text-lg font-semibold mb-4">
                                    {activeTab === 'ad-copy' 
                                        ? 'Generated Ad Copy:' 
                                        : activeTab === 'social-ideas' 
                                        ? 'Generated Social Media Ideas:'
                                        : 'Generated SEO Content Ideas:'}
                                </h3>
                                <div className="text-slate-200 leading-relaxed font-light text-lg">
                                    {renderFormattedText(currentResult)}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 relative rounded-2xl bg-slate-800/30 border border-slate-700/50 p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-6">{t('aiTools.enterprise.heading')}</h3>
                <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                    {t('aiTools.enterprise.desc')}
                </p>
                <a 
                    href="#contact" 
                    className="inline-flex items-center px-8 py-4 rounded-lg bg-white text-slate-900 font-bold text-lg hover:bg-indigo-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                    {t('aiTools.enterprise.cta')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                </a>
            </div>
        </div>
      </div>
    </section>
  );
};