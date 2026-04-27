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

  // ── Nav scroll styling ──
  const nav = document.querySelector("nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  // ── Mobile menu ──
  const navMenu = document.getElementById("navMenu");
  const navHamburger = document.getElementById("navHamburger");

  function closeMobileMenu() {
    navMenu?.classList.add("hidden");
    navHamburger?.setAttribute("aria-expanded", "false");
  }
  function openMobileMenu() {
    navMenu?.classList.remove("hidden");
    navHamburger?.setAttribute("aria-expanded", "true");
  }
  if (navHamburger) {
    navHamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded = navHamburger.getAttribute("aria-expanded") === "true";
      isExpanded ? closeMobileMenu() : openMobileMenu();
    });
  }
  document.addEventListener("click", (e) => {
    if (
      navMenu &&
      !navMenu.classList.contains("hidden") &&
      !navMenu.contains(e.target) &&
      !navHamburger?.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) closeMobileMenu();
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
      if (window.innerWidth <= 1024) closeMobileMenu();
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
  const track = document.querySelector(".testimonials-track");
  const prevBtn = document.getElementById("testimonialPrev");
  const nextBtn = document.getElementById("testimonialNext");
  const dotsContainer = document.getElementById("carouselDots");
  if (track && prevBtn && nextBtn) {
    let currentIndex = 0;
    const cards = track.querySelectorAll(".testimonial");
    const isMobile = () => window.innerWidth <= 768;
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
  const partnersTrack = document.querySelector(".partners-track");
  if (partnersTrack && !partnersTrack.dataset.duplicated) {
    partnersTrack.innerHTML += partnersTrack.innerHTML;
    partnersTrack.dataset.duplicated = "true";
  }

  // ── Video player ──
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
    overlay.addEventListener("click", () => (video.paused ? playVid() : pauseVid()));
    video.addEventListener("ended", () => overlay.classList.remove("playing"));

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
    const cards = document.querySelectorAll('.team-card-small[data-team-card="true"]');
    const open = btn?.classList.contains("expanded");

    if (!open) {
      cards.forEach((c, i) => {
        c.classList.remove("hidden");
        c.style.animation = `fadeInCard 0.4s ease ${i * 0.08}s both`;
      });
      row?.classList.remove("masked");
      row?.classList.add("expanded");
      btn?.classList.add("expanded");
      if (label) label.textContent = "Showing the Full Crew";
      if (count) count.textContent = "Collapse ↑";
    } else {
      cards.forEach((c) => c.classList.add("hidden"));
      row?.classList.remove("expanded");
      row?.classList.add("masked");
      btn?.classList.remove("expanded");
      if (label) label.textContent = "Meet the Full Crew";
      if (count) count.textContent = "+" + cards.length + " more";
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
      photo?.classList.remove("revealed");
      short?.classList.remove("hidden");
      hint?.classList.remove("show");
    } else {
      bio.classList.add("revealed");
      photo?.classList.add("revealed");
      short?.classList.add("hidden");
      hint?.classList.add("show");
    }
  };

  // Set initial hidden count
  (function () {
    const cards = document.querySelectorAll('.team-card-small[data-team-card="true"]');
    const countEl = document.getElementById("expandCount");
    if (countEl) countEl.textContent = "+" + cards.length + " more";
    if (cards.length === 0) {
      const wrap = document.getElementById("teamExpandWrap");
      if (wrap) wrap.style.display = "none";
    }
    const hint = document.getElementById("founderHint");
    if (hint) hint.classList.add("show");
  })();
});

