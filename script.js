document.addEventListener('DOMContentLoaded', () => {

    // ── Cookie Consent Banner ──
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');
    const COOKIE_KEY = 'ts_cookie_consent';

    function dismissBanner() {
        cookieBanner?.classList.remove('show');
        setTimeout(() => { cookieBanner && (cookieBanner.style.display = 'none'); }, 600);
    }

    if (cookieBanner && !localStorage.getItem(COOKIE_KEY)) {
        setTimeout(() => cookieBanner.classList.add('show'), 2000);
    }
    cookieAccept?.addEventListener('click', () => { localStorage.setItem(COOKIE_KEY, 'accepted'); dismissBanner(); });
    cookieDecline?.addEventListener('click', () => { localStorage.setItem(COOKIE_KEY, 'essential'); dismissBanner(); });

    // ── Scroll reveals ──
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        reveals.forEach((el) => observer.observe(el));
    }

    // ── Sticky CTA ──
    const stickyCta = document.getElementById('stickyCta');
    if (stickyCta) {
        window.addEventListener('scroll', () => { stickyCta.classList.toggle('show', window.scrollY > 600); });
    }

    // ── Nav scroll styling ──
    const nav = document.getElementById('mainNav');
    if (nav) {
        window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 20); });
    }

    // ── Coming Soon links ──
    document.querySelectorAll('.coming-soon-link').forEach((link) => {
        link.addEventListener('click', (e) => { e.preventDefault(); document.getElementById('comingSoon')?.classList.add('active'); });
    });

    // ── Exec chart bars (replaced by full dashboard JS below) ──
    const execBars = document.getElementById('execChartBars');
    if (execBars) {
        const heights = [30, 45, 35, 55, 40, 70, 52, 65, 48, 80, 62, 90];
        heights.forEach((h, i) => {
            const bar = document.createElement('div');
            bar.className = `bar${i === heights.length - 1 ? ' active' : ''}`;
            bar.style.height = `${h}%`;
            execBars.appendChild(bar);
        });
    }

    // ── Mobile menu ──
    const navLinks = document.getElementById('navLinks');
    const navHamburger = document.getElementById('navHamburger');

    function closeMobileMenu() {
        navLinks?.classList.remove('open');
        navHamburger?.classList.remove('active');
        navHamburger?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }

    function openMobileMenu() {
        navLinks?.classList.add('open');
        navHamburger?.classList.add('active');
        navHamburger?.setAttribute('aria-expanded', 'true');
    }

    if (navHamburger) {
        navHamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks?.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
        });
    }

    document.addEventListener('click', (e) => {
        if (navLinks?.classList.contains('open') && !navLinks.contains(e.target) && !navHamburger?.contains(e.target)) {
            closeMobileMenu();
        }
    });
    window.addEventListener('resize', () => { if (window.innerWidth > 960) closeMobileMenu(); });

    // ── Smooth scroll ──
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const id = anchor.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
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

    const outcomesGrid = document.querySelector('.outcomes-grid');
    if (outcomesGrid) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.querySelectorAll('.outcome-num').forEach((n) => {
                    const text = n.textContent.trim();
                    if (text === '₦0' || text === '24/7') return;
                    if (text.endsWith('wk')) countUp(n, parseInt(text), '', 'wk');
                    else if (text.includes('%')) countUp(n, parseInt(text), '', '%');
                    else if (text.includes('×')) countUp(n, parseInt(text), '', '×');
                });
                statsObserver.unobserve(entry.target);
            });
        }, { threshold: 0.3 });
        statsObserver.observe(outcomesGrid);
    }

    // ── Testimonials carousel ──
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const dotsContainer = document.getElementById('carouselDots');

    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        const cards = track.querySelectorAll('.testimonial');
        const isMobile = () => window.innerWidth <= 960;
        const visibleCount = () => (isMobile() ? 1 : 2);
        const getMaxIndex = () => Math.max(0, cards.length - visibleCount());

        function updateDots() {
            dotsContainer?.querySelectorAll('.carousel-dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
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
            dotsContainer.innerHTML = '';
            for (let i = 0; i <= getMaxIndex(); i++) {
                const dot = document.createElement('div');
                dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            }
        }

        prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
        nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
        buildDots();
        goTo(0);
        window.addEventListener('resize', () => { currentIndex = 0; buildDots(); goTo(0); });
    }

    // ── Partners slider duplication ──
    const partnersTrack = document.getElementById('partnersTrack') || document.querySelector('.partners-track');
    if (partnersTrack && !partnersTrack.dataset.duplicated) {
        partnersTrack.innerHTML += partnersTrack.innerHTML;
        partnersTrack.dataset.duplicated = 'true';
    }

    const teamTrack = document.getElementById('teamTrack');
    if (teamTrack && !teamTrack.dataset.duplicated) {
        teamTrack.innerHTML += teamTrack.innerHTML;
        teamTrack.dataset.duplicated = 'true';
    }

    // ── Agentic Dashboard Logic ──
    initAgenticDashboard();

    // ────────────────────────────────────────────
    // ── ROBINA — Agentic Chatbot ──
    // ────────────────────────────────────────────

    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMsgs = document.getElementById('chatbotMessages');
    const chatSuggestions = document.getElementById('chatSuggestions');

    const privacyNotice = document.getElementById('chatPrivacyNotice');
    const privacyDismiss = document.getElementById('privacyDismiss');

    if (privacyDismiss && privacyNotice) {
        privacyDismiss.addEventListener('click', (e) => {
            e.stopPropagation();
            privacyNotice.style.transition = 'opacity 0.25s ease, max-height 0.32s ease, padding 0.32s ease';
            privacyNotice.style.overflow = 'hidden';
            privacyNotice.style.maxHeight = privacyNotice.offsetHeight + 'px';
            privacyNotice.getBoundingClientRect();
            privacyNotice.style.opacity = '0';
            privacyNotice.style.maxHeight = '0';
            privacyNotice.style.paddingTop = '0';
            privacyNotice.style.paddingBottom = '0';
            privacyNotice.style.borderTopWidth = '0';
            setTimeout(() => { privacyNotice.style.display = 'none'; }, 340);
        });
    }

    const robinaBrain = [
        {
            keywords: ['how', 'work', 'process', 'methodology', 'approach'],
            reply: "Great question! 🤖 We work in two layers:\n\n**Layer 1 — Agentic Operations:** We deploy intelligent agents that automate your workflows (procurement, HR, field reporting) 24/7.\n\n**Layer 2 — Executive Intelligence:** Clean data flows into a live dashboard so leadership sees everything in real time.\n\nAll on Microsoft tools you already own — zero new software."
        },
        {
            keywords: ['sector', 'who', 'industry', 'government', 'ngo', 'private'],
            reply: "We serve three sectors across Africa 🌍:\n\n• **Government MDAs** — digital governance, budget reporting, audit-readiness\n• **International NGOs** — donor reporting, grant tracking, beneficiary data\n• **Private Sector** — C-Suite dashboards, automation, field sales\n\nWhich fits your organisation?"
        },
        {
            keywords: ['time', 'timeline', 'quick', 'fast', 'weeks', 'live', 'long'],
            reply: "We move fast ⚡\n\n• **Weeks 1–2:** Discovery & process mapping\n• **Weeks 3–6:** First agents go live\n• **Weeks 7–10:** Executive dashboard connected\n\nFrom zero to live intelligence in **10 weeks**. No new software needed."
        },
        {
            keywords: ['price', 'cost', 'pricing', 'fee', 'charge', 'expensive', 'afford'],
            reply: "You don't buy new software 💡 — we build on Microsoft 365, Azure, and Power Platform licences you already pay for.\n\nPricing depends on your scope. The best next step is a **free 45-min discovery call** — no obligation, just clarity. Want to book one?"
        },
        {
            keywords: ['book', 'call', 'discovery', 'meeting', 'schedule', 'consult', 'appointment'],
            reply: "📅 A discovery call is completely free — 45 minutes, no sales pitch.\n\nScroll to the **'Start Here'** section and drop your email — our team will reach out within 24 hours. Want me to take you there?"
        },
        {
            keywords: ['microsoft', 'power bi', 'copilot', 'azure', 'fabric', 'teams', 'automate', '365'],
            reply: "We're a certified Microsoft solutions partner 🔵 building across:\n\n• **Power BI** — live executive dashboards\n• **Power Automate + Copilot Studio** — intelligent agents\n• **Microsoft Fabric + Azure** — enterprise data pipelines\n• **M365 Copilot** — plain-English data queries\n\nAll inside your existing environment."
        },
        {
            keywords: ['agent', 'agentic', 'automation', 'workflow', 'ai', 'intelligent'],
            reply: "Our agents *act*, not just report 🤩\n\n→ Route procurement approvals automatically\n→ Collect field data without manual entry\n→ Generate board reports before you ask\n→ Flag anomalies and escalate in real time\n\nThink of it as a tireless digital operations team."
        },
        {
            keywords: ['africa', 'nigeria', 'kenya', 'ghana', 'lagos', 'abuja', 'nairobi'],
            reply: "Proudly Made in Nigeria 🇳🇬, operating across Africa!\n\nOur solutions are designed for African realities — fragmented data, multi-system environments, WhatsApp-heavy workflows. We understand the context. That's our edge."
        },
        {
            keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'howdy'],
            reply: "Hey there! 😊 I'm Robina — TechSpecialist's AI assistant.\n\nI can walk you through how we transform your organisation's data into live executive intelligence. What would you like to explore?"
        },
        {
            keywords: ['thank', 'thanks', 'great', 'amazing', 'helpful', 'perfect', 'awesome'],
            reply: "You're welcome! 😄 Anything else you'd like to explore? I can walk you through our approach, the tech stack, or help you book a free discovery call!"
        }
    ];

    const defaultReplies = [
        "Great question! 🤔 Could you tell me a bit more — what sector is your organisation in, and what's your biggest operational challenge right now? That'll help me point you to exactly the right solution.",
        "Interesting! 🤖 What I can tell you is that our approach builds on your existing Microsoft environment — no new tools, no disruption. Just intelligence layered on what you already own. Want me to walk you through how it works?",
        "The fastest way to see what's possible is a **free 45-minute discovery call** — we'll map your top 3 bottlenecks and show you what we can automate. No obligation at all. Shall I point you to the booking form?"
    ];

    function getSmartReply(message) {
        const lower = message.toLowerCase();
        for (const item of robinaBrain) {
            if (item.keywords.some(k => lower.includes(k))) return item.reply;
        }
        return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    }

    function formatMessage(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n→/g, '<br>→')
            .replace(/\n•/g, '<br>•')
            .replace(/\n/g, '<br>');
    }

    const miniAvatarImg = `<img src="https://res.cloudinary.com/daqmbfctv/image/upload/v1773840810/TBS_7274.jpg_gmfio2.jpg" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="Robina">`;

    function appendMessage(text, isUser) {
        if (!chatbotMsgs) return;
        const msg = document.createElement('div');
        msg.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
        if (!isUser) {
            msg.innerHTML = `<div class="chat-msg-avatar">${miniAvatarImg}</div><div class="chat-bubble">${formatMessage(text)}</div>`;
        } else {
            msg.innerHTML = `<div class="chat-bubble">${text}</div>`;
        }
        chatbotMsgs.appendChild(msg);
        chatbotMsgs.scrollTop = chatbotMsgs.scrollHeight;
    }

    function showTyping() {
        if (!chatbotMsgs) return null;
        const el = document.createElement('div');
        el.className = 'chat-msg bot typing-indicator-msg';
        el.innerHTML = `<div class="chat-msg-avatar">${miniAvatarImg}</div>
            <div class="chat-bubble" style="display:flex;gap:4px;align-items:center;padding:12px 14px;">
                <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
            </div>`;
        chatbotMsgs.appendChild(el);
        chatbotMsgs.scrollTop = chatbotMsgs.scrollHeight;
        return el;
    }

    function hideSuggestions() {
        if (chatSuggestions) chatSuggestions.style.display = 'none';
    }

    function sendMessage(text) {
        if (!text) return;
        hideSuggestions();
        appendMessage(text, true);
        const typing = showTyping();
        const reply = getSmartReply(text);
        const delay = 700 + Math.random() * 600;
        setTimeout(() => { typing?.remove(); appendMessage(reply, false); }, delay);
    }

    function handleSend() {
        const msg = chatbotInput?.value.trim();
        if (!msg) return;
        chatbotInput.value = '';
        sendMessage(msg);
    }

    window.sendSuggestion = function (btn, text) { btn.disabled = true; sendMessage(text); };

    function openChat() {
        chatbotWindow?.classList.add('open');
        document.querySelector('.chatbot-toggle-pulse')?.remove();
        setTimeout(() => chatbotInput?.focus(), 100);
    }

    function closeChat() { chatbotWindow?.classList.remove('open'); }

    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbotWindow?.classList.contains('open') ? closeChat() : openChat();
        });
    }

    if (chatbotClose) chatbotClose.addEventListener('click', (e) => { e.stopPropagation(); closeChat(); });
    if (chatbotSend) chatbotSend.addEventListener('click', handleSend);
    if (chatbotInput) {
        chatbotInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } });
    }

    document.addEventListener('click', (e) => {
        const widget = document.getElementById('chatbotWidget');
        if (widget && chatbotWindow?.classList.contains('open') && !widget.contains(e.target)) closeChat();
    });

});

