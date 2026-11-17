declare const lucide: { createIcons: () => void } | undefined;
declare const Typed: new (selector: string, options: Record<string, unknown>) => unknown;

export function initIcons(): void {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

export function initTypewriter(): void {
  const typedElement = document.getElementById('typed');

  if (!typedElement) return;

  if (typeof Typed === 'undefined') {
    typedElement.textContent = 'Web Developer.';
    return;
  }

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
    let activeSectionId: string | null = null;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (sectionId && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        activeSectionId = sectionId;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const isActive = href === `#${activeSectionId}`;
      link.classList.toggle('active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
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

let lastToggleTime = 0;

export function toggleReadMore(event?: Event): void {
  if (event) {
    if (typeof event.preventDefault === 'function') event.preventDefault();
    if (typeof event.stopPropagation === 'function') event.stopPropagation();
  }

  const now = Date.now();
  if (now - lastToggleTime < 200) return;
  lastToggleTime = now;

  const moreText = document.getElementById('more-text');
  if (!moreText) return;

  const readMoreBtn = document.getElementById('read-more-btn') || document.querySelector<HTMLButtonElement>('[aria-controls="more-text"]');
  const btnText = document.getElementById('read-more-text') || (readMoreBtn ? readMoreBtn.querySelector<HTMLElement>('span') : null);
  const btnIcon = document.getElementById('read-more-icon') || (readMoreBtn ? readMoreBtn.querySelector<HTMLElement>('svg, i, [data-lucide]') : null);

  const isHidden = moreText.classList.contains('hidden') ||
                   moreText.style.display === 'none' ||
                   (window.getComputedStyle ? window.getComputedStyle(moreText).display === 'none' : false);

  if (isHidden) {
    moreText.classList.remove('hidden');
    moreText.style.display = 'block';
    if (readMoreBtn) readMoreBtn.setAttribute('aria-expanded', 'true');
    if (btnText) btnText.textContent = 'Sembunyikan';
    if (btnIcon) {
      btnIcon.style.transform = 'rotate(180deg)';
      btnIcon.style.transition = 'transform 0.3s ease';
    }
  } else {
    moreText.classList.add('hidden');
    moreText.style.display = 'none';
    if (readMoreBtn) readMoreBtn.setAttribute('aria-expanded', 'false');
    if (btnText) btnText.textContent = 'Lanjut baca';
    if (btnIcon) {
      btnIcon.style.transform = 'rotate(0deg)';
      btnIcon.style.transition = 'transform 0.3s ease';
    }
  }
}

if (typeof window !== 'undefined') {
  (window as unknown as { toggleReadMore: (e?: Event) => void }).toggleReadMore = toggleReadMore;
}

export function initReadMore(): void {
  const readMoreBtn = document.getElementById('read-more-btn') || document.querySelector<HTMLButtonElement>('[aria-controls="more-text"]');
  if (readMoreBtn && !readMoreBtn.dataset.bound) {
    readMoreBtn.dataset.bound = 'true';
    readMoreBtn.addEventListener('click', (e) => {
      toggleReadMore(e);
    });
  }

  if (typeof window !== 'undefined') {
    (window as unknown as { toggleReadMore: (e?: Event) => void }).toggleReadMore = toggleReadMore;
  }
}

export function initTimelineSlider(): void {
  const slider = document.getElementById('timeline-slider');
  const prevBtn = document.getElementById('timeline-prev') as HTMLButtonElement | null;
  const nextBtn = document.getElementById('timeline-next') as HTMLButtonElement | null;
  const dotsContainer = document.getElementById('timeline-dots');

  if (!slider) return;

  const cards = Array.from(slider.querySelectorAll<HTMLElement>('.timeline-card'));
  if (cards.length === 0) return;

  const dots: HTMLButtonElement[] = [];
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Lihat riwayat ke-${idx + 1}`);
      dot.setAttribute('type', 'button');
      dot.addEventListener('click', () => {
        const targetCard = cards[idx];
        if (targetCard) {
          slider.scrollTo({
            left: targetCard.offsetLeft - slider.offsetLeft,
            behavior: 'smooth'
          });
        }
      });
      dotsContainer.appendChild(dot);
      dots.push(dot);
    });
  }

  const updateControls = () => {
    const scrollLeft = slider.scrollLeft;
    const maxScroll = slider.scrollWidth - slider.clientWidth - 4;

    if (prevBtn) {
      prevBtn.disabled = scrollLeft <= 4;
    }
    if (nextBtn) {
      nextBtn.disabled = scrollLeft >= maxScroll;
    }

    if (dots.length > 0) {
      let activeIndex = 0;
      let minDiff = Infinity;
      cards.forEach((card, idx) => {
        const diff = Math.abs((card.offsetLeft - slider.offsetLeft) - scrollLeft);
        if (diff < minDiff) {
          minDiff = diff;
          activeIndex = idx;
        }
      });
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
        dot.setAttribute('aria-current', idx === activeIndex ? 'true' : 'false');
      });
    }
  };

  const getScrollStep = () => {
    const firstCard = cards[0];
    if (firstCard) {
      return firstCard.offsetWidth + 20;
    }
    return 360;
  };

  prevBtn?.addEventListener('click', () => {
    slider.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
  });

  nextBtn?.addEventListener('click', () => {
    slider.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
  });

  slider.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateControls);
  }, { passive: true });

  let isDown = false;
  let startX = 0;
  let scrollLeftStart = 0;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('is-dragging');
    startX = e.pageX - slider.offsetLeft;
    scrollLeftStart = slider.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      slider.classList.remove('is-dragging');
    }
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.4;
    slider.scrollLeft = scrollLeftStart - walk;
  });

  slider.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      slider.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      slider.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    }
  });

  window.addEventListener('resize', updateControls, { passive: true });
  updateControls();
}
