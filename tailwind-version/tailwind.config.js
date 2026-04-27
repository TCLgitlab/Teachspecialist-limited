module.exports = {
  darkMode: 'class',
  content: [
    './**/*.html',
    './**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#4584ed'
        },
        blue: {
          DEFAULT: '#4584ed',
          dark: '#2d65c4'
        },
        orange: '#ef6526',
        navy: '#080e1e',
        heading: '#2f2f2f',
        body: '#5f6368'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        dm: ['"DM Sans"', 'system-ui', 'sans-serif'],
        syne: ['Syne', 'Inter', 'sans-serif'],
        dmserif: ['"DM Serif Display"', 'Georgia', 'serif']
      },
      boxShadow: {
        'sm': '0 1px 4px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'lg': '0 12px 40px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.06)'
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        paused: {
          '0%, 100%': { animationPlayState: 'paused' }
        }
      },
      animation: {
        scroll: 'scroll 45s linear infinite'
      }
    }
  },
  plugins: [],
}
