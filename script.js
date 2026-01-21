/* IHEC Code-Lab - Enhanced Interactions
   Smooth transitions, scroll animations & more
*/

// Initialize AOS
if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 600, once: true });
}

// ===== SECTION REVEAL ON SCROLL =====
const revealSections = () => {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const revealPoint = windowHeight * 0.85;
        
        if (sectionTop < revealPoint) {
            section.classList.add('visible');
        }
    });
};

// Run on scroll with throttle for performance
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) return;
    scrollTimeout = setTimeout(() => {
        revealSections();
        scrollTimeout = null;
    }, 10);
}, { passive: true });

// Initial reveal check
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure CSS is loaded
    setTimeout(revealSections, 100);
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
const updateNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
};
window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (!href || href.length < 2) return;
        
        const target = document.querySelector(href);
        if (!target) return;
        
        e.preventDefault();
        target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    });
});

// ===== ANIMATED COUNTERS =====
const animatedCounters = new Set();

function animateCounter(el) {
    if (animatedCounters.has(el)) return;
    animatedCounters.add(el);
    
    const target = parseInt(el.getAttribute('data-count') || '0');
    const duration = 1500;
    const start = performance.now();
    const from = 0;
    
    const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(from + (target - from) * eased);
        
        el.textContent = current.toLocaleString('fr-FR');
        
        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    };
    
    requestAnimationFrame(tick);
}

// Counter observer
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
});

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.getElementById('scrollTopBtn');

const updateScrollTop = () => {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('show', window.scrollY > 500);
};

window.addEventListener('scroll', updateScrollTop, { passive: true });
updateScrollTop();

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Budget accordion
function toggleBudget(id) {
    const content = document.getElementById(id + '-content');
    const icon = document.getElementById(id + '-icon');
    
    if (content.classList.contains('active')) {
        content.classList.remove('active');
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        // Close all others
        document.querySelectorAll('.budget-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.budget-item i.fa-chevron-up').forEach(i => {
            i.classList.remove('fa-chevron-up');
            i.classList.add('fa-chevron-down');
        });
        
        // Open clicked one
        content.classList.add('active');
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
}

// Comparison Table Accordion
function toggleComparisonTable() {
    const content = document.getElementById('comparison-table-content');
    const icon = document.getElementById('table-icon');
    
    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
}

// Packs Table Accordion (New)
function togglePacksTable() {
    const content = document.getElementById('packs-table-content');
    const icon = document.getElementById('packs-icon');
    
    if (content.style.maxHeight && content.style.maxHeight !== '0px') {
        content.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
    } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    }
}

// Toggle Package Details (New Compact Design)
function togglePkgDetails(pkgId) {
    const detailsPanel = document.getElementById('details-' + pkgId);
    const icon = document.getElementById('icon-' + pkgId);
    const btn = icon.closest('.pkg-expand-btn');
    
    // Check if this panel is already open
    const isOpen = detailsPanel.classList.contains('active');
    
    // Close all panels first
    document.querySelectorAll('.pkg-details').forEach(panel => {
        panel.classList.remove('active');
        panel.style.maxHeight = '0';
    });
    
    // Reset all icons
    document.querySelectorAll('.pkg-expand-btn').forEach(button => {
        button.classList.remove('active');
    });
    
    // If the clicked panel wasn't open, open it
    if (!isOpen) {
        detailsPanel.classList.add('active');
        detailsPanel.style.maxHeight = detailsPanel.scrollHeight + 'px';
        btn.classList.add('active');
    }
}

// Package modal
const packageData = {
    bronze: {
        name: 'Pack Bronze',
        price: '2 000 TND',
        features: [
            { text: 'Logo sur site web officiel', included: true },
            { text: 'Logo sur réseaux sociaux', included: true },
            { text: 'Mention dans les publications officielles', included: true },
            { text: 'Logo sur supports imprimés', included: false },
            { text: 'Logo sur écran LED / scène', included: false },
            { text: 'Mise en place d\'un stand', included: false },
            { text: 'Distribution de goodies', included: false },
            { text: 'Interaction directe avec participants', included: false },
            { text: 'Mot lors des cérémonies', included: false },
            { text: 'Solution dédiée', included: false }
        ]
    },
    silver: {
        name: 'Pack Silver',
        price: '4 000 TND',
        features: [
            { text: 'Logo sur site web officiel', included: true },
            { text: 'Logo sur réseaux sociaux', included: true },
            { text: 'Mention dans les publications officielles', included: true },
            { text: 'Logo sur supports imprimés', included: true },
            { text: 'Logo sur écran LED / scène', included: false },
            { text: 'Mise en place d\'un stand', included: true },
            { text: 'Distribution de goodies', included: true },
            { text: 'Interaction directe avec participants', included: true },
            { text: 'Mot lors des cérémonies', included: false },
            { text: 'Solution dédiée', included: false }
        ]
    },
    gold: {
        name: 'Pack Gold',
        price: '6 000 TND',
        features: [
            { text: 'Logo sur site web officiel', included: true },
            { text: 'Logo sur réseaux sociaux', included: true },
            { text: 'Mention dans les publications officielles', included: true },
            { text: 'Logo sur supports imprimés', included: true },
            { text: 'Logo sur écran LED / scène', included: true },
            { text: 'Mise en place d\'un stand', included: true },
            { text: 'Distribution de goodies', included: true },
            { text: 'Interaction directe avec participants', included: true },
            { text: 'Mot lors des cérémonies', included: true },
            { text: 'Solution dédiée', included: false }
        ]
    },
    exclusive: {
        name: 'Pack Exclusif',
        price: '20 000 TND',
        features: [
            { text: 'Logo sur site web officiel', included: true },
            { text: 'Logo sur réseaux sociaux', included: true },
            { text: 'Mention dans les publications officielles', included: true },
            { text: 'Logo sur supports imprimés', included: true },
            { text: 'Logo sur écran LED / scène', included: true },
            { text: 'Mise en place d\'un stand premium', included: true },
            { text: 'Distribution de goodies', included: true },
            { text: 'Interaction directe avec participants', included: true },
            { text: 'Mot lors des cérémonies', included: true },
            { text: 'Solution dédiée pour le sponsor', included: true }
        ]
    }
};

