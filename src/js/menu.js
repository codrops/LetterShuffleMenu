import { gsap } from 'gsap';
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from 'splitting';
import { menuConfig } from './menuConfig';
import { MenuItem } from './menuItem';

// initialize Splitting
Splitting();

/**
 * Class representing the menu element (.menu)
 */
 export class Menu {
    // DOM elements
    DOM = {
        // Main element (.menu)
        el: null,
        // Menu items (.menu__item)
        items: null,
        // Menu button control
        menuCtrl: {
            el: null,
            lines: null,
            cross: null
        },
        // (.menu__bg)
        bg: null,
        // (.menu__tagline)
        tagline: null,
    }
    // The Menu Items instances array
    menuItems = [];
    // Checks if the menu is open or is currently animating
    menuStatus = {
        isOpen: false,
        isAnimating: false
    };
    
    /**
     * Constructor.
     * @param {Element} DOM_el - the .menu element
     */
    constructor(DOM_el) {
        this.DOM = {el: DOM_el};
        this.DOM.items = [...this.DOM.el.querySelectorAll('.menu__item')];
        this.DOM.menuCtrl = {el: this.DOM.el.querySelector('.menu__button')};
        this.DOM.menuCtrl.lines = this.DOM.menuCtrl.el.querySelector('path.menu__button-lines')
        this.DOM.menuCtrl.cross = this.DOM.menuCtrl.el.querySelector('path.menu__button-cross')
        this.DOM.bg = this.DOM.el.querySelector('.menu__bg');
        this.DOM.tagline = this.DOM.el.querySelector('.menu__tagline');

        // Create the MenuItem instances
        this.DOM.items.forEach(item => this.menuItems.push(new MenuItem(item)));

        this.initEvents();
    }
    /**
     * Initializes some events.
     */
    initEvents() {
        this.DOM.menuCtrl.el.addEventListener('click', () => {
            if ( this.menuStatus.isAnimating ) return;

            if ( !this.menuStatus.isOpen ) {
                this.open();
            }
            else {
                this.close();
            }
        });
    }
    /**
     * Opens the menu
     */
    open() {
        if ( this.menuStatus.isAnimating || this.menuStatus.isOpen ) return;
        this.menuStatus.isAnimating = true;
        this.menuStatus.isOpen = true;
        
        const gradient = {value: 'linear-gradient(to bottom, #2b192c, #1a191c)'};

        this.menuTimeline = gsap.timeline({
            defaults: {
                duration: 1.7,
                ease: 'expo.inOut'
            },
            onComplete: () => this.menuStatus.isAnimating = false
        })
        .addLabel('start', 0)
        .add(() => {
            this.DOM.el.classList.add('menu--open');
        }, 'start')
        .to(this.DOM.bg, {
            startAt: {x: -1*this.DOM.bg.offsetWidth + .2*window.innerWidth + .11*window.innerHeight},
            x: 0
        }, 'start')
        .to(gradient, {
            value: 'linear-gradient(rgb(68, 37, 61), rgb(29 24 39))',
            //value: 'linear-gradient(to bottom, #9b498a, #9b7749)',
            onUpdate: () => this.DOM.bg.style.backgroundImage = gradient.value
        }, 'start')
        .to(this.DOM.tagline, {
            opacity: 0,
            x: '-50%'
        }, 'start')
        .to(this.DOM.menuCtrl.cross, {
            duration: 0.5,
            ease: 'power2.inOut',
            opacity: 1
        }, 'start')
        .to(this.DOM.menuCtrl.lines, {
            duration: 0.5,
            ease: 'power2.inOut',
            opacity: 0
        }, 'start')
        .to(this.menuItems.map(item => item.DOM.slotMachine), {
            //ease: 'power3.inOut',
            y: `${100/menuConfig.slotMachineTotalLetters*(menuConfig.slotMachineTotalLetters-1)}%`,
            stagger: 0.03
        }, 'start')

        this.menuItems.forEach(item => {
            this.menuTimeline.to(item.DOM.chars, {
                startAt: {x: '100%', rotation: 10, opacity: 1},
                x: '0%',
                opacity: 1,
                rotation: 0,
                stagger: 0.04
            }, 'start');
        });
    }
    /**
     * Closes the menu
     */
    close() {
        if ( this.menuStatus.isAnimating || !this.menuStatus.isOpen ) return;
        this.menuStatus.isAnimating = true;
        this.menuStatus.isOpen = false;

        const gradient = {value: 'linear-gradient(rgb(68, 37, 61), rgb(29 24 39))'};
        
        this.menuTimeline = gsap.timeline({
            defaults: {
                duration: 1.3,
                ease: 'expo.inOut'
            },
            onComplete: () => this.menuStatus.isAnimating = false
        })
        .addLabel('start', 0)
        .add(() => {
            this.DOM.el.classList.remove('menu--open');
        }, 'start')
        .to(this.DOM.menuCtrl.cross, {
            duration: 0.5,
            ease: 'power2.inOut',
            opacity: 0
        }, 'start')
        .to(this.DOM.menuCtrl.lines, {
            duration: 0.5,
            ease: 'power2.inOut',
            opacity: 1
        }, 'start')
        .to(this.menuItems.map(item => item.DOM.slotMachine), {
            duration: 1.5,
            y: '0%',
            stagger: -0.01
        }, 'start')

        this.menuItems.forEach(item => {
            this.menuTimeline.to(item.DOM.chars, {
                x: '100%', 
                rotation: 10, 
                stagger: -0.04
            }, 'start');
        });

        this.menuTimeline
        .to(this.DOM.bg, {
            x: -1*this.DOM.bg.offsetWidth + .2*window.innerWidth + .11*window.innerHeight,
            onComplete: () => {
                this.DOM.bg.style.transform = 'translateX(-100%) translateX(20vw) translateX(11vh)';
            }
        }, 'start+=0.2')
        .to(gradient, {
            value: 'linear-gradient(to bottom, #2b192c, #1a191c)',
            onUpdate: () => this.DOM.bg.style.backgroundImage = gradient.value
        }, 'start+=0.2')
        .to(this.DOM.tagline, {
            opacity: 1,
            x: '0%'
        }, 'start+=0.2')
    }
 }