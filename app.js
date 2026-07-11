/* ==========================================================================
   INTERACTIVE PORTFOLIO LOGIC - ARUNA DEVI C
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initParticleBackground();
    initTypistEffect();
    initPatentSchematic();
    initInteractiveAdmissionPortal();
    initInteractiveNormalizer();
    initScrollReveal();
    initContactFormAndClipboard();
    initMobileNavigation();
});

/* ==========================================================================
   1. CUSTOM CURSOR TRAILING SYSTEM
   ========================================================================== */
function initCustomCursor() {
    const cursorDot = document.getElementById('custom-cursor');
    const cursorRing = document.getElementById('custom-cursor-ring');
    
    if (!cursorDot || !cursorRing) return;

    let mouseX = -100;
    let mouseY = -100;
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth interpolation (lerp) for the cursor trailing effect
    function animateCursor() {
        // Dot tracking (almost instantaneous)
        dotX += (mouseX - dotX) * 0.3;
        dotY += (mouseY - dotY) * 0.3;
        cursorDot.style.left = `${dotX}px`;
        cursorDot.style.top = `${dotY}px`;

        // Ring tracking (slower lag for elastic feel)
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Elements that trigger cursor expand state
    const interactiveSelectors = 'a, button, .copy-btn, .visit-btn, .hotspot, select, input, textarea, .timeline-item';
    
    document.body.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactiveSelectors)) {
            document.body.classList.add('hover-interactive');
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        if (!e.target.closest(interactiveSelectors)) {
            document.body.classList.remove('hover-interactive');
        }
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = 0;
        cursorRing.style.opacity = 0;
    });

    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = 1;
        cursorRing.style.opacity = 1;
    });
}

/* ==========================================================================
   2. HTML5 CANVAS PARTICLE SYSTEM (Interactive IT Node connections)
   ========================================================================== */