// ── Dashboard Chart ──
function initDashboardChart() {
  const canvas = document.getElementById("dashboardChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let tick = 0;

  const liveData = {
    revenue: [62, 68, 71, 75, 73, 80, 84, 79, 88, 92, 87, 95],
    ops: [44, 50, 47, 55, 52, 60, 58, 66, 63, 71, 68, 76],
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
      ctx.bezierCurveTo(cx, yPos(pts2[i - 1] + waveOffset), cx, yPos(pts2[i] + waveOffset), xPos(i), yPos(pts2[i] + waveOffset));
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
      ctx.bezierCurveTo(cx, yPos(pts2[i - 1] + waveOffset), cx, yPos(pts2[i] + waveOffset), xPos(i), yPos(pts2[i] + waveOffset));
    }
    ctx.strokeStyle = "#ef6526";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Revenue area
    ctx.beginPath();
    ctx.moveTo(xPos(0), yPos(pts1[0] - waveOffset));
    for (let i = 1; i < pts1.length; i++) {
      const cx = xPos(i - 0.5);
      ctx.bezierCurveTo(cx, yPos(pts1[i - 1] - waveOffset), cx, yPos(pts1[i] - waveOffset), xPos(i), yPos(pts1[i] - waveOffset));
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
      ctx.bezierCurveTo(cx, yPos(pts1[i - 1] - waveOffset), cx, yPos(pts1[i] - waveOffset), xPos(i), yPos(pts1[i] - waveOffset));
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
    [0, 3, 6, 9, 11].forEach((i) => ctx.fillText(liveData.labels[i], xPos(i), h - 5));
  }

  function animate() {
    tick++;
    drawChart();
    requestAnimationFrame(animate);
  }

  function resizeCanvas() {
    const c = canvas.parentElement;
    if (c) {
      canvas.width = c.offsetWidth;
      canvas.height = c.offsetHeight;
    }
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  animate();
}

// Initialize dashboard chart
initDashboardChart();

// CTA Form handling
(function () {
  const form = document.getElementById("ctaEmailForm");
  const input = document.getElementById("ctaEmailInput");
  const btn = document.getElementById("ctaSubmitBtn");
  const btnText = document.getElementById("ctaBtnText");
  const btnSpinner = document.getElementById("ctaBtnSpinner");
  const msgBox = document.getElementById("ctaFormMsg");
  if (!form) return;

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  }

  function showMsg(text, type) {
    msgBox.textContent = text;
    msgBox.className = "cta-form-msg " + type;
    msgBox.style.display = "block";
  }

  function setLoading(loading) {
    btn.disabled = loading;
    btnText.style.display = loading ? "none" : "inline";
    btnSpinner.style.display = loading ? "inline" : "none";
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = input.value.trim();
    input.classList.remove("input-error");
    msgBox.style.display = "none";
    if (!isValidEmail(email)) {
      input.classList.add("input-error");
      showMsg("Please enter a valid email address.", "error");
      input.focus();
      return;
    }
    setLoading(true);
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        user_email: email,
        subject: "New Discovery Call Request — TechSpecialist",
        message: `Email: ${email}\nTimestamp: ${new Date().toUTCString()}`,
      });
      showMsg(
        "Thank you! Our team will be in touch within 24 hours to schedule your discovery call.",
        "success",
      );
      input.value = "";
    } catch (err) {
      showMsg(
        "Something went wrong. Please email us at info@techspecialistlimited.com",
        "error",
      );
    }
    setLoading(false);
  });

  input.addEventListener("input", function () {
    input.classList.remove("input-error");
    msgBox.style.display = "none";
  });
})();

