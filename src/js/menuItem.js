import { menuConfig } from './menuConfig';

/**
 * Class representing the menu item (.menu__item)
 */
 export class MenuItem {
    // DOM elements
    DOM = {
        // Main element (.menu__item)
        el: null,
        // The span.char created by calling Splitting
        chars: null,
        // the element that stores all the vertical letters (.letter-wrap__inner) and that will animate up/down before revealing the menu item tex
        slotMachine: null,
    }
    // The position of this item in the menu
    itemPosition;
    
    /**
     * Constructor.
     * @param {Element} DOM_el - the .menu__item element
     */
    constructor(DOM_el) {
        this.DOM = {el: DOM_el};
        this.DOM.chars = [...this.DOM.el.querySelectorAll('span.char')];
        this.itemPosition = [...this.DOM.el.parentNode.children].indexOf(this.DOM.el);

        // Creates the necessary DOM elements to store all the letters and the extra random letters for the slot machine effect
        this.layout();
    }
    /**
     * This DOM modification will happen for every menu item e.g. <a data-splitting href="#" class="menu__item">ABOUT</a>
     * 
     * The a.menu__item will get transformed into:
     * 
     * <a href="#" class="menu__item">
     *   <span class="letter-wrap">
     *     <span class="letter-wrap__inner">
     *       <span>A</span> // first letter in "ABOUT"
     *       <span>H</span> // random letter
     *       <span>W</span> // random letter
     *       <span>P</span> // random letter
     *       ...            // random letters
     *       <span>P</span> // first letter in "HAPUKU"
     *     </span>
     *   </span>
     *   <span class="letter-wrap"><span>B</span></span>
     *   <span class="letter-wrap"><span>O</span></span>
     *   <span class="letter-wrap"><span>U</span></span>
     *   <span class="letter-wrap"><span>T</span></span>
     * </a>
     */
    layout() {
        // We need slotMachineTotalLetters-2 random letters. 
        // The first span inside the .letter-wrap__inner is the first letter in the original link name 
        // The last span inside the .letter-wrap__inner is the nth letter (this menu item'position) in the menuConfig.displayVerticalTitle 
        const totalRandomChars = menuConfig.slotMachineTotalLetters-2;
        const allChars = 'ABCDEFGHIJKLMNOPRSTUVWXYZ';
        
        this.DOM.chars.forEach((char, charPosition) => {
            const wrapEl = document.createElement('span');
            wrapEl.classList = 'letter-wrap';
            char.parentNode.appendChild(wrapEl);
            wrapEl.appendChild(char);
            
            // First char needs a vertical structure (slot machine)
            if ( charPosition === 0 ) {
                this.DOM.slotMachine = document.createElement('span');
                this.DOM.slotMachine.classList = 'letter-wrap__inner';
                wrapEl.appendChild(this.DOM.slotMachine);
                
                const randomCharsArray = Array.from({ length: totalRandomChars }, _ => allChars.charAt(Math.floor(Math.random() * allChars.length)));
                let htmlStr = `<span>${char.innerHTML}</span>`;
                for (let i = 0; i <= totalRandomChars-1; ++i ) {
                    htmlStr += i === totalRandomChars-1 ? `<span>${randomCharsArray[i]}</span><span>${menuConfig.displayVerticalTitle.charAt(this.itemPosition)}</span>` : `<span>${randomCharsArray[i]}</span>`
                };
                this.DOM.slotMachine.innerHTML = htmlStr;
                wrapEl.removeChild(char);
            }
        });
    }
 }