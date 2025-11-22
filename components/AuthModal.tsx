import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, Check, Loader2, LogIn, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'signin' }) => {
  const [view, setView] = useState<'signin' | 'signup' | 'forgot'>(initialView);
  const { login, signup, loginWithGoogle, resetPassword, isLoading } = useAuth();
  const { t } = useLanguage();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    confirmPassword: '',
    rememberMe: false
  });
  
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setError('');
      setSuccessMsg('');
      setFormData({
        email: '',
        password: '',
        name: '',
        phone: '',
        confirmPassword: '',
        rememberMe: false
      });
    }
  }, [isOpen, initialView]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      if (view === 'signin') {
        if (!formData.email || !formData.password) {
          setError(t('auth.error.required'));
          return;
        }
        // For SignIn, 'email' field acts as identifier (Email or Phone)
        await login({ email: formData.email, password: formData.password, rememberMe: formData.rememberMe });
        onClose();
      } else if (view === 'signup') {
        if (!formData.name || !formData.email || !formData.password) {
          setError(t('auth.error.required'));
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError(t('auth.error.passwordMismatch'));
          return;
        }
        await signup({ name: formData.name, email: formData.email, password: formData.password, phone: formData.phone });
        onClose();
      } else if (view === 'forgot') {
        if (!formData.email) {
          setError(t('auth.error.emailRequired'));
          return;
        }
        await resetPassword(formData.email);
        setSuccessMsg(t('auth.success.resetLink'));
      }
    } catch (err) {
      setError(t('auth.error.generic'));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setError(t('auth.error.generic'));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-theme-surface border border-theme-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all animate-fade-in-up">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center relative bg-gradient-to-b from-theme-secondary to-theme-surface">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-theme-text-muted hover:text-theme-text-primary p-1 rounded-full hover:bg-theme-surface border border-transparent hover:border-theme-border transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-2xl font-bold text-theme-text-primary mb-2 tracking-tight">
            {view === 'signin' ? t('auth.signIn.title') : view === 'signup' ? t('auth.signUp.title') : t('auth.forgot.title')}
          </h2>
          <p className="text-theme-text-muted text-sm">
            {view === 'signin' 
              ? t('auth.signIn.subtitle') 
              : view === 'signup' 
              ? t('auth.signUp.subtitle') 
              : t('auth.forgot.subtitle')}
          </p>
        </div>

        {/* Body */}
        <div className="px-8 pb-8">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center flex items-center justify-center">
               <span className="mr-2">⚠️</span> {error}
            </div>
          )}
          
          {successMsg && (
            <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm text-center flex items-center justify-center">
              <Check className="w-4 h-4 mr-2" />
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {view === 'signup' && (
              <div className="animate-fade-in">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-text-muted" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('auth.placeholder.name')}
                    className="w-full bg-theme-input border border-theme-border rounded-lg py-3 pl-10 pr-4 text-theme-text-primary outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-theme-text-muted"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-text-muted" />
                <input
                  type="text" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={view === 'signin' ? t('auth.placeholder.emailOrPhone') || 'Email or Phone Number' : t('auth.placeholder.email')}
                  className="w-full bg-theme-input border border-theme-border rounded-lg py-3 pl-10 pr-4 text-theme-text-primary outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-theme-text-muted"
                />
              </div>
            </div>

            {view === 'signup' && (
              <div className="animate-fade-in">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-text-muted" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t('auth.placeholder.phone')}
                    className="w-full bg-theme-input border border-theme-border rounded-lg py-3 pl-10 pr-4 text-theme-text-primary outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-theme-text-muted"
                  />
                </div>
              </div>
            )}

            {view !== 'forgot' && (
              <div className="animate-fade-in">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('auth.placeholder.password')}
                    className="w-full bg-theme-input border border-theme-border rounded-lg py-3 pl-10 pr-12 text-theme-text-primary outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-theme-text-muted"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-text-primary focus:outline-none p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {view === 'signup' && (
              <div className="animate-fade-in">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-text-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder={t('auth.placeholder.confirmPassword')}
                    className="w-full bg-theme-input border border-theme-border rounded-lg py-3 pl-10 pr-4 text-theme-text-primary outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-theme-text-muted"
                  />
                </div>
              </div>
            )}

            {view === 'signin' && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center text-theme-text-secondary cursor-pointer hover:text-theme-text-primary transition-colors">
                  <input 
                    type="checkbox" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="mr-2 rounded border-theme-border bg-theme-input text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                  />
                  {t('auth.rememberMe')}
                </label>
                <button 
                  type="button" 
                  onClick={() => setView('forgot')}
                  className="text-indigo-500 hover:text-indigo-400 font-medium focus:outline-none hover:underline"
                >
                  {t('auth.forgotPass')}
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-lg transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {view === 'signin' ? t('auth.signIn.action') : view === 'signup' ? t('auth.signUp.action') : t('auth.forgot.action')}
                  {view !== 'forgot' && <ArrowRight className="w-5 h-5 ml-2" />}
                </>
              )}
            </button>
          </form>

          {view !== 'forgot' && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-theme-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-theme-surface px-3 text-theme-text-muted font-medium">{t('auth.orContinue')}</span>
                </div>
              </div>

              <button 
                onClick={handleGoogleLogin}
                className="w-full bg-theme-input hover:bg-theme-secondary text-theme-text-primary font-medium py-3 rounded-lg transition-all border border-theme-border flex items-center justify-center group hover:border-indigo-500/30"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
                Google Account
              </button>
            </>
          )}

          <div className="mt-6 text-center text-sm text-theme-text-secondary">
            {view === 'signin' ? (
              <>
                {t('auth.noAccount')}{' '}
                <button onClick={() => setView('signup')} className="text-indigo-500 hover:text-indigo-400 font-bold focus:outline-none hover:underline">
                  {t('auth.signUp.action')}
                </button>
              </>
            ) : view === 'signup' ? (
              <>
                {t('auth.hasAccount')}{' '}
                <button onClick={() => setView('signin')} className="text-indigo-500 hover:text-indigo-400 font-bold focus:outline-none hover:underline">
                  {t('auth.signIn.action')}
                </button>
              </>
            ) : (
              <button onClick={() => setView('signin')} className="text-indigo-500 hover:text-indigo-400 font-bold focus:outline-none flex items-center justify-center mx-auto hover:underline">
                <LogIn className="w-4 h-4 mr-1" />
                {t('auth.backToLogin')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};