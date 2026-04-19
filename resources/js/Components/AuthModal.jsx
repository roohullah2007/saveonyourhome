import React, { useState, useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { X, Heart, Home as HomeIcon, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

const INTENTS = {
  favorites: {
    icon: Heart,
    title: 'Save your favorites',
    subtitle: 'Create an account or sign in to save your favorite properties and access them from any device.',
  },
  list: {
    icon: HomeIcon,
    title: 'List your property',
    subtitle: 'Sign in or create a free account to list your home and start receiving offers.',
  },
  generic: {
    icon: Lock,
    title: 'Sign in to continue',
    subtitle: 'Sign in to your SaveOnYourHome account, or create one in under a minute.',
  },
};

const AuthModal = ({ isOpen, onClose, intent = 'favorites', initialTab = 'login' }) => {
  const [tab, setTab] = useState(initialTab);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  useEffect(() => {
    if (isOpen) setTab(initialTab || 'login');
  }, [isOpen, initialTab]);

  const loginForm = useForm({ email: '', password: '', remember: false });
  const registerForm = useForm({
    name: '', email: '', phone: '', password: '', password_confirmation: '', user_type: 'buyer', sms_consent: false,
  });

  if (!isOpen) return null;

  const { icon: Icon, title, subtitle } = INTENTS[intent] || INTENTS.generic;

  const submitLogin = (e) => {
    e.preventDefault();
    loginForm.post(route('login'), {
      onFinish: () => loginForm.reset('password'),
      onSuccess: () => { onClose && onClose(); },
    });
  };

  const submitRegister = (e) => {
    e.preventDefault();
    registerForm.post(route('register'), {
      onFinish: () => registerForm.reset('password', 'password_confirmation'),
      onSuccess: () => { onClose && onClose(); },
    });
  };

  const inputCls = 'w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500';
  const labelCls = 'block text-sm font-semibold mb-1.5 text-[#111]';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <X className="w-5 h-5 text-[#111]" />
        </button>

        <div className="p-7 pt-10">
          <div className="w-14 h-14 bg-[#1A1816]/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Icon className="w-7 h-7 text-[#1A1816]" />
          </div>
          <h2 className="text-[22px] font-bold text-[#111] text-center mb-2">{title}</h2>
          <p className="text-[14px] text-[#666] text-center mb-6 leading-relaxed">{subtitle}</p>

          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${tab === 'login' ? 'bg-white shadow text-[#111]' : 'text-gray-500'}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${tab === 'register' ? 'bg-white shadow text-[#111]' : 'text-gray-500'}`}
            >
              Create account
            </button>
          </div>

          {tab === 'login' ? (
            <form onSubmit={submitLogin} className="space-y-3">
              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className={inputCls}
                  value={loginForm.data.email}
                  onChange={(e) => loginForm.setData('email', e.target.value)}
                />
                {loginForm.errors.email && <p className="text-xs text-red-600 mt-1">{loginForm.errors.email}</p>}
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    className={`${inputCls} pr-10`}
                    value={loginForm.data.password}
                    onChange={(e) => loginForm.setData('password', e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {loginForm.errors.password && <p className="text-xs text-red-600 mt-1">{loginForm.errors.password}</p>}
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-600">
                  <input type="checkbox" checked={loginForm.data.remember} onChange={(e) => loginForm.setData('remember', e.target.checked)} />
                  Remember me
                </label>
                <Link href={route('password.request')} className="text-xs font-semibold text-[#3355FF] hover:underline">Forgot password?</Link>
              </div>
              <button
                type="submit"
                disabled={loginForm.processing}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#3355FF] text-white py-3 text-sm font-bold hover:opacity-90 disabled:opacity-50"
              >
                {loginForm.processing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loginForm.processing ? 'Signing in…' : 'Sign in'}
              </button>
              <p className="text-[12px] text-center text-gray-500 pt-1">
                New here?{' '}
                <button type="button" onClick={() => setTab('register')} className="font-semibold text-[#3355FF] hover:underline">Create an account</button>
              </p>
            </form>
          ) : (
            <form onSubmit={submitRegister} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>I am a</label>
                  <select
                    className={inputCls + ' bg-white'}
                    value={registerForm.data.user_type}
                    onChange={(e) => registerForm.setData('user_type', e.target.value)}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Full name</label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    className={inputCls}
                    value={registerForm.data.name}
                    onChange={(e) => registerForm.setData('name', e.target.value)}
                  />
                  {registerForm.errors.name && <p className="text-xs text-red-600 mt-1">{registerForm.errors.name}</p>}
                </div>
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className={inputCls}
                  value={registerForm.data.email}
                  onChange={(e) => registerForm.setData('email', e.target.value)}
                />
                {registerForm.errors.email && <p className="text-xs text-red-600 mt-1">{registerForm.errors.email}</p>}
              </div>
              <div>
                <label className={labelCls}>Phone (optional)</label>
                <input
                  type="tel"
                  autoComplete="tel"
                  className={inputCls}
                  value={registerForm.data.phone}
                  onChange={(e) => registerForm.setData('phone', e.target.value)}
                />
                {registerForm.errors.phone && <p className="text-xs text-red-600 mt-1">{registerForm.errors.phone}</p>}
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    className={`${inputCls} pr-10`}
                    value={registerForm.data.password}
                    onChange={(e) => registerForm.setData('password', e.target.value)}
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {registerForm.errors.password && <p className="text-xs text-red-600 mt-1">{registerForm.errors.password}</p>}
              </div>
              <div>
                <label className={labelCls}>Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirmPwd ? 'text' : 'password'}
                    required
                    autoComplete="new-password"
                    className={`${inputCls} pr-10`}
                    value={registerForm.data.password_confirmation}
                    onChange={(e) => registerForm.setData('password_confirmation', e.target.value)}
                  />
                  <button type="button" onClick={() => setShowConfirmPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={registerForm.processing}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#3355FF] text-white py-3 text-sm font-bold hover:opacity-90 disabled:opacity-50"
              >
                {registerForm.processing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {registerForm.processing ? 'Creating account…' : 'Create account'}
              </button>
              <p className="text-[12px] text-center text-gray-500 pt-1">
                Already have one?{' '}
                <button type="button" onClick={() => setTab('login')} className="font-semibold text-[#3355FF] hover:underline">Sign in</button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
