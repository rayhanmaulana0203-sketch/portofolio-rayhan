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
    particleCountMobile: 650,
    particleCountDesktop: 1400,
    colorA: '#b4e648',
    colorB: '#38bdf8'
  });
  starfield.init();
});
