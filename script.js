document.addEventListener("DOMContentLoaded", () => {
  // ── Cookie Consent Banner ──
  const cookieBanner = document.getElementById("cookieBanner");
  const cookieAccept = document.getElementById("cookieAccept");
  const cookieDecline = document.getElementById("cookieDecline");
  const COOKIE_KEY = "ts_cookie_consent";

  function dismissBanner() {
    cookieBanner?.classList.remove("show");
    setTimeout(() => {
      cookieBanner && (cookieBanner.style.display = "none");
    }, 600);
  }
  if (cookieBanner && !localStorage.getItem(COOKIE_KEY)) {
    setTimeout(() => cookieBanner.classList.add("show"), 2000);
  }
  cookieAccept?.addEventListener("click", () => {
    localStorage.setItem(COOKIE_KEY, "accepted");
    dismissBanner();
  });
  cookieDecline?.addEventListener("click", () => {
    localStorage.setItem(COOKIE_KEY, "essential");
    dismissBanner();
  });

  // ── Scroll reveals ──
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 },
    );
    reveals.forEach((el) => observer.observe(el));
  }

  // ── Sticky CTA ──
  const stickyCta = document.getElementById("stickyCta");
  if (stickyCta) {
    window.addEventListener("scroll", () => {
      stickyCta.classList.toggle("show", window.scrollY > 600);
    });
  }

  // ── Nav scroll styling ──
  const nav = document.getElementById("mainNav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  // ── Coming Soon links ──
  document.querySelectorAll(".coming-soon-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("comingSoon")?.classList.add("active");
    });
  });

  // ── Mobile menu ──
  const navLinks = document.getElementById("navLinks");
  const navHamburger = document.getElementById("navHamburger");

  function closeMobileMenu() {
    navLinks?.classList.remove("open");
    navHamburger?.classList.remove("active");
    navHamburger?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }
  function openMobileMenu() {
    navLinks?.classList.add("open");
    navHamburger?.classList.add("active");
    navHamburger?.setAttribute("aria-expanded", "true");
  }
  if (navHamburger) {
    navHamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      navLinks?.classList.contains("open")
        ? closeMobileMenu()
        : openMobileMenu();
    });
  }
  document.addEventListener("click", (e) => {
    if (
      navLinks?.classList.contains("open") &&
      !navLinks.contains(e.target) &&
      !navHamburger?.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) closeMobileMenu();
  });

  // ── Smooth scroll ──
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
      if (window.innerWidth <= 960) closeMobileMenu();
    });
  });

  // ── Count-up animation ──
  function countUp(el, target, prefix, suffix, duration = 1200) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.innerHTML = prefix + Math.floor(start) + suffix;
      if (start >= target) clearInterval(timer);
    }, 16);
  }
  const outcomesGrid = document.querySelector(".outcomes-grid");
  if (outcomesGrid) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll(".outcome-num").forEach((n) => {
            const text = n.textContent.trim();
            if (text === "₦0" || text === "24/7") return;
            if (text.endsWith("wk")) countUp(n, parseInt(text), "", "wk");
            else if (text.includes("%")) countUp(n, parseInt(text), "", "%");
            else if (text.includes("×")) countUp(n, parseInt(text), "", "×");
          });
          statsObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.3 },
    );
    statsObserver.observe(outcomesGrid);
  }

  // ── Testimonials carousel ──
  const track = document.getElementById("testimonialsTrack");
  const prevBtn = document.getElementById("testimonialPrev");
  const nextBtn = document.getElementById("testimonialNext");
  const dotsContainer = document.getElementById("carouselDots");
  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;
    const cards = track.querySelectorAll(".testimonial");
    const isMobile = () => window.innerWidth <= 960;
    const visibleCount = () => (isMobile() ? 1 : 2);
    const getMaxIndex = () => Math.max(0, cards.length - visibleCount());
    function updateDots() {
      dotsContainer?.querySelectorAll(".carousel-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }
    function goTo(index) {
      currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
      const gap = 20;
      const cardWidth = (cards[0]?.offsetWidth || 0) + gap;
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      updateDots();
    }
    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = "";
      for (let i = 0; i <= getMaxIndex(); i++) {
        const dot = document.createElement("div");
        dot.className = `carousel-dot${i === 0 ? " active" : ""}`;
        dot.addEventListener("click", () => goTo(i));
        dotsContainer.appendChild(dot);
      }
    }
    prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
    nextBtn.addEventListener("click", () => goTo(currentIndex + 1));
    buildDots();
    goTo(0);
    window.addEventListener("resize", () => {
      currentIndex = 0;
      buildDots();
      goTo(0);
    });
  }

  // ── Partners slider duplication ──
  const partnersTrack =
    document.getElementById("partnersTrack") ||
    document.querySelector(".partners-track");
  if (partnersTrack && !partnersTrack.dataset.duplicated) {
    partnersTrack.innerHTML += partnersTrack.innerHTML;
    partnersTrack.dataset.duplicated = "true";
  }

  // ── Agentic Dashboard ──

  //Robina Chatbot
  initAgenticDashboard();



  // ── Custom video player ──
  const video = document.getElementById("founderVideo");
  const overlay = document.getElementById("videoOverlay");

  if (video && overlay) {
    function playVid() {
      video.play();
      overlay.classList.add("playing");
    }
    function pauseVid() {
      video.pause();
      overlay.classList.remove("playing");
    }

    overlay.addEventListener("click", () =>
      video.paused ? playVid() : pauseVid(),
    );
    video.addEventListener("ended", () => overlay.classList.remove("playing"));

    // Auto-pause when section scrolls out of view
    const problemSection = document.getElementById("problem");
    if (problemSection) {
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting && !video.paused) pauseVid();
          });
        },
        { threshold: 0.08 },
      ).observe(problemSection);
    }
  }

  // ── Team expand / collapse ──
  window.toggleTeam = function () {
    const btn = document.getElementById("teamExpandBtn");
    const row = document.getElementById("teamSecondaryRow");
    const label = document.getElementById("expandLabel");
    const count = document.getElementById("expandCount");
    const cards = document.querySelectorAll(
      '.team-card-small[data-team-card="true"]',
    );
    const open = btn.classList.contains("expanded");

    if (!open) {
      cards.forEach((c, i) => {
        c.classList.remove("hidden");
        c.style.animation = `fadeInCard 0.4s ease ${i * 0.08}s both`;
      });
      row.classList.remove("masked");
      row.classList.add("expanded");
      btn.classList.add("expanded");
      label.textContent = "Showing the Full Crew";
      count.textContent = "Collapse ↑";
    } else {
      cards.forEach((c) => c.classList.add("hidden"));
      row.classList.remove("expanded");
      row.classList.add("masked");
      btn.classList.remove("expanded");
      label.textContent = "Meet the Full Crew";
      count.textContent = "+" + cards.length + " more";
    }
  };

  // ── Founder bio reveal ──
  window.revealFounderBio = function () {
    const photo = document.getElementById("founderPhoto");
    const bio = document.getElementById("founderBio");
    const short = document.querySelector(".fc-short");
    const hint = document.getElementById("founderHint");
    
    if (bio.classList.contains("revealed")) {
      bio.classList.remove("revealed");
      photo.classList.remove("revealed");
      short.classList.remove("hidden");
      hint.classList.remove("show");
    } else {
      bio.classList.add("revealed");
      photo.classList.add("revealed");
      short.classList.add("hidden");
      hint.classList.add("show");
    }
  };

  // Set initial hidden count
  (function () {
    const cards = document.querySelectorAll(
      '.team-card-small[data-team-card="true"]',
    );
    const countEl = document.getElementById("expandCount");
    if (countEl) countEl.textContent = "+" + cards.length + " more";
    if (cards.length === 0) {
      const wrap = document.getElementById("teamExpandWrap");
      if (wrap) wrap.style.display = "none";
    }
    
    // Show founder hint
    const hint = document.getElementById("founderHint");
    if (hint) {
      hint.classList.add("show");
    }
  })();
});

