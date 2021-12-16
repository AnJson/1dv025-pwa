import '../my-loader/'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      position: absolute;
      display: flex;
      flex-direction: column;
      font-size: 10px;
      height: 60vh;
      width: 80em; 
      min-height: 60em;
      box-shadow: 2px 2px 6px rgba(0, 0, 0, .4);
      border-radius: 3px;
      overflow: hidden;
    }

    ::slotted(*) {
      max-width: 100%;
      max-height: 100%;
    }

    slot {
      width: 100%;
      height: 100%;
    }

    #header {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 5em;
      background-color: var(--color-header-inactive-background);
      box-sizing: border-box;
      padding: 0 1em;
      color: var(--color-header-text);
      transition: all 300ms;
    }

    #header:hover {
      background-color: var(--color-header-active-background);
    }

    #content {
      height: 100%;
      background-color: var(--color-header-inactive-background);
    }

    #close {
      position: relative;
      display: block;
      width: 2em;
      height: 2em;
      top: 6px;
      margin-left: auto;
      cursor: pointer;
      color: var(--color-header-inactive-text);
      transition: all 200ms;
    }

    #close:hover {
      color: var(--color-highlight);
    }

    #close::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      height: 3px;
      width: 100%;
      transform: rotate(45deg);
      background-color: currentColor;
    }

    #close::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      height: 3px;
      width: 100%;
      transform: rotate(-45deg);
      background-color: currentColor;
    }
  </style>
  <div id="header">
    <p>Title</p>
    <span id="close"></span>
  </div>
  <div id="content"><slot><my-loader></my-loader></slot></div>
`

customElements.define('app-window',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * The dragging-state of the element.
     *
     * @type {boolean}
     */
    #active = false

    /**
     * The elements current position on x-axis.
     *
     * @type {number}
     */
    #currentX

    /**
     * The elements current position on y-axis.
     *
     * @type {number}
     */
    #currentY

    /**
     * The starting-point to calculate the drag from(the position of cursor when clicking, on x-axis).
     *
     * @type {number}
     */
    #initialX

    /**
     * The starting-point to calculate the drag from(the position of cursor when clicking, on y-axis).
     *
     * @type {number}
     */
    #initialY

    /**
     * The offset(distance) from 0 on x-axis.
     *
     * @type {number}
     */
    #xOffset

    /**
     * The offset(distance) from 0 on y-axis.
     *
     * @type {number}
     */
    #yOffset

    /**
     * The div header div-element.
     *
     * @type {HTMLElement}
     */
    #header

    /**
     * The span-element to close the window.
     *
     * @type {HTMLElement}
     */
    #closeWindow

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#header = this.shadowRoot.querySelector('#header')
      this.#closeWindow = this.shadowRoot.querySelector('#close')

      this.#closeWindow.addEventListener('click', event => {
        event.stopPropagation()
        this.dispatchEvent(new CustomEvent('close-window', {
          bubbles: true
        }))
      })

      this.addEventListener('mousedown', (event) => {
        event.stopPropagation()
        this.dispatchEvent(new CustomEvent('app-window-focused'))
      })

      this.#header.addEventListener('mousedown', (event) => {
        this.#dragStart(event.clientX, event.clientY)
      })

      this.#header.addEventListener('mouseup', (event) => {
        event.stopPropagation()
        this.#dragEnd()
      })

      this.#header.addEventListener('mousemove', (event) => {
        event.stopPropagation()
        this.#drag(event.clientX, event.clientY)
      })
    }

    /**
     * Set x & y position to element if not already set.
     * Set tabindex if not set.
     *
     */
    connectedCallback () {
      if (!this.#xOffset || !this.#yOffset) {
        this.positionWindow()
      }

      if (!this.hasAttribute('tabindex')) {
        this.setAttribute('tabindex', 0)
      }
    }

    /**
     * Position window absolute with x and y coordinates.
     *
     * @param {number} [x=500] - Offset in px from the left on x-axis.
     * @param {number} [y=200] - Offset in px from the left on x-axis.
     */
    positionWindow (x = 10, y = 20) {
      if ((typeof x !== 'number' || !Number.isInteger(x)) || (typeof y !== 'number' || !Number.isInteger(y))) {
        x = 500
        y = 200
      }

      this.#xOffset = x
      this.#yOffset = y
      this.style.left = `${x}px`
      this.style.top = `${y}px`
    }

    // ------------------------------------------------
    // I got the inspiration for these dragging-logic below from:
    // https://www.kirupa.com/html5/drag.htm
    // ------------------------------------------------

    /**
     * Initialize the dragging-process.
     *
     * @param {number} x - The position of the cursor on x-axis.
     * @param {number} y - The position of the cursor on y-axis.
     */
    #dragStart (x, y) {
      this.#initialX = x - this.#xOffset
      this.#initialY = y - this.#yOffset

      this.#active = true
    }

    /**
     * Stop the dragging-process.
     *
     */
    #dragEnd () {
      const rect = this.getBoundingClientRect()
      // Check if window is off-screen to the left or right and if so, push it back in on screen.
      if (rect.x < 0) {
        rect.x = 0
        this.#currentX = 0
        this.#xOffset = this.#currentX
        this.#yOffset = this.#currentY
        this.#setPosition(this.#currentX, this.#currentY)
      } else if (rect.x + rect.width > window.innerWidth) {
        rect.x = window.innerWidth - rect.width
        this.#currentX = window.innerWidth - rect.width
        this.#xOffset = this.#currentX
        this.#yOffset = this.#currentY
        this.#setPosition(this.#currentX, this.#currentY)
      }

      this.#initialX = this.#currentX
      this.#initialY = this.#currentY

      this.#active = false
    }

    /**
     * Set up the re-position the element based on cursor-position.
     *
     * @param {number} x - The position of the cursor on x-axis.
     * @param {number} y - The position of the cursor on y-axis.
     */
    #drag (x, y) {
      if (this.#active) {
        this.#currentX = x - this.#initialX
        this.#currentY = y - this.#initialY
        this.#xOffset = this.#currentX
        this.#yOffset = this.#currentY

        this.#setPosition(this.#currentX, this.#currentY)
      }
    }

    /**
     * Re-position the element based on cursor-position.
     *
     * @param {number} xPos - The position of the cursor on x-axis.
     * @param {number} yPos - The position of the cursor on y-axis.
     */
    #setPosition (xPos, yPos) {
      this.style.left = `${xPos}px`
      this.style.top = `${yPos}px`
    }
    // ------------------------------------------------
    // ------------------------------------------------
  })
