/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3D9E3D',
          dark: '#2D7A2D',
          light: '#56C156',
          muted: 'rgba(61,158,61,0.12)',
        },
        accent: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          muted: 'rgba(59,130,246,0.12)',
        },
        surface: {
          bg:       '#E8EDF4',   // page background — clearly blue-gray
          card:     '#FFFFFF',   // card / panel
          elevated: '#F0F3F8',   // input fields, table rows
          border:   '#C2CCD9',   // visible borders
          muted:    '#96A4B6',   // disabled surfaces, placeholders
        },
        ink:   '#1A202C',   // primary text
        sub:   '#4A5568',   // secondary text
        faint: '#718096',   // captions, helper text
      },
      boxShadow: {
        neon:        '0 2px 8px rgba(61,158,61,0.3), 0 0 0 1px rgba(61,158,61,0.15)',
        'neon-sm':   '0 1px 4px rgba(61,158,61,0.25)',
        'neon-lg':   '0 4px 20px rgba(61,158,61,0.35), 0 1px 4px rgba(61,158,61,0.15)',
        accent:      '0 2px 8px rgba(59,130,246,0.25)',
        'accent-sm': '0 1px 4px rgba(59,130,246,0.2)',
        card:        '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)',
        'card-hover':'0 4px 12px rgba(0,0,0,0.12), 0 8px 32px rgba(0,0,0,0.08)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-mesh': 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(61,158,61,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(59,130,246,0.05) 0%, transparent 50%)',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4,0,0.6,1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
