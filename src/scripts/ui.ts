declare const lucide: { createIcons: () => void } | undefined;
declare const Typed: new (selector: string, options: Record<string, unknown>) => unknown;

export function initIcons(): void {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

export function initTypewriter(): void {
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
}

export function initMobileNav(): void {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const mobileLinks = document.querySelectorAll<HTMLElement>('.mobile-link, .mobile-link-contact');

  if (!menuBtn || !mobileMenu) return;

  const toggleMobileMenu = (forceClose = false): void => {
    const isCurrentlyHidden = mobileMenu.classList.contains('hidden');
    const shouldOpen = forceClose ? false : isCurrentlyHidden;

    if (shouldOpen) {
      mobileMenu.classList.remove('hidden');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Tutup menu navigasi');
      document.body.style.overflow = 'hidden';
      menuIcon?.setAttribute('data-lucide', 'x');
    } else {
      mobileMenu.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Buka menu navigasi');
      document.body.style.overflow = '';
      menuIcon?.setAttribute('data-lucide', 'menu');
    }
    initIcons();
  };

  menuBtn.addEventListener('click', (event: MouseEvent) => {
    event.stopPropagation();
    toggleMobileMenu();
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  document.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as Node | null;
    if (
      !mobileMenu.classList.contains('hidden') &&
      target &&
      !mobileMenu.contains(target) &&
      !menuBtn.contains(target)
    ) {
      toggleMobileMenu(true);
    }
  });

  document.addEventListener('keydown', (event: KeyboardEvent) => {
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

export function initScrollspy(): void {
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const navLinks = document.querySelectorAll<HTMLAnchorElement>('.site-nav .nav-link, .mobile-link');

  const updateActiveNav = (): void => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
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
}

export function initScrollReveal(): void {
  const revealSections = document.querySelectorAll<HTMLElement>('.reveal-section');

  const revealOnScroll = (): void => {
    const triggerBottom = window.innerHeight * 0.88;

    revealSections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop < triggerBottom) {
        section.classList.add('opacity-100', 'translate-y-0');
        section.classList.remove('opacity-0', 'translate-y-8');
      }
    });
  };

  revealSections.forEach((section) => {
    section.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
  });

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  revealOnScroll();
}

export function initCopyEmail(): void {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyBtnText = document.getElementById('copy-btn-text');
  const toast = document.getElementById('toast');
  const emailLink = document.getElementById('email-btn');
  const myEmail = emailLink?.getAttribute('href')?.replace(/^mailto:/i, '') || 'rayhanmaulana0203@gmail.com';

  if (!copyBtn) return;

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
      toast?.classList.remove('hidden');

      setTimeout(() => {
        if (copyBtnText) copyBtnText.textContent = 'Salin';
        toast?.classList.add('hidden');
      }, 2500);
    } catch (error) {
      console.error('Gagal menyalin email:', error);
      if (toast) {
        toast.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4 inline-block mr-1 text-red-400"></i><span>Gagal menyalin, silakan gunakan tombol Kirim Email.</span>';
        toast.classList.remove('hidden');
        initIcons();
        setTimeout(() => toast.classList.add('hidden'), 3000);
      }
    }
  });
}

export function initReadMore(): void {
  const moreText = document.getElementById('more-text');
  const btnText = document.getElementById('read-more-text');
  const btnIcon = document.getElementById('read-more-icon');
  const readMoreBtn = document.querySelector<HTMLButtonElement>('[aria-controls="more-text"]');

  const toggle = (): void => {
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
  };

  readMoreBtn?.addEventListener('click', toggle);

  if (typeof window !== 'undefined') {
    (window as unknown as { toggleReadMore: () => void }).toggleReadMore = toggle;
  }
}
