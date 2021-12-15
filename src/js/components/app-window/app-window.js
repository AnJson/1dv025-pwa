const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      font-size: 10px;
      height: 60vh;
      max-width: 80em; 
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

      this.#header.addEventListener('mousedown', (event) => {
        event.stopPropagation()
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
        const rect = this.getBoundingClientRect()

        if (rect.x < 0) {
          this.#currentX = 0
        } else if (rect.x + rect.width > window.innerWidth) {
          this.#currentX = window.innerWidth - rect.width
        } else {
          this.#currentX = event.clientX - this.#initialX
          this.#currentY = event.clientY - this.#initialY
        }

        this.#xOffset = this.#currentX
        this.#yOffset = this.#currentY

        this.#setTranslate(this.#currentX, this.#currentY)
      }
    }

    #setTranslate(xPos, yPos) {
      this.style.transform = `translate3d(${xPos}px, ${yPos}px, 0`
    }
  })
