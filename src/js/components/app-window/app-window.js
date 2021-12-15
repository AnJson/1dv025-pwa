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
    #active = false
    #currentX
    #currentY
    #initialX
    #initialY
    #xOffset = 0
    #yOffset = 0

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
        this.#dragStart(event)
      })

      this.#header.addEventListener('mouseup', (event) => {
        event.stopPropagation()
        this.#dragEnd()
      })

      this.#header.addEventListener('mousemove', (event) => {
        event.stopPropagation()
        this.#drag(event)
      })
    }

    // ------------------------------------------------
    // I got the inspiration for these dragging-logic below from:
    // https://www.kirupa.com/html5/drag.htm
    // ------------------------------------------------

    #dragStart (event) {
      this.#initialX = event.clientX - this.#xOffset
      this.#initialY = event.clientY - this.#yOffset

      this.#active = true
    }

    #dragEnd () {
      this.#initialX = this.#currentX
      this.#initialY = this.#currentY

      this.#active = false
    }

    #drag (event) {
      if (this.#active) {
        this.#currentX = event.clientX - this.#initialX
        this.#currentY = event.clientY - this.#initialY
        this.#xOffset = this.#currentX
        this.#yOffset = this.#currentY

        this.#setPosition(this.#currentX, this.#currentY)
      }
    }

    #setPosition(xPos, yPos) {
      this.style.left = `${xPos}px`
      this.style.top = `${yPos}px`
    }
    // ------------------------------------------------
    // ------------------------------------------------
  })
