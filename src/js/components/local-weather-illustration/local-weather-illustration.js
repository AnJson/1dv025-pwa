import { Sun } from './lib/Sun.js'

const template = document.createElement('template')

template.innerHTML = `
  <style>
    :host {
      display: block;
      width: 100%;
      font-size: 10px;
    }

    #canvas {
      width: 100%;
      height: 250px;
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
  </style>
  <canvas id="canvas" height="200px"></canvas>
`

customElements.define('local-weather-illustration',
  /**
   * Class to define custom element.
   *
   */
  class extends HTMLElement {
    /**
     * The canvas-element.
     *
     * @type {HTMLElement}
     */
    #canvas

    /**
     * The context-object.
     *
     * @type {object}
     */
    #ctx

    /**
     * A collection of elements in the canvas.
     *
     * @type {object}
     */
    #elements = {
      sun: new Sun(10, 0.3, 20, -40, 60, 4, 3, 0, 0.1)
    }

    /**
     * An array of elements currently on display in canvas.
     *
     * @type {object[]}
     */
    #elementsOnDisplay = [this.#elements.sun]

    /**
     * Create instance of class and attach open shadow-dom.
     *
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })
        .appendChild(template.content.cloneNode(true))

      this.#canvas = this.shadowRoot.querySelector('#canvas')
      this.#ctx = this.#canvas.getContext('2d')
    }

    /* connectedCallback () {
      this.#paintCanvas()
      this.moveInElement(this.#elements.sun)
    } */

    /**
     * Attribute-names to observe and react on.
     *
     * @readonly
     * @static
     * @returns {string[]} - Array of attribute-names.
     */
    static get observedAttributes () {
      return ['data-symbol']
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
        if (name === 'data-symbol') {
          this.#showWeather(newVal)
        }
      }
    }

    /**
     * Clear canvas from illustrations not needed to illustrate the new symbol, then bring in the illustrations needed.
     *
     * @param {string} symbol - Weather-symbol to illustrate.
     */
    #showWeather (symbol) {
      const newSymbolSet = []

      if (symbol === 'clear-sky') {
        newSymbolSet.push(this.#elements.sun)
      }
      // Compare newSymbolSet with elements on display, remove and add.

      this.#paintCanvas()
      this.moveInElement(this.#elements.sun)
    }

    // TODO: Testing the animation. Remove this.
    async moveInElement (el) {
      await el.moveIn(this.#canvas)
    }

    /**
     * Paint all elements in elementsOnDisplay-field on the canvas as long as there is any.
     *
     */
    #paintCanvas () {
      this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height)

      for (const element of this.#elementsOnDisplay) {
        element.drawAnimation(this.#ctx)
      }

      if (this.#elementsOnDisplay.length) {
        requestAnimationFrame(this.#paintCanvas.bind(this))
      }
    }
  })
