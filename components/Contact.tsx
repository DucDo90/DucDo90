import React, { useState } from 'react';
import { Mail, Phone, MapPin, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    website: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateField = (name: string, value: string) => {
    let error = '';
    switch (name) {
      case 'firstName':
        if (!value.trim()) error = 'Please enter your first name.';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Please enter your last name.';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email address is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address (e.g., name@company.com).';
        }
        break;
      case 'website':
        if (value.trim() && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
          error = 'Please enter a valid URL (e.g., https://example.com).';
        }
        break;
      case 'message':
        if (!value.trim()) error = 'Please tell us about your project or goals.';
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      website: true,
      message: true
    });

    if (isValid) {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', website: '', message: '' });
      setTouched({});
      setTimeout(() => setIsSuccess(false), 5000);
    }
  };

  const getInputClasses = (fieldName: string) => {
    const baseClasses = "w-full bg-slate-950 border rounded-lg px-4 py-3 text-white outline-none transition-all";
    if (touched[fieldName] && errors[fieldName]) {
      return `${baseClasses} border-red-500 focus:ring-2 focus:ring-red-500/50`;
    }
    if (touched[fieldName] && !errors[fieldName]) {
      return `${baseClasses} border-green-500/50 focus:ring-2 focus:ring-green-500/50`;
    }
    return `${baseClasses} border-slate-800 focus:ring-2 focus:ring-indigo-500`;
  };

  return (
    <section id="contact" className="py-24 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div className="mb-12 lg:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('contact.heading')}</h2>
            <p className="text-slate-400 text-lg mb-10">
              {t('contact.subheading')}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-slate-900 p-3 rounded-lg mr-4 text-indigo-500 border border-slate-800">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{t('contact.info.email')}</h4>
                  <p className="text-slate-400">hello@ezaidigitalmarketing.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                 <div className="bg-slate-900 p-3 rounded-lg mr-4 text-indigo-500 border border-slate-800">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{t('contact.info.call')}</h4>
                  <p className="text-slate-400">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start">
                 <div className="bg-slate-900 p-3 rounded-lg mr-4 text-indigo-500 border border-slate-800">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{t('contact.info.visit')}</h4>
                  <p className="text-slate-400">100 Tech Boulevard, Silicon Valley, CA</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
            {isSuccess && (
              <div className="absolute inset-0 bg-slate-900 z-10 flex flex-col items-center justify-center text-center p-8 animate-fade-in">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t('contact.form.successTitle')}</h3>
                <p className="text-slate-400">
                  {t('contact.form.successDesc')}
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-indigo-400 hover:text-white font-medium transition-colors focus:outline-none focus:underline"
                >
                  {t('contact.form.sendAnother')}
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-400 mb-2">{t('contact.form.firstName')}</label>
                  <input 
                    id="firstName"
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClasses('firstName')}
                    placeholder="John" 
                  />
                  {touched.firstName && errors.firstName && (
                    <p className="mt-1 text-xs text-red-400 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                   <label htmlFor="lastName" className="block text-sm font-medium text-slate-400 mb-2">{t('contact.form.lastName')}</label>
                  <input 
                    id="lastName"
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClasses('lastName')}
                    placeholder="Doe" 
                  />
                  {touched.lastName && errors.lastName && (
                    <p className="mt-1 text-xs text-red-400 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-400 mb-2">{t('contact.form.email')}</label>
                <input 
                  id="email"
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClasses('email')}
                  placeholder="john@company.com" 
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-xs text-red-400 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

               <div>
                <label htmlFor="website" className="block text-sm font-medium text-slate-400 mb-2">{t('contact.form.website')} <span className="text-slate-600">(Optional)</span></label>
                <input 
                  id="website"
                  type="text" 
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClasses('website')}
                  placeholder="https://company.com" 
                />
                {touched.website && errors.website && (
                  <p className="mt-1 text-xs text-red-400 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.website}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-400 mb-2">{t('contact.form.message')}</label>
                <textarea 
                  id="message"
                  rows={4} 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClasses('message')}
                  placeholder="..."
                ></textarea>
                {touched.message && errors.message && (
                  <p className="mt-1 text-xs text-red-400 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.message}
                  </p>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {t('contact.form.sending')}
                  </>
                ) : (
                  t('contact.form.submit')
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};