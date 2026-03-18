document.addEventListener('DOMContentLoaded', () => {

    // ── Cookie Consent Banner ──
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieAccept = document.getElementById('cookieAccept');
    const cookieDecline = document.getElementById('cookieDecline');

    const COOKIE_KEY = 'ts_cookie_consent';

    function dismissBanner() {
        cookieBanner?.classList.remove('show');
        setTimeout(() => {
            cookieBanner && (cookieBanner.style.display = 'none');
        }, 600);
    }

    if (cookieBanner && !localStorage.getItem(COOKIE_KEY)) {
        // Show after 2 seconds
        setTimeout(() => cookieBanner.classList.add('show'), 2000);
    }

    cookieAccept?.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'accepted');
        dismissBanner();
    });

    cookieDecline?.addEventListener('click', () => {
        localStorage.setItem(COOKIE_KEY, 'essential');
        dismissBanner();
    });

    // ── Scroll reveals ──
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) entry.target.classList.add('visible');
            });
        }, { threshold: 0.1 });
        reveals.forEach((el) => observer.observe(el));
    }

    // ── Sticky CTA ──
    const stickyCta = document.getElementById('stickyCta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            stickyCta.classList.toggle('show', window.scrollY > 600);
        });
    }

    // ── Nav scroll styling ──
    const nav = document.getElementById('mainNav');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 20);
        });
    }

    // ── Coming Soon links ──
    document.querySelectorAll('.coming-soon-link').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('comingSoon')?.classList.add('active');
        });
    });

    // ── Exec chart bars ──
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

    window.addEventListener('resize', () => {
        if (window.innerWidth > 960) closeMobileMenu();
    });

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

    // ── Slider duplications ──
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

    // ── Privacy notice dismiss ──
    const privacyNotice = document.getElementById('chatPrivacyNotice');
    const privacyDismiss = document.getElementById('privacyDismiss');

    if (privacyDismiss && privacyNotice) {
        privacyDismiss.addEventListener('click', (e) => {
            e.stopPropagation();
            privacyNotice.style.transition = 'opacity 0.25s ease, max-height 0.32s ease, padding 0.32s ease, border 0.32s ease';
            privacyNotice.style.overflow = 'hidden';
            privacyNotice.style.maxHeight = privacyNotice.offsetHeight + 'px';
            // Force reflow so transition fires
            privacyNotice.getBoundingClientRect();
            privacyNotice.style.opacity = '0';
            privacyNotice.style.maxHeight = '0';
            privacyNotice.style.paddingTop = '0';
            privacyNotice.style.paddingBottom = '0';
            privacyNotice.style.borderTopWidth = '0';
            setTimeout(() => { privacyNotice.style.display = 'none'; }, 340);
        });
    }

    // Intent-based smart replies for Robina
    const robinaBrain = [
        {
            keywords: ['how', 'work', 'process', 'methodology', 'approach'],
            reply: "Great question! 🤖 I work in two layers: first, we deploy **agentic AI workflows** that automate your operations — procurement, HR, field reporting — running 24/7. Then we pipe all that clean data into a **live executive dashboard** so your leadership sees everything in real time. All on Microsoft tools you already own!"
        },
        {
            keywords: ['sector', 'who', 'industry', 'government', 'ngo', 'private'],
            reply: "We're built for three sectors across Africa 🌍:\n• **Government MDAs** — digital governance, budget reporting, audit-readiness\n• **International NGOs** — donor reporting, grant tracking, beneficiary data\n• **Private Sector** — C-Suite dashboards, month-end automation, field sales reporting\n\nWhich one fits your organisation?"
        },
        {
            keywords: ['time', 'timeline', 'quick', 'fast', 'weeks', 'live', 'long'],
            reply: "We move fast ⚡ — here's the typical journey:\n• **Weeks 1–2:** Discovery & process mapping\n• **Weeks 3–6:** Agent deployment (your first automations go live!)\n• **Weeks 7–10:** Executive dashboard connected\n\nFrom zero to live intelligence in **10 weeks**. No new software needed."
        },
        {
            keywords: ['price', 'cost', 'pricing', 'fee', 'charge', 'expensive', 'afford'],
            reply: "Our model is designed so you **don't buy new software** — we build on the Microsoft 365, Azure, and Power Platform licences you already pay for. 💡\n\nPricing depends on the scope of your transformation. The best next step is a **free 45-min discovery call** where we'll map your bottlenecks and give you a clear picture of what's possible. Want me to help you book one?"
        },
        {
            keywords: ['book', 'call', 'discovery', 'meeting', 'schedule', 'consult', 'appointment'],
            reply: "Absolutely! 📅 A discovery call is completely free — 45 minutes, no sales pitch, just clarity on what's possible for your organisation.\n\nJust scroll down to the **'Start Here'** section or click below and drop your email — our team will reach out within 24 hours. Want me to scroll you there?"
        },
        {
            keywords: ['microsoft', 'power bi', 'copilot', 'azure', 'fabric', 'teams', 'automate', '365'],
            reply: "We're a certified Microsoft solutions partner 🔵 and we build across the full stack:\n• **Power BI** — live executive dashboards\n• **Power Automate + Copilot Studio** — intelligent workflow agents\n• **Microsoft Fabric + Azure Data** — enterprise data infrastructure\n• **M365 Copilot** — plain-English querying of your data\n\nAll inside your existing Microsoft environment — secured and compliant."
        },
        {
            keywords: ['agent', 'agentic', 'automation', 'workflow', 'ai', 'intelligent'],
            reply: "This is where I get excited! 🤩 Our **agentic AI** approach means we don't just build static dashboards — we deploy agents that *act*:\n\n→ Automatically route procurement approvals\n→ Collect field data without manual entry\n→ Generate board reports before leadership even asks\n→ Flag anomalies and escalate in real time\n\nThink of it as hiring a tireless digital operations team that never sleeps."
        },
        {
            keywords: ['africa', 'nigeria', 'kenya', 'ghana', 'lagos', 'abuja', 'nairobi'],
            reply: "We're proudly Made in Nigeria 🇳🇬 and operating across Africa! Our solutions are designed for the realities of African organisations — fragmented data, multi-system environments, WhatsApp-heavy workflows, and the pressure to deliver world-class results with limited resources.\n\nWe understand the context. That's our edge."
        },
        {
            keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'howdy', 'hiya'],
            reply: "Hey there! 😊 So glad you stopped by. I'm Robina — I'm here to help you understand how TechSpecialist can transform your organisation's data into a live intelligence system.\n\nWhat's on your mind? Feel free to ask me anything — no question is too basic!"
        },
        {
            keywords: ['thank', 'thanks', 'great', 'amazing', 'helpful', 'perfect', 'awesome'],
            reply: "You're very welcome! 😄 That's what I'm here for. Is there anything else you'd like to explore? I can walk you through how we'd approach your specific sector, the tech stack we use, or help you book that free discovery call!"
        }
    ];

    const defaultReplies = [
        "That's a great question! 🤔 I want to make sure I give you the best answer. Could you tell me a bit more about your organisation — the sector you're in and the challenges you're facing? That way I can point you to exactly the right solution.",
        "Ooh, I love a curious mind! 😄 I'm still learning everything, but I can tell you that TechSpecialist has helped dozens of African organisations go from data chaos to clarity in just 10 weeks. What aspect interests you most?",
        "Interesting! Let me think about that... 🤖 What I can tell you is that our approach is built around your Microsoft environment — no new tools, no disruption. Just intelligence layered on top of what you already own. Want me to walk you through how it works?",
        "Great to hear from you! Here's what I'd suggest — the fastest way to see what's possible for your organisation is a **free 45-minute discovery call**. Our team will map your top 3 bottlenecks and show you exactly what we can automate. No obligation at all!"
    ];

    function getSmartReply(message) {
        const lower = message.toLowerCase();
        for (const item of robinaBrain) {
            if (item.keywords.some(k => lower.includes(k))) {
                return item.reply;
            }
        }
        return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
    }

    // Format **bold** markdown in replies
    function formatMessage(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n→/g, '<br>→')
            .replace(/\n•/g, '<br>•')
            .replace(/\n/g, '<br>');
    }

    const miniAvatarSVG = `<svg width="16" height="16" viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="38" r="28" fill="#d4895a"/>
        <path d="M14 30 C14 10 66 10 66 30Z" fill="#1a0a00"/>
        <circle cx="31" cy="37" r="2.8" fill="#2d1a00"/>
        <circle cx="49" cy="37" r="2.8" fill="#2d1a00"/>
        <path d="M33 47 Q40 53 47 47" stroke="#c97a5a" stroke-width="2" stroke-linecap="round" fill="none"/>
        <path d="M20 68 Q40 60 60 68 Q58 80 22 80Z" fill="#4584ED"/>
    </svg>`;

    function appendMessage(text, isUser) {
        if (!chatbotMsgs) return;
        const msg = document.createElement('div');
        msg.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
        if (!isUser) {
            msg.innerHTML = `<div class="chat-msg-avatar">${miniAvatarSVG}</div><div class="chat-bubble">${formatMessage(text)}</div>`;
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
        el.innerHTML = `<div class="chat-msg-avatar">${miniAvatarSVG}</div>
            <div class="chat-bubble" style="display:flex;gap:4px;align-items:center;padding:12px 14px;">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
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
        // Slight delay variance for realism
        const delay = 700 + Math.random() * 600;
        setTimeout(() => {
            typing?.remove();
            appendMessage(reply, false);
        }, delay);
    }

    function handleSend() {
        const msg = chatbotInput?.value.trim();
        if (!msg) return;
        chatbotInput.value = '';
        sendMessage(msg);
    }

    // Exposed globally for inline suggestion buttons
    window.sendSuggestion = function (btn, text) {
        btn.disabled = true;
        sendMessage(text);
    };

    function openChat() {
        chatbotWindow?.classList.add('open');
        // Remove pulse once opened
        document.querySelector('.chatbot-toggle-pulse')?.remove();
        setTimeout(() => chatbotInput?.focus(), 100);
    }

    function closeChat() {
        chatbotWindow?.classList.remove('open');
    }

    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            chatbotWindow?.classList.contains('open') ? closeChat() : openChat();
        });
    }

    if (chatbotClose) chatbotClose.addEventListener('click', (e) => { e.stopPropagation(); closeChat(); });
    if (chatbotSend) chatbotSend.addEventListener('click', handleSend);
    if (chatbotInput) {
        chatbotInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); handleSend(); }
        });
    }

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        const widget = document.getElementById('chatbotWidget');
        if (widget && chatbotWindow?.classList.contains('open') && !widget.contains(e.target)) {
            closeChat();
        }
    });

});

// ── Typing dot styles ──
(function () {
    const s = document.createElement('style');
    s.textContent = `
        .typing-dot {
            display: inline-block;
            width: 7px; height: 7px;
            border-radius: 50%;
            background: #9ca3af;
            animation: robinaTyping 1.2s ease-in-out infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes robinaTyping {
            0%, 100% { opacity: 0.3; transform: translateY(0); }
            50%       { opacity: 1;   transform: translateY(-4px); }
        }
    `;
    document.head.appendChild(s);
})();