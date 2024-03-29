import '../my-loader/'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      position: absolute;
      display: flex;
      flex-direction: column;
      font-size: 10px;
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
      height: 4em;
      background-color: var(--color-inactive-background);
      box-sizing: border-box;
      padding: 0 1em;
      transition: all 300ms;
      user-select: none; /* supported by Chrome and Opera */
      -webkit-user-select: none; /* Safari */
      -moz-user-select: none; /* Firefox */
      -ms-user-select: none; /* Internet Explorer/Edge */
    }

    #header:hover {
      background-color: var(--color-active-background);
    }

    #title {
      font-family: sans-serif;
      font-size: 1.3em;
      font-weight: 600;
      color: var(--color-text);
    }

    #offline-status {
      margin-left: 10px;
      font-family: sans-serif;
      font-size: 1.3em;
      font-weight: 400;
      font-style: italic;
      color: var(--color-text);
    }

    #content {
      height: 100%;
      background-color: var(--color-inactive-background);
    }

    #close {
      position: relative;
      display: block;
      width: 2em;
      height: 2em;
      top: 8px;
      margin-left: auto;
      cursor: pointer;
      color: var(--color-inactive-text);
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

    .hidden {
      display: none !important;
    }
  </style>
  <div id="header">
    <p id="title">Title</p><span id="offline-status" class="hidden">(offline)</span>
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
     * The p-element to show the title in header.
     *
     * @type {HTMLElement}
     */
    #titleElement

    /**
     * The span-element to signal offline.
     *
     * @type {HTMLElement}
     */
    #offlineStatusElement

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
      this.#titleElement = this.shadowRoot.querySelector('#title')
      this.#offlineStatusElement = this.shadowRoot.querySelector('#offline-status')
      this.#closeWindow = this.shadowRoot.querySelector('#close')

      this.#closeWindow.addEventListener('click', event => {
        event.stopPropagation()
        this.dispatchEvent(new CustomEvent('close-window', {
          bubbles: true
        }))
      })

      this.addEventListener('mousedown', event => {
        event.stopPropagation()
        this.dispatchEvent(new CustomEvent('app-window-focused'))
      })

      this.#header.addEventListener('mousedown', event => {
        this.dispatchEvent(new CustomEvent('app-window-header-mousedown', {
          bubbles: true,
          detail: {
            clientX: event.clientX,
            clientY: event.clientY
          }
        }))
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
     * Attribute-names to observe and react on.
     *
     * @readonly
     * @static
     * @returns {string[]} - Array of attribute-names.
     */
    static get observedAttributes () {
      return ['data-title', 'offline']
    }

    /**
     * React on attribute-changed.
     *
     * @param {string} name - Name of attribute.
     * @param {string} oldVal - Attribute-value before change.
     * @param {string} newVal - Attribute-value after change.
     */
    attributeChangedCallback (name, oldVal, newVal) {
      if (oldVal !== newVal) {
        if (name === 'data-title') {
          this.#titleElement.textContent = newVal
        }

        if (name === 'offline') {
          if (this.hasAttribute('offline')) {
            // Add offline-text to header.
            this.#offlineStatusElement.classList.remove('hidden')
          } else {
            // Remove offline-text from header.
            this.#offlineStatusElement.classList.add('hidden')
          }
        }
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
    dragStart (x, y) {
      this.#initialX = x - this.#xOffset
      this.#initialY = y - this.#yOffset
    }

    /**
     * Stop the dragging-process.
     *
     * @param {number} x - The position of the cursor on x-axis.
     * @param {number} y - The position of the cursor on y-axis.
     */
    dragEnd (x, y) {
      const rect = this.getBoundingClientRect()
      if (rect.x < 0 || (rect.x + rect.width) > window.innerWidth || rect.y < 0 || (rect.y + rect.height) > window.innerHeight) {
        if (rect.x < 0) {
          this.#currentX = 0
        }

        if (rect.x + rect.width > window.innerWidth) {
          this.#currentX = window.innerWidth - rect.width
        }

        if (rect.y < 0) {
          this.#currentY = 0
        }

        if (rect.y + rect.height > window.innerHeight) {
          this.#currentY = window.innerHeight - rect.height > 0 ? window.innerHeight - rect.height : 0
        }
      } else {
        this.#currentX = x - this.#initialX
        this.#currentY = y - this.#initialY
      }

      this.#initialX = this.#currentX
      this.#initialY = this.#currentY
      this.#xOffset = this.#currentX
      this.#yOffset = this.#currentY
      this.#setPosition(this.#currentX, this.#currentY)
    }

    /**
     * Set up the re-position the element based on cursor-position.
     *
     * @param {number} x - The position of the cursor on x-axis.
     * @param {number} y - The position of the cursor on y-axis.
     */
    drag (x, y) {
      this.#currentX = x - this.#initialX
      this.#currentY = y - this.#initialY
      this.#xOffset = this.#currentX
      this.#yOffset = this.#currentY

      this.#setPosition(this.#currentX, this.#currentY)
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