// ── Typing dot styles ──
(function () {
  const s = document.createElement("style");
  s.textContent = `
        .typing-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#9ca3af;animation:robinaTyping 1.2s ease-in-out infinite}
        .typing-dot:nth-child(2){animation-delay:0.2s}
        .typing-dot:nth-child(3){animation-delay:0.4s}
        @keyframes robinaTyping{0%,100%{opacity:0.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-4px)}}
    `;
  document.head.appendChild(s);
})();

// ── Agentic Dashboard ──
function initAgenticDashboard() {
  const canvas = document.getElementById("dashboardChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let tick = 0;

  const liveData = {
    revenue: [62, 68, 71, 75, 73, 80, 84, 79, 88, 92, 87, 95],
    ops: [44, 50, 47, 55, 52, 60, 58, 66, 63, 71, 68, 76],
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
  };

  function drawChart() {
    const w = canvas.width,
      h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const pts1 = liveData.revenue,
      pts2 = liveData.ops;
    const pad = { l: 8, r: 8, t: 10, b: 20 };
    const chartW = w - pad.l - pad.r,
      chartH = h - pad.t - pad.b,
      maxV = 110;
    const xPos = (i) => pad.l + (i / (pts1.length - 1)) * chartW;
    const yPos = (v) => pad.t + chartH - (v / maxV) * chartH;
    const waveOffset = Math.sin(tick * 0.015) * 2;

    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.t + (i / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(pad.l, y);
      ctx.lineTo(w - pad.r, y);
      ctx.stroke();
    }

    // Ops area
    ctx.beginPath();
    ctx.moveTo(xPos(0), yPos(pts2[0] + waveOffset));
    for (let i = 1; i < pts2.length; i++) {
      const cx = xPos(i - 0.5);
      ctx.bezierCurveTo(
        cx,
        yPos(pts2[i - 1] + waveOffset),
        cx,
        yPos(pts2[i] + waveOffset),
        xPos(i),
        yPos(pts2[i] + waveOffset),
      );
    }
    ctx.lineTo(xPos(pts2.length - 1), h);
    ctx.lineTo(xPos(0), h);
    ctx.closePath();
    const g2 = ctx.createLinearGradient(0, 0, 0, h);
    g2.addColorStop(0, "rgba(239,101,38,0.18)");
    g2.addColorStop(1, "rgba(239,101,38,0)");
    ctx.fillStyle = g2;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(xPos(0), yPos(pts2[0] + waveOffset));
    for (let i = 1; i < pts2.length; i++) {
      const cx = xPos(i - 0.5);
      ctx.bezierCurveTo(
        cx,
        yPos(pts2[i - 1] + waveOffset),
        cx,
        yPos(pts2[i] + waveOffset),
        xPos(i),
        yPos(pts2[i] + waveOffset),
      );
    }
    ctx.strokeStyle = "#ef6526";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Revenue area
    ctx.beginPath();
    ctx.moveTo(xPos(0), yPos(pts1[0] - waveOffset));
    for (let i = 1; i < pts1.length; i++) {
      const cx = xPos(i - 0.5);
      ctx.bezierCurveTo(
        cx,
        yPos(pts1[i - 1] - waveOffset),
        cx,
        yPos(pts1[i] - waveOffset),
        xPos(i),
        yPos(pts1[i] - waveOffset),
      );
    }
    ctx.lineTo(xPos(pts1.length - 1), h);
    ctx.lineTo(xPos(0), h);
    ctx.closePath();
    const g1 = ctx.createLinearGradient(0, 0, 0, h);
    g1.addColorStop(0, "rgba(69,132,237,0.25)");
    g1.addColorStop(1, "rgba(69,132,237,0)");
    ctx.fillStyle = g1;
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(xPos(0), yPos(pts1[0] - waveOffset));
    for (let i = 1; i < pts1.length; i++) {
      const cx = xPos(i - 0.5);
      ctx.bezierCurveTo(
        cx,
        yPos(pts1[i - 1] - waveOffset),
        cx,
        yPos(pts1[i] - waveOffset),
        xPos(i),
        yPos(pts1[i] - waveOffset),
      );
    }
    ctx.strokeStyle = "#4584ed";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Animated dot
    const dp = (Math.sin(tick * 0.05) + 1) / 2;
    const dotX = xPos(pts1.length - 1),
      dotY = yPos(pts1[pts1.length - 1] - waveOffset);
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4 + dp * 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(69,132,237,${0.15 + dp * 0.15})`;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#4584ed";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.font = "9px Inter,sans-serif";
    ctx.textAlign = "center";
    [0, 3, 6, 9, 11].forEach((i) =>
      ctx.fillText(liveData.labels[i], xPos(i), h - 5),
    );
  }

  const feedItems = [
    "⚡ Procurement approval auto-routed — 4 sec",
    "📊 Q3 variance 12% above threshold — Lagos logistics",
    "✅ Board report generated — Finance Dept",
    "🔔 New data source connected — HR System",
    "💡 Copilot insight: Recommend cost review in Ops",
    "🔄 Power Automate flow executed — 847 records",
    "📈 Revenue forecast updated — +18% vs Q2",
    "⚠️ Anomaly detected — Supply Chain delay flagged",
  ];
  let feedIdx = 0;

  function rotateFeed() {
    const el = document.getElementById("dash-feed-text");
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(-8px)";
    setTimeout(() => {
      feedIdx = (feedIdx + 1) % feedItems.length;
      el.textContent = feedItems[feedIdx];
      el.style.transition = "opacity 0.4s ease,transform 0.4s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 300);
  }

  function fluctuateMetrics() {
    const r = document.getElementById("dash-revenue");
    if (r) {
      const v = 17 + Math.floor(Math.random() * 3);
      r.textContent = `+${v}%`;
    }
    const s = document.getElementById("dash-sources");
    if (s) {
      s.textContent = ["12 live", "13 live", "12 live"][
        Math.floor(Math.random() * 3)
      ];
    }
  }

  function animate() {
    tick++;
    drawChart();
    requestAnimationFrame(animate);
  }
  animate();
  setInterval(rotateFeed, 3500);
  setInterval(fluctuateMetrics, 4000);

  function resizeCanvas() {
    const c = canvas.parentElement;
    if (c) {
      canvas.width = c.offsetWidth;
      canvas.height = c.offsetHeight;
    }
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
}