function initParticleBackground() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 140 };

    // Set dimensions
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 1;
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`;
            ctx.fill();
        }

        update() {
            // Collision detection with canvas edges
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

            this.x += this.vx;
            this.y += this.vy;

            // Interactive response to mouse proximity (attract/connect)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    // Pull nodes slightly towards cursor
                    this.x += dx * 0.01;
                    this.y += dy * 0.01;
                }
            }
        }
    }

    function initParticles() {
        particles = [];
        // Adjust node count dynamically based on width (performance considerations)
        const nodeDensity = Math.floor((canvas.width * canvas.height) / 18000);
        const maxNodes = Math.min(nodeDensity, 85);
        for (let i = 0; i < maxNodes; i++) {
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            particles.push(new Particle(x, y));
        }
    }

    function connectParticles() {
        const joinDistance = 110;
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < joinDistance) {
                    // Line transparency gets stronger as particles get closer
                    let opacity = (1 - (distance / joinDistance)) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.strokeStyle = `rgba(79, 172, 254, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Connect node lines to cursor itself
    function connectCursor() {
        if (mouse.x === null || mouse.y === null) return;
        
        const cursorJoinDistance = 150;
        for (let i = 0; i < particles.length; i++) {
            let dx = particles[i].x - mouse.x;
            let dy = particles[i].y - mouse.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < cursorJoinDistance) {
                let opacity = (1 - (distance / cursorJoinDistance)) * 0.15;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        connectParticles();
        connectCursor();
        
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
}

/* ==========================================================================
   3. TYPIST AUTO-TEXT ANIMATION (Hero Titles)
   ========================================================================== */
function initTypistEffect() {
    const ticker = document.getElementById('ticker-text');
    if (!ticker) return;

    const phrases = [
        "Web Developer",
        "IT Student",
        "Patent Holder",
        "UI/UX Designer",
        "Problem Solver"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            ticker.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // deleting is faster
        } else {
            ticker.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120; // normal typing speed
        }

        // Handle typing logic sequences
        if (!isDeleting && charIndex === currentPhrase.length) {
            // Full phrase displayed, wait before deletion
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            // Deletion completed, move to next phrase
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    // Start typewriter sequence
    setTimeout(type, 1000);
}

/* ==========================================================================
   4. SMART HELMET HOTSPOTS INTERACTION
   ========================================================================== */
function initPatentSchematic() {
    const hotspots = document.querySelectorAll('.hotspot');
    const features = document.querySelectorAll('.feature-item');
    
    if (hotspots.length === 0 || features.length === 0) return;

    function activateSpot(spotNum) {
        // Remove active class from features and highlights from hotspots
        features.forEach(f => f.classList.remove('active'));
        hotspots.forEach(h => h.classList.remove('highlighted'));
        
        // Add active/highlighted to targets
        const targetFeature = document.getElementById(`feature-spot-${spotNum}`);
        if (targetFeature) targetFeature.classList.add('active');
        
        const targetHotspot = document.getElementById(`hotspot-${spotNum}`);
        if (targetHotspot) targetHotspot.classList.add('highlighted');
    }

    hotspots.forEach(hotspot => {
        const spotNumber = hotspot.getAttribute('data-spot');
        
        // Trigger action on hover or click
        hotspot.addEventListener('mouseenter', () => {
            activateSpot(spotNumber);
        });

        hotspot.addEventListener('click', () => {
            activateSpot(spotNumber);
        });
    });

    features.forEach(feature => {
        const spotNumber = feature.getAttribute('data-spot');
        
        feature.addEventListener('mouseenter', () => {
            activateSpot(spotNumber);
        });
    });
}

/* ==========================================================================
   5. PRE-SCREEN APPLICATION FORM (Live Interactive Demo)
   ========================================================================== */
function initInteractiveAdmissionPortal() {
    const form = document.getElementById('portal-demo-form');
    if (!form) return;

    const nameInput = document.getElementById('p-name');
    const emailInput = document.getElementById('p-email');
    const deptSelect = document.getElementById('p-dept');
    const marksInput = document.getElementById('p-marks');
    
    const nameMsg = document.getElementById('name-msg');
    const emailMsg = document.getElementById('email-msg');
    const marksMsg = document.getElementById('marks-msg');
    
    const feeDisplay = document.getElementById('calc-fee');
    const scholarshipDisplay = document.getElementById('calc-sch');
    const submitBtn = document.getElementById('portal-submit-btn');
    const toast = document.getElementById('portal-toast');

    // Setup Event Listeners
    deptSelect.addEventListener('change', calculateFees);
    marksInput.addEventListener('input', calculateFees);
    
    // Real-Time Regex Input validations
    nameInput.addEventListener('input', () => {
        const val = nameInput.value.trim();
        if (val.length === 0) {
            nameMsg.textContent = "";
            nameMsg.className = "validate-msg";
        } else if (val.length < 3) {
            nameMsg.textContent = "Name must be at least 3 letters";
            nameMsg.className = "validate-msg error";
        } else {
            nameMsg.textContent = "Looks good!";
            nameMsg.className = "validate-msg success";
        }
    });

    emailInput.addEventListener('input', () => {
        const val = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (val.length === 0) {
            emailMsg.textContent = "";
            emailMsg.className = "validate-msg";
        } else if (!emailRegex.test(val)) {
            emailMsg.textContent = "Enter a valid email format";
            emailMsg.className = "validate-msg error";
        } else {
            emailMsg.textContent = "Valid email address";
            emailMsg.className = "validate-msg success";
        }
    });

    marksInput.addEventListener('input', () => {
        const val = parseInt(marksInput.value);
        if (isNaN(val)) {
            marksMsg.textContent = "";
            marksMsg.className = "validate-msg";
        } else if (val < 0 || val > 100) {
            marksMsg.textContent = "Marks must be between 0 and 100";
            marksMsg.className = "validate-msg error";
        } else if (val < 50) {
            marksMsg.textContent = "Below SSVPEC cut-off (Min 50%)";
            marksMsg.className = "validate-msg error";
        } else {
            marksMsg.textContent = "Eligible for admission!";
            marksMsg.className = "validate-msg success";
        }
    });

    function calculateFees() {
        const selectedOpt = deptSelect.options[deptSelect.selectedIndex];
        let baseFee = parseInt(selectedOpt.getAttribute('data-fee')) || 80000;
        const marks = parseInt(marksInput.value);

        let scholarshipText = "No Scholarship";
        let scholarshipClass = "status-badge";
        let discount = 0;

        if (!isNaN(marks) && marks >= 50) {
            if (marks >= 95) {
                scholarshipText = "100% Tuition Waiver!";
                scholarshipClass = "status-badge scholarship";
                discount = 1.0;
            } else if (marks >= 90) {
                scholarshipText = "50% Merit Scholarship";
                scholarshipClass = "status-badge scholarship";
                discount = 0.50;
            } else if (marks >= 80) {
                scholarshipText = "25% Merit Scholarship";
                scholarshipClass = "status-badge scholarship";
                discount = 0.25;
            } else if (marks >= 70) {
                scholarshipText = "10% Sports/Tech Waiver";
                scholarshipClass = "status-badge scholarship";
                discount = 0.10;
            }
        }

        const finalFee = baseFee * (1 - discount);
        feeDisplay.textContent = `₹ ${finalFee.toLocaleString('en-IN')} / Year`;
        scholarshipDisplay.textContent = scholarshipText;
        scholarshipDisplay.className = scholarshipClass;
    }

    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Manual validation check before submitting
        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const marksVal = parseInt(marksInput.value);

        if (!nameVal || !emailVal || isNaN(marksVal)) {
            showToast("Please fill in all details.", "error");
            return;
        }

        if (nameVal.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal) || marksVal < 50 || marksVal > 100) {
            showToast("Fix form errors before submitting.", "error");
            return;
        }

        // Successful simulation trigger
        submitBtn.innerHTML = `<span>Processing application...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
        submitBtn.disabled = true;

        setTimeout(() => {
            showToast(`Pre-screen complete! Eligible for ${deptSelect.options[deptSelect.selectedIndex].text}.`, "success");
            submitBtn.innerHTML = `<span>Pre-Screen Submitted</span> <i class="fa-solid fa-circle-check"></i>`;
            
            // Reset state after 4 seconds
            setTimeout(() => {
                form.reset();
                calculateFees();
                nameMsg.textContent = "";
                emailMsg.textContent = "";
                marksMsg.textContent = "";
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<span>Submit Admission Pre-Screen</span> <i class="fa-solid fa-paper-plane"></i>`;
            }, 3000);
        }, 1500);
    });

    function showToast(message, type) {
        toast.textContent = message;
        toast.className = `portal-toast-msg ${type}`;
        
        setTimeout(() => {
            toast.textContent = "";
            toast.className = "portal-toast-msg";
        }, 4000);
    }
}

