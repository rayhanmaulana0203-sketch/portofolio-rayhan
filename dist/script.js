
// ==========================================
// 1. INISIALISASI LUCIDE ICONS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// ==========================================
// 2. EFEK MENGETIK OTOMATIS (TYPED.JS)
// ==========================================
if (document.getElementById('typed') && typeof Typed !== 'undefined') {
    new Typed('#typed', {
        strings: [
            'Web Developer.',
            'UI/UX Enthusiast.',
            'Frontend Builder.'
        ],
        typeSpeed: 60,
        backSpeed: 40,
        backDelay: 1500,
        loop: true
    });
}

// ==========================================
// 3. MOBILE MENU TOGGLE
// ==========================================
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden', !isOpen);
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        menuBtn.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.setAttribute('aria-label', 'Buka menu navigasi');
        });
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            mobileMenu.classList.add('hidden');
            menuBtn.setAttribute('aria-expanded', 'false');
            menuBtn.setAttribute('aria-label', 'Buka menu navigasi');
        }
    });
}

// ==========================================
// 4. ANIMASI SCROLL REVEAL (FADE IN)
// ==========================================
const revealSections = document.querySelectorAll('.reveal-section');

const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;

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

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ==========================================
// 5. FITUR SALIN EMAIL
// ==========================================
const copyBtn = document.getElementById('copy-email-btn');
const toast = document.getElementById('toast');
const emailLink = document.getElementById('email-btn');
const myEmail = emailLink?.getAttribute('href')?.replace(/^mailto:/i, '') || '';

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
                if (!copied) throw new Error('Clipboard unavailable');
            }

            if (toast) {
                toast.classList.remove('hidden');
                setTimeout(() => toast.classList.add('hidden'), 2500);
            }
        } catch (error) {
            if (toast) {
                toast.textContent = 'Email tidak dapat disalin di browser ini.';
                toast.classList.remove('hidden');
            }
            console.error('Gagal menyalin email:', error);
        }
    });
}

function toggleReadMore() {
    const moreText = document.getElementById('more-text');
    const btnText = document.getElementById('read-more-text');
    const btnIcon = document.getElementById('read-more-icon');

    if (moreText.classList.contains('hidden')) {
        moreText.classList.remove('hidden');
        btnText.innerText = 'Sembunyikan';
        document.querySelector('[aria-controls="more-text"]')?.setAttribute('aria-expanded', 'true');
        btnIcon.style.transform = 'rotate(180deg)';
    } else {
        moreText.classList.add('hidden');
        btnText.innerText = 'Lanjut baca';
        document.querySelector('[aria-controls="more-text"]')?.setAttribute('aria-expanded', 'false');
        btnIcon.style.transform = 'rotate(0deg)';
    }
}

// ==========================================
// 6. EFEK PARTIKEL BINTANG 3D (THREE.JS)
// ==========================================
function initStarfield() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.8
    });

    const particlesMesh = new THREE.Points(geometry, material);
    scene.add(particlesMesh);
    camera.position.z = 3;

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (event.clientY / window.innerHeight - 0.5) * 0.5;
    });

    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;
        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

document.addEventListener('DOMContentLoaded', initStarfield);

// GSAP: Animasi kemunculan elemen utama saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set('header, #hero-title, .hero-sub', { clearProps: 'all' });
            return;
        }

        gsap.from('header', {
            y: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('#hero-title', {
            y: 40,
            opacity: 0,
            duration: 1.2,
            delay: 0.3,
            ease: 'power3.out'
        });

        gsap.from('.hero-sub', {
            y: 30,
            opacity: 0,
            duration: 1,
            delay: 0.6,
            stagger: 0.2,
            ease: 'power2.out'
        });
    }
});
