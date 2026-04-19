import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { useCartStore } from '@/store/cartStore';
import { useMyOrganization } from '@/hooks/useOrganization';

const LANGUAGES = ['en', 'kz', 'ru'] as const;

export function Header() {
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = useCartStore((s) => s.totalCount());
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { data: org } = useMyOrganization();
  const orgType = org?.type;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'ADMIN';

  const baseLinks = [
    { to: '/dashboard', key: 'nav.dashboard' },
    { to: '/products', key: 'nav.catalog' },
    { to: '/organization', key: 'nav.organization' },
    ...(isAdmin ? [{ to: '/categories', key: 'nav.categories' }] : []),
  ];

  const orgLinks = orgType === 'SUPPLIER'
    ? [
        { to: '/my-products', key: 'nav.myProducts' },
        { to: '/orders/supplier', key: 'nav.supplierOrders' },
      ]
    : orgType === 'SHOP'
    ? [
        { to: '/orders/shop', key: 'nav.shopOrders' },
      ]
    : [];

  const allLinks = [...baseLinks, ...orgLinks];

  const navLinkClass = (isActive: boolean) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-primary/10 text-primary-dark font-semibold'
        : 'text-sub hover:bg-surface-elevated hover:text-ink'
    }`;

  const mobileNavLinkClass = (isActive: boolean) =>
    `block rounded-xl px-4 py-2.5 text-sm font-medium transition ${
      isActive
        ? 'bg-primary/10 text-primary-dark font-semibold'
        : 'text-sub hover:bg-surface-elevated hover:text-ink'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-neon-sm transition-all duration-200 group-hover:shadow-neon">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-ink">
            Taps<span className="text-primary">yrys</span>
          </span>
        </Link>

        {/* Desktop nav */}
        {isAuthenticated && (
          <nav className="hidden items-center gap-0.5 lg:flex">
            {allLinks.map(({ to, key }) => (
              <NavLink key={to} to={to} className={({ isActive }) => navLinkClass(isActive)}>
                {t(key)}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">

          {/* Language switcher */}
          <div className="hidden items-center gap-0.5 rounded-xl border border-surface-border bg-surface-elevated p-1 sm:flex">
            {LANGUAGES.map((lng) => (
              <button
                key={lng}
                onClick={() => i18n.changeLanguage(lng)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-150 ${
                  i18n.language === lng
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-faint hover:text-ink'
                }`}
              >
                {t(`lang.${lng}`)}
              </button>
            ))}
          </div>

          {isAuthenticated ? (
            <>
              {/* Cart button — hidden for suppliers */}
              {orgType !== 'SUPPLIER' && (
                <Link
                  to="/cart"
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-surface-border bg-white transition hover:border-primary/40 hover:bg-surface-elevated"
                >
                  <svg className="h-5 w-5 text-sub" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2 rounded-xl border border-surface-border bg-white px-3 py-2 text-sm transition hover:border-primary/40 hover:bg-surface-elevated"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {user?.email?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="hidden max-w-[120px] truncate text-sub sm:block">
                    {user?.email}
                  </span>
                  <svg className="h-3.5 w-3.5 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-surface-border bg-white p-1 shadow-card-hover">
                    <div className="border-b border-surface-border px-4 py-3">
                      <p className="truncate text-xs font-medium text-faint">{user?.email}</p>
                      <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary-dark">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {user?.role}
                      </span>
                    </div>
                    {/* Mobile language switcher */}
                    <div className="border-b border-surface-border px-4 py-2.5 sm:hidden">
                      <p className="mb-1.5 text-xs text-faint">Language</p>
                      <div className="flex gap-1">
                        {LANGUAGES.map((lng) => (
                          <button
                            key={lng}
                            onClick={() => i18n.changeLanguage(lng)}
                            className={`flex-1 rounded-lg py-1 text-xs font-semibold transition ${
                              i18n.language === lng
                                ? 'bg-primary text-white'
                                : 'bg-surface-elevated text-faint hover:text-ink'
                            }`}
                          >
                            {t(`lang.${lng}`)}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-red-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-sub transition hover:text-ink"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-neon-sm transition hover:bg-primary-dark hover:shadow-neon"
              >
                {t('nav.register')}
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          {isAuthenticated && (
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="rounded-lg p-2 text-faint transition hover:bg-surface-elevated hover:text-ink lg:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && isAuthenticated && (
        <nav className="border-t border-surface-border bg-white px-4 py-3 lg:hidden">
          {allLinks.map(({ to, key }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => mobileNavLinkClass(isActive)}
            >
              {t(key)}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
