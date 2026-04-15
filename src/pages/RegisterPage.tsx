import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRegUserRequest } from '@/hooks/useRegUserRequest';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ErrorAlert } from '@/components/ui/ErrorAlert';

export function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading, isError, error } = useRegUserRequest();
  const [form, setForm] = useState({ phone: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(form, { onSuccess: () => navigate('/login') });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-bg px-4">
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-surface-border bg-surface-card p-8 shadow-card">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-neon">
              <svg className="h-9 w-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-ink">{t('auth.register.title')}</h1>
            <p className="mt-1 text-sm text-faint">{t('auth.register.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label={t('auth.register.phone')} name="phone" type="tel" placeholder="+7 000 000 00 00" value={form.phone} onChange={handleChange} required />
            <Input label={t('auth.register.email')} name="email" type="email" placeholder="user@example.com" value={form.email} onChange={handleChange} required />
            <Input label={t('auth.register.password')} name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />

            {isError && <ErrorAlert message={error?.message} />}

            <Button type="submit" loading={isLoading} size="lg" className="mt-2 w-full">
              {t('auth.register.submit')}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-faint">
            {t('auth.register.hasAccount')}{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
              {t('auth.register.toLogin')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