// ── Typing dot styles ──
(function () {
    const s = document.createElement('style');
    s.textContent = `
        .typing-dot { display:inline-block;width:7px;height:7px;border-radius:50%;background:#9ca3af;animation:robinaTyping 1.2s ease-in-out infinite; }
        .typing-dot:nth-child(2){animation-delay:0.2s;}
        .typing-dot:nth-child(3){animation-delay:0.4s;}
        @keyframes robinaTyping{0%,100%{opacity:0.3;transform:translateY(0);}50%{opacity:1;transform:translateY(-4px);}}
    `;
    document.head.appendChild(s);
})();

// ── Agentic Dashboard ──
function initAgenticDashboard() {
    const canvas = document.getElementById('dashboardChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animFrame;
    let tick = 0;

    // Live data simulation
    const liveData = {
        revenue: [62, 68, 71, 75, 73, 80, 84, 79, 88, 92, 87, 95],
        ops: [44, 50, 47, 55, 52, 60, 58, 66, 63, 71, 68, 76],
        labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    };

    // Live metric counters
    const metrics = [
        { id: 'dash-revenue', base: 18, suffix: '%', label: 'Revenue Growth', trend: '+', color: '#22c55e' },
        { id: 'dash-risk', base: 3, suffix: ' alerts', label: 'Active Alerts', trend: '', color: '#f59e0b' },
        { id: 'dash-sources', base: 12, suffix: ' live', label: 'Data Sources', trend: '', color: '#4584ed' }
    ];

    // Animate the canvas chart
    function drawChart() {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const pts1 = liveData.revenue;
        const pts2 = liveData.ops;
        const pad = { l: 8, r: 8, t: 10, b: 20 };
        const chartW = w - pad.l - pad.r;
        const chartH = h - pad.t - pad.b;
        const maxV = 110;

        function xPos(i) { return pad.l + (i / (pts1.length - 1)) * chartW; }
        function yPos(v) { return pad.t + chartH - (v / maxV) * chartH; }

        // Animated wave offset
        const waveOffset = Math.sin(tick * 0.015) * 2;

        // Draw grid lines
        ctx.strokeStyle = 'rgba(255,255,255,0.06)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = pad.t + (i / 4) * chartH;
            ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
        }

        // Fill area 2 (ops)
        ctx.beginPath();
        ctx.moveTo(xPos(0), yPos(pts2[0] + waveOffset));
        for (let i = 1; i < pts2.length; i++) {
            const cx1 = xPos(i - 0.5), cy1 = yPos(pts2[i - 1] + waveOffset);
            const cx2 = xPos(i - 0.5), cy2 = yPos(pts2[i] + waveOffset);
            ctx.bezierCurveTo(cx1, cy1, cx2, cy2, xPos(i), yPos(pts2[i] + waveOffset));
        }
        ctx.lineTo(xPos(pts2.length - 1), h); ctx.lineTo(xPos(0), h); ctx.closePath();
        const grad2 = ctx.createLinearGradient(0, 0, 0, h);
        grad2.addColorStop(0, 'rgba(239,101,38,0.18)'); grad2.addColorStop(1, 'rgba(239,101,38,0)');
        ctx.fillStyle = grad2; ctx.fill();

        // Ops line
        ctx.beginPath();
        ctx.moveTo(xPos(0), yPos(pts2[0] + waveOffset));
        for (let i = 1; i < pts2.length; i++) {
            const cx1 = xPos(i - 0.5), cy1 = yPos(pts2[i - 1] + waveOffset);
            const cx2 = xPos(i - 0.5), cy2 = yPos(pts2[i] + waveOffset);
            ctx.bezierCurveTo(cx1, cy1, cx2, cy2, xPos(i), yPos(pts2[i] + waveOffset));
        }
        ctx.strokeStyle = '#ef6526'; ctx.lineWidth = 2; ctx.stroke();

        // Fill area 1 (revenue)
        ctx.beginPath();
        ctx.moveTo(xPos(0), yPos(pts1[0] - waveOffset));
        for (let i = 1; i < pts1.length; i++) {
            const cx1 = xPos(i - 0.5), cy1 = yPos(pts1[i - 1] - waveOffset);
            const cx2 = xPos(i - 0.5), cy2 = yPos(pts1[i] - waveOffset);
            ctx.bezierCurveTo(cx1, cy1, cx2, cy2, xPos(i), yPos(pts1[i] - waveOffset));
        }
        ctx.lineTo(xPos(pts1.length - 1), h); ctx.lineTo(xPos(0), h); ctx.closePath();
        const grad1 = ctx.createLinearGradient(0, 0, 0, h);
        grad1.addColorStop(0, 'rgba(69,132,237,0.25)'); grad1.addColorStop(1, 'rgba(69,132,237,0)');
        ctx.fillStyle = grad1; ctx.fill();

        // Revenue line
        ctx.beginPath();
        ctx.moveTo(xPos(0), yPos(pts1[0] - waveOffset));
        for (let i = 1; i < pts1.length; i++) {
            const cx1 = xPos(i - 0.5), cy1 = yPos(pts1[i - 1] - waveOffset);
            const cx2 = xPos(i - 0.5), cy2 = yPos(pts1[i] - waveOffset);
            ctx.bezierCurveTo(cx1, cy1, cx2, cy2, xPos(i), yPos(pts1[i] - waveOffset));
        }
        ctx.strokeStyle = '#4584ed'; ctx.lineWidth = 2.5; ctx.stroke();

        // Animated dot on latest revenue point
        const dotProgress = (Math.sin(tick * 0.05) + 1) / 2;
        const dotX = xPos(pts1.length - 1);
        const dotY = yPos(pts1[pts1.length - 1] - waveOffset);
        ctx.beginPath(); ctx.arc(dotX, dotY, 4 + dotProgress * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(69,132,237,${0.15 + dotProgress * 0.15})`; ctx.fill();
        ctx.beginPath(); ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#4584ed'; ctx.fill();
        ctx.beginPath(); ctx.arc(dotX, dotY, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.fill();

        // Month labels
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '9px Inter, sans-serif';
        ctx.textAlign = 'center';
        [0, 3, 6, 9, 11].forEach(i => {
            ctx.fillText(liveData.labels[i], xPos(i), h - 5);
        });
    }

    // Live feed ticker
    const feedItems = [
        '⚡ Procurement approval auto-routed — 4 sec',
        '📊 Q3 variance 12% above threshold — Lagos logistics',
        '✅ Board report generated — Finance Dept',
        '🔔 New data source connected — HR System',
        '💡 Copilot insight: Recommend cost review in Ops',
        '🔄 Power Automate flow executed — 847 records',
        '📈 Revenue forecast updated — +18% vs Q2',
        '⚠️ Anomaly detected — Supply Chain delay flagged'
    ];
    let feedIdx = 0;

    function rotateFeed() {
        const el = document.getElementById('dash-feed-text');
        if (!el) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(-8px)';
        setTimeout(() => {
            feedIdx = (feedIdx + 1) % feedItems.length;
            el.textContent = feedItems[feedIdx];
            el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 300);
    }

    // Live number fluctuation
    function fluctuateMetrics() {
        const revenueEl = document.getElementById('dash-revenue');
        if (revenueEl) {
            const val = 17 + Math.floor(Math.random() * 3);
            revenueEl.textContent = `+${val}%`;
        }
        const sourcesEl = document.getElementById('dash-sources');
        if (sourcesEl) {
            const choices = ['12 live', '13 live', '12 live'];
            sourcesEl.textContent = choices[Math.floor(Math.random() * choices.length)];
        }
    }

    // Start animation loop
    function animate() {
        tick++;
        drawChart();
        animFrame = requestAnimationFrame(animate);
    }

    animate();
    setInterval(rotateFeed, 3500);
    setInterval(fluctuateMetrics, 4000);

    // Resize canvas
    function resizeCanvas() {
        const container = canvas.parentElement;
        if (container) {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        }
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

  /* Pain item hover */
  document.querySelectorAll('.pain-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      document.querySelectorAll('.pain-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });
 
  /* ── Custom video player ── */
  const video   = document.getElementById('founderVideo');
  const overlay = document.getElementById('videoOverlay');
 
  function playVid()  { video.play();  overlay.classList.add('playing'); }
  function pauseVid() { video.pause(); overlay.classList.remove('playing'); }
 
  overlay.addEventListener('click', () => video.paused ? playVid() : pauseVid());
  video.addEventListener('ended', () => overlay.classList.remove('playing'));
 
  /* Auto-pause when the problem section scrolls out of view */
  const problemSection = document.getElementById('problem');
  new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting && !video.paused) pauseVid();
    });
  }, { threshold: 0.08 }).observe(problemSection);
 
  /* ── Team expand ── */
  function toggleTeam() {
    const btn    = document.getElementById('teamExpandBtn');
    const row    = document.getElementById('teamSecondaryRow');
    const label  = document.getElementById('expandLabel');
    const count  = document.getElementById('expandCount');
    const extras = document.querySelectorAll('.team-card-small[data-extra="true"]');
    const open   = btn.classList.contains('expanded');
 
    if (!open) {
      extras.forEach((c, i) => { c.classList.remove('hidden'); c.style.animation = `fadeInCard 0.4s ease ${i * 0.08}s both`; });
      row.classList.replace('masked','expanded') || (row.classList.remove('masked'), row.classList.add('expanded'));
      btn.classList.add('expanded');
      label.textContent = 'Showing the Full Crew';
      count.textContent = 'Collapse ↑';
    } else {
      extras.forEach(c => c.classList.add('hidden'));
      row.classList.replace('expanded','masked') || (row.classList.remove('expanded'), row.classList.add('masked'));
      btn.classList.remove('expanded');
      label.textContent = 'Meet the Full Crew';
      count.textContent = '+' + extras.length + ' more';
    }
  }
 
  document.addEventListener('DOMContentLoaded', () => {
    const extras = document.querySelectorAll('.team-card-small[data-extra="true"]');
    const el = document.getElementById('expandCount');
    if (el) el.textContent = '+' + extras.length + ' more';
    if (extras.length === 0) document.getElementById('teamExpandWrap').style.display = 'none';
  });