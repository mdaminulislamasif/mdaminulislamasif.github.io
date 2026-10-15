/* ==========================================================================
   ASIFGKBD.COM — Interactive Engine & Cyber Shell (app.js)
   Engineered for ASIF GK (JARVIS AI Architect)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // -------------------------------------------------------------------------
    // 1. Audio Synthesizer (Web Audio API - Pure native zero-dependency audio)
    // -------------------------------------------------------------------------
    let sfxEnabled = true;
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    function playSound(type) {
        if (!sfxEnabled) return;
        try {
            const ctx = getAudioContext();
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            if (type === 'beep') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                osc.start(now);
                osc.stop(now + 0.08);
            } else if (type === 'terminal') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(520, now);
                osc.frequency.setValueAtTime(1040, now + 0.04);
                gain.gain.setValueAtTime(0.06, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            } else if (type === 'chord') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(660, now + 0.25);
                gain.gain.setValueAtTime(0.03, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            }
        } catch (e) {
            // Audio policy fallback
        }
    }

    const sfxToggleBtn = document.getElementById('sfxToggleBtn');
    const sfxStatus = document.getElementById('sfxStatus');

    if (sfxToggleBtn) {
        sfxToggleBtn.addEventListener('click', () => {
            sfxEnabled = !sfxEnabled;
            sfxStatus.textContent = sfxEnabled ? 'ON' : 'OFF';
            sfxToggleBtn.style.color = sfxEnabled ? 'var(--cyan)' : 'var(--text-muted)';
            if (sfxEnabled) playSound('beep');
        });
    }

    // Attach click beeps to interactive buttons
    document.querySelectorAll('.cyber-button, .qc-btn, .mini-btn, .svc-option, .addon-checkbox').forEach(el => {
        el.addEventListener('mouseenter', () => playSound('beep'));
    });

    // -------------------------------------------------------------------------
    // 2. Futuristic Custom Cursor
    // -------------------------------------------------------------------------
    const cursor = document.getElementById('customCursor');
    const cursorDot = document.getElementById('customCursorDot');

    if (cursor && cursorDot && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.18;
            cursorY += (mouseY - cursorY) * 0.18;
            cursor.style.left = `${cursorX}px`;
            cursor.style.top = `${cursorY}px`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        document.querySelectorAll('a, button, input, textarea, .svc-option, .addon-checkbox').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.6)';
                cursor.style.borderColor = 'var(--gold)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.borderColor = 'var(--cyan)';
            });
        });
    }

    // -------------------------------------------------------------------------
    // 3. Cyber Particles & Grid Canvas
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('cyberCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 16), 70);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 1.8 + 0.8,
                color: Math.random() > 0.3 ? 'rgba(0, 240, 255, 0.7)' : 'rgba(255, 208, 0, 0.7)'
            });
        }

        function renderCanvas() {
            ctx.clearRect(0, 0, width, height);

            // Connect lines between nearby particles
            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.x += p1.vx;
                p1.y += p1.vy;

                if (p1.x < 0) p1.x = width;
                if (p1.x > width) p1.x = 0;
                if (p1.y < 0) p1.y = height;
                if (p1.y > height) p1.y = 0;

                ctx.beginPath();
                ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
                ctx.fillStyle = p1.color;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.18 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(renderCanvas);
        }
        renderCanvas();
    }

    // -------------------------------------------------------------------------
    // 4. Interactive Cyber Shell / Terminal Emulator
    // -------------------------------------------------------------------------
    const terminalInput = document.getElementById('terminalInput');
    const terminalBody = document.getElementById('terminalBody');
    const termSendBtn = document.getElementById('termSendBtn');
    const clearTermBtn = document.getElementById('clearTermBtn');

    const commands = {
        help: `
<span class="gold">ASIFGKBD.COM SYSTEM COMMANDS:</span>
  • <span class="cyan">about</span>       - Architectural background of ASIF GK
  • <span class="cyan">jarvis</span>      - Details on JARVIS Autonomous AI Core
  • <span class="cyan">cyber</span>       - Offensive & Defensive Security Tools
  • <span class="cyan">isp</span>         - Carrier-grade ISP & BDIX routing blueprints
  • <span class="cyan">skills</span>      - Engineering competencies & stack
  • <span class="cyan">bdix</span>        - Dhaka BDIX peering routing metrics
  • <span class="cyan">contact</span>     - Direct verified channels for ASIF GK
  • <span class="cyan">matrix</span>      - Trigger visual matrix data stream
  • <span class="cyan">clear</span>       - Clear current console buffer`,

        about: `
<span class="cyan">[IDENT]</span> <strong>ASIF GK</strong> — Next-Gen AI Architect & Cyber Security Specialist
<span class="green">[LOCATION]</span> Dhaka, Bangladesh (BD)
<span class="gold">[PORTAL]</span> ASIFGKBD.COM
<span class="text-secondary">Specialized in autonomous edge AI models, localized LLMs with zero API quotas, 
hardware RF security (Flipper Zero), and MikroTik carrier-grade routing.</span>`,

        jarvis: `
<span class="cyan">[JARVIS NEURAL CORE ACTIVE]</span>
• Version: 2.6.4 Autonomous Local Daemon
• Voice Synthesis: Dual Bengali (বাংলা) & English Engine
• Offline Brain: 16+ Specialized Modular Brains
• 3D Telemetry: Real-time holographic HUD + Face visualizer
• Web Learner: Autonomous Infinite-Tab Research Harvester`,

        cyber: `
<span class="red">[CYBER WATCHDOG STATUS: ARMED]</span>
• Behavioral Kernel Anomaly Watchdog (0-Day Defense)
• Flipper Zero Sub-GHz, BadUSB & RFID Attack Library
• Automated Memory Forensics & Process Neutralizer
• Zero-Trust Network Auditing for Financial & ISP Nodes`,

        isp: `
<span class="gold">[ISP ARCHITECTURE BLUEPRINT]</span>
• BDIX Latency: < 2ms (Optimized BGP Peering)
• MikroTik CCR & Cloud Core Carrier Configurations
• Bandwidth Shaper & Radius Auto-Billing integration
• Redundant Multi-WAN Border Gateway Failover`,

        skills: `
<span class="cyan">[TECH RADAR MATRIX]</span>
• Python / PyTorch / AI Agents : 98%
• Cyber Defense & Ethical Pen-Test: 95%
• MikroTik BGP / ISP Backbone  : 96%
• Full-Stack Web & WebSockets  : 92%
• Windows Low-Level API Hooking: 90%
• Bengali NLU & Acoustic Models: 97%`,

        bdix: `
<span class="green">[BDIX CONNECTION METRICS]</span>
• Gateway Node: Dhaka Core IXP-1
• Throughput Capacity: 10 Gbps Aggregated
• Peering Status: ESTABLISHED (Prefixes: 4,820 active)
• Packet Loss: 0.00%`,

        contact: `
<span class="cyan">[VERIFIED CHANNELS]</span>
• Domain   : https://asifgkbd.com
• WhatsApp : +8801773860372 (Direct Hotline)
• Email    : asifgk.hacker@gmail.com
• GitHub   : https://github.com/mdaminulislamasif
• Base     : Dhaka, Bangladesh`,

        matrix: `
<span class="green">Initializing Matrix Cyber Stream...</span>
<span class="green">01000001 01010011 01001001 01000110 01000111 01001011</span>
<span class="green">[SYSTEM OVERRIDE SUCCESSFUL: ASIFGKBD CORE ENGAGED]</span>`
    };

    function appendTerminal(lineHtml) {
        if (!terminalBody) return;
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = lineHtml;
        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function executeCommand(rawCmd) {
        const cmd = rawCmd.trim().toLowerCase();
        if (!cmd) return;

        playSound('terminal');

        // Echo command
        appendTerminal(`<span class="cyan">asifgk@bd:~$</span> ${escapeHtml(rawCmd)}`);

        if (cmd === 'clear') {
            terminalBody.innerHTML = '';
            appendTerminal(`<span class="cyan">[SYSTEM]</span> Console buffer cleared.`);
            return;
        }

        if (commands[cmd]) {
            appendTerminal(commands[cmd]);
        } else {
            appendTerminal(`<span class="red">Command not recognized: '${escapeHtml(cmd)}'.</span> Type <span class="highlight-cmd">'help'</span> for operations.`);
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.innerText = text;
        return div.innerHTML;
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = terminalInput.value;
                terminalInput.value = '';
                executeCommand(val);
            }
        });
    }

    if (termSendBtn && terminalInput) {
        termSendBtn.addEventListener('click', () => {
            const val = terminalInput.value;
            terminalInput.value = '';
            executeCommand(val);
        });
    }

    if (clearTermBtn && terminalBody) {
        clearTermBtn.addEventListener('click', () => {
            terminalBody.innerHTML = '';
            appendTerminal(`<span class="cyan">[SYSTEM]</span> Console cleared.`);
            playSound('beep');
        });
    }

    // Quick Command Buttons
    document.querySelectorAll('.qc-btn, .qc-cmd').forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            if (cmd) executeCommand(cmd);
        });
    });

    // -------------------------------------------------------------------------
    // 5. Interactive Service & Project Calculator
    // -------------------------------------------------------------------------
    const estTotalPrice = document.getElementById('estTotalPrice');
    const estBdtPrice = document.getElementById('estBdtPrice');
    const estTimeline = document.getElementById('estTimeline');
    const orderWhatsAppBtn = document.getElementById('orderWhatsAppBtn');
    const orderEmailBtn = document.getElementById('orderEmailBtn');

    let basePrice = 450;
    let baseDays = 10;
    let selectedTierName = "Autonomous AI Bot / Agent";

    function updateEstimator() {
        let addonPrice = 0;
        let addonDays = 0;
        const selectedAddons = [];

        document.querySelectorAll('.addon-input:checked').forEach(addon => {
            addonPrice += parseInt(addon.getAttribute('data-price') || '0', 10);
            addonDays += parseInt(addon.getAttribute('data-days') || '0', 10);
            const labelText = addon.closest('label').querySelector('.addon-text').textContent;
            selectedAddons.push(labelText.split('(+')[0].trim());
        });

        const totalUSD = basePrice + addonPrice;
        const totalBDT = totalUSD * 120; // 1 USD ≈ 120 BDT
        const totalDays = baseDays + addonDays;

        if (estTotalPrice) estTotalPrice.textContent = totalUSD.toLocaleString();
        if (estBdtPrice) estBdtPrice.textContent = totalBDT.toLocaleString();
        if (estTimeline) estTimeline.textContent = `${totalDays} Days`;

        // Update WhatsApp & Email links with prefilled order text
        const orderSummary = `Hi ASIF GK, I configured a project on ASIFGKBD.com:%0A- Core Tier: ${encodeURIComponent(selectedTierName)}%0A- Add-ons: ${encodeURIComponent(selectedAddons.join(', ') || 'None')}%0A- Estimated Budget: $${totalUSD} USD (~ ${totalBDT.toLocaleString()} BDT)%0A- Estimated Timeline: ${totalDays} Days. Let's discuss details!`;

        if (orderWhatsAppBtn) {
            orderWhatsAppBtn.href = `https://wa.me/8801773860372?text=${orderSummary}`;
        }
        if (orderEmailBtn) {
            orderEmailBtn.href = `mailto:asifgk.hacker@gmail.com?subject=Project%20Order%20Specification%20-%20ASIFGKBD.com&body=${orderSummary.replace(/%0A/g, '%0D%0A')}`;
        }
    }

    document.querySelectorAll('.svc-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.svc-option').forEach(s => s.classList.remove('selected'));
            opt.classList.add('selected');
            basePrice = parseInt(opt.getAttribute('data-price') || '450', 10);
            baseDays = parseInt(opt.getAttribute('data-days') || '10', 10);
            selectedTierName = opt.querySelector('.svc-title').textContent;
            playSound('beep');
            updateEstimator();
        });
    });

    document.querySelectorAll('.addon-input').forEach(chk => {
        chk.addEventListener('change', () => {
            playSound('beep');
            updateEstimator();
        });
    });

    updateEstimator();

    // -------------------------------------------------------------------------
    // 6. Language Toggle (English <-> বাংলা)
    // -------------------------------------------------------------------------
    let currentLang = 'en';
    const langToggleBtn = document.getElementById('langToggleBtn');
    const currentLangText = document.getElementById('currentLang');

    if (langToggleBtn && currentLangText) {
        langToggleBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'bn' : 'en';
            currentLangText.textContent = currentLang === 'en' ? 'বাংলা' : 'English';
            playSound('beep');

            document.querySelectorAll('[data-en][data-bn]').forEach(el => {
                const targetText = el.getAttribute(`data-${currentLang}`);
                if (targetText) {
                    el.textContent = targetText;
                }
            });
        });
    }

    // -------------------------------------------------------------------------
    // 7. Encrypted Dispatch Contact Form
    // -------------------------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const formSubmitBtn = document.getElementById('formSubmitBtn');

    if (contactForm && formFeedback && formSubmitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('senderName').value;
            const email = document.getElementById('senderEmail').value;
            const domain = document.getElementById('projectDomain').value;
            const msg = document.getElementById('senderMsg').value;

            formSubmitBtn.disabled = true;
            formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Encrypting & Transmitting...';
            playSound('terminal');

            // Transmit to backend server if active
            const payload = {
                name: name,
                email: email,
                domain: domain,
                message: msg,
                timestamp: new Date().toISOString()
            };

            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }).catch(() => {
                // Standalone static fallback
            });

            setTimeout(() => {
                formFeedback.className = 'form-feedback success';
                formFeedback.classList.remove('hidden');
                formFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Transmission Received, <strong>${escapeHtml(name)}</strong>! ASIF GK has received your dispatch regarding <strong>${escapeHtml(domain)}</strong>. A verified reply will be dispatched to <strong>${escapeHtml(email)}</strong> (or via WhatsApp: +8801773860372) within 24 hours.`;
                playSound('chord');

                contactForm.reset();
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Transmit Encrypted Message';
            }, 1200);
        });
    }

    // -------------------------------------------------------------------------
    // 8. Mobile Navigation Hamburger
    // -------------------------------------------------------------------------
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            playSound('beep');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }

    // -------------------------------------------------------------------------
    // 9. Back to Top & Live Clock
    // -------------------------------------------------------------------------
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            playSound('beep');
        });
    }

    const liveUtcClock = document.getElementById('liveUtcClock');
    if (liveUtcClock) {
        function updateClock() {
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0];
            const timeStr = now.toTimeString().split(' ')[0];
            liveUtcClock.textContent = `${dateStr} ${timeStr} (BST/UTC+6)`;
        }
        updateClock();
        setInterval(updateClock, 1000);
    }

    // -------------------------------------------------------------------------
    // 10. Initial Startup Sound & Console Greeting
    // -------------------------------------------------------------------------
    window.addEventListener('click', () => {
        getAudioContext();
    }, { once: true });

    console.log("%c ASIFGKBD.COM %c Official Cyber Portal // Architect: ASIF GK ", 
        "background: #00f0ff; color: #000; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
        "background: #0a0e17; color: #ffd000; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
});
