import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Check, Megaphone, Share2, ArrowRight, Trash2, Facebook, Twitter, Linkedin, Lightbulb, Calendar, Clock, Search, AlertCircle, Loader2, Sliders, ChevronDown, ChevronUp, Ban, Image as ImageIcon, Download } from 'lucide-react';
import { generateMarketingCopy, generateSocialMediaIdeas, generateSeoContentIdeas, generateAdImage } from '../services/geminiService';
import { LoadingState } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

// Helper to safely access localStorage
const getStoredValue = (key: string, defaultValue: string) => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    return saved !== null ? saved : defaultValue;
  }
  return defaultValue;
};

export const AiTools: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  
  // Initialize state from localStorage or defaults
  const [activeTab, setActiveTab] = useState<'ad-copy' | 'social-ideas' | 'seo-ideas'>(() => 
    (getStoredValue('ezai_activeTab', 'ad-copy') as 'ad-copy' | 'social-ideas' | 'seo-ideas')
  );

  // Listen for external tab switch events (e.g., from Services component)
  useEffect(() => {
    const handleTabSwitch = (e: CustomEvent) => {
      if (e.detail && e.detail.tab) {
        setActiveTab(e.detail.tab);
      }
    };

    window.addEventListener('switch-ai-tab', handleTabSwitch as EventListener);
    return () => {
      window.removeEventListener('switch-ai-tab', handleTabSwitch as EventListener);
    };
  }, []);

  // Ad Copy State
  const [productName, setProductName] = useState(() => getStoredValue('ezai_productName', ''));
  const [description, setDescription] = useState(() => getStoredValue('ezai_description', ''));
  const [platform, setPlatform] = useState(() => getStoredValue('ezai_platform', 'Facebook'));
  const [tone, setTone] = useState(() => getStoredValue('ezai_tone', 'Professional'));
  const [adCopyResult, setAdCopyResult] = useState(() => getStoredValue('ezai_adCopyResult', ''));
  
  // Image Gen State (Transient, not persisted to avoid quota issues)
  const [adImage, setAdImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Social Ideas State
  const [socialTopic, setSocialTopic] = useState(() => getStoredValue('ezai_socialTopic', ''));
  const [socialAudience, setSocialAudience] = useState(() => getStoredValue('ezai_socialAudience', ''));
  const [socialResult, setSocialResult] = useState(() => getStoredValue('ezai_socialResult', ''));

  // SEO Content State
  const [seoKeywords, setSeoKeywords] = useState(() => getStoredValue('ezai_seoKeywords', ''));
  const [seoAudience, setSeoAudience] = useState(() => getStoredValue('ezai_seoAudience', ''));
  const [seoResult, setSeoResult] = useState(() => getStoredValue('ezai_seoResult', ''));

  // Advanced Settings State
  const [advLength, setAdvLength] = useState(() => getStoredValue('ezai_adv_length', 'Medium'));
  const [advCreativity, setAdvCreativity] = useState(() => getStoredValue('ezai_adv_creativity', 'High'));
  const [advNegativeKeywords, setAdvNegativeKeywords] = useState(() => getStoredValue('ezai_adv_neg', ''));
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Persistence Effects
  useEffect(() => { localStorage.setItem('ezai_activeTab', activeTab); }, [activeTab]);
  
  useEffect(() => { localStorage.setItem('ezai_productName', productName); }, [productName]);
  useEffect(() => { localStorage.setItem('ezai_description', description); }, [description]);
  useEffect(() => { localStorage.setItem('ezai_platform', platform); }, [platform]);
  useEffect(() => { localStorage.setItem('ezai_tone', tone); }, [tone]);
  useEffect(() => { localStorage.setItem('ezai_adCopyResult', adCopyResult); }, [adCopyResult]);

  useEffect(() => { localStorage.setItem('ezai_socialTopic', socialTopic); }, [socialTopic]);
  useEffect(() => { localStorage.setItem('ezai_socialAudience', socialAudience); }, [socialAudience]);
  useEffect(() => { localStorage.setItem('ezai_socialResult', socialResult); }, [socialResult]);

  useEffect(() => { localStorage.setItem('ezai_seoKeywords', seoKeywords); }, [seoKeywords]);
  useEffect(() => { localStorage.setItem('ezai_seoAudience', seoAudience); }, [seoAudience]);
  useEffect(() => { localStorage.setItem('ezai_seoResult', seoResult); }, [seoResult]);

  useEffect(() => { localStorage.setItem('ezai_adv_length', advLength); }, [advLength]);
  useEffect(() => { localStorage.setItem('ezai_adv_creativity', advCreativity); }, [advCreativity]);
  useEffect(() => { localStorage.setItem('ezai_adv_neg', advNegativeKeywords); }, [advNegativeKeywords]);

  // Validation State
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Common State
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Scheduling State
  const [showScheduleMenu, setShowScheduleMenu] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduleConfirmation, setScheduleConfirmation] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);

  // Reset status and validation when switching tabs
  useEffect(() => {
    setStatus(LoadingState.IDLE);
    setErrorMessage('');
    setCopied(false);
    setShowShareMenu(false);
    setShowScheduleMenu(false);
    setScheduleConfirmation('');
    setScheduleDate('');
    setScheduleTime('');
    setIsScheduling(false);
    setTouched({});
    // Clear specific tab states if needed, but we are persisting inputs.
    // Just clear transient image state
    if (activeTab !== 'ad-copy') {
        setAdImage(null);
    }
  }, [activeTab]);

  // Validation Helper Functions
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: string, value: string) => {
    if (!touched[field]) return null;
    
    if (!value.trim()) return "This field is required.";
    
    if (field === 'description' && value.trim().length < 10) {
        return "Description must be at least 10 characters.";
    }
    if (field === 'socialTopic' && value.trim().length < 3) {
        return "Topic must be at least 3 characters.";
    }
    return null;
  };

  const getInputClasses = (field: string, value: string) => {
    const hasError = !!getFieldError(field, value);
    const baseClasses = "w-full bg-theme-input border rounded-lg px-4 py-3 text-theme-text-primary outline-none transition-all placeholder:text-theme-text-muted";
    
    if (hasError) {
        return `${baseClasses} border-red-500 focus:ring-2 focus:ring-red-500/50 focus:border-red-500`;
    }
    return `${baseClasses} border-theme-border focus:ring-2 focus:ring-indigo-500 focus:border-transparent`;
  };

  const renderError = (field: string, value: string) => {
      const error = getFieldError(field, value);
      if (!error) return null;
      return (
          <p className="mt-1 text-xs text-red-500 flex items-center animate-fade-in">
              <AlertCircle className="w-3 h-3 mr-1" />
              {error}
          </p>
      );
  };

  const handleGenerate = async () => {
    setStatus(LoadingState.LOADING);
    setScheduleConfirmation('');
    setErrorMessage('');
    
    const advancedOptions = {
        length: advLength,
        creativity: advCreativity,
        negativeKeywords: advNegativeKeywords
    };

    try {
        if (activeTab === 'ad-copy') {
            if (!productName || !description) return;
            const generatedText = await generateMarketingCopy(productName, description, platform, tone, advancedOptions);
            setAdCopyResult(generatedText);
        } else if (activeTab === 'social-ideas') {
            if (!socialTopic || !socialAudience) return;
            const generatedText = await generateSocialMediaIdeas(socialTopic, socialAudience, advancedOptions);
            setSocialResult(generatedText);
        } else {
            if (!seoKeywords || !seoAudience) return;
            const generatedText = await generateSeoContentIdeas(seoKeywords, seoAudience, advancedOptions);
            setSeoResult(generatedText);
        }
        
        setStatus(LoadingState.SUCCESS);
    } catch (error: any) {
        console.error("Generation failed:", error);
        setStatus(LoadingState.ERROR);
        setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  const handleGenerateImage = async () => {
      if (!productName || !description) return;
      setIsGeneratingImage(true);
      setErrorMessage('');

      try {
          const imageBase64 = await generateAdImage(productName, description, tone);
          if (imageBase64) {
              setAdImage(imageBase64);
          } else {
              setErrorMessage("Could not generate image. Please try again.");
          }
      } catch (error: any) {
          console.error("Image generation failed:", error);
          setErrorMessage(error.message || "An error occurred while generating the image.");
      } finally {
          setIsGeneratingImage(false);
      }
  };

  const handleClear = () => {
    if (activeTab === 'ad-copy') {
      setProductName('');
      setDescription('');
      setPlatform('Facebook');
      setTone('Professional');
      setAdCopyResult('');
      setAdImage(null);
    } else if (activeTab === 'social-ideas') {
      setSocialTopic('');
      setSocialAudience('');
      setSocialResult('');
    } else {
      setSeoKeywords('');
      setSeoAudience('');
      setSeoResult('');
    }
    // Reset advanced settings
    setAdvLength('Medium');
    setAdvCreativity('High');
    setAdvNegativeKeywords('');
    setShowAdvanced(false);

    setStatus(LoadingState.IDLE);
    setErrorMessage('');
    setCopied(false);
    setShowShareMenu(false);
    setShowScheduleMenu(false);
    setScheduleConfirmation('');
    setIsScheduling(false);
    setTouched({});
  };

  const handleFillExample = () => {
    setTouched({});
    if (activeTab === 'ad-copy') {
      setProductName('Zenith 360 Noise-Cancelling Headphones');
      setDescription('Premium wireless over-ear headphones with adaptive noise cancellation, 40-hour battery life, and studio-quality sound. Designed for travelers and audiophiles who demand focus and comfort.');
      setPlatform('Instagram');
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

  const handleSchedule = async () => {
    if (!scheduleDate || !scheduleTime) return;
    
    setIsScheduling(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const dateObj = new Date(`${scheduleDate}T${scheduleTime}`);
    const formattedDate = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const formattedTime = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    
    setIsScheduling(false);
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
          <h3 key={lineIndex} className="text-xl font-bold text-indigo-400 mt-6 mb-3 block border-b border-indigo-500/30 pb-2">
            {headerText}
          </h3>
        );
      }

      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <div key={lineIndex} className={`${line.trim() === '' ? 'h-4' : 'mb-1'}`}>
          {parts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={partIndex} className="text-indigo-500 font-bold">{part.slice(2, -2)}</strong>;
            }
            return <span key={partIndex}>{part}</span>;
          })}
        </div>
      );
    });
  };

  const renderAdvancedSettings = () => (
    <div className="border-t border-theme-border pt-4 mt-2 animate-fade-in">
        <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors w-full justify-between group focus:outline-none"
        >
            <span className="flex items-center">
                <Sliders className="w-4 h-4 mr-2" />
                {t('aiTools.advanced.title')}
            </span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {showAdvanced && (
            <div className="mt-4 space-y-4 pl-2 border-l-2 border-indigo-500/20 animate-fade-in">
                 <div>
                    <label className="block text-xs font-medium text-theme-text-secondary mb-1.5">{t('aiTools.advanced.length')}</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Short', 'Medium', 'Long'].map(l => (
                            <button
                                key={l}
                                onClick={() => setAdvLength(l)}
                                className={`px-3 py-1.5 text-xs rounded-md border transition-all ${
                                    advLength === l 
                                    ? 'bg-indigo-600 text-white border-indigo-600' 
                                    : 'bg-theme-input text-theme-text-muted border-theme-border hover:border-indigo-500/50'
                                }`}
                            >
                                {t(`aiTools.advanced.levels.${l.toLowerCase()}`) || l}
                            </button>
                        ))}
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-medium text-theme-text-secondary mb-1.5">{t('aiTools.advanced.creativity')}</label>
                    <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        step="1"
                        value={advCreativity === 'Low' ? 1 : advCreativity === 'Medium' ? 2 : 3}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setAdvCreativity(val === 1 ? 'Low' : val === 2 ? 'Medium' : 'High');
                        }}
                        className="w-full h-2 bg-theme-border rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between text-xs text-theme-text-muted mt-1">
                        <span className={advCreativity === 'Low' ? 'text-indigo-500 font-bold' : ''}>{t('aiTools.advanced.levels.low')}</span>
                        <span className={advCreativity === 'Medium' ? 'text-indigo-500 font-bold' : ''}>{t('aiTools.advanced.levels.medium')}</span>
                        <span className={advCreativity === 'High' ? 'text-indigo-500 font-bold' : ''}>{t('aiTools.advanced.levels.high')}</span>
                    </div>
                 </div>

                 <div>
                    <label className="block text-xs font-medium text-theme-text-secondary mb-1.5 flex items-center">
                        <Ban className="w-3 h-3 mr-1.5 text-red-400" />
                        {t('aiTools.advanced.negative')}
                    </label>
                    <input 
                        type="text"
                        value={advNegativeKeywords}
                        onChange={(e) => setAdvNegativeKeywords(e.target.value)}
                        placeholder={t('aiTools.advanced.negativePlaceholder')}
                        className="w-full bg-theme-input border border-theme-border rounded-lg px-3 py-2 text-sm text-theme-text-primary outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-theme-text-muted"
                    />
                 </div>
            </div>
        )}
    </div>
  );

  const isFormValid = activeTab === 'ad-copy' 
    ? (productName.trim().length > 0 && description.trim().length >= 10) 
    : activeTab === 'social-ideas'
    ? (socialTopic.trim().length >= 3 && socialAudience.trim().length > 0)
    : (seoKeywords.trim().length > 0 && seoAudience.trim().length > 0);

  const currentResult = activeTab === 'ad-copy' ? adCopyResult : activeTab === 'social-ideas' ? socialResult : seoResult;
  const hasContent = status === LoadingState.SUCCESS || (status === LoadingState.IDLE && currentResult);

  return (
    <section id="ai-tools" className="py-24 bg-gradient-to-b from-indigo-900/5 to-theme-primary relative overflow-hidden">
       {/* Decorative blob */}
       <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 mb-4">
                <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
                <span className="text-xs font-bold tracking-wider uppercase">{t('aiTools.badge')}</span>
            </div>
          <h2 className="text-3xl md:text-4xl font-bold text-theme-text-primary mb-4">{t('aiTools.heading')}</h2>
          <p className="text-theme-text-muted max-w-2xl mx-auto">
            {t('aiTools.subheading')}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
            <div className="bg-theme-surface p-1 rounded-xl inline-flex border border-theme-border flex-wrap justify-center gap-1 sm:gap-0 shadow-sm">
                <button 
                    onClick={() => setActiveTab('ad-copy')}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        activeTab === 'ad-copy' 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-secondary'
                    }`}
                >
                    <Megaphone className="w-4 h-4 mr-2" />
                    {t('aiTools.tabs.copy')}
                </button>
                <button 
                    onClick={() => setActiveTab('social-ideas')}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        activeTab === 'social-ideas' 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-secondary'
                    }`}
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    {t('aiTools.tabs.ideas')}
                </button>
                <button 
                    onClick={() => setActiveTab('seo-ideas')}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        activeTab === 'seo-ideas' 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-secondary'
                    }`}
                >
                    <Search className="w-4 h-4 mr-2" />
                    {t('aiTools.tabs.seo')}
                </button>
            </div>
        </div>

        <div className="lg:grid lg:grid-cols-5 gap-8 items-start">
            {/* Input Form */}
            <div className="lg:col-span-2 bg-theme-surface backdrop-blur-sm p-6 rounded-2xl border border-theme-border h-full flex flex-col shadow-lg">
                
                {/* Form Header with Example Button */}
                <div className="flex justify-between items-center mb-6 border-b border-theme-border pb-4">
                    <h3 className="text-theme-text-primary font-semibold">
                        {activeTab === 'ad-copy' ? 'Input Details' : activeTab === 'social-ideas' ? 'Campaign Settings' : 'SEO Parameters'}
                    </h3>
                    <button
                        onClick={handleFillExample}
                        className="text-xs flex items-center text-indigo-500 hover:text-indigo-600 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        title="Auto-fill with an example to see how it works"
                    >
                        <Lightbulb className="w-3 h-3 mr-1.5" />
                        {t('aiTools.form.tryExample')}
                    </button>
                </div>

                {activeTab === 'ad-copy' ? (
                    <div className="space-y-4 flex-grow animate-fade-in">
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-theme-text-secondary mb-1">{t('aiTools.form.productName')}</label>
                            <input 
                                id="productName"
                                type="text" 
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                onBlur={() => handleBlur('productName')}
                                className={getInputClasses('productName', productName)}
                                placeholder="e.g. ezAI CRM"
                            />
                            {renderError('productName', productName)}
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-theme-text-secondary mb-1">{t('aiTools.form.desc')}</label>
                            <textarea 
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                onBlur={() => handleBlur('description')}
                                rows={4}
                                className={`${getInputClasses('description', description)} resize-none`}
                                placeholder="..."
                            />
                            {renderError('description', description)}
                        </div>
                        <div>
                            <label htmlFor="platform" className="block text-sm font-medium text-theme-text-secondary mb-1">{t('aiTools.form.platform')}</label>
                            <select 
                                id="platform"
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                className="w-full bg-theme-input border border-theme-border rounded-lg px-4 py-3 text-theme-text-primary focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            >
                                <option>Facebook</option>
                                <option>Instagram</option>
                                <option>LinkedIn</option>
                                <option>Google Ads</option>
                                <option>Twitter (X)</option>
                                <option>TikTok</option>
                                <option>Email</option>
                                <option>Website</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tone" className="block text-sm font-medium text-theme-text-secondary mb-1">{t('aiTools.form.tone')}</label>
                            <select 
                                id="tone"
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full bg-theme-input border border-theme-border rounded-lg px-4 py-3 text-theme-text-primary focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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
                                <label htmlFor="socialTopic" className="block text-sm font-medium text-theme-text-secondary">{t('aiTools.form.topic')}</label>
                                <span className={`text-xs ${socialTopic.length >= 180 ? 'text-amber-500' : 'text-theme-text-muted'}`}>
                                    {socialTopic.length}/200
                                </span>
                            </div>
                            <input 
                                id="socialTopic"
                                type="text" 
                                value={socialTopic}
                                maxLength={200}
                                onChange={(e) => setSocialTopic(e.target.value)}
                                onBlur={() => handleBlur('socialTopic')}
                                className={getInputClasses('socialTopic', socialTopic)}
                                placeholder="..."
                            />
                            {renderError('socialTopic', socialTopic)}
                        </div>
                        <div>
                            <label htmlFor="socialAudience" className="block text-sm font-medium text-theme-text-secondary mb-1">{t('aiTools.form.audience')}</label>
                            <input 
                                id="socialAudience"
                                type="text" 
                                value={socialAudience}
                                onChange={(e) => setSocialAudience(e.target.value)}
                                onBlur={() => handleBlur('socialAudience')}
                                className={getInputClasses('socialAudience', socialAudience)}
                                placeholder="..."
                            />
                            {renderError('socialAudience', socialAudience)}
                        </div>
                        <div className="p-4 bg-indigo-900/10 rounded-lg border border-indigo-500/20">
                            <p className="text-sm text-indigo-500 flex items-start">
                                <Sparkles className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                We'll generate 3 unique post concepts with visuals and captions for you.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 flex-grow animate-fade-in">
                        <div>
                            <label htmlFor="seoKeywords" className="block text-sm font-medium text-theme-text-secondary mb-1">{t('aiTools.form.keywords')}</label>
                            <textarea 
                                id="seoKeywords"
                                value={seoKeywords}
                                onChange={(e) => setSeoKeywords(e.target.value)}
                                onBlur={() => handleBlur('seoKeywords')}
                                rows={3}
                                className={`${getInputClasses('seoKeywords', seoKeywords)} resize-none`}
                                placeholder="e.g. digital marketing, seo tips, growth hacking"
                            />
                            {renderError('seoKeywords', seoKeywords)}
                        </div>
                        <div>
                            <label htmlFor="seoAudience" className="block text-sm font-medium text-theme-text-secondary mb-1">{t('aiTools.form.audience')}</label>
                            <input 
                                id="seoAudience"
                                type="text" 
                                value={seoAudience}
                                onChange={(e) => setSeoAudience(e.target.value)}
                                onBlur={() => handleBlur('seoAudience')}
                                className={getInputClasses('seoAudience', seoAudience)}
                                placeholder="..."
                            />
                            {renderError('seoAudience', seoAudience)}
                        </div>
                         <div className="p-4 bg-indigo-900/10 rounded-lg border border-indigo-500/20">
                            <p className="text-sm text-indigo-500 flex items-start">
                                <Search className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                We'll generate blog titles, outlines, and meta descriptions optimized for search engines.
                            </p>
                        </div>
                    </div>
                )}

                {/* Advanced Settings Toggle */}
                {renderAdvancedSettings()}

                <div className="mt-6 flex flex-col gap-3">
                    <div className="flex gap-3">
                        <button 
                            onClick={handleClear}
                            className="px-4 py-3 rounded-lg font-medium text-theme-text-muted border border-theme-border hover:text-theme-text-primary hover:border-theme-text-secondary hover:bg-theme-secondary transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            title={t('aiTools.form.clear')}
                            aria-label="Clear all fields"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>

                        <button 
                            onClick={handleGenerate}
                            disabled={status === LoadingState.LOADING || !isFormValid}
                            className={`flex-1 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-theme-primary ${
                                status === LoadingState.LOADING 
                                ? 'bg-indigo-600/50 cursor-not-allowed' 
                                : !isFormValid 
                                    ? 'bg-indigo-400 cursor-not-allowed opacity-70'
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

                    {/* Image Generation Button for Ad Copy Tab */}
                    {activeTab === 'ad-copy' && (
                        <button 
                            onClick={handleGenerateImage}
                            disabled={isGeneratingImage || !isFormValid}
                            className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                isGeneratingImage
                                ? 'bg-purple-600/50 text-white/80 border-purple-500/50 cursor-not-allowed'
                                : !isFormValid
                                    ? 'bg-theme-surface text-theme-text-muted border-theme-border cursor-not-allowed opacity-70'
                                    : 'bg-theme-surface hover:bg-purple-600/10 text-purple-500 border-purple-500/30 hover:border-purple-500'
                            }`}
                        >
                             {isGeneratingImage ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    {t('aiTools.form.generatingImage')}
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="w-5 h-5 mr-2" />
                                    {t('aiTools.form.generateImage')}
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Output Display */}
            <div className="lg:col-span-3 mt-8 lg:mt-0 h-full">
                <div className={`h-full min-h-[300px] bg-theme-secondary rounded-2xl border border-theme-border p-8 relative transition-all shadow-inner ${hasContent ? 'ring-2 ring-indigo-500/50' : ''} ${status === LoadingState.ERROR || errorMessage ? 'ring-2 ring-red-500/30' : ''}`}>
                    
                    {status === LoadingState.IDLE && !currentResult && !adImage && (
                        <div className="h-full flex flex-col items-center justify-center text-theme-text-muted">
                            {activeTab === 'ad-copy' && <Megaphone className="w-12 h-12 mb-4 opacity-20" />}
                            {activeTab === 'social-ideas' && <Share2 className="w-12 h-12 mb-4 opacity-20" />}
                            {activeTab === 'seo-ideas' && <Search className="w-12 h-12 mb-4 opacity-20" />}
                            <p>Fill out the form to generate {activeTab === 'ad-copy' ? 'ad copy' : activeTab === 'social-ideas' ? 'social media ideas' : 'SEO content ideas'}.</p>
                        </div>
                    )}

                    {status === LoadingState.LOADING && (
                         <div className="h-full flex flex-col items-center justify-center text-indigo-500 animate-pulse">
                            <div className="w-3/4 h-4 bg-theme-border rounded mb-4"></div>
                            <div className="w-full h-4 bg-theme-border rounded mb-4"></div>
                            <div className="w-5/6 h-4 bg-theme-border rounded"></div>
                        </div>
                    )}

                    {status === LoadingState.ERROR && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4 animate-fade-in">
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-theme-text-primary mb-2">Generation Failed</h3>
                            <p className="text-theme-text-muted mb-6 max-w-md">{errorMessage}</p>
                            <button 
                                onClick={handleGenerate}
                                className="px-6 py-2.5 bg-theme-surface hover:bg-theme-border text-theme-text-primary rounded-lg transition-colors border border-theme-border font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {(hasContent || adImage) && (
                        <>
                             {/* Confirmation Banner */}
                             {scheduleConfirmation && (
                                <div className="absolute top-0 left-0 w-full bg-green-500/20 border-b border-green-500/30 text-green-500 px-6 py-3 flex items-center justify-center z-20 animate-fade-in-down">
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
                                            className="p-2 rounded-lg bg-theme-surface text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-theme-border"
                                            title="Schedule Post"
                                        >
                                            <Calendar className="w-5 h-5" />
                                        </button>

                                        {showScheduleMenu && (
                                            <>
                                                <div className="fixed inset-0 z-30" onClick={() => setShowScheduleMenu(false)}></div>
                                                <div className="absolute right-0 mt-2 w-72 bg-theme-surface border border-theme-border rounded-xl shadow-2xl z-40 p-4 animate-fade-in ring-1 ring-black/5">
                                                    <div className="flex items-center gap-2 mb-4 text-indigo-500 border-b border-theme-border pb-3">
                                                        <Clock className="w-4 h-4" />
                                                        <h4 className="font-bold text-sm">Schedule Campaign</h4>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-xs font-medium text-theme-text-secondary mb-1.5">Select Date</label>
                                                            <input 
                                                                type="date" 
                                                                value={scheduleDate} 
                                                                onChange={e => setScheduleDate(e.target.value)} 
                                                                className="w-full bg-theme-input border border-theme-border rounded-lg px-3 py-2 text-sm text-theme-text-primary focus:ring-1 focus:ring-indigo-500 outline-none [color-scheme:dark]" 
                                                                style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-theme-text-secondary mb-1.5">Select Time</label>
                                                            <input 
                                                                type="time" 
                                                                value={scheduleTime} 
                                                                onChange={e => setScheduleTime(e.target.value)} 
                                                                className="w-full bg-theme-input border border-theme-border rounded-lg px-3 py-2 text-sm text-theme-text-primary focus:ring-1 focus:ring-indigo-500 outline-none [color-scheme:dark]" 
                                                                style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
                                                            />
                                                        </div>
                                                        <button 
                                                            onClick={handleSchedule}
                                                            disabled={!scheduleDate || !scheduleTime || isScheduling}
                                                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-theme-border disabled:text-theme-text-muted disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-lg transition-all mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center"
                                                        >
                                                            {isScheduling ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                    Scheduling...
                                                                </>
                                                            ) : (
                                                                'Confirm Schedule'
                                                            )}
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
                                        className="p-2 rounded-lg bg-theme-surface text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-theme-border"
                                        title="Share Content"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                    
                                    {showShareMenu && (
                                        <>
                                            <div className="fixed inset-0 z-30" onClick={() => setShowShareMenu(false)}></div>
                                            <div className="absolute right-0 mt-2 w-48 bg-theme-surface border border-theme-border rounded-xl shadow-xl z-40 overflow-hidden animate-fade-in">
                                                <button onClick={() => handleShare('twitter')} className="w-full px-4 py-3 text-left text-sm text-theme-text-secondary hover:bg-theme-secondary hover:text-theme-text-primary flex items-center transition-colors border-b border-theme-border">
                                                    <Twitter className="w-4 h-4 mr-3 text-sky-500" /> Twitter
                                                </button>
                                                <button onClick={() => handleShare('facebook')} className="w-full px-4 py-3 text-left text-sm text-theme-text-secondary hover:bg-theme-secondary hover:text-theme-text-primary flex items-center transition-colors border-b border-theme-border">
                                                    <Facebook className="w-4 h-4 mr-3 text-blue-500" /> Facebook
                                                </button>
                                                <button onClick={() => handleShare('linkedin')} className="w-full px-4 py-3 text-left text-sm text-theme-text-secondary hover:bg-theme-secondary hover:text-theme-text-primary flex items-center transition-colors">
                                                    <Linkedin className="w-4 h-4 mr-3 text-blue-600" /> LinkedIn
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Copy Button */}
                                <button 
                                    onClick={handleCopy}
                                    className="p-2 rounded-lg bg-theme-surface text-theme-text-muted hover:text-theme-text-primary hover:bg-theme-border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-theme-border"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            <div className="prose max-w-none overflow-y-auto max-h-[600px] pr-2 custom-scrollbar pt-8">
                                <h3 className="text-indigo-400 text-lg font-semibold mb-4">
                                    {activeTab === 'ad-copy' 
                                        ? 'Generated Ad Copy:' 
                                        : activeTab === 'social-ideas' 
                                        ? 'Generated Social Media Ideas:'
                                        : 'Generated SEO Content Ideas:'}
                                </h3>
                                
                                {/* Generated Image Display or Placeholder */}
                                {activeTab === 'ad-copy' && (adImage || (adCopyResult && !adImage)) && (
                                    <div className="mb-8 animate-fade-in">
                                        {adImage ? (
                                            <div className="relative group rounded-xl overflow-hidden border border-theme-border shadow-xl bg-black/50">
                                                <img 
                                                    src={adImage} 
                                                    alt="Generated Ad Visual" 
                                                    className="w-full h-auto object-cover max-h-[300px] hover:opacity-90 transition-opacity"
                                                />
                                                <a 
                                                    href={adImage} 
                                                    download={`ezai-ad-${Date.now()}.png`}
                                                    className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-slate-900 p-2 rounded-lg shadow-lg transition-all transform translate-y-0"
                                                    title="Download Image"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="w-full h-64 bg-theme-surface border-2 border-dashed border-theme-border rounded-xl flex flex-col items-center justify-center text-theme-text-muted group hover:border-indigo-500/50 hover:bg-theme-secondary/50 transition-all">
                                                {isGeneratingImage ? (
                                                    <>
                                                        <Loader2 className="w-10 h-10 mb-3 text-indigo-500 animate-spin" />
                                                        <p className="text-sm font-medium text-indigo-500 animate-pulse">{t('aiTools.form.generatingImage')}</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-16 h-16 bg-theme-border/30 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                            <ImageIcon className="w-8 h-8 opacity-50" />
                                                        </div>
                                                        <p className="text-sm">{t('aiTools.placeholder.label')}</p>
                                                        <button 
                                                            onClick={handleGenerateImage}
                                                            className="mt-4 text-xs text-indigo-500 hover:text-indigo-400 font-bold uppercase tracking-wider hover:underline"
                                                        >
                                                            {t('aiTools.form.generateImage')}
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                        
                                        {adImage && (
                                            <p className="text-xs text-theme-text-muted mt-2 italic flex items-center">
                                                <ImageIcon className="w-3 h-3 mr-1.5" />
                                                AI generated visual based on your product description
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="text-theme-text-primary leading-relaxed font-light text-lg">
                                    {renderFormattedText(currentResult)}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 relative rounded-2xl bg-theme-surface border border-theme-border p-10 md:p-16 text-center overflow-hidden shadow-lg">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
                <h3 className="text-3xl font-bold text-theme-text-primary mb-6">{t('aiTools.enterprise.heading')}</h3>
                <p className="text-lg text-theme-text-muted max-w-3xl mx-auto mb-10 leading-relaxed">
                    {t('aiTools.enterprise.desc')}
                </p>
                <a 
                    href="#contact" 
                    className={`inline-flex items-center px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-theme-primary ${
                        theme === 'dark' 
                        ? 'bg-white text-slate-900 hover:bg-indigo-50 hover:shadow-white/20' 
                        : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-900/20'
                    }`}
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