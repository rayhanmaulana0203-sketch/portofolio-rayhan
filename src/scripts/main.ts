import { StarfieldCanvas } from './canvas';
import {
  initIcons,
  initTypewriter,
  initMobileNav,
  initScrollspy,
  initScrollReveal,
  initCopyEmail,
  initReadMore
} from './ui';

function init(): void {
  initIcons();
  initTypewriter();
  initMobileNav();
  initScrollspy();
  initScrollReveal();
  initCopyEmail();
  initReadMore();

  try {
    const starfield = new StarfieldCanvas({
      canvasId: 'bg-canvas',
      particleCountMobile: 360,
      particleCountDesktop: 780,
      colorA: '#6f9ac4',
      colorB: '#a5c6e8'
    });
    starfield.init();
  } catch (error) {
    console.warn('Background starfield could not be initialized:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
