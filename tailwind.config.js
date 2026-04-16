module.exports = {
  content: [
    './index.html',
    './services.html',
    './careers.html',
    './career-detail.html',
    './**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // COLORS - Comprehensive design system
      colors: {
        'navy-deep': '#07152a',
        'navy': '#0d1f3c',
        'navy-mid': '#152e55',
        'blue': '#1a4faa',
        'blue-bright': '#2563eb',
        'blue-soft': '#3b82f6',
        'blue-glow': 'rgba(37, 99, 235, 0.28)',
        'surface-0': '#ffffff',
        'surface-1': '#f8fafd',
        'surface-2': '#f0f4fb',
        'surface-3': '#e4ecf8',
        'text-primary': '#0d1f3c',
        'text-secondary': '#4a5e7a',
        'text-muted': '#8a9ab5',
        'text-inverse': '#ffffff',
        'text-inverse-80': 'rgba(255, 255, 255, 0.8)',
        'text-inverse-55': 'rgba(255, 255, 255, 0.55)',
        'border-light': 'rgba(13, 31, 60, 0.09)',
        'border-strong': 'rgba(13, 31, 60, 0.16)',
        'green': '#22c55e',
        'green-glow': 'rgba(34, 197, 94, 0.5)',
        'orange': '#ef6526',
        'orange-glow': 'rgba(239, 101, 38, 0.18)',
        'heading': '#2f2f2f',
        'body': '#5f6368',
        'bg': '#ffffff',
        'bg-soft': '#f7f9fc',
      },

      // FONTS
      fontFamily: {
        'dm-sans': ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        'dm-serif': ['"DM Serif Display"', 'Georgia', 'serif'],
        'inter': ['"Inter"', 'sans-serif'],
      },

      // FONT SIZES - matching custom scale
      fontSize: {
        'xs-custom': ['0.6875rem', { lineHeight: '1' }],
        'sm-custom': ['0.8125rem', { lineHeight: '1.4' }],
        'base-custom': ['0.9375rem', { lineHeight: '1.5' }],
        'lg-custom': ['1.0625rem', { lineHeight: '1.6' }],
        'xl-custom': ['1.25rem', { lineHeight: '1.1' }],
        '2xl-custom': ['1.5rem', { lineHeight: '1.2' }],
      },

      // BORDER RADIUS
      borderRadius: {
        'sm-custom': '8px',
        'md-custom': '14px',
        'lg-custom': '20px',
        'xl-custom': '26px',
        'pill': '999px',
      },

      // BOX SHADOWS - multiple layer shadows
      boxShadow: {
        'panel': '0 2px 4px rgba(7, 21, 42, 0.04), 0 8px 24px rgba(7, 21, 42, 0.08), 0 32px 72px rgba(7, 21, 42, 0.16)',
        'launcher': '0 4px 12px rgba(13, 31, 60, 0.2), 0 16px 40px rgba(13, 31, 60, 0.22)',
        'btn': '0 1px 3px rgba(37, 99, 235, 0.3), 0 4px 16px rgba(37, 99, 235, 0.22)',
        'shadow-sm': '0 1px 4px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'shadow-md': '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'shadow-lg': '0 12px 40px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.06)',
      },

      // SPACING - extend with custom values
      spacing: {
        'section': '88px',
        'section-sm': '64px',
      },

      // ANIMATION & KEYFRAMES
      keyframes: {
        'panel-in': {
          'to': {
            opacity: '1',
            transform: 'translateY(0) scale(1)',
          },
        },
        'status-pulse': {
          '0%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.5)' },
          '60%': { boxShadow: '0 0 0 6px rgba(34, 197, 94, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
        },
        'launcher-ping': {
          '0%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.5)' },
          '65%': { boxShadow: '0 0 0 8px rgba(34, 197, 94, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
        },
        'fade-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(16px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-left': {
          'from': {
            opacity: '0',
            transform: 'translateX(32px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'partners-scroll': {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
        'micro-float-1': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'micro-float-2': {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(4px)' },
        },
        'robina-typing': {
          '0%, 100%': { opacity: '0.3', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(-4px)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(1.4)' },
        },
      },

      animation: {
        'panel-in': 'panel-in 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'status-pulse': 'status-pulse 2.8s ease infinite',
        'launcher-ping': 'launcher-ping 2.5s ease infinite',
        'fade-up': 'fade-up 0.8s ease forwards',
        'fade-left': 'fade-left 1s ease forwards',
        'partners-scroll': 'partners-scroll 45s linear infinite',
        'micro-float-1': 'micro-float-1 3.5s ease-in-out infinite',
        'micro-float-2': 'micro-float-2 4s ease-in-out infinite 0.5s',
        'robina-typing': 'robina-typing 1.2s ease-in-out infinite',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },

      // TRANSITIONS
      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