// Chatbot
(function () {
  const TOKEN_ENDPOINT = "https://fa64327063b1ee6cb6ac5ab348f9f9.01.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr86a_robinaIntelligenceGuide/directline/token?api-version=2022-03-01-preview";

  const elToggle = document.getElementById("tsChatToggle");
  const elPanel = document.getElementById("tsChatPanel");
  const elClose = document.getElementById("tsChatClose");
  const elWidget = document.getElementById("tsChatWidget");
  const elIntro = document.getElementById("tsChatIntro");
  const webchatRoot = document.getElementById("webchat");

  if (!elToggle || !elPanel) return;

  let webChatRendered = false;
  let directLineInstance = null;
  let storeInstance = null;
  let introHidden = false;
  let userHasStartedChat = false;

  async function fetchToken() {
    const res = await fetch(TOKEN_ENDPOINT, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      throw new Error(`Token request failed: ${res.status} ${res.statusText}`);
    }
    return res.json();
  }

  function hideIntro() {
    if (!elIntro || introHidden) return;
    introHidden = true;
    elIntro.classList.add("hidden");
  }

  function markUserStartedChat() {
    if (userHasStartedChat) return;
    userHasStartedChat = true;
    hideIntro();
  }

  function dispatchInitialMessage(message) {
    if (!message || !storeInstance) return;
    markUserStartedChat();
    storeInstance.dispatch({
      type: "WEB_CHAT/SEND_MESSAGE",
      payload: { text: message },
    });
  }

  async function renderWebChat(initialMessage = "") {
    if (webChatRendered) {
      if (initialMessage) {
        dispatchInitialMessage(initialMessage);
      }
      return;
    }

    const tokenPayload = await fetchToken();
    const token =
      tokenPayload.token ||
      tokenPayload.conversationToken ||
      tokenPayload.directLineToken;

    if (!token) {
      throw new Error("No Direct Line token returned by the token endpoint.");
    }

    directLineInstance = window.WebChat.createDirectLine({ token });

    storeInstance = window.WebChat.createStore(
      {},
      ({ dispatch }) => (next) => (action) => {
        if (action.type === "DIRECT_LINE/CONNECT_FULFILLED" && initialMessage) {
          markUserStartedChat();
          dispatch({
            type: "WEB_CHAT/SEND_MESSAGE",
            payload: { text: initialMessage },
          });
        }
        if (action.type === "WEB_CHAT/SEND_MESSAGE") {
          markUserStartedChat();
        }
        return next(action);
      }
    );

    const styleOptions = {
      hideUploadButton: true,
      botAvatarImage: "https://res.cloudinary.com/daqmbfctv/image/upload/c_crop,g_north_west,h_2206,w_2696/tbs_7274jpg_gmfio2_68362b.jpg",
      userAvatarInitials: "You",
      botAvatarBackgroundColor: "#0d1f3c",
      userAvatarBackgroundColor: "#2563eb",
      bubbleBorderRadius: 14,
      bubbleFromUserBorderRadius: 14,
      bubbleBackground: "#ffffff",
      bubbleBorderWidth: 1,
      bubbleBorderColor: "rgba(13,31,60,0.10)",
      bubbleFromUserBackground: "#1a4faa",
      bubbleFromUserBorderWidth: 0,
      bubbleFromUserBorderColor: "transparent",
      bubbleTextColor: "#0d1f3c",
      bubbleFromUserTextColor: "#ffffff",
      suggestedActionBackground: "#ffffff",
      suggestedActionBorderColor: "rgba(37,99,235,0.22)",
      suggestedActionBorderRadius: 8,
      suggestedActionBorderWidth: 1,
      suggestedActionTextColor: "#1a4faa",
      suggestedActionBackgroundColorOnHover: "#eef3ff",
      suggestedActionBorderColorOnHover: "rgba(37,99,235,0.40)",
      sendBoxBackground: "#ffffff",
      sendBoxBorderTop: "1px solid rgba(13,31,60,0.09)",
      sendBoxTextColor: "#0d1f3c",
      sendBoxPlaceholderColor: "#8a9ab5",
      sendBoxButtonColor: "#2563eb",
      sendBoxButtonColorOnHover: "#1a4faa",
      sendBoxHeight: 54,
      timestampColor: "#8a9ab5",
      primaryFont: "DM Sans, system-ui, -apple-system, sans-serif",
      rootHeight: "100%",
      rootWidth: "100%",
      bubbleMinHeight: 32,
      avatarSize: 38,
      messageActivityWordBreak: "break-word",
    };

    window.WebChat.renderWebChat(
      {
        directLine: directLineInstance,
        store: storeInstance,
        styleOptions,
      },
      webchatRoot
    );

    webChatRendered = true;
  }

  window.openChat = async function (initialMessage = "") {
    elPanel.classList.add("open");
    elPanel.setAttribute("aria-hidden", "false");
    elToggle.setAttribute("aria-expanded", "true");
    elToggle.style.display = "none";

    try {
      await renderWebChat(initialMessage);
    } catch (err) {
      console.error("[TechSpecialist Copilot]", err);
      alert(
        "The chat assistant could not be loaded.\nPlease check the Direct Line token endpoint and web channel settings."
      );
    }
  };

  function closeChat() {
    elPanel.classList.remove("open");
    elPanel.setAttribute("aria-hidden", "true");
    elToggle.setAttribute("aria-expanded", "false");
    elToggle.style.display = "block";
  }

  elToggle.addEventListener("click", function () {
    if (elPanel.classList.contains("open")) {
      closeChat();
    } else {
      window.openChat();
    }
  });

  elClose.addEventListener("click", function () {
    closeChat();
  });

  document.addEventListener("click", function (event) {
    if (elPanel.classList.contains("open") && !elWidget.contains(event.target)) {
      closeChat();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && elPanel.classList.contains("open")) {
      closeChat();
      elToggle.focus();
    }
  });
})();
