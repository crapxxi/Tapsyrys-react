import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

const STATS = [
  { value: '500+', labelKey: 'home.stats.suppliers' },
  { value: '10K+', labelKey: 'home.stats.products' },
  { value: '₸1B+', labelKey: 'home.stats.volume' },
];

export function HomePage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      gradient: 'from-primary/20 to-emerald-500/5',
      border: 'border-primary/20',
      iconBg: 'bg-primary/15',
      icon: (
        <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: t('home.features.catalogTitle'),
      desc: t('home.features.catalogDesc'),
    },
    {
      gradient: 'from-emerald-500/15 to-teal-600/5',
      border: 'border-emerald-500/20',
      iconBg: 'bg-emerald-500/15',
      icon: (
        <svg className="h-7 w-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: t('home.features.ordersTitle'),
      desc: t('home.features.ordersDesc'),
    },
    {
      gradient: 'from-teal-500/15 to-primary/5',
      border: 'border-teal-500/20',
      iconBg: 'bg-teal-500/15',
      icon: (
        <svg className="h-7 w-7 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      title: t('home.features.businessTitle'),
      desc: t('home.features.businessDesc'),
    },
  ];

  return (
    <div className="space-y-16">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface-card px-8 py-24 text-center">
        {/* Mesh background */}
        <div className="hero-glow pointer-events-none absolute inset-0" />
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -left-32 -top-32 h-[480px] w-[480px] rounded-full bg-primary/6 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-[360px] w-[360px] rounded-full bg-teal-400/6 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-teal-500/4 blur-3xl" />

        {/* Top badge */}
        <div className="relative mb-8 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-5 py-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-fast" />
          <span className="text-sm font-semibold text-primary">B2B Marketplace · Kazakhstan</span>
        </div>

        {/* Logo icon */}
        <div className="relative mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary-dark shadow-neon-lg animate-float">
          <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>

        <h1 className="text-gradient relative text-7xl font-extrabold tracking-tight sm:text-8xl">
          {t('home.heroTitle')}
        </h1>
        <p className="relative mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-faint">
          {t('home.heroSubtitle')}
        </p>

        {/* CTA buttons */}
        <div className="relative mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="group rounded-2xl bg-gradient-to-r from-primary to-primary-light px-12 py-4 text-base font-bold text-white shadow-neon transition-all duration-200 hover:shadow-neon-lg hover:scale-[1.02]"
            >
              {t('home.openDashboard')}
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="rounded-2xl bg-gradient-to-r from-primary to-primary-light px-12 py-4 text-base font-bold text-white shadow-neon transition-all duration-200 hover:shadow-neon-lg hover:scale-[1.02]"
              >
                {t('home.getStarted')}
              </Link>
              <Link
                to="/login"
                className="rounded-2xl border border-surface-border bg-surface-elevated px-12 py-4 text-base font-bold text-sub transition-all duration-200 hover:border-primary/40 hover:text-ink hover:bg-surface-elevated/80"
              >
                {t('home.signIn')}
              </Link>
            </>
          )}
        </div>

        {/* Stats strip */}
        <div className="relative mt-14 flex flex-wrap items-center justify-center gap-10 border-t border-surface-border pt-10">
          {STATS.map(({ value, labelKey }) => (
            <div key={labelKey} className="text-center">
              <p className="stat-number text-3xl font-extrabold text-ink">{value}</p>
              <p className="mt-1 text-sm text-faint">{t(labelKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section>
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold text-ink">{t('home.whyUs')}</h2>
          <p className="mt-2 text-sm text-faint">{t('home.whyUsSubtitle')}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          {features.map(({ gradient, border, iconBg, icon, title, desc }) => (
            <div
              key={title}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${gradient} ${border} p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover`}
            >
              {/* Top accent line */}
              <div className={`absolute left-0 top-0 h-[2px] w-full bg-gradient-to-r ${gradient} opacity-60`} />
              <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}>
                {icon}
              </div>
              <h3 className="text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-faint">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-surface-card px-8 py-16 text-center">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-accent/4" />
          <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 border border-primary/25">
              <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-ink">{t('home.ctaTitle')}</h2>
            <p className="mt-3 text-faint">{t('home.ctaSubtitle')}</p>
            <Link
              to="/register"
              className="mt-8 inline-block rounded-2xl bg-gradient-to-r from-primary to-primary-light px-14 py-4 text-base font-bold text-white shadow-neon transition-all duration-200 hover:shadow-neon-lg hover:scale-[1.02]"
            >
              {t('home.ctaButton')}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
