import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useLogin } from '@/hooks/useAuth';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { setToken, refreshUser } = useAuth();
  const { login, isLoading, isError, error } = useLogin();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  const [form, setForm] = useState({ loginData: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(form, {
      onSuccess: async (data) => {
        setToken(data.token);
        await refreshUser();
        navigate(from, { replace: true });
      },
      onError: (err) => {
        toast.error(err.message || t('errors.generic'));
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-bg px-4">
      {/* Neon glow blob */}
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-surface-border bg-surface-card p-8 shadow-card">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-neon">
              <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-ink">{t('auth.login.title')}</h1>
            <p className="mt-1 text-sm text-faint">{t('auth.login.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label={t('auth.login.loginData')}
              name="loginData"
              type="text"
              placeholder="user@example.com"
              value={form.loginData}
              onChange={handleChange}
              required
            />
            <Input
              label={t('auth.login.password')}
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />

            {isError && <ErrorAlert message={error?.message} />}

            <Button type="submit" loading={isLoading} size="lg" className="mt-2 w-full">
              {t('auth.login.submit')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-faint">
            {t('auth.login.noAccount')}{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-primary-dark">
              {t('auth.login.toRegister')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