/* ==========================================================================
   5b. SURVEY DATA NORMALIZER SIMULATOR
   ========================================================================== */
function initInteractiveNormalizer() {
    const btnFill = document.getElementById('btn-fill-missing');
    const btnDrop = document.getElementById('btn-drop-dupes');
    const btnUndo = document.getElementById('btn-undo-norm');
    
    const labelRows = document.getElementById('norm-rows');
    const labelMissing = document.getElementById('norm-missing');
    const labelDupes = document.getElementById('norm-dupes');
    const labelComplete = document.getElementById('norm-complete');
    const auditLogsContainer = document.getElementById('audit-logs');

    if (!btnFill || !btnDrop || !btnUndo) return;

    // Track state states
    const defaultState = { rows: 1240, missing: 14, dupes: 3, complete: 98.2 };
    let currentState = { ...defaultState };
    let actionHistory = []; // stack of states

    function updateUI() {
        labelRows.textContent = currentState.rows.toLocaleString('en-IN');
        labelMissing.textContent = currentState.missing;
        labelDupes.textContent = currentState.dupes;
        labelComplete.textContent = `${currentState.complete}%`;

        // Toggle button classes
        if (currentState.missing === 0) {
            btnFill.classList.add('disabled');
        } else {
            btnFill.classList.remove('disabled');
        }

        if (currentState.dupes === 0) {
            btnDrop.classList.add('disabled');
        } else {
            btnDrop.classList.remove('disabled');
        }

        if (actionHistory.length > 0) {
            btnUndo.classList.remove('disabled');
        } else {
            btnUndo.classList.add('disabled');
        }
    }

    function appendAuditLog(text, isAction = true) {
        const logLine = document.createElement('div');
        logLine.className = isAction ? 'log-line action' : 'log-line';
        logLine.textContent = text;
        auditLogsContainer.appendChild(logLine);
        
        // Auto scroll to bottom
        auditLogsContainer.scrollTop = auditLogsContainer.scrollHeight;
    }

    btnFill.addEventListener('click', () => {
        if (currentState.missing === 0) return;

        // Push state to history
        actionHistory.push({ ...currentState });

        // Transform state
        currentState.missing = 0;
        currentState.complete = 100.0;

        updateUI();
        appendAuditLog('[Clean] Filled 14 missing cells using column median/mode values.');
    });

    btnDrop.addEventListener('click', () => {
        if (currentState.dupes === 0) return;

        // Push state to history
        actionHistory.push({ ...currentState });

        // Transform state
        currentState.rows = currentState.rows - currentState.dupes;
        currentState.dupes = 0;

        updateUI();
        appendAuditLog(`[Clean] Dropped duplicate entries. Row count optimized to ${currentState.rows}.`);
    });

    btnUndo.addEventListener('click', () => {
        if (actionHistory.length === 0) return;

        // Pop last state
        const previousState = actionHistory.pop();
        currentState = { ...previousState };

        updateUI();
        appendAuditLog('[System] Undo last transformation step.');
    });
}

