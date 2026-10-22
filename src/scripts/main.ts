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

document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  initTypewriter();
  initMobileNav();
  initScrollspy();
  initScrollReveal();
  initCopyEmail();
  initReadMore();

  const starfield = new StarfieldCanvas({
    canvasId: 'bg-canvas',
    particleCountMobile: 360,
    particleCountDesktop: 780,
    colorA: '#6f9ac4',
    colorB: '#a5c6e8'
  });
  starfield.init();
});
