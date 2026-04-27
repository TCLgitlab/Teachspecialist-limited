document.addEventListener('DOMContentLoaded', function () {
  const navHamburger = document.getElementById('navHamburger');
  const navMenu = document.getElementById('navMenu');

  if (navHamburger && navMenu) {
    navHamburger.addEventListener('click', () => {
      const expanded = navHamburger.getAttribute('aria-expanded') === 'true';
      navHamburger.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('hidden');
    });
  }

  (function () {
    const desktopToggle = document.getElementById('themeToggle');
    const mobileToggle = document.getElementById('themeToggleMobile');
    const toggles = [desktopToggle, mobileToggle].filter(Boolean);

    function setTheme(isDark) {
      if (isDark) {
        document.documentElement.classList.add('dark');
        toggles.forEach(t => (t.textContent = '🌙'));
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        toggles.forEach(t => (t.textContent = '☀️'));
        localStorage.setItem('theme', 'light');
      }
    }

    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setTheme(true);
    else if (saved === 'light') setTheme(false);
    else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme(true);

    toggles.forEach(btn => {
      btn.addEventListener('click', () => {
        setTheme(!document.documentElement.classList.contains('dark'));
      });
    });
  })();
});