/* ==========================================================================
   6. SCROLL REVEAL ANIMATIONS (IntersectionObserver patterns)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a skill category card, animate the skill bars inside it
                if (entry.target.classList.contains('skill-category')) {
                    const fills = entry.target.querySelectorAll('.skill-indicator-bar .fill');
                    fills.forEach(fill => {
                        const targetWidth = fill.style.width;
                        fill.style.width = '0%';
                        setTimeout(() => {
                            fill.style.width = targetWidth;
                        }, 100);
                    });
                }
                
                // Unobserve once shown to prevent looping
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12
    });

    revealElements.forEach(el => observer.observe(el));

    // Nav Bar Link tracking on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = 'hero';
        const scrollPos = window.scrollY + 120; // offset header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        // Header glassmorphic background scroll toggle
        const header = document.querySelector('.main-header');
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   7. CONTACT FORM & QUICK COPY DETAILS (Clipboard actions)
   ========================================================================== */
function initContactFormAndClipboard() {
    // Toast Feedback popup reference
    const toastPopup = document.getElementById('toast-notification');
    const toastText = document.getElementById('toast-text');

    function triggerToast(message) {
        if (!toastPopup) return;
        toastText.textContent = message;
        toastPopup.classList.add('show');
        setTimeout(() => {
            toastPopup.classList.remove('show');
        }, 2500);
    }

    // Clipboard Copy email
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = document.getElementById('email-address').textContent;
            navigator.clipboard.writeText(email)
                .then(() => triggerToast("Email copied to clipboard!"))
                .catch(() => triggerToast("Failed to copy email"));
        });
    }

    // Clipboard Copy phone
    const copyPhoneBtn = document.getElementById('copy-phone-btn');
    if (copyPhoneBtn) {
        copyPhoneBtn.addEventListener('click', () => {
            const phone = document.getElementById('phone-number').textContent;
            navigator.clipboard.writeText(phone)
                .then(() => triggerToast("Phone number copied to clipboard!"))
                .catch(() => triggerToast("Failed to copy phone number"));
        });
    }

    // Contact Form Submit Placeholder animation
    const contactForm = document.getElementById('contact-form');
    const contactSubmitBtn = document.getElementById('contact-submit-btn');
    const contactToast = document.getElementById('contact-toast');

    if (contactForm && contactSubmitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('c-name').value.trim();
            const email = document.getElementById('c-email').value.trim();
            const message = document.getElementById('c-message').value.trim();

            if (!name || !email || !message) return;

            contactSubmitBtn.innerHTML = `<span>Sending Message...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            contactSubmitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                contactToast.textContent = "Message sent successfully! Aruna will get back to you soon.";
                contactToast.className = "contact-toast-msg success";
                contactSubmitBtn.innerHTML = `<span>Message Sent</span> <i class="fa-solid fa-circle-check"></i>`;
                
                setTimeout(() => {
                    contactForm.reset();
                    contactToast.textContent = "";
                    contactToast.className = "contact-toast-msg";
                    contactSubmitBtn.disabled = false;
                    contactSubmitBtn.innerHTML = `<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>`;
                }, 4000);
            }, 1800);
        });
    }
}

/* ==========================================================================
   8. MOBILE NAVIGATION MENU TOGGLE
   ========================================================================== */
function initMobileNavigation() {
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-link');

    if (!toggleBtn || !navLinksContainer) return;

    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('active');
        navLinksContainer.classList.toggle('mobile-active');
    });

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.classList.remove('active');
            navLinksContainer.classList.remove('mobile-active');
        });
    });
}
