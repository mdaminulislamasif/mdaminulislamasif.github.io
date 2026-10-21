/* ==========================================================================
   ASIF GK — Interactive Engine & Cyber Shell (app.js)
   Official Portfolio & Cyber Ecosystem
   Architect: ASIF GK | Live: https://mdaminulislamasif.github.io/
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
            } else if (type === 'chord' || type === 'success') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(260, now);
                osc.frequency.exponentialRampToValueAtTime(780, now + 0.25);
                gain.gain.setValueAtTime(0.04, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'click') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.04);
                gain.gain.setValueAtTime(0.03, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
                osc.start(now);
                osc.stop(now + 0.04);
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
    document.querySelectorAll('.cyber-button, .qc-btn, .mini-btn, .svc-option, .addon-checkbox, .filter-tab, .nav-link').forEach(el => {
        el.addEventListener('mouseenter', () => playSound('beep'));
    });

    // -------------------------------------------------------------------------
    // 2. Scroll Progress Bar & Dynamic Latency Indicator
    // -------------------------------------------------------------------------
    const scrollProgressBar = document.getElementById('scrollProgressBar');
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${scrollPct}%`;
        }
    });

    const livePingVal = document.getElementById('livePingVal');
    if (livePingVal) {
        setInterval(() => {
            const simulatedPing = (1.5 + Math.random() * 0.9).toFixed(1);
            livePingVal.textContent = `${simulatedPing}ms`;
        }, 2800);
    }

    // -------------------------------------------------------------------------
    // 3. Futuristic Custom Cursor
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

        document.querySelectorAll('a, button, input, textarea, .svc-option, .addon-checkbox, .system-card, .filter-tab').forEach(el => {
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
    // 4. Cyber Particles & Grid Canvas (Interactive with Mouse Proximity)
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('cyberCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let mousePos = { x: -1000, y: -1000 };
        window.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        });

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 15), 75);

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 0.8,
                color: Math.random() > 0.35 ? 'rgba(0, 240, 255, 0.75)' : 'rgba(255, 208, 0, 0.75)'
            });
        }

        function renderCanvas() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p1 = particles[i];
                p1.x += p1.vx;
                p1.y += p1.vy;

                if (p1.x < 0) p1.x = width;
                if (p1.x > width) p1.x = 0;
                if (p1.y < 0) p1.y = height;
                if (p1.y > height) p1.y = 0;

                // Mouse proximity push
                const dxMouse = p1.x - mousePos.x;
                const dyMouse = p1.y - mousePos.y;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                if (distMouse < 90) {
                    p1.x += (dxMouse / distMouse) * 1.5;
                    p1.y += (dyMouse / distMouse) * 1.5;
                }

                ctx.beginPath();
                ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
                ctx.fillStyle = p1.color;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 125) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.18 * (1 - dist / 125)})`;
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
    // 5. 3D Perspective Tilt on Hover ([data-tilt])
    // -------------------------------------------------------------------------
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // -------------------------------------------------------------------------
    // 6. Interactive System Category Filtering
    // -------------------------------------------------------------------------
    const filterTabs = document.querySelectorAll('.filter-tab');
    const systemCards = document.querySelectorAll('.system-card');

    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            playSound('click');

            const filterValue = tab.getAttribute('data-filter');

            systemCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.96)';
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 20);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------------------
    // 7. Interactive Cyber Shell / Terminal Emulator (Enhanced with Command History)
    // -------------------------------------------------------------------------
    const terminalInput = document.getElementById('terminalInput');
    const terminalBody = document.getElementById('terminalBody');
    const termSendBtn = document.getElementById('termSendBtn');
    const clearTermBtn = document.getElementById('clearTermBtn');

    const commandHistory = [];
    let historyIndex = -1;

    const commands = {
        help: `
<span class="gold">ASIF GK CYBER CORE OPERATIONS:</span>
  • <span class="cyan">about</span>       - Architectural background of ASIF GK
  • <span class="cyan">jarvis</span>      - Details on JARVIS Autonomous AI Core
  • <span class="cyan">cyber</span>       - Offensive & Defensive Security Tools
  • <span class="cyan">isp</span>         - Carrier-grade ISP & BDIX routing blueprints
  • <span class="cyan">projects</span>    - Flagship software and hardware architectures
  • <span class="cyan">skills</span>      - Engineering competencies & stack
  • <span class="cyan">bdix</span>        - Dhaka BDIX peering routing metrics
  • <span class="cyan">status</span>      - Real-time system telemetry and node health
  • <span class="cyan">whoami</span>      - Verify terminal connection session
  • <span class="cyan">quote</span>       - Engineering philosophy
  • <span class="cyan">contact</span>     - Direct verified channels for ASIF GK
  • <span class="cyan">matrix</span>      - Trigger visual matrix cyber data stream
  • <span class="cyan">clear</span>       - Clear current console buffer`,

        about: `
<span class="cyan">[IDENT]</span> <strong>ASIF GK</strong> — Next-Gen AI Architect & Cyber Security Specialist
<span class="green">[LOCATION]</span> Dhaka, Bangladesh 🇧🇩
<span class="gold">[PORTAL]</span> https://mdaminulislamasif.github.io/
<span class="text-secondary">Specialized in autonomous edge AI models, localized LLMs with zero API quotas, 
hardware RF security (Flipper Zero), and MikroTik carrier-grade routing.</span>`,

        jarvis: `
<span class="cyan">[JARVIS NEURAL CORE ACTIVE]</span>
• Version: 3.2.0 Autonomous Local Daemon
• Voice Synthesis: Dual Bengali (বাংলা) & English Engine
• Offline Brain: 16+ Specialized Modular Brains (Zero Cloud Quota)
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

        projects: `
<span class="cyan">[FLAGSHIP REPOSITORIES & SYSTEMS]</span>
1. <strong>JARVIS AI Suite</strong> — Autonomous Bengali/English Desktop AI Core
2. <strong>Cyber Core Watchdog</strong> — Zero-Trust process sentinel & security suite
3. <strong>BDIX High-Speed Router Engine</strong> — MikroTik 10G+ carrier network design
4. <strong>Aether OS Sci-Fi HUD</strong> — Futuristic gesture & holographic desktop UI`,

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
• Packet Loss: 0.00%
• Latency: 1.8ms (Zero jitter)`,

        status: `
<span class="green">[SYSTEM HEALTH: 100% NOMINAL]</span>
• Neural Brains : 16 / 16 ONLINE
• BDIX Gateway  : LINK ACTIVE (10 Gbps)
• Watchdog Guard: 0 Breaches / Active Process Lockdown
• Memory Footprint: Optimized (Low Latency Native Loop)`,

        whoami: `
<span class="cyan">[SESSION]</span> guest@asifgk-terminal // Access Level: Standard Explorer.
Type <span class="highlight-cmd">'contact'</span> to initiate direct encrypted channel.`,

        quote: `
<span class="gold">"Code should be autonomous, resilient, and beautiful. True engineering removes dependencies on external servers and grants absolute sovereignty."</span> — ASIF GK`,

        contact: `
<span class="cyan">[VERIFIED CHANNELS]</span>
• Portal   : https://mdaminulislamasif.github.io/
• WhatsApp : +8801773860372 (Direct Hotline // Instant Response)
• Email    : asifgk.hacker@gmail.com
• GitHub   : https://github.com/mdaminulislamasif
• Base     : Dhaka, Bangladesh 🇧🇩`,

        matrix: `
<span class="green">Initializing Matrix Cyber Stream...</span>
<span class="green">01000001 01010011 01001001 01000110 01000111 01001011</span>
<span class="green">[SYSTEM OVERRIDE SUCCESSFUL: ASIF GK NEURAL CORE ENGAGED]</span>`,

        ad: `
<span class="gold">[1 BILLION PIXELS GAMING AD ENGINE ENGAGED]</span>
• Status: Fullscreen Video & High-Converting Billboard Active
• Slot ID: AW-4236666699-BILLION
• Launching Fullscreen Cinema HUD Window...`,

        sponsor: `
<span class="cyan">[SPONSORED SHOWCASE // ASIF GK NEURAL SYSTEMS]</span>
• Special Deal: 50% Off Autonomous AI Bots & Enterprise ISP Blueprints
• Verified Sponsor: Google Ads Network (423-666-6699)
• Type <span class="highlight-cmd">'ad'</span> to view the Fullscreen 1B Pixels Gaming Stream.`,

        fiverr: `
<span class="green">[OFFICIAL FIVERR PRO FREELANCE PROFILE]</span>
• Profile: https://www.fiverr.com/asifgk203
• Expertise: Custom JARVIS AI Bots, B2B Leads, Web Scraping & Python Automation
• Rating: 5.0 ★ Top-Rated Experience // Fast Delivery
• Orders: Available for Direct Contracts via Fiverr Escrow`
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

        commandHistory.push(rawCmd);
        historyIndex = commandHistory.length;

        playSound('terminal');

        // Echo command
        appendTerminal(`<span class="cyan">asifgk@bd:~$</span> ${escapeHtml(rawCmd)}`);

        if (cmd === 'clear') {
            terminalBody.innerHTML = '';
            appendTerminal(`<span class="cyan">[SYSTEM]</span> Console buffer cleared.`);
            return;
        }

        if (cmd === 'ad' || cmd === 'videoad' || cmd === 'boom') {
            if (typeof openBillionAdModal === 'function') {
                openBillionAdModal();
            }
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
            } else if (e.key === 'ArrowUp') {
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex] || '';
                }
            } else if (e.key === 'ArrowDown') {
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex] || '';
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
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
    // 8. Interactive Service & Project Calculator
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
        const totalBDT = totalUSD * 122; // 1 USD ≈ 122 BDT
        const totalDays = baseDays + addonDays;

        if (estTotalPrice) estTotalPrice.textContent = totalUSD.toLocaleString();
        if (estBdtPrice) estBdtPrice.textContent = totalBDT.toLocaleString();
        if (estTimeline) estTimeline.textContent = `${totalDays} Days`;

        // Update WhatsApp & Email links with prefilled order text
        const orderSummary = `Hi ASIF GK, I configured a project on your Official Portfolio (mdaminulislamasif.github.io):%0A- Core Tier: ${encodeURIComponent(selectedTierName)}%0A- Add-ons: ${encodeURIComponent(selectedAddons.join(', ') || 'None')}%0A- Estimated Budget: $${totalUSD} USD (~ ${totalBDT.toLocaleString()} BDT)%0A- Estimated Timeline: ${totalDays} Days. Let's discuss details!`;

        if (orderWhatsAppBtn) {
            orderWhatsAppBtn.href = `https://wa.me/8801773860372?text=${orderSummary}`;
        }
        if (orderEmailBtn) {
            orderEmailBtn.href = `mailto:asifgk.hacker@gmail.com?subject=Project%20Order%20Specification%20-%20ASIF%20GK%20Portfolio&body=${orderSummary.replace(/%0A/g, '%0D%0A')}`;
        }
    }

    document.querySelectorAll('.svc-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.svc-option').forEach(s => s.classList.remove('selected'));
            opt.classList.add('selected');
            basePrice = parseInt(opt.getAttribute('data-price') || '450', 10);
            baseDays = parseInt(opt.getAttribute('data-days') || '10', 10);
            selectedTierName = opt.querySelector('.svc-title').textContent;
            playSound('click');
            updateEstimator();
        });
    });

    document.querySelectorAll('.addon-input').forEach(chk => {
        chk.addEventListener('change', () => {
            playSound('click');
            updateEstimator();
        });
    });

    updateEstimator();

    // -------------------------------------------------------------------------
    // 9. Language Toggle (English <-> বাংলা)
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
    // 10. Google Ads (423-666-6699) Conversion Helper & Contact Form
    // -------------------------------------------------------------------------
    function trackGoogleAdsConversion(actionName, category) {
        try {
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'conversion', {
                    'send_to': 'AW-4236666699',
                    'event_category': category || 'Engagement',
                    'event_label': actionName,
                    'value': 1.0,
                    'currency': 'USD'
                });
                console.log(`[Google Ads Tracking] Event dispatched: ${actionName}`);
            }
        } catch (e) {
            // Safe fallback
        }
    }

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

            // Trigger Google Ads conversion for Lead
            trackGoogleAdsConversion('Contact Form Submitted', 'Lead');

            // Optional backend transmission
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
                // Static fallback
            });

            setTimeout(() => {
                formFeedback.className = 'form-feedback success';
                formFeedback.classList.remove('hidden');
                formFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Transmission Received, <strong>${escapeHtml(name)}</strong>! ASIF GK has logged your inquiry regarding <strong>${escapeHtml(domain)}</strong>. A verified reply will be dispatched to <strong>${escapeHtml(email)}</strong> (or via WhatsApp: +8801773860372) within 24 hours.`;
                playSound('success');

                contactForm.reset();
                formSubmitBtn.disabled = false;
                formSubmitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Transmit Encrypted Message';
            }, 1000);
        });
    }

    // -------------------------------------------------------------------------
    // 11. Mobile Navigation Hamburger
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
    // 12. Back to Top & Live Clock
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
    // 13. Initial Audio Context Activation & Console Greeting
    // -------------------------------------------------------------------------
    window.addEventListener('click', () => {
        getAudioContext();
    }, { once: true });

    // -------------------------------------------------------------------------
    // 14. Google AdSense Safe Ingest / Activation
    // -------------------------------------------------------------------------
    try {
        if (window.adsbygoogle) {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
    } catch (e) {
        // Ads will render when Google AdSense approves the publisher domain
    }

    // -------------------------------------------------------------------------
    // 15. Google Ads (423-666-6699) Conversion Tracking Event Listeners
    // -------------------------------------------------------------------------

    // Track WhatsApp Direct Inquiries
    document.querySelectorAll('a[href*="wa.me"]').forEach(waBtn => {
        waBtn.addEventListener('click', () => {
            playSound('click');
            trackGoogleAdsConversion('WhatsApp Direct Chat Click', 'Lead');
        });
    });

    // Track TikTok Profile Visits
    document.querySelectorAll('a[href*="tiktok.com"]').forEach(ttBtn => {
        ttBtn.addEventListener('click', () => {
            playSound('click');
            trackGoogleAdsConversion('TikTok Profile Visit', 'Social');
        });
    });

    // Track Email Clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(mailBtn => {
        mailBtn.addEventListener('click', () => {
            playSound('click');
            trackGoogleAdsConversion('Email Inquiry Click', 'Lead');
        });
    });

    // Track Fiverr Profile Visits
    document.querySelectorAll('a[href*="fiverr.com"]').forEach(fvBtn => {
        fvBtn.addEventListener('click', () => {
            playSound('success');
            trackGoogleAdsConversion('Fiverr Profile Visit', 'FreelanceLead');
        });
    });

    // -------------------------------------------------------------------------
    // 16. 1 Billion Pixels Gaming Ad Window & Video Display Engine
    // -------------------------------------------------------------------------
    const billionAdModal = document.getElementById('billionAdModal');
    const billionAdVideo = document.getElementById('billionAdVideo');
    const closeBillionAdBtn = document.getElementById('closeBillionAdBtn');
    const adModalBackdrop = document.getElementById('adModalBackdrop');
    const openBillionAdBtn = document.getElementById('openBillionAdBtn');
    const billboardVideoTrigger = document.getElementById('billboardVideoTrigger');
    const floatingAdLauncher = document.getElementById('floatingAdLauncher');
    const adVideoSoundBtn = document.getElementById('adVideoSoundBtn');
    const adSoundText = document.getElementById('adSoundText');
    const adVideoPlayPauseBtn = document.getElementById('adVideoPlayPauseBtn');
    const adTimer = document.getElementById('adTimer');
    const adCountdown = document.getElementById('adCountdown');
    const earningCount = document.getElementById('earningCount');

    let adCountdownInterval = null;
    let simulatedEarnings = 128450;

    function updateAdaptiveVideos() {
        const isMobile = window.innerWidth <= 768;
        const targetSrc = isMobile ? 'assets/promo_video_mobile.mp4' : 'assets/promo_video.mp4';
        
        if (billionAdVideo && !billionAdVideo.src.includes(targetSrc)) {
            const wasPlaying = !billionAdVideo.paused;
            const curTime = billionAdVideo.currentTime || 0;
            billionAdVideo.src = targetSrc;
            billionAdVideo.currentTime = curTime;
            if (wasPlaying) billionAdVideo.play().catch(() => {});
        }

        const billboardVideo = document.getElementById('billboardPreviewVideo');
        if (billboardVideo && !billboardVideo.src.includes(targetSrc)) {
            billboardVideo.src = targetSrc;
            billboardVideo.play().catch(() => {});
        }
    }

    window.addEventListener('resize', updateAdaptiveVideos);
    updateAdaptiveVideos();

    function openBillionAdModal() {
        if (!billionAdModal) return;
        billionAdModal.classList.add('open');
        billionAdModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        playSound('success');
        trackGoogleAdsConversion('1B Pixels Fullscreen Ad View', 'Impression');

        updateAdaptiveVideos();

        if (billionAdVideo) {
            billionAdVideo.currentTime = 0;
            billionAdVideo.volume = 1.0;
            billionAdVideo.muted = true;
            billionAdVideo.play().catch(() => {});
        }

        // Start 5-second reward countdown
        let secondsLeft = 5;
        if (adTimer) adTimer.textContent = secondsLeft;
        if (adCountdown) adCountdown.innerHTML = `Reward in <strong id="adTimer">${secondsLeft}</strong>s`;

        clearInterval(adCountdownInterval);
        adCountdownInterval = setInterval(() => {
            secondsLeft--;
            const timerEl = document.getElementById('adTimer');
            if (timerEl) timerEl.textContent = Math.max(0, secondsLeft);

            if (secondsLeft <= 0) {
                clearInterval(adCountdownInterval);
                if (adCountdown) {
                    adCountdown.innerHTML = `<span style="color: var(--green); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> REWARD UNLOCKED • BOOM!</span>`;
                }
                playSound('chord');
                trackGoogleAdsConversion('1B Pixels Video Ad Completed', 'Engagement');
            }
        }, 1000);
    }

    function closeBillionAdModal() {
        if (!billionAdModal) return;
        billionAdModal.classList.remove('open');
        billionAdModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        if (billionAdVideo) {
            billionAdVideo.pause();
        }
        clearInterval(adCountdownInterval);
        playSound('beep');
    }

    if (openBillionAdBtn) {
        openBillionAdBtn.addEventListener('click', openBillionAdModal);
    }

    if (billboardVideoTrigger) {
        billboardVideoTrigger.addEventListener('click', openBillionAdModal);
    }

    if (floatingAdLauncher) {
        floatingAdLauncher.addEventListener('click', openBillionAdModal);
    }

    if (closeBillionAdBtn) {
        closeBillionAdBtn.addEventListener('click', closeBillionAdModal);
    }

    if (adModalBackdrop) {
        adModalBackdrop.addEventListener('click', closeBillionAdModal);
    }

    // Escape Key to Close Ad Window
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && billionAdModal && billionAdModal.classList.contains('open')) {
            closeBillionAdModal();
        }
    });

    // Sound toggle on video
    if (adVideoSoundBtn && billionAdVideo) {
        adVideoSoundBtn.addEventListener('click', () => {
            billionAdVideo.muted = !billionAdVideo.muted;
            if (billionAdVideo.muted) {
                adVideoSoundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i> <span id="adSoundText">UNMUTE</span>';
            } else {
                adVideoSoundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span id="adSoundText">MUTE</span>';
            }
            playSound('click');
        });
    }

    // Play/Pause toggle on video
    if (adVideoPlayPauseBtn && billionAdVideo) {
        adVideoPlayPauseBtn.addEventListener('click', () => {
            if (billionAdVideo.paused) {
                billionAdVideo.play();
                adVideoPlayPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i> <span>PAUSE</span>';
            } else {
                billionAdVideo.pause();
                adVideoPlayPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i> <span>PLAY</span>';
            }
            playSound('click');
        });
    }

    // High-CTR Conversion Trackers on Ad Modal
    const adWaBtn = document.getElementById('adWaConversionBtn');
    if (adWaBtn) {
        adWaBtn.addEventListener('click', () => {
            playSound('success');
            trackGoogleAdsConversion('1B Pixels WhatsApp Ad Conversion', 'HighIntentLead');
        });
    }

    const adContactBtn = document.getElementById('adContactConversionBtn');
    if (adContactBtn) {
        adContactBtn.addEventListener('click', () => {
            closeBillionAdModal();
            playSound('click');
            trackGoogleAdsConversion('1B Pixels Contact Ad Conversion', 'HighIntentLead');
        });
    }

    const adTtBtn = document.getElementById('adTikTokConversionBtn');
    if (adTtBtn) {
        adTtBtn.addEventListener('click', () => {
            playSound('click');
            trackGoogleAdsConversion('1B Pixels TikTok Ad Visit', 'Social');
        });
    }

    const billboardDeal = document.getElementById('billboardDealBtn');
    if (billboardDeal) {
        billboardDeal.addEventListener('click', () => {
            playSound('success');
            trackGoogleAdsConversion('Billboard 50% Deal Claimed', 'HighIntentLead');
        });
    }

    // Ticking simulated revenue engine (BOOM earnings indicator)
    if (earningCount) {
        setInterval(() => {
            simulatedEarnings += Math.floor(Math.random() * 25) + 5;
            earningCount.textContent = `৳ ${simulatedEarnings.toLocaleString()}+`;
        }, 3500);
    }

    // Mobile Cyber Gaming Dock Interactions
    const dockAdBtn = document.getElementById('dockAdBtn');
    if (dockAdBtn) {
        dockAdBtn.addEventListener('click', () => {
            openBillionAdModal();
            playSound('success');
        });
    }

    // Mobile Dock Active Item on Scroll
    const dockItems = document.querySelectorAll('.mobile-cyber-dock .dock-item[href]');
    const sections = document.querySelectorAll('section[id], header[id]');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSection = '#' + sec.getAttribute('id');
            }
        });

        dockItems.forEach(item => {
            if (item.getAttribute('href') === currentSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

    // =========================================================================
    // 17. JARVIS Autonomous Neural AI Portfolio Assistant
    // =========================================================================
    const jarvisAiTrigger = document.getElementById('jarvisAiTrigger');
    const jarvisChatModal = document.getElementById('jarvisChatModal');
    const jarvisChatBackdrop = document.getElementById('jarvisChatBackdrop');
    const jarvisCloseBtn = document.getElementById('jarvisCloseBtn');
    const jarvisClearBtn = document.getElementById('jarvisClearBtn');
    const jarvisChatBody = document.getElementById('jarvisChatBody');
    const jarvisChatForm = document.getElementById('jarvisChatForm');
    const jarvisChatInput = document.getElementById('jarvisChatInput');
    const jarvisQuickPrompts = document.getElementById('jarvisQuickPrompts');
    const dockAiBtn = document.getElementById('dockAiBtn');

    function openJarvisModal() {
        if (!jarvisChatModal) return;
        jarvisChatModal.classList.add('open');
        jarvisChatModal.setAttribute('aria-hidden', 'false');
        playSound('beep');
        trackGoogleAdsConversion('JARVIS AI Chat Opened', 'Engagement');
        if (jarvisChatInput) {
            setTimeout(() => jarvisChatInput.focus(), 300);
        }
    }

    function closeJarvisModal() {
        if (!jarvisChatModal) return;
        jarvisChatModal.classList.remove('open');
        jarvisChatModal.setAttribute('aria-hidden', 'true');
        playSound('click');
    }

    if (jarvisAiTrigger) jarvisAiTrigger.addEventListener('click', openJarvisModal);
    if (dockAiBtn) dockAiBtn.addEventListener('click', openJarvisModal);
    if (jarvisCloseBtn) jarvisCloseBtn.addEventListener('click', closeJarvisModal);
    if (jarvisChatBackdrop) jarvisChatBackdrop.addEventListener('click', closeJarvisModal);

    if (jarvisClearBtn) {
        jarvisClearBtn.addEventListener('click', () => {
            if (!jarvisChatBody) return;
            jarvisChatBody.innerHTML = `
                <div class="jarvis-msg ai">
                    <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
                    <div class="msg-bubble">
                        <p>Memory cleared. Neural session re-initialized. How may I assist you, Operator?</p>
                        <span class="msg-time">Neural OS • Ready</span>
                    </div>
                </div>
            `;
            playSound('chord');
        });
    }

    // Knowledge & Response Engine
    function getJarvisResponse(query) {
        const q = query.toLowerCase().trim();

        // 1. Bengali Greetings & Info
        if (q.includes('কেমন') || q.includes('বাংলা') || q.includes('কে আসিফ') || q.includes('কাজ') || q.includes('পরিচিতি') || q.includes('আসিফ জিকে')) {
            return {
                text: `<p>স্বাগতম! আমি <strong>JARVIS AI</strong>, আসিফ জিকে (ASIF GK)-এর পার্সোনাল নিউরাল অ্যাসিস্ট্যান্ট।</p>
                       <p>আসিফ জিকে একজন <strong>AI আর্কিটেক্ট ও সাইবার সিকিউরিটি স্পেশালিস্ট</strong> (ঢাকা, বাংলাদেশ)। তিনি মূলত ৩টি প্রধান ক্ষেত্রে বিশ্বমানের সেবা প্রদান করেন:</p>
                       <ul>
                           <li>🤖 <strong>JARVIS Autonomous AI Bots</strong> এবং কাস্টম পাইথন অটোমেশন।</li>
                           <li>🛡️ <strong>জিরো-ট্রাস্ট সাইবার ডিফেন্স</strong>, ফেস ডিটেকশন ডগ ও নেটওয়ার্ক সিকিউরিটি।</li>
                           <li>🌐 <strong>১০জিবিপিএস BDIX ISP নেটওয়ার্ক</strong> রাউটিং ও ডেটাসেন্টার আর্কিটেকচার।</li>
                       </ul>`,
                actions: [
                    { label: 'Fiverr-এ অর্ডার করুন', url: 'https://www.fiverr.com/asifgk203', class: 'fiverr', icon: 'fa-briefcase' },
                    { label: 'হোয়াটসঅ্যাপে চ্যাট করুন', url: 'https://wa.me/8801773860372?text=Hello%20ASIF%20GK,%20JARVIS%20AI%20directed%20me%20here', class: 'whatsapp', icon: 'fa-brands fa-whatsapp' }
                ]
            };
        }

        // 2. Fiverr / Hire / Pricing / Gigs
        if (q.includes('fiverr') || q.includes('hire') || q.includes('order') || q.includes('gig') || q.includes('cost') || q.includes('price') || q.includes('টাকা') || q.includes('কাজ করাতে চাই')) {
            trackGoogleAdsConversion('JARVIS Fiverr Inquiry', 'HighIntentLead');
            return {
                text: `<p>You can securely hire <strong>ASIF GK</strong> on <strong>Fiverr Pro</strong> via official Escrow protection!</p>
                       <p><strong>Top Available Gigs & Services:</strong></p>
                       <ul>
                           <li>Autonomous AI Agent Development (LangChain, Ollama, Python)</li>
                           <li>B2B Targeted Lead Generation & Automated Data Scraping</li>
                           <li>Cybersecurity Penetration Audits & Server Hardening</li>
                           <li>MikroTik BDIX Bandwidth Shaping & ISP Optimization</li>
                       </ul>
                       <p>Official Fiverr Username: <code>asifgk203</code></p>`,
                actions: [
                    { label: 'Open Fiverr (asifgk203)', url: 'https://www.fiverr.com/asifgk203', class: 'fiverr', icon: 'fa-briefcase' },
                    { label: 'Direct WhatsApp Discussion', url: 'https://wa.me/8801773860372?text=Hi%20ASIF%20GK,%20I%20am%20interested%20in%20hiring%20you%20via%20Fiverr', class: 'whatsapp', icon: 'fa-brands fa-whatsapp' }
                ]
            };
        }

        // 3. 1 Billion Pixels Gaming Billboard / Ad / Video
        if (q.includes('ad') || q.includes('billion') || q.includes('pixel') || q.includes('gaming') || q.includes('video') || q.includes('ভিডিও') || q.includes('বিজ্ঞাপন') || q.includes('boom')) {
            return {
                text: `<p>The <strong>1 Billion Pixels Gaming Ad Window</strong> is our revolutionary interactive gaming display network!</p>
                       <p>It features real-time 4K cyberpunk holographic streaming, dynamic audio spectrum visualizers, and instant conversion hooks linked with Google Ads <code>AW-4236666699</code>.</p>`,
                actions: [
                    { label: 'Launch 1B Pixels Fullscreen Ad', action: 'open_ad', class: 'ad', icon: 'fa-fire' }
                ]
            };
        }

        // 4. Cyber Security / Ethical Hacking / Watchdog
        if (q.includes('cyber') || q.includes('hack') || q.includes('security') || q.includes('flipper') || q.includes('isp') || q.includes('mikrotik') || q.includes('সার্ভার')) {
            return {
                text: `<p>ASIF GK specializes in enterprise-grade <strong>Zero-Trust Cyber Architecture</strong>:</p>
                       <ul>
                           <li><strong>Behavioral Watchdog:</strong> Intrusion detection that locks unverified IPs in under 2ms.</li>
                           <li><strong>Hardware Security:</strong> Flipper Zero RF testing, BadUSB countermeasures, sub-GHz protocol analysis.</li>
                           <li><strong>BDIX Carrier Routing:</strong> 10Gbps load balancing with MikroTik CCR2004 & CCR2116 routers.</li>
                       </ul>`,
                actions: [
                    { label: 'Schedule Security Audit', url: '#contact', class: 'fiverr', icon: 'fa-shield-halved' },
                    { label: 'WhatsApp Cyber Desk', url: 'https://wa.me/8801773860372?text=Hello%20ASIF%20GK,%20I%20need%20a%20Cyber%20Security%20/%20ISP%20consultation', class: 'whatsapp', icon: 'fa-brands fa-whatsapp' }
                ]
            };
        }

        // 5. TikTok / DJ Music / Remix
        if (q.includes('tiktok') || q.includes('টিকটক') || q.includes('dj') || q.includes('song') || q.includes('গান') || q.includes('remix') || q.includes('bass')) {
            return {
                text: `<p>ASIF GK is also a prominent creator on TikTok (<strong>@aminul_2020aj</strong>), producing high-impact 8D Bass-Boosted DJ remixes and cyber audio visualizers!</p>`,
                actions: [
                    { label: 'Watch TikTok (@aminul_2020aj)', url: 'https://www.tiktok.com/@aminul_2020aj', class: 'ad', icon: 'fa-brands fa-tiktok' }
                ]
            };
        }

        // 6. Contact / Phone / Email
        if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('যোগাযোগ') || q.includes('নাম্বার')) {
            return {
                text: `<p>You can directly contact ASIF GK through these official encrypted channels:</p>
                       <ul>
                           <li>📱 <strong>WhatsApp / Mobile:</strong> +880 1773-860372</li>
                           <li>📧 <strong>Admin Email:</strong> asifgk.hacker@gmail.com</li>
                           <li>💼 <strong>Fiverr:</strong> asifgk203</li>
                           <li>📍 <strong>Location:</strong> Dhaka, Bangladesh</li>
                       </ul>`,
                actions: [
                    { label: 'WhatsApp Direct', url: 'https://wa.me/8801773860372', class: 'whatsapp', icon: 'fa-brands fa-whatsapp' },
                    { label: 'Send Email', url: 'mailto:asifgk.hacker@gmail.com', class: 'fiverr', icon: 'fa-envelope' }
                ]
            };
        }

        // Default Intelligent Fallback
        return {
            text: `<p>Directive received: <em>"${escapeHtml(query)}"</em>.</p>
                   <p>I have processed your query through the JARVIS Neural Core. ASIF GK can engineer custom autonomous AI bots, conduct deep penetration tests, optimize your enterprise ISP lines, or collaborate on your next big project.</p>
                   <p>Would you like to speak directly with ASIF or hire him on Fiverr?</p>`,
            actions: [
                { label: 'Hire on Fiverr (asifgk203)', url: 'https://www.fiverr.com/asifgk203', class: 'fiverr', icon: 'fa-briefcase' },
                { label: 'WhatsApp +8801773860372', url: 'https://wa.me/8801773860372', class: 'whatsapp', icon: 'fa-brands fa-whatsapp' }
            ]
        };
    }

    function appendJarvisMessage(sender, content, actions = []) {
        if (!jarvisChatBody) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `jarvis-msg ${sender}`;

        let actionHtml = '';
        if (actions && actions.length > 0) {
            actionHtml = '<div class="chat-action-links">';
            actions.forEach(act => {
                if (act.action === 'open_ad') {
                    actionHtml += `<button class="chat-btn-pill ${act.class}" onclick="document.getElementById('openBillionAdBtn').click()"><i class="fa-solid ${act.icon}"></i> ${act.label}</button>`;
                } else if (act.url) {
                    actionHtml += `<a href="${act.url}" target="_blank" rel="noopener noreferrer" class="chat-btn-pill ${act.class}"><i class="${act.icon}"></i> ${act.label}</a>`;
                }
            });
            actionHtml += '</div>';
        }

        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        msgDiv.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i></div>
            <div class="msg-bubble">
                ${content}
                ${actionHtml}
                <span class="msg-time">${sender === 'user' ? 'Operator' : 'JARVIS Neural OS'} • ${timeStr}</span>
            </div>
        `;

        jarvisChatBody.appendChild(msgDiv);
        jarvisChatBody.scrollTop = jarvisChatBody.scrollHeight;
    }

    function handleJarvisSubmit(queryText) {
        if (!queryText || !queryText.trim()) return;
        const cleanQuery = queryText.trim();
        appendJarvisMessage('user', `<p>${escapeHtml(cleanQuery)}</p>`);
        if (jarvisChatInput) jarvisChatInput.value = '';
        playSound('beep');

        // Typing simulation
        const typingId = 'typing_' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'jarvis-msg ai';
        typingDiv.id = typingId;
        typingDiv.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-bubble"><p><i class="fa-solid fa-spinner fa-spin"></i> <em>JARVIS is analyzing neural vectors...</em></p></div>
        `;
        jarvisChatBody.appendChild(typingDiv);
        jarvisChatBody.scrollTop = jarvisChatBody.scrollHeight;

        setTimeout(() => {
            const el = document.getElementById(typingId);
            if (el) el.remove();

            const res = getJarvisResponse(cleanQuery);
            appendJarvisMessage('ai', res.text, res.actions);
            playSound('chord');
        }, 650);
    }

    if (jarvisChatForm) {
        jarvisChatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (jarvisChatInput) handleJarvisSubmit(jarvisChatInput.value);
        });
    }

    if (jarvisQuickPrompts) {
        jarvisQuickPrompts.addEventListener('click', (e) => {
            const chip = e.target.closest('.quick-chip');
            if (chip && chip.dataset.query) {
                handleJarvisSubmit(chip.dataset.query);
            }
        });
    }

    console.log("%c ASIF GK %c Official Cyber Portfolio // Architect: ASIF GK ", 
        "background: #00f0ff; color: #000; font-weight: bold; padding: 4px 8px; border-radius: 4px;",
        "background: #0a0e17; color: #ffd000; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
});
