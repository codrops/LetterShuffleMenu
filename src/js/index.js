import { preloadFonts } from './utils';
import { Menu } from './menu';

// Initialize Menu instance
new Menu(document.querySelector('.menu'));
// Preloading webkit font
preloadFonts('zhn4ifz').then(() => document.body.classList.remove('loading'));