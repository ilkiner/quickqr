"use client";

import { useEffect, useState } from "react";
import { createClient } from "src/lib/supabase/client";
import { useLanguage } from "src/contexts/LanguageContext";

type Tab = "login" | "register";

function getPasswordStrength(password: string): "weak" | "medium" | "strong" {
  if (!password) return "weak";
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return "weak";
  if (score <= 4) return "medium";
  return "strong";
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthModal({
  isOpen,
  onClose,
  defaultTab,
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultTab: Tab;
}) {
  const { t } = useLanguage();
  const a = t.auth;

  const [tab, setTab] = useState<Tab>(defaultTab);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [rateLimitedUntil, setRateLimitedUntil] = useState(0);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [terms, setTerms] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setTab(defaultTab);
      setSubmitted(false);
      setErrors({});
      setLoading(false);
    }
  }, [isOpen, defaultTab]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const nowLimited = Date.now() < rateLimitedUntil;
  const waitSec = Math.ceil((rateLimitedUntil - Date.now()) / 1000);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nowLimited) return;
    const next: Record<string, string> = {};
    if (!loginEmail.trim()) next.loginEmail = a.errors.emailRequired;
    else if (!emailRegex.test(loginEmail.trim())) next.loginEmail = a.errors.invalidEmail;
    if (!loginPassword) next.loginPassword = a.errors.passwordRequired;
    else if (loginPassword.length < 8) next.loginPassword = a.errors.passwordTooShort;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setFailedAttempts((f) => {
        const n = f + 1;
        if (n >= 3) { setRateLimitedUntil(Date.now() + 30000); return 0; }
        return n;
      });
      return;
    }
    try {
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email: loginEmail.trim(), password: loginPassword });
      if (error) { setErrors({ _form: error.message }); return; }
      setFailedAttempts(0);
      onClose();
      window.location.reload();
    } catch {
      setErrors({ _form: a.errors.somethingWrong });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nowLimited) return;
    const next: Record<string, string> = {};
    if (!regName.trim() || regName.trim().length < 2) next.regName = a.errors.nameRequired;
    if (!regEmail.trim()) next.regEmail = a.errors.emailRequired;
    else if (!emailRegex.test(regEmail.trim())) next.regEmail = a.errors.invalidEmail;
    if (!regPassword) next.regPassword = a.errors.passwordRequired;
    else if (regPassword.length < 8) next.regPassword = a.errors.passwordTooShort;
    if (regPassword !== regConfirm) next.regConfirm = a.errors.passwordsNoMatch;
    if (!terms) next.terms = a.errors.termsRequired;
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setFailedAttempts((f) => {
        const n = f + 1;
        if (n >= 3) { setRateLimitedUntil(Date.now() + 30000); return 0; }
        return n;
      });
      return;
    }
    try {
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({ email: regEmail.trim(), password: regPassword, options: { data: { full_name: regName.trim() } } });
      if (error) { setErrors({ _form: error.message }); return; }
      setFailedAttempts(0);
      setSubmitted(true);
    } catch {
      setErrors({ _form: a.errors.somethingWrong });
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(regPassword);
  const strengthColor = strength === "weak" ? "bg-red-500" : strength === "medium" ? "bg-yellow-500" : "bg-green-600";
  const strengthWidth = strength === "weak" ? "w-1/3" : strength === "medium" ? "w-2/3" : "w-full";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="fixed inset-0 bg-black/50 cursor-default" aria-label="Close modal" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8 z-10">
        {submitted ? (
          <div className="text-center py-6">
            <div className="flex justify-center mb-4">
              <i className="ri-checkbox-circle-fill text-5xl text-green-600" aria-hidden />
            </div>
            <p className="text-lg font-semibold text-gray-900">{a.checkEmail}</p>
          </div>
        ) : (
          <>
            <div className="flex rounded-lg overflow-hidden border border-gray-200 mb-6">
              <button
                type="button"
                onClick={() => { setTab("login"); setErrors({}); }}
                className={`flex-1 py-2 text-sm font-medium transition ${tab === "login" ? "bg-green-600 text-white" : "bg-gray-50 text-gray-600"}`}
              >
                {a.login}
              </button>
              <button
                type="button"
                onClick={() => { setTab("register"); setErrors({}); }}
                className={`flex-1 py-2 text-sm font-medium transition ${tab === "register" ? "bg-green-600 text-white" : "bg-gray-50 text-gray-600"}`}
              >
                {a.register}
              </button>
            </div>

            {nowLimited && (
              <p className="text-red-500 text-sm mb-4" role="alert">
                {a.tooManyAttempts.replace("{sec}", String(waitSec))}
              </p>
            )}
            {errors._form && <p className="text-red-500 text-sm mb-4" role="alert">{errors._form}</p>}

            {tab === "login" ? (
              <form noValidate onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label htmlFor="auth-login-email" className="block text-sm font-medium text-gray-700">{a.email}</label>
                  <input
                    id="auth-login-email" type="email" autoComplete="email"
                    value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                    className={`mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.loginEmail ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.loginEmail && <p className="text-red-500 text-sm mt-1">{errors.loginEmail}</p>}
                </div>
                <div>
                  <label htmlFor="auth-login-password" className="block text-sm font-medium text-gray-700">{a.password}</label>
                  <input
                    id="auth-login-password" type="password" autoComplete="current-password"
                    value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                    className={`mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.loginPassword ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.loginPassword && <p className="text-red-500 text-sm mt-1">{errors.loginPassword}</p>}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    {a.rememberMe}
                  </label>
                  <span className="text-sm text-gray-400 cursor-not-allowed" aria-disabled>{a.forgotPassword}</span>
                </div>
                <button type="submit" disabled={loading || nowLimited} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white w-full py-3 rounded-lg font-semibold">
                  {loading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <i className="ri-loader-4-line animate-spin" aria-hidden />
                      {a.pleaseWait}
                    </span>
                  ) : a.signIn}
                </button>
              </form>
            ) : (
              <form noValidate onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label htmlFor="auth-reg-name" className="block text-sm font-medium text-gray-700">{a.fullName}</label>
                  <input
                    id="auth-reg-name" type="text" autoComplete="name" minLength={2}
                    value={regName} onChange={(e) => setRegName(e.target.value)}
                    className={`mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.regName ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.regName && <p className="text-red-500 text-sm mt-1">{errors.regName}</p>}
                </div>
                <div>
                  <label htmlFor="auth-reg-email" className="block text-sm font-medium text-gray-700">{a.email}</label>
                  <input
                    id="auth-reg-email" type="email" autoComplete="email"
                    value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                    className={`mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.regEmail ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.regEmail && <p className="text-red-500 text-sm mt-1">{errors.regEmail}</p>}
                </div>
                <div>
                  <label htmlFor="auth-reg-password" className="block text-sm font-medium text-gray-700">{a.password}</label>
                  <input
                    id="auth-reg-password" type="password" autoComplete="new-password"
                    value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                    className={`mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.regPassword ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.regPassword && <p className="text-red-500 text-sm mt-1">{errors.regPassword}</p>}
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full transition-all ${strengthColor} ${strengthWidth}`} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{a.strength} {strength}</p>
                </div>
                <div>
                  <label htmlFor="auth-reg-confirm" className="block text-sm font-medium text-gray-700">{a.confirmPassword}</label>
                  <input
                    id="auth-reg-confirm" type="password" autoComplete="new-password"
                    value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)}
                    className={`mt-1 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.regConfirm ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.regConfirm && <p className="text-red-500 text-sm mt-1">{errors.regConfirm}</p>}
                </div>
                <label className="flex items-start gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500" />
                  <span>{a.agreeTerms}</span>
                </label>
                {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
                <button type="submit" disabled={loading || nowLimited} className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white w-full py-3 rounded-lg font-semibold">
                  {loading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <i className="ri-loader-4-line animate-spin" aria-hidden />
                      {a.pleaseWait}
                    </span>
                  ) : a.createAccount}
                </button>
              </form>
            )}
          </>
        )}

        <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl leading-none" aria-label="Close">
          ×
        </button>
      </div>
    </div>
  );
}
