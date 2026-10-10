// ==========================================================================
// PORTOFOLIO MUHAMAD RAYHAN MAULANA - SCRIPT.JS
// Interactive Features, Smooth Animations, and Responsive Controls
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. LUCIDE ICONS INITIALIZATION
    // ----------------------------------------------------------------------
    const refreshIcons = () => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };
    refreshIcons();

    // ----------------------------------------------------------------------
    // 2. TYPED.JS AUTO-TYPING EFFECT
    // ----------------------------------------------------------------------
    const typedElement = document.getElementById('typed');
    if (typedElement && typeof Typed !== 'undefined') {
        new Typed('#typed', {
            strings: [
                'Web Developer.',
                'UI/UX Enthusiast.',
                'Frontend Builder.'
            ],
            typeSpeed: 60,
            backSpeed: 35,
            backDelay: 1600,
            loop: true
        });
    }

    // ----------------------------------------------------------------------
    // 3. MOBILE MENU INTERACTION
    // ----------------------------------------------------------------------
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-link-contact');

    const toggleMobileMenu = (forceClose = false) => {
        if (!mobileMenu || !menuBtn) return;

        const isCurrentlyHidden = mobileMenu.classList.contains('hidden');
        const shouldOpen = forceClose ? false : isCurrentlyHidden;

        if (shouldOpen) {
            mobileMenu.classList.remove('hidden');
            menuBtn.setAttribute('aria-expanded', 'true');
            menuBtn.setAttribute('aria-label', 'Tutup menu navigasi');
            document.body.style.overflow = 'hidden';
            if (menuIcon) menuIcon.setAttribute('data-lucide', 'x');
        } else {
            mobileMenu.classList.add('hidden');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.setAttribute('aria-label', 'Buka menu navigasi');
            document.body.style.overflow = '';
            if (menuIcon) menuIcon.setAttribute('data-lucide', 'menu');
        }
        refreshIcons();
    };

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggleMobileMenu(true);
            });
        });

        document.addEventListener('click', (event) => {
            if (!mobileMenu.classList.contains('hidden') && 
                !mobileMenu.contains(event.target) && 
                !menuBtn.contains(event.target)) {
                toggleMobileMenu(true);
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu(true);
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu(true);
            }
        });
    }

    // ----------------------------------------------------------------------
    // 4. SCROLLSPY (ACTIVE NAV LINK HIGHLIGHT)
    // ----------------------------------------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.site-nav .nav-link, .mobile-link');

    const updateActiveNav = () => {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${sectionId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ----------------------------------------------------------------------
    // 5. SCROLL REVEAL ANIMATIONS
    // ----------------------------------------------------------------------
    const revealSections = document.querySelectorAll('.reveal-section');

    const revealOnScroll = () => {
        const triggerBottom = window.innerHeight * 0.88;

        revealSections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < triggerBottom) {
                section.classList.add('opacity-100', 'translate-y-0');
                section.classList.remove('opacity-0', 'translate-y-8');
            }
        });
    };

    revealSections.forEach(section => {
        section.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
    });

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    revealOnScroll();

    // ----------------------------------------------------------------------
    // 6. COPY EMAIL FEATURE
    // ----------------------------------------------------------------------
    const copyBtn = document.getElementById('copy-email-btn');
    const copyBtnText = document.getElementById('copy-btn-text');
    const toast = document.getElementById('toast');
    const emailLink = document.getElementById('email-btn');
    const myEmail = emailLink?.getAttribute('href')?.replace(/^mailto:/i, '') || 'rayhanmaulana0203@gmail.com';

    if (copyBtn && myEmail) {
        copyBtn.addEventListener('click', async () => {
            try {
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(myEmail);
                } else {
                    const temporaryInput = document.createElement('textarea');
                    temporaryInput.value = myEmail;
                    temporaryInput.setAttribute('readonly', '');
                    temporaryInput.style.position = 'fixed';
                    temporaryInput.style.opacity = '0';
                    document.body.appendChild(temporaryInput);
                    temporaryInput.select();
                    const copied = document.execCommand('copy');
                    temporaryInput.remove();
                    if (!copied) throw new Error('Clipboard fallback failed');
                }

                if (copyBtnText) copyBtnText.textContent = 'Tersalin!';
                if (toast) {
                    toast.classList.remove('hidden');
                }

                setTimeout(() => {
                    if (copyBtnText) copyBtnText.textContent = 'Salin';
                    if (toast) toast.classList.add('hidden');
                }, 2500);
            } catch (error) {
                console.error('Gagal menyalin email:', error);
                if (toast) {
                    toast.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 inline-block mr-1 text-red-400"></i><span>Gagal menyalin, silakan gunakan tombol Kirim Email.</span>';
                    toast.classList.remove('hidden');
                    refreshIcons();
                    setTimeout(() => toast.classList.add('hidden'), 3000);
                }
            }
        });
    }

    // ----------------------------------------------------------------------
    // 7. THREE.JS 3D STARFIELD BACKGROUND
    // ----------------------------------------------------------------------
    const initStarfield = () => {
        const canvas = document.getElementById('bg-canvas');
        if (!canvas || typeof THREE === 'undefined') return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            canvas.style.display = 'none';
            return;
        }

        const isMobile = window.innerWidth < 768;
        const particlesCount = isMobile ? 650 : 1500;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const positions = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 10;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const material = new THREE.PointsMaterial({
            size: isMobile ? 0.018 : 0.015,
            color: 0x93c5fd,
            transparent: true,
            opacity: 0.75
        });

        const particlesMesh = new THREE.Points(geometry, material);
        scene.add(particlesMesh);
        camera.position.z = 3;

        let mouseX = 0;
        let mouseY = 0;

        if (!isMobile) {
            window.addEventListener('mousemove', (event) => {
                mouseX = (event.clientX / window.innerWidth - 0.5) * 0.4;
                mouseY = (event.clientY / window.innerHeight - 0.5) * 0.4;
            }, { passive: true });
        }

        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            particlesMesh.rotation.y += 0.0008;
            particlesMesh.rotation.x += 0.0004;

            camera.position.x += (mouseX - camera.position.x) * 0.04;
            camera.position.y += (-mouseY - camera.position.y) * 0.04;

            renderer.render(scene, camera);
        };
        animate();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            }, 150);
        }, { passive: true });
    };

    initStarfield();

    // ----------------------------------------------------------------------
    // 8. GSAP INITIAL LOAD ANIMATIONS
    // ----------------------------------------------------------------------
    if (typeof gsap !== 'undefined') {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set('header, #hero-title, .hero-sub, .hero-desc, .hero-actions', { clearProps: 'all' });
        } else {
            gsap.from('.site-header', {
                y: -40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            });

            gsap.from('#hero-title', {
                y: 35,
                opacity: 0,
                duration: 1,
                delay: 0.2,
                ease: 'power3.out'
            });

            gsap.from('.hero-sub', {
                y: 25,
                opacity: 0,
                duration: 0.9,
                delay: 0.4,
                ease: 'power2.out'
            });

            gsap.from('.hero-desc, .hero-actions, .hero-social', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                delay: 0.6,
                ease: 'power2.out'
            });
        }
    }
});

// --------------------------------------------------------------------------
// 9. READ MORE TOGGLE FUNCTION (GLOBAL)
// --------------------------------------------------------------------------
function toggleReadMore() {
    const moreText = document.getElementById('more-text');
    const btnText = document.getElementById('read-more-text');
    const btnIcon = document.getElementById('read-more-icon');
    const readMoreBtn = document.querySelector('[aria-controls="more-text"]');

    if (!moreText || !btnText || !btnIcon) return;

    if (moreText.classList.contains('hidden')) {
        moreText.classList.remove('hidden');
        btnText.innerText = 'Sembunyikan';
        readMoreBtn?.setAttribute('aria-expanded', 'true');
        btnIcon.style.transform = 'rotate(180deg)';
    } else {
        moreText.classList.add('hidden');
        btnText.innerText = 'Lanjut baca';
        readMoreBtn?.setAttribute('aria-expanded', 'false');
        btnIcon.style.transform = 'rotate(0deg)';
    }
}