function openPackageModal(packageId) {
    const pkg = packageData[packageId];
    const modal = document.getElementById('packageModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = pkg.name;
    modalPrice.textContent = pkg.price;

    let featuresHTML = '<h3 style="margin-bottom: 1rem; font-size: 1.3rem;">Avantages inclus</h3><ul style="list-style: none;">';
    pkg.features.forEach(feature => {
        const icon = feature.included ? '<i class="fas fa-check" style="color: #4caf50;"></i>' : '<i class="fas fa-times" style="color: #999;"></i>';
        const textStyle = feature.included ? 'color: var(--dark-gray);' : 'color: #999; opacity: 0.6;';
        featuresHTML += `<li style="padding: 0.75rem 0; border-bottom: 1px solid var(--light-gray); display: flex; align-items: center; gap: 0.75rem; ${textStyle}">${icon} ${feature.text}</li>`;
    });
    featuresHTML += '</ul>';
    featuresHTML += '<a href="#contact" onclick="closePackageModal()" class="btn btn-primary" style="width: 100%; margin-top: 2rem; justify-content: center;">Choisir ce pack</a>';

    modalBody.innerHTML = featuresHTML;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closePackageModal() {
    const modal = document.getElementById('packageModal');
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
}

// Close modal on outside click
document.getElementById('packageModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closePackageModal();
    }
});

// Close modal on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePackageModal();
    }
});

// ===== TOGGLE MORE FEATURES (Vertical Package Cards) =====
function toggleMoreFeatures(pkgId) {
    const moreList = document.getElementById('more-' + pkgId);
    const btn = document.querySelector(`[onclick="toggleMoreFeatures('${pkgId}')"]`);
    
    if (!moreList || !btn) return;
    
    const isActive = moreList.classList.contains('active');
    
    if (isActive) {
        moreList.classList.remove('active');
        btn.classList.remove('active');
        btn.innerHTML = '<span>Voir plus</span> <i class="fas fa-chevron-down"></i>';
    } else {
        moreList.classList.add('active');
        btn.classList.add('active');
        btn.innerHTML = '<span>Voir moins</span> <i class="fas fa-chevron-up"></i>';
    }
}

// Form submission
// ===== Form submission via EmailJS =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Load EmailJS
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js";
    document.body.appendChild(script);

    script.onload = () => {
        emailjs.init('JoFE_i3HTclvNYerV'); // <-- remplace par ta clé publique

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            emailjs.sendForm('service_kyp52bc', 'template_k5tvoch', this)
                .then(() => {
                    alert('Merci pour votre demande ! Nous vous contacterons bientôt.');
                    this.reset();
                }, (error) => {
                    alert('Erreur lors de l’envoi de la demande. Veuillez réessayer.');
                    console.error(error);
                });
        });
    };
}

// ===== PARTICLES.JS NETWORK CONSTELLATION =====
if (typeof particlesJS !== 'undefined') {
    const particlesConfig = {
        particles: {
            number: { 
                value: 80, 
                density: { 
                    enable: true, 
                    value_area: 900 
                } 
            },
            color: { 
                value: ['#ffffff', '#a8b4d4', '#8892b0'] 
            },
            shape: {
                type: 'circle'
            },
            opacity: { 
                value: 0.6, 
                random: true,
                anim: {
                    enable: true,
                    speed: 0.5,
                    opacity_min: 0.2,
                    sync: false
                }
            },
            size: { 
                value: 3, 
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 1,
                    sync: false
                }
            },
            line_linked: { 
                enable: true, 
                distance: 180, 
                color: '#8892b0',
                opacity: 0.3,
                width: 1
            },
            move: { 
                enable: true, 
                speed: 1.2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: { 
                onhover: { 
                    enable: true, 
                    mode: 'grab' 
                }, 
                onclick: { 
                    enable: true, 
                    mode: 'push' 
                },
                resize: true
            },
            modes: { 
                grab: {
                    distance: 200,
                    line_linked: {
                        opacity: 0.6
                    }
                },
                push: { 
                    particles_nb: 4 
                }
            }
        },
        retina_detect: true
    };
    
    // Apply to hero section
    particlesJS('particles-js', particlesConfig);
    
    // Apply to blue sections
    particlesJS('particles-stats', particlesConfig);
    particlesJS('particles-packages', particlesConfig);
    particlesJS('particles-benefits', particlesConfig);
    particlesJS('particles-rse', particlesConfig);
}

// ===== PARALLAX EFFECT ON HERO =====
const hero = document.querySelector('.hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const parallaxElements = hero.querySelectorAll('.hero-badge');
            parallaxElements.forEach((el, index) => {
                const speed = 0.1 + (index * 0.05);
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    }, { passive: true });
}

// ===== TILT EFFECT ON CARDS (subtle) =====
const tiltCards = document.querySelectorAll('.about-card, .benefit-card, .pkg-card-vertical');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== MAGNETIC BUTTON EFFECT =====
const magneticBtns = document.querySelectorAll('.btn-primary, .btn-sponsor');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

console.log('🚀 IHEC Code-Lab interactions loaded!');