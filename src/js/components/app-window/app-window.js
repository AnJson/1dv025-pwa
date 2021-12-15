const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: column;
      font-size: 10px;
      height: 60vh;
      width: 80em; 
      min-height: 60em;
    }

    #header {
      height: 5em;
      background-color: red;
    }

    #content {
      height: 100%;
      background-color: yellow;
    }
  </style>
  <div id="header"></div>
  <div id="content"></div>
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
    #xOffset = 0

    /**
     * The offset(distance) from 0 on y-axis.
     *
     * @type {number}
     */
    #yOffset = 0

    /**
     * The div header div-element.
     *
     * @type {HTMLElement}
     */
    #header

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#header = this.shadowRoot.querySelector('#header')

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
